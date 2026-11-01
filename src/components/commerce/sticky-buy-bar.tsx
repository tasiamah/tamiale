"use client";

import { useEffect, useState } from "react";

import { useRegion } from "@/components/chrome/region-provider";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { useClaimBottomBar } from "@/components/commerce/bottom-bar";
import { useReserve } from "@/components/commerce/use-reserve";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

/**
 * Whether the real purchase panel is somewhere other than on the screen.
 *
 * The bar used to wait for 560px of scrolling, on the reasoning that the
 * panel had just gone past by then. That stopped being true when the gallery
 * grew to six views: on a handset the panel now sits nearly four screens
 * down, so the rule was hiding the only way to buy for the whole of the
 * first screen, which is the part of the page everyone sees and many never
 * scroll past.
 *
 * Watching the panel is what the scroll figure was always standing in for,
 * and it cannot drift out of date when the page above it changes again.
 */
function useBuyPanelOffScreen(): boolean {
  // Visible until proven otherwise, so the bar is painted rather than
  // animated in. On a handset the panel is never on the first screen.
  const [onScreen, setOnScreen] = useState(false);

  useEffect(() => {
    const panel = document.querySelector("[data-buy-panel]");
    if (!panel) return;

    const observer = new IntersectionObserver(
      ([entry]) => setOnScreen(entry.isIntersecting),
      { threshold: 0 },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return !onScreen;
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
  const shown = useBuyPanelOffScreen();

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
