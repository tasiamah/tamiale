import type { Metadata } from "next";

import { ExpressionGrid } from "@/components/product/expression-grid";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { forthcomingFor, framesFor } from "@/lib/catalog/content";
import { theMarina } from "@/lib/catalog/frames";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  return {
    title: dict.collection.metaTitle,
    description: dict.collection.metaDescription,
    alternates: alternatesFor("/collection", await getLocale()),
  };
}

export default async function CollectionPage() {
  const dict = await getDictionary();
  const frames = await framesFor();
  const frame = frames[0] ?? theMarina;
  const forthcoming = await forthcomingFor();

  return (
    <>
      <header className="gutter border-b border-ivory-hairline section-y">
        <Reveal className="mx-auto flex max-w-2xl flex-col items-center text-center">
          <p className="eyebrow text-stone">{frame.collection}</p>
          <h1 className="display-hero mt-8 text-balance">{dict.collection.title}</h1>
          <p className="body-lg mt-8 max-w-xl text-pretty text-stone-dim">
            {dict.collection.lede}
          </p>
        </Reveal>

        <dl className="mt-20 grid gap-y-10 border-t border-ivory-hairline pt-10 sm:grid-cols-2 lg:grid-cols-4">
          {[
            [dict.collection.stats.silhouettes, "1"],
            [dict.collection.stats.expressions, String(frame.colorways.length)],
            [dict.collection.stats.edition, frame.edition],
            [dict.collection.stats.shipping, frame.shipsFrom],
          ].map(([label, value]) => (
            <div key={label} className="text-center">
              <dt className="eyebrow text-stone">{label}</dt>
              <dd className="mt-3 font-display text-2xl">{value}</dd>
            </div>
          ))}
        </dl>
      </header>

      <section id="expressions" className="gutter scroll-mt-(--header-height) section-y">
        <ExpressionGrid frame={frame} />
      </section>

      <section className="grain border-t border-ivory-hairline bg-ivory text-obsidian">
        <div className="gutter section-y">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-24">
            <Reveal>
              <p className="eyebrow text-stone">{dict.collection.storyEyebrow}</p>
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
                {dict.collection.openFrame}
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
        className="gutter scroll-mt-(--header-height) border-t border-ivory-hairline section-y"
      >
        <SectionHeading
          eyebrow={dict.collection.eyebrow}
          title={
            <>
              {dict.collection.upcomingTitleFirst}
              <br />
              {dict.collection.upcomingTitleSecond}
            </>
          }
          lede={dict.collection.upcomingLede}
        />

        <ul className="mt-16 border-t border-ivory-hairline">
          {forthcoming.items.map((item, index) => (
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
                {forthcoming.inDevelopment}
              </span>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={200} className="mt-14">
          <ButtonLink href="/private-client" variant="outline">
            {dict.collection.joinRegister}
          </ButtonLink>
        </Reveal>
      </section>
    </>
  );
}
