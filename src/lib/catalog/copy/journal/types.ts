/**
 * A translated journal entry. `body` is positional and carries only the text:
 * the block kinds (paragraph, heading, pull quote) stay with the English
 * entry, so a translation cannot accidentally turn a pull quote into a
 * paragraph or drop a heading from the outline.
 */
export type JournalEntryCopy = {
  title: string;
  standfirst: string;
  category: string;
  body: string[];
};

export type JournalCopy = Record<string, JournalEntryCopy>;
