"use server";

import { request as httpsRequest } from "node:https";
import { randomUUID } from "node:crypto";

import { findColorway } from "@/lib/catalog/frames";
import { site } from "@/lib/site";

import { storefront } from "./client";
import { applePay, isApplePayConfigured } from "./apple-pay-config";
import { getFrame } from "./catalog";
import {
  CART_CREATE,
  CART_DELIVERY_ADDRESS,
  CART_PAYMENT_UPDATE,
  CART_PREPARE_FOR_COMPLETION,
  CART_SELECT_DELIVERY,
  CART_SUBMIT_FOR_COMPLETION,
} from "./queries";
import type { CheckoutLine } from "./cart";

/*
 * Apple Pay placed against the Storefront cart, which puts the order through
 * without ever loading Shopify's checkout. Shopify's own iOS kit drives the
 * same four mutations; they are GraphQL over HTTP, so a browser holding a
 * payment token can make them too.
 *
 * Three separate things have to be true before any of this runs, and they
 * are granted by three different parties:
 *
 *   - a Storefront token carrying `write_cart_wallet_payments`, which is a
 *     gated scope and has to be requested from Shopify;
 *   - an Apple merchant identifier with a payment processing certificate;
 *   - the domain association file served from this origin, which is what
 *     `src/app/.well-known/...` is for.
 *
 * Every entry point below answers `not-configured` until all three exist, so
 * the button never appears half-wired.
 */

export type ApplePayAddress = {
  firstName?: string;
  lastName?: string;
  address1?: string;
  address2?: string;
  city?: string;
  province?: string;
  country?: string;
  zip?: string;
  phone?: string;
};

/** The token Apple hands back from `onpaymentauthorized`. */
export type ApplePayToken = {
  data: string;
  signature: string;
  version: string;
  header: {
    ephemeralPublicKey: string;
    publicKeyHash: string;
    transactionId: string;
    applicationData?: string;
  };
  lastDigits?: string;
};

export type WalletResult =
  | { ok: true; redirectUrl: string }
  | {
      ok: false;
      reason: "not-configured" | "unavailable" | "error";
      message: string;
    };

const NOT_CONFIGURED = {
  ok: false,
  reason: "not-configured",
  message: "Apple Pay is not connected yet.",
} as const;

/**
 * Apple will not raise its sheet until it has been told, by Apple, that this
 * domain is allowed to ask. The merchant certificate proves that, and it is
 * presented as a client certificate, which `fetch` has no way to attach.
 */
export async function validateApplePayMerchant(
  validationURL: string,
): Promise<{ ok: true; session: unknown } | { ok: false; message: string }> {
  if (!isApplePayConfigured()) {
    return { ok: false, message: NOT_CONFIGURED.message };
  }

  // Apple only ever validates against its own hosts.
  let host: string;
  try {
    host = new URL(validationURL).hostname;
  } catch {
    return { ok: false, message: "Malformed validation URL." };
  }
  if (!/(^|\.)apple\.com$/.test(host)) {
    return { ok: false, message: "Validation URL is not an Apple host." };
  }

  const body = JSON.stringify({
    merchantIdentifier: applePay.merchantId,
    displayName: site.name,
    initiative: "web",
    initiativeContext: new URL(site.url).hostname,
  });

  return new Promise((resolve) => {
    const req = httpsRequest(
      validationURL,
      {
        method: "POST",
        cert: applePay.identityCert,
        key: applePay.identityKey,
        headers: {
          "content-type": "application/json",
          "content-length": Buffer.byteLength(body),
        },
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve({ ok: true, session: JSON.parse(raw) });
          } catch {
            resolve({
              ok: false,
              message: "Apple returned an unreadable session.",
            });
          }
        });
      },
    );
    req.on("error", () =>
      resolve({ ok: false, message: "Could not reach Apple." }),
    );
    req.write(body);
    req.end();
  });
}

type CartShape = {
  id: string;
  cost: { totalAmount: { amount: string; currencyCode: string } };
  deliveryGroups?: {
    edges: { node: { id: string; deliveryOptions: { handle: string }[] } }[];
  };
};

/**
 * Builds the cart from handles and lens names rather than from identifiers
 * supplied by the browser, exactly as `startCheckout` does, so a tampered
 * payload cannot buy a line the house never published. The amount charged is
 * the one Shopify computes, never the one the client reports.
 */
export async function completeApplePayOrder(input: {
  lines: CheckoutLine[];
  countryCode?: string;
  email?: string;
  shipping: ApplePayAddress;
  billing: ApplePayAddress;
  token: ApplePayToken;
}): Promise<WalletResult> {
  if (!isApplePayConfigured()) return NOT_CONFIGURED;
  if (input.lines.length === 0) {
    return { ok: false, reason: "unavailable", message: "Your bag is empty." };
  }

  try {
    const merchandise: { merchandiseId: string; quantity: number }[] = [];
    for (const line of input.lines) {
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
          message: `${frame.name} in ${colorway.name} is no longer available.`,
        };
      }
      merchandise.push({
        merchandiseId: colorway.variantId,
        quantity: Math.min(4, Math.max(1, Math.trunc(line.quantity))),
      });
    }

    const created = await storefront<{
      cartCreate: {
        cart: { id: string } | null;
        userErrors: { message: string }[];
      };
    }>(
      CART_CREATE,
      {
        input: { lines: merchandise },
        ...(input.countryCode ? { country: input.countryCode } : {}),
      },
      { cache: "no-store" },
    );
    const cartId = created.cartCreate.cart?.id;
    if (!cartId) {
      return {
        ok: false,
        reason: "error",
        message:
          created.cartCreate.userErrors[0]?.message ?? "Could not open a cart.",
      };
    }

    // Where it ships decides both the tax and the rate, so the address has to
    // land before there is a total worth charging.
    const addressed = await storefront<{
      cartBuyerIdentityUpdate: {
        cart: CartShape | null;
        userErrors: { message: string }[];
      };
    }>(
      CART_DELIVERY_ADDRESS,
      { cartId, address: input.shipping, email: input.email ?? null },
      { cache: "no-store" },
    );
    let cart = addressed.cartBuyerIdentityUpdate.cart;
    if (!cart) {
      return {
        ok: false,
        reason: "error",
        message:
          addressed.cartBuyerIdentityUpdate.userErrors[0]?.message ??
          "That address could not be used.",
      };
    }

    const group = cart.deliveryGroups?.edges[0]?.node;
    const option = group?.deliveryOptions[0];
    if (group && option) {
      const selected = await storefront<{
        cartSelectedDeliveryOptionsUpdate: {
          cart: CartShape | null;
          userErrors: { message: string }[];
        };
      }>(
        CART_SELECT_DELIVERY,
        {
          cartId,
          selected: [
            { deliveryGroupId: group.id, deliveryOptionHandle: option.handle },
          ],
        },
        { cache: "no-store" },
      );
      cart = selected.cartSelectedDeliveryOptionsUpdate.cart ?? cart;
    }

    const paid = await storefront<{
      cartPaymentUpdate: {
        cart: { id: string } | null;
        userErrors: { message: string }[];
      };
    }>(
      CART_PAYMENT_UPDATE,
      {
        cartId,
        payment: {
          amount: {
            amount: cart.cost.totalAmount.amount,
            currencyCode: cart.cost.totalAmount.currencyCode,
          },
          walletPaymentMethod: {
            applePayWalletContent: {
              billingAddress: input.billing,
              data: input.token.data,
              header: input.token.header,
              signature: input.token.signature,
              version: input.token.version,
              ...(input.token.lastDigits
                ? { lastDigits: input.token.lastDigits }
                : {}),
            },
          },
        },
      },
      { cache: "no-store" },
    );
    if (!paid.cartPaymentUpdate.cart) {
      return {
        ok: false,
        reason: "error",
        message:
          paid.cartPaymentUpdate.userErrors[0]?.message ??
          "That card was not accepted.",
      };
    }

    const prepared = await storefront<{
      cartPrepareForCompletion: {
        result: { __typename: string; errors?: { message: string }[] } | null;
        userErrors: { message: string }[];
      };
    }>(CART_PREPARE_FOR_COMPLETION, { cartId }, { cache: "no-store" });

    const prepareResult = prepared.cartPrepareForCompletion.result;
    if (prepareResult?.__typename !== "CartStatusReady") {
      return {
        ok: false,
        reason: "error",
        message:
          prepareResult?.errors?.[0]?.message ??
          "The order could not be prepared. Nothing has been charged.",
      };
    }

    const submitted = await storefront<{
      cartSubmitForCompletion: {
        result:
          | { __typename: "SubmitSuccess"; redirectUrl: string }
          | {
              __typename: "SubmitFailed";
              checkoutUrl?: string;
              errors?: { message: string }[];
            }
          | { __typename: "SubmitThrottled" }
          | { __typename: "SubmitAlreadyAccepted" }
          | null;
        userErrors: { message: string }[];
      };
    }>(
      CART_SUBMIT_FOR_COMPLETION,
      { cartId, attemptToken: randomUUID() },
      { cache: "no-store" },
    );

    const result = submitted.cartSubmitForCompletion.result;
    if (result?.__typename === "SubmitSuccess") {
      return { ok: true, redirectUrl: result.redirectUrl };
    }
    if (result?.__typename === "SubmitFailed" && result.checkoutUrl) {
      // Shopify can still take it, just not without asking something more.
      return { ok: true, redirectUrl: result.checkoutUrl };
    }
    return {
      ok: false,
      reason: "error",
      message:
        (result?.__typename === "SubmitFailed" &&
          result.errors?.[0]?.message) ||
        "The order could not be completed.",
    };
  } catch {
    return {
      ok: false,
      reason: "error",
      message: "Apple Pay could not be completed. Nothing has been charged.",
    };
  }
}
