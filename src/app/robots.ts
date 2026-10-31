import type { MetadataRoute } from "next";

import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Passport URLs carry a serial, and the bag is personal to a browser.
      disallow: ["/passport/", "/my-tamiale", "/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
