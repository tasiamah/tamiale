import type { Metadata } from "next";

import { Hero } from "@/components/home/hero";
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
    title: `${site.name} · ${dict.meta.statement}`,
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
      <Hero frame={frame} />

      <section
        id="collection"
        className="border-t border-ivory-hairline bg-ivory scroll-mt-(--header-height)"
      >
        <div className="gutter section-y">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              index="02"
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
            <Reveal delay={120}>
              <ButtonLink href="/collection" variant="outline">
                {dict.commerce.fullCollection}
              </ButtonLink>
            </Reveal>
          </div>

          <div className="mt-20">
            <ExpressionGrid frame={frame} />
          </div>
        </div>
      </section>

      {/*
       * Try-on before story: the mirror is the thing that converts a visitor
       * who likes the frame but cannot picture it on their own face.
       */}
      <VisionTeaser frame={frame} />
      <Craftsmanship frame={frame} />
      <Philosophy />
      <PrivateAccess />
    </>
  );
}
