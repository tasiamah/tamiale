import type { Dictionary } from "./dictionaries/en";

/**
 * The sections Client Components are allowed to read.
 *
 * Everything else stays on the server. The dictionary is serialised into the
 * RSC payload of every page, and the long-form prose (house pillars, legal,
 * passport copy) is rendered server-side only: shipping it to the browser
 * costs every visitor bytes they will never read.
 *
 * Adding a section here is a deliberate act. A Client Component reading one
 * that is absent will not compile.
 */
export const clientSections = [
  "atelier",
  "cart",
  "commerce",
  "concierge",
  "header",
  "home",
  "myTamiale",
  "nav",
  "navSummary",
  "region",
  "visionStudio",
] as const;

export type ClientDictionary = Pick<
  Dictionary,
  (typeof clientSections)[number]
> & {
  /** Two strings pulled out of otherwise server-only sections. */
  footer: Pick<Dictionary["footer"], "theHouse">;
  privateClient: { form: Dictionary["privateClient"]["form"] };
};

export function toClientDictionary(dict: Dictionary): ClientDictionary {
  const picked = Object.fromEntries(
    clientSections.map((section) => [section, dict[section]]),
  ) as Pick<Dictionary, (typeof clientSections)[number]>;

  return {
    ...picked,
    footer: { theHouse: dict.footer.theHouse },
    privateClient: { form: dict.privateClient.form },
  };
}
