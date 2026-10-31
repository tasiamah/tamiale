import type { CurrencyCode } from "@/lib/catalog/types";

export type RegionId = "eu" | "uk" | "us" | "ae";

/**
 * A market, not a language. Which prices and duties apply is a question of
 * where the parcel goes; which words describe them is a question of what the
 * reader reads, so the prose lives in the dictionary under `region`.
 */
export type Region = {
  id: RegionId;
  /** ISO country passed to Shopify `@inContext` for market pricing. */
  countryCode: string;
  currency: CurrencyCode;
};

/**
 * Luxury houses publish a price list per market rather than converting a base
 * price at the spot rate. When Shopify Markets is connected its prices take
 * precedence; until then these are the published figures.
 */
export const REGIONS: Region[] = [
  {
    id: "eu",
    countryCode: "NL",
    currency: "EUR",
  },
  {
    id: "uk",
    countryCode: "GB",
    currency: "GBP",
  },
  {
    id: "us",
    countryCode: "US",
    currency: "USD",
  },
  {
    id: "ae",
    countryCode: "AE",
    currency: "AED",
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
