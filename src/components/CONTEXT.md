# CONTEXT.md — src/components/

## Intent
Shared site chrome (Header, Footer) plus page-body content components. Header/Footer are rendered by `src/layouts/Layout.astro` on every page (unless `hideHeader`/`hideFooter`); the `pages/` subdirectory holds full page-body components (they render `Layout` themselves, with `hideHeader hideFooter`, and manage their own chrome) for the homepage and the Runtime landing page. All components are Astro 3 `.astro` single-file components (markup + scoped `<style>` + `<script>`), styled with Tailwind CSS v4 utility classes and astro-icon (heroicons / simple-icons) icons.

## API Surface
- **`Header.astro`** — Props: `locale?: Locale` (default `defaultLocale` = "en"), `localePath?: string` (base path for the language switcher; pages without per-locale equivalents, e.g. 404, pass a fixed path), `animated?: boolean` (renders the logo mark `img[data-logo-mark]` with inline `opacity: 0` — only HomeContent's animation script reveals it), `sticky?: boolean` (DEAD — declared but no caller passes it). Renders: logo (`/logo_text.png` "EVO" + `/logo.svg` mark, both `brightness(0) invert(1)`), desktop nav (Genesis → external `https://genesis.evox.group/` with red "NEW" badge; Runtime dropdown → Overview `/runtime`, Tutorials `/tutorials`, Docs `/docs`, Docs API → external readthedocs; Blog dropdown → `/news`, `/releases`; Community `/community`; Ecosystem `/libs`; Contact → external `https://chengran.tech/`), language switcher (all 13 locales via `localeNames`, `data-locale-link`), GitHub icon → `https://github.com/EMI-Group`, mobile `<details>`-based menu (nav + locale switcher + GitHub). Nav labels use `t(tr, "nav.*")` EXCEPT the "Runtime" dropdown label which is hardcoded. Inline script: desktop dropdown state machine (`dropdown-open` class + `aria-expanded` sync, `.dropdown-suppressed` + `inert` suppression, Escape returns focus to trigger, menubar hover-closes-pinned behavior) and query/hash preservation appended to locale links.
- **`Footer.astro`** — Props: `locale?: Locale`. Renders logo, 5 social links (Facebook, X, Zhihu, Product Hunt, Reddit — `simple-icons`, brand-colored hover, hardcoded English aria-labels), copyright `t(tr, "footer.copyright", { year })`. `is:inline` script refreshes the year client-side via `data-copyright-year` using `replaceAll` (handles "© 2022-2022" ranges).
- **`pages/HomeContent.astro`** — Homepage body (see `docs/agent-context/src-pages/CONTEXT.md`): hero fly-in animation, news/releases cards, ecosystem, community (QQ QR modal + Discord), own `<Header animated>` + `<Footer>`.
- **`pages/RuntimeContent.astro`** — `/runtime` landing page wrapper: `Layout` + dark hero + `<RuntimeExamples>`.
- **`pages/RuntimeExamples.astro`** — Tabbed live code examples (Plotly carousel, Brax iframe panel).

## Constraints
- **i18n**: every component does `const tr = await loadTranslations(locale)` then `t(tr, "key")` — no hardcoded user-visible strings. Known deviations: "Runtime" nav label (Header), "EvoX Runtime" H1 (RuntimeContent), "QQ: 297969717" (HomeContent), English alt/aria-labels (Footer socials, logo alts).
- `locale` defaults to `defaultLocale`; route pages must pass the route's locale explicitly (`locale={locale as Locale}`).
- Internal links MUST use `getLocalizedUrl(path, locale)` (handles locale prefixing); external links use `target="_blank" rel="noopener noreferrer"`.
- Site-chrome dark background is a hardcoded inline style `background: rgb(22, 27, 48);` (also the header/nav/hero color); page content sections alternate white / gray-50 / gray-100.
- Layout container convention: `max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8`.
- Icons: `import { Icon } from "astro-icon/components"` with `heroicons:*` or `simple-icons:*` names.

## Known Issues
- **Hero scroll interception (HomeContent)**: the first `wheel`/`touchmove` is `preventDefault`ed via non-passive listeners to trigger the fly-in animation — fast-scrolling is blocked until the animation completes (~0.5–5.6 s). Listeners are removed after expand; keyboard/scrollbar scrolling triggers an instant `completeExpand()` fallback. Reduced-motion users skip animation and scroll lock entirely.
- **`<Header animated>` hides the logo mark** (inline `opacity: 0` on `img[data-logo-mark]`); only HomeContent's rAF script sets it back to 1. Do not use `animated` in any other context without matching reveal logic.
- **Genesis nav tab links externally** (genesis.evox.group) with a "NEW" badge — no internal `/genesis` route exists (deleted in e173eda); don't create content for a Genesis page without revisiting this.
- **`sticky` prop on Header is dead code** — no caller passes it.
- **Language switcher**: links are built server-side from `Astro.url.pathname` (trailing slash normalized); query string/hash are appended client-side by Header's script. Pages without per-locale equivalents must pass `localePath` or the switcher will produce wrong links.
- **RuntimeContent reuses `genesis.hero.github`** translation key for its GitHub link (legacy of the deleted GenesisContent).
- Dropdown JS in Header is subtle and easy to break: click-pinning vs. `:hover`/`:focus-within` interplay, suppression + `inert` during the 200 ms fade, Escape focus return. Test desktop + keyboard + touch before touching it.
- `astro-icon` and inline `<script>` (non-`is:inline`) in the same component: Header/HomeContent scripts are TypeScript-typed and bundled by Astro; Footer's year script is `is:inline` — keep it dependency-free.

## Dependencies
- `astro-icon` package (heroicons + simple-icons sets configured in astro config).
- HomeContent/RuntimeExamples depend on Astro content collections (`news`, `releases`, `libs`) and `src/content/examples/` (raw `.py` + interactive `.astro` components; Plotly global + Brax iframe at runtime).

## Test Strategy
No dedicated component tests in this repo (static site). Verify per-locale rendering by building with all 13 locales (`npm run build`); manually check: header dropdowns (hover/click/keyboard/Escape), language switcher links + query/hash preservation, hero animation (wheel/touch/click/keyboard, reduced-motion), QQ modal (open/close/Escape), example tab carousel (auto-advance, click, arrow keys, plot-not-ready fallback).

## Routing Table
- `pages/` → Page-body content components (HomeContent, RuntimeContent, RuntimeExamples) — detailed docs in `docs/agent-context/src-pages/CONTEXT.md`.
- `../layouts/Layout.astro` → Renders Header/Footer around a slot; `hideHeader`/`hideFooter` props (sibling — read-only, escalate writes to parent `src/`).
- `../i18n/utils.ts` → `loadTranslations`, `t`, `getLocalizedUrl`, `localeNames`, `getLocalizedNews/Articles`, `getDateLocale` (sibling — read-only, escalate writes to parent `src/`).
- `../content/examples/` → Interactive example components + raw `.py` sources consumed by RuntimeExamples (sibling — read-only, escalate writes to parent `src/`).

## Status
Complete. Note that `GenesisContent.astro` was deleted (e173eda) — do not expect it to exist.
