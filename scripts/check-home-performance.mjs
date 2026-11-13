import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import { prepareBrowserOutput, startPreviewServer } from "./lib/browser-checks.mjs";

// Run against a production build. Keep browser profiles and reports in the checkout.
const label = process.argv[2] ?? "after";
const output = resolve("output/playwright/performance");
await prepareBrowserOutput(output);
const server = await startPreviewServer();
const { origin } = server;
let browser;
const errors = [];
const report = { label, samples: [], cache: [], errors };
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, locale: "en-US", deviceScaleFactor: 2 });
  const page = await context.newPage();
  page.on("pageerror", error => errors.push(error.message));
  await page.addInitScript(() => {
    localStorage.setItem("evox-locale", "en");
    window.drawCounts = {};
    const original = CanvasRenderingContext2D.prototype.clearRect;
    CanvasRenderingContext2D.prototype.clearRect = function (...args) {
      if (this.canvas.isConnected) {
        const key = this.canvas.closest("[data-kind]")?.dataset.kind ?? this.canvas.className ?? "canvas";
        const name = this.canvas.parentElement?.classList.contains("evolution-field") ? "hero" : key || "evolution";
        window.drawCounts[name] = (window.drawCounts[name] ?? 0) + 1;
      }
      return original.apply(this, args);
    };
    const fill = CanvasRenderingContext2D.prototype.fillRect;
    CanvasRenderingContext2D.prototype.fillRect = function (...args) {
      if (this.canvas.classList.contains("evx-canvas") && args[0] === 0 && args[1] === 0) {
        window.drawCounts.evolution = (window.drawCounts.evolution ?? 0) + 1;
      }
      return fill.apply(this, args);
    };
  });
  await page.goto(origin);
  await page.waitForFunction(() => window.evolutionDiagram && document.querySelectorAll(".paradigm-scene[data-ready]").length === 4);
  const cdp = await context.newCDPSession(page);
  await cdp.send("Performance.enable");
  const metrics = async () => Object.fromEntries((await cdp.send("Performance.getMetrics")).metrics.map(({ name, value }) => [name, value]));
  for (const [name, selector] of [["hero", ".evolution-field"], ["evolution", "#evox-evolution"], ["parallel", ".parallel-figure"], ["paradigms", ".paradigm-scene"], ["footer", "footer"]]) {
    await page.locator(selector).first().scrollIntoViewIfNeeded();
    if (name === "hero") await page.evaluate(() => scrollTo(0, 0));
    await page.waitForTimeout(700);
    await page.evaluate(() => { window.drawCounts = {}; });
    const before = await metrics();
    const start = Date.now();
    await page.waitForTimeout(4000);
    const after = await metrics();
    const sample = { name, seconds: (Date.now() - start) / 1000, taskMs: (after.TaskDuration - before.TaskDuration) * 1000, scriptMs: (after.ScriptDuration - before.ScriptDuration) * 1000, layouts: after.LayoutCount - before.LayoutCount, styleRecalculations: after.RecalcStyleCount - before.RecalcStyleCount, draws: await page.evaluate(() => window.drawCounts) };
    report.samples.push(sample);
    if (label !== "before") {
      for (const [canvas, count] of Object.entries(sample.draws)) {
        assert.ok(count < (canvas === "hero" ? 270 : 140), "Hero draws at up to 60 FPS; other decorative canvases at about 30 FPS");
      }
    }
    if (name === "footer") assert.deepEqual(sample.draws, {}, "Offscreen canvases must stop drawing");
    console.log(JSON.stringify(sample));
    await page.screenshot({ path: resolve(output, `${label}-${name}.png`) });
  }
  // Seek through thousands of generations: a deterministic retention stress test.
  let originalPopulation;
  for (const generation of [0, 500, 1000, 2000]) {
    const cache = await page.evaluate(generation => {
      const diagram = window.evolutionDiagram;
      diagram.seek(generation * diagram.getState().cycleMilliseconds + 1000);
      return { generation, retained: diagram.generations.size ?? diagram.generations.length, state: diagram.getState() };
    }, generation);
    await cdp.send("HeapProfiler.collectGarbage");
    const heap = await cdp.send("Runtime.getHeapUsage");
    report.cache.push({ generation, retained: cache.retained, heapBytes: heap.usedSize });
    if (!generation) originalPopulation = cache.state.population;
    if (label !== "before") assert.ok(cache.retained <= 3, "Generation history must be bounded");
    console.log(JSON.stringify(report.cache.at(-1)));
  }
  const seekBack = await page.evaluate(() => { const d = window.evolutionDiagram; d.seek(0); return d.getState(); });
  assert.equal(seekBack.generation, 1);
  assert.deepEqual(seekBack.population, originalPopulation, "Backward seeking must preserve deterministic populations");
  await page.locator("#evox-evolution").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.evolutionDiagram.play());
  await page.waitForTimeout(500);
  await cdp.send("HeapProfiler.collectGarbage");
  report.soak = [];
  const soakMs = Number(process.env.PERFORMANCE_SOAK_MS ?? 0);
  for (let elapsed = 0; elapsed <= soakMs; elapsed += 15000) {
    if (elapsed) await page.waitForTimeout(15000);
    await cdp.send("HeapProfiler.collectGarbage");
    report.soak.push({ elapsed, ...(await cdp.send("Runtime.getHeapUsage")), ...(await cdp.send("Memory.getDOMCounters")) });
  }
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.drawCounts = {}; });
  await page.waitForTimeout(1000);
  report.reducedMotionDraws = await page.evaluate(() => window.drawCounts);
  assert.equal(Object.values(report.reducedMotionDraws).reduce((a, b) => a + b, 0), 0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.waitForTimeout(300);
  await page.evaluate(() => {
    Object.defineProperty(document, "hidden", { configurable: true, value: true });
    document.dispatchEvent(new Event("visibilitychange"));
    window.drawCounts = {};
  });
  await page.waitForTimeout(1000);
  report.hiddenDraws = await page.evaluate(() => window.drawCounts);
  assert.deepEqual(report.hiddenDraws, {}, "Hidden documents must stop drawing");
  await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event("visibilitychange")); });
  for (const kind of ["physical", "science"]) {
    await page.locator(`[data-kind="${kind}"]`).scrollIntoViewIfNeeded();
    await page.waitForTimeout(300);
    await page.evaluate(() => { window.drawCounts = {}; });
    await page.waitForTimeout(1000);
    const draws = await page.evaluate(() => window.drawCounts);
    assert.ok(draws[kind] > 0 && draws[kind] <= (label === "before" ? 70 : 35));
  }
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false })));
  await page.evaluate(() => { window.drawCounts = {}; });
  await page.waitForTimeout(1000);
  report.teardownDraws = await page.evaluate(() => window.drawCounts);
  if (label !== "before") assert.deepEqual(report.teardownDraws, {}, "Page teardown must cancel animation frames");
  // Mobile layout, menus, theme switching and a second locale exercise shared styles.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${origin}/zh-cn`);
  await page.locator("[data-mobile-menu] > summary").click();
  assert.equal(await page.locator("[data-mobile-menu]").getAttribute("open"), "");
  await page.screenshot({ path: resolve(output, `${label}-mobile-menu.png`) });
  await page.locator("[data-mobile-menu] > summary").click();
  await page.locator(".theme-toggle").first().click();
  await page.screenshot({ path: resolve(output, `${label}-mobile-dark.png`) });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
  report.reducedTransparency = await page.locator(".header-glass").evaluate(element => getComputedStyle(element).backdropFilter);
  if (label !== "before") assert.equal(report.reducedTransparency, "none");
  await page.goto(`${origin}/libs`);
  await page.waitForFunction(() => document.querySelector(".page-hero-backdrop canvas")?.width > 0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.waitForTimeout(300);
  await page.evaluate(() => { window.drawCounts = {}; });
  await page.waitForTimeout(500);
  assert.deepEqual(await page.evaluate(() => window.drawCounts), {});
  assert.deepEqual(errors, []);
  await writeFile(resolve(output, `${label}.json`), JSON.stringify(report, null, 2));
  console.log(`Report: ${resolve(output, `${label}.json`)}`);
} finally {
  await writeFile(resolve(output, `${label}.json`), JSON.stringify(report, null, 2));
  await browser?.close();
  await server.close();
}
