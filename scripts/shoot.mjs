/**
 * Visual QA harness. Captures the routes below at desktop and handset widths
 * and reports any console error or failed request encountered on the way.
 *
 *   node scripts/shoot.mjs [baseUrl] [outDir]
 */
import { mkdir } from "node:fs/promises";
import path from "node:path";
import puppeteer from "puppeteer-core";

const BASE = process.argv[2] ?? "http://127.0.0.1:4310";
const OUT = path.resolve(process.argv[3] ?? "/tmp/tamiale-shots");
const CHROME =
  process.env.CHROME_PATH ??
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";

const ROUTES = [
  ["home", "/"],
  ["collection", "/collection"],
  ["product", "/collection/the-marina"],
  ["vision", "/vision-studio"],
  ["house", "/house"],
  ["journal", "/journal"],
  ["journal-entry", "/journal/the-angle-is-the-argument"],
  ["private-client", "/private-client"],
  ["my-tamiale", "/my-tamiale"],
  ["passport", "/passport"],
  ["legal", "/legal/warranty"],
  ["not-found", "/does-not-exist"],
];

const VIEWPORTS = [
  { name: "desktop", width: 1440, height: 900, deviceScaleFactor: 1 },
  { name: "mobile", width: 414, height: 896, deviceScaleFactor: 2 },
];

const problems = [];

async function main() {
  await mkdir(OUT, { recursive: true });
  const browser = await puppeteer.launch({
    executablePath: CHROME,
    headless: true,
    args: ["--hide-scrollbars", "--disable-gpu", "--use-fake-ui-for-media-stream"],
  });

  for (const viewport of VIEWPORTS) {
    const page = await browser.newPage();
    await page.setViewport(viewport);

    page.on("console", (message) => {
      if (message.type() === "error") {
        problems.push(`[console] ${viewport.name} ${page.url()} :: ${message.text()}`);
      }
    });
    page.on("pageerror", (error) => {
      problems.push(`[pageerror] ${viewport.name} ${page.url()} :: ${error.message}`);
    });
    page.on("requestfailed", (request) => {
      problems.push(
        `[request] ${viewport.name} ${request.url()} :: ${request.failure()?.errorText}`,
      );
    });

    for (const [name, route] of ROUTES) {
      try {
        const response = await page.goto(`${BASE}${route}`, {
          waitUntil: "load",
          timeout: 45000,
        });
        const status = response?.status() ?? 0;
        if (status >= 400 && name !== "not-found") {
          problems.push(`[status] ${route} responded ${status}`);
        }

        // Walk the page so reveal transitions fire and lazy images decode,
        // then return to the top for the capture.
        await page.evaluate(async () => {
          const step = window.innerHeight * 0.7;
          for (let y = 0; y < document.body.scrollHeight; y += step) {
            window.scrollTo(0, y);
            await new Promise((resolve) => setTimeout(resolve, 180));
          }
          window.scrollTo(0, 0);
          await Promise.all(
            [...document.images]
              .filter((image) => !image.complete)
              .map((image) => image.decode().catch(() => {})),
          );
          await new Promise((resolve) => setTimeout(resolve, 900));
        });

        await page.screenshot({
          path: path.join(OUT, `${name}-${viewport.name}.png`),
          fullPage: true,
        });
        console.log(`${status} ${route} → ${name}-${viewport.name}.png`);
      } catch (error) {
        problems.push(`[navigation] ${viewport.name} ${route} :: ${error.message}`);
        console.log(`---  ${route} failed: ${error.message}`);
      }
    }

    await page.close();
  }

  await browser.close();

  if (problems.length) {
    console.log(`\n${problems.length} problem(s):`);
    for (const problem of [...new Set(problems)]) console.log(`  ${problem}`);
    process.exitCode = 1;
  } else {
    console.log("\nNo console errors or failed requests.");
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
