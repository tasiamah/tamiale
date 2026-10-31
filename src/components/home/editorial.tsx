import Image from "next/image";

import { Link } from "@/components/i18n/link";
import { getDictionary } from "@/lib/i18n/dictionary";

/**
 * The opening frame of the site.
 *
 * It fills the window below the chrome rather than sitting inside the page.
 * That is the whole gesture: the first thing a visitor is given is the
 * object at the size of their own screen, with one line and one way in, and
 * the shop does not begin until they scroll. A band two hundred pixels tall
 * would be a banner; this is a shop window.
 *
 * `svh` rather than `vh` or `dvh`. On a phone `vh` ignores the browser's own
 * chrome and pushes the line off the bottom, and `dvh` changes as that
 * chrome retracts, which re-lays out the hero while it is being read.
 *
 * NOTE ON THE SOURCE: campaign.jpg is 1024px wide and this slot is the whole
 * viewport, so it is enlarged roughly 1.4x on a laptop and cropped hard on a
 * phone. It wants a master around 2800px, and ideally a second, taller crop
 * for portrait screens, since one 3:1 frame cannot be art-directed into both.
 */
export async function Editorial() {
  const dict = await getDictionary();

  return (
    <section className="relative isolate h-[calc(100svh-var(--chrome-height))] w-full overflow-hidden bg-ivory-dim">
      <Image
        src="/media/editorial/campaign.jpg"
        alt={dict.home.editorialAlt}
        fill
        /*
         * The largest paint on the site. `priority` is deprecated in Next
         * 16 and never emitted a priority hint anyway; these two attributes
         * are what the browser actually reads. Quality is raised because an
         * enlarged photograph compounds the encoder's own softening.
         */
        fetchPriority="high"
        loading="eager"
        quality={90}
        sizes="100vw"
        /*
         * Held left of centre. A portrait screen crops this frame to a
         * narrow vertical slice, and the face that carries the picture is
         * not in the middle of it.
         */
        className="object-cover object-[38%_center]"
      />

      {/*
       * The photograph is pale, so the line is set dark and the scrim
       * lightens rather than darkens: a dark wash over a light image reads
       * as a smudge. It runs to full ivory at the foot so the picture
       * dissolves into the paper the rest of the page is printed on, which
       * is also what gives the words a clean ground to sit on. At two
       * fifths and 90% it stopped short, and the slogan landed on a chin.
       */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ivory via-ivory/70 to-transparent"
      />

      <div className="gutter absolute inset-x-0 bottom-0 pb-12 lg:pb-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-7 text-center">
          {/*
           * Not an h1. The heading of this page is the frame's name further
           * down; a slogan set in large type is still a slogan, and marking
           * it up as the page's title would tell a crawler the page is about
           * having vision rather than about sunglasses.
           */}
          <p className="display-xl text-balance text-obsidian">
            {dict.meta.slogan}
          </p>
          <Link
            href="/collection"
            className="eyebrow border-b border-obsidian/40 pb-1.5 text-obsidian transition-colors duration-300 hover:border-obsidian"
          >
            {dict.home.heroCta}
          </Link>
        </div>
      </div>
    </section>
  );
}
