"use client";

import { useDictionary } from "@/components/i18n/dictionary-provider";
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
  const dict = useDictionary();

  return (
    <div
      role="radiogroup"
      aria-label={dict.commerce.lensExpression}
      className="flex flex-wrap gap-6"
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
              "relative size-12 cursor-pointer ring-offset-4 transition-all duration-500 ease-tamiale",
              "disabled:cursor-not-allowed disabled:opacity-30",
              tone === "ivory" ? "ring-offset-obsidian" : "ring-offset-ivory",
              active
                ? tone === "ivory"
                  ? "ring-1 ring-ivory"
                  : "ring-1 ring-obsidian"
                : tone === "ivory"
                  ? "ring-0 ring-ivory/40 hover:ring-1"
                  : "ring-0 ring-obsidian/30 hover:ring-1",
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
