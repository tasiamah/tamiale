import { FrameDrawing } from "@/components/product/frame-drawing";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import { getDictionary } from "@/lib/i18n/dictionary";
import type { Frame } from "@/lib/catalog/types";

export async function Craftsmanship({
  frame,
  index = "05",
}: {
  frame: Frame;
  index?: string;
}) {
  const dict = await getDictionary();

  return (
    <section
      id="craftsmanship"
      className="border-t border-ivory-hairline bg-ivory scroll-mt-(--header-height)"
    >
      <div className="gutter section-y">
        <SectionHeading
          index={index}
          eyebrow={dict.home.craftEyebrow}
          title={dict.home.craftTitle}
          lede={dict.home.craftLede}
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal>
            <figure className="bg-ivory-dim px-6 py-16 sm:px-16 sm:py-24">
              <FrameDrawing frame={frame} />
              <figcaption className="hairline-t mt-12 pt-5 text-xs text-stone-dim">
                {frame.name}, {dict.commerce.frontElevationMm}
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-14">
            <Reveal delay={80}>
              <h3 className="eyebrow text-stone-dim">{dict.commerce.details.measurements}</h3>
              <dl className="mt-8">
                {frame.measurements.map((measurement) => (
                  <div
                    key={measurement.label}
                    className="hairline-b flex items-baseline justify-between gap-8 py-5"
                  >
                    <dt className="text-sm text-stone">
                      {measurement.label}
                      {measurement.note && (
                        <span className="mt-1 block text-xs text-stone-dim">
                          {measurement.note}
                        </span>
                      )}
                    </dt>
                    <dd className="frame-name figure-num shrink-0 text-base">{measurement.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={160}>
              <h3 className="eyebrow text-stone-dim">{dict.commerce.details.materials}</h3>
              <div className="mt-8 flex flex-col gap-10">
                {frame.materials.map((material) => (
                  <div key={material.heading}>
                    <h4 className="display-md">{material.heading}</h4>
                    <p className="mt-3 text-sm leading-relaxed text-stone">
                      {material.body}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
