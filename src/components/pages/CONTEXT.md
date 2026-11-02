# src/components/pages/

## Intent
Shared landing-page bodies for the English and localized route trees. Each accepts `locale?: Locale`, defaults to English, and loads translations. Thin route files render HomeContent at `/`, RuntimeContent at `/runtime`, and EcosystemContent at `/libs`, with locale-prefixed equivalents.

## API Surface
- **HomeContent.astro** — Uses `<Layout fullBleed>` with Layout's shared Header and Footer as siblings of main. `fullBleed` omits standard header padding so the homepage controls its spacing. The shared header brand stays on the left and supplies the measured opening-handoff destination. HomeIntro's one-shot full-viewport EVOX overlay sits above the normal content: EvoX hero and Docs/GitHub actions; localized, interactive 11-second evolutionary ring with five selectable stages; four AI paradigm cards; hardware support and two sourced measurements; resource links; latest release and two latest news articles. The opening, hero, and header use BrandWordmark's supplied vector EVO lettering and original animated X. Data comes from localized Astro collections, with UTC dates and translated summary fallbacks. Genesis links externally to `https://genesis.evox.group/`.
- **EcosystemContent.astro** — Standard Layout chrome, featured Genesis, libraries sorted with EvoX first, and Community at `#community`. QQ opens an accessible QR dialog; Discord links externally.
- **RuntimeContent.astro** — Standard Layout chrome, Runtime hero, Docs/GitHub links, and RuntimeExamples. Its legacy navy inline background is adapted by global theme styles.
- **RuntimeExamples.astro** — Three tabs (`examples.singleObj/multiObj/neuro`) pair Python code using the GitHub Dark theme with interactive examples. Scripts provide timed auto-advance, Plotly readiness guards and resize, lazy Brax readiness polling, and Arrow/Home/End keyboard navigation.

## Homepage Design and Interaction
- The Showcase-inspired design uses shared theme tokens, monochrome surfaces, red accents, fine borders, the Canvas 2D evolution-ring player in `../art/evolutionRing.js`, and SVG component `../ParadigmArt.astro`.
- `../HomeIntro.astro` shows the full BrandWordmark in a fixed opening overlay. One downward wheel gesture, click/tap, upward one-finger swipe, or PageDown/ArrowDown/Space/End press triggers a 1050ms native Web Animations transform of the actual logo into the upper-left header wordmark. The curtain fades away behind it. Source and destination are measured once, the target stays hidden until handoff, and scrollbar geometry remains stable. Completion hides the overlay permanently for the document, restores temporarily inert sections and chrome, and removes input guards. Escape and a 1.6-second safety timeout also release the transition. Keyboard entry focuses the hero title; reduced motion enters instantly. The overlay occupies no scrolling space, so the top after entry is the normal homepage.
- The content container is at most 1040px wide. Sections use 88–144px vertical padding. The desktop hero's vector wordmark is `min(68vw, 520px)` wide; at widths up to 1000px it is replaced by a left-aligned typographic headline with stacked actions and a labeled scroll cue. Statements scale from 27–44px, section headings from 37–64px, and descriptive copy is 18px. Up to 600px wide the statement is 28px and description 16px.
- Application cards use two columns, then one on narrow screens. Hardware uses seven columns, four below 850px, and two below 600px. Resources and news collapse to a single content column on mobile.
- Native anchors target `#top` on the homepage wrapper, `#home` on the hero, then `#evolution`, `#applications`, `#computing`, `#explore`, and `#news`. Returning to `#top` after entry never reopens the overlay. The hero uses `data-chapter-id="top"` for the rail's first branch. The corner chapter rail is visible after the opening only at viewport widths of at least 1280px; its active branch follows scroll position using a passive listener and requestAnimationFrame.
- Optional reveals use IntersectionObserver. Initially visible content is never hidden; content stays readable without JavaScript or IntersectionObserver. Reduced-motion settings show content without reveal motion. After the one-shot logo handoff, scrolling is native. Initial deep links, nonzero restored scroll positions, and browser page restoration skip entry. There is no content-height collapse or persistent input lock. Without JavaScript, the opening remains in flow with a normal `#home` cue and visible navigation.

## Constraints
- Use translated UI copy and locale-aware internal URLs without trailing slashes. Preserve hardware-support qualifications; Ascend and Vulkan labels describe different validated scopes.
- External new-tab links require `rel="noopener noreferrer"`.
- HomeContent owns scoped styles and uses `--site-*` tokens directly. Other landing pages receive adaptations under `.site-main-padded`; test both themes after changing utilities.
- Keep the fixed Header visible immediately on other routes. HomeIntro owns the homepage opening's Header and chapter-rail visibility; Header's legacy `animated` prop does not control it.

## Known Issues and Dependencies
- RuntimeContent's product-name H1 is an intentional literal; its GitHub link reuses `genesis.hero.github`.
- Plotly and Brax depend on browser/network capabilities. Preserve readiness guards and polling timeouts; the carousel may skip unavailable panels. Runtime animations are independent of homepage reveals.
- The QQ modal lives in EcosystemContent, not on the homepage.

## Verification
Run `pnpm build`, then inspect desktop/mobile homepages in both themes, anchors, the chapter rail at 1280px and above, reduced-motion behavior, translated content, and linked articles. Check flight alignment, repeated wheel input, keyboard focus, normal scrolling after entry, and returning to `#top` without replay. Check standard content pages for paired background/text colors and hover contrast. The redesign build generated 729 pages; the `ui` review branch does not change production without a separate merge/deployment.

## Routing Table
- `../../pages/` and `../../pages/[locale]/` → Thin routes; their documentation lives in `../../../docs/agent-context/`.
- `../HomeIntro.astro` → One-shot full-viewport overlay and native flying-logo handoff.
- `../BrandWordmark.astro` → Supplied EVO vector letters combined with the animated X.
- `../EvolutionDiagram.astro`, `../ParadigmArt.astro` → Homepage SVG visuals.
- `../../content/` → Localized news/releases, library data, and interactive examples.
- `../../i18n/` → UI translations and locale-aware collection helpers.
- `../../layouts/Layout.astro`, `../../styles/global.css` → Metadata, theme initialization, chrome, and tokens.
