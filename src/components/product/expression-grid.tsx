import { ColorwayCard } from "@/components/product/colorway-card";
import { Reveal } from "@/components/ui/reveal";
import type { Frame } from "@/lib/catalog/types";

/**
 * Six cuts of one silhouette, so the only question the page asks is "which
 * lens". That comparison needs tiles of equal size on a shared baseline —
 * an offset editorial spread makes two frames look different when the only
 * difference is the glass.
 */
export function ExpressionGrid({ frame }: { frame: Frame }) {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8">
      {frame.colorways.map((colorway, index) => (
        <Reveal key={colorway.id} delay={(index % 3) * 70}>
          <ColorwayCard
            frame={frame}
            colorway={colorway}
            priority={index === 0}
          />
        </Reveal>
      ))}
    </div>
  );
}
