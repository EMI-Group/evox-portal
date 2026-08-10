# src/components/pages/

## Intent
Page-body components for EvoX Portal's landing pages — one component per landing page. Thin route files in `src/pages/` (and `src/pages/[locale]/`) render these with a `locale` prop (`<HomeContent />` on `/`, `<RuntimeContent />` on `/runtime`). Default-locale routes pass no props; the component falls back to `defaultLocale` ("en").

## API Surface
All components: `interface Props { locale?: Locale }`, `const tr = await loadTranslations(locale)`.

- **HomeContent.astro** (650 lines) — Homepage body. Renders `<Layout title={t(tr,"site.title")} hideHeader hideFooter locale>` and manages its own chrome: `<Header animated locale>` inside `#navbar` (fixed, starts `translateY(-100%)` — fully above the viewport, scroll-independent) + `<Footer locale>`. Sections: hero (split title `hero.title.line1/2`, logo, `#cta-content`), Latest News (latest release + 2 latest news via `getCollection("news"/"releases")` + `getLocalizedNews`/`getLocalizedArticles`, dates via `getDateLocale`/`toLocaleDateString` with `timeZone:"UTC"`, summary fallback keys `news.defaultSummary`/`releases.defaultSummary`), Ecosystem (first 3 `getCollection("libs")`, desc via `` t(tr, `libs.desc.${id}`) ``, links `item.data.url` external), Community (QQ QR modal + Discord link). Inline `<script>`: hero fly-in animation (rAF, top-entry: navbar slides down from above the viewport while a cloned flyLogo morphs from the hero spot to the navbar spot on a `smooth()` timeline; `pAll = smooth(rawT)` drives logo morph + hero collapse/CTA fade/gradient; flyLogo handoff to `img[data-logo-mark]`), scroll lock via non-passive wheel/touchmove `preventDefault`, `history.scrollRestoration = "manual"`, anchor-link (`a[href^='#']`) interception, QQ modal toggle (`data-qq-qr-open`/`data-qq-qr-close`, Escape, `/images/qq-group-qr.png`).
- **RuntimeContent.astro** (53 lines) — `/runtime` hero + delegate. `<Layout title={t(tr,"runtime.pageTitle")} description={t(tr,"runtime.hero.desc")} locale>`, dark hero (keys `runtime.hero.badge/subtitle/desc`), GitHub link, then `<RuntimeExamples locale={locale}>`.
- **RuntimeExamples.astro** (373 lines) — Tabbed live examples. 3 tabs (`examples.singleObj/multiObj/neuro`) with `/arrow_1.png`…`/arrow_3.png`; each panel = `astro:components` `<Code code={...py?raw} lang="python" theme="github-dark">` + interactive component from `src/content/examples/` (`single-obj.astro`, `multi-obj.astro`, `neuroevolution.astro` — only neuroevolution takes `locale`). Inline `<script>`: auto-advancing carousel (~16 s/tab, `BRAX_DURATION`), Plotly animation on `#cso-plot`/`#rvea-plot` (guards: `data-ready="true"` + global `Plotly`), Brax iframe readiness polling (500 ms), initial wait-and-start poll (20 × 300 ms ≈ 6 s then give up), APG arrow/Home/End keyboard tab nav.

## Constraints
- i18n: `loadTranslations(locale)` + `t(tr, "key")` only; no hardcoded UI strings. Documented deviations: "EvoX Runtime" H1 in RuntimeContent.astro, "QQ: 297969717" in HomeContent.astro, alt texts.
- Internal links via `getLocalizedUrl(path, locale)` (HomeContent News/Ecosystem "see all").
- External links: `target="_blank" rel="noopener noreferrer"` (GitHub, Discord, ecosystem cards).
- Scoped `<style>`/`<script>` per component; no shared page-level JS.

## Known Issues
- Homepage scroll is locked (wheel/touchmove prevented) until the hero fly-in completes; first wheel/touch/click triggers expand; reduced-motion users get instant `completeExpand()`. Anchor-link scrolls are deferred until expansion finishes (`pendingAnchor`). `#cta-content` is `inert` + `pointer-events:none` until expanded (removed mid-animation at `pAll >= 1`).
- "EvoX Runtime" H1 is hardcoded (not localized); also the Runtime GitHub link reuses `t(tr, "genesis.hero.github")` — a cross-key reuse left over from the deleted Genesis page (GenesisContent.astro was removed in commit e173eda; Genesis is now an external link).
- RuntimeExamples depends on browser globals: Plotly (loaded by example components) and the lazy Brax iframe. If plot/iframe never becomes ready the carousel skips ahead (guards + poll timeouts). `Plotly.Plots.resize` is called on tab activation.
- Carousel animations continue even when the tab is hidden (only guarded by `animationActive`/`currentTab` checks) — panels are `display:none` when inactive.

## Routing Table
- `../../content/examples/` → Interactive example components (`single-obj.astro`, `multi-obj.astro`, `neuroevolution.astro`), raw `.py` sources imported via `?raw`, Plotly data (`cso-data.js`, `rvea-frames.json`, …) and Brax viewer (`brax-viewer.ts`, `brax-data.json`). Sibling dependency — READ-only from here; escalate writes to parent.
- `../pages/` and `../pages/[locale]/` → Thin route files (`index.astro`, `runtime/index.astro`) that render these components. Sibling — READ-only from here; escalate writes to parent.
- `../Header.astro`, `../Footer.astro` → Chrome components consumed by HomeContent (Header `animated` variant + `data-logo-mark` logo required by the fly-in script). Sibling — READ-only from here.
- `../../i18n/utils.ts` → `loadTranslations`, `t`, `getLocalizedUrl`, `getDateLocale`, `getLocalizedNews`, `getLocalizedArticles`, `Locale`, `defaultLocale`. Sibling — READ-only from here.

## Status
Stable. GenesisContent.astro deleted (e173eda); no pending work known.

## See Also
Commit 8991303 "add Runtime and Genesis landing pages, restructure nav and homepage" created this directory (RuntimeExamples moved out of the homepage; HomeContent slimmed by ~425 lines). Commit e173eda removed GenesisContent and its routes.
