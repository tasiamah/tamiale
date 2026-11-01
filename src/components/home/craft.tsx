import Image from "next/image";

import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Frame } from "@/lib/catalog/types";

/**
 * The making of the frame, told with a photograph.
 *
 * The product page's `Craftsmanship` stood here as well, which put a
 * dimensioned technical drawing and a table of seven millimetre figures on
 * the front of the shop. Those are the right things to meet once someone is
 * considering a purchase and the wrong ones to meet before the object has
 * been shown at all, and it was one component rendering twice, so the
 * product page keeps it and nothing is lost.
 *
 * What is left is the part of the story that reads to a stranger: the three
 * material notes, against a picture of the thing they describe.
 */
export async function Craft({
  frame,
  index = "03",
}: {
  frame: Frame;
  index?: string;
}) {
  const dict = await getDictionary();

  return (
    <section className="border-t border-ivory-hairline bg-ivory">
      <div className="gutter section-y">
        <div className="grid items-start gap-16 lg:grid-cols-[1.15fr_1fr] lg:gap-24">
          {/*
           * Square with the top of the text and left at its own proportion.
           * Stretching it to the height of the three material notes beside
           * it meant cropping a four by three frame to very nearly a
           * square, and what went was the empty lit wall above the stone,
           * which is the reason the picture is worth having.
           */}
          <Reveal>
            <Image
              src="/media/editorial/craft-stone.jpg"
              alt={dict.home.craftAlt}
              width={1152}
              height={864}
              sizes="(max-width: 1024px) 92vw, 56vw"
              quality={90}
              className="w-full"
            />
          </Reveal>

          {/*
           * Ranged left. This is a column beside a picture, not a title
           * centred over a page, and the default centring would set the
           * text against the photograph's own edge rather than with it.
           */}
          <div>
            <SectionHeading
              align="left"
              index={index}
              eyebrow={dict.home.craftEyebrow}
              title={dict.home.materialTitle}
              lede={dict.home.materialLede}
            />

            <div className="mt-14 flex flex-col gap-10">
              {frame.materials.map((material) => (
                <Reveal key={material.heading} delay={80}>
                  <h3 className="display-md">{material.heading}</h3>
                  <p className="mt-3 max-w-md text-sm leading-relaxed text-stone">
                    {material.body}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
