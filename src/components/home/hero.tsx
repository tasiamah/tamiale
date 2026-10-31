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
 * The opening of the store. The object is named first and the slogan is gone:
 * houses of this kind open on the thing they make, not on a line about it.
 * The frame, its price, its three lenses and a way to buy it are all above
 * the fold. A visitor should never have to go looking for the product on the
 * page that is selling it.
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
    <section className="gutter pt-20 pb-24 lg:pt-28 lg:pb-32">
      {/*
       * Centred rather than set across the page. A name squared up in the
       * middle of its own empty paper is the oldest formal gesture a house
       * has, and it costs nothing to make; the asymmetric spread this
       * replaces read as a design studio, not a maison.
       *
       * No full stop after the name. A product is a proper noun, and
       * punctuating it is what turns a nameplate back into a slogan.
       */}
      <div className="mx-auto flex max-w-2xl flex-col items-center text-center">
        <p className="eyebrow text-stone">{frame.collection}</p>
        <h1 className="display-hero mt-5 text-balance">{frame.name}</h1>
        <p className="body-lg mt-7 max-w-md text-pretty text-stone">
          {dict.home.heroLede}
        </p>
      </div>

      <div className="grid gap-14 pt-24 lg:grid-cols-12 lg:gap-20 lg:pt-32">
        <figure className="lg:col-span-7">
          {/*
           * Capped near the photograph's own width. It was being blown up to
           * roughly 840px from a 698px master, and a soft product shot is the
           * one thing a luxury store cannot survive. Small and sharp on a lot
           * of paper reads as more expensive than large and approximate.
           */}
          <div className="plate flex items-center justify-center py-8">
            <Image
              src={colorway.image.src}
              alt={colorway.image.alt}
              width={colorway.image.width}
              height={colorway.image.height}
              sizes="(max-width: 1024px) 88vw, 640px"
              className="w-full max-w-[640px]"
            />
          </div>
          <figcaption className="mt-8 flex justify-between text-xs text-stone-dim">
            <span>
              {frame.name} · {colorway.frameFinish} / {colorway.name}
            </span>
            <span className="figure-num">{colorway.sku}</span>
          </figcaption>
        </figure>

        <div className="lg:col-span-5 lg:self-center">
          {/*
           * The column is anchored by the description rather than by the
           * name, because the name is now the headline of this same section
           * and setting it twice would read as a mistake rather than as
           * emphasis.
           */}
          <h2 className="display-md max-w-md text-balance">{frame.tagline}</h2>

          {/*
           * The price sits under the description at reading size, not beside
           * the name at display size. A figure set as large as the product it
           * belongs to is how a discount site opens a conversation.
           */}
          <p className="figure-num mt-7 text-base">
            {price(frame.priceBook)}
            <span className="ml-3 text-xs text-stone-dim">{taxNote}</span>
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
