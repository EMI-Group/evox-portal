import assert from "node:assert/strict";
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { chromium } from "playwright";

// Run after npm run build; exercise the emitted head script and real language menus.
const root = resolve("dist");
const server = createServer(async (request, response) => {
  let file = resolve(root, `.${new URL(request.url, "http://localhost").pathname}`);
  if (!file.startsWith(`${root}${sep}`) && file !== root) {
    response.writeHead(403).end();
    return;
  }
  if (!extname(file)) file = resolve(file, "index.html");
  try {
    const body = await readFile(file);
    const type = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css" }[extname(file)];
    response.writeHead(200, { "Content-Type": type || "application/octet-stream" }).end(body);
  } catch {
    response.writeHead(404).end();
  }
});
await new Promise((done) => server.listen(0, "127.0.0.1", done));
const origin = `http://127.0.0.1:${server.address().port}`;
let browser;
let checks = 0;
const key = "evox-locale";

try {
  browser = await chromium.launch({ headless: true });
  const cases = [
    ["en-US", ""], ["zh-CN", "/zh-cn"], ["zh-SG", "/zh-cn"],
    ["zh-TW", "/zh-tw"], ["zh-HK", "/zh-tw"], ["zh-MO", "/zh-tw"],
    ["zh-Hant", "/zh-tw"], ["zh-Hans-HK", "/zh-cn"],
    ["ja-JP", "/ja"], ["ko-KR", "/ko"], ["fr-CA", "/fr"],
    ["de-DE", "/de"], ["it-IT", "/it"], ["ru-RU", "/ru"],
    ["es-ES", "/es"], ["es-MX", "/es-419"], ["es-AR", "/es-419"],
    ["es-419", "/es-419"], ["pt-PT", "/pt"], ["pt-BR", "/pt-br"],
    ["ar-EG", ""], [["ar-EG", "ja-JP"], "/ja"],
  ];
  for (const [languages, prefix] of cases) {
    const context = await browser.newContext();
    await context.addInitScript((languages) => {
      Object.defineProperty(navigator, "languages", { get: () => languages });
    }, Array.isArray(languages) ? languages : [languages]);
    const page = await context.newPage();
    await page.goto(`${origin}/docs?source=language-test#install`);
    await page.waitForURL(`${origin}${prefix}/docs?source=language-test#install`);
    assert.equal(await page.locator("html").getAttribute("lang"), prefix.slice(1).replace("cn", "CN").replace("tw", "TW").replace("br", "BR") || "en");
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), prefix.slice(1) || "en");
    await context.close();
    checks++;
  }

  for (const mobile of [false, true]) {
    const context = await browser.newContext({ locale: "zh-CN", viewport: { width: mobile ? 390 : 1280, height: 900 } });
    const page = await context.newPage();
    await page.goto(`${origin}/docs?source=menu#install`);
    await page.waitForURL(`${origin}/zh-cn/docs?source=menu#install`);
    const menu = page.locator(mobile ? "[data-mobile-menu]" : ".language-dropdown");
    await menu.locator(":scope > summary").click();
    if (mobile) await menu.locator("details.mobile-section > summary").last().click();
    await menu.locator('a[data-locale-link][lang="en"]').click();
    await page.waitForURL(`${origin}/docs?source=menu#install`);
    assert.equal(await page.evaluate((key) => localStorage.getItem(key), key), "en");
    await page.reload();
    assert.equal(new URL(page.url()).pathname, "/docs");
    // A new tab uses the saved choice, while an explicit localized URL still works.
    const next = await context.newPage();
    await next.goto(`${origin}/docs`);
    assert.equal(new URL(next.url()).pathname, "/docs");
    await next.goto(`${origin}/ja/docs`);
    assert.equal(new URL(next.url()).pathname, "/ja/docs");
    assert.equal(await next.evaluate((key) => localStorage.getItem(key), key), "en");
    await next.evaluate((key) => localStorage.setItem(key, "fr"), key);
    await next.goto(`${origin}/docs`);
    await next.waitForURL(`${origin}/fr/docs`);
    await next.evaluate((key) => localStorage.setItem(key, "invalid"), key);
    await next.goto(`${origin}/docs`);
    await next.waitForURL(`${origin}/zh-cn/docs`);
    await context.close();
    checks++;
  }

  const blocked = await browser.newContext({ locale: "zh-CN" });
  await blocked.addInitScript(() => {
    Storage.prototype.getItem = Storage.prototype.setItem = () => { throw new Error("Storage blocked"); };
  });
  const page = await blocked.newPage();
  await page.goto(`${origin}/docs`);
  assert.equal(new URL(page.url()).pathname, "/docs");
  await page.goto(`${origin}/zh-cn/docs`);
  assert.equal(new URL(page.url()).pathname, "/zh-cn/docs");
  await blocked.close();
  checks++;

  const firstVisit = await browser.newContext({ locale: "zh-CN" });
  const home = await firstVisit.newPage();
  await home.goto(`${origin}/?source=first-visit#applications`);
  await home.waitForURL(`${origin}/zh-cn?source=first-visit#applications`);
  await home.goto(`${origin}/404.html`);
  assert.equal(new URL(home.url()).pathname, "/404.html");
  await firstVisit.close();
  checks++;
  console.log(`Passed ${checks} language preference scenarios.`);
} finally {
  await browser?.close();
  await new Promise((done) => server.close(done));
}
