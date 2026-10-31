import type { Metadata } from "next";

import { Editorial } from "@/components/home/editorial";
import { Philosophy } from "@/components/home/philosophy";
import { PrivateAccess } from "@/components/home/private-access";
import { VisionTeaser } from "@/components/home/vision-teaser";
import { Craftsmanship } from "@/components/product/craftsmanship";
import { ExpressionGrid } from "@/components/product/expression-grid";
import { ButtonLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { theMarina } from "@/lib/catalog/frames";
import { framesFor } from "@/lib/catalog/content";
import { getDictionary, getLocale } from "@/lib/i18n/dictionary";
import { alternatesFor } from "@/lib/i18n/metadata";
import { site } from "@/lib/site";

export async function generateMetadata(): Promise<Metadata> {
  const dict = await getDictionary();
  const locale = await getLocale();
  return {
    title: `${dict.meta.homeTitle} · ${site.name}`,
    description: dict.meta.description,
    alternates: alternatesFor("/", locale),
  };
}

export default async function HomePage() {
  const dict = await getDictionary();
  const frames = await framesFor();
  const frame = frames[0] ?? theMarina;

  return (
    <>
      <Editorial />

      {/*
       * The three lenses are the first thing after the campaign frame.
       * What stood here was the frame on its own with a set of swatches
       * under it, which asked a visitor to click before they had seen what
       * there was to choose between. Showing all three at once answers the
       * only question the collection poses, and the choosing happens on
       * the frame's own page, where the measurements and the edition are.
       *
       * No rule along the top: the campaign above it already dissolves
       * into this paper, and a hairline across that would put a line
       * directly under the slogan.
       */}
      <section
        id="collection"
        className="bg-ivory scroll-mt-(--chrome-height)"
      >
        <div className="gutter section-y">
          <SectionHeading
            level={1}
            index="01"
            eyebrow={frame.collection}
            title={
              <>
                {dict.home.collectionTitleFirst}
                <br />
                {dict.home.collectionTitleSecond}
              </>
            }
            lede={dict.home.collectionLede}
          />

          <div className="mt-24">
            <ExpressionGrid frame={frame} />
          </div>

          {/* The way out of the section sits under it, on the centre line. */}
          <Reveal delay={120} className="mt-20 flex justify-center">
            <ButtonLink href="/collection" variant="outline">
              {dict.commerce.fullCollection}
            </ButtonLink>
          </Reveal>
        </div>
      </section>

      {/*
       * Try-on before story: the mirror is the thing that converts a visitor
       * who likes the frame but cannot picture it on their own face.
       */}
      <VisionTeaser frame={frame} />
      {/*
       * The numbers on this page ran 02, 04, 05, 03, 06: a sequence that
       * had been reordered without being renumbered. With the product
       * block gone they count again, which is the only thing a number on
       * a section is for.
       */}
      <Craftsmanship frame={frame} index="03" />
      <Philosophy />
      <PrivateAccess index="05" />
    </>
  );
}
