/**
 * Renders the share cards that appear when a Tamiale link is posted.
 *
 * These are built rather than hand-cut because the type has to be the house
 * type. The cards are drawn in a headless browser against the same two
 * families the site loads, Jost for the wordmark and Cormorant Garamond for
 * the frame name, so a card and the page it links to are set in one voice.
 *
 * 1200x630 is the size every platform crops from. Anything smaller than
 * 600px tall is demoted to a thumbnail beside the text instead of being
 * shown full width, which is what was happening before: the product card
 * pointed at a 695x219 cutout on a transparent background.
 *
 * Run with: pnpm og
 */
import { mkdir, readFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

import puppeteer from "puppeteer-core";

const ROOT = path.resolve(fileURLToPath(new URL("..", import.meta.url)));
const OUT = path.join(ROOT, "public/media/og");
const CHROME = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const W = 1200;
const H = 630;

const INK = "#16150f";
const IVORY = "#f5f2ec";
const STONE = "#6e6a5f";

/** The statement under the wordmark, in the reader's language. */
const STATEMENT = {
  en: "Contemporary eyewear, designed in Zurich",
  fr: "Lunetterie contemporaine, dessinée à Zurich",
  de: "Zeitgenössische Brillen, entworfen in Zürich",
};

const FONTS = `
  @import url('https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500&family=Cormorant+Garamond:wght@300;400;500&display=swap');
`;

/*
 * Inlined rather than linked. The page is handed to the browser as a string,
 * so its base URL is about:blank, and Chrome refuses to pull file:// images
 * into a document loaded from nowhere.
 */
async function dataUri(relative) {
  const file = path.join(ROOT, relative);
  const type = relative.endsWith(".png") ? "image/png" : "image/jpeg";
  return `data:${type};base64,${(await readFile(file)).toString("base64")}`;
}

const BASE = `
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html, body { width: ${W}px; height: ${H}px; }
  body { background: ${IVORY}; overflow: hidden; }
  .wordmark {
    font-family: Jost, sans-serif; font-weight: 400;
    letter-spacing: 0.34em; text-indent: 0.34em; text-transform: uppercase;
  }
  .eyebrow {
    font-family: Jost, sans-serif; font-weight: 400;
    letter-spacing: 0.185em; text-transform: uppercase;
  }
  .serif { font-family: 'Cormorant Garamond', serif; font-weight: 300; }
`;

/* The campaign frame, with the same ivory scrim the hero lifts off it. */
const house = (locale, campaign) => `<!doctype html><meta charset="utf-8"><style>
  ${FONTS} ${BASE}
  .frame { position: relative; width: ${W}px; height: ${H}px; }
  .frame img {
    position: absolute; inset: 0; width: 100%; height: 100%;
    object-fit: cover; object-position: 42% center;
  }
  .scrim {
    position: absolute; inset: auto 0 0 0; height: 62%;
    background: linear-gradient(to top, ${IVORY} 30%, rgba(245,242,236,0.88) 52%, rgba(245,242,236,0));
  }
  .plate {
    position: absolute; inset: auto 0 56px 0;
    display: flex; flex-direction: column; align-items: center; gap: 22px;
  }
  .plate .wordmark { font-size: 40px; color: ${INK}; }
  .plate .rule { width: 46px; height: 1px; background: ${INK}; opacity: 0.28; }
  .plate .line { font-size: 15px; color: ${STONE}; }
</style>
<div class="frame">
  <img src="${campaign}">
  <div class="scrim"></div>
  <div class="plate">
    <div class="wordmark">Tamiale</div>
    <div class="rule"></div>
    <div class="eyebrow line">${STATEMENT[locale]}</div>
  </div>
</div>`;

/* The product, on the ivory plate the shop photographs it against. */
const product = (shot) => `<!doctype html><meta charset="utf-8"><style>
  ${FONTS} ${BASE}
  .card {
    width: ${W}px; height: ${H}px; background: ${IVORY};
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    position: relative;
  }
  .mark { position: absolute; top: 44px; left: 0; right: 0; text-align: center; }
  .mark .wordmark { font-size: 19px; color: ${INK}; }
  .shot { width: 820px; margin-top: 18px; }
  .shot img { width: 100%; display: block; }
  .name { font-size: 50px; color: ${INK}; margin-top: 30px; letter-spacing: 0.004em; }
  .sub { font-size: 12px; color: ${STONE}; margin-top: 18px; }
</style>
<div class="card">
  <div class="mark"><div class="wordmark">Tamiale</div></div>
  <div class="shot"><img src="${shot}"></div>
  <div class="serif name">The Marina</div>
  <div class="eyebrow sub">Collection 001 · The Icons</div>
</div>`;

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: "new",
    args: ["--no-sandbox", "--font-render-hinting=none"],
  });

  const campaign = await dataUri("public/media/editorial/campaign.jpg");
  const shot = await dataUri("public/media/product/marina-onyx-cognac.png");

  const cards = [
    ...Object.keys(STATEMENT).map((l) => [`tamiale-${l}.jpg`, house(l, campaign)]),
    ["the-marina.jpg", product(shot)],
  ];

  for (const [name, html] of cards) {
    const page = await browser.newPage();
    // Drawn at twice the size and written out at 1200x630, so the type is
    // resolved rather than aliased.
    await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.evaluate(() => document.fonts.ready);
    const buffer = await page.screenshot({ type: "png" });

    const sharp = (await import("sharp")).default;
    await sharp(buffer)
      .resize(W, H)
      .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
      .toFile(path.join(OUT, name));

    console.log(`  ${name}`);
    await page.close();
  }

  await browser.close();
}

await main();
