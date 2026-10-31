import type { CurrencyCode } from "@/lib/catalog/types";

export type RegionId = "eu" | "uk" | "us" | "ae";

export type Region = {
  id: RegionId;
  label: string;
  /** ISO country passed to Shopify `@inContext` for market pricing. */
  countryCode: string;
  currency: CurrencyCode;
  locale: string;
  taxNote: string;
  shippingNote: string;
};

/**
 * Luxury houses publish a price list per market rather than converting a base
 * price at the spot rate. When Shopify Markets is connected its prices take
 * precedence; until then these are the published figures.
 */
export const REGIONS: Region[] = [
  {
    id: "eu",
    label: "Europe",
    countryCode: "NL",
    currency: "EUR",
    locale: "en-NL",
    taxNote: "VAT included",
    shippingNote: "Complimentary insured delivery, 2–3 working days",
  },
  {
    id: "uk",
    label: "United Kingdom",
    countryCode: "GB",
    currency: "GBP",
    locale: "en-GB",
    taxNote: "VAT and duties included",
    shippingNote: "Complimentary insured delivery, 2–4 working days",
  },
  {
    id: "us",
    label: "United States",
    countryCode: "US",
    currency: "USD",
    locale: "en-US",
    taxNote: "Sales tax calculated at checkout",
    shippingNote: "Complimentary insured delivery, 3–5 working days",
  },
  {
    id: "ae",
    label: "United Arab Emirates",
    countryCode: "AE",
    currency: "AED",
    locale: "en-AE",
    taxNote: "VAT and duties included",
    shippingNote: "Complimentary insured delivery, 2–4 working days",
  },
];

export const DEFAULT_REGION = REGIONS[0];

export function findRegion(id: string | undefined | null): Region {
  return REGIONS.find((region) => region.id === id) ?? DEFAULT_REGION;
}

export function formatMoney(
  amount: number,
  currency: CurrencyCode,
  locale: string,
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}
