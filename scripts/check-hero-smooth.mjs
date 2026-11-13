import assert from 'node:assert/strict';
import { mkdir, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';
import { startPreviewServer } from './lib/browser-checks.mjs';

const output = 'output/playwright/hero-smooth';
await mkdir(output, { recursive: true });
const server = await startPreviewServer();
const browser = await chromium.launch({ channel: 'chrome', headless: true });
const report = [];
try {
  for (const width of [1440, 390]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 2 });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      localStorage.setItem('evox-locale', 'zh-cn');
      window.heroFrames = [];
      window.heroTerrain = 0;
      window.longTasks = [];
      new PerformanceObserver(list => window.longTasks.push(...list.getEntries().map(e => ({ start: e.startTime, duration: e.duration })))).observe({ type: 'longtask' });
      const clear = CanvasRenderingContext2D.prototype.clearRect;
      CanvasRenderingContext2D.prototype.clearRect = function (...args) {
        if (this.canvas.parentElement?.classList.contains('evolution-field')) window.heroFrames.push(performance.now());
        return clear.apply(this, args);
      };
      const stroke = CanvasRenderingContext2D.prototype.stroke;
      CanvasRenderingContext2D.prototype.stroke = function (...args) {
        if (!this.canvas.isConnected && args[0] instanceof Path2D) window.heroTerrain++;
        return stroke.apply(this, args);
      };
    });
    await page.goto(server.origin + '/zh-cn');
    await page.waitForFunction(() => window.heroFrames.length > 10);
    await page.evaluate(() => { window.heroFrames = []; window.heroTerrain = 0; window.longTasks = []; });
    // Cover automatic landscape changes as well as moving and releasing a mouse peak.
    await page.waitForTimeout(14000);
    const automatic = await page.evaluate(() => ({ frames: window.heroFrames.length, terrain: window.heroTerrain, longTasks: window.longTasks }));
    assert.ok(automatic.terrain > 100, 'The automatically prepared landscape must still transition');
    await page.evaluate(() => { window.heroFrames = []; window.heroTerrain = 0; });
    for (let step = 0; step < 90; step++) {
      await page.mouse.move(width * (.15 + .7 * step / 90), 180 + Math.sin(step / 15) * 70);
      await page.waitForTimeout(16);
    }
    const pointer = await page.evaluate(() => ({ frames: window.heroFrames.length, terrain: window.heroTerrain }));
    assert.ok(pointer.terrain > 100, 'Pointer movement must update terrain continuously');
    await page.screenshot({ path: `${output}/${width}-light.png` });
    await page.evaluate(() => document.documentElement.dataset.theme = 'dark');
    await page.screenshot({ path: `${output}/${width}-dark.png` });
    await page.mouse.move(width - 1, 899);
    await page.emulateMedia({ reducedMotion: 'reduce' });
    await page.waitForTimeout(200);
    const stopped = await page.evaluate(() => window.heroFrames.length);
    await page.waitForTimeout(400);
    assert.equal(await page.evaluate(() => window.heroFrames.length), stopped);
    assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false);
    assert.deepEqual(errors, []);
    report.push({ width, automatic, pointer, errors });
    await page.close();
  }
  await writeFile(`${output}/report.json`, JSON.stringify(report, null, 2));
  console.log(JSON.stringify(report));
} finally {
  await browser.close();
  await server.close();
}
