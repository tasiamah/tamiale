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
 * TWO FILES, NOT TWO CROPS. The campaign frame is 2.95:1 and a phone is
 * about 1:1.9. Filling a portrait screen from the landscape file shows
 * roughly a sixth of its width, which is one face with the sunglasses cut
 * off at either edge, and no object-position rescues that: `cover` cannot
 * show more width than the box's own proportions allow. So the phone gets
 * its own portrait file, cut to the stretch of width that holds both
 * models and extended downward into the paper. See
 * scripts/make-portrait-hero.mjs, which derives it and explains itself.
 *
 * It is pinned to the top. The portrait file is taller than any phone in
 * circulation, so the width is always complete and the only thing a short
 * screen loses is the extended paper at the foot, which is the one part of
 * it that was never photographed.
 *
 * NOTE ON THE SOURCE: the landscape master is 1024px against a full
 * viewport, so it is enlarged roughly 1.4x on a laptop, and the portrait
 * file is cut from it and so cannot be wider than 560px. Both are soft on a
 * dense screen. A real master around 2800px, with a portrait crop shot or
 * cropped by the editor, replaces all of this and lets the script go.
 */

/*
 * Written out rather than left to next/image. The two files are different
 * pictures, not two sizes of one, and `<Image>` has no art direction: the
 * usual workaround of two of them behind `lg:hidden` makes the browser
 * preload both, so every phone pays for the desktop frame it will never
 * paint. A `<picture>` with media-scoped preloads fetches exactly one.
 *
 * One width each because neither master is wide enough to need a set: the
 * optimiser returns the source size once the requested width passes it.
 */
const source = (file: string, width: number) =>
  `/_next/image?url=${encodeURIComponent(`/media/editorial/${file}`)}&w=${width}&q=90`;

const WIDE = source("campaign.jpg", 1080);
const TALL = source("campaign-portrait.jpg", 640);
const PHONE = "(max-width: 1023px)";
const DESK = "(min-width: 1024px)";

export async function Editorial() {
  const dict = await getDictionary();

  return (
    <section className="relative isolate h-[calc(100svh-var(--chrome-height))] w-full overflow-hidden bg-ivory">
      {/* React hoists these into the head, ahead of the markup below. */}
      <link
        rel="preload"
        as="image"
        href={TALL}
        media={PHONE}
        fetchPriority="high"
      />
      <link
        rel="preload"
        as="image"
        href={WIDE}
        media={DESK}
        fetchPriority="high"
      />

      <picture>
        <source media={PHONE} srcSet={TALL} />
        <img
          src={WIDE}
          alt={dict.home.editorialAlt}
          fetchPriority="high"
          loading="eager"
          decoding="async"
          /*
           * Two centres for two files. The phone frame is already cut to
           * the models and is held at its top edge, where the faces are.
           * The desktop frame is held left of centre, where the sunglasses
           * that carry the picture actually are.
           */
          className="absolute inset-0 size-full object-cover object-top lg:object-[38%_center]"
        />
      </picture>

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
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-ivory via-ivory/70 to-transparent"
      />

      <div className="gutter absolute inset-x-0 bottom-0 pb-12 lg:pb-16">
        <div className="mx-auto flex max-w-xl flex-col items-center gap-7 text-center">
          {/*
           * Not an h1. The heading of this page is the collection title
           * below; a slogan set in large type is still a slogan, and
           * marking it up as the page's title would tell a crawler the
           * page is about having vision rather than about sunglasses.
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
