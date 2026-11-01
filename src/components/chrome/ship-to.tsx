"use client";

import { useId } from "react";

import { useDictionary } from "@/components/i18n/dictionary-provider";
import { cn } from "@/lib/cn";
import type { Destination } from "@/lib/region";

import { useRegion } from "./region-provider";

/**
 * Where the parcel is going, and with it which price list the shop quotes:
 * this is the only control in the store that changes the currency.
 *
 * It used to sit on the last rule of the page beside the copyright, which
 * is where both Hermes and Cartier put theirs. Those houses run a separate
 * storefront per region though, so their line is a way out to another site
 * and little else. Here it rewrites every price on every page, which is
 * more than ten dim pixels under the fold can carry, so it stands beside
 * the language picker as the other half of the same question and takes the
 * same shape: label above, the choice underlined below.
 *
 * The country is filled in from the edge on a first visit and remembered
 * after that.
 *
 * The named list arrives as a prop rather than being built here, because
 * Node and the browser do not name every country identically and this
 * component is rendered by both. See `shippingCountries`.
 */
export function ShipTo({
  countries,
  className,
}: {
  countries: Destination[];
  className?: string;
}) {
  const id = useId();
  const dict = useDictionary();
  const { country, setCountry } = useRegion();

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <label htmlFor={id} className="eyebrow text-ivory/50">
        {dict.region.label}
      </label>
      <select
        id={id}
        value={country}
        onChange={(event) => setCountry(event.target.value)}
        className="w-full cursor-pointer appearance-none border-b border-ivory/20 bg-transparent py-2 pr-6 text-sm text-ivory transition-colors hover:border-ivory/60"
      >
        {countries.map((option) => (
          <option key={option.code} value={option.code} className="text-obsidian">
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}
