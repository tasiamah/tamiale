"use client";

import Image from "next/image";

import { Link } from "@/components/i18n/link";
import { useRegion } from "@/components/chrome/region-provider";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

export function ColorwayCard({
  frame,
  colorway,
  className,
}: {
  frame: Frame;
  colorway: Colorway;
  className?: string;
}) {
  const dict = useDictionary();
  const { price } = useRegion();

  return (
    <article className={cn("group relative", className)}>
      <div className="plate relative flex aspect-5/4 items-center justify-center sm:aspect-16/10">
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-tamiale group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, ${colorway.lensHex}1f, transparent 62%)`,
          }}
        />
        <Image
          src={colorway.image.src}
          alt={colorway.image.alt}
          width={colorway.image.width}
          height={colorway.image.height}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="relative z-10 w-full"
        />
      </div>

      {/*
       * Centred, and with no buy button over the photograph. A black bar that
       * slides across the product on hover is the single most shop-like
       * gesture a card can make, and no house of this kind has one: you are
       * expected to open the frame and decide there, where the measurements
       * and the edition are. The whole card is the link.
       */}
      <div className="mt-7 flex flex-col items-center gap-2.5 text-center">
        <h3 className="frame-name text-xl leading-none">
          <Link
            href={`/collection/${frame.handle}?lens=${colorway.id}`}
            className="after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {frame.name}
            <span className="text-stone"> / {colorway.name}</span>
          </Link>
        </h3>
        <p className="text-xs text-stone-dim">
          {fill(dict.commerce.preorderShips, { month: frame.shipsFrom })}
        </p>
        <p className="figure-num mt-1 text-sm text-stone">
          {price(frame.priceBook)}
        </p>
      </div>
    </article>
  );
}
