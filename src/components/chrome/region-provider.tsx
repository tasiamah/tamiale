"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useDictionary, useLocale } from "@/components/i18n/dictionary-provider";
import type { CurrencyCode } from "@/lib/catalog/types";
import { dateLocale } from "@/lib/i18n/config";
import {
  DEFAULT_REGION,
  findRegion,
  formatMoney,
  type Region,
  type RegionId,
} from "@/lib/region";
import { usePersistentState } from "@/lib/use-persistent-state";

const STORAGE_KEY = "tamiale.region";
const FALLBACK: RegionId = DEFAULT_REGION.id;

type RegionContextValue = {
  region: Region;
  setRegion: (id: RegionId) => void;
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
  const [regionId, setRegionId] = usePersistentState<RegionId>(
    STORAGE_KEY,
    FALLBACK,
  );
  const region = findRegion(regionId);

  const setRegion = useCallback(
    (id: RegionId) => setRegionId(findRegion(id).id),
    [setRegionId],
  );

  const value = useMemo<RegionContextValue>(
    () => ({
      region,
      setRegion,
      // Currency follows the market; the thousands separator and the symbol's
      // position follow the reader. A French visitor buying in euros should
      // see 420 €, not €420.
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
    [dict, locale, region, setRegion],
  );

  return <RegionContext value={value}>{children}</RegionContext>;
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
