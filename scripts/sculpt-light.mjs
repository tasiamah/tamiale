/**
 * Dodges and burns the model's face the way a campaign retoucher would.
 *
 * Nothing is added. A face in a photograph is already lit, and what
 * separates a catalogue shot from a campaign one is mostly how far that
 * lighting is carried: the cheekbone a little brighter, the hollow under it
 * a little deeper, the brow ridge and the bridge of the nose picked out.
 * All of that is present here, faintly. This finds it and turns it up.
 *
 * It works on the middle frequencies only. The broad illumination of the
 * face is left alone, so he does not end up lit differently from the room,
 * and the fine detail is left alone, so the pores survive. What is
 * amplified is the band in between, which is exactly the band that
 * describes the shape of a face.
 *
 *   node scripts/sculpt-light.mjs [--strength 0.6] [--preview]
 */

import { readdir } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const DIR = "public/media/product";
const MATCHES = /-worn(-angle)?\.jpg$/;

/*
 * How bright skin has to be to count as lit skin. This is the line that
 * keeps the glasses out of it: what shows through a cognac lens is a warm
 * mid-tone that passes every colour test, and the only thing separating it
 * from a cheek is that the lens has taken two thirds of the light out of
 * it. Skin reads around 170 to 185 here and the same skin behind a lens
 * reads 107 to 126.
 */
const SKIN_FLOOR = 138;

/** The form of the face: cheekbone, brow, jaw, the bridge of the nose. */
const FORM = 16;

/** The light in the room, which is not ours to change. */
const AMBIENT = 72;

/** How far a pixel is allowed to move, so nothing turns into chrome. */
const CEILING = 1.22;
const FLOOR = 0.82;

const luma = (r, g, b) => 0.2126 * r + 0.7152 * g + 0.0722 * b;

/**
 * Skin, and only skin. Carried as a soft edge rather than a hard one,
 * because the alternative is a visible seam along his jaw where the
 * sculpting stops.
 */
function skinMask(data, width, height, channels) {
  const raw = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p += 1) {
    const i = p * channels;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    const warm = r - b;
    if (luma(r, g, b) < SKIN_FLOOR || warm < 20 || warm > 110) continue;
    raw[p] = 1;
  }

  /*
   * What shows through a cognac lens is a warm mid-tone and passes every
   * test above, so without this the sculpting reaches straight through the
   * glasses and lifts the lens along with the cheek. The lens is a
   * published transmission figure, not a complexion, and it is not ours to
   * flatter.
   *
   * The floor above does most of that work. What it leaves are crumbs:
   * the brightest few pixels of an eye behind a lens, scattered inside the
   * frame. Those are dropped here as islands too small to be a face.
   *
   * The threshold has to stay low. His forehead is walled off by his hair
   * above and his eyebrows and the frame below, so it is an island as
   * well, and a rule strict enough to be confident about the lenses stops
   * sculpting the brow, which is half of what was asked for.
   */
  const mask = Buffer.alloc(width * height);
  const seen = new Uint8Array(width * height);
  const parts = [];
  const stack = [];
  for (let start = 0; start < width * height; start += 1) {
    if (!raw[start] || seen[start]) continue;
    stack.length = 0;
    stack.push(start);
    seen[start] = 1;
    const part = [];
    while (stack.length) {
      const p = stack.pop();
      part.push(p);
      const x = p % width;
      const y = (p / width) | 0;
      for (const q of [
        x > 0 ? p - 1 : -1,
        x < width - 1 ? p + 1 : -1,
        y > 0 ? p - width : -1,
        y < height - 1 ? p + width : -1,
      ]) {
        if (q < 0 || seen[q] || !raw[q]) continue;
        seen[q] = 1;
        stack.push(q);
      }
    }
    parts.push(part);
  }

  const mainland = parts.reduce((a, b) => (b.length > a.length ? b : a), []);
  for (const part of parts) {
    if (part.length < mainland.length * 0.02) continue;
    for (const p of part) mask[p] = 255;
  }
  return mask;
}

/** One channel in, three channels back, so the stride is read not assumed. */
async function blurred(plane, width, height, sigma) {
  const out = await sharp(plane, { raw: { width, height, channels: 1 } })
    .blur(sigma)
    .raw()
    .toBuffer({ resolveWithObject: true });
  const stride = out.info.channels;
  const flat = new Float32Array(width * height);
  for (let p = 0; p < width * height; p += 1) flat[p] = out.data[p * stride];
  return flat;
}

/**
 * The average brightness of the skin near a point, counting only skin.
 *
 * An ordinary blur cannot be used here because his hair is black and the
 * face is surrounded by it. A wide blur taken across the boundary reports
 * the forehead as brighter than its surroundings purely because more hair
 * falls inside the wide radius than the narrow one, and amplifying that
 * draws a bright rim along his hairline and down both temples. Weighting
 * by the mask and dividing the weight back out asks only what the skin is
 * doing, so the relief that comes out is the shape of a face rather than
 * the distance to the nearest dark thing.
 */
async function skinBlur(plane, mask, width, height, sigma) {
  const weighted = Buffer.alloc(width * height);
  for (let p = 0; p < width * height; p += 1) {
    weighted[p] = Math.round((plane[p] * mask[p]) / 255);
  }
  const num = await blurred(weighted, width, height, sigma);
  const den = await blurred(mask, width, height, sigma);
  const flat = new Float32Array(width * height);
  for (let p = 0; p < width * height; p += 1) {
    flat[p] = den[p] > 4 ? (num[p] / den[p]) * 255 : plane[p];
  }
  return flat;
}

async function sculpt(file, strength, preview) {
  const source = path.join(DIR, file);
  const { data, info } = await sharp(source)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });
  const { width, height, channels } = info;

  const plane = Buffer.alloc(width * height);
  for (let p = 0; p < width * height; p += 1) {
    const i = p * channels;
    plane[p] = Math.round(luma(data[i], data[i + 1], data[i + 2]));
  }

  const skin = skinMask(data, width, height, channels);
  const form = await skinBlur(plane, skin, width, height, FORM);
  const ambient = await skinBlur(plane, skin, width, height, AMBIENT);
  const mask = await blurred(skin, width, height, 6);

  const out = Buffer.from(data);
  for (let p = 0; p < width * height; p += 1) {
    const w = mask[p] / 255;
    if (w <= 0.01) continue;

    const here = plane[p];
    if (here < 1) continue;

    /*
     * Positive on a cheekbone, negative in the hollow beneath it. Scaling
     * the pixel rather than adding to it keeps the skin its own colour:
     * lifting a warm mid-tone by a fixed number of levels walks it toward
     * grey, and a face that loses its warmth as it gains its shape has
     * been lit by the wrong lamp.
     */
    const relief = form[p] - ambient[p];
    const factor = Math.min(
      CEILING,
      Math.max(FLOOR, 1 + (strength * w * relief) / here),
    );
    if (Math.abs(factor - 1) < 0.002) continue;

    const i = p * channels;
    for (let c = 0; c < 3; c += 1) {
      const v = data[i + c] * factor;
      out[i + c] = v < 0 ? 0 : v > 255 ? 255 : Math.round(v);
    }
  }

  if (preview) {
    await sharp(out, { raw: { width, height, channels } })
      .jpeg({ quality: 92 })
      .toFile(`/tmp/sculpt-${strength}-${file}`);
    return;
  }

  await sharp(out, { raw: { width, height, channels } })
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toFile(source);
  console.log(`${file}  sculpted at ${strength}`);
}

const arg = (name, fallback) => {
  const at = process.argv.indexOf(name);
  return at < 0 ? fallback : Number(process.argv[at + 1]);
};
const strength = arg("--strength", 0.6);
const preview = process.argv.includes("--preview");
const files = (await readdir(DIR)).filter((f) => MATCHES.test(f)).sort();
for (const file of preview ? files.filter((f) => f.includes("cognac")) : files) {
  await sculpt(file, strength, preview);
}
