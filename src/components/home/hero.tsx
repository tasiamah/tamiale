import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import type { Frame } from "@/lib/catalog/types";

/**
 * Campaign film slot. Drop an art-directed loop at this path and the hero
 * plays it behind the product; until then the stage is lit in CSS.
 */
const CAMPAIGN_FILM: string | null = null;

export function Hero({ frame }: { frame: Frame }) {
  const hero = frame.colorways[0];

  return (
    <section
      data-stage="dark"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-obsidian text-ivory"
    >
      {/* Stage lighting: two slow, opposed washes that keep the black alive. */}
      <div aria-hidden className="absolute inset-0 -z-10">
        <div className="absolute top-[-20%] left-1/2 h-[80vmax] w-[80vmax] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(193,166,125,0.16),transparent_62%)] [animation:tamiale-drift_26s_ease-in-out_infinite]" />
        <div className="absolute right-[-15%] bottom-[-25%] h-[60vmax] w-[60vmax] rounded-full bg-[radial-gradient(circle,rgba(140,137,131,0.14),transparent_65%)] [animation:tamiale-drift_34s_ease-in-out_infinite_reverse]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(17,17,16,0.85))]" />
      </div>

      {CAMPAIGN_FILM && (
        <video
          className="absolute inset-0 -z-10 size-full object-cover opacity-60"
          autoPlay
          muted
          loop
          playsInline
          poster={hero.image.src}
        >
          <source src={CAMPAIGN_FILM} type="video/mp4" />
        </video>
      )}

      <div className="relative flex flex-1 items-center justify-center px-6 pt-(--header-height) pb-8">
        <div className="relative w-full max-w-5xl">
          <Image
            src={hero.image.src}
            alt={hero.image.alt}
            width={hero.image.width}
            height={hero.image.height}
            priority
            sizes="(max-width: 1024px) 94vw, 64rem"
            className="relative z-10 w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.55)]"
          />
          <div
            aria-hidden
            className="absolute inset-x-[12%] bottom-[-6%] z-0 h-24 rounded-[100%] bg-[radial-gradient(ellipse,rgba(0,0,0,0.65),transparent_70%)] blur-xl"
          />
        </div>
      </div>

      {/* Bottom padding clears the concierge pill in the corner. */}
      <div className="gutter relative z-10 pb-20 md:pb-24">
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl [animation:tamiale-rise_1.4s_var(--ease-tamiale)_0.25s_both]">
            <p className="eyebrow text-champagne">
              The First Collection — 001
            </p>
            <h1 className="display-hero mt-6 text-balance text-ivory">
              A Different
              <br />
              Perspective.
            </h1>
            <p className="body-lg mt-7 max-w-md text-pretty text-ivory/60">
              Eyewear conceived for those who see beyond convention.
            </p>
            <ButtonLink
              href="/collection"
              tone="ivory"
              variant="outline"
              className="mt-10"
            >
              Discover the Collection
            </ButtonLink>
          </div>

          {/* Held clear of the concierge pill in the bottom corner. */}
          <dl className="flex gap-10 text-ivory/45 [animation:tamiale-rise_1.4s_var(--ease-tamiale)_0.5s_both] lg:mb-16 lg:flex-col lg:gap-5 lg:text-right">
            <div>
              <dt className="eyebrow">Silhouette</dt>
              <dd className="mt-2 font-display text-xl text-ivory">
                {frame.name}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Expressions</dt>
              <dd className="mt-2 font-display text-xl text-ivory tabular-nums">
                {frame.colorways.length}
              </dd>
            </div>
            <div>
              <dt className="eyebrow">Release</dt>
              <dd className="mt-2 font-display text-xl text-ivory">
                {frame.shipsFrom}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
