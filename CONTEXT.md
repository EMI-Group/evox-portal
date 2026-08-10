# EvoX Portal (Repository Root)

## Intent
The **EvoX Portal** is the landing/marketing website for the EvoX evolutionary-computation project (EMI-Group). It is a content-first **Astro 6** static site with **Tailwind CSS v4**, **astro-icon**, and full **i18n across 13 locales** (en, zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br), deployed to **Vercel** at https://www.evox.group. Content is managed via Astro Content Collections (docs, news, releases, tutorials, ecosystem libs) in an article-first, per-locale-file layout.

## API Surface
- `package.json` — `name: evox-portal`, scripts: `dev`, `build`, `preview`, `astro`. Dependencies: astro ^6, @astrojs/vercel, tailwindcss ^4 + @tailwindcss/vite + @tailwindcss/typography, astro-icon, @vercel/analytics, sharp; devDeps: @iconify-json/heroicons, @iconify-json/simple-icons, playwright. Package manager pinned to **pnpm@10.28.0**.
- `astro.config.mjs` — Site config: `site: https://www.evox.group`; i18n with `defaultLocale: "en"` and `prefixDefaultLocale: false` (English URLs have no locale prefix; 12 other locales use `/{locale}/` prefixes, incl. es-419 and pt-br with explicit codes); Vercel adapter with `webAnalytics` enabled only when `VERCEL` env var is set; devToolbar disabled; `@tailwindcss/vite` plugin; `astro-icon` integration.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, includes `**/*`.
- `pnpm-workspace.yaml` — onlyBuiltDependencies: esbuild, sharp. `pnpm-lock.yaml` is the single lockfile (package-lock.json was removed in commit 6beadd1).
- `README.md` — Quick-start, architecture notes, and news/library writing guides (⚠️ partially outdated — references Astro 5 and a `blogs/` structure; actual layout is article-first content collections).
- `.agents/` — Agent configuration: `rules/language.md` (all code/comments/identifiers must be English) and `skills/` (`translate` — translate an article's `en.md` to all/some of the 12 non-English locales; `add-lib` — manual, script-free workflow to add an entry to `src/content/libs.json` + i18n keys).
- `.vscode/` — Editor config (`extensions.json`, `launch.json`).
- `public/` — Static assets served at site root: favicon.svg/png, logos, `_static/` figures referenced by docs/tutorials markdown, `images/articles/` release screenshots, `images/og-image.png`, `images/qq-group-qr.png`.

## Constraints
- **pnpm only** (packageManager pinned; don't introduce npm/yarn lockfiles).
- **English-first**: en.md is the source of truth for content; en.json is the source of truth for UI strings; all locale files must keep full key parity (175 keys). Content fallback to English is automatic.
- **No hardcoded UI strings** in components/pages — use `loadTranslations()` + `t()` from `src/i18n/utils.ts`.
- **No trailing slashes** in internal links; en URLs unprefixed, others `/{locale}/...`.
- Agent language rule (`.agents/rules/language.md`): code, comments, and string literals must be in English even if the user speaks another language.

## Design Decisions
- **Content-first with article-first layout** (commit 18a23c5): each article is a directory with one `.md` per locale, enabling `getLocalizedArticles`/`findLocalizedArticle` English-driven enumeration with per-locale fallback.
- **`prefixDefaultLocale: false`** ⇒ dual mirrored page trees (top-level English + `[locale]/`) that must be kept in sync manually — see `docs/agent-context/src-pages/CONTEXT.md`.
- Site design history: v3.0 redesign (commit 03c14b3) with animated navbar (View Transitions API, rAF-driven fly-in), later additions: Runtime/Genesis landing pages (8991303), QQ-group QR modal (6f50b78), Genesis nav tab now links externally to genesis.evox.group (e173eda — no `/genesis` route exists).

## Known Issues
- `README.md` project-structure section is stale relative to the actual `src/` layout.
- Locale metadata (htmlLang/hreflang/OG maps) is duplicated in `src/layouts/Layout.astro` and `src/i18n/utils.ts` — keep in sync.
- Some non-English locale values are byte-identical to English (mostly intentional brand names; a few genuine gaps — see `src/i18n/CONTEXT.md`).
- Content edge cases (UTF-8 BOM in some news files, `iStratDE`/`istratde` case mismatch) — see `src/content/CONTEXT.md`.

## Test Strategy
No automated test suite (playwright is present but unused). Verification relies on `pnpm build` (content-schema + JSON parse errors), per-locale manual spot checks, and the i18n key-parity check in `src/i18n/CONTEXT.md`.

## Routing Table
- `src/` → All application source code (pages, components, content, i18n, layouts, styles, types, assets, content.config.ts)
- `public/` → Root-served static assets (favicons, logos, `_static/` figures, article images, OG/QR images) — leaf
- `.agents/` → Agent rules and skills (translate, add-lib) — leaf; read `skills/` before adding news articles or ecosystem libs
- `.vscode/` → Editor config — leaf
- `astro.config.mjs` / `package.json` / `tsconfig.json` / `pnpm-workspace.yaml` → Root-level config (single files)

## See Also
- `src/content/` → how to add/translate articles; `src/i18n/` → UI-string keys; `src/pages/` → routing conventions.
