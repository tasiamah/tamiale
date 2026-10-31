"use client";

import Image from "next/image";
import { useState } from "react";

import { Link } from "@/components/i18n/link";
import { useRegion } from "@/components/chrome/region-provider";
import { EditionNote } from "@/components/commerce/edition-note";
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
 *
 * What is deliberately absent is the reassurance list. Shipping, returns and
 * warranty belong on the frame page, where someone is deciding; putting them
 * under the opening statement turns a shop window into a checkout.
 */
export function Hero({ frame }: { frame: Frame }) {
  const [lens, setLens] = useState(frame.colorways[0].id);
  const colorway = findColorway(frame, lens);
  const dict = useDictionary();
  const { price, taxNote } = useRegion();
  const reserve = useReserve();

  return (
    <section className="gutter pt-16 pb-24 lg:pt-24 lg:pb-32">
      <div className="hairline-b flex flex-col gap-10 pb-14 lg:flex-row lg:items-end lg:justify-between lg:gap-24">
        <h1 className="display-hero max-w-[13ch] text-balance">
          {dict.meta.statement}
        </h1>
        <p className="body-lg max-w-sm text-pretty text-stone lg:pb-4">
          {dict.home.heroLede}
        </p>
      </div>

      <div className="grid gap-14 pt-14 lg:grid-cols-12 lg:gap-20 lg:pt-20">
        <figure className="lg:col-span-7">
          <div className="plate flex aspect-5/4 items-center justify-center px-[2%] sm:aspect-16/10">
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
          <figcaption className="mt-5 flex justify-between text-xs text-stone-dim">
            <span>
              {frame.name} · {colorway.frameFinish} / {colorway.name}
            </span>
            <span className="figure-num">{colorway.sku}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-5 lg:self-center">
          <p className="eyebrow text-stone">{frame.collection}</p>

          <div className="mt-5 flex items-baseline justify-between gap-6">
            <h2 className="frame-name text-5xl md:text-6xl">{frame.name}</h2>
            <p className="frame-name figure-num text-3xl text-stone md:text-[2.125rem]">
              {price(frame.priceBook)}
            </p>
          </div>
          <p className="mt-3 text-xs text-stone-dim">{taxNote}</p>

          <p className="mt-8 max-w-md text-pretty leading-relaxed text-stone">
            {frame.tagline}
          </p>

          <div className="mt-12">
            <div className="flex items-baseline justify-between">
              <p className="eyebrow text-stone">{dict.commerce.lens}</p>
              <p className="text-sm">{colorway.name}</p>
            </div>
            <div className="mt-5">
              <ColorwaySwatches
                colorways={frame.colorways}
                selected={colorway.id}
                onSelect={setLens}
              />
            </div>
            <p className="mt-5 max-w-md text-sm leading-relaxed text-stone">
              {colorway.lensDescription}
            </p>
          </div>

          <EditionNote frame={frame} colorway={colorway} className="mt-10" />

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <Button
              className="flex-1"
              disabled={!colorway.availableForSale}
              onClick={() => reserve(frame, colorway)}
            >
              {colorway.availableForSale
                ? dict.commerce.reserve
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

          <p className="mt-6 text-xs text-stone-dim">
            {fill(dict.commerce.shipsFull, { month: frame.shipsFrom })}{" "}
            <Link
              href={`/collection/${frame.handle}?lens=${colorway.id}`}
              className="text-obsidian underline underline-offset-4 transition-opacity hover:opacity-60"
            >
              {dict.commerce.fullSpecification}
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
