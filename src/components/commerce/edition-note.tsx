"use client";

import { fill, useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import type { Colorway, Frame } from "@/lib/catalog/types";

/**
 * The scarcity line. It states the edition size, which is a published fact,
 * and the number still unsold only when the storefront actually knows it.
 * No countdown, no "selling fast": an edition of 150 is persuasive on its own
 * and stays true tomorrow.
 */
export function EditionNote({
  frame,
  colorway,
  className,
}: {
  frame: Frame;
  colorway: Colorway;
  className?: string;
}) {
  const dict = useDictionary();
  const remaining = colorway.remaining;
  const scarce = typeof remaining === "number" && remaining <= 25;

  return (
    <p className={cn("text-xs leading-relaxed text-stone", className)}>
      <span className="text-obsidian">{frame.edition}</span>
      {" · "}
      {fill(dict.commerce.edition.editionOf, {
        count: colorway.editionSize,
        lens: colorway.name,
      })}
      {typeof remaining === "number" && (
        <>
          {" · "}
          <span className={cn("figure-num", scarce ? "text-obsidian" : "")}>
            {fill(dict.commerce.edition.unsold, { count: remaining })}
          </span>
        </>
      )}
    </p>
  );
}
