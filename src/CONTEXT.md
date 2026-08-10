# src/ — EvoX Portal Source Code

## Intent
All source code for the **EvoX Portal**: an Astro 6 static, content-first marketing/portal site for the EvoX evolutionary-computation project, fully internationalized across **13 locales** (en, zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br) and deployed to Vercel (https://www.evox.group).

## API Surface
- `content.config.ts` — Astro content-collection definitions: `news` (title, pubDate, summary?), `releases` (same), `tutorials` (title, order), `docs` (title, order, section), `libs` (id, title, description, url — loaded from `content/libs.json` via `file()` loader). All markdown collections are glob-loaded from `./src/content/<name>`.
- `pages/` — Routing layer. Dual mirrored trees: top-level English pages (no URL prefix) + `[locale]/` mirrors (prefix for the 12 non-English locales, `getStaticPaths` filters out `en`). Pages: home, docs (index + [...slug]), news/releases (paginated [...page] + [...slug]), tutorials, community, runtime, libs, 404 (English-only, noSEO). ⚠️ The pages-subtree agent docs live in `docs/agent-context/` — do NOT recreate CONTEXT.md under `src/pages/` (Astro treats every `.md` there as a route and the build breaks).
- `components/` — Site chrome (`Header.astro`, `Footer.astro`) and page-body components in `components/pages/` (`HomeContent`, `RuntimeContent`, `RuntimeExamples`). See `components/CONTEXT.md`.
- `content/` — Content collections in **article-first layout**: each article is a directory containing one `.md` per locale (`<article>/en.md`, `<article>/zh-cn.md`, …), `en.md` being source of truth. Plus `examples/` (static runtime example sources consumed by RuntimeExamples) and `libs.json`. See `content/CONTEXT.md`.
- `i18n/` — Centralized UI-string translation (`utils.ts` + `locales/*.json`, 13 files with exactly 175 keys each) and localized-content helpers (`getLocalizedArticles`/`getLocalizedNews`/`findLocalizedArticle`/`findLocalizedNews` with English fallback). See `i18n/CONTEXT.md`.
- `layouts/Layout.astro` — Single page layout: SEO head (canonical, hreflang for all 13 locales, OG/Twitter, noindex via `noSEO` prop), renders `<Header>`/`<Footer>` around `<slot>`; props: `title?`, `description?`, `hideHeader?`, `hideFooter?`, `locale?` (default en), `noSEO?`, `localePath?`. Normalizes trailing slash on build-time pathname so canonical/hreflang/og:url agree.
- `styles/global.css` — `@import "tailwindcss"; @plugin "@tailwindcss/typography";` (Tailwind v4 CSS-first config; the only global stylesheet).
- `types/pagination.ts` — Shared types for the pagination pages: `PaginatedPageUrl`, `PaginatedPage<T>`, `PaginateFunction<T>`.
- `assets/` — Static images (logos, hero arrows, banner) imported by components.

## Constraints
- **No hardcoded UI strings** — all user-facing text goes through `loadTranslations(locale)` + `t()` from `src/i18n/utils.ts` (a few documented deviations exist in components).
- **English is the source of truth**: for content (missing locale file ⇒ English fallback) and for UI strings (missing key ⇒ English value).
- **No trailing slashes** in internal links (`getLocalizedUrl` enforces this; en URLs have no prefix, others use `/{locale}/...`).
- Markdown frontmatter fields (`pubDate`, `order`, `section`) must be identical across locale variants of an article.

## Design Decisions
- **Article-first content layout** (introduced in commit 18a23c5): one directory per article with per-locale `.md` files, rather than per-locale directories — enables `getLocalizedArticles` English-driven enumeration and fallback.
- **`prefixDefaultLocale: false`** in `astro.config.mjs` ⇒ English pages live at top level, all other locales under `[locale]/` — this is why the two page trees are copy-paste twins that must be kept in sync manually.
- **Lazy-loaded translations** with module-level cache in `i18n/utils.ts`; `en.json` statically imported and pre-seeded.
- Tailwind v4 CSS-first configuration via `@tailwindcss/vite` plugin in `astro.config.mjs`; icons via `astro-icon` (Heroicons + Simple Icons).

## Known Issues
- **README.md at repo root is outdated** (references Astro 5 and a `blogs/` + `libs.json` structure that no longer matches the article-first layout).
- Content gotchas (UTF-8 BOM in evogm/evogp news files, `iStratDE` vs `istratde` case mismatch, mixed `./relative` vs `/_static/` image references) — see `content/CONTEXT.md`.
- `Layout.astro` `pt-br`/`zh-tw` htmlLang mapping and hreflang/OG locale maps must stay consistent with `i18n/utils.ts` locale lists (three places define locale metadata).
- Pagination pages must never gain an `index.astro` (collides with paginate's base page).

## Test Strategy
- No test suite exists in the repo (playwright is a devDependency but unused for tests). Verification is: `pnpm build` (catches content-schema/JSON errors), manual per-locale spot checks, and the i18n key-parity check described in `i18n/CONTEXT.md`.

## Routing Table
- `pages/` → Routing layer (English + `[locale]/` mirrored page trees)
- `components/` → Header/Footer chrome + page-body components (`components/pages/`)
- `content/` → Content collections (docs/, examples/, news/, releases/, tutorials/, libs.json)
- `i18n/` → UI-string locales (`locales/`) + i18n utils
- `layouts/` → `Layout.astro` (SEO head, page chrome; leaf — no CONTEXT.md needed)
- `styles/` → `global.css` (Tailwind v4 entry; leaf)
- `types/` → `pagination.ts` shared types (leaf)
- `assets/` → Images (leaf; no code)
- `content.config.ts` → Content collection schemas (single file at this level)

## See Also
- `../public/` — static assets served at site root (favicons, `_static/` figures referenced by docs/tutorials markdown, release screenshots in `images/articles/`, og-image, qq-group-qr). Sibling — read-only for agents under `src/`; escalate writes to root.
- `../astro.config.mjs` — i18n locale list and routing config (must match `i18n/utils.ts`).
