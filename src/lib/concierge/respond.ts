import {
  CONCIERGE_FALLBACK,
  CONCIERGE_FALLBACK_ACTIONS,
  knowledge,
  type ConciergeAction,
  type KnowledgeEntry,
} from "./knowledge";

export type ConciergeReply = {
  answer: string;
  actions: ConciergeAction[];
  /** Which register entry answered, for analytics and for tuning the terms. */
  source: string | null;
};

const STOP_WORDS = new Set([
  // English
  "a", "an", "and", "are", "as", "at", "be", "can", "do", "does", "for", "have",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "please", "tell",
  "that", "the", "these", "this", "to", "want", "what", "which", "with", "you",
  "your",
  // French
  "aux", "avec", "ces", "comment", "dans", "des", "est", "les", "mon", "pour",
  "que", "quel", "quelle", "sont", "sur", "une", "vous",
  // German
  "auf", "aus", "bei", "das", "dem", "den", "der", "die", "ein", "eine", "für",
  "ich", "ist", "kann", "mein", "mit", "sie", "sind", "und", "von", "wie",
  "wird",
]);

/**
 * Lowercase, strip diacritics, keep letters and digits. Accents have to go
 * before the character filter, otherwise "précommande" is torn into two
 * meaningless tokens and no French question ever matches its entry.
 */
function normalise(input: string): string {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/ß/g, "ss")
    .replace(/[^a-z0-9\s-]/g, " ");
}

/**
 * Lexical retrieval over the house register. Multi-word terms score higher
 * than single tokens, so "pre-order" beats an incidental "order".
 */
export function respond(
  question: string,
  entries: KnowledgeEntry[] = knowledge,
  fallback: { answer: string; actions: ConciergeAction[] } = {
    answer: CONCIERGE_FALLBACK,
    actions: CONCIERGE_FALLBACK_ACTIONS,
  },
): ConciergeReply {
  const text = normalise(question);
  const tokens = new Set(
    text.split(/\s+/).filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );

  let best: { entry: KnowledgeEntry; score: number } | null = null;

  for (const entry of entries) {
    let score = 0;
    for (const raw of entry.terms) {
      const term = normalise(raw).trim();
      if (term.includes(" ") || term.includes("-")) {
        if (text.includes(term)) score += 3;
        continue;
      }
      for (const token of tokens) {
        if (token === term) score += 2;
        else if (token.startsWith(term) && term.length >= 4) score += 1;
      }
    }
    if (score > 0 && (!best || score > best.score)) best = { entry, score };
  }

  if (!best || best.score < 2) {
    return { answer: fallback.answer, actions: fallback.actions, source: null };
  }

  return {
    answer: best.entry.answer,
    actions: best.entry.actions ?? [],
    source: best.entry.id,
  };
}
