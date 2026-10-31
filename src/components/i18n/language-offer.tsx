"use client";

import { useRouter } from "next/navigation";
import { useSyncExternalStore } from "react";

import { cn } from "@/lib/cn";
import {
  LOCALE_COOKIE,
  defaultLocale,
  htmlLang,
  isLocale,
  splitLocale,
  type Locale,
} from "@/lib/i18n/config";
import { usePersistentState } from "@/lib/use-persistent-state";

const DISMISSED = "tamiale.language-offer";

/**
 * Offers the page in the reader's own language instead of redirecting them
 * into it.
 *
 * A redirect was the other way to do this, and it would have cost the French
 * and German pages their place in the index: Googlebot crawls from the
 * United States, so a rule that sends everyone outside France away from /fr
 * sends the crawler away too, and two thirds of the sitemap stops being
 * reachable. Every page stays served to everyone, and the reader is offered
 * the switch rather than having it made for them.
 *
 * The signal is the browser's language list rather than the country the
 * request came from, for the same reason the proxy weighs it that way: it is
 * what the person reads, where the IP is only where they are sitting. A
 * French speaker in New York keeps French, and an English speaker who has
 * been handed French gets the offer wherever they are.
 */
const OFFER: Record<Locale, { message: string; accept: string; dismiss: string }> =
  {
    // Written in the language being offered. It is the one language the
    // reader is known to have, and the only one they are certain to read.
    en: {
      message: "Tamiale is available in English.",
      accept: "Switch to English",
      dismiss: "Not now",
    },
    fr: {
      message: "Tamiale est disponible en français.",
      accept: "Passer au français",
      dismiss: "Plus tard",
    },
    de: {
      message: "Tamiale ist auf Deutsch verfügbar.",
      accept: "Auf Deutsch wechseln",
      dismiss: "Später",
    },
  };

/**
 * The first language we publish that the browser asks for.
 *
 * A browser that asks only for languages we do not publish falls to
 * English, which is where `x-default` and the proxy both send that visitor
 * already. Someone reading Spanish who followed a link into /fr is better
 * served by the offer than by being left on a page they cannot read.
 */
function preferredLocale(): Locale {
  const tags = navigator.languages?.length
    ? navigator.languages
    : [navigator.language];

  for (const tag of tags) {
    const base = tag.toLowerCase().split("-")[0];
    if (isLocale(base)) return base;
  }
  return defaultLocale;
}

/** True once the switcher has been used; a stated choice is never second-guessed. */
function hasStatedChoice(): boolean {
  return document.cookie
    .split("; ")
    .some((pair) => pair.startsWith(`${LOCALE_COOKIE}=`));
}

/*
 * The browser's language list is an external value that never changes while
 * the page is open, so it is read through `useSyncExternalStore` with a
 * subscription that never fires. An effect would do the same job one render
 * later and announce itself as a cascading render; this way React picks the
 * value up during hydration, and the server is told to see nothing.
 */
const noopSubscribe = () => () => {};
const readOffer = (): Locale | null =>
  hasStatedChoice() ? null : preferredLocale();
const nothingOnServer = (): Locale | null => null;

export function LanguageOffer({ locale }: { locale: Locale }) {
  const router = useRouter();
  const [dismissed, setDismissed] = usePersistentState<boolean>(
    DISMISSED,
    false,
  );
  const preferred = useSyncExternalStore(
    noopSubscribe,
    readOffer,
    nothingOnServer,
  );
  const offered = preferred !== null && preferred !== locale ? preferred : null;

  const shown = offered !== null && !dismissed;
  const copy = OFFER[offered ?? locale];

  function accept() {
    if (!offered) return;
    // Matches the switcher: a year, and lax is enough for a display
    // preference that is never read for anything privileged.
    document.cookie = `${LOCALE_COOKIE}=${offered}; path=/; max-age=31536000; samesite=lax`;
    setDismissed(true);

    // Read here rather than during render. This sits in the layout, so on
    // every route, and reading URL data while rendering would make the whole
    // shell request-dependent and nothing would prerender.
    const { path } = splitLocale(window.location.pathname);
    router.push(`/${offered}${path === "/" ? "" : path}`);
    router.refresh();
  }

  return (
    <div
      // Sits below the pinned chrome and over the top of the page rather
      // than in the flow, so arriving after hydration does not shift
      // anything. The top of the opening frame is bare backdrop.
      className={cn(
        "fixed inset-x-0 top-(--chrome-height) z-40 border-b border-ivory-hairline bg-ivory/95 backdrop-blur-xl transition-[opacity,transform] duration-500 ease-tamiale",
        shown ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-2 opacity-0",
      )}
      // The text is not in the language of the document around it, which a
      // screen reader has to be told or it will read English with a French
      // voice.
      lang={htmlLang[offered ?? locale]}
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="gutter flex flex-col items-start gap-2 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-6">
        <p className="text-sm text-obsidian">{copy.message}</p>
        <div className="flex shrink-0 items-center gap-6">
          <button
            type="button"
            onClick={accept}
            className="eyebrow cursor-pointer border-b border-obsidian pb-0.5 text-obsidian transition-opacity duration-300 hover:opacity-60"
          >
            {copy.accept}
          </button>
          <button
            type="button"
            onClick={() => setDismissed(true)}
            className="eyebrow cursor-pointer text-stone transition-colors duration-300 hover:text-obsidian"
          >
            {copy.dismiss}
          </button>
        </div>
      </div>
    </div>
  );
}
