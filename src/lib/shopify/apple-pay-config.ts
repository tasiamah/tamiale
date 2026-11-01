import "server-only";

import { isShopifyConfigured } from "./client";

/**
 * The three grants Apple Pay needs, and which party issues each one.
 *
 * Kept out of the actions file so that asking whether the feature exists is
 * a plain server read rather than a callable endpoint, and so the page can
 * decide during prerender whether the button is worth sending at all.
 */
export const applePay = {
  merchantId: process.env.APPLE_PAY_MERCHANT_ID,
  /** PEM, issued by Apple against the merchant identifier. */
  cert: process.env.APPLE_PAY_MERCHANT_CERT,
  key: process.env.APPLE_PAY_MERCHANT_KEY,
  /** The text Apple serves back to itself to prove this origin is ours. */
  domainAssociation: process.env.APPLE_PAY_DOMAIN_ASSOCIATION,
} as const;

/**
 * A Storefront token without `write_cart_wallet_payments` cannot be told
 * apart from one with it until a payment is attempted, so a connected shop
 * is necessary here but not sufficient. The first live run is the test.
 */
export function isApplePayConfigured(): boolean {
  return Boolean(
    isShopifyConfigured() &&
    applePay.merchantId &&
    applePay.cert &&
    applePay.key,
  );
}
