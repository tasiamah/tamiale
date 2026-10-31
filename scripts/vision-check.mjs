/**
 * Exercises the Vision Studio camera path against Chrome's synthetic webcam:
 * confirms the MediaPipe runtime and model actually load, that permission is
 * requested only on demand, and that a frame with no recognisable face fails
 * gracefully rather than throwing.
 *
 *   node scripts/vision-check.mjs
 */
import puppeteer from "puppeteer-core";

const BASE = process.env.BASE ?? "http://127.0.0.1:4320";

const browser = await puppeteer.launch({
  executablePath:
    process.env.CHROME_PATH ??
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
  headless: true,
  args: [
    "--hide-scrollbars",
    "--use-fake-ui-for-media-stream",
    "--use-fake-device-for-media-stream",
    ...(process.env.FACE_CLIP
      ? [`--use-file-for-fake-video-capture=${process.env.FACE_CLIP}`]
      : []),
  ],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900, deviceScaleFactor: 1 });

const vision = [];
page.on("pageerror", (error) => console.log(`[pageerror] ${error.message}`));
page.on("console", (m) => m.type() === "error" && console.log(`[console] ${m.text()}`));
page.on("response", (response) => {
  const url = response.url();
  if (url.includes("/vision/")) vision.push(`${response.status()} ${url.split("/vision/")[1]}`);
});

await page.goto(`${BASE}/vision-studio`, { waitUntil: "load" });
await new Promise((resolve) => setTimeout(resolve, 800));

console.log(
  vision.length
    ? `camera runtime requested before consent: ${vision.join(", ")}`
    : "no vision runtime requested before consent — correct",
);

await page.evaluate(() => {
  const open = [...document.querySelectorAll("button")].find((button) =>
    /open the camera/i.test(button.textContent ?? ""),
  );
  open?.click();
});

await new Promise((resolve) => setTimeout(resolve, 9000));
await page.evaluate(() => {
  const estimate = [...document.querySelectorAll("button")].find((button) =>
    /estimate my fit/i.test(button.textContent ?? ""),
  );
  estimate?.click();
  document.querySelector("video")?.scrollIntoView({ block: "center" });
});
await new Promise((resolve) => setTimeout(resolve, 1500));
await page.screenshot({ path: "/tmp/qa/vision-camera.png" });

console.log("\nvision assets:");
for (const entry of [...new Set(vision)]) console.log(`  ${entry}`);

console.log(
  "\npanel text:\n" +
    (await page.evaluate(() => {
      const panel = document.querySelector("[data-vision-stage]")?.parentElement;
      return (panel?.innerText ?? document.body.innerText).slice(0, 900);
    })),
);

await browser.close();
