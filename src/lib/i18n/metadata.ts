import type { Metadata } from "next";

import { defaultLocale, htmlLang, locales, type Locale } from "./config";

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
