import { createGenesisTree, type TreeNode } from "./genesisTree.ts";
import { AGENTIC_DURATION, AGENTIC_EVENT_TIMES, getAgenticFrame, type AgenticFrame, type AgenticSignalFrame } from "./agenticLifecycle.ts";

// Motion mechanics adapted from Genesis EvolutionGraph / the author's Showcase
// port: event-driven reconciliation, native path motion and CSS state effects.
// See genesisTree.ts and genesis-tree.LICENSE.txt for source attribution.
const SVG_NS = "http://www.w3.org/2000/svg";
const tree = createGenesisTree("evox");
const geometry = new Map(tree.nodes.map(node => [node.id, node]));
const paths = new Map(tree.edges.map(edge => [edge.id, edge.d]));
const svgElement = <K extends keyof SVGElementTagNameMap>(name: K) => document.createElementNS(SVG_NS, name);
const setAttribute = (element: Element, name: string, value: string) => {
  if (element.getAttribute(name) !== value) element.setAttribute(name, value);
};

class AgenticTreeElement extends HTMLElement {
  private ready = false;
  private inView = false;
  private elapsed = 0;
  private startedAt: number | null = null;
  private timer: number | null = null;
  private cycle = -1;
  private observer: IntersectionObserver | null = null;
  private preference: MediaQueryList | null = null;
  private svg: SVGSVGElement | null = null;
  private staticViewport: SVGGElement | null = null;
  private liveViewport: SVGGElement | null = null;
  private edgesLayer: SVGGElement | null = null;
  private signalsLayer: SVGGElement | null = null;
  private nodesLayer: SVGGElement | null = null;
  private nodes = new Map<string, SVGGElement>();
  private edges = new Map<string, SVGPathElement>();
  private signals = new Map<string, SVGGElement>();
  private pausedAnimations: Animation[] = [];

  connectedCallback() {
    if (this.ready) return;
    const svg = this.querySelector<SVGSVGElement>("svg");
    const viewport = svg?.querySelector<SVGGElement>(".tree-viewport");
    if (!svg || !viewport) return;
    this.svg = svg;
    this.staticViewport = viewport.cloneNode(true) as SVGGElement;
    this.preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    this.preference.addEventListener("change", this.onPreferenceChange);
    document.addEventListener("visibilitychange", this.onVisibilityChange);
    this.ready = true;
    if ("IntersectionObserver" in window) {
      this.observer = new IntersectionObserver(entries => {
        this.inView = entries.some(entry => entry.isIntersecting);
        this.updatePlayback();
      }, { threshold: 0 });
      this.observer.observe(this);
    } else {
      this.inView = true;
      this.updatePlayback();
    }
  }

  disconnectedCallback() {
    this.stop();
    this.observer?.disconnect();
    this.observer = null;
    this.preference?.removeEventListener("change", this.onPreferenceChange);
    document.removeEventListener("visibilitychange", this.onVisibilityChange);
    this.restoreStatic();
    this.preference = null;
    this.ready = false;
    this.inView = false;
  }

  private onPreferenceChange = () => this.updatePlayback();
  private onVisibilityChange = () => this.updatePlayback();

  private updatePlayback() {
    if (!this.isConnected || !this.ready) return;
    if (this.preference?.matches) {
      this.stop();
      this.restoreStatic();
      return;
    }
    if (!this.inView || document.hidden) { this.stop(); return; }
    try {
      if (!this.liveViewport) this.createLiveTree();
      if (this.liveViewport && this.startedAt === null) {
        this.dataset.playback = "running";
        this.svg?.unpauseAnimations();
        for (const animation of this.pausedAnimations) {
          if (animation.playState === "paused") animation.play();
        }
        this.pausedAnimations = [];
        this.startedAt = performance.now();
        this.renderFrame(getAgenticFrame(this.elapsed));
        this.scheduleNext();
      }
    } catch {
      // Keep the complete server-rendered diagram if enhancement cannot start.
      this.stop();
      this.restoreStatic();
    }
  }

  private stop() {
    if (this.timer !== null) window.clearTimeout(this.timer);
    this.timer = null;
    if (this.startedAt !== null) {
      this.elapsed += Math.max(0, performance.now() - this.startedAt);
      this.startedAt = null;
      // Pause transitions as well as keyframes; animation-play-state alone does
      // not freeze an in-flight stroke, fill or parked-opacity transition.
      this.pausedAnimations = this.getAnimations({ subtree: true })
        .filter(animation => animation.playState === "running" || animation.pending);
      for (const animation of this.pausedAnimations) animation.pause();
    }
    this.dataset.playback = "paused";
    this.svg?.pauseAnimations();
  }

  private scheduleNext() {
    const time = this.elapsed % AGENTIC_DURATION;
    const next = AGENTIC_EVENT_TIMES.find(event => event > time) ?? AGENTIC_DURATION;
    const workTime = this.startedAt === null ? 0 : performance.now() - this.startedAt;
    this.timer = window.setTimeout(this.advance, Math.max(1, next - time - workTime));
  }

  private advance = () => {
    this.timer = null;
    if (!this.isConnected || !this.inView || document.hidden || this.preference?.matches) {
      this.updatePlayback();
      return;
    }
    if (this.startedAt === null) return;
    const now = performance.now();
    this.elapsed += Math.max(0, now - this.startedAt);
    this.startedAt = now;
    try {
      this.renderFrame(getAgenticFrame(this.elapsed));
      this.scheduleNext();
    } catch {
      this.stop();
      this.restoreStatic();
    }
  };

  private createLiveTree() {
    if (!this.svg) return;
    const viewport = svgElement("g");
    viewport.setAttribute("class", "tree-viewport");
    viewport.setAttribute("transform", tree.transform);
    const makeLayer = (name: string) => {
      const layer = svgElement("g");
      layer.setAttribute("class", name);
      viewport.appendChild(layer);
      return layer;
    };
    this.edgesLayer = makeLayer("evo-edges");
    this.signalsLayer = makeLayer("evo-signals");
    this.nodesLayer = makeLayer("evo-nodes");
    this.liveViewport = viewport;
    this.elapsed = 0;
    this.cycle = -1;
    // Attach before measuring newly created paths or starting SVG motion.
    this.svg.querySelector(".tree-viewport")?.replaceWith(viewport);
    this.dataset.mode = "live";
    this.dataset.playback = "running";
    this.renderFrame(getAgenticFrame(0));
  }

  private clearLayers() {
    this.edgesLayer?.replaceChildren();
    this.signalsLayer?.replaceChildren();
    this.nodesLayer?.replaceChildren();
    this.nodes.clear();
    this.edges.clear();
    this.signals.clear();
  }

  private restoreStatic() {
    if (this.liveViewport && this.staticViewport) {
      this.liveViewport.replaceWith(this.staticViewport.cloneNode(true));
    }
    this.liveViewport = null;
    this.edgesLayer = null;
    this.signalsLayer = null;
    this.nodesLayer = null;
    this.clearLayers();
    this.pausedAnimations = [];
    this.elapsed = 0;
    this.cycle = -1;
    this.dataset.mode = "static";
    this.dataset.phase = "static";
    delete this.dataset.elapsed;
    delete this.dataset.cycle;
  }

  private createNode(node: TreeNode, age: number): SVGGElement {
    const group = svgElement("g");
    group.dataset.nodeId = node.id;
    group.dataset.depth = String(node.depth);
    group.setAttribute("transform", `translate(${node.tx} ${node.ty})`);
    group.style.setProperty("--node-age", `${-age}ms`);
    const entrance = svgElement("g");
    entrance.setAttribute("class", "node-enter");
    const halo = svgElement("circle");
    halo.setAttribute("class", "halo");
    halo.setAttribute("r", String(node.r + 5));
    const pulse = svgElement("circle");
    pulse.setAttribute("class", "pulse");
    pulse.setAttribute("r", String(node.r));
    const reveal = svgElement("g");
    reveal.setAttribute("class", "ring-reveal");
    const ring = svgElement("circle");
    ring.setAttribute("class", "ring");
    ring.setAttribute("r", String(node.r));
    ring.setAttribute("pathLength", "100");
    reveal.appendChild(ring);
    const dot = svgElement("circle");
    dot.setAttribute("class", "dot");
    dot.setAttribute("r", String(Number((node.r * .3).toFixed(1))));
    entrance.append(halo, pulse, reveal, dot);
    group.appendChild(entrance);
    this.nodesLayer?.appendChild(group);
    this.nodes.set(node.id, group);
    return group;
  }

  private createSignal(signal: AgenticSignalFrame, elapsed: number) {
    const child = geometry.get(signal.edgeId);
    const parent = child?.parent_id ? geometry.get(child.parent_id) : null;
    if (!child || !parent || !this.signalsLayer) return;
    let d = paths.get(signal.edgeId)!;
    if (signal.direction === "return") {
      // Genesis convergeSpark: reverse the cubic itself so rotate=auto follows
      // the return direction without JS tangent sampling or extra rotations.
      const x1 = child.tx - child.r, x2 = parent.tx + parent.r, mx = (x1 + x2) / 2;
      d = `M ${x1} ${child.ty} C ${mx} ${child.ty}, ${mx} ${parent.ty}, ${x2} ${parent.ty}`;
    }
    const arrow = svgElement("g");
    arrow.setAttribute("class", "message-signal");
    arrow.dataset.signalId = signal.id;
    arrow.dataset.direction = signal.direction;
    arrow.dataset.edgeId = signal.edgeId;
    const age = Math.max(0, elapsed - signal.startsAt);
    arrow.style.setProperty("--signal-duration", `${signal.endsAt - signal.startsAt}ms`);
    arrow.style.setProperty("--signal-age", `${-age}ms`);
    const body = svgElement("g");
    body.setAttribute("class", "signal-body");
    const head = svgElement("path");
    head.setAttribute("d", "M-4 -3L3 0L-4 3Z");
    const tail = svgElement("path");
    tail.setAttribute("d", "M-9 0H-3");
    tail.setAttribute("class", "signal-tail");
    body.append(tail, head);
    const motion = svgElement("animateMotion");
    motion.setAttribute("path", d);
    motion.setAttribute("dur", `${signal.endsAt - signal.startsAt}ms`);
    motion.setAttribute("begin", "indefinite");
    motion.setAttribute("rotate", "auto");
    motion.setAttribute("calcMode", "paced");
    motion.setAttribute("fill", "freeze");
    arrow.append(body, motion);
    this.signalsLayer.appendChild(arrow);
    this.signals.set(signal.id, arrow);
    // Dynamic SMIL defaults to the SVG document's time zero. Explicitly begin
    // now, offset by scheduler lateness, so every loop starts visible motion.
    motion.beginElementAt(-age / 1000);
  }

  private renderFrame(frame: AgenticFrame) {
    if (!this.liveViewport || !this.edgesLayer || !this.nodesLayer || !this.signalsLayer) return;
    const cycle = Math.floor(this.elapsed / AGENTIC_DURATION);
    if (this.cycle !== cycle) {
      this.clearLayers();
      this.cycle = cycle;
      this.liveViewport.style.setProperty("--cycle-age", `${-frame.elapsed}ms`);
    }
    const enteringReset = frame.phase === "reset" && this.dataset.phase !== "reset";
    this.dataset.cycle = String(cycle);
    this.dataset.phase = frame.phase;
    this.dataset.elapsed = frame.elapsed.toFixed(1);
    setAttribute(this.liveViewport, "class", `tree-viewport ${frame.phase === "reset" ? "cycle-exit" : "cycle-enter"}`);
    if (enteringReset) this.liveViewport.style.setProperty("--exit-age", `${-(frame.elapsed - 12200)}ms`);
    const wantedSignals = new Set(frame.signals.map(signal => signal.id));
    this.signals.forEach((element, id) => {
      if (!wantedSignals.has(id)) { element.remove(); this.signals.delete(id); }
    });
    const returning = new Set(frame.signals.filter(signal => signal.direction === "return").map(signal => signal.edgeId));

    for (const edge of frame.edges) {
      let path = this.edges.get(edge.id);
      if (!path) {
        const d = paths.get(edge.id);
        if (!d) continue;
        path = svgElement("path");
        path.setAttribute("d", d);
        path.dataset.edgeId = edge.id;
        path.dataset.parentId = edge.parentId;
        this.edgesLayer.appendChild(path);
        // One measurement when the path is created; never read path geometry
        // during playback. Native CSS draws the full, physical dash length.
        path.style.setProperty("--edge-length", String(path.getTotalLength()));
        path.style.setProperty("--growth-duration", `${edge.endsAt - edge.startsAt}ms`);
        path.style.setProperty("--growth-age", `${-Math.max(0, frame.elapsed - edge.startsAt)}ms`);
        this.edges.set(edge.id, path);
      }
      setAttribute(path, "class", `edge st-${edge.state}${edge.parked ? " parked" : ""}${edge.growth < 1 ? " growing" : ""}${returning.has(edge.id) ? " converge" : ""}`);
      setAttribute(path, "data-state", edge.state);
    }

    for (const node of frame.nodes) {
      const definition = geometry.get(node.id);
      if (!definition) continue;
      const group = this.nodes.get(node.id) ?? this.createNode(definition, Math.max(0, frame.elapsed - node.bornAt));
      setAttribute(group, "class", `node ${node.state}${node.depth === 0 ? " root" : ""}${node.parked ? " parked" : ""}`);
      setAttribute(group, "data-state", node.state);
      setAttribute(group, "data-parked", String(node.parked));
    }
    for (const signal of frame.signals) {
      if (!this.signals.has(signal.id)) this.createSignal(signal, frame.elapsed);
    }
  }
}

if (!customElements.get("agentic-tree")) customElements.define("agentic-tree", AgenticTreeElement);
