"use client";

import { useCallback } from "react";

import { useCart } from "@/components/cart/cart-provider";
import type { Colorway, Frame } from "@/lib/catalog/types";

/**
 * One way to put a frame in the bag, shared by every surface that sells:
 * the homepage, the collection tiles, the product panel and the sticky bar.
 * The snapshot the bag stores is built here so the surfaces cannot disagree
 * about what was added.
 */
export function useReserve() {
  const { add } = useCart();

  return useCallback(
    (frame: Frame, colorway: Colorway) =>
      add({
        handle: frame.handle,
        colorwayId: colorway.id,
        title: frame.name,
        colorwayName: colorway.name,
        shipsFrom: frame.shipsFrom,
        priceBook: frame.priceBook,
        image: colorway.image,
      }),
    [add],
  );
}
