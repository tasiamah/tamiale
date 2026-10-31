"use client";

import { useCallback, useSyncExternalStore } from "react";

import { useRegion } from "@/components/chrome/region-provider";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { useClaimBottomBar } from "@/components/commerce/bottom-bar";
import { useReserve } from "@/components/commerce/use-reserve";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

/**
 * On a handset the purchase panel scrolls away within one swipe, leaving the
 * whole specification with no way to act on it. The bar follows down the page
 * and appears once the panel is behind you.
 */
const APPEARS_AFTER = 560;

function useScrolledPast(threshold: number): boolean {
  const subscribe = useCallback((listener: () => void) => {
    window.addEventListener("scroll", listener, { passive: true });
    return () => window.removeEventListener("scroll", listener);
  }, []);

  return useSyncExternalStore(
    subscribe,
    () => window.scrollY > threshold,
    () => false,
  );
}

export function StickyBuyBar({
  frame,
  colorway,
}: {
  frame: Frame;
  colorway: Colorway;
}) {
  const dict = useDictionary();
  const { price } = useRegion();
  const reserve = useReserve();
  const shown = useScrolledPast(APPEARS_AFTER);

  // Below `lg` this bar owns the bottom edge, so the bag bar stands down.
  useClaimBottomBar();

  return (
    <div
      className={cn(
        "fixed inset-x-0 bottom-0 z-40 border-t border-ivory-hairline bg-ivory/95 backdrop-blur-xl transition-transform duration-500 ease-tamiale lg:hidden",
        shown ? "translate-y-0" : "translate-y-full",
      )}
      // Hidden from assistive technology when off screen; the panel above is
      // the same control and is always in the tree.
      aria-hidden={!shown}
      inert={!shown}
    >
      <div className="gutter flex items-center gap-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]">
        <div className="min-w-0 flex-1">
          <p className="frame-name truncate text-lg leading-tight">
            {frame.name}
            <span className="text-stone"> / {colorway.name}</span>
          </p>
          <p className="figure-num text-xs text-stone">
            {price(frame.priceBook)} ·{" "}
            {fill(dict.commerce.ships, { month: frame.shipsFrom })}
          </p>
        </div>
        <button
          type="button"
          disabled={!colorway.availableForSale}
          onClick={() => reserve(frame, colorway)}
          className="shrink-0 cursor-pointer bg-obsidian px-6 py-3.5 text-[0.625rem] font-medium tracking-[0.085em] text-ivory uppercase transition-colors hover:bg-obsidian-raised disabled:cursor-not-allowed disabled:opacity-40"
        >
          {colorway.availableForSale ? dict.commerce.reserve : dict.commerce.spokenFor}
        </button>
      </div>
    </div>
  );
}
