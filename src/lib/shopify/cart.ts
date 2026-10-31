"use server";

import { findColorway } from "@/lib/catalog/frames";

import { isShopifyConfigured, storefront } from "./client";
import { getFrame } from "./catalog";
import { CART_CREATE } from "./queries";

export type CheckoutLine = {
  handle: string;
  colorwayId: string;
  quantity: number;
};

export type CheckoutResult =
  | { ok: true; url: string }
  | {
      ok: false;
      reason: "not-configured" | "unavailable" | "error";
      message: string;
    };

type CartCreateResponse = {
  cartCreate: {
    cart: { id: string; checkoutUrl: string } | null;
    userErrors: { field: string[] | null; message: string }[];
  };
};

const MAX_UNITS_PER_LINE = 4;

/**
 * Builds a Shopify cart from handles and lens names rather than from variant
 * identifiers supplied by the browser, so a tampered bag cannot check out a
 * line the house never published.
 */
export async function startCheckout(
  lines: CheckoutLine[],
  countryCode?: string,
): Promise<CheckoutResult> {
  if (!isShopifyConfigured()) {
    return {
      ok: false,
      reason: "not-configured",
      message:
        "Checkout opens when the Tamiale storefront is connected. Your bag has been kept.",
    };
  }
  if (lines.length === 0) {
    return { ok: false, reason: "unavailable", message: "Your bag is empty." };
  }

  const resolved: { merchandiseId: string; quantity: number; sellingPlanId?: string }[] =
    [];

  for (const line of lines) {
    const frame = await getFrame(line.handle);
    if (!frame) {
      return {
        ok: false,
        reason: "unavailable",
        message: "One of the frames in your bag is no longer published.",
      };
    }

    const colorway = findColorway(frame, line.colorwayId);
    if (!colorway.variantId || !colorway.availableForSale) {
      return {
        ok: false,
        reason: "unavailable",
        message: `${frame.name} in ${colorway.name} is no longer available for pre-order.`,
      };
    }

    resolved.push({
      merchandiseId: colorway.variantId,
      quantity: Math.min(
        MAX_UNITS_PER_LINE,
        Math.max(1, Math.trunc(line.quantity)),
      ),
      ...(colorway.sellingPlanId
        ? { sellingPlanId: colorway.sellingPlanId }
        : {}),
    });
  }

  try {
    const data = await storefront<CartCreateResponse>(
      CART_CREATE,
      {
        input: { lines: resolved },
        ...(countryCode ? { country: countryCode } : {}),
      },
      { cache: "no-store" },
    );

    const { cart, userErrors } = data.cartCreate;
    if (!cart) {
      return {
        ok: false,
        reason: "error",
        message:
          userErrors[0]?.message ?? "The bag could not be opened. Please retry.",
      };
    }
    return { ok: true, url: cart.checkoutUrl };
  } catch (error) {
    console.error("[tamiale] cartCreate failed:", error);
    return {
      ok: false,
      reason: "error",
      message: "We could not reach checkout. Please try again in a moment.",
    };
  }
}
