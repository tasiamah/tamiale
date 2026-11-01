import type { Locale } from "@/lib/i18n/config";

import { forthcomingFrames } from "../frames";
import type { Frame } from "../types";
import type { CatalogCopy } from "./types";

const loaders: Record<Exclude<Locale, "en">, () => Promise<CatalogCopy>> = {
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

export type Forthcoming = {
  name: string;
  personality: string;
  character: string;
};

/**
 * Lay the translated prose over a frame. Anything the translation does not
 * cover keeps its English text rather than disappearing, so a half-finished
 * translation degrades into a mixed page instead of a broken one.
 */
export async function localiseFrame(
  frame: Frame,
  locale: Locale,
): Promise<Frame> {
  if (locale === "en") return frame;

  const copy = (await loaders[locale]()).frames[frame.handle];
  if (!copy) return frame;

  return {
    ...frame,
    collection: copy.collection,
    personality: copy.personality,
    character: copy.character,
    tagline: copy.tagline,
    searchDescriptor: copy.searchDescriptor,
    story: copy.story,
    shipsFrom: copy.shipsFrom,
    edition: copy.edition,
    measurements: frame.measurements.map((measurement, index) => {
      const translated = copy.measurements[index];
      if (!translated) return measurement;
      return {
        ...measurement,
        label: translated.label,
        // An absent note in the translation means the English frame has none
        // either; writing `undefined` back is the honest result.
        note: measurement.note ? translated.note : undefined,
      };
    }),
    materials: frame.materials.map(
      (material, index) => copy.materials[index] ?? material,
    ),
    colorways: frame.colorways.map((colorway) => {
      const translated = copy.colorways[colorway.id];
      if (!translated) return colorway;
      return {
        ...colorway,
        lensDescription: translated.lensDescription,
        image: { ...colorway.image, alt: translated.imageAlt },
        worn: { ...colorway.worn, alt: translated.wornAlt },
      };
    }),
  };
}

export async function localiseFrames(
  frames: Frame[],
  locale: Locale,
): Promise<Frame[]> {
  return Promise.all(frames.map((frame) => localiseFrame(frame, locale)));
}

export async function getForthcoming(
  locale: Locale,
): Promise<{ items: Forthcoming[]; inDevelopment: string }> {
  if (locale === "en") {
    return {
      items: forthcomingFrames.map((item) => ({ ...item })),
      inDevelopment: "In development",
    };
  }

  const copy = await loaders[locale]();
  return {
    items: forthcomingFrames.map((item) => ({
      ...item,
      ...copy.forthcoming[item.name],
    })),
    inDevelopment: copy.inDevelopment,
  };
}
