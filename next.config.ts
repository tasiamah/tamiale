import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    /*
     * Next 16 allows only quality 75 unless the values are listed here, and
     * an unlisted `q` is a 400 from the optimizer rather than a fallback.
     * 90 exists for photographs that are already being enlarged past their
     * native size, where the encoder's own softening compounds the blur.
     */
    qualities: [75, 90],
    /*
     * AVIF first, WebP for anything that cannot read it. The hero is the
     * largest contentful paint on every phone, and it is bandwidth that
     * decides when it lands, so the smaller encoding is worth the slower
     * first optimisation at the edge.
     */
    formats: ["image/avif", "image/webp"],
  },
  // The visual QA harnesses drive the dev server over the loopback address.
  allowedDevOrigins: ["127.0.0.1"],
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
