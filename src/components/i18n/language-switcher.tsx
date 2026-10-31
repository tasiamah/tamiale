"use client";

import { useRouter } from "next/navigation";
import { useId } from "react";

import { useDictionary, useLocale } from "@/components/i18n/dictionary-provider";
import {
  LOCALE_COOKIE,
  locales,
  localeNames,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import { cn } from "@/lib/cn";

/**
 * Switching language keeps you on the same page rather than dropping you on
 * the homepage, and writes a cookie so the proxy stops guessing. Once a
 * visitor has said what they read, the IP and the browser header are no
 * longer allowed to override it.
 *
 * The current path is read from `window` inside the handler rather than from
 * `usePathname`. This component sits in the header and the footer, so on
 * every route; reading URL data during render would make the whole shell
 * request-dependent and nothing would prerender.
 */
export function LanguageSwitcher({
  tone = "obsidian",
  className,
}: {
  tone?: "obsidian" | "ivory";
  className?: string;
}) {
  const id = useId();
  const router = useRouter();
  const current = useLocale();
  const dict = useDictionary();

  function change(next: Locale) {
    // A year, so the choice outlives the session. Lax is enough: this is a
    // display preference and is never read for anything privileged.
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
    const { path } = splitLocale(window.location.pathname);
    router.push(`/${next}${path === "/" ? "" : path}`);
    router.refresh();
  }

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "eyebrow",
          tone === "ivory" ? "text-ivory/50" : "text-stone",
        )}
      >
        {dict.header.language}
      </label>
      <select
        id={id}
        value={current}
        onChange={(event) => change(event.target.value as Locale)}
        className={cn(
          "w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm transition-colors",
          tone === "ivory"
            ? "border-ivory/20 text-ivory hover:border-ivory/60"
            : "border-obsidian/20 text-obsidian hover:border-obsidian",
        )}
      >
        {locales.map((option) => (
          <option key={option} value={option} className="text-obsidian">
            {localeNames[option]}
          </option>
        ))}
      </select>
    </div>
  );
}
