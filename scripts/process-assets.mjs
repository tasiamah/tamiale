/**
 * Derives the Tamiale product media set from the single master photograph.
 *
 * The master is a studio 3/4 view of THE MARINA in Onyx / Ember on white.
 * From it we produce, for every launch colorway, a background-free PNG whose
 * lens region has been re-tinted in HSV while preserving the original
 * gradient, specular highlights and frame shading.
 *
 * Run with: pnpm assets
 */
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const MASTER = process.argv[2];
if (!MASTER) {
  console.error("usage: node scripts/process-assets.mjs <master-photo>");
  process.exit(1);
}

const OUT = path.resolve("public/media/product");

/** Studio crop that removes the viewer chrome and the "C5" supplier label. */
const CROP = { left: 120, top: 250, width: 790, height: 340 };

/** Background is a pure studio white; anything above this is sweep, not product. */
const WHITE = 236;
/**
 * Chroma above this is lens glass; the acetate and the sweep are achromatic.
 * The low floor also catches the ember spill on the rims, which would
 * otherwise read as red fringing in the cool colorways.
 */
const CHROMA_MIN = 12;
const CHROMA_FULL = 34;

/**
 * Launch colorways. `hue`/`sat` describe the target glass in HSV degrees and
 * 0-1 saturation; `value` lifts or deepens the tint density.
 */
const COLORWAYS = [
  { id: "ember", name: "Ember", hue: null, sat: 1, value: 1 },
  { id: "champagne", name: "Champagne", hue: 40, sat: 0.6, value: 1.02 },
  { id: "smoke", name: "Smoke", hue: 220, sat: 0.07, value: 0.72 },
];

function rgbToHsv(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  return { h, s: max === 0 ? 0 : d / max, v: max / 255 };
}

function hsvToRgb(h, s, v) {
  const c = v * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = v - c;
  let rgb;
  if (h < 60) rgb = [c, x, 0];
  else if (h < 120) rgb = [x, c, 0];
  else if (h < 180) rgb = [0, c, x];
  else if (h < 240) rgb = [0, x, c];
  else if (h < 300) rgb = [x, 0, c];
  else rgb = [c, 0, x];
  return rgb.map((n) => Math.round(Math.min(255, Math.max(0, (n + m) * 255))));
}

/**
 * Flood fills the studio sweep from the border so that white specular
 * highlights *inside* the frame survive the cutout.
 */
function backgroundMask(data, width, height, channels) {
  const bg = new Uint8Array(width * height);
  const queue = new Int32Array(width * height);
  let head = 0;
  let tail = 0;

  const isSweep = (i) => {
    const o = i * channels;
    return data[o] >= WHITE && data[o + 1] >= WHITE && data[o + 2] >= WHITE;
  };
  const push = (i) => {
    if (bg[i] || !isSweep(i)) return;
    bg[i] = 1;
    queue[tail++] = i;
  };

  for (let x = 0; x < width; x++) {
    push(x);
    push((height - 1) * width + x);
  }
  for (let y = 0; y < height; y++) {
    push(y * width);
    push(y * width + width - 1);
  }

  while (head < tail) {
    const i = queue[head++];
    const x = i % width;
    const y = (i / width) | 0;
    if (x > 0) push(i - 1);
    if (x < width - 1) push(i + 1);
    if (y > 0) push(i - width);
    if (y < height - 1) push(i + width);
  }

  return bg;
}

/**
 * Depth of each product pixel inside the silhouette, counted in pixels from
 * the studio sweep and capped at BAND. Used to ramp the alpha so that the
 * specular highlight running along the top of the temple, which is as bright
 * as the background it sits against, fades out instead of being cut into
 * a row of white teeth.
 */
const BAND = 3;

function edgeDepth(bg, width, height) {
  const depth = new Uint8Array(width * height);
  for (let i = 0; i < depth.length; i++) depth[i] = bg[i] ? 0 : BAND + 1;

  for (let pass = 1; pass <= BAND; pass++) {
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const i = y * width + x;
        if (depth[i] <= BAND) continue;
        const touching =
          (x > 0 && depth[i - 1] === pass - 1) ||
          (x < width - 1 && depth[i + 1] === pass - 1) ||
          (y > 0 && depth[i - width] === pass - 1) ||
          (y < height - 1 && depth[i + width] === pass - 1);
        if (touching) depth[i] = pass;
      }
    }
  }
  return depth;
}

/** Three-tap box blur of the alpha channel, to settle the ramp. */
function featherAlpha(out, width, height, channels) {
  const alpha = new Uint8ClampedArray(width * height);
  for (let i = 0; i < width * height; i++) alpha[i] = out[i * channels + 3];
  const blurred = new Uint8ClampedArray(alpha.length);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let sum = 0;
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx;
          const ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
          sum += alpha[ny * width + nx];
          n++;
        }
      }
      blurred[y * width + x] = sum / n;
    }
  }
  for (let i = 0; i < width * height; i++) {
    // Keep the solid interior crisp; only soften the transition band.
    out[i * channels + 3] = alpha[i] === 255 ? 255 : blurred[i];
  }
}

async function main() {
  await mkdir(OUT, { recursive: true });

  const base = sharp(MASTER).extract(CROP).ensureAlpha();
  const { data, info } = await base
    .clone()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const bg = backgroundMask(data, width, height, channels);
  const depth = edgeDepth(bg, width, height);

  /** Alpha for a pixel `d` pixels inside the silhouette with luminance `lum`. */
  const edgeAlpha = (d, lum) => {
    if (d > BAND) return 255;
    const brightness = (255 - lum) * (2 + d * 2);
    return Math.max(0, Math.min(255, brightness + (d - 1) * 70));
  };

  const manifest = [];

  for (const way of COLORWAYS) {
    const out = Buffer.from(data);

    for (let i = 0; i < width * height; i++) {
      const o = i * channels;
      if (bg[i]) {
        out[o + 3] = 0;
        continue;
      }
      if (depth[i] <= BAND) {
        const lum =
          0.299 * data[o] + 0.587 * data[o + 1] + 0.114 * data[o + 2];
        out[o + 3] = edgeAlpha(depth[i], lum);
      }
      if (way.hue === null) continue;

      const r = data[o];
      const g = data[o + 1];
      const b = data[o + 2];
      const chroma = Math.max(r, g, b) - Math.min(r, g, b);
      if (chroma < CHROMA_MIN) continue;

      const { h, s, v } = rgbToHsv(r, g, b);
      // Only the glass is warm; metal rivets and reflections stay as shot.
      const isGlass = h <= 70 || h >= 330;
      if (!isGlass) continue;

      const weight = Math.min(1, (chroma - CHROMA_MIN) / (CHROMA_FULL - CHROMA_MIN));
      const [nr, ng, nb] = hsvToRgb(
        way.hue,
        Math.min(1, s * way.sat * 1.15),
        Math.min(1, v * way.value),
      );
      out[o] = Math.round(r + (nr - r) * weight);
      out[o + 1] = Math.round(g + (ng - g) * weight);
      out[o + 2] = Math.round(b + (nb - b) * weight);
    }

    featherAlpha(out, width, height, channels);

    const image = sharp(out, { raw: { width, height, channels } }).trim({
      background: { r: 0, g: 0, b: 0, alpha: 0 },
      threshold: 0,
    });

    const file = `marina-onyx-${way.id}.png`;
    const meta = await image
      .clone()
      .png({ compressionLevel: 9 })
      .toFile(path.join(OUT, file));

    await image
      .clone()
      .resize({ width: 640 })
      .webp({ quality: 88 })
      .toFile(path.join(OUT, `marina-onyx-${way.id}-640.webp`));

    // Flat silhouette used as the loading placeholder and in dark sections.
    manifest.push({
      colorway: way.id,
      name: way.name,
      src: `/media/product/${file}`,
      width: meta.width,
      height: meta.height,
    });
    console.log(`${file}  ${meta.width}x${meta.height}`);
  }

  await writeFile(
    path.join(OUT, "manifest.json"),
    `${JSON.stringify({ model: "The Marina", frame: "Onyx", media: manifest }, null, 2)}\n`,
  );
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
