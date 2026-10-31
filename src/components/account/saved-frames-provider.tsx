"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  type ReactNode,
} from "react";

import { useHydrated, usePersistentState } from "@/lib/use-persistent-state";

const SAVED_KEY = "tamiale.saved";
const FIT_KEY = "tamiale.fit";
const NO_FRAMES: SavedFrame[] = [];
const NO_PROFILE = null;

export type SavedFrame = {
  handle: string;
  colorwayId: string;
  savedAt: string;
};

/**
 * The output of a Vision Studio session. Every figure is an estimate derived
 * on the device; no image leaves the browser, and nothing is written here
 * unless the visitor asks for it.
 */
export type FitProfile = {
  /** Temple-to-temple face width estimate, millimetres. */
  faceWidthMm: number;
  /** Inter-pupillary distance assumed during the estimate, millimetres. */
  pupillaryDistanceMm: number;
  faceShape: string;
  /** Styling preference chosen by the visitor, not inferred from their face. */
  styling?: string;
  capturedAt: string;
};

type Context = {
  saved: SavedFrame[];
  isSaved: (handle: string, colorwayId: string) => boolean;
  toggleSaved: (handle: string, colorwayId: string) => void;
  fitProfile: FitProfile | null;
  saveFitProfile: (profile: FitProfile) => void;
  clearFitProfile: () => void;
  hydrated: boolean;
};

const SavedFramesContext = createContext<Context | null>(null);

export function SavedFramesProvider({ children }: { children: ReactNode }) {
  const [saved, setSaved] = usePersistentState<SavedFrame[]>(
    SAVED_KEY,
    NO_FRAMES,
  );
  const [fitProfile, setFitProfile] = usePersistentState<FitProfile | null>(
    FIT_KEY,
    NO_PROFILE,
  );
  const hydrated = useHydrated();

  const toggleSaved = useCallback(
    (handle: string, colorwayId: string) => {
      setSaved((current) => {
        const existing = Array.isArray(current) ? current : NO_FRAMES;
        const match = (item: SavedFrame) =>
          item.handle === handle && item.colorwayId === colorwayId;
        return existing.some(match)
          ? existing.filter((item) => !match(item))
          : [
              ...existing,
              { handle, colorwayId, savedAt: new Date().toISOString() },
            ];
      });
    },
    [setSaved],
  );

  const value = useMemo<Context>(
    () => ({
      saved: Array.isArray(saved) ? saved : NO_FRAMES,
      hydrated,
      isSaved: (handle, colorwayId) =>
        (Array.isArray(saved) ? saved : NO_FRAMES).some(
          (item) => item.handle === handle && item.colorwayId === colorwayId,
        ),
      toggleSaved,
      fitProfile,
      saveFitProfile: setFitProfile,
      clearFitProfile: () => setFitProfile(NO_PROFILE),
    }),
    [saved, hydrated, toggleSaved, fitProfile, setFitProfile],
  );

  return <SavedFramesContext value={value}>{children}</SavedFramesContext>;
}

export function useSavedFrames(): Context {
  const context = useContext(SavedFramesContext);
  if (!context) {
    throw new Error("useSavedFrames must be used inside SavedFramesProvider");
  }
  return context;
}
