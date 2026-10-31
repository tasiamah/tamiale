/**
 * Copies the MediaPipe vision runtime out of node_modules and into
 * public/vision, so face tracking is served from our own origin.
 *
 * Two reasons this is vendored rather than pulled from a CDN at runtime: the
 * promise on the Vision Studio page is that face data never leaves the device,
 * which is easier to hold to when nothing third-party is fetched while the
 * camera is open; and a pinned copy cannot change under us mid-season.
 *
 * The landmark model itself is not on npm. Download it once from
 * https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task
 * into public/vision/models/. This script only reports whether it is there.
 *
 *   pnpm vision:sync
 */
import { copyFile, mkdir, readdir, stat } from "node:fs/promises";
import path from "node:path";

const WASM_SOURCE = "node_modules/@mediapipe/tasks-vision/wasm";
const WASM_TARGET = "public/vision/wasm";
const MODEL = "public/vision/models/face_landmarker.task";

await mkdir(WASM_TARGET, { recursive: true });

const files = await readdir(WASM_SOURCE);
for (const file of files) {
  await copyFile(path.join(WASM_SOURCE, file), path.join(WASM_TARGET, file));
  console.log(`  ${file}`);
}
console.log(`${files.length} runtime files → ${WASM_TARGET}`);

const model = await stat(MODEL).catch(() => null);
console.log(
  model
    ? `model present, ${(model.size / 1024 / 1024).toFixed(1)} MB`
    : `MISSING ${MODEL}, see the note at the top of this script`,
);
