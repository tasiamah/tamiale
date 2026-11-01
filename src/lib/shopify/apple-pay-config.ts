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
  /*
   * The merchant identity certificate, PEM, and the RSA key it was made
   * with. Apple issues two certificates against a merchant identifier and
   * they are not interchangeable. This is the one that authenticates a
   * session with Apple's servers, which is the only thing this origin does.
   *
   * The other, the payment processing certificate, never comes near this
   * code: Shopify issues its own signing request for it and decrypts the
   * token itself, so the key that could read a card is theirs to hold and
   * not ours to lose.
   */
  identityCert: process.env.APPLE_PAY_MERCHANT_IDENTITY_CERT,
  identityKey: process.env.APPLE_PAY_MERCHANT_IDENTITY_KEY,
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
    applePay.identityCert &&
    applePay.identityKey,
  );
}
