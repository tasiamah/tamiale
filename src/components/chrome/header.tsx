"use client";

import { useCallback, useState, useSyncExternalStore } from "react";

import { Link } from "@/components/i18n/link";
import { useCart } from "@/components/cart/cart-provider";
import { useDictionary } from "@/components/i18n/dictionary-provider";
import { Wordmark } from "@/components/ui/wordmark";

import { AnnouncementBar } from "./announcement-bar";
import { MenuOverlay } from "./menu-overlay";

/** Distance past which the chrome stops being transparent. */
const THRESHOLD = 24;

function useScrolledPastHero(): boolean {
  const subscribe = useCallback((listener: () => void) => {
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > THRESHOLD,
    () => false,
  );
}

/**
 * The header lives in the root layout and must therefore stay in the static
 * shell of every route, which rules out reading the pathname here. Instead,
 * a page announces a dark opening stage with `data-stage="dark"` and the
 * stylesheet matches on it, so the chrome inverts without knowing the URL.
 */
export function Header() {
  const dict = useDictionary();
  const { count, open } = useCart();
  const scrolled = useScrolledPastHero();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/*
       * The announcement bar and the header are pinned together. The bar is
       * opaque on every route, including the dark stages where the header
       * below it turns transparent, so the two never half-dissolve into each
       * other at the top of the window.
       */}
      <div className="fixed inset-x-0 top-0 z-50">
        <AnnouncementBar />
        <header
          data-chrome
          data-scrolled={scrolled}
          className="h-(--header-height) border-b border-ivory-hairline bg-ivory/92 text-obsidian backdrop-blur-xl transition-[background-color,border-color,color] duration-700 ease-tamiale"
        >
        <div className="gutter grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex h-full items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="house-menu"
              className="eyebrow flex h-full cursor-pointer items-center gap-2.5 transition-opacity duration-300 hover:opacity-60"
            >
              {/*
               * The word alone was not reading as a control on a phone. Three
               * hairlines rather than a drawn icon: they take their colour
               * from the label, so the mark inverts with the chrome over a
               * dark opening stage without a second rule for it.
               */}
              <span aria-hidden className="flex w-[0.9375rem] flex-col gap-[0.25rem]">
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
                <span className="h-px w-full bg-current" />
              </span>
              {dict.header.menu}
            </button>
            <Link
              href="/collection"
              className="eyebrow hidden h-full items-center transition-opacity duration-300 hover:opacity-60 lg:flex"
            >
              {dict.nav.collection}
            </Link>
          </div>

          {/*
           * Full height rather than hugging the text. The mark sits in the
           * middle of an 84px bar, which on a phone is a target you miss
           * more often than you hit.
           */}
          <Link
            href="/"
            aria-label={dict.header.home}
            className="flex h-full items-center justify-center px-4 transition-opacity duration-300 hover:opacity-60"
          >
            <Wordmark size="xl" />
          </Link>

          <div className="flex h-full items-center justify-end gap-8">
            <Link
              href="/vision-studio"
              className="eyebrow hidden h-full items-center transition-opacity duration-300 hover:opacity-60 md:flex"
            >
              {dict.nav.visionStudio}
            </Link>
            <button
              type="button"
              onClick={open}
              className="eyebrow flex h-full cursor-pointer items-center tabular-nums transition-opacity duration-300 hover:opacity-60"
            >
              {dict.header.bag}
              <span className="ml-1.5 opacity-60">({count})</span>
            </button>
          </div>
          </div>
        </header>
      </div>

      <div data-chrome-spacer aria-hidden className="h-(--chrome-height)" />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
