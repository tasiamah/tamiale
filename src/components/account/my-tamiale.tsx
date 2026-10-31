"use client";

import Image from "next/image";

import { Link } from "@/components/i18n/link";
import { useCart } from "@/components/cart/cart-provider";
import { useRegion } from "@/components/chrome/region-provider";
import { fill, useDictionary, useLocale } from "@/components/i18n/dictionary-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { findColorway } from "@/lib/catalog/frames";
import type { Frame } from "@/lib/catalog/types";
import { dateLocale } from "@/lib/i18n/config";

import { useSavedFrames } from "./saved-frames-provider";

/**
 * `frames` arrives from the server already in the reader's language. Saved
 * frames are only handles in local storage, so the copy has to be resolved
 * against a catalog the client never loads itself.
 */
export function MyTamiale({ frames }: { frames: Frame[] }) {
  const dict = useDictionary();
  const locale = useLocale();
  const { saved, hydrated, toggleSaved, fitProfile, clearFitProfile } =
    useSavedFrames();
  const { price } = useRegion();
  const { add } = useCart();

  const resolved = saved
    .map((item) => {
      const frame = frames.find((entry) => entry.handle === item.handle);
      if (!frame) return null;
      return { frame, colorway: findColorway(frame, item.colorwayId) };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="gutter grid gap-16 section-y lg:grid-cols-[1.4fr_1fr] lg:gap-24">
      <section>
        <h2 className="eyebrow text-stone">{dict.myTamiale.savedFrames}</h2>

        {!hydrated ? (
          <div className="mt-8 h-40 animate-pulse bg-ivory-dim" />
        ) : resolved.length === 0 ? (
          <div className="mt-8 border border-ivory-hairline px-8 py-14 text-center">
            <p className="display-md">{dict.myTamiale.nothingSaved}</p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-stone-dim">
{dict.myTamiale.nothingSavedBody}
            </p>
            <ButtonLink href="/collection" variant="outline" className="mt-8">
              {dict.myTamiale.viewCollection}
            </ButtonLink>
          </div>
        ) : (
          <ul className="mt-8 border-t border-ivory-hairline">
            {resolved.map(({ frame, colorway }) => (
              <li
                key={`${frame.handle}-${colorway.id}`}
                className="grid grid-cols-[7rem_1fr] items-center gap-6 border-b border-ivory-hairline py-6"
              >
                <Link
                  href={`/collection/${frame.handle}?lens=${colorway.id}`}
                  className="flex aspect-4/3 items-center justify-center bg-ivory-dim px-2"
                >
                  <Image
                    src={colorway.image.src}
                    alt={colorway.image.alt}
                    width={colorway.image.width}
                    height={colorway.image.height}
                    sizes="112px"
                    className="w-full"
                  />
                </Link>
                <div>
                  <div className="flex flex-wrap items-baseline justify-between gap-3">
                    <h3 className="font-display text-2xl">
                      {frame.name}
                      <span className="text-stone"> / {colorway.name}</span>
                    </h3>
                    <p className="text-sm tabular-nums text-stone-dim">
                      {price(frame.priceBook)}
                    </p>
                  </div>
                  <p className="mt-2 text-xs text-stone">
                    {fill(dict.myTamiale.savedSummary, {
                      vlt: colorway.vlt,
                      category: colorway.filterCategory,
                      month: frame.shipsFrom,
                    })}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-5 text-xs">
                    <button
                      type="button"
                      onClick={() =>
                        add({
                          handle: frame.handle,
                          colorwayId: colorway.id,
                          title: frame.name,
                          colorwayName: colorway.name,
                          shipsFrom: frame.shipsFrom,
                          priceBook: frame.priceBook,
                          image: colorway.image,
                        })
                      }
                      className="cursor-pointer border-b border-obsidian pb-0.5 transition-opacity hover:opacity-60"
                    >
                      {dict.commerce.reserve}
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaved(frame.handle, colorway.id)}
                      className="cursor-pointer text-stone underline-offset-4 transition-colors hover:text-obsidian hover:underline"
                    >
                      {dict.cart.remove}
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <div className="flex flex-col gap-14">
        <section>
          <h2 className="eyebrow text-stone">{dict.myTamiale.fitProfile}</h2>
          {fitProfile ? (
            <div className="mt-6 border border-ivory-hairline px-6 py-6">
              <dl className="grid grid-cols-2 gap-5">
                <div>
                  <dt className="eyebrow text-stone">{dict.myTamiale.faceWidth}</dt>
                  <dd className="mt-2 font-display text-2xl tabular-nums">
                    {fitProfile.faceWidthMm.toFixed(0)} mm
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-stone">{dict.myTamiale.proportion}</dt>
                  <dd className="mt-2 font-display text-2xl capitalize">
                    {dict.visionStudio.fit.shapes[fitProfile.faceShape]}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-stone">
                {fill(dict.myTamiale.estimatedOn, {
                  date: new Date(fitProfile.capturedAt).toLocaleDateString(
                    dateLocale[locale],
                  ),
                })}
              </p>
              <Button
                variant="ghost"
                className="mt-5 text-xs"
                onClick={clearFitProfile}
              >
                {dict.myTamiale.deleteProfile}
              </Button>
            </div>
          ) : (
            <div className="mt-6 border border-ivory-hairline px-6 py-7">
              <p className="text-sm leading-relaxed text-stone-dim">
{dict.myTamiale.fitProfileBody}
              </p>
              <ButtonLink
                href="/vision-studio#fit"
                variant="outline"
                className="mt-6 w-full"
              >
                {dict.myTamiale.openVisionStudio}
              </ButtonLink>
            </div>
          )}
        </section>

        <section>
          <h2 className="eyebrow text-stone">{dict.myTamiale.ordersTitle}</h2>
          <div className="mt-6 border border-ivory-hairline px-6 py-7">
            <p className="text-sm leading-relaxed text-stone-dim">
{dict.myTamiale.ordersBody}
            </p>
            <ButtonLink
              href="/passport"
              variant="outline"
              className="mt-6 w-full"
            >
              {dict.myTamiale.aboutPassports}
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}
