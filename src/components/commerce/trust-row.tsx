"use client";


import { Link } from "@/components/i18n/link";
import { useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";

/**
 * The four things a visitor wants to know before spending several hundred on
 * a frame they cannot hold. Shown beside the buy button rather than filed in
 * a closed accordion, because a reassurance nobody opens reassures nobody.
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
    <ul className={cn("grid gap-px overflow-hidden bg-ivory-hairline sm:grid-cols-2", className)}>
      {assurances.map((item) => (
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
