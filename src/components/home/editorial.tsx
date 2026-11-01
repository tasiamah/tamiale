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
 * TWO FILES, NOT TWO CROPS. The campaign frame is 2.34:1 and a phone is
 * about 1:1.9. Filling a portrait screen from the landscape file shows
 * only a narrow band of its width, which is one face with the sunglasses
 * cut off at either edge, and no object-position rescues that: `cover`
 * cannot show more width than the box's own proportions allow. So the
 * phone gets a second master, composed in portrait, with the same two
 * models in the same frames against the same sweep.
 *
 * Earlier versions cut the phone frame out of the landscape one and
 * extended it downwards into the paper, because there was nothing else to
 * work with. That could never fill a phone: the landscape master is 438px
 * tall, so the photograph's share of the screen was its height over the
 * crop width, and the crop could not go narrower than two faces. It topped
 * out a little under half, and everything below that was invented. The
 * portrait master removes the arithmetic along with the invention.
 *
 * NOTE ON THE SOURCES: 1280x720 and 720x1280. Neither is a 4K frame and
 * neither can be made into one by enlarging it, so both are still short of
 * a dense screen: the desktop frame is drawn at about 1.13x on a 1440px
 * window, the phone frame at about 1.15x. That is close enough to read as
 * a photograph rather than as a blur, which the old 1024x438 wide master
 * was not: it had to be drawn at 1.78x to cover the same box.
 *
 * A real 4K master replaces either file as it stands. Raise the widths
 * below to match it and nothing else here changes.
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

/*
 * The widths have to come from `images.deviceSizes`; the optimiser answers
 * 400 to anything else rather than rounding.
 *
 * 1920 overshoots the wide master on purpose. The optimiser returns the
 * source size once the request passes it, so the desktop frame is served
 * whole at 1280.
 *
 * The phone is held at 640 against a 720 master, which looks like leaving
 * the last eighty pixels on the table and is deliberate. Serving 720 cost
 * 5.5 KB and measured 180ms of largest contentful paint, which is a fifth
 * of the remaining budget before 2.5s, and bought almost nothing: a phone
 * at three times density draws this picture at 1.63x either way, so both
 * widths are enlarged and neither is sharp. Desktop had a second of room
 * and a real gain to show for it. This one did not.
 */
const WIDE = source("campaign.jpg", 1920);
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
           * The portrait master is 9:16 and a phone is near enough the
           * same, so `cover` trims a few pixels off the sides and shows
           * the frame whole, top to bottom. The desktop frame is held left
           * of centre, where the sunglasses that carry the picture are.
           */
          className="absolute inset-0 size-full object-cover lg:object-[38%_center]"
        />
      </picture>

      {/*
       * The photograph is pale, so the line is set dark and the scrim
       * lightens rather than darkens: a dark wash over a light image reads
       * as a smudge. It stops short of opaque now that there is a real
       * picture underneath for its whole height, because running it to
       * solid ivory would hide the thing the frame was shot for and put
       * the bottom of the screen back to being paper.
       */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-ivory/95 via-ivory/55 to-transparent"
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
