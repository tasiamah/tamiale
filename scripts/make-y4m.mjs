/**
 * Turns a still image into a short Y4M clip, which Chrome will play back as a
 * webcam via --use-file-for-fake-video-capture. That is the only way to point
 * the face tracker at a known face in an automated run.
 *
 *   node scripts/make-y4m.mjs <image> <out.y4m> [frames]
 */
import { writeFile } from "node:fs/promises";
import sharp from "sharp";

const [input, output = "/tmp/face.y4m", frames = "40"] = process.argv.slice(2);
const W = 640;
const H = 480;

const { data } = await sharp(input)
  .resize(W, H, { fit: "cover" })
  .removeAlpha()
  .raw()
  .toBuffer({ resolveWithObject: true });

const y = Buffer.alloc(W * H);
const u = Buffer.alloc((W / 2) * (H / 2));
const v = Buffer.alloc((W / 2) * (H / 2));

const clamp = (value) => Math.max(0, Math.min(255, Math.round(value)));

for (let row = 0; row < H; row += 1) {
  for (let column = 0; column < W; column += 1) {
    const i = (row * W + column) * 3;
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];
    y[row * W + column] = clamp(0.299 * r + 0.587 * g + 0.114 * b);
  }
}

// Chroma planes at half resolution, averaged over each 2×2 block.
for (let row = 0; row < H; row += 2) {
  for (let column = 0; column < W; column += 2) {
    let r = 0;
    let g = 0;
    let b = 0;
    for (const [dy, dx] of [
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1],
    ]) {
      const i = ((row + dy) * W + column + dx) * 3;
      r += data[i];
      g += data[i + 1];
      b += data[i + 2];
    }
    r /= 4;
    g /= 4;
    b /= 4;
    const index = (row / 2) * (W / 2) + column / 2;
    u[index] = clamp(-0.169 * r - 0.331 * g + 0.5 * b + 128);
    v[index] = clamp(0.5 * r - 0.419 * g - 0.081 * b + 128);
  }
}

const frame = Buffer.concat([Buffer.from("FRAME\n"), y, u, v]);
const clip = Buffer.concat([
  Buffer.from(`YUV4MPEG2 W${W} H${H} F30:1 Ip A1:1 C420mpeg2\n`),
  ...Array.from({ length: Number(frames) }, () => frame),
]);

await writeFile(output, clip);
console.log(`${output} — ${W}×${H}, ${frames} frames`);
