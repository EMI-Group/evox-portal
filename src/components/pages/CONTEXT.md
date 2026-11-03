# src/components/pages/

## Intent
Shared landing-page bodies for the English and localized route trees. Each accepts `locale?: Locale`, defaults to English, and loads translations. Thin route files render HomeContent at `/`, RuntimeContent at `/runtime`, and EcosystemContent at `/libs`, with locale-prefixed equivalents.

## API Surface
- **HomeContent.astro** — Uses `<Layout fullBleed>` with shared Header and Footer. The homepage opens directly with a compact centered text hero; the header is the only logo in the opening view. Latest updates follow immediately, then evolution, AI paradigms, hardware, and resources. Localized content comes from Astro collections, with UTC dates and translated summary fallbacks. Genesis links externally to `https://genesis.evox.group/`.
- **EcosystemContent.astro** — Standard Layout chrome, featured Genesis, libraries sorted with EvoX first, and Community at `#community`. QQ opens an accessible QR dialog; Discord links externally.
- **RuntimeContent.astro** — Standard Layout chrome, Runtime hero, Docs/GitHub links, and RuntimeExamples. Its legacy navy inline background is adapted by global theme styles.
- **RuntimeExamples.astro** — Three tabs (`examples.singleObj/multiObj/neuro`) pair Python code using the GitHub Dark theme with interactive examples. Scripts provide timed auto-advance, Plotly readiness guards and resize, lazy Brax readiness polling, and Arrow/Home/End keyboard navigation.

## Homepage Design and Interaction
- Typography: the complete hero headline tops out at 64px with consistent weight across both lines; section headings scale from 32px to 52px; primary descriptions use 16–18px; secondary labels use 12–14px. Shared navigation is 14px, with 15–16px mobile menu text. The global font stack explicitly includes Chinese system sans-serif families. The desktop header switches to its mobile menu below 1024px.
- The Showcase-inspired design uses shared theme tokens, monochrome surfaces, red accents, fine borders, a Canvas evolution loop, and domain-specific Canvas illustrations from `../ParadigmArt.astro`. Application cards use a stretched project link alongside independent animation buttons, avoiding nested interactive elements.
- The computing section uses `../ParallelDiagram.astro` as a three-stage pipeline: batched task graphs, EvoX tensorization, and tensor operations on heterogeneous hardware. A synchronized 12-second Canvas sequence morphs task nodes into grids, assembles tensor planes, dispatches fragments to hardware inputs, and fills computed results. Mobile stacks the same three stages vertically and routes flights around the headings. Static SVGs remain available without JavaScript and for reduced motion. Hardware logos follow the illustration; support scopes remain in tooltips and screen-reader text. Keep visible copy concise, without explanatory footnotes or citation links. Motion has a pause control, pauses offscreen, and respects reduced-motion preferences. All copy is localized in 13 languages.
- `../HomeIntro.astro` is mounted before the hero in all locales. It shows a centered wordmark on top-of-page visits; a click, downward wheel, upward swipe, or keyboard entry triggers a 1100ms smooth flight to the header. The curtain fades and existing hero content appears in a short stagger. Deep links and restored positions bypass it; no-JavaScript visits see the normal homepage directly.
- The content container is at most 1040px wide. The hero presents a unified centered headline followed by its description and actions. Chinese breaks at a phrase boundary between the two translated title strings; other languages use balanced wrapping. It uses content height rather than a viewport-height minimum. Latest updates are three equal cards, sorted newest first from the latest release and two latest news articles; cards stack on mobile.
- Application cards use two columns, then one on narrow screens. Hardware uses seven columns, four below 850px, and two below 600px. Resources place the heading and featured Genesis card on the left, with three supporting links on the right; mobile stacks both columns. The eyebrow reads Resources and the decorative X is removed.
- Native anchors target `#top` on the homepage wrapper, `#home` on the hero, then `#news`, `#evolution`, `#applications`, `#computing`, and `#explore`. The hero uses `data-chapter-id="top"`. The chapter rail follows this DOM order, appears at widths of at least 1280px, and tracks native scrolling.
- Optional reveals use IntersectionObserver. Initially visible content is never hidden; content stays readable without JavaScript or IntersectionObserver. Reduced-motion settings disable reveals. Scrolling is native after the opening completes; its temporary input guards are removed on completion.

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
- `../HomeIntro.astro` → Shared localized opening-overlay component.
- `../BrandWordmark.astro` → Supplied EVO vector letters combined with the animated X.
- `../EvolutionDiagram.astro` → Supplied Canvas evolution animation with localized steps/playback labels, pause, restart, stage selection, visibility suspension, and reduced-motion handling. `../ParadigmArt.astro` supplies the other homepage SVG visuals.
- `../../content/` → Localized news/releases, library data, and interactive examples.
- `../../i18n/` → UI translations and locale-aware collection helpers.
- `../../layouts/Layout.astro`, `../../styles/global.css` → Metadata, theme initialization, chrome, and tokens.
