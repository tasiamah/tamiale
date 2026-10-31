import { locale as rootLocale } from "next/root-params";
import { notFound } from "next/navigation";

import { defaultLocale, isLocale, type Locale } from "./config";
import type { Dictionary } from "./dictionaries/en";

export type { Dictionary };

const loaders = {
  en: () => import("./dictionaries/en").then((m) => m.default),
  fr: () => import("./dictionaries/fr").then((m) => m.default),
  de: () => import("./dictionaries/de").then((m) => m.default),
} satisfies Record<Locale, () => Promise<Dictionary>>;

/**
 * Reads the locale from the route rather than from a header, so a page that
 * calls this stays static. `next/root-params` only works in Server
 * Components; Client Components get the same object from DictionaryProvider.
 */
export async function getLocale(): Promise<Locale> {
  const value = await rootLocale();
  if (!value || !isLocale(value)) notFound();
  return value;
}

export async function getDictionary(): Promise<Dictionary> {
  return loaders[await getLocale()]();
}

export async function loadDictionary(locale: Locale): Promise<Dictionary> {
  return loaders[locale]();
}

export const fallbackLocale = defaultLocale;

export { fill } from "./config";
