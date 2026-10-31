import type { Metadata } from "next";

import { ExpressionGrid } from "@/components/product/expression-grid";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { forthcomingFrames, theMarina } from "@/lib/catalog/frames";
import { getFrames } from "@/lib/shopify/catalog";

export const metadata: Metadata = {
  title: "The Collection",
  description:
    "Collection 001 — The Icons. The Marina, an architectural silhouette in Onyx acetate, released in three lens expressions and open for pre-order.",
  alternates: { canonical: "/collection" },
};

export default async function CollectionPage() {
  const frames = await getFrames();
  const frame = frames[0] ?? theMarina;

  return (
    <>
      <header className="gutter border-b border-ivory-hairline py-20 md:py-28">
        <Reveal className="max-w-4xl">
          <p className="eyebrow text-stone">{frame.collection}</p>
          <h1 className="display-hero mt-8 text-balance">The Icons.</h1>
          <p className="body-lg mt-10 max-w-xl text-pretty text-stone-dim">
            The house opens with one silhouette rather than a catalogue. The
            Marina is drawn as a flattened hexagon — eight edges where most
            frames use a curve — and released in a single Onyx acetate with three
            lenses, each specified by the light it lets through.
          </p>
        </Reveal>

        <dl className="mt-16 grid gap-y-8 border-t border-ivory-hairline pt-8 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Silhouettes released", "1"],
            ["Lens expressions", String(frame.colorways.length)],
            ["Edition", frame.edition],
            ["Dispatch", frame.shipsFrom],
          ].map(([label, value]) => (
            <div key={label}>
              <dt className="eyebrow text-stone">{label}</dt>
              <dd className="mt-3 font-display text-3xl">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section id="expressions" className="gutter scroll-mt-(--header-height) py-20 md:py-28">
        <ExpressionGrid frame={frame} />
      </section>

      <section className="grain border-t border-ivory-hairline bg-ivory text-obsidian">
        <div className="gutter py-24 md:py-32">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow text-stone">The silhouette</p>
              <h2 className="display-xl mt-6 text-balance">{frame.name}</h2>
              <p className="body-lg mt-8 max-w-md text-pretty text-stone">
                {frame.tagline}
              </p>
              <ButtonLink
                href={`/collection/${frame.handle}`}
                tone="obsidian"
                variant="outline"
                className="mt-10"
              >
                Open the frame
              </ButtonLink>
            </Reveal>
            <Reveal delay={120} className="flex flex-col gap-7">
              {frame.story.map((paragraph) => (
                <p
                  key={paragraph.slice(0, 32)}
                  className="text-pretty text-stone"
                >
                  {paragraph}
                </p>
              ))}
            </Reveal>
          </div>
        </div>
      </section>

      <section
        id="register"
        className="gutter scroll-mt-(--header-height) border-t border-ivory-hairline py-24 md:py-32"
      >
        <SectionHeading
          eyebrow="The register"
          title="Drawn, and not yet released."
          lede="Four further silhouettes complete Collection 001. They are in development and cannot be ordered. The house register is told when each one is ready, before anyone else."
        />

        <ul className="mt-16 border-t border-ivory-hairline">
          {forthcomingFrames.map((item, index) => (
            <Reveal
              as="li"
              key={item.name}
              delay={index * 60}
              className="grid grid-cols-1 items-baseline gap-2 border-b border-ivory-hairline py-7 sm:grid-cols-[1.2fr_1fr_1fr_auto] sm:gap-8"
            >
              <span className="display-md text-stone">{item.name}</span>
              <span className="text-sm text-stone-dim">{item.personality}</span>
              <span className="text-sm text-stone-dim">{item.character}</span>
              <span className="eyebrow text-stone sm:text-right">
                In development
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200} className="mt-14">
          <ButtonLink href="/private-client" variant="outline">
            Join the register
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
