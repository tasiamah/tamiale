"use client";

import { useId } from "react";

import { useDictionary } from "@/components/i18n/dictionary-provider";
import type { Destination } from "@/lib/region";

import { useRegion } from "./region-provider";

/**
 * The destination, stated at the foot of every page.
 *
 * It reads as a line of text rather than as a form control, which is the
 * point: a visitor should see where the house thinks the parcel is going
 * without being asked a question. The underline is the only thing marking
 * it as changeable, and the whole line is one native select, so it opens
 * with a tap on a phone and takes keyboard focus like any other field.
 *
 * The country is filled in from the edge on a first visit and remembered
 * after that. It also decides the price list, so changing it here changes
 * the currency on every price in the store.
 *
 * The named list arrives as a prop rather than being built here, because
 * Node and the browser do not name every country identically and this
 * component is rendered by both. See `shippingCountries`.
 */
export function ShipTo({ countries }: { countries: Destination[] }) {
  const id = useId();
  const dict = useDictionary();
  const { country, setCountry } = useRegion();

  const label =
    countries.find((entry) => entry.code === country)?.name ?? country;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor={id} className="eyebrow text-ivory/40">
        {dict.region.label}
      </label>
      {/* Decorative, and hidden: read aloud it would only be punctuation. */}
      <span aria-hidden className="eyebrow text-ivory/25">
        :
      </span>
      {/*
       * The name is drawn as text and the select lies over it, transparent.
       * A select cannot be used directly here: its intrinsic width comes
       * from its longest option, so the rule under one short country would
       * still be as wide as "United Arab Emirates".
       *
       * The negative margin takes back the trailing letter-space. The
       * eyebrow is tracked at 0.185em and that gap is painted after the
       * final letter, which would leave the rule hanging past the word.
       */}
      <span className="relative inline-block border-b border-ivory/30 pb-1 transition-colors duration-300 hover:border-ivory has-[:focus-visible]:border-ivory">
        <span aria-hidden className="eyebrow -mr-[0.185em] block text-ivory">
          {label}
        </span>
        <select
          id={id}
          value={country}
          onChange={(event) => setCountry(event.target.value)}
          className="absolute inset-0 h-full w-full cursor-pointer opacity-0"
        >
          {countries.map((option) => (
            <option
              key={option.code}
              value={option.code}
              className="text-obsidian"
            >
              {option.name}
            </option>
          ))}
        </select>
      </span>
    </div>
  );
}
