"use client";

import { useDictionary } from "@/components/i18n/dictionary-provider";

/**
 * A single line of service above the header.
 *
 * The brief rules out discount banners, and this is not one: it states a
 * standing term of sale that already appears beside the buy button and on
 * the shipping page. It carries no countdown, no code and no dismiss button,
 * because a message worth running is worth running on every page, and a
 * message that needs an escape hatch should not have been written.
 *
 * Set dark against the cream below it so the top of the window reads as a
 * deliberate edge rather than as a second, paler header.
 */
export function AnnouncementBar() {
  const dict = useDictionary();

  return (
    <div className="flex h-(--banner-height) items-center justify-center bg-obsidian px-6 text-ivory">
      <p className="eyebrow truncate text-ivory/80">{dict.header.announcement}</p>
    </div>
  );
}
