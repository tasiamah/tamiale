import type { MetadataRoute } from "next";

import { frames } from "@/lib/catalog/frames";
import { journal } from "@/lib/catalog/journal";
import { legalDocuments } from "@/lib/catalog/legal";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const url = (path: string) => `${site.url}${path}`;

  return [
    { url: url("/"), priority: 1, changeFrequency: "weekly" },
    { url: url("/collection"), priority: 0.9, changeFrequency: "weekly" },
    ...frames.map((frame) => ({
      url: url(`/collection/${frame.handle}`),
      priority: 0.9,
      changeFrequency: "weekly" as const,
    })),
    { url: url("/vision-studio"), priority: 0.8 },
    { url: url("/house"), priority: 0.7 },
    { url: url("/journal"), priority: 0.6 },
    ...journal.map((entry) => ({
      url: url(`/journal/${entry.slug}`),
      lastModified: new Date(entry.publishedAt),
      priority: 0.5,
    })),
    { url: url("/private-client"), priority: 0.6 },
    { url: url("/passport"), priority: 0.5 },
    ...legalDocuments.map((document) => ({
      url: url(`/legal/${document.slug}`),
      lastModified: new Date(document.updated),
      priority: 0.3,
    })),
  ];
}
