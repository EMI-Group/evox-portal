import assert from "node:assert/strict";
import { writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import { prepareBrowserOutput, startPreviewServer } from "./lib/browser-checks.mjs";

// Compare against the previous build: first save dist/index.html, dist/_astro
// and dist/fonts under output/playwright/glass-v3/baseline, then rebuild.
const output = resolve(process.env.GLASS_OUTPUT ?? "output/playwright/glass-v3");
await prepareBrowserOutput(output);
const baseline = resolve(process.env.GLASS_BASELINE ?? resolve(output, "baseline"));
const server = await startPreviewServer({ baseline });
const { origin } = server;
const report = { comparisons: [], morphs: [], errors: [] };
let browser;
const resources = page => page.evaluate(() => ({
  filters: document.querySelectorAll(".lens-defs > filter").length,
  primitives: document.querySelectorAll(".lens-defs > filter > *").length,
  images: document.querySelectorAll(".lens-defs feImage").length,
  surfaces: document.querySelectorAll('.glass:not([data-glass="frosted"]), .liquid-glass').length,
}));
const createPage = async (theme, path, fallback = false, options = {}) => {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, deviceScaleFactor: 2, locale: "en-US", reducedMotion: "reduce", ...options });
  await context.addInitScript(({ theme, fallback }) => {
    localStorage.setItem("evox-locale", "en"); localStorage.setItem("evox-theme", theme);
    if (fallback) Object.defineProperty(navigator, "userAgentData", { configurable: true, value: undefined });
  }, { theme, fallback });
  const page = await context.newPage();
  page.on("pageerror", error => report.errors.push(error.message));
  await page.goto(origin + path);
  await page.evaluate(() => document.fonts.ready);
  if (!fallback && !options.hasTouch && options.javaScriptEnabled !== false) await page.waitForFunction(() => document.querySelectorAll(".news-card[data-lens-id]").length === 3);
  await page.waitForTimeout(300);
  if (path === "/" && !fallback && !options.hasTouch && options.javaScriptEnabled !== false) {
    await page.screenshot({ path: resolve(output, `${theme}-natural-page.png`) });
    await page.locator(".hero-actions").screenshot({ path: resolve(output, `${theme}-natural-actions.png`) });
    await page.locator(".news-grid").screenshot({ path: resolve(output, `${theme}-natural-news.png`) });
  }
  // Paint a fixed backdrop after the reduced-motion render. This isolates glass
  // pixels from the hero algorithm's deliberately randomized landscape.
  await page.evaluate(theme => {
    const canvas = document.querySelector(".evolution-field canvas"), box = canvas.getBoundingClientRect(), c = canvas.getContext("2d");
    c.setTransform(canvas.width / box.width, 0, 0, canvas.height / box.height, 0, 0);
    c.clearRect(0, 0, box.width, box.height);
    c.fillStyle = theme === "dark" ? "#13151b" : "#edf1f9"; c.fillRect(0, 0, box.width, box.height);
    c.strokeStyle = theme === "dark" ? "#8f9cad" : "#6b7c90"; c.lineWidth = 1.5;
    for (let x = -900; x < 2200; x += 19) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x + 300, box.height); c.stroke(); }
    c.fillStyle = "#c8383c"; c.fillRect(550, 380, 500, 14);
  }, theme);
  return { page, context };
};
try {
  browser = await chromium.launch({ channel: "chrome", headless: true });
  let current;
  for (const theme of ["light", "dark"]) {
    const old = await createPage(theme, "/baseline");
    const next = await createPage(theme, "/");
    await next.page.screenshot({ path: resolve(output, `${theme}-page.png`) });
    await next.page.locator(".hero-actions").screenshot({ path: resolve(output, `${theme}-hero-actions.png`) });
    await next.page.locator(".news-grid").screenshot({ path: resolve(output, `${theme}-news-grid.png`) });
    const tint = page => page.locator(".news-card").first().evaluate(el => ({ background: getComputedStyle(el).backgroundImage, frost: document.getElementById(el.dataset.lensId).querySelector('[result="frost"]').getAttribute("stdDeviation") }));
    assert.deepEqual(await tint(old.page), await tint(next.page), "News tint and centre blur must remain unchanged");
    for (const selector of [".news-card"]) {
      const before = await old.page.locator(selector).first().screenshot();
      const after = await next.page.locator(selector).first().screenshot();
      const pixels = async buffer => {
        const { width, height } = await sharp(buffer).metadata();
        const image = sharp(buffer);
        if (selector === ".news-card") image.extract({ left: 80, top: 80, width: width - 160, height: height - 160 });
        return image.removeAlpha().raw().toBuffer();
      };
      const a = await pixels(before), b = await pixels(after);
      assert.equal(a.length, b.length);
      let difference = 0, changed = 0;
      for (let index = 0; index < a.length; index++) { const delta = Math.abs(a[index] - b[index]); difference += delta; if (delta > 2) changed++; }
      const comparison = { theme, selector, meanChannelDifference: difference / a.length, changedFraction: changed / a.length };
      report.comparisons.push(comparison); console.log(JSON.stringify(comparison));
      assert.ok(comparison.meanChannelDifference < .1, "News centre pixels must remain equivalent");
    }
    const roles = await next.page.evaluate(() => {
      const optics = selector => {
        const el = document.querySelector(selector), filter = document.getElementById(el.dataset.lensId);
        const rim = filter.querySelector('[result="lens"]');
        return { scale: Number(filter.querySelector('[result="bent"]').getAttribute("scale")), tone: rim.localName === "feColorMatrix" ? "contrast" : "blur", blur: rim.hasAttribute("stdDeviation") ? Number(rim.getAttribute("stdDeviation")) : null, edgeWidth: parseFloat(getComputedStyle(el).getPropertyValue("--lg-edge-width")), strength: parseFloat(getComputedStyle(el).getPropertyValue("--lg-edge-strength")), material: el.dataset.glass };
      };
      const rail = document.querySelector(".chapter-map");
      return { primary: optics(".button-primary"), github: optics(".button-glass"), news: optics(".news-card"), railLens: rail.dataset.lensId ?? null, railFilter: getComputedStyle(rail).backdropFilter, wideSurfaces: [...document.querySelectorAll('[data-glass="content"]')].map(el => el.classList.contains("news-card")) };
    });
    assert.ok(Math.abs(roles.news.scale - 48.4) < .001, "News should use its independently stronger displacement");
    assert.equal(roles.news.strength, 2.2);
    assert.equal(roles.github.strength, 1);
    assert.equal(roles.primary.strength, 1);
    assert.equal(roles.github.scale, 24);
    assert.equal(roles.news.tone, "blur");
    assert.equal(roles.news.blur, .65);
    assert.equal(roles.github.blur, .65);
    assert.equal(roles.news.edgeWidth, 32);
    assert.equal(roles.github.edgeWidth, 0);
    assert.equal(roles.primary.edgeWidth, 0);
    assert.equal(roles.primary.material, "accent");
    assert.equal(roles.github.material, "clear");
    assert.equal(roles.railLens, null);
    assert.ok(roles.railFilter.includes("blur(") && !roles.railFilter.includes("url("));
    assert.deepEqual(roles.wideSurfaces, [true, true, true]);
    report.roles = roles;
    // Every preset can opt in and out after mounting, including a surface that
    // started as CSS-only frost and therefore had no initial SVG definition.
    await next.page.locator(".chapter-map").evaluate(el => el.dataset.glass = "clear");
    await next.page.waitForFunction(() => document.querySelector(".chapter-map[data-lens-id]"));
    await next.page.locator(".chapter-map").evaluate(el => el.dataset.glass = "frosted");
    await next.page.waitForFunction(() => !document.querySelector(".chapter-map[data-lens-id]"));
    await next.page.locator(".news-card").first().evaluate(el => el.dataset.glass = "frosted");
    await next.page.waitForFunction(() => !document.querySelector(".news-card").hasAttribute("data-lens-id"));
    await next.page.locator(".news-card").first().evaluate(el => el.dataset.glass = "content");
    await next.page.waitForFunction(() => document.querySelectorAll(".news-card[data-lens-id]").length === 3);
    const newsSource = await next.page.locator(".news-card").first().evaluate(el => document.getElementById(el.dataset.lensId).querySelector("feImage").getAttribute("href"));
    await next.page.locator(".news-card").first().evaluate(el => el.dataset.glass = "clear");
    await next.page.waitForFunction(() => {
      const el = document.querySelector(".news-card"), filter = document.getElementById(el.dataset.lensId);
      return filter && Number(filter.querySelector('[result="bent"]').getAttribute("scale")) === 22;
    });
    await next.page.locator(".news-card").first().evaluate(el => el.dataset.glass = "content");
    await next.page.waitForFunction(() => {
      const el = document.querySelector(".news-card"), filter = document.getElementById(el.dataset.lensId);
      return filter && Math.abs(Number(filter.querySelector('[result="bent"]').getAttribute("scale")) - 48.4) < .001;
    });
    assert.equal(await next.page.locator(".news-card").first().evaluate(el => document.getElementById(el.dataset.lensId).querySelector("feImage").getAttribute("href")), newsSource, "Restoring a preset must reuse its retained map");
    const themeOptics = await next.page.locator(".news-card").first().evaluate(el => {
      const filter = document.getElementById(el.dataset.lensId);
      return { id: filter.id, matrix: filter.querySelector('[result="lens"]').getAttribute("values"), image: filter.querySelector("feImage").getAttribute("href") };
    });
    await next.page.evaluate(theme => document.documentElement.dataset.theme = theme === "light" ? "dark" : "light", theme);
    await next.page.waitForTimeout(50);
    assert.equal(await next.page.locator(`#${themeOptics.id} feImage`).first().getAttribute("href"), themeOptics.image, "Theme changes must not rebuild the refraction map");
    await next.page.evaluate(theme => document.documentElement.dataset.theme = theme, theme);
    assert.equal(await next.page.locator(`#${themeOptics.id} [result="lens"]`).getAttribute("values"), null, "The News rim must not apply an extra contrast curve");
    const tintSamples = [];
    for (const background of ["#fff", "#000"]) {
      await next.page.evaluate(background => {
        const canvas = document.querySelector(".evolution-field canvas"), c = canvas.getContext("2d");
        c.save(); c.setTransform(1, 0, 0, 1, 0, 0); c.fillStyle = background; c.fillRect(0, 0, canvas.width, canvas.height); c.restore();
      }, background);
      const buffer = await next.page.locator(".button-primary").screenshot({ scale: "css" });
      const { data, info } = await sharp(buffer).removeAlpha().raw().toBuffer({ resolveWithObject: true });
      const offset = (Math.floor(info.height / 2) * info.width + 20) * 3;
      tintSamples.push([...data.subarray(offset, offset + 3)]);
    }
    const transmission = tintSamples[0].reduce((sum, value, index) => sum + Math.abs(value - tintSamples[1][index]), 0) / 3;
    assert.ok(transmission > 10, "The red primary button must transmit its live backdrop");
    const brandRed = [200, 56, 60];
    const redError = Math.hypot(...tintSamples[0].map((value, index) => value - brandRed[index]));
    assert.ok(redError < 25 && tintSamples[0][0] - tintSamples[0][1] > 120, "The transmitted light backdrop must retain EvoX red instead of washing it out to grey");
    const linear = value => { value /= 255; return value <= .04045 ? value / 12.92 : ((value + .055) / 1.055) ** 2.4; };
    for (const rgb of tintSamples) {
      const luminance = .2126 * linear(rgb[0]) + .7152 * linear(rgb[1]) + .0722 * linear(rgb[2]);
      assert.ok(1.05 / (luminance + .05) >= 4.5, "The tinted control must keep sufficient white-label contrast over bright and dark backdrops");
    }
    report.primaryTransmission ??= [];
    report.primaryTransmission.push({ theme, samples: tintSamples, meanChannelDifference: transmission, brandRedError: redError });
    report.baselineResources = await resources(old.page);
    report.optimizedResources = await resources(next.page);
    assert.equal(report.optimizedResources.images, report.optimizedResources.filters * 2, "Each lens needs a packed coordinate input and a separate blend mask");
    assert.equal(report.optimizedResources.primitives, report.optimizedResources.filters * 8, "The shared renderer must stay at eight filter primitives per geometry");
    const ids = await next.page.locator(".news-card").evaluateAll(elements => elements.map(element => element.dataset.lensId));
    assert.equal(new Set(ids).size, 1, "Equal news cards should share their lens definition");
    await old.context.close();
    if (current) await current.context.close();
    current = next;
  }
  const { page, context } = current;
  // Render decoded R/G coordinates and the independent mask as diagnostic RGB.
  const mapPixels = async (selector, width, height, name) => {
    await page.evaluate(({ selector, width, height }) => {
      const source = document.getElementById(document.querySelector(selector).dataset.lensId);
      const filter = source.cloneNode(true); filter.id = "test-map";
      while (filter.children.length > 2) filter.lastElementChild.remove();
      for (const el of [filter, ...filter.children]) { el.setAttribute("width", width); el.setAttribute("height", height); }
      const add = (tag, attrs) => {
        const el = document.createElementNS("http://www.w3.org/2000/svg", tag);
        for (const [key, value] of Object.entries(attrs)) el.setAttribute(key, value);
        filter.append(el);
      };
      add("feColorMatrix", { in: "coordinates", values: "1 0 0 0 0  0 0 0 2 -1  0 0 0 0 0  0 0 0 0 1", result: "decoded" });
      add("feColorMatrix", { in: "rim", values: "0 0 0 0 0  0 0 0 0 0  0 0 0 1 0  0 0 0 0 1", result: "maskColor" });
      add("feComposite", { in: "decoded", in2: "maskColor", operator: "arithmetic", k2: "1", k3: "1" });
      document.querySelector(".lens-defs").append(filter);
      const pane = document.createElement("div"); pane.id = "test-pane";
      pane.style.cssText = `position:fixed;z-index:10000;left:20px;top:80px;width:${width}px;height:${height}px;backdrop-filter:url(#test-map)`;
      document.body.append(pane);
    }, { selector, width, height });
    const buffer = await page.locator("#test-pane").screenshot({ path: resolve(output, `${name}.png`), scale: "css" });
    await page.evaluate(() => { document.getElementById("test-pane").remove(); document.getElementById("test-map").remove(); });
    return { data: await sharp(buffer).removeAlpha().raw().toBuffer(), width, height };
  };
  const pixel = (map, x, y) => [...map.data.subarray((y * map.width + x) * 3, (y * map.width + x) * 3 + 3)];
  const a = await mapPixels(".news-card", 335, 276, "map-news");
  const b = await mapPixels(".news-card", 670, 276, "map-news-wide");
  for (let y = 0; y < 32; y++) for (let x = 0; x < 32; x++) assert.deepEqual(pixel(a, x, y), pixel(b, x, y), "Resizing must not stretch corner optics");
  const corner = pixel(a, 5, 10), swapped = pixel(a, 10, 5);
  assert.ok(corner[0] > corner[1] && corner[1] > 128, "Corners must follow the inward radial normal");
  for (let axis = 0; axis < 2; axis++) assert.ok(Math.abs(corner[axis] - swapped[1 - axis]) <= 2, "Packed coordinates must preserve radial symmetry within alpha quantization");
  const interior = pixel(a, 160, 100);
  assert.ok(Math.abs(interior[0] - 128) <= 1 && Math.abs(interior[1] - 128) <= 1 && interior[2] === 0, "Interior must be neutral and have no refracted-rim mask");
  const scale = await page.locator(".news-card").first().evaluate(el => Number(document.getElementById(el.dataset.lensId).querySelector("feDisplacementMap").getAttribute("scale")));
  const samples = Array.from({ length: 48 }, (_, y) => y + .5 + scale * (pixel(a, 160, y)[1] / 255 - .5));
  report.mapping = { corner, scale, hasReversal: samples.some((value, index) => index && value < samples[index - 1] - .1) };
  assert.ok(samples.some((value, index) => Math.abs(value - index - .5) > 18), "News must combine the broad rim with the requested stronger displacement");
  assert.ok(report.mapping.hasReversal, "The stronger broad rim should now produce a visible background fold");
  const folds = samples.map((value, index) => index && value < samples[index - 1] - .1 ? index : -1).filter(index => index >= 0);
  report.mapping.foldMaskMinimum = Math.min(...folds.map(y => pixel(a, 160, y)[2] / 255));
  assert.ok(report.mapping.foldMaskMinimum > .9, "The folding band must not disappear under the frosted base");
  const header = await mapPixels(".header-glass", 1200, 64, "map-header-expanded");
  assert.ok(pixel(header, 5, 5)[2] === 0, "The expanded square header must not show a refracted rim");
  const rounded = await mapPixels(".header-glass", 1200, 48, "map-header-floating");
  assert.ok(pixel(rounded, 8, 12)[0] > 128, "Header corners must round automatically with viewport height");
  const fractional = await mapPixels(".header-glass", 1200, 54.5, "map-header-morphing");
  for (let y = 0; y < 6; y++) for (let x = 14; x < 17; x++) {
    assert.ok(Math.abs(pixel(fractional, x, y)[1] - pixel(fractional, 600, y)[1]) <= 4, "Packed alpha must not create a seam at fractional nine-slice boundaries");
  }
  const maskWidth = (map, x) => Array.from({ length: Math.min(64, Math.floor(map.height / 2)) }, (_, y) => pixel(map, x, y)[2]).findLastIndex(value => value > 1) + 1;
  report.mapping.newsRimWidth = maskWidth(a, 160);
  report.mapping.headerRimWidth = maskWidth(rounded, 600);
  assert.ok(report.mapping.newsRimWidth >= 30 && report.mapping.newsRimWidth <= 33, "The News rim should extend about 32 CSS pixels inward, beyond its 20px corner radius");
  assert.ok(report.mapping.newsRimWidth > report.mapping.headerRimWidth + 3, "News must have a wider rim even though its corner radius is smaller");
  await page.addStyleTag({ content: ".header-glass { transition-duration:.55s,.55s,.35s!important } html{scroll-behavior:auto!important}" });
  await page.evaluate(() => {
    window.mapWrites = 0;
    new MutationObserver(entries => { window.mapWrites += entries.length; }).observe(document.querySelector(".lens-defs"), { subtree: true, attributes: true, attributeFilter: ["href"] });
  });
  const cdp = await context.newCDPSession(page);
  const memory = async cycles => {
    await cdp.send("HeapProfiler.collectGarbage");
    const entry = { cycles, ...(await cdp.send("Runtime.getHeapUsage")), ...(await cdp.send("Memory.getDOMCounters")), ...(await resources(page)), mapWrites: await page.evaluate(() => window.mapWrites) };
    report.morphs.push(entry); console.log(JSON.stringify(entry));
  };
  await memory(0);
  for (let group = 0; group < 3; group++) {
    for (let cycle = 0; cycle < 4; cycle++) {
      await page.evaluate(() => scrollTo(0, 180)); await page.waitForTimeout(650);
      await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(650);
    }
    await memory((group + 1) * 4);
  }
  assert.equal(await page.evaluate(() => window.mapWrites), 0, "Header morphs must reuse the same image source");
  await page.locator("#evolution").scrollIntoViewIfNeeded();
  await page.waitForTimeout(650);
  const rail = page.locator(".chapter-map");
  const collapsedWidth = await rail.evaluate(el => el.getBoundingClientRect().width);
  await rail.hover(); await page.waitForTimeout(400);
  assert.ok(await rail.evaluate(el => el.getBoundingClientRect().width) > collapsedWidth, "The CSS-only rail must still expand its chapter labels");
  assert.equal(await rail.getAttribute("data-lens-id"), null);
  await rail.screenshot({ path: resolve(output, "chapter-rail-expanded.png") });
  await page.locator(".site-header").screenshot({ path: resolve(output, "floating-header.png") });
  await page.mouse.move(0, 0);
  for (let index = 0; index < 16; index++) {
    await page.setViewportSize({ width: index % 2 ? 1440 : 1280, height: 900 });
    await page.waitForTimeout(50);
  }
  await page.waitForTimeout(200);
  report.resizedResources = await resources(page);
  assert.ok(report.resizedResources.filters <= report.resizedResources.surfaces);
  const menu = page.locator("[data-desktop-dropdown]").first();
  await menu.locator(":scope > summary").click();
  await page.waitForFunction(() => document.querySelector("[data-desktop-dropdown] .dropdown-panel[data-lens-id]"));
  await page.keyboard.press("Escape");
  await cdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
  await page.waitForTimeout(200);
  assert.equal(await page.locator("[data-lens-id]").count(), 0);
  assert.equal((await resources(page)).filters, 0);
  assert.equal(await page.locator(".button-glass").evaluate(element => getComputedStyle(element).backdropFilter), "none");
  const opaquePrimary = await page.locator(".button-primary").evaluate(el => ({ background: getComputedStyle(el).backgroundColor, image: getComputedStyle(el).backgroundImage, filter: getComputedStyle(el).backdropFilter }));
  assert.deepEqual(opaquePrimary, { background: "rgb(200, 56, 60)", image: "none", filter: "none" }, "Reduced transparency must keep the primary button red and opaque");
  assert.equal(await page.locator(".chapter-map").evaluate(el => getComputedStyle(el).backdropFilter), "none");
  await cdp.send("Emulation.setEmulatedMedia", { features: [] });
  // Return to the hero: offscreen lenses correctly defer reinitialization.
  await page.evaluate(() => scrollTo(0, 0));
  await page.waitForFunction(() => document.querySelector(".button-glass[data-lens-id]"));
  await page.evaluate(() => dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false })));
  assert.equal((await resources(page)).filters, 0);
  const fallback = await createPage("light", "/", true);
  assert.equal((await resources(fallback.page)).filters, 0);
  report.fallbackFilter = await fallback.page.locator(".button-glass").evaluate(element => getComputedStyle(element).backdropFilter);
  assert.ok(report.fallbackFilter.includes("blur(") && !report.fallbackFilter.includes("url("));
  // The delegated pointer sheen also serves ordinary glass. It must stop
  // writing styles when reduced transparency is enabled or after disposal.
  await fallback.page.emulateMedia({ reducedMotion: "no-preference" });
  const control = fallback.page.locator(".button-glass");
  await control.hover({ position: { x: 12, y: 12 } });
  await fallback.page.waitForFunction(() => document.querySelector(".button-glass").style.getPropertyValue("--lg-x"));
  const sheen = await control.getAttribute("style");
  const fallbackCdp = await fallback.context.newCDPSession(fallback.page);
  await fallbackCdp.send("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-transparency", value: "reduce" }] });
  await control.hover({ position: { x: 24, y: 24 } });
  await fallback.page.waitForTimeout(50);
  assert.equal(await control.getAttribute("style"), sheen, "Reduced transparency must suppress invisible pointer updates");
  const solid = fallback.page.locator(".surface-card").first();
  await solid.hover({ position: { x: 12, y: 12 } });
  await fallback.page.waitForFunction(() => document.querySelector(".surface-card").style.getPropertyValue("--lg-x"));
  await fallbackCdp.send("Emulation.setEmulatedMedia", { features: [] });
  await fallback.page.evaluate(() => dispatchEvent(new PageTransitionEvent("pagehide", { persisted: false })));
  await control.hover({ position: { x: 36, y: 18 } });
  await fallback.page.waitForTimeout(50);
  assert.equal(await control.getAttribute("style"), sheen, "Disposal must release the shared pointer listener");
  await fallback.context.close();
  report.additionalFallbacks = [];
  for (const [name, options] of [["touch", { hasTouch: true, isMobile: true, viewport: { width: 390, height: 844 } }], ["no-js", { javaScriptEnabled: false }]]) {
    const item = await createPage("light", "/", false, options);
    assert.equal((await resources(item.page)).filters, 0);
    const filter = await item.page.locator(".button-glass").evaluate(el => getComputedStyle(el).backdropFilter);
    assert.ok(filter.includes("blur(") && !filter.includes("url("));
    report.additionalFallbacks.push({ name, filter }); await item.context.close();
  }
  assert.deepEqual(report.errors, []);
  report.passed = true;
  console.log(JSON.stringify({ baseline: report.baselineResources, optimized: report.optimizedResources, resized: report.resizedResources, fallback: report.fallbackFilter, passed: true }));
} finally {
  await writeFile(resolve(output, "report.json"), JSON.stringify(report, null, 2));
  await browser?.close();
  await server.close();
}
