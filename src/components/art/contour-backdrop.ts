import { strokeContours, traceContours } from "./contours";
import { AnimationLifetime } from "./animation-lifetime";

// Live topographic texture behind inner-page banners: a few Gaussian peaks drift
// along slow, incommensurate sine paths and breathe in height, so the contours
// never stop changing and never repeat a layout. No agents and no resets.
type Drift = { x: number; y: number; ax: number; ay: number; wx: number; wy: number; a: number; da: number; wa: number; s: number; phase: number };
const PEAKS: Drift[] = [
  { x: .18, y: .45, ax: .1, ay: .25, wx: .061, wy: .083, a: .95, da: .3, wa: .071, s: .16, phase: 0 },
  { x: .45, y: .7, ax: .12, ay: .2, wx: .047, wy: .067, a: .7, da: .25, wa: .089, s: .19, phase: 1.7 },
  { x: .72, y: .35, ax: .1, ay: .3, wx: .073, wy: .053, a: 1.05, da: .3, wa: .059, s: .15, phase: 3.1 },
  { x: .92, y: .8, ax: .06, ay: .2, wx: .057, wy: .079, a: .6, da: .2, wa: .097, s: .14, phase: 4.6 },
];
const LEVELS = Array.from({ length: 15 }, (_, i) => .1 + i * .1);
const FRAME_MS = 33;

class ContourBackdrop {
  lifetime = new AnimationLifetime();
  canvas = document.createElement("canvas"); ctx = this.canvas.getContext("2d")!;
  w = 0; h = 0; dpr = 1; cell = 16; cols = 0; rows = 0; grid = new Float32Array(0);
  time = Math.random() * 600; last = 0; drawn = 0; frame = 0; visible = false;
  xSamples = new Float32Array(0);
  ink: [number, number, number] = [0, 0, 0];
  reduced = matchMedia("(prefers-reduced-motion: reduce)");

  constructor(private root: HTMLElement) {
    root.append(this.canvas);
    this.readInk();
    const { lifetime } = this, { signal } = lifetime;
    lifetime.observe(new ResizeObserver(() => this.resize())).observe(root);
    lifetime.observe(new IntersectionObserver(([entry]) => { this.visible = entry.isIntersecting; this.schedule(); })).observe(root);
    lifetime.observe(new MutationObserver(() => { this.readInk(); this.draw(); })).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    document.addEventListener("visibilitychange", () => this.schedule(), { signal });
    this.reduced.addEventListener("change", () => { this.draw(); this.schedule(); }, { signal });
    lifetime.add(() => cancelAnimationFrame(this.frame));
  }

  readInk() {
    const hex = getComputedStyle(document.documentElement).getPropertyValue("--site-ink").trim().replace("#", "");
    const n = parseInt(hex.length === 3 ? [...hex].map((c) => c + c).join("") : hex, 16);
    this.ink = Number.isNaN(n) ? [128, 128, 128] : [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  resize() {
    const { width, height } = this.root.getBoundingClientRect();
    if (!width || !height) return;
    this.w = width; this.h = height; this.dpr = Math.min(devicePixelRatio || 1, 1.5);
    this.canvas.width = Math.round(width * this.dpr); this.canvas.height = Math.round(height * this.dpr);
    this.cell = width < 700 ? 14 : 16;
    this.cols = Math.ceil(width / this.cell) + 1; this.rows = Math.ceil(height / this.cell) + 1;
    this.grid = new Float32Array(this.cols * this.rows);
    this.xSamples = new Float32Array(this.cols);
    this.draw(); this.schedule();
  }

  schedule() {
    const run = this.visible && !document.hidden && !this.reduced.matches && this.w > 0;
    if (run && !this.frame) { this.last = performance.now(); this.frame = requestAnimationFrame(this.tick); }
    if (!run && this.frame) { cancelAnimationFrame(this.frame); this.frame = 0; }
  }

  tick = (now: number) => {
    this.time += Math.min(now - this.last, 100) / 1000; this.last = now;
    if (now - this.drawn >= FRAME_MS) { this.drawn = now; this.draw(); }
    this.frame = requestAnimationFrame(this.tick);
  };

  draw() {
    const { ctx, w, h, cols, rows, cell } = this;
    if (!w) return;
    const scale = Math.max(w, h * 2.4), t = this.time;
    const peaks = PEAKS.map((p) => ({
      x: (p.x + p.ax * Math.sin(t * p.wx + p.phase)) * w,
      y: (p.y + p.ay * Math.sin(t * p.wy + p.phase * 1.3)) * h,
      a: p.a + p.da * Math.sin(t * p.wa + p.phase * .7),
      s: p.s * scale,
    }));
    // A Gaussian is separable: evaluate exponentials per row/column, not per cell.
    this.grid.fill(0);
    for (const p of peaks) {
      for (let i = 0; i < cols; i++) {
        const dx = (i * cell - p.x) / p.s;
        this.xSamples[i] = Math.exp(-.5 * dx * dx);
      }
      for (let j = 0; j < rows; j++) {
        const dy = (j * cell - p.y) / p.s, amplitude = p.a * Math.exp(-.5 * dy * dy);
        for (let i = 0; i < cols; i++) this.grid[j * cols + i] += this.xSamples[i] * amplitude;
      }
    }
    ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    ctx.clearRect(0, 0, w, h);
    strokeContours(ctx, traceContours(this.grid, cols, rows, cell, LEVELS), this.ink, document.documentElement.dataset.theme === "dark", .75);
  }
}

export function mountContourBackdrops() {
  document.querySelectorAll<HTMLElement>(".page-hero-backdrop:not([data-contours])").forEach((root) => {
    root.dataset.contours = "";
    new ContourBackdrop(root);
  });
}
