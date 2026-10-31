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
 * THE TWO LAYOUTS. The photograph is 2.95:1 and a phone is roughly 1:1.9,
 * so a single full-bleed crop cannot hold both models: filling a portrait
 * screen with this frame shows about a sixth of its width, which is one
 * face with the sunglasses cut off at either edge. Two people wearing the
 * product is the more persuasive picture, so on a phone the photograph
 * takes a three-by-two band at the top of the screen, which is about the
 * tallest it can be while still showing the stretch of width that holds
 * both faces with their frames intact, and the slogan sits below it on the
 * paper. A ratio is used rather than a share of the viewport because the
 * crop depends on the box's own proportions and not on the phone: 3:2
 * against a 2.95:1 source shows the middle half of the width at any
 * screen size, where a percentage of height would show less of it on a
 * tall phone and clip the very thing it is there to keep. The section still
 * fills the viewport; only the picture stops short of it. From `lg` up the
 * frame is wide enough to do both at once and the image goes full bleed
 * with the line over it.
 *
 * NOTE ON THE SOURCE: campaign.jpg is 1024px wide against a full viewport,
 * so it is enlarged roughly 1.4x on a laptop. It wants a master around
 * 2800px, and a second portrait crop would let the phone go full bleed too.
 */
export async function Editorial() {
  const dict = await getDictionary();

  return (
    <section className="relative isolate flex h-[calc(100svh-var(--chrome-height))] w-full flex-col overflow-hidden bg-ivory">
      <div className="relative aspect-3/2 w-full shrink-0 bg-ivory-dim lg:absolute lg:inset-0 lg:aspect-auto">
        <Image
          src="/media/editorial/campaign.jpg"
          alt={dict.home.editorialAlt}
          fill
          /*
           * The largest paint on the site. `priority` is deprecated in Next
           * 16 and never emitted a priority hint anyway; these two
           * attributes are what the browser actually reads. Quality is
           * raised because an enlarged photograph compounds the encoder's
           * own softening.
           */
          fetchPriority="high"
          loading="eager"
          quality={90}
          sizes="100vw"
          /*
           * Two centres for two crops. The phone window is centred on the
           * midpoint between the two models so neither is clipped; the
           * desktop window is held left of centre, where the frame that
           * carries the picture actually is.
           */
          className="object-cover object-[47%_center] lg:object-[38%_center]"
        />

        {/*
         * The photograph is pale, so the line is set dark and the scrim
         * lightens rather than darkens: a dark wash over a light image
         * reads as a smudge. It runs to full ivory at the foot so the
         * picture dissolves into the paper the rest of the page is printed
         * on. On a phone that is all it does, softening the cut edge of the
         * band; on a desktop it also gives the words a clean ground, and at
         * two fifths and 90% it stopped short and the slogan landed on a
         * chin.
         */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/5 bg-gradient-to-t from-ivory to-transparent lg:h-1/2 lg:via-ivory/70"
        />
      </div>

      {/*
       * The padding is not symmetry: on a phone the line is centred in the
       * paper below the band, and the extra foot lifts it to the optical
       * centre rather than the measured one, which is where the eye expects
       * to find it under a picture.
       */}
      <div className="gutter relative flex flex-1 items-center justify-center pb-20 lg:absolute lg:inset-x-0 lg:bottom-0 lg:flex-none lg:items-end lg:pb-16">
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
