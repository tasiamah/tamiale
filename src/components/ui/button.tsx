import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { Link } from "@/components/i18n/link";
import { cn } from "@/lib/cn";

type Variant = "solid" | "outline" | "ghost";
type Tone = "obsidian" | "ivory";

const base =
  "group/button relative inline-flex items-center justify-center gap-3 eyebrow " +
  "px-7 py-4 transition-colors duration-500 ease-tamiale disabled:cursor-not-allowed disabled:opacity-40";

const variants: Record<Tone, Record<Variant, string>> = {
  obsidian: {
    solid:
      "bg-obsidian text-ivory hover:bg-obsidian-raised border border-obsidian",
    outline:
      "border border-obsidian/25 text-obsidian hover:border-obsidian hover:bg-obsidian hover:text-ivory",
    ghost: "text-obsidian hover:text-stone-dim px-0 py-2",
  },
  ivory: {
    solid: "bg-ivory text-obsidian hover:bg-ivory-dim border border-ivory",
    outline:
      "border border-ivory/30 text-ivory hover:border-ivory hover:bg-ivory hover:text-obsidian",
    ghost: "text-ivory/80 hover:text-ivory px-0 py-2",
  },
};

type CommonProps = {
  variant?: Variant;
  tone?: Tone;
  className?: string;
  children: ReactNode;
};

export function Button({
  variant = "solid",
  tone = "obsidian",
  className,
  children,
  ...props
}: CommonProps & ComponentPropsWithoutRef<"button">) {
  return (
    <button
      {...props}
      className={cn(base, variants[tone][variant], className)}
    >
      {children}
    </button>
  );
}

export function ButtonLink({
  variant = "solid",
  tone = "obsidian",
  className,
  children,
  href,
  ...props
}: CommonProps & ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      {...props}
      className={cn(base, variants[tone][variant], className)}
    >
      {children}
    </Link>
  );
}

/**
 * An underlined text link whose rule draws itself in from the left on hover,
 * the only decorative motion the house allows in running text.
 */
export function QuietLink({
  className,
  children,
  href,
  ...props
}: ComponentPropsWithoutRef<typeof Link>) {
  return (
    <Link
      href={href}
      {...props}
      className={cn(
        "group/quiet relative inline-block eyebrow pb-1 transition-opacity duration-300 hover:opacity-100",
        className,
      )}
    >
      {children}
      <span
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-100 bg-current opacity-30 transition-opacity duration-500 ease-tamiale group-hover/quiet:opacity-100"
      />
    </Link>
  );
}
