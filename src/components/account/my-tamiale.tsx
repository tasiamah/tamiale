"use client";

import Image from "next/image";
import Link from "next/link";

import { useCart } from "@/components/cart/cart-provider";
import { useRegion } from "@/components/chrome/region-provider";
import { Button, ButtonLink } from "@/components/ui/button";
import { findColorway, findFrame } from "@/lib/catalog/frames";

import { useSavedFrames } from "./saved-frames-provider";

export function MyTamiale() {
  const { saved, hydrated, toggleSaved, fitProfile, clearFitProfile } =
    useSavedFrames();
  const { price } = useRegion();
  const { add } = useCart();

  const resolved = saved
    .map((item) => {
      const frame = findFrame(item.handle);
      if (!frame) return null;
      return { frame, colorway: findColorway(frame, item.colorwayId) };
    })
    .filter((item): item is NonNullable<typeof item> => item !== null);

  return (
    <div className="gutter grid gap-16 py-20 md:py-24 lg:grid-cols-[1.4fr_1fr] lg:gap-24">
      <section>
        <h2 className="eyebrow text-stone">Saved frames</h2>

        {!hydrated ? (
          <div className="mt-8 h-40 animate-pulse bg-ivory-dim" />
        ) : resolved.length === 0 ? (
          <div className="mt-8 border border-ivory-hairline px-8 py-14 text-center">
            <p className="display-md">Nothing saved yet.</p>
            <p className="mx-auto mt-4 max-w-sm text-sm leading-relaxed text-stone-dim">
              Save an expression from any frame page and it will wait here. No
              account, no email, no reminder in three days.
            </p>
            <ButtonLink href="/collection" variant="outline" className="mt-8">
              View the collection
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
                    {colorway.vlt}% transmission · Category{" "}
                    {colorway.filterCategory} · Ships {frame.shipsFrom}
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
                      Reserve
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleSaved(frame.handle, colorway.id)}
                      className="cursor-pointer text-stone underline-offset-4 transition-colors hover:text-obsidian hover:underline"
                    >
                      Remove
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
          <h2 className="eyebrow text-stone">Fit profile</h2>
          {fitProfile ? (
            <div className="mt-6 border border-ivory-hairline px-6 py-6">
              <dl className="grid grid-cols-2 gap-5">
                <div>
                  <dt className="eyebrow text-stone">Face width</dt>
                  <dd className="mt-2 font-display text-2xl tabular-nums">
                    {fitProfile.faceWidthMm.toFixed(0)} mm
                  </dd>
                </div>
                <div>
                  <dt className="eyebrow text-stone">Proportion</dt>
                  <dd className="mt-2 font-display text-2xl capitalize">
                    {fitProfile.faceShape}
                  </dd>
                </div>
              </dl>
              <p className="mt-6 text-xs leading-relaxed text-stone">
                Estimated in your browser on{" "}
                {new Date(fitProfile.capturedAt).toLocaleDateString("en-GB")}.
                No image was kept, and this figure was never sent to Tamiale.
              </p>
              <Button
                variant="ghost"
                className="mt-5 text-xs"
                onClick={clearFitProfile}
              >
                Delete this profile
              </Button>
            </div>
          ) : (
            <div className="mt-6 border border-ivory-hairline px-6 py-7">
              <p className="text-sm leading-relaxed text-stone-dim">
                Vision Studio can estimate your face width and bridge gap from
                your camera and keep the result here, on this device only.
              </p>
              <ButtonLink
                href="/vision-studio#fit"
                variant="outline"
                className="mt-6 w-full"
              >
                Open Vision Studio
              </ButtonLink>
            </div>
          )}
        </section>

        <section>
          <h2 className="eyebrow text-stone">Orders and passports</h2>
          <div className="mt-6 border border-ivory-hairline px-6 py-7">
            <p className="text-sm leading-relaxed text-stone-dim">
              Orders, tracking and registered passports sit behind a Tamiale
              account. Customer accounts are provisioned with the Shopify
              storefront and are not connected to this deployment yet, so there
              is nothing to sign in to.
            </p>
            <ButtonLink
              href="/passport"
              variant="outline"
              className="mt-6 w-full"
            >
              About Digital Passports
            </ButtonLink>
          </div>
        </section>
      </div>
    </div>
  );
}
