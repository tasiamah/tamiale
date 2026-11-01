"use client";

import dynamic from "next/dynamic";
import Image from "next/image";
import { useCallback, useState, useSyncExternalStore } from "react";

import { Link } from "@/components/i18n/link";
import { useSavedFrames } from "@/components/account/saved-frames-provider";
import { useRegion } from "@/components/chrome/region-provider";
import { EditionNote } from "@/components/commerce/edition-note";
import { StickyBuyBar } from "@/components/commerce/sticky-buy-bar";
import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { TrustRow } from "@/components/commerce/trust-row";
import { ApplePayButton } from "@/components/commerce/apple-pay-button";
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

const noopSubscribe = () => () => {};
/** Read once on the client; `selectColorway` is the source of truth after. */
const readLens = () => new URLSearchParams(window.location.search).get("lens");
const noLensOnServer = () => null;

/** Which sentence in `dict.commerce` describes each framing. */
const ALT_KEY = {
  threeQuarter: "altThreeQuarter",
  front: "altFront",
  side: "altSide",
  folded: "altFolded",
  worn: "altWorn",
  wornAngle: "altWornAngle",
} as const;

export function ProductStage({
  frame,
  applePay = false,
}: {
  frame: Frame;
  /** Whether the house can actually take a wallet payment yet. */
  applePay?: boolean;
}) {
  /*
   * The page is prerendered, so the server cannot know `?lens`. It renders
   * the first lens and the reader's choice is swapped in on hydration, which
   * costs a shared link one frame of the wrong tint and buys the page a
   * static shell. Same geometry either way, so nothing moves.
   */
  const lensInUrl = useSyncExternalStore(
    noopSubscribe,
    readLens,
    noLensOnServer,
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const colorwayId = chosen ?? lensInUrl ?? frame.colorways[0].id;
  const setColorwayId = setChosen;
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
    <div className="gutter grid gap-16 pb-28 lg:grid-cols-[1.2fr_1fr] lg:gap-24">
      <div>
        <div className="flex gap-8 pb-6">
          {mediaViews.map((entry) => (
            <button
              key={entry.id}
              type="button"
              aria-pressed={view === entry.id}
              onClick={() => setView(entry.id)}
              className={cn(
                "eyebrow relative cursor-pointer pb-2 transition-colors duration-500 ease-tamiale",
                view === entry.id
                  ? "text-obsidian"
                  : "text-stone-dim hover:text-obsidian",
              )}
            >
              {entry.label}
              <span
                aria-hidden
                className={cn(
                  "absolute inset-x-0 bottom-0 h-px bg-obsidian transition-opacity duration-500 ease-tamiale",
                  view === entry.id ? "opacity-100" : "opacity-0",
                )}
              />
            </button>
          ))}
        </div>

        {view === "studio" && (
          <figure>
            {/*
             * Four views of the object and then two of it worn, stacked at
             * the full width of the column rather than shrunk into a grid.
             * This is the one column on the page a shopper came to look at,
             * the buy side is sticky beside it, and a frame argued on its
             * angles is not argued at thumbnail size.
             *
             * Only the first is eager. The rest are a scroll away and the
             * largest paint is decided on the first.
             */}
            {colorway.angles.map((angle, index) => (
              <div
                key={angle.id}
                className={cn(
                  "plate flex aspect-4/3 items-center justify-center bg-studio",
                  index > 0 && "mt-5",
                )}
              >
                <Image
                  src={angle.src}
                  alt={fill(dict.commerce[ALT_KEY[angle.id]], {
                    name: frame.name,
                    lens: colorway.name,
                  })}
                  width={angle.width}
                  height={angle.height}
                  fetchPriority={index === 0 ? "high" : undefined}
                  loading={index === 0 ? "eager" : undefined}
                  sizes="(max-width: 1024px) 88vw, 640px"
                  className="w-full max-w-[640px]"
                />
              </div>
            ))}

            {colorway.worn.map((shot) => (
              <Image
                key={shot.id}
                src={shot.src}
                alt={fill(dict.commerce[ALT_KEY[shot.id]], {
                  name: frame.name,
                  lens: colorway.name,
                })}
                width={shot.width}
                height={shot.height}
                quality={90}
                sizes="(max-width: 1024px) 92vw, 48vw"
                className="mt-5 w-full"
              />
            ))}

            <figcaption className="mt-8 flex justify-between text-xs text-stone-dim">
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
            <figcaption className="mt-5 flex justify-between text-xs text-stone-dim">
              <span>{dict.commerce.frontElevationMm}</span>
              <span>{dict.commerce.drawingPlaceholder}</span>
            </figcaption>
          </figure>
        )}

        <div className="mt-8 grid grid-cols-2 gap-5 sm:grid-cols-4">
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
                "flex cursor-pointer items-center justify-center px-3 py-3",
                "border-b transition-all duration-500 ease-tamiale",
                entry.id === colorway.id
                  ? "border-obsidian opacity-100"
                  : "border-transparent opacity-40 hover:border-ivory-hairline hover:opacity-85",
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

      <div className="lg:sticky lg:top-[calc(var(--chrome-height)+1.75rem)] lg:self-start">
        <p className="eyebrow text-stone">{frame.collection}</p>
        {/* Serif is the house's product voice: names and prices only. */}
        <h1 className="frame-name mt-4 text-[2.75rem] leading-none">
          {frame.name}
        </h1>

        <p className="body-lg mt-7 max-w-md text-pretty text-stone-dim">
          {frame.tagline}
        </p>

        {/* Reading size, below the description, as on the homepage. */}
        <p className="figure-num mt-7 text-base">
          {price(frame.priceBook)}
          <span className="ml-3 text-xs text-stone">{taxNote}</span>
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

        <div className="hairline-t mt-12 pt-6">
          <EditionNote frame={frame} colorway={colorway} />
          <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
            {fill(dict.commerce.preorderNote, { month: frame.shipsFrom })}
          </p>
        </div>

        <Button
          // Watched by the sticky bar, which stands down while this is in
          // view rather than putting two Reserve buttons on one screen.
          data-buy-panel
          className="mt-10 w-full"
          disabled={!colorway.availableForSale}
          onClick={() => reserve(frame, colorway)}
        >
          {colorway.availableForSale
            ? dict.commerce.reserve
            : dict.commerce.expressionSpokenFor}
        </Button>

        <ApplePayButton
          frame={frame}
          colorway={colorway}
          configured={applePay}
        />

        <ButtonLink
          href={`/vision-studio?lens=${colorway.id}`}
          variant="outline"
          className="mt-3 w-full"
        >
          {dict.commerce.seeItOnYourFace}
        </ButtonLink>

        <TrustRow className="mt-12" />

        <div className="hairline-t mt-8 flex items-center justify-between pt-6 text-xs">
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

        <div className="mt-16">
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
      <summary className="flex cursor-pointer list-none items-center justify-between py-5 eyebrow transition-opacity duration-500 ease-tamiale hover:opacity-60 marker:content-none">
        {summary}
        <span
          aria-hidden
          className="text-stone transition-transform duration-500 ease-tamiale group-open:rotate-45"
        >
          +
        </span>
      </summary>
      <div className="pb-8 text-sm">{children}</div>
    </details>
  );
}
