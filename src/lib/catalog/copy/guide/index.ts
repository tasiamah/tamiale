import type { Locale } from "@/lib/i18n/config";
import { getLocale } from "@/lib/i18n/dictionary";

import { faceShapeGuide } from "../../guide";
import type { FaceShapeGuide } from "../../types";
import type { GuideCopy } from "./types";

const loaders: Record<Exclude<Locale, "en">, () => Promise<GuideCopy>> = {
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

/**
 * The guide in the reader's language. A shape the translation has not
 * reached keeps its English text rather than vanishing from the list, so a
 * half-finished translation reads as mixed instead of as a page that
 * silently lost a section.
 */
export async function guideFor(): Promise<FaceShapeGuide> {
  const locale = await getLocale();
  if (locale === "en") return faceShapeGuide;

  const copy = await loaders[locale]();

  return {
    ...faceShapeGuide,
    ...copy,
    shapes: faceShapeGuide.shapes.map((shape) => ({
      ...shape,
      ...copy.shapes[shape.id],
    })),
  };
}
