"use client";

import { cn } from "@/lib/cn";
import type { Colorway } from "@/lib/catalog/types";

export function ColorwaySwatches({
  colorways,
  selected,
  onSelect,
  tone = "obsidian",
}: {
  colorways: Colorway[];
  selected: string;
  onSelect: (id: string) => void;
  tone?: "obsidian" | "ivory";
}) {
  return (
    <div
      role="radiogroup"
      aria-label="Lens expression"
      className="flex flex-wrap gap-2.5"
    >
      {colorways.map((colorway) => {
        const active = colorway.id === selected;
        return (
          <button
            key={colorway.id}
            type="button"
            role="radio"
            aria-checked={active}
            aria-label={`${colorway.name}, ${colorway.vlt} percent transmission, filter category ${colorway.filterCategory}`}
            title={colorway.name}
            disabled={!colorway.availableForSale}
            onClick={() => onSelect(colorway.id)}
            className={cn(
              "relative size-11 cursor-pointer border p-1 transition-colors duration-300 disabled:cursor-not-allowed disabled:opacity-30",
              active
                ? tone === "ivory"
                  ? "border-ivory"
                  : "border-obsidian"
                : tone === "ivory"
                  ? "border-ivory/20 hover:border-ivory/60"
                  : "border-obsidian/15 hover:border-obsidian/50",
            )}
          >
            <span
              aria-hidden
              className="block size-full"
              style={{
                background: `linear-gradient(160deg, ${colorway.lensHex}, ${colorway.lensHexLower})`,
              }}
            />
          </button>
        );
      })}
    </div>
  );
}
