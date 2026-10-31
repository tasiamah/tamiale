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

/**
 * Destinations, and the price list each one is billed under.
 *
 * The house publishes four price books but ships worldwide, so the two
 * questions are separate: where the parcel goes is a country, what it costs
 * is one of four lists. Sterling covers the UK and the crown dependencies,
 * dollars the Americas, dirhams the Gulf, and everywhere else is billed in
 * euros. That is a rule rather than a table because a table of two hundred
 * countries is a table nobody will keep correct.
 *
 * Names are never stored here. `Intl.DisplayNames` already knows what each
 * code is called in English, French and German, and it is right more often
 * than a list maintained by hand.
 */
const STERLING = ["GB", "GG", "JE", "IM"];
const DOLLAR = ["US", "CA", "MX", "PR"];
const DIRHAM = ["AE", "SA", "QA", "KW", "BH", "OM"];
const EURO = [
  // EU, EEA, Switzerland and the European microstates.
  "AD", "AT", "BE", "BG", "CH", "CY", "CZ", "DE", "DK", "EE", "ES", "FI",
  "FR", "GR", "HR", "HU", "IE", "IS", "IT", "LI", "LT", "LU", "LV", "MC",
  "MT", "NL", "NO", "PL", "PT", "RO", "SE", "SI", "SK", "SM",
  // Everywhere else we ship, billed in euros.
  "AR", "AU", "BR", "CL", "CN", "HK", "ID", "IL", "IN", "JP", "KR", "MY",
  "NZ", "PH", "SG", "TH", "TR", "TW", "VN", "ZA",
];

const REGION_BY_COUNTRY = new Map<string, RegionId>([
  ...STERLING.map((code) => [code, "uk"] as const),
  ...DOLLAR.map((code) => [code, "us"] as const),
  ...DIRHAM.map((code) => [code, "ae"] as const),
  ...EURO.map((code) => [code, "eu"] as const),
]);

/** Every destination the shipping selector offers, unsorted. */
export const SHIPPING_COUNTRIES: readonly string[] = [
  ...STERLING,
  ...DOLLAR,
  ...DIRHAM,
  ...EURO,
];

/** Which price list applies to a destination. Unknown codes pay in euros. */
export function regionByCountry(code: string | undefined | null): RegionId {
  if (!code) return DEFAULT_REGION.id;
  return REGION_BY_COUNTRY.get(code.toUpperCase()) ?? DEFAULT_REGION.id;
}

export function isShippingCountry(code: string | undefined | null): boolean {
  return Boolean(code && REGION_BY_COUNTRY.has(code.toUpperCase()));
}

/**
 * The destination's name in the reader's language. Falls back to the raw
 * code, which is wrong but legible, rather than to an empty line.
 */
export function countryName(code: string, locale: string): string {
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
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
