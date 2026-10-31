"use client";

import Image from "next/image";

import { Link } from "@/components/i18n/link";
import { useRegion } from "@/components/chrome/region-provider";
import { useReserve } from "@/components/commerce/use-reserve";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

export function ColorwayCard({
  frame,
  colorway,
  priority = false,
  className,
}: {
  frame: Frame;
  colorway: Colorway;
  priority?: boolean;
  className?: string;
}) {
  const dict = useDictionary();
  const { price } = useRegion();
  const reserve = useReserve();

  return (
    <article className={cn("group relative", className)}>
      <div
        className="plate grain relative flex aspect-5/4 items-center justify-center px-[3%] sm:aspect-16/10"
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-tamiale group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, ${colorway.lensHex}22, transparent 62%)`,
          }}
        />
        <Image
          src={colorway.image.src}
          alt={colorway.image.alt}
          width={colorway.image.width}
          height={colorway.image.height}
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="relative z-10 w-full"
        />

        {/*
         * Reserve sits above the card-wide link. It is always reachable on
         * touch, where there is no hover to reveal it.
         */}
        <button
          type="button"
          disabled={!colorway.availableForSale}
          onClick={() => reserve(frame, colorway)}
          className={cn(
            "eyebrow absolute inset-x-4 bottom-4 z-20 cursor-pointer py-3.5 transition-all duration-700 ease-tamiale disabled:cursor-not-allowed disabled:opacity-40",
            "bg-obsidian text-ivory hover:bg-obsidian-raised",
            "sm:translate-y-1 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
          )}
        >
          {colorway.availableForSale ? dict.commerce.reserve : dict.commerce.spokenFor}
        </button>
      </div>

      <div
        className="hairline-t mt-6 flex items-baseline justify-between gap-6 pt-5"
      >
        <div>
          <h3 className="frame-name text-[1.75rem] leading-none">
            <Link
              href={`/collection/${frame.handle}?lens=${colorway.id}`}
              className="after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              {frame.name}
              <span className="text-stone"> / {colorway.name}</span>
            </Link>
          </h3>
          <p className="mt-3 text-xs text-stone-dim">
            {fill(dict.commerce.preorderShips, { month: frame.shipsFrom })}
          </p>
        </div>
        <p className="frame-name figure-num shrink-0 text-xl text-stone">
          {price(frame.priceBook)}
        </p>
      </div>
    </article>
  );
}
