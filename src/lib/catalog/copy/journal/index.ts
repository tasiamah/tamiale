import { getLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

import { journal } from "../../journal";
import type { JournalEntry } from "../../types";
import type { JournalCopy } from "./types";

const loaders: Record<Exclude<Locale, "en">, () => Promise<JournalCopy>> = {
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

function translate(entry: JournalEntry, copy: JournalCopy): JournalEntry {
  const t = copy[entry.slug];
  if (!t) return entry;

  return {
    ...entry,
    title: t.title,
    standfirst: t.standfirst,
    category: t.category,
    body: entry.body.map((block, index) => ({
      ...block,
      text: t.body[index] ?? block.text,
    })),
  };
}

export async function journalFor(): Promise<JournalEntry[]> {
  const locale = await getLocale();
  if (locale === "en") return journal;

  const copy = await loaders[locale]();
  return journal.map((entry) => translate(entry, copy));
}

export async function journalEntryFor(
  slug: string,
): Promise<JournalEntry | undefined> {
  const entry = journal.find((item) => item.slug === slug);
  if (!entry) return undefined;

  const locale = await getLocale();
  if (locale === "en") return entry;

  return translate(entry, await loaders[locale]());
}
