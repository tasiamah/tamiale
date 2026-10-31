import {
  CONCIERGE_FALLBACK,
  CONCIERGE_FALLBACK_ACTIONS,
  knowledge,
  type ConciergeAction,
} from "./knowledge";

export type ConciergeReply = {
  answer: string;
  actions: ConciergeAction[];
  /** Which register entry answered, for analytics and for tuning the terms. */
  source: string | null;
};

const STOP_WORDS = new Set([
  "a", "an", "and", "are", "as", "at", "be", "can", "do", "does", "for", "have",
  "how", "i", "in", "is", "it", "me", "my", "of", "on", "or", "please", "tell",
  "that", "the", "these", "this", "to", "want", "what", "which", "with", "you",
  "your",
]);

function normalise(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9\s-]/g, " ");
}

/**
 * Lexical retrieval over the house register. Multi-word terms score higher
 * than single tokens, so "pre-order" beats an incidental "order".
 */
export function respond(question: string): ConciergeReply {
  const text = normalise(question);
  const tokens = new Set(
    text.split(/\s+/).filter((token) => token.length > 2 && !STOP_WORDS.has(token)),
  );

  let best: { entry: (typeof knowledge)[number]; score: number } | null = null;

  for (const entry of knowledge) {
    let score = 0;
    for (const term of entry.terms) {
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
    return {
      answer: CONCIERGE_FALLBACK,
      actions: CONCIERGE_FALLBACK_ACTIONS,
      source: null,
    };
  }

  return {
    answer: best.entry.answer,
    actions: best.entry.actions ?? [],
    source: best.entry.id,
  };
}
