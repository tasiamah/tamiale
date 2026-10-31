import type { MetadataRoute } from "next";

import { frames } from "@/lib/catalog/frames";
import { journal } from "@/lib/catalog/journal";
import { legalDocuments } from "@/lib/catalog/legal";
import { defaultLocale, localePath, locales } from "@/lib/i18n/config";
import { site } from "@/lib/site";

type Entry = {
  path: string;
  priority: number;
  changeFrequency?: MetadataRoute.Sitemap[number]["changeFrequency"];
  lastModified?: Date;
};

const entries: Entry[] = [
  { path: "/", priority: 1, changeFrequency: "weekly" },
  { path: "/collection", priority: 0.9, changeFrequency: "weekly" },
  ...frames.map((frame) => ({
    path: `/collection/${frame.handle}`,
    priority: 0.9,
    changeFrequency: "weekly" as const,
  })),
  { path: "/vision-studio", priority: 0.8 },
  { path: "/house", priority: 0.7 },
  { path: "/journal", priority: 0.6 },
  ...journal.map((entry) => ({
    path: `/journal/${entry.slug}`,
    lastModified: new Date(entry.publishedAt),
    priority: 0.5,
  })),
  { path: "/private-client", priority: 0.6 },
  { path: "/passport", priority: 0.5 },
  ...legalDocuments.map((document) => ({
    path: `/legal/${document.slug}`,
    lastModified: new Date(document.updated),
    priority: 0.3,
  })),
];

/**
 * Every page is listed once per language, and each listing carries the
 * `alternates` block naming all three. Without it a crawler that only ever
 * arrives from a US address would index the English pages and treat the
 * French and German ones as duplicates of them.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  return locales.flatMap((locale) =>
    entries.map((entry) => ({
      ...entry,
      url: `${site.url}${localePath(locale, entry.path)}`,
      alternates: {
        languages: {
          ...Object.fromEntries(
            locales.map((other) => [
              other,
              `${site.url}${localePath(other, entry.path)}`,
            ]),
          ),
          "x-default": `${site.url}${localePath(defaultLocale, entry.path)}`,
        },
      },
    })),
  );
}
