# src/pages/[locale] — Localized Page Mirrors

## Intent
Mirror tree serving the 12 non-default locales (ja, zh-cn, zh-tw, ko, fr, de,
it, es, es-419, ru, pt, pt-br). English has NO URL prefix (site config:
`i18n.defaultLocale = "en"`, `prefixDefaultLocale: false`), so English is served
by the non-prefixed pages in `src/pages/` and this tree exists exclusively for
non-default locales.

## Uniform Pattern (all files here follow it)
- Every page defines `getStaticPaths()` that filters
  `locales.filter((l) => l !== defaultLocale)` — the default locale is never
  generated here, so no `/en/...` URLs exist.
- Slug routes (`docs/[...slug].astro`, `news/[...slug].astro`,
  `releases/[...slug].astro`, `tutorials/[...slug].astro`) `flatMap` over
  locales × collection entries (`getLocalizedArticles` / `getLocalizedNews`),
  returning `{ params: { locale, slug }, props: { entry } }`.
- Paginated routes (`news/[...page].astro`, `releases/[...page].astro`) use
  `paginate(sorted, { params: { locale }, pageSize: 10 })`.
- Current locale is read from `Astro.params.locale` (typed `Locale`);
  translations via `loadTranslations(locale)` + `t(tr, ...)`; links via
  `getLocalizedUrl(path, locale)`.
- All pages wrap `src/layouts/Layout.astro` (imports use `../../../`).

## API Surface
- `index.astro` → `/{locale}/` home (wrapper around `components/pages/HomeContent.astro`, passes `locale` prop)
- `docs/index.astro` + `docs/[...slug].astro` → docs listing + articles
- `news/[...page].astro` + `news/[...slug].astro` → news pagination + articles
- `releases/[...page].astro` + `releases/[...slug].astro` → releases pagination + articles
- `tutorials/index.astro` + `tutorials/[...slug].astro` → tutorials listing + articles
- `community/index.astro` → community page
- `runtime/index.astro` → runtime page (wrapper around `components/pages/RuntimeContent.astro`, passes `locale` prop)
- `libs/index.astro` → libs page (parent tree's equivalent is a `libs.astro` FILE — keep the URL `/libs` consistent)
- No 404 mirror (English-only 404 in `src/pages/404.astro`).

## Known Gotchas
- These files are near-copies of the top-level pages. **Any edit to a
  top-level page must be mirrored here manually** — the two trees drift easily.
- `tutorials/index.astro` and `libs/index.astro` pass `locale` via props AND
  re-derive it from `Astro.params.locale`; both work, prefer params.
- Slug pages strip the first `# H1` from the markdown body before `render()`
  (`bodyWithoutH1`), same as the top-level counterparts.

## Routing Table
- `../../i18n/utils.ts` → locale helpers (read-only sibling, escalate writes to `../../`)
- `../../layouts/Layout.astro` → shared page shell (read-only sibling)
- `../../content.config.ts`, `../../types/pagination.ts` → collections & pagination types (read-only siblings)
