import { FrameDrawing } from "@/components/product/frame-drawing";
import { QuietLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import type { Frame } from "@/lib/catalog/types";

export function Philosophy({ frame }: { frame: Frame }) {
  return (
    <section className="relative isolate overflow-hidden border-t border-ivory-hairline bg-ivory">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-1/2 -z-10 -translate-y-1/2 opacity-[0.045]"
      >
        <FrameDrawing frame={frame} dimensions={false} className="w-full" />
      </div>

      <div className="gutter py-28 md:py-40">
        <Reveal className="mx-auto max-w-4xl text-center">
          <p className="eyebrow text-stone">03 — The House</p>
          <p className="display-lg mt-10 text-balance leading-[1.15]">
            True luxury is never accidental. It is found in the balance of form,
            precision and identity.
            <span className="text-stone">
              {" "}
              Tamiale creates eyewear for individuals who never needed
              permission to stand apart.
            </span>
          </p>
          <div className="mt-14 flex justify-center">
            <QuietLink href="/house" className="text-obsidian">
              Read the house file
            </QuietLink>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
