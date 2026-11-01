/**
 * Moves the worn portraits off the photographer's grey sweep and onto the
 * paper the rest of the page is printed on, so a shot of the frame and a
 * shot of the frame on a face sit on one ground.
 *
 * Not a fill. The sweep is lit, brighter behind the head than in the
 * corners, and painting over it flat would leave a rectangle floating on
 * the page with a man pasted into it. The gradient is measured, the whole
 * field is moved to paper, and a quarter of the original falloff is kept so
 * the backdrop still reads as lit rather than as a swatch.
 *
 *   node scripts/paper-backdrop.mjs [--dry]
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/media/product";
const MATCHES = /-worn(-angle)?\.jpg$/;

/** --color-ivory, which is what the page behind these images is painted. */
const TARGET = [245, 242, 236];

/** How much of the sweep's own falloff survives the move. */
const KEEP_SWEEP = 0.25;

/*
 * The sweep is near enough neutral that anything with real colour in it is
 * the man, not the room. Skin sits around forty points of chroma and the
 * cognac lens far above that, so twenty is a wide berth.
 */
const CHROMA_PASS = 20;
const CHROMA_FULL = 4;
const CHROMA_NONE = 12;

/*
 * Where his hair stops being hair with the room showing through it and
 * starts being hair. Below the floor the correction is off entirely, and it
 * fades in rather than switching on so the curls do not come back stippled.
 */
const LUMA_FLOOR = 48;
const LUMA_SOFT = 90;

/** Side of the cell the backdrop is averaged over before being smoothed. */
const CELL = 32;

const luma = (r, g, b) => (r + g + b) / 3;
const chroma = (r, g, b) => Math.max(r, g, b) - Math.min(r, g, b);
const clamp01 = (n) => (n < 0 ? 0 : n > 1 ? 1 : n);

/**
 * Everything the camera saw of the room, found by walking in from the
 * edges. Connectivity is doing the work a colour test cannot: his shirt is
 * white and all but neutral, and the only reason it survives is that the
 * jacket stands between it and the border. The bottom edge is left unseeded
 * for the same reason, since the shirt reaches it.
 */
function roomMask(data, width, height, channels) {
  const mask = new Uint8Array(width * height);
  const stack = [];

  const consider = (x, y) => {
    const p = y * width + x;
    if (mask[p]) return;
    const i = p * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    if (chroma(r, g, b) > CHROMA_PASS) return;
    if (luma(r, g, b) < LUMA_FLOOR) return;
    mask[p] = 1;
    stack.push(p);
  };

  for (let x = 0; x < width; x += 1) consider(x, 0);
  for (let y = 0; y < height - 1; y += 1) {
    consider(0, y);
    consider(width - 1, y);
  }

  while (stack.length) {
    const p = stack.pop();
    const x = p % width;
    const y = (p / width) | 0;
    if (x > 0) consider(x - 1, y);
    if (x < width - 1) consider(x + 1, y);
    if (y > 0) consider(x, y - 1);
    if (y < height - 1) consider(x, y + 1);
  }

  return mask;
}

/**
 * The lit sweep itself, averaged over cells of clean room and then grown
 * into the cells the man occupies so that the pixels at his edge are
 * corrected against the backdrop that was behind him rather than against
 * some average of the whole wall.
 */
async function backdropField(data, mask, width, height, channels) {
  const gw = Math.ceil(width / CELL);
  const gh = Math.ceil(height / CELL);
  const sum = new Float64Array(gw * gh * 3);
  const count = new Uint32Array(gw * gh);

  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const p = y * width + x;
      if (!mask[p]) continue;
      const i = p * channels;
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      // Only clean room informs the field. Hair showing the wall through it
      // is darker than the wall and would drag the estimate down with it.
      if (luma(r, g, b) < 140 || chroma(r, g, b) > 12) continue;
      const c = ((y / CELL) | 0) * gw + ((x / CELL) | 0);
      sum[c * 3] += r;
      sum[c * 3 + 1] += g;
      sum[c * 3 + 2] += b;
      count[c] += 1;
    }
  }

  const grid = new Float64Array(gw * gh * 3);
  const known = new Uint8Array(gw * gh);
  for (let c = 0; c < gw * gh; c += 1) {
    if (count[c] < CELL) continue;
    known[c] = 1;
    grid[c * 3] = sum[c * 3] / count[c];
    grid[c * 3 + 1] = sum[c * 3 + 1] / count[c];
    grid[c * 3 + 2] = sum[c * 3 + 2] / count[c];
  }

  // Grow the measured cells over the unmeasured ones until the field is
  // whole, which is a guess, but a guess about a wall the man is standing
  // in front of and nobody will ever see.
  for (let pass = 0; pass < gw + gh; pass += 1) {
    let filled = 0;
    const next = known.slice();
    for (let c = 0; c < gw * gh; c += 1) {
      if (known[c]) continue;
      const x = c % gw;
      const y = (c / gw) | 0;
      let n = 0;
      const acc = [0, 0, 0];
      for (const [dx, dy] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || ny < 0 || nx >= gw || ny >= gh) continue;
        const q = ny * gw + nx;
        if (!known[q]) continue;
        acc[0] += grid[q * 3];
        acc[1] += grid[q * 3 + 1];
        acc[2] += grid[q * 3 + 2];
        n += 1;
      }
      if (!n) continue;
      grid[c * 3] = acc[0] / n;
      grid[c * 3 + 1] = acc[1] / n;
      grid[c * 3 + 2] = acc[2] / n;
      next[c] = 1;
      filled += 1;
    }
    known.set(next);
    if (!filled) break;
  }

  const small = Buffer.alloc(gw * gh * 3);
  for (let c = 0; c < gw * gh; c += 1) {
    small[c * 3] = Math.round(grid[c * 3]);
    small[c * 3 + 1] = Math.round(grid[c * 3 + 1]);
    small[c * 3 + 2] = Math.round(grid[c * 3 + 2]);
  }

  return sharp(small, { raw: { width: gw, height: gh, channels: 3 } })
    .resize(width, height, { kernel: "cubic" })
    .blur(CELL / 2)
    .raw()
    .toBuffer();
}

async function paper(file) {
  const source = path.join(DIR, file);
  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const mask = roomMask(data, width, height, channels);
  const field = await backdropField(data, mask, width, height, channels);

  let n = 0;
  const mean = [0, 0, 0];
  for (let p = 0; p < width * height; p += 1) {
    if (!mask[p]) continue;
    mean[0] += field[p * 3];
    mean[1] += field[p * 3 + 1];
    mean[2] += field[p * 3 + 2];
    n += 1;
  }
  mean[0] /= n;
  mean[1] /= n;
  mean[2] /= n;

  const out = Buffer.from(data);
  for (let p = 0; p < width * height; p += 1) {
    if (!mask[p]) continue;
    const i = p * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    const bg = [field[p * 3], field[p * 3 + 1], field[p * 3 + 2]];
    const bgLuma = luma(bg[0], bg[1], bg[2]);
    const here = luma(r, g, b);

    /*
     * How much of this pixel is room. Where the room is unobstructed it is
     * all of it. Where his hair is in front of it the pixel is the two of
     * them mixed, and since hair this dark contributes almost nothing to
     * the brightness, what is left of the brightness is what is left of the
     * room. Correct that fraction and a curl keeps its edge instead of
     * acquiring a grey outline.
     */
    let w = Math.min(here / bgLuma, 1);
    w *= clamp01((here - LUMA_FLOOR) / (LUMA_SOFT - LUMA_FLOOR));

    const excess = chroma(r, g, b) - chroma(bg[0], bg[1], bg[2]);
    w *= clamp01((CHROMA_NONE - excess) / (CHROMA_NONE - CHROMA_FULL));
    if (w <= 0) continue;

    for (let c = 0; c < 3; c += 1) {
      const want = TARGET[c] + KEEP_SWEEP * (bg[c] - mean[c]);
      const v = data[i + c] + w * (want - bg[c]);
      out[i + c] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
  }

  if (process.argv.includes("--dry")) {
    console.log(`${file}  room ${((n / (width * height)) * 100).toFixed(1)}%`);
    return;
  }

  await sharp(out, { raw: { width, height, channels } })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(source);
  console.log(`${file}  room ${((n / (width * height)) * 100).toFixed(1)}%`);
}

const files = (await readdir(DIR)).filter((f) => MATCHES.test(f)).sort();
for (const file of files) await paper(file);
