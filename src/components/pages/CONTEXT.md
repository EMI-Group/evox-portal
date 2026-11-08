# src/components/pages/

## Intent
Shared landing-page bodies for the English and localized route trees. Each accepts `locale?: Locale`, defaults to English, and loads translations. Thin route files render HomeContent at `/`, RuntimeContent at `/runtime`, and EcosystemContent at `/libs`, with locale-prefixed equivalents.

## API Surface
- **HomeContent.astro** — Uses `<Layout fullBleed>` with shared Header and Footer. The homepage opens directly with a compact centered text hero; the header is the only logo in the opening view. Latest updates follow immediately, then evolution, AI paradigms, hardware, and resources. Localized content comes from Astro collections, with UTC dates and translated summary fallbacks. Genesis links externally to `https://genesis.evox.group/`.
- **EcosystemContent.astro** — Standard Layout chrome, featured Genesis, libraries sorted with EvoX first, and Community at `#community`. QQ opens an accessible QR dialog; Discord links externally.
- **RuntimeContent.astro** — Standard Layout chrome, Runtime hero, Docs/GitHub links, and RuntimeExamples. Its legacy navy inline background is adapted by global theme styles.
- **RuntimeExamples.astro** — Three tabs (`examples.singleObj/multiObj/neuro`) pair Python code using GitHub Light/Dark themes with interactive examples. Scripts provide timed auto-advance, Plotly readiness guards and resize, lazy Brax readiness polling, and Arrow/Home/End keyboard navigation.

## Homepage Design and Interaction
- Typography: the complete hero headline tops out at 64px with consistent weight across both lines; section headings scale from 32px to 52px; primary descriptions use 16–18px; secondary labels use 12–14px. Shared navigation is 14px, with 15–16px mobile menu text. The global font stack explicitly includes Chinese system sans-serif families. The desktop header switches to its mobile menu below 1024px.
- The Showcase-inspired design uses shared theme tokens, monochrome surfaces, red accents, fine borders, a Canvas evolution loop, and domain-specific Canvas illustrations from `../ParadigmArt.astro`. Application cards use a stretched project link alongside independent animation buttons, avoiding nested interactive elements.
- The computing section uses `../ParallelDiagram.astro` as a three-stage pipeline: batched task graphs, EvoX tensorization, and tensor operations on heterogeneous hardware. A synchronized 12-second Canvas sequence morphs task nodes into grids, assembles tensor planes, dispatches fragments to hardware inputs, and fills computed results. Mobile stacks the same three stages vertically and routes flights around the headings. Static SVGs remain available without JavaScript and for reduced motion. Hardware logos follow the illustration without visible captions or tooltips; names and support scopes remain in screen-reader text. Keep visible copy concise, without explanatory footnotes or citation links. Motion has a pause control, pauses offscreen, and respects reduced-motion preferences. All copy is localized in 13 languages.
- All locales open directly on the text hero with the header visible. There is no opening overlay or logo flight.
- The content container is at most 1040px wide. The hero presents a unified centered headline followed by its description and actions. Chinese breaks at a phrase boundary between the two translated title strings; other languages use balanced wrapping. It uses content height rather than a viewport-height minimum. Latest updates are three equal cards, sorted newest first from the latest release and two latest news articles; cards stack on mobile.
- Application cards use two columns, then one on narrow screens. Hardware uses seven columns, four below 850px, and two below 600px. Resources place the heading and featured Genesis card on the left, with three supporting links on the right; mobile stacks both columns. The eyebrow reads Resources and the decorative X is removed.
- Native anchors target `#top` on the homepage wrapper, `#home` on the hero, then `#news`, `#evolution`, `#applications`, `#computing`, and `#explore`. The hero uses `data-chapter-id="top"`. The chapter rail follows this DOM order, appears at widths of at least 1280px, and tracks native scrolling.
- Optional reveals use IntersectionObserver. Initially visible content is never hidden; content stays readable without JavaScript or IntersectionObserver. Reduced-motion settings disable reveals. Scrolling is always native.

## Constraints
- Use translated UI copy and locale-aware internal URLs without trailing slashes. Preserve hardware-support qualifications; Ascend and Vulkan labels describe different validated scopes.
- External new-tab links require `rel="noopener noreferrer"`.
- HomeContent owns scoped styles and uses `--site-*` tokens directly. Other landing pages receive adaptations under `.site-main-padded`; test both themes after changing utilities.
- Keep the fixed Header visible immediately on all routes. Header's legacy `animated` prop does not control visibility.

## Known Issues and Dependencies
- RuntimeContent's product-name H1 is an intentional literal; its GitHub link reuses `genesis.hero.github`.
- Plotly and Brax depend on browser/network capabilities. Preserve readiness guards and polling timeouts; the carousel may skip unavailable panels. Runtime animations are independent of homepage reveals. `content/examples/plot-theme.ts` adapts Plotly surfaces, labels and controls without resetting frames. The Brax data-URL iframe receives validated theme messages from its parent and adapts its scene, fog, controls and fallback.
- The QQ modal lives in EcosystemContent, not on the homepage.

## Verification
Run `pnpm build`, then inspect desktop/mobile homepages in both themes, anchors, the chapter rail at 1280px and above, reduced-motion behavior, translated content, and linked articles. Check that the hero and header appear immediately and that scrolling and `#top` work normally. Check standard content pages for paired background/text colors and hover contrast. The redesign build generated 729 pages; the `ui` review branch does not change production without a separate merge/deployment.

## Routing Table
- `../../pages/` and `../../pages/[locale]/` → Thin routes; their documentation lives in `../../../docs/agent-context/`.
- `../BrandWordmark.astro` → Supplied EVO vector letters combined with the animated X.
- `../EvolutionDiagram.astro` → Supplied Canvas evolution animation with localized steps/playback labels, pause, restart, stage selection, visibility suspension, and reduced-motion handling. `../ParadigmArt.astro` supplies the other homepage SVG visuals.
- `../../content/` → Localized news/releases, library data, and interactive examples.
- `../../i18n/` → UI translations and locale-aware collection helpers.
- `../../layouts/Layout.astro`, `../../styles/global.css` → Metadata, theme initialization, chrome, and tokens.
