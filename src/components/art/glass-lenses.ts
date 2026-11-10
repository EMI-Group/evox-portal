import type { AnimationLifetime } from "./animation-lifetime";
import { REGULAR_BEZEL_RATIO, UNPACK_COORDINATES, createGlassTiles, glassMapUrl, type GlassTiles } from "./glass-optics";

const SVG_NS = "http://www.w3.org/2000/svg";
const set = <T extends Element>(el: T, attrs: Record<string, string | number>) => {
  for (const [key, value] of Object.entries(attrs)) {
    const next = String(value);
    if (el.getAttribute(key) !== next) el.setAttribute(key, next);
  }
  return el;
};
const primitive = <K extends keyof SVGElementTagNameMap>(name: K, attrs: Record<string, string | number>) => set(document.createElementNS(SVG_NS, name), attrs);

// Keep direct handles to mutable nodes: resizing must not query the SVG tree.
function createFilter(id: string, blur: string) {
  const filter = primitive("filter", { id, filterUnits: "userSpaceOnUse", primitiveUnits: "userSpaceOnUse", x: 0, y: 0, "color-interpolation-filters": "sRGB" });
  const field = primitive("feImage", { x: 0, y: 0, preserveAspectRatio: "none", result: "coordinates" });
  const mask = primitive("feImage", { x: 0, y: 0, preserveAspectRatio: "none", result: "rim" });
  const frost = primitive("feGaussianBlur", { in: "SourceGraphic", stdDeviation: blur, edgeMode: "duplicate", result: "frost" });
  const displacement = primitive("feDisplacementMap", { in: "SourceGraphic", in2: "map", scale: 0, xChannelSelector: "R", yChannelSelector: "G", result: "bent" });
  const merge = primitive("feMerge", {});
  merge.append(primitive("feMergeNode", { in: "frost" }), primitive("feMergeNode", { in: "edge" }));
  filter.append(
    field, mask, frost,
    // Decode directly before displacement. Intermediate colour operations can
    // let display-profile conversion mix the coordinate channels.
    primitive("feColorMatrix", { in: "coordinates", type: "matrix", values: UNPACK_COORDINATES, result: "map" }),
    displacement,
    primitive("feGaussianBlur", { in: "bent", stdDeviation: .65, edgeMode: "duplicate", result: "lens" }),
    primitive("feComposite", { in: "lens", in2: "rim", operator: "in", result: "edge" }),
    merge,
  );
  return { filter, field, mask, frost, displacement };
}

type TileAsset = { key: string; urls: GlassTiles; refs: number };
type MapAsset = { key: string; field: string; mask: string; refs: number; source: TileAsset };
type Lens = ReturnType<typeof createFilter> & { key: string; refs: number; map?: MapAsset };
type Surface = { root: HTMLElement; visible: boolean; lens?: Lens };
type Measurement = { surface: Surface; width: number; height: number; radius: number; radiusCss: string; extentCss: string; sourceRadius: number; sourceBezel: number; frost: string; strength: number; key: string };

// Share equal geometries and retain only referenced filters and map templates.
// Responsive source images resize their tiles without replacing an image URL.
export function mountGlassLenses(lifetime: AnimationLifetime) {
  const definitions = document.querySelector(".lens-defs");
  if (!definitions || !("lens" in document.documentElement.dataset) || lifetime.signal.aborted) return;
  const pointer = matchMedia("(hover: hover) and (pointer: fine)");
  const transparency = matchMedia("(prefers-reduced-transparency: reduce)");
  const surfaces: Surface[] = [...document.querySelectorAll<HTMLElement>(".glass")].map(root => ({ root, visible: false }));
  const lookup = new Map(surfaces.map(surface => [surface.root, surface]));
  const lenses = new Map<string, Lens>();
  const maps = new Map<string, MapAsset>();
  const pending = new Set<Surface>();
  const tiles = new Map<string, TileAsset>();
  let frame = 0, sequence = 0;
  const releaseMap = (map: MapAsset) => {
    if (--map.refs === 0) {
      maps.delete(map.key);
      if (--map.source.refs === 0) tiles.delete(map.source.key);
    }
  };
  const release = (lens: Lens) => {
    if (--lens.refs === 0) {
      lens.filter.remove(); lenses.delete(lens.key);
      if (lens.map) releaseMap(lens.map);
    }
  };
  const detach = (surface: Surface) => {
    if (!surface.lens) return;
    release(surface.lens);
    surface.lens = undefined;
    delete surface.root.dataset.lensId;
    surface.root.style.removeProperty("--lg-lens-url");
  };
  const acquireMap = ({ radiusCss, extentCss, sourceRadius, sourceBezel }: Measurement) => {
    const sourceKey = `${sourceRadius.toFixed(4)}:${sourceBezel.toFixed(4)}`;
    const key = `${radiusCss}:${extentCss}:${sourceKey}`;
    let map = maps.get(key);
    if (!map) {
      let source = tiles.get(sourceKey);
      if (!source) {
        source = { key: sourceKey, urls: createGlassTiles(sourceRadius, sourceBezel), refs: 0 };
        tiles.set(sourceKey, source);
      }
      source.refs++;
      map = { key, field: glassMapUrl(radiusCss, extentCss, source.urls.field), mask: glassMapUrl(radiusCss, extentCss, source.urls.mask, true), refs: 0, source };
      maps.set(key, map);
    }
    map.refs++;
    return map;
  };
  const apply = (measurement: Measurement) => {
    const { surface, width, height, radius, frost, strength, key } = measurement;
    if (surface.lens?.key === key) return;
    let lens = lenses.get(key);
    if (!lens) {
      if (surface.lens?.refs === 1) {
        // Reuse the filter node while a unique surface changes size.
        lens = surface.lens; lenses.delete(lens.key); lens.key = key;
      } else {
        lens = { ...createFilter(`liquid-lens-${sequence++}`, frost), key, refs: 0 };
        definitions.append(lens.filter);
      }
      set(lens.filter, { width, height });
      for (const image of [lens.field, lens.mask]) set(image, { width, height });
      const previousMap = lens.map;
      const map = acquireMap(measurement);
      if (previousMap) releaseMap(previousMap);
      lens.map = map;
      if (previousMap !== map) {
        set(lens.field, { href: map.field });
        set(lens.mask, { href: map.mask });
      }
      // Width and strength are independent material settings. Changing the
      // strength updates only this scalar, without rebuilding either map.
      const amplitude = REGULAR_BEZEL_RATIO * radius;
      set(lens.displacement, { scale: Math.min(24, 2 * amplitude) * strength });
      set(lens.frost, { stdDeviation: frost });
      lenses.set(key, lens);
    }
    if (lens !== surface.lens) {
      if (surface.lens) release(surface.lens);
      lens.refs++; surface.lens = lens;
      surface.root.dataset.lensId = lens.filter.id;
      surface.root.style.setProperty("--lg-lens-url", `url(#${lens.filter.id})`);
    }
  };
  const flush = () => {
    frame = 0;
    if (!pointer.matches || transparency.matches) {
      surfaces.forEach(detach); pending.clear(); return;
    }
    // Complete every layout read before changing filter nodes or element styles.
    const measured: Measurement[] = [];
    const detached: Surface[] = [];
    for (const surface of pending) {
      if (surface.root.dataset.glass === "frosted") { detached.push(surface); continue; }
      if (!surface.visible && !surface.lens) continue;
      const rect = surface.root.getBoundingClientRect();
      if (rect.width < 8 || rect.height < 8) continue;
      const width = Math.round(rect.width), height = Math.round(rect.height * 4) / 4;
      const style = getComputedStyle(surface.root);
      const declaredRadius = parseFloat(style.borderTopLeftRadius) || 0;
      const radius = Math.min(declaredRadius, width / 2, height / 2);
      let radiusCss = `${declaredRadius}px`;
      if (surface.root.hasAttribute("data-lens-morph")) {
        // The inset and radius share the same CSS easing. In image-viewport
        // units the corner can follow that curve without another image decode.
        const expanded = parseFloat(style.getPropertyValue("--header-height"));
        const inset = parseFloat(style.getPropertyValue("--header-inset"));
        const rounded = parseFloat(style.getPropertyValue("--header-radius"));
        if (expanded > 0 && inset > 0 && rounded > 0) {
          const slope = rounded / (2 * inset);
          radiusCss = `clamp(0px, calc(${expanded * slope}px - ${100 * slope}vh), ${rounded}px)`;
        }
      }
      const frost = String(Math.max(0, parseFloat(style.getPropertyValue("--lg-blur")) || 0));
      const edgeWidth = Math.max(0, parseFloat(style.getPropertyValue("--lg-edge-width")) || 0);
      const bezel = Math.min(edgeWidth, width / 2, height / 2);
      const slice = Math.max(radius, bezel);
      const sourceRadius = bezel > 0 && slice > 0 ? radius / slice : 1;
      const sourceBezel = bezel > 0 && slice > 0 ? bezel / slice : REGULAR_BEZEL_RATIO;
      const extentCss = `${edgeWidth}px`;
      const requestedStrength = parseFloat(style.getPropertyValue("--lg-edge-strength"));
      const strength = Number.isFinite(requestedStrength) ? Math.min(3, Math.max(0, requestedStrength)) : 1;
      const key = `${width}x${height}x${radius}x${frost}x${radiusCss}x${extentCss}x${strength}`;
      measured.push({ surface, width, height, radius, radiusCss, extentCss, sourceRadius, sourceBezel, frost, strength, key });
    }
    pending.clear(); detached.forEach(detach); measured.forEach(apply);
  };
  const schedule = (surface: Surface) => {
    if (lifetime.signal.aborted) return;
    pending.add(surface);
    frame ||= requestAnimationFrame(flush);
  };
  const resize = lifetime.observe(new ResizeObserver(entries => {
    entries.forEach(entry => schedule(lookup.get(entry.target as HTMLElement)!));
  }));
  const intersection = lifetime.observe(new IntersectionObserver(entries => {
    for (const entry of entries) {
      const surface = lookup.get(entry.target as HTMLElement)!;
      surface.visible = entry.isIntersecting;
      if (surface.visible) schedule(surface);
    }
  }));
  surfaces.forEach(surface => { resize.observe(surface.root); intersection.observe(surface.root); });
  const sync = () => surfaces.forEach(schedule);
  // A preset or theme can change optical properties without resizing a box.
  const presets = lifetime.observe(new MutationObserver(entries => {
    for (const entry of entries) {
      const surface = lookup.get(entry.target as HTMLElement);
      if (surface) schedule(surface);
      else sync();
    }
  }));
  presets.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  surfaces.forEach(surface => presets.observe(surface.root, { attributes: true, attributeFilter: ["data-glass"] }));
  pointer.addEventListener("change", sync, { signal: lifetime.signal });
  transparency.addEventListener("change", sync, { signal: lifetime.signal });
  if (import.meta.hot) {
    import.meta.hot.on("vite:afterUpdate", sync);
    lifetime.add(() => import.meta.hot?.off("vite:afterUpdate", sync));
  }
  lifetime.add(() => { cancelAnimationFrame(frame); pending.clear(); surfaces.forEach(detach); lenses.clear(); maps.clear(); tiles.clear(); });
}
