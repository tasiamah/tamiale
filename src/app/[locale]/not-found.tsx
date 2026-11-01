import Image from "next/image";

import { ButtonLink } from "@/components/ui/button";
import { getDictionary } from "@/lib/i18n/dictionary";

export default async function NotFound() {
  const dict = await getDictionary();

  return (
    /*
     * The same wall as the house section, in the same afternoon light, with
     * nobody standing against it. A page that is not here is still somewhere
     * in the house, and the rest of the shop is photographed, so this is too
     * rather than being the one screen set in text on an empty field.
     */
    <section className="relative isolate flex min-h-[calc(100svh-var(--chrome-height))] items-center justify-center overflow-hidden bg-ivory">
      <Image
        src="/media/editorial/empty-wall.jpg"
        alt=""
        fill
        priority
        sizes="100vw"
        quality={85}
        className="object-cover object-center"
      />

      {/*
       * The plaster is bright and even where the words sit, but it carries
       * its own gradient, and the copy has to hold against both ends of it.
       */}
      <div
        aria-hidden
        className="absolute inset-0 bg-ivory/35 sm:bg-ivory/25"
      />

      <div className="gutter relative flex flex-col items-center py-24 text-center">
        <p className="eyebrow text-stone">{dict.notFound.title}</p>
        <h1 className="display-xl mt-7 max-w-2xl text-balance">
          {dict.notFound.body}
        </h1>
        <div className="mt-14 flex flex-wrap justify-center gap-3">
          <ButtonLink href="/collection" tone="obsidian" variant="outline">
            {dict.notFound.collection}
          </ButtonLink>
          <ButtonLink href="/" tone="obsidian" variant="ghost">
            {dict.notFound.home}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
