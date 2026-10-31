"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState } from "react";

import { Link } from "@/components/i18n/link";
import { useSavedFrames } from "@/components/account/saved-frames-provider";
import { useRegion } from "@/components/chrome/region-provider";
import { EditionNote } from "@/components/commerce/edition-note";
import { StickyBuyBar } from "@/components/commerce/sticky-buy-bar";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { TrustRow } from "@/components/commerce/trust-row";
import { useReserve } from "@/components/commerce/use-reserve";
import { ColorwaySwatches } from "@/components/product/colorway-swatches";
import { FrameDrawing } from "@/components/product/frame-drawing";
import { Button, ButtonLink } from "@/components/ui/button";
import { cn } from "@/lib/cn";
import { findColorway } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";

/** The atelier pulls in three.js, so it is only fetched if the tab is opened. */
const Atelier = dynamic(
  () => import("@/components/atelier/atelier").then((module) => module.Atelier),
  {
    ssr: false,
    loading: () => (
      <div className="flex aspect-4/3 items-center justify-center bg-ivory-dim">
        <p className="eyebrow text-stone">Preparing the atelier…</p>
      </div>
    ),
  },
);

type MediaView = "studio" | "atelier" | "elevation";


export function ProductStage({
  frame,
  initialColorwayId,
}: {
  frame: Frame;
  initialColorwayId: string;
}) {
  const [colorwayId, setColorwayId] = useState(initialColorwayId);
  const dict = useDictionary();
  const [view, setView] = useState<MediaView>("studio");
  const mediaViews: { id: MediaView; label: string }[] = [
    { id: "studio", label: dict.commerce.tabs.studio },
    { id: "atelier", label: dict.commerce.tabs.atelier },
    { id: "elevation", label: dict.commerce.tabs.elevation },
  ];
  const { price, taxNote, shippingNote } = useRegion();
  const reserve = useReserve();
  const { isSaved, toggleSaved, hydrated } = useSavedFrames();

  const colorway = findColorway(frame, colorwayId);
  const saved = hydrated && isSaved(frame.handle, colorway.id);

  const selectColorway = useCallback((id: string) => {
    setColorwayId(id);
    // Keeps the URL shareable without a navigation or a re-render of the page.
    window.history.replaceState(null, "", `?lens=${id}`);
  }, []);

  return (
    <div className="gutter grid gap-14 pb-20 lg:grid-cols-[1.15fr_1fr] lg:gap-20">
      <div>
        <div className="flex gap-1.5 pb-4">
          {mediaViews.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={view === entry.id}
              onClick={() => setView(entry.id)}
              className={cn(
                "cursor-pointer border px-3.5 py-2.5 text-[0.625rem] font-medium tracking-[0.16em] uppercase transition-colors duration-300",
                view === entry.id
                  ? "border-obsidian bg-obsidian text-ivory"
                  : "border-obsidian/15 text-stone hover:border-obsidian/50 hover:text-obsidian",
              )}
            >
              {entry.label}
            </button>
          ))}
        </div>

        {view === "studio" && (
          <figure>
            <div className="flex aspect-4/3 items-center justify-center bg-ivory-dim px-[7%]">
              <Image
                src={colorway.image.src}
                alt={colorway.image.alt}
                width={colorway.image.width}
                height={colorway.image.height}
                priority
                sizes="(max-width: 1024px) 94vw, 56vw"
                className="w-full"
              />
            </div>
            <figcaption className="mt-4 flex justify-between text-xs text-stone">
              <span>
                {frame.name} · {colorway.frameFinish} / {colorway.name}
              </span>
              <span className="tabular-nums">{colorway.sku}</span>
            </figcaption>
          </figure>
        )}

        {view === "atelier" && (
          <Atelier
            frame={frame}
            colorway={colorway}
            className="aspect-4/3 w-full"
          />
        )}

        {view === "elevation" && (
          <figure>
            <div className="flex aspect-4/3 items-center justify-center bg-ivory-dim px-[8%]">
              <FrameDrawing frame={frame} />
            </div>
            <figcaption className="mt-4 flex justify-between text-xs text-stone">
              <span>{dict.commerce.frontElevationMm}</span>
              <span>{dict.commerce.drawingPlaceholder}</span>
            </figcaption>
          </figure>
        )}

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {frame.colorways.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                selectColorway(entry.id);
                setView("studio");
              }}
              aria-label={`View ${entry.name}`}
              className={cn(
                "flex cursor-pointer items-center justify-center bg-ivory-dim px-3 py-2 transition-opacity duration-500",
                entry.id === colorway.id
                  ? "opacity-100 outline outline-obsidian"
                  : "opacity-50 hover:opacity-90",
              )}
            >
              <Image
                src={entry.image.src}
                alt=""
                width={entry.image.width}
                height={entry.image.height}
                sizes="140px"
                className="w-full"
              />
            </button>
          ))}
        </div>
      </div>

      <div className="lg:sticky lg:top-28 lg:self-start">
        <p className="eyebrow text-stone">{frame.collection}</p>
        {/* Serif is the house's product voice: names and prices only. */}
        <h1 className="frame-name mt-4 text-6xl leading-none">{frame.name}</h1>

        <div className="mt-5 flex items-baseline gap-4">
          <p className="frame-name text-3xl">{price(frame.priceBook)}</p>
          <p className="text-xs text-stone">{taxNote}</p>
        </div>

        <p className="body-lg mt-7 max-w-md text-pretty text-stone-dim">
          {frame.tagline}
        </p>

        <div className="mt-10">
          <div className="flex items-baseline justify-between">
            <p className="eyebrow text-stone">{dict.commerce.lens}</p>
            <p className="text-sm">
              {colorway.frameFinish} / {colorway.name}
            </p>
          </div>
          <div className="mt-4">
            <ColorwaySwatches
              colorways={frame.colorways}
              selected={colorway.id}
              onSelect={selectColorway}
            />
          </div>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-stone-dim">
            {colorway.lensDescription}
          </p>
          <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-2 text-xs text-stone">
            <div className="flex gap-2">
              <dt>{dict.commerce.transmission}</dt>
              <dd className="figure-num text-obsidian">{colorway.vlt}%</dd>
            </div>
            <div className="flex gap-2">
              <dt>{dict.commerce.filterCategory}</dt>
              <dd className="figure-num text-obsidian">
                {colorway.filterCategory}
              </dd>
            </div>
          </dl>
        </div>

        <div className="mt-8 border border-ivory-hairline bg-ivory-dim/60 px-5 py-4">
          <EditionNote frame={frame} colorway={colorway} />
          <p className="mt-2.5 text-sm leading-relaxed text-stone">
            {fill(dict.commerce.preorderNote, { month: frame.shipsFrom })}
          </p>
        </div>

        <Button
          className="mt-6 w-full"
          disabled={!colorway.availableForSale}
          onClick={() => reserve(frame, colorway)}
        >
          {colorway.availableForSale
            ? fill(dict.commerce.reserveThisPair, {
                price: price(frame.priceBook),
              })
            : dict.commerce.expressionSpokenFor}
        </Button>

        <ButtonLink
          href={`/vision-studio?lens=${colorway.id}`}
          variant="outline"
          className="mt-2.5 w-full"
        >
          {dict.commerce.seeItOnYourFace}
        </ButtonLink>

        <TrustRow className="mt-6 border border-ivory-hairline" />

        <div className="mt-6 flex items-center justify-between text-xs">
          <button
            type="button"
            onClick={() => toggleSaved(frame.handle, colorway.id)}
            className="cursor-pointer text-stone underline-offset-4 transition-colors hover:text-obsidian hover:underline"
          >
            {saved ? dict.commerce.saved : dict.commerce.saveForLater}
          </button>
          <Link
            href="/private-client"
            className="text-stone underline-offset-4 transition-colors hover:text-obsidian hover:underline"
          >
            {dict.commerce.speakToAdvisor}
          </Link>
        </div>

        <div className="mt-12">
          <Detail summary={dict.commerce.details.measurements}>
            <dl>
              {frame.measurements.map((measurement) => (
                <div
                  key={measurement.label}
                  className="flex items-baseline justify-between gap-6 border-b border-ivory-hairline py-2.5 last:border-0"
                >
                  <dt className="text-stone-dim">{measurement.label}</dt>
                  <dd className="tabular-nums">{measurement.value}</dd>
                </div>
              ))}
            </dl>
          </Detail>
          <Detail summary={dict.commerce.details.materials}>
            <div className="flex flex-col gap-5">
              {frame.materials.map((material) => (
                <div key={material.heading}>
                  <h3 className="text-obsidian">{material.heading}</h3>
                  <p className="mt-1.5 leading-relaxed text-stone-dim">
                    {material.body}
                  </p>
                </div>
              ))}
            </div>
          </Detail>
          <Detail summary={dict.commerce.details.delivery}>
            <p className="leading-relaxed text-stone-dim">
              {fill(dict.commerce.details.deliveryBody, {
                note: shippingNote,
                month: frame.shipsFrom,
              })}
            </p>
          </Detail>
        </div>
      </div>

      <StickyBuyBar frame={frame} colorway={colorway} />
    </div>
  );
}

function Detail({
  summary,
  children,
}: {
  summary: string;
  children: React.ReactNode;
}) {
  return (
    <details className="group border-t border-ivory-hairline last:border-b">
      <summary className="flex cursor-pointer list-none items-center justify-between py-4 eyebrow marker:content-none">
        {summary}
        <span
          aria-hidden
          className="text-stone transition-transform duration-500 ease-tamiale group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-6 text-sm">{children}</div>
    </details>
  );
}
