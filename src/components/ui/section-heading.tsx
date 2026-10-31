import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  tone = "obsidian",
  /*
   * Centred by default. Every section on the page used to be ranged left
   * under a numbered eyebrow, which is a magazine convention; the houses this
   * is measured against square their titles in the middle of the column and
   * let the symmetry do the formality. Sections that genuinely sit in a
   * two-column layout pass align="left" explicitly.
   */
  align = "center",
  className,
}: {
  index?: string;
  eyebrow?: string;
  title: ReactNode;
  lede?: ReactNode;
  tone?: "obsidian" | "ivory";
  align?: "left" | "center";
  className?: string;
}) {
  const muted = tone === "ivory" ? "text-ivory/55" : "text-stone";
  return (
    <Reveal
      as="header"
      className={cn(
        "flex max-w-3xl flex-col gap-8",
        align === "center" && "mx-auto items-center text-center",
        className,
      )}
    >
      {(index || eyebrow) && (
        <p className={cn("eyebrow flex items-center gap-3", muted)}>
          {index && <span className="tabular-nums">{index}</span>}
          {index && eyebrow && (
            <span aria-hidden className="h-px w-8 bg-current opacity-40" />
          )}
          {eyebrow}
        </p>
      )}
      <h2
        className={cn(
          "display-xl text-balance",
          tone === "ivory" ? "text-ivory" : "text-obsidian",
        )}
      >
        {title}
      </h2>
      {lede && (
        <div className={cn("body-lg max-w-lg text-pretty", muted)}>{lede}</div>
      )}
    </Reveal>
  );
}
