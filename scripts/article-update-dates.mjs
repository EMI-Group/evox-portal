import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { join } from "node:path";

// Only explicit editorial dates become sitemap lastmod values. Filesystem
// timestamps and build times do not represent content changes.
export function getArticleUpdateDates() {
  const dates = new Map();
  for (const kind of ["news", "releases"]) {
    const directory = fileURLToPath(new URL(`../src/content/${kind}/`, import.meta.url));
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      for (const filename of readdirSync(join(directory, entry.name))) {
        if (!filename.endsWith(".md")) continue;
        const text = readFileSync(join(directory, entry.name, filename), "utf8");
        const frontmatter = text.replace(/^\uFEFF/, "").match(/^---\r?\n([\s\S]*?)\r?\n---/);
        const date = frontmatter?.[1].match(/^updatedDate:\s*(\d{4}-\d{2}-\d{2})\s*$/m)?.[1];
        if (!date) continue;
        const locale = filename.slice(0, -3);
        const prefix = locale === "en" ? "" : `/${locale}`;
        dates.set(`${prefix}/${kind}/${entry.name.toLowerCase()}`, date);
      }
    }
  }
  return dates;
}
