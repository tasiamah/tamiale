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
import { getFrames } from "@/lib/shopify/catalog";
import { site } from "@/lib/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.statement}`,
  description: site.description,
  alternates: { canonical: "/" },
};

export default async function HomePage() {
  const frames = await getFrames();
  const frame = frames[0] ?? theMarina;

  return (
    <>
      <Hero frame={frame} />

      <section
        id="collection"
        className="border-t border-ivory-hairline bg-ivory scroll-mt-(--header-height)"
      >
        <div className="gutter py-24 md:py-32">
          <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <SectionHeading
              index="02"
              eyebrow={frame.collection}
              title={
                <>
                  Six lenses.
                  <br />
                  One silhouette.
                </>
              }
              lede="The Marina is released in a single Onyx acetate and six lens expressions, each with its own measured transmission. Choosing between them is a question of light, not of shape."
            />
            <Reveal delay={120}>
              <ButtonLink href="/collection" variant="outline">
                The full collection
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
