"use client";

import Image from "next/image";
import Link from "next/link";

import { useRegion } from "@/components/chrome/region-provider";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

export function ColorwayCard({
  frame,
  colorway,
  tone,
  priority = false,
  className,
}: {
  frame: Frame;
  colorway: Colorway;
  tone: "ivory" | "obsidian";
  priority?: boolean;
  className?: string;
}) {
  const { price } = useRegion();
  const dark = tone === "obsidian";

  return (
    <Link
      href={`/collection/${frame.handle}?lens=${colorway.id}`}
      className={cn("group block", className)}
    >
      <div
        className={cn(
          "grain relative flex aspect-5/4 items-center justify-center overflow-hidden px-[8%] transition-colors duration-700 ease-tamiale sm:aspect-16/10",
          dark ? "bg-obsidian" : "bg-ivory-dim",
        )}
      >
        <div
          aria-hidden
          className="absolute inset-0 opacity-0 transition-opacity duration-1000 ease-tamiale group-hover:opacity-100"
          style={{
            background: `radial-gradient(ellipse at 50% 46%, ${colorway.lensHex}22, transparent 62%)`,
          }}
        />
        <Image
          src={colorway.image.src}
          alt={colorway.image.alt}
          width={colorway.image.width}
          height={colorway.image.height}
          priority={priority}
          sizes="(max-width: 640px) 92vw, (max-width: 1024px) 46vw, 38vw"
          className="relative z-10 w-full transition-transform duration-[1400ms] ease-tamiale group-hover:scale-[1.035]"
        />
      </div>

      <div
        className={cn(
          "mt-5 flex items-baseline justify-between gap-6 border-t pt-4",
          dark ? "border-obsidian/15" : "border-ivory-hairline",
        )}
      >
        <div>
          <h3 className="font-display text-2xl leading-none">
            {frame.name}
            <span className="text-stone"> / {colorway.name}</span>
          </h3>
          <p className="mt-2.5 text-xs text-stone">
            {colorway.vlt}% transmission · Category {colorway.filterCategory}
          </p>
        </div>
        <p className="shrink-0 text-sm tabular-nums text-stone-dim">
          {price(frame.priceBook)}
        </p>
      </div>
    </Link>
  );
}
