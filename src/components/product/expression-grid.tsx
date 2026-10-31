import { ColorwayCard } from "@/components/product/colorway-card";
import { Reveal } from "@/components/ui/reveal";
import { cn } from "@/lib/cn";
import type { Frame } from "@/lib/catalog/types";

/**
 * An asymmetric register rather than a product grid: spans and vertical
 * offsets are fixed per position so the page reads as a composed spread.
 */
const LAYOUT = [
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-28",
  "lg:col-span-5",
  "lg:col-span-7 lg:-mt-10",
  "lg:col-span-7",
  "lg:col-span-5 lg:mt-24",
];

export function ExpressionGrid({ frame }: { frame: Frame }) {
  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-6">
      {frame.colorways.map((colorway, index) => (
        <Reveal
          key={colorway.id}
          delay={(index % 2) * 90}
          className={cn("sm:col-span-1", LAYOUT[index % LAYOUT.length])}
        >
          <ColorwayCard
            frame={frame}
            colorway={colorway}
            tone={index % 2 === 0 ? "ivory" : "obsidian"}
            priority={index === 0}
          />
        </Reveal>
      ))}
    </div>
  );
}
