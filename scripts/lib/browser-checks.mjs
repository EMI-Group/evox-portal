import { createServer } from "node:http";
import { mkdir, readFile } from "node:fs/promises";
import { extname, resolve, sep } from "node:path";

const contentTypes = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".svg": "image/svg+xml", ".woff2": "font/woff2", ".png": "image/png", ".json": "application/json" };
const within = (base, file) => file === base || file.startsWith(base + sep);

export async function prepareBrowserOutput(output) {
  const temporary = resolve(output, "tmp");
  await mkdir(temporary, { recursive: true });
  process.env.TMPDIR = temporary;
}

// A previous build uses /baseline for its document and shares the asset prefix.
// Fall back only for missing hashed assets; a missing current page stays a 404.
export async function startPreviewServer({ root = resolve("dist"), baseline } = {}) {
  root = resolve(root);
  if (baseline) baseline = resolve(baseline);
  const server = createServer(async (request, response) => {
    const pathname = new URL(request.url, "http://localhost").pathname;
    const old = baseline && (pathname === "/baseline" || pathname.startsWith("/baseline/"));
    const base = old ? baseline : root;
    const relative = old ? pathname.slice("/baseline".length) : pathname;
    let file = resolve(base, `.${relative || "/"}`);
    if (!within(base, file)) return response.writeHead(403).end();
    if (!extname(file)) file = resolve(file, "index.html");
    try {
      let content;
      try { content = await readFile(file); }
      catch (error) {
        if (!baseline || old || error.code !== "ENOENT" || !pathname.startsWith("/_astro/")) throw error;
        file = resolve(baseline, `.${pathname}`);
        if (!within(baseline, file)) return response.writeHead(403).end();
        content = await readFile(file);
      }
      response.writeHead(200, { "Content-Type": contentTypes[extname(file)] ?? "application/octet-stream" }).end(content);
    } catch { response.writeHead(404).end(); }
  });
  await new Promise((done, reject) => {
    server.once("error", reject);
    server.listen(0, "127.0.0.1", () => { server.off("error", reject); done(); });
  });
  return { origin: `http://127.0.0.1:${server.address().port}`, close: () => new Promise((done, reject) => server.close(error => error ? reject(error) : done())) };
}
