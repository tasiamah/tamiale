import type { Frame } from "@/lib/catalog/types";

import { distance, type FaceReading } from "./tracker";

/**
 * A camera has no absolute scale, so every millimetre below is derived from
 * one assumption: that the wearer's inter-pupillary distance is close to the
 * adult mean. That is a reasonable basis for a recommendation and a poor one
 * for a prescription, which is why nothing here is presented as a measurement.
 */
export const ASSUMED_IPD_MM = 63;

export type FitVerdict = "recommended" | "snug" | "wide" | "unknown";

/** Stored in the fit profile, so it must be a stable key, not display text. */
export type FaceShape =
  | "tapered"
  | "elongated"
  | "square"
  | "rounded"
  | "balanced";

export type FitEstimate = {
  faceWidthMm: number;
  pupillaryDistanceMm: number;
  bridgeGapMm: number;
  faceShape: FaceShape;
  verdict: FitVerdict;
  confidence: "fair" | "low";
};

/**
 * The sentences the estimate is written into. They are passed in rather than
 * held here because the geometry is the same in every language and the prose
 * is not.
 */
export type FitCopy = {
  shapes: Record<FaceShape, string>;
  wide: string;
  narrow: string;
  recommended: string;
  reasonWidth: string;
  reasonBridge: string;
  reasonShape: string;
};

/** Pixels per millimetre, corrected for how far the head is turned. */
export function pixelsPerMillimetre(reading: FaceReading): number {
  const irisSpan = distance(reading.irisRight, reading.irisLeft);
  const foreshortening = Math.max(0.45, Math.cos(reading.yaw));
  return irisSpan / foreshortening / ASSUMED_IPD_MM;
}

function describeShape(reading: FaceReading, scale: number): FaceShape {
  const faceWidth = distance(reading.cheekRight, reading.cheekLeft) / scale;
  const faceHeight = distance(reading.forehead, reading.chin) / scale;
  const jawWidth = distance(reading.jawRight, reading.jawLeft) / scale;

  const lengthRatio = faceHeight / faceWidth;
  const jawRatio = jawWidth / faceWidth;

  if (jawRatio < 0.74) return "tapered";
  if (lengthRatio > 1.52) return "elongated";
  if (lengthRatio < 1.3 && jawRatio > 0.86) return "square";
  if (lengthRatio < 1.3) return "rounded";
  return "balanced";
}

export function estimateFit(reading: FaceReading): FitEstimate {
  const scale = pixelsPerMillimetre(reading);
  const foreshortening = Math.max(0.45, Math.cos(reading.yaw));

  const faceWidthMm =
    distance(reading.cheekRight, reading.cheekLeft) / foreshortening / scale;
  const bridgeGapMm =
    distance(reading.innerRight, reading.innerLeft) / foreshortening / scale;
  const pupillaryDistanceMm = ASSUMED_IPD_MM;

  const faceShape = describeShape(reading, scale);
  const [lower, upper] = FACE_WIDTH_RANGE;

  const verdict: FitVerdict =
    faceWidthMm < lower - 3
      ? "wide"
      : faceWidthMm > upper + 3
        ? "snug"
        : "recommended";

  return {
    faceWidthMm,
    pupillaryDistanceMm,
    bridgeGapMm,
    faceShape,
    verdict,
    // Turned heads and long lenses both degrade the estimate.
    confidence: Math.abs(reading.yaw) > 0.3 ? "low" : "fair",
  };
}

/** The bounds the frame is cut for, published on the specification sheet. */
export const FACE_WIDTH_RANGE = [128, 144] as const;

export function describeFit(
  fit: FitEstimate,
  frame: Frame,
  copy: FitCopy,
): { headline: string; reasoning: string[] } {
  const [lower, upper] = FACE_WIDTH_RANGE;
  const values = {
    width: fit.faceWidthMm.toFixed(0),
    lower,
    upper,
    name: frame.name,
    gap: fit.bridgeGapMm.toFixed(0),
    bridge: frame.geometry.bridge,
    shape: copy.shapes[fit.faceShape],
  };

  const headline =
    fit.verdict === "wide"
      ? copy.wide
      : fit.verdict === "snug"
        ? copy.narrow
        : copy.recommended;

  return {
    headline,
    reasoning: [copy.reasonWidth, copy.reasonBridge, copy.reasonShape].map(
      (template) =>
        template.replace(/\{(\w+)\}/g, (match, key: string) =>
          key in values ? String(values[key as keyof typeof values]) : match,
        ),
    ),
  };
}

export type StylingPreference =
  | "understated"
  | "architectural"
  | "bold"
  | "classic";

export const STYLING_ORDER: StylingPreference[] = [
  "understated",
  "architectural",
  "bold",
  "classic",
];

/**
 * Only one silhouette is released, so the recommendation is a lens choice.
 * The mapping is from the visitor's stated preference to measured
 * transmission, not an inference about their face.
 */
const LENS_FOR_STYLE: Record<StylingPreference, string[]> = {
  understated: ["smoke", "champagne"],
  architectural: ["smoke", "cognac"],
  bold: ["cognac", "champagne"],
  classic: ["champagne", "smoke"],
};

export function recommendLenses(
  frame: Frame,
  preference: StylingPreference,
): { primary: Frame["colorways"][number]; alternate: Frame["colorways"][number] } {
  const [first, second] = LENS_FOR_STYLE[preference];
  const find = (id: string) =>
    frame.colorways.find((way) => way.id === id) ?? frame.colorways[0];
  return { primary: find(first), alternate: find(second) };
}
