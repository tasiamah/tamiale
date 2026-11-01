/**
 * The translatable half of a frame. Everything measurable stays in
 * `frames.ts`: millimetres, grams, VLT, hex, SKUs, prices and handles are the
 * same object in every language, and a translator must not be able to change
 * a published measurement by editing prose.
 *
 * Measurements and materials are positional, matching the order they appear
 * in the English frame, so a reordering there cannot silently mislabel a
 * figure here.
 */
export type FrameCopy = {
  collection: string;
  personality: string;
  character: string;
  tagline: string;
  searchDescriptor: string;
  story: string[];
  /** The dispatch month, written out in the reader's language. */
  shipsFrom: string;
  edition: string;
  measurements: { label: string; note?: string }[];
  materials: { heading: string; body: string }[];
  /** Keyed by colorway id. The lens names themselves are not translated. */
  colorways: Record<
    string,
    { lensDescription: string; imageAlt: string; wornAlt: string }
  >;
};

export type CatalogCopy = {
  frames: Record<string, FrameCopy>;
  /** Keyed by the English name, which is also the model name everywhere. */
  forthcoming: Record<string, { personality: string; character: string }>;
  inDevelopment: string;
};
