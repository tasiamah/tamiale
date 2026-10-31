/**
 * Captures a single viewport-sized frame of one route, optionally after
 * scrolling and clicking. Used to inspect above-the-fold composition, which
 * a full-page capture distorts.
 *
 *   node scripts/peek.mjs <route> <out.png> [scrollY] [clickSelector]
 */
import puppeteer from "puppeteer-core";

const [route = "/", out = "/tmp/peek.png", scrollY = "0", click] =
  process.argv.slice(2);
const BASE = process.env.BASE ?? "http://127.0.0.1:4320";

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: ["--hide-scrollbars", "--use-fake-ui-for-media-stream"],
});

const page = await browser.newPage();
await page.setViewport(
  process.env.MOBILE
    ? { width: 414, height: 896, deviceScaleFactor: 2, isMobile: true }
    : { width: 1440, height: 900, deviceScaleFactor: 1 },
);
page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));
page.on("console", (m) => m.type() === "error" && console.log(`[console] ${m.text()}`));

await page.goto(`${BASE}${route}`, { waitUntil: "load", timeout: 45000 });
await page.evaluate((y) => window.scrollTo(0, Number(y)), scrollY);
await new Promise((resolve) => setTimeout(resolve, 1200));

if (click) {
  await page.click(click);
  await new Promise((resolve) => setTimeout(resolve, 2500));
}

await page.screenshot({ path: out });
console.log(`captured ${route} → ${out}`);
await browser.close();
