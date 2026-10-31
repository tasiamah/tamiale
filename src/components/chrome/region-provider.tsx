"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import type { CurrencyCode } from "@/lib/catalog/types";
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
};

const RegionContext = createContext<RegionContextValue | null>(null);

export function RegionProvider({ children }: { children: ReactNode }) {
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
      price: (book) =>
        formatMoney(book[region.currency], region.currency, region.locale),
    }),
    [region, setRegion],
  );

  return <RegionContext value={value}>{children}</RegionContext>;
}

export function useRegion(): RegionContextValue {
  const context = useContext(RegionContext);
  if (!context) {
    throw new Error("useRegion must be used inside RegionProvider");
  }
  return context;
}
