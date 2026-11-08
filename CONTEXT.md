# EvoX Portal (Repository Root)

## Intent
The **EvoX Portal** is the landing/marketing website for the EvoX evolutionary-computation project (EMI-Group). It is a content-first **Astro** static site with **Tailwind CSS v4**, **astro-icon**, and full **i18n across 13 locales** (en, zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br), deployed to **Vercel** at https://www.evox.group. Content is managed via Astro Content Collections (docs, news, releases, tutorials, ecosystem libs) in an article-first, per-locale-file layout.

## API Surface
- `package.json` — `name: evox-portal`, scripts: `dev`, `build`, `preview`, `export:preview`, `astro`. Dependencies: astro ^7.3, @astrojs/vercel ^11, tailwindcss ^4.3 + @tailwindcss/vite ^4.3 + @tailwindcss/typography ^0.5, astro-icon ^1.2, @vercel/analytics ^2, sharp ^0.35; devDeps: @iconify-json/heroicons ^1.2, @iconify-json/simple-icons ^1.2, playwright ^1.63. Package manager pinned to **pnpm@10.28.0**.
- `scripts/export-preview.mjs` — `pnpm export:preview` builds the site and exports independent Chinese and English HTML previews into ignored `dist-preview/`; an optional directory argument selects another destination. Styles, scripts, fonts, images, and licensing are embedded. Recipients need no server or installation; external content links open the live site. See `docs/showcase-redesign.md`.
- `astro.config.mjs` — Site config: `site: https://www.evox.group`; i18n with `defaultLocale: "en"` and `prefixDefaultLocale: false` (English URLs have no locale prefix; 12 other locales use `/{locale}/` prefixes, incl. es-419 and pt-br with explicit codes); Vercel adapter with `webAnalytics` enabled only when `VERCEL` env var is set; devToolbar disabled; `@tailwindcss/vite` plugin; `astro-icon` integration.
- `tsconfig.json` — extends `astro/tsconfigs/strict`, includes `**/*`.
- `pnpm-workspace.yaml` — onlyBuiltDependencies: esbuild, sharp. `pnpm-lock.yaml` is the single lockfile (package-lock.json was removed in commit 6beadd1).
- `README.md` — Quick-start, architecture notes, and news/library writing guides (⚠️ partially outdated — references Astro 5 and a `blogs/` structure; actual layout is article-first content collections).
- `.agents/` — Agent configuration: `rules/language.md` (all code/comments/identifiers must be English) and `skills/` (`translate` — translate an article's `en.md` to all/some of the 12 non-English locales; `add-lib` — manual, script-free workflow to add an entry to `src/content/libs.json` + i18n keys).
- `.vscode/` — Editor config (`extensions.json`, `launch.json`).
- `public/` — Static assets served at site root: favicon.svg/png, logos, `_static/` figures referenced by docs/tutorials markdown, `images/articles/` release screenshots, `images/og-image.png`, `images/qq-group-qr.png`.

## Constraints
- **pnpm only** (packageManager pinned; don't introduce npm/yarn lockfiles).
- **English-first**: en.md is the source of truth for content; en.json is the source of truth for UI strings; all locale files must keep full key parity (237 keys, including `theme.toggle`). Content fallback to English is automatic.
- **No hardcoded UI strings** in components/pages — use `loadTranslations()` + `t()` from `src/i18n/utils.ts`.
- **No trailing slashes** in internal links; en URLs unprefixed, others `/{locale}/...`.
- Agent language rule (`.agents/rules/language.md`): code, comments, and string literals must be in English even if the user speaks another language.

## Design Decisions
- **Content-first with article-first layout** (commit 18a23c5): each article is a directory with one `.md` per locale, enabling `getLocalizedArticles`/`findLocalizedArticle` English-driven enumeration with per-locale fallback.
- **`prefixDefaultLocale: false`** ⇒ dual mirrored page trees (top-level English + `[locale]/`) that must be kept in sync manually — see `docs/agent-context/src-pages/CONTEXT.md`.
- **Showcase visual design**: the homepage uses black/white surfaces, EvoX red accents, self-hosted Instrument Sans Latin/Latin Extended fonts, large typography, fine borders, and SVG diagrams. A one-shot full-viewport EVOX overlay introduces the normal content flow: hero (`#home`) → evolution → AI paradigms → computing → resources → news. The homepage wrapper owns `#top`; after entry, it returns directly to the normal homepage. A corner chapter rail appears at widths of at least 1280px. `BrandWordmark.astro` combines the vector EVO letters supplied in `新版本evox-svg.zip` with the existing animated BrandMark X for the opening, hero, and header. See `docs/showcase-redesign.md`.
- **Theme ownership**: `src/styles/global.css` defines shared `--site-*` tokens. `Layout.astro` defaults to light and restores saved `evox-theme` before rendering; Header toggles/persists dark or light. Existing content routes receive theme adaptations under `.site-main-padded`; HomeContent uses `<Layout fullBleed>` with shared chrome and scoped content styles. Layout's `fullBleed?: boolean` defaults to false; main is padded when `!hideHeader && !fullBleed`. Shared Header branding remains on the left, and the homepage opening flies into its measured wordmark target.
- **Progressive motion**: `HomeIntro.astro` is a fixed overlay when JavaScript is available. One downward wheel gesture, click/tap, upward swipe, or PageDown/ArrowDown/Space/End press moves the actual full vector logo to the upper-left header target with a 1050ms native Web Animations transform while the curtain fades away. It measures source and destination once, keeps scrollbar geometry stable, and hides the target until handoff. Completion hides the overlay permanently for that document, restores temporarily inert content, removes input listeners, and leaves ordinary native scrolling with no opening placeholder. A 1.6-second safety timeout, Escape, and interruption handlers release the transition. Keyboard entry focuses the hero title. Deep links and restored positions skip entry; scrolling back to `#top` never replays it. Reduced motion enters instantly. Without JavaScript, an in-flow opening and visible navigation provide a usable fallback. Optional content reveals use IntersectionObserver. Header is immediately visible on other routes. Genesis remains external at genesis.evox.group; no `/genesis` route exists.

## Known Issues
- **Never create CONTEXT.md files under `src/pages/`** (or any `.md` there that is not a real page): Astro treats every `.md` in `src/pages/` as a route. `src/pages/[locale]/CONTEXT.md` hard-breaks `pnpm build` with a "getStaticPaths() required" error, and `src/pages/CONTEXT.md` would deploy a stray `/CONTEXT` page. The pages-subtree agent docs were relocated to `docs/agent-context/` (commit 74800d8) — keep them there.
- `README.md` project-structure section is stale relative to the actual `src/` layout.
- Locale metadata (htmlLang/hreflang/OG maps) is duplicated in `src/layouts/Layout.astro` and `src/i18n/utils.ts` — keep in sync.
- Some non-English locale values are byte-identical to English (mostly intentional brand names; a few genuine gaps — see `src/i18n/CONTEXT.md`).
- Content edge cases (UTF-8 BOM in some news files, `iStratDE`/`istratde` case mismatch) — see `src/content/CONTEXT.md`.
- `pnpm build` logs a non-fatal `[WARN] [astro-icon] Failed to load icons from "src/icons": ENOENT` — astro-icon 1.2.0+ surfaces missing-`src/icons` errors instead of swallowing them, and this site intentionally ships no local icons (all icons come from the iconify sets); the warning is cosmetic and safe to ignore.
- `@vercel/analytics` is a direct dependency but is never imported in `src/` — Vercel Web Analytics is injected by the `@astrojs/vercel` adapter's `webAnalytics` option instead; keep the dep only if a manual injection script is added later.

## Test Strategy
No committed automated test suite. Verification relies on `pnpm build` (content-schema + JSON parse errors), desktop/mobile browser checks in both themes, per-locale spot checks, and the i18n key-parity check in `src/i18n/CONTEXT.md`. Check opening flight alignment, one-shot completion, normal scrolling after entry, deep links, and reduced motion. The Showcase redesign build generated 729 pages successfully. The redesign is intended for review on the `ui` branch; production remains unchanged until a separate merge/deployment.

## Routing Table
- `src/` → All application source code (pages, components, content, i18n, layouts, styles, types, assets, content.config.ts)
- `public/` → Root-served static assets (favicons, logos, `_static/` figures, article images, OG/QR images) — leaf
- `.agents/` → Agent rules and skills (translate, add-lib) — leaf; read `skills/` before adding news articles or ecosystem libs
- `.vscode/` → Editor config — leaf
- `astro.config.mjs` / `package.json` / `tsconfig.json` / `pnpm-workspace.yaml` → Root-level config (single files)

## See Also
- `src/content/` → how to add/translate articles; `src/i18n/` → UI-string keys; `src/pages/` → routing conventions.
