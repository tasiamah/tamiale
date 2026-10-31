"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from "react";

import { useDictionary, useLocale } from "@/components/i18n/dictionary-provider";
import type { CurrencyCode } from "@/lib/catalog/types";
import { dateLocale } from "@/lib/i18n/config";
import {
  DEFAULT_REGION,
  countryName,
  findRegion,
  formatMoney,
  isShippingCountry,
  regionByCountry,
  type Region,
  type RegionId,
} from "@/lib/region";
import { usePersistentState } from "@/lib/use-persistent-state";

/**
 * The destination country is the only thing stored. Which price list applies
 * is derived from it, so the two can never drift apart: before this there
 * was a saved market and a displayed country, and nothing kept them in step.
 */
const COUNTRY_KEY = "tamiale.country";
/** Superseded by COUNTRY_KEY. Read once so an earlier choice is not lost. */
const LEGACY_REGION_KEY = "tamiale.region";
const UNSET = "";

type RegionContextValue = {
  region: Region;
  setRegion: (id: RegionId) => void;
  /** ISO code of the destination, and its name in the reader's language. */
  country: string;
  countryLabel: string;
  setCountry: (code: string) => void;
  /** Formats a price book in the visitor's market. */
  price: (book: Record<CurrencyCode, number>) => string;
  /** The market's name, tax line and delivery line, in the reader's language. */
  label: string;
  taxNote: string;
  shippingNote: string;
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
  const dict = useDictionary();
  const locale = useLocale();
  const [stored, setStored] = usePersistentState<string>(COUNTRY_KEY, UNSET);

  useDetectedCountry(stored, setStored);

  const country = stored || DEFAULT_REGION.countryCode;
  const region = findRegion(regionByCountry(country));

  const setCountry = useCallback(
    (code: string) => {
      if (isShippingCountry(code)) setStored(code.toUpperCase());
    },
    [setStored],
  );

  // The menu's selector still speaks in price lists rather than in
  // countries, so a choice made there is recorded as that list's home
  // country and read back out as the same list.
  const setRegion = useCallback(
    (id: RegionId) => setStored(findRegion(id).countryCode),
    [setStored],
  );

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      setRegion,
      country,
      countryLabel: countryName(country, dateLocale[locale]),
      setCountry,
      // Currency follows the market; the thousands separator and the symbol's
      // position follow the reader. A French visitor buying in euros should
      // see 395 €, not €395.
      price: (book) =>
        formatMoney(
          book[region.currency],
          region.currency,
          dateLocale[locale],
        ),
      label: regionLabel(dict, region.id),
      taxNote: regionTax(dict, region.id),
      shippingNote: regionShipping(dict, region.id),
    }),
    [country, dict, locale, region, setCountry, setRegion],
  );

  return <RegionContext value={value}>{children}</RegionContext>;
}

/**
 * Fills the destination in on the first visit of a session.
 *
 * It only ever runs while nothing is stored, so an explicit choice from the
 * selector is never overwritten by the network: someone in Zurich buying a
 * present for New York keeps New York.
 */
function useDetectedCountry(stored: string, setStored: (code: string) => void) {
  const asked = useRef(false);

  useEffect(() => {
    if (stored || asked.current) return;
    asked.current = true;

    const legacy = readLegacyRegion();
    if (legacy) {
      setStored(legacy);
      return;
    }

    fetch("/api/region")
      .then((response) => (response.ok ? response.json() : null))
      .then((data: { country?: string | null } | null) => {
        const code = data?.country;
        if (code && isShippingCountry(code)) setStored(code.toUpperCase());
      })
      .catch(() => {
        // A blocked request and a dropped connection both land here. The
        // footer keeps the default destination, which is still changeable.
      });
  }, [stored, setStored]);
}

function readLegacyRegion(): string | null {
  try {
    const raw = window.localStorage.getItem(LEGACY_REGION_KEY);
    if (!raw) return null;
    window.localStorage.removeItem(LEGACY_REGION_KEY);
    return findRegion(JSON.parse(raw) as RegionId).countryCode;
  } catch {
    return null;
  }
}

const CAP = { eu: "Eu", uk: "Uk", us: "Us", ae: "Ae" } as const;

type RegionCopy = ReturnType<typeof useDictionary>["region"];

function regionLabel(dict: { region: RegionCopy }, id: RegionId): string {
  return dict.region[id];
}

function regionTax(dict: { region: RegionCopy }, id: RegionId): string {
  return dict.region[`tax${CAP[id]}`];
}

function regionShipping(dict: { region: RegionCopy }, id: RegionId): string {
  return dict.region[`ship${CAP[id]}`];
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used inside RegionProvider");
  }
  return context;
}
