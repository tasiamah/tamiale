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

export type FitEstimate = {
  faceWidthMm: number;
  pupillaryDistanceMm: number;
  bridgeGapMm: number;
  faceShape: string;
  verdict: FitVerdict;
  headline: string;
  reasoning: string[];
  confidence: "fair" | "low";
};

/** Pixels per millimetre, corrected for how far the head is turned. */
export function pixelsPerMillimetre(reading: FaceReading): number {
  const irisSpan = distance(reading.irisRight, reading.irisLeft);
  const foreshortening = Math.max(0.45, Math.cos(reading.yaw));
  return irisSpan / foreshortening / ASSUMED_IPD_MM;
}

function describeShape(reading: FaceReading, scale: number): string {
  const faceWidth = distance(reading.cheekRight, reading.cheekLeft) / scale;
  const faceHeight = distance(reading.forehead, reading.chin) / scale;
  const jawWidth = distance(reading.jawRight, reading.jawLeft) / scale;

  const lengthRatio = faceHeight / faceWidth;
  const jawRatio = jawWidth / faceWidth;

  if (jawRatio < 0.74) return "tapered";
  if (lengthRatio > 1.52) return "elongated";
  if (lengthRatio < 1.3 && jawRatio > 0.86) return "square";
  if (lengthRatio < 1.3) return "rounded";
  return "balanced oval";
}

export function estimateFit(reading: FaceReading, frame: Frame): FitEstimate {
  const scale = pixelsPerMillimetre(reading);
  const foreshortening = Math.max(0.45, Math.cos(reading.yaw));

  const faceWidthMm =
    distance(reading.cheekRight, reading.cheekLeft) / foreshortening / scale;
  const bridgeGapMm =
    distance(reading.innerRight, reading.innerLeft) / foreshortening / scale;
  const pupillaryDistanceMm = ASSUMED_IPD_MM;

  const faceShape = describeShape(reading, scale);
  const [lower, upper] = [128, 144];

  let verdict: FitVerdict;
  let headline: string;
  if (faceWidthMm < lower - 3) {
    verdict = "wide";
    headline = "The front is likely to sit wide";
  } else if (faceWidthMm > upper + 3) {
    verdict = "snug";
    headline = "The front is likely to sit narrow";
  } else {
    verdict = "recommended";
    headline = "Recommended to try";
  }

  const reasoning = [
    `Your face measures an estimated ${faceWidthMm.toFixed(0)} mm temple to temple. ${frame.name} is cut for ${lower} to ${upper} mm.`,
    `The bridge gap between your eyes reads at about ${bridgeGapMm.toFixed(0)} mm against a ${frame.geometry.bridge} mm bridge. Worth checking against a pair you already own, since the nose profile matters as much as the gap.`,
    `Your proportions read as ${faceShape}. The Marina's angular brow runs level across the face, which is the characteristic most people respond to either way.`,
  ];

  return {
    faceWidthMm,
    pupillaryDistanceMm,
    bridgeGapMm,
    faceShape,
    verdict,
    headline,
    reasoning,
    // Turned heads and long lenses both degrade the estimate.
    confidence: Math.abs(reading.yaw) > 0.3 ? "low" : "fair",
  };
}

export type StylingPreference =
  | "understated"
  | "architectural"
  | "bold"
  | "classic";

export const STYLING: { id: StylingPreference; label: string; note: string }[] =
  [
    { id: "understated", label: "Understated", note: "Quiet at a distance" },
    { id: "architectural", label: "Architectural", note: "Edges, not curves" },
    { id: "bold", label: "Bold", note: "Seen across a room" },
    { id: "classic", label: "Classic", note: "Nothing to date it" },
  ];

/**
 * Only one silhouette is released, so the recommendation is a lens choice.
 * The mapping is from the visitor's stated preference to measured
 * transmission, not an inference about their face.
 */
const LENS_FOR_STYLE: Record<StylingPreference, string[]> = {
  understated: ["smoke", "champagne"],
  architectural: ["smoke", "ember"],
  bold: ["ember", "champagne"],
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
