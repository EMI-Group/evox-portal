# src/i18n — Internationalization

## Intent
Centralized internationalization for the EvoX Portal (Astro 6 static site). Two responsibilities:
1. **UI string translation** across 13 locales via flat JSON key files (`locales/`), with English as the fallback source of truth.
2. **Localized content helpers** for content collections (docs, tutorials, news, releases) whose entries are stored per-locale as `id` ending in `/locale` (e.g. `evogp/en`), resolving the right entry for the active locale with English fallback.

## API Surface (`utils.ts`)

**Locale model**
- `locales` — readonly array of 13 locales: `en, zh-cn, zh-tw, ja, ko, fr, de, it, es, es-419, ru, pt, pt-br`.
- `Locale` — union type derived from `locales`.
- `defaultLocale: Locale = "en"`.
- `localeNames: Record<Locale, string>` — native display names (e.g. `简体中文`) for the language switcher (`src/components/Header.astro`).

**Translation**
- `loadTranslations(locale): Promise<Record<string,string>>` — lazy-loads the locale JSON via dynamic `import()`, caches per-locale in module-level `cache`; on import failure silently falls back to `en`. English is statically imported at module load, so `en` is synchronously available and pre-seeded in the cache.
- `t(translations, key, params?)` — lookup `translations[key]`, falling back to `en[key]`, then to the raw `key` itself. Interpolates `{placeholder}` occurrences with `params` values using `replaceAll` with a function replacement (so `$&`-style sequences in values are not interpreted). Placeholders currently used: `{year}` (footer.copyright), `{page}` (news/releases page titles), `{current}`/`{total}` (news/releases pagination info).

**URL handling**
- `getLocaleFromUrl(pathname)` — first path segment is a locale prefix? return it; else `defaultLocale`.
- `getLocalizedUrl(pathname, targetLocale)` — strips the current locale prefix, adds the target prefix (none for `en`). Site-wide convention: **no trailing slash** — `"/"` maps to `/{targetLocale}` (e.g. `/ja`), never `/ja/`.

**Date formatting**
- `getDateLocale(locale)` — maps `Locale` → Intl locale string (`en-US`, `zh-CN`, ..., `es-419`, `pt-PT`, `pt-BR`); unknown → `en-US`. Used with `Intl.DateTimeFormat` in news/releases/home pages.

**Content-collection localization** (entries are `{slug}/{locale}` ids)
- `getArticleSlug(id)` / `getNewsSlug(id)` — strip the `/locale` suffix from an id.
- `getLocalizedArticles(all, locale)` / `getLocalizedNews(all, locale)` — enumerate English entries, find the matching `{slug}/{locale}` entry (falling back to the English one), return each with an added `slug` field.
- `findLocalizedArticle(all, slug, locale)` / `findLocalizedNews(all, slug, locale)` — single-entry variants with English fallback.

**Consumers** (all import from `../../i18n/utils` or deeper): `src/layouts/Layout.astro`, `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/pages/{HomeContent,RuntimeContent,RuntimeExamples}.astro`, pages under `src/pages/` (docs, tutorials, news, releases, libs, community, runtime — both root-level and `[locale]`-prefixed variants), and `src/content/examples/neuroevolution.astro`.

## Constraints
- **Key sets must stay identical across all 13 locale files.** Verified at time of writing: every file has exactly 175 flat dot-namespaced keys with zero missing/extra keys. Adding a key to `en.json` without adding it to the others is invisible (English fallback masks it) but leaves other locales silently untranslated.
- `en.json` is the source of truth: new keys are added there first.
- `lang.*` keys (13 of them) hold native language names and are intentionally identical across all files — do not "translate" them.
- Key naming: flat, dot-separated groups — `site.` (1), `meta.` (1), `nav.` (22), `hero.` (6), `news.` (12), `features.` (10), `examples.` (7), `footer.` (10), `lang.` (13), `community.` (9), `docs.` (9), `ecosystem.` (4), `genesis.` (35), `libs.` (18), `releases.` (10), `runtime.` (4), `tutorials.` (4).
- `libs.desc.*` keys (one per library: evox, evogit, evogp, evorl, evomo, tensorneat, metade, evoxbench, istratde, evogo, evonas, evocmo, autopso) are consumed by `src/pages/libs.astro` and `src/pages/[locale]/libs/index.astro` to translate `src/content/libs.json` descriptions — every lib in the JSON needs a matching `libs.desc.<id>` key in every locale.
- Do not use trailing slashes when constructing site-internal URLs (`getLocalizedUrl` enforces this).
- **Terminology policy** (site-wide, owner-mandated): Chinese copy uses 演化 for "evolution" — never 进化/進化. The product word "Runtime" (site.title, hero tagline, `runtime.*` keys) is never translated into a native-language word: ja/ko keep the loanword spellings ランタイム/런타임, ru embeds English "runtime", zh embeds English "Runtime" directly; de/es/es-419/fr/it/pt/pt-br already embed English "Runtime". New copy in these locales must follow this.

## Known Issues
- **"12 locales" vs 13 files**: commit `e225987` ("Improve i18n translations for all 12 locales") predates the current 13-file layout; all 13 files (en + 12 non-English) were added together in `497ff71` ("Update to v3.0.2-alpha"). The count discrepancy is historical commit-message imprecision, not a missing file.
- **Possibly untranslated values**: several non-English files contain values byte-identical to English. Most are intentional (brand names like "Genesis"/"EvoX", "Discord", `lang.*` native names, the `NEW` badge, the copyright line), but some look like genuine gaps — e.g. `fr.json` has 29 identical values including `nav.docs`="Docs", `nav.pagination`="Pagination"; `es.json` has `docs.section.experimental`="Experimental"; `ja.json` has `nav.genesis`="Genesis". Audit before assuming intent.
- **Silent fallback**: `loadTranslations` catches import errors and returns English with no warning — a typo'd locale filename is invisible until someone checks `cache`.
- **Module-level cache**: translations are cached for the process lifetime; in dev, editing a locale JSON after first load may not be picked up without a restart (Astro HMR generally reloads modules, but the static `en` import in `cache` is seeded once).
- **`t()` param behavior**: unknown `params` keys are silently ignored; a placeholder missing from `params` remains literally in the output (e.g. `{page}`).
- `getLocalizedArticles`/`getLocalizedNews` are driven by English entries — a locale-only entry without an English counterpart never appears.

## Routing Table
- `locales/` → per-locale flat JSON UI string files (13 files, see below).
- Sibling (read-only — investigate freely, but escalate any writes to `src/` parent):
  - `../content/` → content collections (docs, tutorials, news, releases, libs.json) that the localized-content helpers operate on.
  - `../pages/`, `../components/`, `../layouts/` → consumers of `utils.ts` exports.

## Test Strategy
No automated tests exist for this module. Verification is manual:
- Key-set parity check across locales (Python):
  `python3 -c "import json,glob; ks=[(f,set(json.load(open(f)))) for f in glob.glob('src/i18n/locales/*.json')]; print([f for f,k in ks[1:] if k!=ks[0][1]])"` (expect empty output).
- Spot-check one page per locale (e.g. `/ja`, `/es-419/`) for missing translations and broken URLs.
- Run `npm run build` to catch JSON parse errors; note `loadTranslations` masks missing files at runtime, so a build warning is the only signal.

## Status
Complete and stable. All 13 locales ship with identical 175-key sets; utils.ts API is mature and widely consumed. Historical commits touching this module: `497ff71` (v3.0.2-alpha full i18n), `e225987` (translation improvement pass), `eafe9fb` (audit fixes), `0b94422` (dropped EvoX prefix from Genesis name in zh locales), `8991303` (Runtime/Genesis pages + nav restructure, added `runtime.*`, `genesis.*` keys).
