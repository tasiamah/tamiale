import "server-only";

import { cacheLife, cacheTag } from "next/cache";

import { findFrame, frames as editorialFrames } from "@/lib/catalog/frames";
import type { CurrencyCode, Frame } from "@/lib/catalog/types";

import { isShopifyConfigured, storefront } from "./client";
import { PRODUCT_BY_HANDLE } from "./queries";

type ShopifyVariant = {
  id: string;
  sku: string | null;
  availableForSale: boolean;
  quantityAvailable: number | null;
  currentlyNotInStock: boolean;
  selectedOptions: { name: string; value: string }[];
  price: { amount: string; currencyCode: string };
  sellingPlanAllocations: {
    nodes: { sellingPlan: { id: string; name: string } }[];
  };
};

type ShopifyProduct = {
  id: string;
  handle: string;
  availableForSale: boolean;
  priceRange: { minVariantPrice: { amount: string; currencyCode: string } };
  variants: { nodes: ShopifyVariant[] };
};

/** The Shopify option that carries the lens expression. */
const LENS_OPTION = "Lens";

function variantForColorway(
  product: ShopifyProduct,
  colorwayName: string,
): ShopifyVariant | undefined {
  return product.variants.nodes.find((variant) =>
    variant.selectedOptions.some(
      (option) =>
        option.name.toLowerCase() === LENS_OPTION.toLowerCase() &&
        option.value.toLowerCase() === colorwayName.toLowerCase(),
    ),
  );
}

/**
 * Overlays live commerce data onto the editorial frame. Anything Shopify does
 * not know about, such as story, measurements and lens physics, is untouched.
 */
function mergeCommerce(frame: Frame, product: ShopifyProduct): Frame {
  const minPrice = product.priceRange.minVariantPrice;
  const currency = minPrice.currencyCode as CurrencyCode;
  const amount = Number(minPrice.amount);

  return {
    ...frame,
    shopifyProductId: product.id,
    price: { amount, currencyCode: currency },
    // Shopify is authoritative for the market it was queried in; the
    // remaining markets keep their published figures until queried.
    priceBook: { ...frame.priceBook, [currency]: amount },
    colorways: frame.colorways.map((colorway) => {
      const variant = variantForColorway(product, colorway.name);
      if (!variant) return { ...colorway, availableForSale: false };

      return {
        ...colorway,
        variantId: variant.id,
        sku: variant.sku ?? colorway.sku,
        // A pre-order sells through `continue selling when out of stock`, so
        // `availableForSale` is the signal, not the on-hand quantity.
        availableForSale: variant.availableForSale,
        // Null when the shop does not track inventory for the variant, which
        // must read as "unknown" rather than as "none left".
        remaining: variant.quantityAvailable ?? undefined,
        sellingPlanId:
          variant.sellingPlanAllocations.nodes[0]?.sellingPlan.id ??
          colorway.sellingPlanId,
      };
    }),
  };
}

async function fetchFrame(handle: string): Promise<Frame | undefined> {
  const editorial = findFrame(handle);
  if (!editorial) return undefined;
  if (!isShopifyConfigured()) return editorial;

  try {
    const data = await storefront<{ product: ShopifyProduct | null }>(
      PRODUCT_BY_HANDLE,
      { handle },
      { tags: ["catalog", `product:${handle}`] },
    );
    return data.product ? mergeCommerce(editorial, data.product) : editorial;
  } catch (error) {
    // A storefront outage must never take the shop window down with it.
    console.error(`[tamiale] falling back to editorial catalog:`, error);
    return editorial;
  }
}

export async function getFrame(handle: string): Promise<Frame | undefined> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog", `product:${handle}`);
  return fetchFrame(handle);
}

export async function getFrames(): Promise<Frame[]> {
  "use cache";
  cacheLife("minutes");
  cacheTag("catalog");

  const resolved = await Promise.all(
    editorialFrames.map((frame) => fetchFrame(frame.handle)),
  );
  return resolved.filter((frame): frame is Frame => Boolean(frame));
}
