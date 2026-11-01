/**
 * Takes the blemishes off the model without touching anything else about
 * his face.
 *
 * The obvious way to do this is to regenerate the portrait and ask for
 * clear skin, and it is the wrong way: the same man appears in six images
 * across three lenses and two poses, and a generator asked twice for one
 * face returns two. So nothing here invents pixels. A spot is replaced by
 * the skin immediately around it, which is what a retoucher does with a
 * healing brush and what the image already contains.
 *
 *   node scripts/retouch-skin.mjs [--dry]
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/media/product";
const MATCHES = /-worn(-angle)?\.jpg$/;

/** Radius of the skin a spot is judged and then replaced against. */
const HEAL = 11;

/** How much darker than its surroundings a mark has to be to count. */
const DARKER_THAN = 12;

/*
 * What a blemish is allowed to be. These two numbers are the whole safety
 * argument. A mole is small and round; an eyebrow is large, a nostril is
 * large, and the line between the lips is long and thin. Nothing that
 * fails both tests is touched, so the features survive and only the marks
 * go.
 */
const MIN_AREA = 5;
const MAX_AREA = 150;
const MAX_SPAN = 20;

/*
 * And roundish, but only once it is long enough for that to mean anything.
 * A loose hair lying across the cheek passes every test above, because it
 * is small and dark and sitting on skin; what it is not is round. A mark
 * five pixels across is not elongated, it is just small, and judging it on
 * proportion throws away the very thing being looked for.
 */
const ELONGATED_ABOVE = 8;
const MIN_ROUNDNESS = 0.4;

const luma = (r, g, b) => (r + g + b) / 3;

/** Skin, as distinct from hair, acetate and the paper behind him. */
const isSkin = (r, g, b) => luma(r, g, b) > 120 && r - b > 18;

async function retouch(file) {
  const source = path.join(DIR, file);
  const base = sharp(source).removeAlpha();

  const { data, info } = await base
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const healed = await base.clone().median(HEAL).raw().toBuffer();
  const { width, height, channels } = info;

  // Every pixel sitting darker on clear skin than the skin around it.
  const candidate = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p += 1) {
    const i = p * channels;
    if (!isSkin(healed[i], healed[i + 1], healed[i + 2])) continue;
    const delta =
      luma(healed[i], healed[i + 1], healed[i + 2]) -
      luma(data[i], data[i + 1], data[i + 2]);
    if (delta > DARKER_THAN) candidate[p] = 1;
  }

  // Grouped, so each mark can be judged whole rather than pixel by pixel.
  const mask = new Uint8Array(width * height);
  const seen = new Uint8Array(width * height);
  let marks = 0;
  const stack = [];
  for (let start = 0; start < width * height; start += 1) {
    if (!candidate[start] || seen[start]) continue;
    stack.length = 0;
    stack.push(start);
    seen[start] = 1;
    const group = [];
    let minX = width;
    let maxX = 0;
    let minY = height;
    let maxY = 0;

    while (stack.length) {
      const p = stack.pop();
      group.push(p);
      const x = p % width;
      const y = (p / width) | 0;
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
      if (group.length > MAX_AREA * 4) break;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < width - 1 ? p + 1 : -1,
        y > 0 ? p - width : -1,
        y < height - 1 ? p + width : -1,
      ]) {
        if (q < 0 || seen[q] || !candidate[q]) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }

    if (group.length < MIN_AREA || group.length > MAX_AREA) continue;
    const spanX = maxX - minX + 1;
    const spanY = maxY - minY + 1;
    if (spanX > MAX_SPAN || spanY > MAX_SPAN) continue;
    const longest = Math.max(spanX, spanY);
    const roundness = Math.min(spanX, spanY) / longest;
    if (longest >= ELONGATED_ABOVE && roundness < MIN_ROUNDNESS) continue;
    for (const p of group) mask[p] = 1;
    marks += 1;
  }

  /*
   * Grown by a pixel and then softened, because a mark is darkest at its
   * centre and fades, and replacing only the part that passed the test
   * leaves a faint ring exactly where the spot was.
   */
  const grown = new Uint8Array(width * height);
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      for (let dy = -2; dy <= 2; dy += 1) {
        for (let dx = -2; dx <= 2; dx += 1) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          grown[ny * width + nx] = 1;
        }
      }
    }
  }

  /*
   * Handed one channel, sharp gives three back. Reading the result as if
   * it were still one is not an error anywhere: the indices stay in
   * bounds, a third of them are even non-zero, and the retouch lands in
   * the wrong third of the picture while the log reports the right number
   * of marks. So the stride is taken from the result rather than assumed.
   */
  const feather = await sharp(Buffer.from(grown.map((v) => v * 255)), {
    raw: { width, height, channels: 1 },
  })
    .blur(2)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const stride = feather.info.channels;

  const out = Buffer.from(data);
  let moved = 0;
  for (let p = 0; p < width * height; p += 1) {
    const w = feather.data[p * stride] / 255;
    if (w <= 0) continue;
    const i = p * channels;
    for (let c = 0; c < 3; c += 1) {
      out[i + c] = Math.round(data[i + c] * (1 - w) + healed[i + c] * w);
    }
    moved += 1;
  }

  console.log(
    `${file}  ${marks} marks, ${moved} px (${((moved / (width * height)) * 100).toFixed(3)}%)`,
  );
  if (process.argv.includes("--dry")) return;

  await sharp(out, { raw: { width, height, channels } })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(source);
}

const files = (await readdir(DIR)).filter((f) => MATCHES.test(f)).sort();
for (const file of files) await retouch(file);
