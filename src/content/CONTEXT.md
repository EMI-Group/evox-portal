# CONTEXT.md — src/content/

## Intent
All Astro content collections for the EvoX Portal live here, organized in an **article-first layout**: each article is a directory containing one Markdown file per locale (e.g. `news/evogp/en.md`, `news/evogp/zh-cn.md`). English (`en.md`) is the source of truth; missing locale files fall back to English at render time. Introduced by commit 18a23c5 ("Restructure content to article-first layout and add libs i18n"); i18n completed in 497ff71.

## Collections (defined in `src/content.config.ts`)
Five collections; the schema below is authoritative (zod-validated):

| Collection | Loader | Schema | Topics | Locale files |
|---|---|---|---|---|
| `news` | glob `**/*.md` over `./src/content/news` | `title`, `pubDate` (coerced date), `summary?` | 9 | 13 each (117) |
| `releases` | glob over `./src/content/releases` | `title`, `pubDate`, `summary?` | 8 | 13 each (104) |
| `tutorials` | glob over `./src/content/tutorials` | `title`, `order` (number) | 7 | 13 each (91) |
| `docs` | glob over `./src/content/docs` | `title`, `order` (number), `section` (string) | 18 | 13 each (234) |
| `libs` | `file("./src/content/libs.json")` | `id`, `title`, `description`, `url` | 13 entries in JSON | n/a |

- `docs` sections in use: `developer` (5 topics), `examples` (6), `install` (2), `misc` (4), `experimental` (1). `tutorials` orders are 1–7.
- `libs.json` is an array of `{id, title, description, url}`; ids: evox, evogit, evogp, evorl, evomo, tensorneat, metade, evoxbench, istratde, evogo, evonas, evocmo, autopso.

## Locale / Filename Conventions
- 13 locales: `en, zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br` (mirrors `src/i18n/utils.ts` `locales`).
- Filename = `<locale>.md` inside the topic dir. Glob-loader entry IDs are the relative path without extension, e.g. `evogp/en`.
- **All 4 markdown collections currently have all 13 locales per topic — no gaps.** (Verified: every topic dir contains exactly 13 `.md` files.)
- Non-en files are genuine translations (title/summary/frontmatter translated, e.g. zh-cn news titles differ from en), not machine placeholders. `pubDate`/`order`/`section` are kept identical across locales.
- Fallback behavior (in `src/i18n/utils.ts`): `getLocalizedArticles`/`findLocalizedArticle`/`getLocalizedNews`/`findLocalizedNews` pick the entry with id `${slug}/${locale}`, else fall back to `${slug}/en`. Missing locale files are therefore safe — English is shown.

## Images & Assets
- **news/**: 83 images total, embedded per-article (e.g. `news/evogp/evogp-1.jpg` … `evogp-8.jpg`), shared by all locale files, referenced with **relative paths**: `![1.png](./evogp-1.jpg "1.png")`. Exception: `news/evorl/` is text-only (0 images).
- **releases/**: 5 of 8 releases carry one screenshot each (`evox-1-1-0/evox-1-1-0-1.png`, and same pattern for evox-1-1-1, evox-1-1-2, evox-1-2-0, evox-1-2-1), referenced from **all 13 locale files** via `![4.png](./evox-1-1-0-1.png)`. Older (evox-1-0-0) and newer (evox-1-3-0) releases have no images. Commit 4aaf3ff moved these into content dirs to use relative paths.
- **docs/ & tutorials/**: no per-article images; the few figures reference the **absolute public path** `/_static/...` (e.g. `/_static/modulebase.png`, `/_static/rastrigin_function.svg`), served from `public/_static/`. Don't move those — they're site-wide static assets, not content.

## Known Issues
- **UTF-8 BOM**: all 26 files of `news/evogm/` and `news/evogp/` (13 locales each) start with a BOM (U+FEFF) before `---`. Astro parses them fine, but it's inconsistent with every other file — strip BOM if touching those articles.
- **Slug case inconsistency**: news dir `iStratDE/` uses capital letters while `libs.json` uses lowercase `istratde`; news dir `evogo` is lowercase. Slugs surface in URLs and in cross-links, so match the dir name exactly when linking.
- **docs/document-writing** contains a literal markdown example `![Alt Text](path)` (line 71 of en.md) — it's a guide *about* writing markdown; don't "fix" it as a broken link.
- **Image names are arbitrary** (e.g. `metade-4.png` with alt text `1.png`); alt/title text does not correspond to the filename.

## Adding a New Article
1. Create `<collection>/<slug>/` (lowercase-kebab; match news slug style).
2. Write `en.md` (source of truth) with the collection's frontmatter.
3. Add other locales as `<locale>.md` (all 13 for consistency; missing ones auto-fall back to English).
4. For news: drop images in the same dir and reference them relatively (`./img.png`). For releases with screenshots: same pattern.
5. libs: append an entry to `libs.json` (keep alphabetical-ish order).

## Notes for Agents
- `examples/` is **not** a content collection — it holds runtime example assets (`.astro`, `.py`, `.json`, `.js`) consumed by `src/components/pages/RuntimeExamples.astro` (runtime examples page). Don't treat it as a 6th collection.
- Content is rendered by pages under `src/pages/[locale]/...` (localized) and `src/pages/{docs,news,releases,tutorials}/...` (English-only variants); libs at `src/pages/libs.astro` + `src/pages/[locale]/libs/index.astro`.
- Each article topic subdirectory is a uniform leaf (13 locale files ± images) — **no per-topic CONTEXT.md needed**.

## Routing Table
- `docs/` → Docs collection, 18 topics, schema `{title, order, section}` (uniform leaf pattern per topic)
- `news/` → News collection, 9 topics, schema `{title, pubDate, summary?}`, per-article images
- `releases/` → Release notes, 8 topics, schema `{title, pubDate, summary?}`, 5 with screenshots
- `tutorials/` → Tutorial collection, 7 topics, schema `{title, order}`
- `libs.json` → Libraries collection data (file() loader, 13 entries)
- `examples/` → Static runtime-example assets for the RuntimeExamples page (not a collection; sibling of content collections — read-only, escalate writes to parent)
- `../content.config.ts` → Collection schemas/loaders (sibling — read-only, escalate writes to parent)
- `../i18n/utils.ts` → Locale fallback helpers used to resolve `slug/locale` → `slug/en` (sibling — read-only, escalate writes to parent)
- `../pages/[locale]/` → Localized content pages that render these collections (sibling — read-only, escalate writes to parent)
