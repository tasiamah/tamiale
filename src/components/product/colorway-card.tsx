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
      <div className="plate relative flex aspect-5/4 items-center justify-center overflow-hidden bg-studio sm:aspect-16/10">
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
          className="relative z-10 w-full transition-opacity duration-700 ease-tamiale group-hover:opacity-0"
        />

        {/*
         * The same lens worn, underneath the cursor rather than behind a
         * click. The object answers what it is and the face answers whether
         * you want it, and on a grid whose whole question is "which lens"
         * the second answer is the one being compared.
         *
         * The portrait is taller than the tile, so it is cropped to a band
         * across the eyes, and the band has to be placed by hand: the
         * glasses sit about a third of the way down the frame, and how much
         * of the picture survives the crop changes with the tile's own
         * ratio, which changes at `sm`.
         *
         * Decorative, because the render above it already carries the alt
         * and a reader does not need the same frame described twice.
         */}
        <Image
          src={colorway.worn[0].src}
          alt=""
          fill
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 31vw"
          className="absolute inset-0 z-20 object-cover object-[center_8%] opacity-0 transition-opacity duration-700 ease-tamiale group-hover:opacity-100 sm:object-[center_18%]"
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
        {/*
         * h2, not h3. On both pages that use this grid the tiles sit
         * directly under the page's own title with nothing in between, so
         * an h3 was skipping a level. It was already doing that on the
         * collection page before the homepage was rearranged.
         */}
        <h2 className="frame-name text-xl leading-none">
          <Link
            href={`/collection/${frame.handle}?lens=${colorway.id}`}
            className="after:absolute after:inset-0 after:z-10 after:content-['']"
          >
            {frame.name}
            <span className="text-stone"> / {colorway.name}</span>
          </Link>
        </h2>
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
