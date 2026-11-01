/**
 * Takes the cream out from behind the frames.
 *
 * The angle cutouts were matted against the ivory page, so the soft contact
 * shadow the studio sweep carries never reached the white the original flood
 * fill was looking for and survived as opaque cream. Invisible on cream
 * paper, which is why it shipped. Put the same file on the grey the worn
 * portraits are shot against and it reads as a smear under the frame.
 *
 * The masters are gone, so this re-cuts the published PNGs. A flood fill
 * from the border rather than a colour key, because the frame has pale parts
 * of its own: the translucent temples seen through the lenses are light, and
 * a key would eat them. Anything light and reachable from the edge is
 * backdrop; anything light and walled in by the frame is the frame.
 *
 *   node scripts/reclean-cutouts.mjs            # all angle PNGs, in place
 *   node scripts/reclean-cutouts.mjs --dry      # report only, write nothing
 */
import { readdir, rename } from "node:fs/promises";
import { join } from "node:path";

import sharp from "sharp";

const DIR = "public/media/product";
const DRY = process.argv.includes("--dry");

/*
 * The sweep does not stop at the cream. It falls off through the contact
 * shadow into the frame, and a single cutoff put the wall in the middle of
 * that ramp: the cream under the frame was light enough to remove and
 * unreachable behind a band of shadow that was not.
 *
 * So two marks. Anything above CLEAR is sweep and goes entirely. Between
 * WALK and CLEAR is the shadow, which the fill is allowed to walk through
 * and which fades rather than cutting, so the frame keeps a soft edge
 * instead of gaining a cut-out line.
 */
const CLEAR = 212;
const WALK = 150;
/** Neutral: the lenses are light in places but strongly coloured. */
const MAX_CHROMA = 42;

/** How much of this pixel survives, 0 gone to 1 untouched. */
function keep(r, g, b) {
  const min = Math.min(r, g, b);
  if (min >= CLEAR) return 0;
  return (CLEAR - min) / (CLEAR - WALK);
}

/**
 * Coming in from the edge, the fill may walk down the contact shadow,
 * because the frame is dark and stops it.
 */
function passableFromEdge(r, g, b, a) {
  if (a < 250) return true;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= WALK && max - min <= MAX_CHROMA;
}

/**
 * Starting from paper already inside the frame, it may not. The smoke lens
 * is a neutral grey that sits at 178 with almost no chroma, which the rule
 * above happily walks straight through: seeded from the white gap it ate
 * the bottom half of both lenses. Enclosed paper is pure sweep and nothing
 * else, so from in there only pure sweep is passable.
 */
function passableInside(r, g, b, a) {
  if (a < 250) return true;
  const min = Math.min(r, g, b);
  const max = Math.max(r, g, b);
  return min >= 236 && max - min <= 10;
}

async function reclean(file) {
  const path = join(DIR, file);
  const { data, info } = await sharp(path)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width: w, height: h } = info;
  const seen = new Uint8Array(w * h);
  const stack = [];

  let passable = passableFromEdge;

  const push = (x, y) => {
    if (x < 0 || y < 0 || x >= w || y >= h) return;
    const p = y * w + x;
    if (seen[p]) return;
    const i = p * 4;
    if (!passable(data[i], data[i + 1], data[i + 2], data[i + 3])) return;
    seen[p] = 1;
    stack.push(p);
  };

  const drain = () => {
    while (stack.length) {
      const p = stack.pop();
      const x = p % w;
      const y = (p - x) / w;
      push(x + 1, y);
      push(x - 1, y);
      push(x, y + 1);
      push(x, y - 1);
    }
  };

  for (let x = 0; x < w; x++) {
    push(x, 0);
    push(x, h - 1);
  }
  for (let y = 0; y < h; y++) {
    push(0, y);
    push(w - 1, y);
  }

  /*
   * The border alone does not reach everything. On the side view the gap
   * enclosed by the temple and the frame front is sweep you can see
   * straight through, walled off from the edge by the temple, and it stayed
   * white. Invisible on cream, a bright hole on anything else.
   *
   * Seeding from the paper itself reaches it. Pure white is unambiguous
   * here: the sweep is 255 at chroma 0, while the palest thing on the frame
   * is a lens at 124 with chroma 80, so there is no honest way for this to
   * take a bite out of the product.
   */
  drain();

  passable = passableInside;
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const i = (y * w + x) * 4;
      if (data[i + 3] < 250) continue;
      const min = Math.min(data[i], data[i + 1], data[i + 2]);
      const max = Math.max(data[i], data[i + 1], data[i + 2]);
      if (min >= 240 && max - min <= 8) push(x, y);
    }
  }
  drain();

  let cleared = 0;
  for (let p = 0; p < w * h; p++) {
    if (!seen[p]) continue;
    const i = p * 4;
    const was = data[i + 3];
    const next = Math.round(was * keep(data[i], data[i + 1], data[i + 2]));
    if (next < was) cleared++;
    data[i + 3] = next;
  }

  const before = countOpaque(data, w * h, true);
  if (DRY) return { file, cleared, opaque: before };

  const tmp = `${path}.tmp.png`;
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .png({ compressionLevel: 9 })
    .toFile(tmp);
  await rename(tmp, path);

  /*
   * Nothing reads the 640 variants today, next/image makes its own, but
   * leaving them holding the old matte is how someone later ships the cream
   * back without touching a thing.
   */
  await sharp(data, { raw: { width: w, height: h, channels: 4 } })
    .resize({ width: 640 })
    .webp({ quality: 90 })
    .toFile(join(DIR, file.replace(/\.png$/, "-640.webp")));

  return { file, cleared, opaque: before };
}

function countOpaque(data, pixels) {
  let n = 0;
  for (let p = 0; p < pixels; p++) if (data[p * 4 + 3] > 250) n++;
  return n / pixels;
}

const files = (await readdir(DIR)).filter((f) =>
  /-(front|side|folded)\.png$/.test(f),
);

for (const file of files) {
  const r = await reclean(file);
  console.log(
    `${r.file.padEnd(34)} cleared ${String(r.cleared).padStart(7)} px   ` +
      `opaque now ${(r.opaque * 100).toFixed(1)}%`,
  );
}
console.log(DRY ? "dry run, nothing written" : `rewrote ${files.length} files`);
