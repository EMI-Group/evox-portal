# EvoCoCo publication preparation

Checked on 2026-10-09. Content is prepared and verified; staged rollout in progress (Chinese + English first, remaining locales to follow).

## Prepared content

- English: `src/content/news/evococo/en.md`, route `/news/evococo`.
- Simplified Chinese: `src/content/news/evococo/zh-cn.md`, route `/zh-cn/news/evococo`.
- Traditional Chinese: `src/content/news/evococo/zh-tw.md`, route `/zh-tw/news/evococo`.
- Shared assets: eight original PNG files in the same article directory, referenced using relative Markdown paths and descriptive locale-specific alt text.
- Publication date: `2026-10-09` in all locale files (matches the actual release day).
- Remaining locales (`ja, ko, fr, de, it, es, es-419, ru, pt, pt-br`) are translated from `en.md` via the `/translate` skill and land in a follow-up commit. Missing locales fall back to English at render time, so shipping without them is safe.

Source: the Chinese and English website HTML fragments under `C:\Users\developer\Projects\evoblog\EvoCoCo_公众号发布稿\多平台稿件`. The supplied translation review and local paper `2609.02387v1.pdf` were also checked. Original source files were left intact.

## Editorial changes

- Added the required title, publication date, and summary frontmatter.
- Removed the body H1 because the website template renders the title already.
- Converted HTML paragraphs, headings, lists, links, figures, captions, and the table to native Markdown. Preserved all eight image positions, five figure captions, and both table data rows.
- Corrected Chinese reliability improvements from `52.08%` and `17.08%` to `52.08个百分点` and `17.08个百分点`. The English source already uses percentage points. The local paper, page 9, confirms these units.
- Normalized the Chinese Figure 5 annotation to `37,339×` at `N = 16,384` and added its missing final punctuation. The local paper, page 11, confirms the test scale. This is a representative algorithm result, not a typical speedup across all algorithms.

## Verification

- Checked source text blocks against the Markdown, allowing only the documented Chinese corrections and presentation changes.
- Checked every table cell and all source resource URLs.
- Verified all eight copied images match the source bytes using SHA-256.
- Visually reviewed the supplied contact sheet for the title and five technical figures.
- Checked the local paper: percentage-point improvements on page 9, 88.2% fidelity coverage and median speedups on page 10, and runtime scaling on page 11.
- Confirmed the existing news route code enumerates English articles and selects the locale file with English fallback for missing locales.
- `pnpm build` passes: 716 pages built (the earlier `GenerateContentTypesError: require is not defined` from picomatch was resolved by the dependency reinstall on 2026-10-09; no config or manifest changes were needed).
- Prerendered HTML verified for all three routes: correct `<title>` per locale, all eight image asset references, table values, and the upstream promo link; `/news` listing page 1 links `/news/evococo`.
- External links verified reachable via HTTP 200: `https://arxiv.org/abs/2609.02387`, `https://github.com/EMI-Group/evococo`, `https://github.com/EMI-Group/evox`.

## Rollout

1. First commit: `en.md`, `zh-cn.md`, `zh-tw.md`, the eight PNGs, and this document — pushed to `prod` to publish the article.
2. Follow-up commit: the remaining ten locale files after `/translate` review (image paths byte-identical, `pubDate` unchanged, terminology per the translate skill rules, 演化 glossary enforced for Chinese).
3. After each push, confirm the live deployment serves the new routes.
