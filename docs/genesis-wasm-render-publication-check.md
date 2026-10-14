# Genesis WASM Render publication preparation

**Withdrawal requested on 2026-10-14 at 12:01 Asia/Shanghai.** The owner asked to retract this publication. All 13 locales and drawing assets have been moved from the live content collection to `drafts/news/genesis-wasm-render/`, retaining the manuscript for future editing. The earlier `/news/evox-genesis` article is unaffected. The publication history below is retained for traceability; it is not an instruction to republish.

Prepared on 2026-10-14. The scheduled release run started after **2026-10-14 at 11:30 Asia/Shanghai (03:30 UTC)**, as requested by the site owner. The local preview was not the public website; no push was made before the scheduled time. Publication and production verification are complete, as recorded below.

## Content and routes

- Article directory: `src/content/news/genesis-wasm-render/`.
- All 13 locales are prepared: `en`, `zh-cn`, `zh-tw`, `ja`, `ko`, `fr`, `de`, `it`, `es`, `es-419`, `ru`, `pt`, `pt-br`.
- English route: `/news/genesis-wasm-render`.
- Simplified Chinese route: `/zh-cn/news/genesis-wasm-render`.
- Other routes: `/{locale}/news/genesis-wasm-render`.
- Publication date: `2026-10-14` in all locale files. The existing schema has no timed-publication filter; the production push must happen at the requested release time.
- The August C-compiler introduction at `/news/evox-genesis` remains a separate historical article.

The source is the site owner's latest Chinese article supplied in this chat, including the editorial revision received before the scheduled 11:30 release. The Simplified Chinese body retains its wording and figures. English is the repository's translation source, and the remaining locales follow the repository's `translate` skill.

The revision is synchronized across all 13 locales: the official per-challenge cost estimate now reads more than US$1,000; the introduction separately emphasizes approximately two days and just US$36 in model charges; the comparison explicitly gives a 100% pass rate for the WebGL2.0 tests run; the project-scale wording and prior empty-repository C-compiler description are updated. Summaries also emphasize just US$36. The existing community section and resource links remain in place; the supplied revision covers the preceding sections.

## Presentation adjustments

- Added title, publication date, and summary frontmatter. The title emphasizes approximately two days and US$36 in model charges.
- Decoded `&#x82B1;` and `&#x56E2;` to their intended Chinese characters.
- Converted the supplied plain image link to a Markdown image with descriptive alt text and a caption.
- Downloaded the original Chinese image into the article directory as `wasm-render-results.png`; `zh-cn` and `zh-tw` reference it. All 11 non-Chinese locales reference `./wasm-render-results-en.png`.
- Normalized the Chinese percentage parentheses. Kept punctuation outside the Chinese bold markers so the separate duration, cost, and first-submission emphasis renders correctly under CommonMark.
- Omitted a body H1 because the news template already renders the frontmatter title.
- Preserved the four resource URLs and QQ group number exactly.

Image source: `https://mmbiz.qpic.cn/mmbiz_png/1jLibNtmIkzmlfzibvrcmiczA38HCic3n3v755GFmn00M8uWFweecYjmE4BJrqeyk65HqUymXBrSct5icm0b2nR3Ew7sq3NuNGYE95xwwRN9MrPs/640?wx_fmt=png&from=appmsg`.

Original image: PNG, 1080 × 732, 115,951 bytes. SHA-256: `B41C980D0D42A09E17AACD238BDFC44110B320DC1E0C1E6EFD79D6046C334E0E`. The production build generates an approximately 28 KiB WebP asset. The original image was visually inspected and matches the figures in the supplied text.

### English figure

The owner requested an English version for every non-Chinese locale before publication. Historical chat `优化 Genesis 发布稿 (2)` and its files identify the original drawing source: `C:/Users/developer/Projects/evoblog/EvoX_Genesis_TerminalBench_发布稿/新版_2026-10-04/evidence/build_news_figures.py`, chart `wasm-results-v3`.

The English chart is rendered from that original Matplotlib chart source with the same canvas, coordinates, fonts, colors, logo paths, bars, cards, and numerical values. Only Chinese labels are translated. Export DPI is 120 to match the existing website PNG's 1080 × 732 dimensions. The English PNG was visually checked for text accuracy, fit, and retained design details.

Reproducible source and assets are saved together in the article directory: `render_results_en.py`, `evox-mark.svg`, `wasm-render-results-en.svg`, and `wasm-render-results-en.png`. The source logo is copied from the original official brand asset. English PNG SHA-256: `07FE34A42A81F47EDD594654D40590A016E63D67222484C85122AEC8940685CA`.

Both PNGs have identical 1080 × 732 dimensions. Sampled unchanged background, gray bar, red bar, and card colors match exactly: `(251,251,250)`, `(138,141,147)`, `(200,56,60)`, and `(247,238,238)` respectively. The final build with both images passed at 11:25 Asia/Shanghai (729 pages); all 13 production routes passed the locale-specific image checks afterward. No publication push occurred during this work.

## Source checks and attribution

- [Terminal-Bench's official announcement](https://www.tbench.ai/news/terminal-bench-challenges) confirms the complete-project task format, approximately US$1K+ expected cost, and Devin + Fable 5's 20.5% WebGL2.0 result in the early 12-hour experiments.
- [The challenge results repository](https://github.com/BillHuang2001/tbench-wasm) reports DeepSeek V4 Flash, two days, US$36, and 2,017/2,019 Khronos CTS tests (99.90%).
- The supplied team figure records 1,184/1,184 WebGL2.0 tests. The article retains the qualification that these are the tests run by the team. The overall CTS result is not described as 100%.
- [The Genesis repository](https://github.com/EMI-Group/genesis) supports the recursive software-world description and prior approximately 250K-line C-compiler experiment. Its first-submission wording is qualified as the first publicly known system, as far as the team can determine. The stronger worldwide-first wording in the supplied article is preserved as the owner's statement; an independent official submission timestamp was not established during these checks. The official challenge leaderboard link currently redirects to the general Terminal-Bench homepage.
- The approximately 130K lines and 98% cache hit rate remain attributed to the supplied team account; the full engineering experiment was not rerun for this news publication.
- [The paper](https://arxiv.org/abs/2608.10450) and [upstream EvoX repository](https://github.com/EMI-Group/evox) are accessible and correspond to the supplied links.

## Verification

- All 13 source files pass checks for UTF-8 encoding, required title/summary/date fields, three H2 headings, no duplicate body H1, the appropriate Chinese/English image reference, and the same four resource URLs.
- Key figures checked across all locales: 2,017/2,019; 99.90%; 1,184/1,184; 20.5%; the explicit 100% for the WebGL2.0 tests run; 98%; US$36; the 12-hour comparison; QQ group 297969717. Chinese terminology uses 演化.
- Production build passes: `pnpm build`, 729 pages. The previously documented local `picomatch` CommonJS loading error required a frozen-lockfile dependency reinstall and running the build with normal local permissions. No manifest, lockfile, or application configuration changes were made.
- Generated production HTML checked for all 13 routes: matching titles and dates, one H1, three H2s, all four bold spans correctly rendered, the revised explicit 100% result, a generated local image asset that exists, correct canonical URL, and links from each locale's home page and news listing.
- After the editorial revision, production build and all 13 source/HTML checks passed again at 11:17 Asia/Shanghai. The 11:30 publication schedule is unchanged; these checks did not commit or push the article.
- Browser automation was unavailable in this session. A local preview was started at `http://127.0.0.1:4321/zh-cn/news/genesis-wasm-render` and opened in the app for owner review; a browser screenshot review was not claimed.

## Release procedure

### Connection and permission preflight

Before the scheduled release, verified the live remote `origin/prod` head is `df01180a4d2a0263b2fcbb9f2b8fa9f5cbfaf147`, identical to local HEAD. `git push --dry-run origin HEAD:prod` succeeds with `Everything up-to-date`, confirming the configured Git transport and credentials without uploading commits. Connected GitHub repository metadata reports push permission and identifies `prod` as the default branch. The current production commit's `Vercel` status is `success`, linked to `https://vercel.com/zaberlabs-projects/evox-portal/GHbyw8ZfpqJMDAGAyCB9DAZYm5Bj`. These checks confirm the existing Git-to-Vercel connection; the new release's deployment must still be observed after the actual 11:30 push.

At 11:30 Asia/Shanghai on 2026-10-14, publish the article directory (13 locale files, Chinese and English PNGs, English SVG, rendering script, and brand SVG) and this preparation record through the existing `prod` branch / Vercel workflow. Preserve unrelated working-tree files, including `.zcode/`. Do not push this article before the scheduled time.

After pushing, verify the production deployment and the Chinese and English article pages, image, home/news links, and remaining locale routes. Update this record with the actual publication commit, time, and observed live verification results. If deployment fails or requires user action, report that outcome instead of claiming publication.

## Publication completed

- Release commit: `00feb2a08b92dfbe990730d67583178d3a129eb1` (`Publish Genesis WASM Render news in 13 locales`).
- The scheduled run began at 11:30. Final staged-file checks found trailing whitespace in the generated SVG and an extra blank line at the end of the rendering script. These were cleaned without altering the image or article content. The push to `origin/prod` completed at approximately **11:31:58 Asia/Shanghai** on 2026-10-14.
- Vercel reports `success` for this release commit: [production deployment](https://vercel.com/zaberlabs-projects/evox-portal/AXEzznj5pX1xqKHtDUFwRXxRRbQo).
- Live verification completed at **11:34:12 Asia/Shanghai**: all 13 article routes returned HTTP 200, displayed the latest title, date, explicit WebGL2.0 100% result, and four intended bold spans. Both localized image assets returned HTTP 200. Simplified and Traditional Chinese use the Chinese figure; the other 11 locales use the English figure. Each locale's home page and news listing link to the new article.
- Public pages: [Simplified Chinese](https://www.evox.group/zh-cn/news/genesis-wasm-render), [English](https://www.evox.group/news/genesis-wasm-render).
- The release contains only the article directory and this publication record. Unrelated `.zcode/` files were left untouched and uncommitted.
