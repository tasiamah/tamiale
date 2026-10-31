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
        className="grain relative flex aspect-5/4 items-center justify-center overflow-hidden bg-ivory-dim px-[8%] sm:aspect-16/10"
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
          className="relative z-10 w-full transition-transform duration-[1400ms] ease-tamiale group-hover:scale-[1.035]"
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
            "absolute inset-x-3 bottom-3 z-20 cursor-pointer py-2.5 text-[0.625rem] font-medium tracking-[0.085em] uppercase transition-all duration-500 ease-tamiale disabled:cursor-not-allowed disabled:opacity-40",
            "bg-obsidian text-ivory hover:bg-obsidian-raised",
            "sm:translate-y-1 sm:opacity-0 sm:group-focus-within:translate-y-0 sm:group-focus-within:opacity-100 sm:group-hover:translate-y-0 sm:group-hover:opacity-100",
          )}
        >
          {colorway.availableForSale ? dict.commerce.reserve : dict.commerce.spokenFor}
        </button>
      </div>

      <div
        className="mt-4 flex items-baseline justify-between gap-6 border-t border-ivory-hairline pt-3.5"
      >
        <div>
          <h3 className="frame-name text-2xl leading-none">
            <Link
              href={`/collection/${frame.handle}?lens=${colorway.id}`}
              className="after:absolute after:inset-0 after:z-10 after:content-['']"
            >
              {frame.name}
              <span className="text-stone"> / {colorway.name}</span>
            </Link>
          </h3>
          <p className="mt-2.5 text-xs text-stone">
            {fill(dict.commerce.preorderShips, { month: frame.shipsFrom })}
          </p>
        </div>
        <p className="frame-name figure-num shrink-0 text-xl">
          {price(frame.priceBook)}
        </p>
      </div>
    </article>
  );
}
