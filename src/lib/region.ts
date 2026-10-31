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

/**
 * The destination, in a cookie rather than in local storage.
 *
 * It has to be readable by three things that cannot see each other: the
 * proxy, which fills it in from the edge's idea of where the visitor is; the
 * inline script in the document head, which has to choose a price list
 * before the first paint; and React, once it takes over. Only a cookie is
 * visible to all three, and only on the first frame does it matter.
 */
export const COUNTRY_COOKIE = "tamiale-country";

/**
 * The three price lists that are not the default, as the inline script needs
 * them: a flat country-to-list table. Everywhere absent from it pays in
 * euros, which is the same rule as below and the reason the lists are shared
 * rather than written out twice.
 */
export const NON_EURO_COUNTRIES: Readonly<Record<string, RegionId>> =
  Object.fromEntries([
    ...STERLING.map((code) => [code, "uk"] as const),
    ...DOLLAR.map((code) => [code, "us"] as const),
    ...DIRHAM.map((code) => [code, "ae"] as const),
  ]);

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
 * Names ICU gives in their long constitutional form, which is not what a
 * shipping list wants. Node and Chrome also disagree on exactly these, so
 * pinning them here removes a difference as well as a mouthful.
 */
const SHORT_NAMES: Record<string, Record<string, string>> = {
  HK: { "en-GB": "Hong Kong", "fr-FR": "Hong Kong", "de-DE": "Hongkong" },
};

/**
 * The destination's name in the reader's language. Falls back to the raw
 * code, which is wrong but legible, rather than to an empty line.
 *
 * Only ever call this on the server. Node and the browser ship different
 * ICU data, so a client that recomputed these would hydrate against text
 * the server never wrote; see `shippingCountries`.
 */
export function countryName(code: string, locale: string): string {
  const pinned = SHORT_NAMES[code]?.[locale];
  if (pinned) return pinned;
  try {
    return new Intl.DisplayNames([locale], { type: "region" }).of(code) ?? code;
  } catch {
    return code;
  }
}

export type Destination = { code: string; name: string };

/**
 * Every destination, named and ordered for one reader.
 *
 * Resolved on the server and handed to the client as data. Doing it in the
 * component instead was a hydration error: Node called Hong Kong "Hong Kong
 * SAR China" and Chrome called it "Hong Kong", so React threw out the tree
 * and rebuilt it on every page load. Passing the strings down means the two
 * engines cannot disagree, whatever ICU does next.
 *
 * Sorted by the name the reader sees rather than by the code behind it: in
 * French, Germany files under A.
 */
export function shippingCountries(locale: string): Destination[] {
  return SHIPPING_COUNTRIES.map((code) => ({
    code,
    name: countryName(code, locale),
  })).sort((a, b) => a.name.localeCompare(b.name, locale));
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
