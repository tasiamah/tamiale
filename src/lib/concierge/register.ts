import { loadDictionary } from "@/lib/i18n/dictionary";
import type { Locale } from "@/lib/i18n/config";

import {
  CONCIERGE_FALLBACK,
  CONCIERGE_FALLBACK_ACTIONS,
  knowledge,
  type ConciergeAction,
  type KnowledgeEntry,
} from "./knowledge";
import type { TranslatedRegister } from "./translations/types";

const translations: Record<
  Exclude<Locale, "en">,
  () => Promise<TranslatedRegister>
> = {
  fr: () => import("./translations/fr").then((m) => m.default),
  de: () => import("./translations/de").then((m) => m.default),
};

/**
 * The register in one language. English is the source: every entry's id,
 * action destinations and term list come from it, and a translation only
 * replaces the prose. An entry missing from a translation still answers,
 * in English, rather than disappearing from the advisor's memory.
 */
export async function getRegister(locale: Locale): Promise<KnowledgeEntry[]> {
  if (locale === "en") return knowledge;

  const translated = await translations[locale]();

  return knowledge.map((entry) => {
    const t = translated[entry.id];
    if (!t) return entry;

    return {
      ...entry,
      // Additive, not replacing: people type English words into a French
      // session all the time, and "preorder" should still find the entry.
      terms: [...entry.terms, ...t.terms],
      answer: t.answer,
      actions: entry.actions?.map((action, index) => ({
        href: action.href,
        label: t.labels[index] ?? action.label,
      })),
    };
  });
}

export async function getFallback(
  locale: Locale,
): Promise<{ answer: string; actions: ConciergeAction[] }> {
  if (locale === "en") {
    return { answer: CONCIERGE_FALLBACK, actions: CONCIERGE_FALLBACK_ACTIONS };
  }

  const dict = await loadDictionary(locale);
  return {
    answer: dict.concierge.fallback,
    actions: [
      { label: dict.concierge.fallbackAction, href: "/private-client" },
    ],
  };
}
