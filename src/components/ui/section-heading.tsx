import type { ReactNode } from "react";

import { cn } from "@/lib/cn";
import { Reveal } from "@/components/ui/reveal";

export function SectionHeading({
  index,
  eyebrow,
  title,
  lede,
  tone = "obsidian",
  align = "left",
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
        "flex max-w-3xl flex-col gap-6",
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
        <div className={cn("body-lg max-w-xl text-pretty", muted)}>{lede}</div>
      )}
    </Reveal>
  );
}
