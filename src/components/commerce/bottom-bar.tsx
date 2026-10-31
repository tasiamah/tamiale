"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

/**
 * Only one bar belongs at the foot of a phone screen. The product page pins
 * its own, offering the frame being read about, and claims the space for as
 * long as it is mounted; the bag bar steps aside below `lg`, which is the
 * only width where the buy bar shows itself.
 *
 * The page says so rather than the bag bar reading the URL, because reading
 * the URL from a client component is runtime data and would stop every route
 * under this layout from prerendering.
 */
const BottomBarContext = createContext<{
  claimed: boolean;
  claim: () => () => void;
} | null>(null);

export function BottomBarProvider({ children }: { children: ReactNode }) {
  const [claims, setClaims] = useState(0);

  const claim = useCallback(() => {
    setClaims((count) => count + 1);
    return () => setClaims((count) => count - 1);
  }, []);

  const value = useMemo(
    () => ({ claimed: claims > 0, claim }),
    [claims, claim],
  );

  return <BottomBarContext value={value}>{children}</BottomBarContext>;
}

/** Called by whatever pins itself to the bottom edge of a narrow screen. */
export function useClaimBottomBar() {
  const claim = useContext(BottomBarContext)?.claim;
  useEffect(() => claim?.(), [claim]);
}

export function useBottomBarClaimed(): boolean {
  return useContext(BottomBarContext)?.claimed ?? false;
}
