import type { Metadata } from "next";

import { site } from "@/lib/site";

import {
  defaultLocale,
  htmlLang,
  locales,
  ogLocale,
  type Locale,
} from "./config";

/** The share card a page falls back to: the campaign frame and the wordmark. */
export function houseCard(locale: Locale, alt: string) {
  return { url: `/media/og/tamiale-${locale}.jpg`, width: 1200, height: 630, alt };
}

/**
 * The part of one page's Open Graph block that belongs to the house.
 *
 * Spread it and add `type`, because the shapes diverge there: an article
 * carries a published date that a shop page has no field for.
 *
 * This exists because metadata does not deep merge. A page that writes its
 * own `openGraph` replaces the layout's entirely, so every one of them has
 * to repeat `siteName`, `locale` and the card or silently lose them, and
 * losing the card is the difference between a share that shows a
 * photograph and a share that shows a line of grey text.
 */
export function openGraphFor({
  title,
  description,
  path,
  locale,
  image,
}: {
  title: string;
  description: string;
  path: string;
  locale: Locale;
  image: { url: string; width: number; height: number; alt: string };
}) {
  const clean = path === "/" ? "" : path;
  return {
    siteName: site.name,
    /*
     * og:locale is language_TERRITORY, not the bare language the html
     * element carries, and the alternates are what tell a scraper the
     * other two translations of this page exist.
     */
    locale: ogLocale[locale],
    alternateLocale: locales
      .filter((other) => other !== locale)
      .map((other) => ogLocale[other]),
    title,
    description,
    url: `${site.url}/${locale}${clean}`,
    images: [image],
  };
}

/**
 * Canonical plus hreflang for one page in every language.
 *
 * This is what stops the geo redirect in src/proxy.ts from hiding the
 * translations: Googlebot crawls mostly from US addresses, so left to the
 * redirect alone it would only ever see /en. The alternates tell it that
 * /fr and /de exist and are the same page in another language.
 *
 * `x-default` points at English, which is where a visitor whose language we
 * do not publish is sent.
 */
export function alternatesFor(
  path: string,
  locale: Locale,
): Metadata["alternates"] {
  const clean = path === "/" ? "" : path;

  const languages: Record<string, string> = {};
  for (const other of locales) {
    languages[htmlLang[other]] = `/${other}${clean}`;
  }
  languages["x-default"] = `/${defaultLocale}${clean}`;

  return {
    canonical: `/${locale}${clean}`,
    languages,
  };
}
