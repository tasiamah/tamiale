/**
 * Contact sheet for the 3D atelier: every camera view and every lighting rig,
 * captured from the live canvas so the rendering can be judged as a set.
 *
 *   node scripts/atelier-sheet.mjs [out.png]
 */
import sharp from "sharp";
import puppeteer from "puppeteer-core";

const OUT = process.argv[2] ?? "/tmp/qa/atelier-sheet.png";
const BASE = process.env.BASE ?? "http://127.0.0.1:4320";
const STATES = [
  ["Studio", "Three-quarter"],
  ["Studio", "Front"],
  ["Studio", "Profile"],
  ["Studio", "Plan"],
  ["Boutique", "Three-quarter"],
  ["Nocturne", "Three-quarter"],
];

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });
page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));

await page.goto(`${BASE}/collection/the-marina`, { waitUntil: "load" });
await page.click("::-p-text(3D Atelier)");
await new Promise((resolve) => setTimeout(resolve, 2500));

/** Clicks a chip by its exact label, scoped to the atelier's own controls. */
async function chip(label) {
  const clicked = await page.evaluate((text) => {
    const stage = document.querySelector("[data-atelier]");
    const buttons = [...(stage?.querySelectorAll("button") ?? [])];
    const match = buttons.find((button) => button.textContent?.trim() === text);
    match?.click();
    return Boolean(match);
  }, label);
  if (!clicked) throw new Error(`no atelier chip labelled "${label}"`);
}

const tiles = [];
for (const [lighting, view] of STATES) {
  await chip(lighting);
  await chip(view);
  await new Promise((resolve) => setTimeout(resolve, 2200));
  const canvas = await page.$("canvas");
  tiles.push(await canvas.screenshot());
  console.log(`${lighting} / ${view}`);
}

const meta = await sharp(tiles[0]).metadata();
const w = Math.round(meta.width / 2);
const h = Math.round(meta.height / 2);

await sharp({
  create: {
    width: w * 3,
    height: h * 2,
    channels: 3,
    background: "#ffffff",
  },
})
  .composite(
    await Promise.all(
      tiles.map(async (tile, index) => ({
        input: await sharp(tile).resize(w, h).png().toBuffer(),
        left: (index % 3) * w,
        top: Math.floor(index / 3) * h,
      })),
    ),
  )
  .png()
  .toFile(OUT);

console.log(`sheet → ${OUT}`);
await browser.close();
