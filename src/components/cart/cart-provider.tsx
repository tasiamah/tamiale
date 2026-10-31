"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";

import type { CurrencyCode } from "@/lib/catalog/types";
import { startCheckout } from "@/lib/shopify/cart";
import { usePersistentState } from "@/lib/use-persistent-state";

import { useRegion } from "@/components/chrome/region-provider";

const STORAGE_KEY = "tamiale.bag";
const MAX_PER_LINE = 4;
const NO_LINES: BagLine[] = [];

export type BagLine = {
  handle: string;
  colorwayId: string;
  quantity: number;
  /**
   * Display snapshot taken when the line was added, so the bag renders
   * instantly without a second catalog round trip. The variant is resolved
   * again on the server at checkout, so a stale snapshot cannot be bought.
   */
  title: string;
  colorwayName: string;
  shipsFrom: string;
  priceBook: Record<CurrencyCode, number>;
  image: { src: string; alt: string; width: number; height: number };
};

type CartContextValue = {
  lines: BagLine[];
  count: number;
  subtotal: number;
  isOpen: boolean;
  isCheckingOut: boolean;
  notice: string | null;
  open: () => void;
  close: () => void;
  add: (line: Omit<BagLine, "quantity"> & { quantity?: number }) => void;
  setQuantity: (key: string, quantity: number) => void;
  remove: (key: string) => void;
  checkout: () => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export const lineKey = (line: Pick<BagLine, "handle" | "colorwayId">) =>
  `${line.handle}:${line.colorwayId}`;

function isBagLine(value: unknown): value is BagLine {
  const line = value as BagLine | null;
  return (
    typeof line === "object" &&
    line !== null &&
    typeof line.handle === "string" &&
    typeof line.colorwayId === "string" &&
    typeof line.quantity === "number" &&
    typeof line.priceBook === "object"
  );
}

export function CartProvider({ children }: { children: ReactNode }) {
  const { region } = useRegion();
  const [stored, setStored] = usePersistentState<BagLine[]>(
    STORAGE_KEY,
    NO_LINES,
  );
  const [isOpen, setIsOpen] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [isCheckingOut, startCheckoutTransition] = useTransition();

  // Storage is shared with other tabs and with earlier builds of the site, so
  // anything that no longer looks like a bag line is dropped on read.
  const lines = useMemo(
    () => (Array.isArray(stored) ? stored.filter(isBagLine) : NO_LINES),
    [stored],
  );

  const add = useCallback<CartContextValue["add"]>(
    (incoming) => {
      const quantity = incoming.quantity ?? 1;
      const key = lineKey(incoming);

      setStored((current) => {
        const existing = (current ?? []).filter(isBagLine);
        return existing.some((line) => lineKey(line) === key)
          ? existing.map((line) =>
              lineKey(line) === key
                ? {
                    ...line,
                    quantity: Math.min(MAX_PER_LINE, line.quantity + quantity),
                  }
                : line,
            )
          : [...existing, { ...incoming, quantity }];
      });

      setNotice(null);
      setIsOpen(true);
    },
    [setStored],
  );

  const setQuantity = useCallback<CartContextValue["setQuantity"]>(
    (key, quantity) => {
      setStored((current) => {
        const existing = (current ?? []).filter(isBagLine);
        return quantity <= 0
          ? existing.filter((line) => lineKey(line) !== key)
          : existing.map((line) =>
              lineKey(line) === key
                ? { ...line, quantity: Math.min(MAX_PER_LINE, quantity) }
                : line,
            );
      });
    },
    [setStored],
  );

  const remove = useCallback<CartContextValue["remove"]>(
    (key) => {
      setStored((current) =>
        (current ?? []).filter(isBagLine).filter((line) => lineKey(line) !== key),
      );
    },
    [setStored],
  );

  const checkout = useCallback(() => {
    setNotice(null);
    startCheckoutTransition(async () => {
      const result = await startCheckout(
        lines.map(({ handle, colorwayId, quantity }) => ({
          handle,
          colorwayId,
          quantity,
        })),
        region.countryCode,
      );
      if (result.ok) {
        window.location.href = result.url;
      } else {
        setNotice(result.message);
      }
    });
  }, [lines, region.countryCode]);

  const value = useMemo<CartContextValue>(
    () => ({
      lines,
      count: lines.reduce((total, line) => total + line.quantity, 0),
      subtotal: lines.reduce(
        (total, line) => total + line.priceBook[region.currency] * line.quantity,
        0,
      ),
      isOpen,
      isCheckingOut,
      notice,
      open: () => setIsOpen(true),
      close: () => setIsOpen(false),
      add,
      setQuantity,
      remove,
      checkout,
    }),
    [
      lines,
      isOpen,
      isCheckingOut,
      notice,
      add,
      setQuantity,
      remove,
      checkout,
      region.currency,
    ],
  );

  return <CartContext value={value}>{children}</CartContext>;
}

export function useCart(): CartContextValue {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used inside CartProvider");
  return context;
}
