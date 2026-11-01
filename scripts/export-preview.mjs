import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, extname, isAbsolute, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// Export built homepages with every rendering dependency embedded. The files
// work directly from file:// without a server or access to this checkout.
const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const built = resolve(root, "dist");
const output = resolve(process.argv[2] ?? resolve(root, "dist-preview"));
const site = "https://www.evox.group";
const mimeTypes = {
  ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg", ".webp": "image/webp", ".gif": "image/gif",
  ".ico": "image/x-icon", ".woff": "font/woff", ".woff2": "font/woff2",
};
const dataCache = new Map();
const attribute = (tag, name) => tag.match(new RegExp(`\\b${name}="([^"]*)"`, "i"))?.[1];
const escapeHtml = (value) => value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");

function assetPath(url, from = built) {
  const path = decodeURIComponent(url.split(/[?#]/, 1)[0]);
  if (/^(?:[a-z]+:)?\/\//i.test(path)) throw new Error(`External rendering dependency: ${url}`);
  const file = path.startsWith("/") ? resolve(built, `.${path}`) : resolve(from, path);
  const rel = relative(built, file);
  if (rel.startsWith("..") || isAbsolute(rel)) throw new Error(`Asset escapes build directory: ${url}`);
  return file;
}

function dataUrl(url, from) {
  if (url.startsWith("data:") || url.startsWith("#")) return url;
  const file = assetPath(url, from);
  if (!dataCache.has(file)) {
    const mime = mimeTypes[extname(file).toLowerCase()];
    if (!mime) throw new Error(`Unsupported asset type: ${file}`);
    dataCache.set(file, `data:${mime};base64,${readFileSync(file).toString("base64")}`);
  }
  return dataCache.get(file);
}

function inlineCss(css, from) {
  if (/@import\b/i.test(css)) throw new Error("CSS imports must be bundled before export");
  return css.replace(/url\(\s*(["']?)(.*?)\1\s*\)/g, (_, quote, url) => `url("${dataUrl(url, from)}")`);
}

function standaloneScript(code) {
  // Fail closed if a future build splits these modules into imported chunks.
  // Current Astro output is self-contained and has no dynamic imports.
  new Function(code);
  if (/\bimport\s*\(/.test(code)) throw new Error("Bundle dynamic imports before exporting");
  return code.replace(/<\/script/gi, "<\\/script");
}

const licenses = [
  ["Genesis tree source (AGPL-3.0)", "src/components/art/genesis-tree.LICENSE.txt"],
  ["Instrument Sans (SIL Open Font License)", "public/fonts/OFL.txt"],
].map(([name, file]) => `${name}\n\n${readFileSync(resolve(root, file), "utf8")}`).join("\n\n");

mkdirSync(output, { recursive: true });
for (const [locale, filename] of [["zh-cn", "evox-preview.html"], ["en", "evox-preview-en.html"]]) {
  const page = locale === "en" ? resolve(built, "index.html") : resolve(built, locale, "index.html");
  const currentHome = locale === "en" ? "/" : `/${locale}`;
  let html = readFileSync(page, "utf8");
  html = html.replace(/<link\b[^>]*>/gi, (tag) => {
    const rel = attribute(tag, "rel");
    const href = attribute(tag, "href");
    if (rel === "preload" || rel === "modulepreload") return "";
    if (rel === "stylesheet") {
      const file = assetPath(href);
      return `<style>${inlineCss(readFileSync(file, "utf8"), dirname(file))}</style>`;
    }
    if (rel === "icon") return tag.replace(href, dataUrl(href));
    return tag;
  });
  html = html.replace(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi, (tag, attrs, body) => {
    const src = attribute(attrs, "src");
    if (src) {
      attrs = attrs.replace(/\s*src="[^"]*"/i, "");
      body = readFileSync(assetPath(src), "utf8");
    }
    return `<script${attrs}>${standaloneScript(body)}</script>`;
  });
  html = html.replace(/<(?:img|source)\b[^>]*>/gi, (tag) => {
    if (attribute(tag, "srcset")) throw new Error("Resolve responsive image candidates before export");
    const src = attribute(tag, "src");
    return src ? tag.replace(src, dataUrl(src)) : tag;
  });
  html = html.replace(/<a\b[^>]*>/gi, (tag) => {
    const href = attribute(tag, "href");
    if (!href?.startsWith("/") || href.startsWith("//")) return tag;
    const url = new URL(href, site);
    const route = url.pathname.replace(/\/$/, "") || "/";
    const destination = route === currentHome ? (url.hash || "#top") : url.href;
    return tag.replace(href, destination);
  });
  html = html.replace("</head>", '<meta name="robots" content="noindex,nofollow"></head>');
  html = html.replace("</body>", `<template id="preview-license-notices"><pre>${escapeHtml(licenses)}</pre></template></body>`);
  html = html.replace(/<!doctype html>/i, `<!doctype html>\n<!-- Standalone EvoX homepage preview. Source: https://github.com/EMI-Group/evox-portal/tree/ui -->\n`);

  // Assets required for rendering must be embedded; navigation can stay online.
  if (/<(?:script|img|source)\b[^>]*\bsrc="(?!data:)/i.test(html) || /<link\b[^>]*rel="stylesheet"/i.test(html)) {
    throw new Error(`Unresolved asset in ${filename}`);
  }
  const destination = resolve(output, filename);
  writeFileSync(destination, html, "utf8");
  console.log(`${destination} (${(Buffer.byteLength(html) / 1024).toFixed(0)} KiB; rendering assets embedded)`);
}
