"use client";

import Image from "next/image";
import { useState } from "react";

import { Link } from "@/components/i18n/link";
import { useRegion } from "@/components/chrome/region-provider";
import { EditionNote } from "@/components/commerce/edition-note";
import { TrustRow } from "@/components/commerce/trust-row";
import { useReserve } from "@/components/commerce/use-reserve";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { ColorwaySwatches } from "@/components/product/colorway-swatches";
import { Button, ButtonLink } from "@/components/ui/button";
import { findColorway } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";

/**
 * The opening of the store. The statement comes first because the house has
 * one, but the frame, its price, its three lenses and a way to buy it are all
 * above the fold. A visitor should never have to go looking for the product
 * on the page that is selling it.
 */
export function Hero({ frame }: { frame: Frame }) {
  const [lens, setLens] = useState(frame.colorways[0].id);
  const colorway = findColorway(frame, lens);
  const dict = useDictionary();
  const { price, taxNote } = useRegion();
  const reserve = useReserve();

  return (
    <section className="gutter pt-10 pb-16 lg:pt-16">
      <div className="hairline-b flex flex-col gap-6 pb-9 lg:flex-row lg:items-end lg:justify-between lg:gap-16">
        <h1 className="display-hero max-w-[13ch] text-balance">
          {dict.meta.statement}
        </h1>
        <p className="body-lg max-w-sm text-pretty text-stone lg:pb-3">
{dict.home.heroLede}
        </p>
      </div>

      <div className="grid gap-10 pt-10 lg:grid-cols-12 lg:gap-14">
        <figure className="lg:col-span-7">
          <div className="flex aspect-5/4 items-center justify-center bg-ivory-dim px-[8%] sm:aspect-16/10">
            <Image
              src={colorway.image.src}
              alt={colorway.image.alt}
              width={colorway.image.width}
              height={colorway.image.height}
              priority
              sizes="(max-width: 1024px) 94vw, 58vw"
              className="w-full"
            />
          </div>
          <figcaption className="mt-3 flex justify-between text-xs text-stone">
            <span>
              {frame.name} · {colorway.frameFinish} / {colorway.name}
            </span>
            <span className="figure-num">{colorway.sku}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-5 lg:self-center">
          <p className="eyebrow text-stone">{frame.collection}</p>

          <div className="mt-3 flex items-baseline justify-between gap-6">
            <h2 className="frame-name text-4xl md:text-5xl">{frame.name}</h2>
            <p className="frame-name figure-num text-3xl md:text-4xl">
              {price(frame.priceBook)}
            </p>
          </div>
          <p className="mt-1.5 text-xs text-stone">{taxNote}</p>

          <p className="mt-6 max-w-md text-pretty text-stone">
            {frame.tagline}
          </p>

          <div className="mt-8">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow text-stone">{dict.commerce.lens}</p>
              <p className="text-sm">{colorway.name}</p>
            </div>
            <div className="mt-3.5">
              <ColorwaySwatches
                colorways={frame.colorways}
                selected={colorway.id}
                onSelect={setLens}
              />
            </div>
            <p className="mt-3.5 max-w-md text-sm leading-relaxed text-stone">
              {colorway.lensDescription}
            </p>
          </div>

          <EditionNote frame={frame} colorway={colorway} className="mt-6" />

          <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
            <Button
              className="flex-1"
              disabled={!colorway.availableForSale}
              onClick={() => reserve(frame, colorway)}
            >
              {colorway.availableForSale
                ? fill(dict.commerce.reserveFor, {
                    price: price(frame.priceBook),
                  })
                : dict.commerce.spokenFor}
            </Button>
            <ButtonLink
              href={`/vision-studio?lens=${colorway.id}`}
              variant="outline"
              className="flex-1"
            >
              {dict.commerce.tryItOn}
            </ButtonLink>
          </div>

          <p className="mt-3 text-xs text-stone">
            {fill(dict.commerce.shipsFull, { month: frame.shipsFrom })}{" "}
            <Link
              href={`/collection/${frame.handle}?lens=${colorway.id}`}
              className="text-obsidian underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {dict.commerce.fullSpecification}
            </Link>
          </p>

          <TrustRow className="mt-8 border border-ivory-hairline" />
        </div>
      </div>
    </section>
  );
}
