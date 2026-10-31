import { FrameDrawing } from "@/components/product/frame-drawing";
import { Reveal } from "@/components/ui/reveal";
import { SectionHeading } from "@/components/ui/section-heading";
import type { Frame } from "@/lib/catalog/types";

export function Craftsmanship({
  frame,
  index = "05",
}: {
  frame: Frame;
  index?: string;
}) {
  return (
    <section
      id="craftsmanship"
      className="border-t border-ivory-hairline bg-ivory scroll-mt-(--header-height)"
    >
      <div className="gutter py-24 md:py-32">
        <SectionHeading
          index={index}
          eyebrow="Craftsmanship"
          title="What the measurements actually mean."
          lede="Rather than claim quality, the house publishes the figures and the processes behind them. Every number below appears on the technical drawing."
        />

        <div className="mt-20 grid gap-16 lg:grid-cols-[1.1fr_1fr] lg:gap-24">
          <Reveal>
            <figure className="bg-ivory-dim px-6 py-12 sm:px-14 sm:py-16">
              <FrameDrawing frame={frame} />
              <figcaption className="mt-10 flex items-baseline justify-between border-t border-ivory-hairline pt-4 text-xs text-stone">
                <span>{frame.name} front elevation</span>
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
