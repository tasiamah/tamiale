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
      <div className="gutter py-24 md:py-32">
        <SectionHeading
          index={index}
          eyebrow={dict.home.craftEyebrow}
          title={dict.home.craftTitle}
          lede={dict.home.craftLede}
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal>
            <figure className="bg-ivory-dim px-6 py-12 sm:px-14 sm:py-16">
              <FrameDrawing frame={frame} />
              <figcaption className="mt-10 flex items-baseline justify-between border-t border-ivory-hairline pt-4 text-xs text-stone">
                <span>{frame.name} {dict.commerce.frontElevation}</span>
                <span className="eyebrow">Millimetres</span>
              </figcaption>
            </figure>
          </Reveal>

          <div className="flex flex-col gap-14">
            <Reveal delay={80}>
              <h3 className="eyebrow text-stone">Measurements</h3>
              <dl className="mt-6">
                {frame.measurements.map((measurement) => (
                  <div
                    key={measurement.label}
                    className="flex items-baseline justify-between gap-6 border-b border-ivory-hairline py-3.5"
                  >
                    <dt className="text-sm text-stone-dim">
                      {measurement.label}
                      {measurement.note && (
                        <span className="block text-xs text-stone">
                          {measurement.note}
                        </span>
                      )}
                    </dt>
                    <dd className="text-sm tabular-nums">{measurement.value}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            <Reveal delay={160}>
              <h3 className="eyebrow text-stone">Materials and process</h3>
              <div className="mt-6 flex flex-col gap-8">
                {frame.materials.map((material) => (
                  <div key={material.heading}>
                    <h4 className="font-display text-xl">{material.heading}</h4>
                    <p className="mt-2.5 text-sm leading-relaxed text-stone-dim">
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
