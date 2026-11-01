"use client";

import { useState, useSyncExternalStore, useTransition } from "react";

import { useDictionary } from "@/components/i18n/dictionary-provider";
import { useRegion } from "@/components/chrome/region-provider";
import {
  completeApplePayOrder,
  validateApplePayMerchant,
  type ApplePayAddress,
} from "@/lib/shopify/apple-pay";
import type { Colorway, Frame } from "@/lib/catalog/types";

/*
 * Express payment, sitting under Reserve the way the larger houses place it.
 *
 * Headless is the reason this is worth having. On a Liquid theme the wallet
 * button still sends the buyer to Shopify's checkout; here the order is
 * placed through the Storefront cart and the buyer never leaves the product
 * page. That is the whole argument for it.
 *
 * It renders only when Apple itself says the device can pay. Apple Pay JS
 * exists in Safari and on Apple hardware and nowhere else, so every other
 * visitor sees nothing at all rather than a button that cannot work.
 */

type ApplePayContact = {
  givenName?: string;
  familyName?: string;
  addressLines?: string[];
  locality?: string;
  administrativeArea?: string;
  postalCode?: string;
  countryCode?: string;
  phoneNumber?: string;
  emailAddress?: string;
};

declare global {
  var ApplePaySession:
    | {
        new (version: number, request: unknown): ApplePaySessionInstance;
        canMakePayments(): boolean;
        supportsVersion(version: number): boolean;
        STATUS_SUCCESS: number;
        STATUS_FAILURE: number;
      }
    | undefined;
}

type ApplePaySessionInstance = {
  onvalidatemerchant: ((event: { validationURL: string }) => void) | null;
  onpaymentauthorized:
    | ((event: {
        payment: {
          token: {
            paymentData: unknown;
            paymentMethod?: { displayName?: string };
          };
          billingContact?: ApplePayContact;
          shippingContact?: ApplePayContact;
        };
      }) => void)
    | null;
  oncancel: (() => void) | null;
  completeMerchantValidation(session: unknown): void;
  completePayment(status: number): void;
  abort(): void;
  begin(): void;
};

/**
 * Whether Apple itself says this device can pay. It is a fact about the
 * browser, so it is read as an external store: the server has no way to know
 * it, and the answer cannot change while the page is open.
 */
const neverChanges = () => () => {};
const canPayHere = () => {
  const api = globalThis.ApplePaySession;
  return Boolean(api && api.supportsVersion(3) && api.canMakePayments());
};
const notOnTheServer = () => false;

function toAddress(contact: ApplePayContact | undefined): ApplePayAddress {
  return {
    firstName: contact?.givenName,
    lastName: contact?.familyName,
    address1: contact?.addressLines?.[0],
    address2: contact?.addressLines?.[1],
    city: contact?.locality,
    province: contact?.administrativeArea,
    zip: contact?.postalCode,
    country: contact?.countryCode?.toUpperCase(),
    phone: contact?.phoneNumber,
  };
}

export function ApplePayButton({
  frame,
  colorway,
  configured,
}: {
  frame: Frame;
  colorway: Colorway;
  configured: boolean;
}) {
  const dict = useDictionary();
  const { region } = useRegion();
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const supported = useSyncExternalStore(
    neverChanges,
    canPayHere,
    notOnTheServer,
  );

  if (!configured || !supported || !colorway.availableForSale) return null;

  function pay() {
    const api = globalThis.ApplePaySession;
    if (!api) return;
    setError(null);

    const amount = frame.priceBook[region.currency].toFixed(2);
    const session = new api(3, {
      countryCode: region.countryCode,
      currencyCode: region.currency,
      merchantCapabilities: ["supports3DS"],
      supportedNetworks: ["visa", "masterCard", "amex", "discover"],
      requiredBillingContactFields: ["postalAddress", "name"],
      requiredShippingContactFields: [
        "postalAddress",
        "name",
        "email",
        "phone",
      ],
      total: {
        label: `Tamiale — ${frame.name}`,
        amount,
        type: "final",
      },
    });

    session.onvalidatemerchant = (event) => {
      void validateApplePayMerchant(event.validationURL).then((result) => {
        if (result.ok) session.completeMerchantValidation(result.session);
        else {
          setError(result.message);
          session.abort();
        }
      });
    };

    session.onpaymentauthorized = (event) => {
      const token = event.payment.token.paymentData as {
        data: string;
        signature: string;
        version: string;
        header: {
          ephemeralPublicKey: string;
          publicKeyHash: string;
          transactionId: string;
          applicationData?: string;
        };
      };

      startTransition(async () => {
        const result = await completeApplePayOrder({
          lines: [
            { handle: frame.handle, colorwayId: colorway.id, quantity: 1 },
          ],
          countryCode:
            event.payment.shippingContact?.countryCode?.toUpperCase(),
          email: event.payment.shippingContact?.emailAddress,
          shipping: toAddress(event.payment.shippingContact),
          billing: toAddress(event.payment.billingContact),
          token: {
            ...token,
            lastDigits:
              event.payment.token.paymentMethod?.displayName?.match(
                /(\d{4})\s*$/,
              )?.[1],
          },
        });

        // The sheet has to be dismissed before anything is navigated to, or
        // Safari keeps it over the page it lands on.
        session.completePayment(
          result.ok ? api.STATUS_SUCCESS : api.STATUS_FAILURE,
        );
        if (result.ok) window.location.href = result.redirectUrl;
        else setError(result.message);
      });
    };

    session.oncancel = () => setError(null);
    session.begin();
  }

  return (
    <div className="mt-3">
      <button
        type="button"
        onClick={pay}
        disabled={pending}
        aria-label={dict.commerce.payWithApplePay}
        // Apple requires its own button to be drawn by the system, and the
        // only way to ask for that is this appearance value. Tailwind has no
        // token for it, so it is written out.
        style={{
          WebkitAppearance: "-apple-pay-button",
          appearance: "-apple-pay-button" as never,
          ["-apple-pay-button-type" as never]: "buy",
          ["-apple-pay-button-style" as never]: "black",
          width: "100%",
          height: "2.875rem",
          cursor: pending ? "progress" : "pointer",
          opacity: pending ? 0.6 : 1,
        }}
      />
      {error ? (
        <p role="alert" className="mt-2 text-xs text-ivory/60">
          {error}
        </p>
      ) : null}
    </div>
  );
}
