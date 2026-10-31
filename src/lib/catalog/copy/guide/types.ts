import type { FaceShapeGuide } from "../../types";

/**
 * The translated guide. The slug is not here: the URL is the same string in
 * every language, so that the three versions of the page stay recognisably
 * one page in a sitemap and in an analytics report.
 *
 * Shapes are keyed by id rather than positional, because this list is the
 * one part of the page likely to grow, and an appended shape should not be
 * able to shift every translation after it by one.
 */
export type GuideCopy = Omit<FaceShapeGuide, "slug" | "shapes"> & {
  shapes: Record<
    string,
    { name: string; recognise: string; convention: string; marina: string }
  >;
};
