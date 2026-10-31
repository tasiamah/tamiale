"use client";

import Image from "next/image";

import {
  fill,
  useDictionary,
  useLocale,
} from "@/components/i18n/dictionary-provider";
import { dateLocale } from "@/lib/i18n/config";
import { Link } from "@/components/i18n/link";
import { useRegion } from "@/components/chrome/region-provider";
import { useOverlay } from "@/components/chrome/use-overlay";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { formatMoney } from "@/lib/region";

import { lineKey, useCart } from "./cart-provider";

export function CartDrawer() {
  const {
    lines,
    count,
    subtotal,
    isOpen,
    isCheckingOut,
    notice,
    close,
    setQuantity,
    remove,
    checkout,
  } = useCart();
  const dict = useDictionary();
  const locale = useLocale();
  const { region, price, taxNote, shippingNote } = useRegion();
  const panelRef = useOverlay(isOpen, close);

  return (
    <>
      <div
        aria-hidden
        onClick={close}
        className={cn(
          "fixed inset-0 z-80 bg-obsidian/45 backdrop-blur-[2px] transition-opacity duration-700 ease-tamiale",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal={isOpen}
        aria-label={dict.cart.yourBag}
        inert={!isOpen}
        className={cn(
          "fixed inset-y-0 right-0 z-85 flex w-full max-w-[29rem] flex-col border-l border-ivory-hairline bg-ivory transition-transform duration-700 ease-tamiale",
          isOpen ? "translate-x-0" : "translate-x-full",
        )}
      >
        <div className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-ivory-hairline px-7">
          <h2 className="eyebrow">
            {dict.cart.yourBag}
            <span className="ml-1.5 text-stone">({count})</span>
          </h2>
          <button
            type="button"
            onClick={close}
            className="eyebrow cursor-pointer text-stone transition-colors hover:text-obsidian"
          >
            {dict.cart.close}
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-6 px-10 text-center">
            <p className="display-md text-obsidian">{dict.cart.emptyTitle}</p>
            <p className="text-sm text-stone">
              {dict.cart.emptyBody}
            </p>
            <Link
              href="/collection"
              onClick={close}
              className="eyebrow border-b border-obsidian pb-1"
            >
              {dict.cart.viewCollection}
            </Link>
          </div>
        ) : (
          <ul className="flex-1 overflow-y-auto px-7">
            {lines.map((line) => {
              const key = lineKey(line);
              return (
                <li
                  key={key}
                  className="grid grid-cols-[6.5rem_1fr] gap-5 border-b border-ivory-hairline py-7"
                >
                  <div className="flex aspect-4/3 items-center justify-center bg-ivory-dim">
                    <Image
                      src={line.image.src}
                      alt={line.image.alt}
                      width={line.image.width}
                      height={line.image.height}
                      className="w-full"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-baseline justify-between gap-4">
                      <p className="frame-name text-xl leading-tight">
                        {line.title}
                      </p>
                      <p className="frame-name figure-num text-base">
                        {price(line.priceBook)}
                      </p>
                    </div>
                    <p className="text-xs text-stone">
                      Onyx / {line.colorwayName}
                    </p>
                    <p className="eyebrow mt-1 text-stone">
                      {fill(dict.commerce.preorderShips, {
                        month: line.shipsFrom,
                      })}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <div className="flex items-center border border-ivory-hairline">
                        <QuantityButton
                          label={fill(dict.cart.decrease, { name: line.title })}
                          onClick={() => setQuantity(key, line.quantity - 1)}
                        >
                          −
                        </QuantityButton>
                        <span className="w-8 text-center text-sm tabular-nums">
                          {line.quantity}
                        </span>
                        <QuantityButton
                          label={fill(dict.cart.increase, { name: line.title })}
                          disabled={line.quantity >= 4}
                          onClick={() => setQuantity(key, line.quantity + 1)}
                        >
                          +
                        </QuantityButton>
                      </div>
                      <button
                        type="button"
                        onClick={() => remove(key)}
                        className="cursor-pointer text-xs text-stone underline-offset-4 transition-colors hover:text-obsidian hover:underline"
                      >
                        {dict.cart.remove}
                      </button>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <div className="shrink-0 border-t border-ivory-hairline px-7 py-7">
            <div className="flex items-baseline justify-between">
              <span className="eyebrow text-stone">{dict.cart.subtotal}</span>
              <span className="frame-name figure-num text-2xl">
                {formatMoney(subtotal, region.currency, dateLocale[locale])}
              </span>
            </div>
            <p className="mt-2 text-xs text-stone">
              {fill(dict.cart.subtotalNote, {
                tax: taxNote,
                shipping: shippingNote,
              })}
            </p>

            {notice && (
              <p
                role="status"
                className="mt-5 border-l-2 border-obsidian bg-ivory-dim px-4 py-3 text-xs leading-relaxed text-obsidian"
              >
                {notice}
              </p>
            )}

            <Button
              className="mt-6 w-full"
              onClick={checkout}
              disabled={isCheckingOut}
            >
              {isCheckingOut ? dict.privateClient.form.sending : dict.cart.checkout}
            </Button>
            <p className="mt-4 text-center text-xs text-stone">
{dict.cart.checkoutNote}
            </p>
          </div>
        )}
      </div>
    </>
  );
}

function QuantityButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: string;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className="size-8 cursor-pointer text-sm text-stone transition-colors hover:text-obsidian disabled:cursor-not-allowed disabled:opacity-30"
    >
      {children}
    </button>
  );
}
