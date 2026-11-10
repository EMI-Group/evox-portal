import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { prepareBrowserOutput, startPreviewServer } from "./lib/browser-checks.mjs";

// A real display-profile check is essential: headless Chrome forces sRGB and
// cannot expose colour-managed displacement channels on a wide-gamut display.
const output = resolve(process.env.GLASS_OUTPUT ?? "output/playwright/glass-v3");
const baseline = resolve(process.env.GLASS_BASELINE ?? resolve(output, "baseline"));
await prepareBrowserOutput(output);
const server = await startPreviewServer({ baseline });
const { origin } = server;
const performanceOnly = process.env.GLASS_PERFORMANCE_ONLY === "1";
const verifyIdentical = process.env.GLASS_VERIFY_IDENTICAL === "1";
const report = { modes: [], frames: [], errors: [] };
let browser;
const stripePhase = async (page, name) => {
  await page.addStyleTag({ content: ".news-card > * {visibility:hidden!important}" });
  await page.evaluate(() => {
    const canvas = document.querySelector(".evolution-field canvas"), box = canvas.getBoundingClientRect(), c = canvas.getContext("2d");
    c.setTransform(canvas.width / box.width, 0, 0, canvas.height / box.height, 0, 0);
    c.fillStyle = "#fff"; c.fillRect(0, 0, box.width, box.height);
    c.fillStyle = "#000";
    for (let x = 0; x < box.width; x += 16) c.fillRect(x, 0, 3, box.height);
  });
  const buffer = await page.locator(".news-card").first().screenshot({ path: resolve(output, `${name}-stripes.png`), scale: "css" });
  const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  const luminance = (x, y) => { const k = (y * info.width + x) * 3; return .2126 * data[k] + .7152 * data[k + 1] + .0722 * data[k + 2]; };
  return [2, 4, 8, 12, 16, 20, 24, 28, 36].map(y => {
    let best = { shift: 0, score: -Infinity };
    for (let shift = -7; shift <= 7; shift++) {
      let score = 0;
      for (let x = 72; x < info.width - 72; x++) score += (luminance(x, y) - luminance(x - 1, y)) * (luminance(x + shift, 100) - luminance(x + shift - 1, 100));
      if (score > best.score) best = { shift, score };
    }
    return { y, shift: best.shift };
  });
};
const openPage = async (path, theme) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce", locale: "en-US" });
  await context.addInitScript(theme => { localStorage.setItem("evox-theme", theme); localStorage.setItem("evox-locale", "en"); }, theme);
  const page = await context.newPage();
  page.on("pageerror", error => report.errors.push(error.message));
  await page.goto(origin + path);
  await page.evaluate(() => document.fonts.ready);
  await page.waitForFunction(() => document.querySelectorAll(".news-card[data-lens-id]").length === 3);
  await page.waitForTimeout(150);
  return { page, context };
};
try {
  for (const mode of performanceOnly ? ["native"] : ["srgb", "native"]) {
    browser = await chromium.launch({ channel: "chrome", headless: mode === "srgb", ...(mode === "native" ? { ignoreDefaultArgs: ["--force-color-profile=srgb"] } : {}) });
    for (const theme of performanceOnly ? [] : ["light", "dark"]) {
      const entry = { mode, theme, browser: browser.version() };
      let background;
      for (const [label, path] of [["before", "/baseline"], ["after", "/"]]) {
        const { page, context } = await openPage(path, theme);
        entry.gamut = await page.evaluate(() => ({ p3: matchMedia("(color-gamut:p3)").matches }));
        if (!background) background = await page.locator(".evolution-field canvas").evaluate(canvas => canvas.toDataURL());
        else await page.locator(".evolution-field canvas").evaluate(async (canvas, source) => {
          const image = new Image(); image.src = source; await image.decode();
          const c = canvas.getContext("2d"); c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.clearRect(0, 0, canvas.width, canvas.height); c.drawImage(image, 0, 0); c.restore();
        }, background);
        for (const [name, selector] of [["news", ".news-grid"], ["actions", ".hero-actions"]]) await page.locator(selector).screenshot({ path: resolve(output, `${mode}-${theme}-${label}-${name}.png`) });
        if (label === "after" && verifyIdentical) {
          entry.surfaces = [];
          for (const name of ["news", "actions"]) {
            const pixels = label => sharp(resolve(output, `${mode}-${theme}-${label}-${name}.png`)).removeAlpha().raw().toBuffer({ resolveWithObject: true });
            const before = await pixels("before"), after = await pixels("after");
            assert.deepEqual(after.info, before.info, "Refactoring must preserve surface geometry");
            let difference = 0;
            for (let k = 0; k < before.data.length; k++) difference += Math.abs(before.data[k] - after.data[k]);
            const meanChannelDifference = difference / before.data.length;
            assert.ok(meanChannelDifference < .1, "Refactoring must preserve the complete rendered surface, including the rim");
            entry.surfaces.push({ name, meanChannelDifference });
          }
        }
        entry[label] = await stripePhase(page, `${mode}-${theme}-${label}`);
        if (label === "after") assert.ok(entry.after.every(row => Math.abs(row.shift) <= 1), "Perpendicular refraction must not introduce horizontal movement in either display profile");
        await context.close();
      }
      report.modes.push(entry); console.log(JSON.stringify(entry));
    }
    if (mode === "native") {
      // Alternate order to reduce warmup bias. Measure animation-frame
      // cadence as well as main-thread work while the header repeatedly morphs.
      for (const [label, path] of [["before", "/baseline"], ["after", "/"], ["after", "/"], ["before", "/baseline"]]) {
        const { page, context } = await openPage(path, "light");
        await page.emulateMedia({ reducedMotion: "no-preference" });
        await page.bringToFront();
        const cdp = await context.newCDPSession(page);
        await cdp.send("Performance.enable");
        const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value]));
        await page.waitForTimeout(500);
        const before = await metrics();
        const frames = await page.evaluate(() => new Promise(done => {
          const deltas = []; let start, previous;
          const draw = time => {
            start ??= time;
            if (previous !== undefined) deltas.push(time - previous);
            previous = time;
            scrollTo(0, Math.floor((time - start) / 800) % 2 ? 180 : 0);
            if (time - start < 4000) requestAnimationFrame(draw);
            else done(deltas);
          };
          requestAnimationFrame(draw);
        }));
        const after = await metrics();
        frames.sort((a, b) => a - b);
        const entry = { label, frames: frames.length, medianMs: frames[Math.floor(frames.length * .5)], p95Ms: frames[Math.floor(frames.length * .95)], over25Ms: frames.filter(value => value > 25).length, taskMs: (after.TaskDuration - before.TaskDuration) * 1000, scriptMs: (after.ScriptDuration - before.ScriptDuration) * 1000 };
        report.frames.push(entry); console.log(JSON.stringify(entry));
        await context.close();
      }
    }
    await browser.close(); browser = undefined;
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
} finally {
  await writeFile(resolve(output, performanceOnly ? "frames.json" : "rendering.json"), JSON.stringify(report, null, 2));
  await browser?.close();
  await server.close();
}
