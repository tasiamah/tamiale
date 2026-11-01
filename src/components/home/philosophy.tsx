import Image from "next/image";

import { QuietLink } from "@/components/ui/button";
import { Reveal } from "@/components/ui/reveal";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * The house statement, set into a photograph rather than onto paper.
 *
 * This was type alone on a flat ground, which is how a page states
 * something and not how a house does. The frame is composed for it: the
 * subject stands at the right and the left two thirds are an empty sunlit
 * wall, so the words sit in the picture instead of on top of it.
 *
 * Narrow screens stack rather than overlay. The crop that keeps the subject
 * on a phone is the same part of the frame the words would need, and a
 * scrim heavy enough to separate them would have taken the light out of the
 * photograph, which is the only reason it is here.
 */
export async function Philosophy() {
  const dict = await getDictionary();

  return (
    <section className="bg-ivory-dim">
      <div className="relative">
        <div className="relative aspect-4/5 w-full sm:aspect-16/10 lg:aspect-21/9">
          <Image
            src="/media/editorial/house-wide.jpg"
            alt={dict.home.houseAlt}
            fill
            sizes="100vw"
            quality={90}
            className="object-cover object-[76%_center] lg:object-center"
          />
          {/*
           * Only under lg, where the words lie over the picture. The wide
           * composition keeps them clear of it.
           */}
          <div
            aria-hidden
            className="absolute inset-0 bg-linear-to-t from-ivory-dim via-ivory-dim/70 to-transparent lg:hidden"
          />
        </div>

        <div className="lg:absolute lg:inset-0 lg:flex lg:items-center">
          <div className="gutter w-full pb-20 lg:pb-0">
            <Reveal className="-mt-24 max-w-xl lg:mt-0 lg:max-w-[30rem]">
              <p className="eyebrow text-stone-dim">
                04 · {dict.home.houseEyebrow}
              </p>
              <p className="display-lg mt-8 text-balance">
                {dict.home.manifesto}
              </p>
              <p className="body-lg mt-6 max-w-md text-pretty text-stone">
                {dict.home.manifestoTail}
              </p>
              <div className="mt-12">
                <QuietLink href="/house" className="text-obsidian">
                  {dict.home.houseCta}
                </QuietLink>
              </div>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
