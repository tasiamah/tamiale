"use client";

import { Link } from "@/components/i18n/link";
import { useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";

/**
 * The four things a visitor wants to know before spending several hundred on
 * a frame they cannot hold. Shown beside the buy button rather than filed in
 * a closed accordion, because a reassurance nobody opens reassures nobody.
 *
 * Set as a plain list separated by hairlines rather than as a grid of boxed
 * cells. A bordered badge grid is the house style of a discount retailer; the
 * same four promises in quiet type read as terms rather than as selling.
 *
 * Every claim here has to match src/lib/catalog/legal.ts. If a policy
 * changes, this is the second place to change.
 */
export function TrustRow({ className }: { className?: string }) {
  const { trust } = useDictionary().commerce;
  const assurances = [
    { label: trust.cancelLabel, detail: trust.cancelDetail, href: "/legal/shipping" },
    { label: trust.deliveryLabel, detail: trust.deliveryDetail, href: "/legal/shipping" },
    { label: trust.returnsLabel, detail: trust.returnsDetail, href: "/legal/returns" },
    { label: trust.warrantyLabel, detail: trust.warrantyDetail, href: "/legal/warranty" },
  ];

  return (
    <ul className={cn("flex flex-col", className)}>
      {assurances.map((item) => (
        <li key={item.label} className="hairline-t">
          <Link
            href={item.href}
            className="group flex items-baseline justify-between gap-6 py-3.5 transition-opacity duration-500 ease-tamiale hover:opacity-60"
          >
            <span className="text-[0.8125rem] text-obsidian">{item.label}</span>
            <span className="shrink-0 text-right text-xs text-stone-dim">
              {item.detail}
            </span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
