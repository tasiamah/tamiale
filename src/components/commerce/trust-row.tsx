import Link from "next/link";

import { cn } from "@/lib/cn";

/**
 * The four things a visitor wants to know before spending several hundred on
 * a frame they cannot hold. Shown beside the buy button rather than filed in
 * a closed accordion, because a reassurance nobody opens reassures nobody.
 *
 * Every claim here has to match src/lib/catalog/legal.ts. If a policy
 * changes, this is the second place to change.
 */
const ASSURANCES = [
  {
    label: "Cancel any time before it ships",
    detail: "Full refund, no reason needed",
    href: "/legal/shipping",
  },
  {
    label: "Complimentary insured delivery",
    detail: "Tracked, in every market we serve",
    href: "/legal/shipping",
  },
  {
    label: "Thirty-day returns",
    detail: "Unworn, in the case, at our cost",
    href: "/legal/returns",
  },
  {
    label: "Two-year warranty",
    detail: "Repaired by preference, not replaced",
    href: "/legal/warranty",
  },
] as const;

export function TrustRow({ className }: { className?: string }) {
  return (
    <ul className={cn("grid gap-px overflow-hidden bg-ivory-hairline sm:grid-cols-2", className)}>
      {ASSURANCES.map((item) => (
        <li key={item.label} className="bg-ivory">
          <Link
            href={item.href}
            className="group flex h-full flex-col justify-center px-4 py-3.5 transition-colors duration-300 hover:bg-ivory-dim"
          >
            <span className="text-xs font-medium text-obsidian">
              {item.label}
            </span>
            <span className="mt-1 text-xs text-stone">{item.detail}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
