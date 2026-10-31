"use client";

import { useId } from "react";

import { useDictionary } from "@/components/i18n/dictionary-provider";
import { REGIONS, type RegionId } from "@/lib/region";
import { cn } from "@/lib/cn";

import { useRegion } from "./region-provider";

export function RegionSelector({
  tone = "obsidian",
  className,
}: {
  tone?: "obsidian" | "ivory";
  className?: string;
}) {
  const id = useId();
  const dict = useDictionary();
  const { region, setRegion, taxNote } = useRegion();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label
        htmlFor={id}
        className={cn(
          "eyebrow",
          tone === "ivory" ? "text-ivory/50" : "text-stone",
        )}
      >
        {dict.region.label}
      </label>
      <select
        id={id}
        value={region.id}
        onChange={(event) => setRegion(event.target.value as RegionId)}
        className={cn(
          "w-full cursor-pointer appearance-none border-b bg-transparent py-2 pr-6 text-sm transition-colors",
          tone === "ivory"
            ? "border-ivory/20 text-ivory hover:border-ivory/60"
            : "border-obsidian/20 text-obsidian hover:border-obsidian",
        )}
      >
        {REGIONS.map((option) => (
          <option key={option.id} value={option.id} className="text-obsidian">
            {dict.region[option.id]} · {option.currency}
          </option>
        ))}
      </select>
      <p
        className={cn(
          "text-xs",
          tone === "ivory" ? "text-ivory/40" : "text-stone",
        )}
      >
        {taxNote}
      </p>
    </div>
  );
}
