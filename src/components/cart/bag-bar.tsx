"use client";

import Image from "next/image";

import { useRegion } from "@/components/chrome/region-provider";
import { useBottomBarClaimed } from "@/components/commerce/bottom-bar";
import {
  fill,
  useDictionary,
  useLocale,
} from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import { dateLocale } from "@/lib/i18n/config";
import { formatMoney } from "@/lib/region";

import { useCart } from "./cart-provider";

/**
 * The bag drawer opens on its own the moment something is added and is then
 * dismissed, after which the bag is a two-character count in the corner of
 * the header. This keeps it on the page with the frame in it, what it costs
 * and the way out, and it is there only once there is something to show, so
 * a visitor who has not reserved anything is not followed around by a bar.
 *
 * The left half opens the drawer rather than going straight to payment,
 * because changing your mind about a quantity should not mean a trip through
 * checkout. The right half is the way out, and the failure notice from the
 * provider surfaces here too, since the drawer that normally carries it is
 * closed whenever this is visible.
 */
export function BagBar() {
  const {
    lines,
    count,
    subtotal,
    isOpen,
    isCheckingOut,
    notice,
    open,
    checkout,
  } = useCart();
  const dict = useDictionary();
  const locale = useLocale();
  const { region } = useRegion();

  const shown = count > 0 && !isOpen;
  const first = lines[0];

  /*
   * A product page pins its own bar to this edge, offering the frame being
   * read about. Below `lg` that one wins, because the thing in front of you
   * beats the thing already decided on; above `lg` it hides itself and this
   * takes the space back.
   */
  const hiddenHere = useBottomBarClaimed() && "hidden lg:block";

  return (
    <>
      {/*
       * Standing room, so the bar does not sit on top of the last line of
       * the footer for anyone who scrolls to the end of the page with
       * something in their bag.
       */}
      <div
        aria-hidden
        className={cn("h-18 shrink-0", !shown && "hidden", hiddenHere)}
      />

      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-60 border-t border-ivory-hairline bg-ivory/95 backdrop-blur-xl transition-transform duration-500 ease-tamiale",
          shown ? "translate-y-0" : "translate-y-full",
          hiddenHere,
        )}
        // Off screen it is still in the tree for the transition, so it is
        // taken out of the reading order until it arrives. The header carries
        // the same count and the same route to the bag throughout.
        aria-hidden={!shown}
        inert={!shown}
      >
        {notice && (
          <p
            role="status"
            className="gutter border-b border-ivory-hairline bg-ivory-dim py-3 text-xs leading-relaxed text-obsidian"
          >
            {notice}
          </p>
        )}

        <div className="gutter flex items-center gap-3 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:gap-4">
          <button
            type="button"
            onClick={open}
            aria-label={dict.cart.yourBag}
            className="flex min-w-0 flex-1 cursor-pointer items-center gap-3 text-left sm:gap-4"
          >
            {first && (
              <span className="flex h-12 w-14 shrink-0 items-center justify-center bg-ivory-dim sm:w-16">
                <Image
                  src={first.image.src}
                  alt=""
                  width={first.image.width}
                  height={first.image.height}
                  className="w-full"
                />
              </span>
            )}
            <span className="min-w-0">
              {/*
               * The count rather than "Your bag", because the German for
               * that plus the German for the button does not leave room for
               * both on a narrow phone, and of the two the count is the
               * thing the header does not already say in view.
               */}
              <span className="eyebrow block truncate text-stone">
                {fill(count === 1 ? dict.cart.itemOne : dict.cart.itemMany, {
                  count: String(count),
                })}
              </span>
              <span className="frame-name figure-num block text-lg leading-tight">
                {formatMoney(subtotal, region.currency, dateLocale[locale])}
              </span>
            </span>
          </button>

          <button
            type="button"
            onClick={checkout}
            disabled={isCheckingOut}
            className="shrink-0 cursor-pointer bg-obsidian px-5 py-3.5 text-[0.625rem] font-medium tracking-[0.085em] text-ivory uppercase transition-colors hover:bg-obsidian-raised disabled:cursor-not-allowed disabled:opacity-40 sm:px-6"
          >
            {isCheckingOut ? dict.privateClient.form.sending : dict.cart.checkout}
          </button>
        </div>
      </div>
    </>
  );
}
