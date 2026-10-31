"use client";

import Link from "next/link";
import { useCallback, useState, useSyncExternalStore } from "react";

import { useCart } from "@/components/cart/cart-provider";
import { Wordmark } from "@/components/ui/wordmark";

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
 * shell of every route — which rules out reading the pathname here. Instead,
 * a page announces a dark opening stage with `data-stage="dark"` and the
 * stylesheet matches on it, so the chrome inverts without knowing the URL.
 */
export function Header() {
  const { count, open } = useCart();
  const scrolled = useScrolledPastHero();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header
        data-chrome
        data-scrolled={scrolled}
        className="fixed inset-x-0 top-0 z-50 h-(--header-height) border-b border-ivory-hairline bg-ivory/92 text-obsidian backdrop-blur-xl transition-[background-color,border-color,color] duration-700 ease-tamiale"
      >
        <div className="gutter grid h-full grid-cols-[1fr_auto_1fr] items-center">
          <div className="flex items-center gap-8">
            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              aria-expanded={menuOpen}
              aria-controls="house-menu"
              className="eyebrow cursor-pointer transition-opacity duration-300 hover:opacity-60"
            >
              Menu
            </button>
            <Link
              href="/collection"
              className="eyebrow hidden transition-opacity duration-300 hover:opacity-60 lg:block"
            >
              Collection
            </Link>
          </div>

          <Link href="/" aria-label="Tamiale — home" className="px-4">
            <Wordmark size="md" />
          </Link>

          <div className="flex items-center justify-end gap-8">
            <Link
              href="/vision-studio"
              className="eyebrow hidden transition-opacity duration-300 hover:opacity-60 md:block"
            >
              Vision Studio
            </Link>
            <button
              type="button"
              onClick={open}
              className="eyebrow cursor-pointer tabular-nums transition-opacity duration-300 hover:opacity-60"
            >
              Bag<span className="ml-1.5 opacity-60">({count})</span>
            </button>
          </div>
        </div>
      </header>

      <div data-chrome-spacer aria-hidden className="h-(--header-height)" />

      <MenuOverlay open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
}
