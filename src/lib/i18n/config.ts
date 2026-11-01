/**
 * Locale routing lives entirely in the URL: /en, /fr, /de. Nothing about the
 * page depends on who is asking, which is what keeps every route statically
 * prerenderable under Cache Components. The only place the visitor's country
 * is read is `src/proxy.ts`, and all it does there is choose a redirect.
 */
export const locales = ["en", "fr", "de"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

/** `lang` attribute and `hreflang` value for each locale. */
export const htmlLang: Record<Locale, string> = {
  en: "en",
  fr: "fr",
  de: "de",
};

/**
 * `og:locale`, which wants language_TERRITORY and not the bare language the
 * `lang` attribute takes. English is British here for the same reason the
 * dates are: the shop reads to Europe first.
 */
export const ogLocale: Record<Locale, string> = {
  en: "en_GB",
  fr: "fr_FR",
  de: "de_DE",
};

/** BCP 47 tags for `Intl`. Dates and numbers follow the reader, not the shop. */
export const dateLocale: Record<Locale, string> = {
  en: "en-GB",
  fr: "fr-FR",
  de: "de-DE",
};

export const localeNames: Record<Locale, string> = {
  en: "English",
  fr: "Français",
  de: "Deutsch",
};

/**
 * Countries where we are confident about the reading language. Switzerland,
 * Belgium and Luxembourg are deliberately absent: they are multilingual, and
 * guessing from the border there is worse than reading `Accept-Language`.
 */
export const localeByCountry: Record<string, Locale> = {
  FR: "fr",
  MC: "fr",
  DE: "de",
  AT: "de",
};

/** Name of the cookie that records an explicit choice from the switcher. */
export const LOCALE_COOKIE = "tamiale_locale";

/** Prefixes a path with the locale. `/collection` becomes `/fr/collection`. */
export function localePath(locale: Locale, path: string): string {
  const clean = path === "/" ? "" : path;
  return `/${locale}${clean}`;
}

/**
 * Splits `/fr/collection` into its locale and the path beneath it, so the
 * language switcher can rebuild the same page in another language.
 */
export function splitLocale(pathname: string): {
  locale: Locale;
  path: string;
} {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) {
    return { locale: first, path: `/${rest.join("/")}`.replace(/\/$/, "") || "/" };
  }
  return { locale: defaultLocale, path: pathname };
}

/**
 * Fills `{name}` placeholders. Kept deliberately dumb: the dictionaries hold
 * whole sentences rather than fragments, so there is no grammar to do here
 * and nothing that would need a plural rule.
 */
export function fill(
  template: string,
  values: Record<string, string | number>,
): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in values ? String(values[key]) : match,
  );
}
