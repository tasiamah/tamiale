/**
 * Derive the portrait hero from the landscape campaign frame.
 *
 * The campaign master is 2.95:1 and a phone is about 1:1.9. Filling a
 * portrait screen with the landscape file shows roughly a sixth of its
 * width, which is one face with the sunglasses cut off at either edge, and
 * no object-position can fix that: `cover` cannot show more width than the
 * box's own proportions allow. The only way to have a full-bleed phone hero
 * and both models in it is a file that is actually portrait.
 *
 * So: crop to the stretch of width that holds both frames, then extend the
 * floor downward to make the canvas tall.
 *
 * The extension is two layers. Underneath is the studio floor: a flat wash
 * sampled from the empty bottom-left corner of the frame, graded slightly
 * lighter as it falls, which is what the floor does in the photograph. Over
 * it, for the first third only, sits the picture's own bottom few rows
 * flipped and stretched downward, fading out as it goes. That upper layer
 * is what stops the sleeves and the cuff from being guillotined by a
 * horizontal line: they dissolve into the floor instead of ending on it.
 *
 * Two earlier attempts are worth recording so they are not tried again.
 * Mirroring the whole frame puts two upside-down faces in the lower half
 * and no amount of blur hides them. Smearing the bottom strip the entire
 * way down with no floor underneath gives a thousand pixels of vertical
 * flesh-toned streaks, which is worse than a hard edge.
 *
 * THIS IS A STOPGAP. It is here so the derivation is reproducible and
 * documented rather than a mystery binary in public/, and it should be
 * deleted the day the editor delivers a real portrait crop. An extended
 * floor is not a photograph.
 *
 *   node scripts/make-portrait-hero.mjs
 */
import { readFile, writeFile } from "node:fs/promises";

import sharp from "sharp";

const SOURCE = "public/media/editorial/campaign.jpg";
const OUTPUT = "public/media/editorial/campaign-portrait.jpg";

/*
 * Found by looking for columns holding near-black pixels: the two frames
 * sit at x 254-525 and x 563-730, and the second model's shoulder runs on
 * to 809. The crop takes both heads and leaves the shoulder, because every
 * column kept here is a column the phone has to fit across its width, and
 * the wider this is the smaller the picture sits on the screen.
 */
const CROP_LEFT = 246;
const CROP_RIGHT = 752;

/*
 * Cut to the proportions of a tall phone rather than to a round number.
 * Every pixel of canvas beyond what the screen is shaped like is extension
 * nobody sees, and extension is the part that was never photographed: at
 * twice the crop width the picture was a third of the screen and the fade
 * ran most of the way down it.
 *
 * The master is 438px tall whatever is done here, so the picture's share
 * of a phone screen is 438 x 0.54 / CROP_WIDTH and nothing else in this
 * file moves it. Cropping tighter is the only lever and both faces set the
 * floor on how tight, which lands a little under half the screen. Filling
 * the whole of it needs a frame shot in portrait.
 */
const CROP_WIDTH = CROP_RIGHT - CROP_LEFT;
const CANVAS_HEIGHT = Math.round(CROP_WIDTH / 0.539);

/**
 * Rows read at the join. Few, because this is the colour the extension has
 * to match exactly and the picture changes quickly near its foot: averaging
 * forty rows here gives a colour several per cent off the last one and
 * draws a line across the hero.
 */
const JOIN_ROWS = 5;

/** Rows read for the sweep, where some averaging is the point. */
const STRIP_ROWS = 44;

/** Where the edge has relaxed into the bare studio sweep. */
const RELAX = 0.02;

/**
 * Where the sweep has reached the paper, as a fraction of the extension.
 * Short: a long fade is a large blurred area, and a large blurred area is
 * the thing a reader notices instead of the photograph.
 */
const DISSOLVE = 0.2;

/** Columns the sweep is resampled to: enough for the drift, too few for a lapel. */
const SWEEP_COLUMNS = 9;

/**
 * --color-ivory. The extension ends on the exact colour of the page so the
 * photograph dissolves into the paper rather than into a floor of its own,
 * which is the whole reason a full-bleed phone hero can work at all here.
 * Keep this in step with globals.css.
 */
const PAPER = [245, 242, 236];

async function main() {
  const source = sharp(await readFile(SOURCE));
  const { height: sourceHeight } = await source.metadata();

  const crop = await source
    .extract({
      left: CROP_LEFT,
      top: 0,
      width: CROP_WIDTH,
      height: sourceHeight,
    })
    .toBuffer();

  const extensionHeight = CANVAS_HEIGHT - sourceHeight;

  /*
   * The floor is a vertical interpolation between three readings of the
   * picture's own bottom edge, which is what keeps the join invisible and
   * still ends in clean paper.
   *
   * At the join it is the edge exactly, pixel for pixel, so there is
   * nothing to match. Within a few per cent it has relaxed into the same
   * edge resampled down to nine columns and back, which keeps the
   * left-to-right drift of the studio sweep and drops the cuff and the
   * lapel. By DISSOLVE it is the paper itself.
   *
   * Running any one of those the whole way down fails in its own way: the
   * sharp edge gives hard vertical stripes of skin and jacket a thousand
   * pixels long, and the mean of the edge is a mid-brown that turns the
   * lower half of the phone screen into mud.
   */
  const edgeRow = (rows, columns) =>
    sharp(crop)
      .extract({
        left: 0,
        top: sourceHeight - rows,
        width: CROP_WIDTH,
        height: rows,
      })
      .resize(columns, 1, { fit: "fill" });

  const { data: sharpRow } = await edgeRow(JOIN_ROWS, CROP_WIDTH)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { data: softRow } = await edgeRow(STRIP_ROWS, SWEEP_COLUMNS)
    .resize(CROP_WIDTH, 1, { fit: "fill" })
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const smoothstep = (t) => t * t * (3 - 2 * t);

  const floorField = Buffer.alloc(CROP_WIDTH * extensionHeight * 3);
  for (let y = 0; y < extensionHeight; y += 1) {
    const toSoft = smoothstep(Math.min(1, y / (extensionHeight * RELAX)));
    const toFlat = smoothstep(Math.min(1, y / (extensionHeight * DISSOLVE)));
    for (let x = 0; x < CROP_WIDTH; x += 1) {
      const to = (y * CROP_WIDTH + x) * 3;
      for (let c = 0; c < 3; c += 1) {
        const near = sharpRow[x * 3 + c];
        const mid = softRow[x * 3 + c];
        const value = near + (mid - near) * toSoft;
        floorField[to + c] = Math.round(value + (PAPER[c] - value) * toFlat);
      }
    }
  }

  const extension = await sharp(floorField, {
    raw: { width: CROP_WIDTH, height: extensionHeight, channels: 3 },
  })
    .png()
    .toBuffer();

  const out = await sharp({
    create: {
      width: CROP_WIDTH,
      height: CANVAS_HEIGHT,
      channels: 3,
      background: "#ffffff",
    },
  })
    .composite([
      { input: crop, top: 0, left: 0 },
      { input: extension, top: sourceHeight, left: 0 },
    ])
    .jpeg({ quality: 92, chromaSubsampling: "4:4:4" })
    .toBuffer();

  await writeFile(OUTPUT, out);
  console.log(`${OUTPUT} ${CROP_WIDTH}x${CANVAS_HEIGHT} ${out.length} bytes`);
}

await main();
