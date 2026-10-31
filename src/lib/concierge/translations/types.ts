/**
 * A translated register entry. Action destinations are deliberately absent:
 * hrefs stay in the English register so a route rename cannot leave one
 * language pointing at a page that no longer exists. Labels are positional,
 * matching the order of the actions on the English entry.
 */
export type TranslatedEntry = {
  terms: string[];
  answer: string;
  labels: string[];
};

export type TranslatedRegister = Record<string, TranslatedEntry>;
