"use client";

import { createContext, use } from "react";

import type { Locale } from "@/lib/i18n/config";
import type { ClientDictionary } from "@/lib/i18n/client-dictionary";

type Value = { locale: Locale; dict: ClientDictionary };

const DictionaryContext = createContext<Value | null>(null);

/**
 * `next/root-params` cannot be read from a Client Component, so the server
 * layout resolves the dictionary once and hands it down. It is one object in
 * the RSC payload for the whole tree rather than a copy per component, and
 * it carries only the sections the browser actually renders.
 */
export function DictionaryProvider({
  locale,
  dict,
  children,
}: Value & { children: React.ReactNode }) {
  return (
    <DictionaryContext value={{ locale, dict }}>{children}</DictionaryContext>
  );
}

export function useDictionary(): ClientDictionary {
  const value = use(DictionaryContext);
  if (!value) {
    throw new Error("useDictionary must be used inside DictionaryProvider");
  }
  return value.dict;
}

export function useLocale(): Locale {
  const value = use(DictionaryContext);
  if (!value) {
    throw new Error("useLocale must be used inside DictionaryProvider");
  }
  return value.locale;
}

/**
 * Prefixes an in-app path with the active locale. Every `Link` in a Client
 * Component goes through this, otherwise a French visitor clicking through
 * the site would silently fall back to English on the next navigation.
 */
export function useHref(): (path: string) => string {
  const locale = useLocale();
  return (path: string) => localeHref(locale, path);
}

/** Shared with the server helper so both sides prefix identically. */
export function localeHref(locale: Locale, path: string): string {
  if (!path.startsWith("/")) return path;
  if (path === "/") return `/${locale}`;
  return `/${locale}${path}`;
}

export { fill } from "@/lib/i18n/config";
