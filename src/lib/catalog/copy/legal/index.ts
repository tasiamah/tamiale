import { getLocale } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

import { legalDocuments } from "../../legal";
import type { LegalDocument } from "../../legal";
import type { LegalCopy } from "./types";

const loaders: Record<Exclude<Locale, "en">, () => Promise<LegalCopy>> = {
  fr: () => import("./fr").then((m) => m.default),
  de: () => import("./de").then((m) => m.default),
};

function translate(document: LegalDocument, copy: LegalCopy): LegalDocument {
  const t = copy[document.slug];
  if (!t) return document;

  return {
    ...document,
    title: t.title,
    summary: t.summary,
    sections: document.sections.map((section, index) => ({
      ...section,
      ...t.sections[index],
    })),
  };
}

export async function legalDocumentsFor(): Promise<LegalDocument[]> {
  const locale = await getLocale();
  if (locale === "en") return legalDocuments;

  const copy = await loaders[locale]();
  return legalDocuments.map((document) => translate(document, copy));
}

export async function legalDocumentFor(
  slug: string,
): Promise<LegalDocument | undefined> {
  const document = legalDocuments.find((item) => item.slug === slug);
  if (!document) return undefined;

  const locale = await getLocale();
  if (locale === "en") return document;

  return translate(document, await loaders[locale]());
}
