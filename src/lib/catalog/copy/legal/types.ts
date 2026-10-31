/**
 * A translated policy. Sections are positional against the English document:
 * the slug and the order of sections are the document's structure, and only
 * the words change. `updated` is deliberately absent, because a translation
 * does not revise the policy and must not appear to.
 */
export type LegalDocumentCopy = {
  title: string;
  summary: string;
  sections: { heading: string; body: string[] }[];
};

export type LegalCopy = Record<string, LegalDocumentCopy>;
