/*
 * Genesis EvolutionGraph — deterministic, server-rendered card adaptation.
 *
 * Generator and cover layout reused from liangfang-wen/genesis-showcase:
 * commit 616262121528d2fa302cc137dda30ec050f6ed72
 * v6-copy2-corner-tree/projects-data.js: hash, rng, treeSpec
 * v6-copy2-corner-tree/evotree.js: layout, edgeD, fitBounds
 * https://github.com/liangfang-wen/genesis-showcase/commit/616262121528d2fa302cc137dda30ec050f6ed72
 *
 * Original EvolutionGraph hook and node geometry: EMI-Group/genesis PR #157,
 * commit 1428e7ced6c156386a2036592a6cc5b72ea7b5f9,
 * apps/evo_dash/assets/js/hooks/evolution_graph.js (AGPL-3.0).
 * https://github.com/EMI-Group/genesis/pull/157
 * See genesis-tree.LICENSE.txt for the upstream license.
 *
 * Adaptation: TypeScript types, English internal task names, fixed SVG bounds.
 * The seeded draw sequence, branching/status rules, tidy cover layout,
 * radii, edge construction, and fit equations are retained. The public hook
 * has a different live relaxation layout; this uses the author's cover port.
 * No LiveView lifecycle, browser interaction, or labels are shipped.
 * AgenticArt uses this fixed geometry as reserved layout slots. Its separate
 * lifecycle creates each level and assigns runtime states after messages arrive;
 * the seeded snapshot states do not determine the animated workflow.
 */

type Status = "waiting" | "completed" | "running" | "pending" | "blocked";

interface Task {
  id: string;
  parent_id: string | null;
  label: string;
  status: Status;
  depth: number;
  agent?: string;
}

export interface TreeNode extends Task {
  children: TreeNode[];
  r: number;
  tx: number;
  ty: number;
}

const DEPTH_GAP = 172;
const SIB_GAP = 58;
const R = 11;

function hash(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); }
  return h >>> 0;
}

function rng(seed: string) {
  let a = hash(seed);
  return () => {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Keep all 16 entries and their shuffle, including its original random draws.
const TASK_NAMES = ["core", "api", "tests", "docs", "interface", "build", "parse",
  "storage", "network", "cache", "benchmark", "release", "migration", "adapter", "validation", "scaffold"];

export function treeSpec(p: { id: string; scale?: "xl" }): Task[] {
  const rand = rng(p.id);
  const names = TASK_NAMES.slice();
  for (let i = names.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    const t = names[i]; names[i] = names[j]; names[j] = t;
  }
  let ni = 0;
  function name() { return names[ni++ % names.length]; }

  const xl = p.scale === "xl";
  const nodes: Task[] = [{ id: "r", parent_id: null, label: p.id, status: "waiting", depth: 0 }];
  const leaves: string[] = [];
  const fan1 = xl ? 3 + Math.floor(rand() * 2) : 2 + Math.floor(rand() * 2);
  for (let a = 0; a < fan1; a++) {
    const mid = "m" + a;
    nodes.push({ id: mid, parent_id: "r", label: name(), status: "completed", depth: 1 });
    const fan2 = xl ? 2 + Math.floor(rand() * 2) : 1 + Math.floor(rand() * 3);
    for (let b = 0; b < fan2; b++) {
      const lid = mid + "-" + b;
      nodes.push({ id: lid, parent_id: mid, label: name(), status: "completed", depth: 2 });
      leaves.push(lid);
    }
  }
  const byId: Record<string, Task> = {};
  nodes.forEach(n => { byId[n.id] = n; });

  const runAt = Math.floor(rand() * leaves.length);
  const runId = leaves[runAt];
  byId[runId].status = "running";
  byId[runId].agent = "Executor";
  byId[byId[runId].parent_id!].status = "waiting";
  const nPend = xl ? 2 : 1;
  for (let k = 0; k < nPend; k++) {
    const pendAt = (runAt + 1 + Math.floor(rand() * (leaves.length - 1))) % leaves.length;
    if (byId[leaves[pendAt]].status !== "completed") continue;
    byId[leaves[pendAt]].status = rand() < 0.35 ? "blocked" : "pending";
  }
  if (xl || rand() < 0.5) {
    nodes.push({ id: runId + "-0", parent_id: runId, label: name(), status: "completed", depth: 3 });
    nodes.push({ id: runId + "-1", parent_id: runId, label: name(), status: "pending", depth: 3 });
  }
  return nodes;
}

export function createGenesisTree(seed: string) {
  const nodes: TreeNode[] = treeSpec({ id: seed }).map(n => ({
    ...n, children: [], r: n.depth === 0 ? R * 1.2 : R, tx: 0, ty: 0,
  }));
  const byId = new Map(nodes.map(n => [n.id, n]));
  nodes.forEach(n => { if (n.parent_id) byId.get(n.parent_id)?.children.push(n); });
  const roots = nodes.filter(n => !n.parent_id || !byId.has(n.parent_id));

  // Direct port of Graph.prototype.layout from the submitted cover engine.
  let nextY = 0;
  function place(n: TreeNode, d: number) {
    n.tx = d * DEPTH_GAP;
    n.depth = d;
    if (!n.children.length) {
      n.ty = nextY;
      nextY += SIB_GAP;
    } else {
      n.children.forEach(c => place(c, d + 1));
      n.ty = (n.children[0].ty + n.children[n.children.length - 1].ty) / 2;
    }
  }
  roots.forEach(r => { place(r, r.depth || 0); nextY += SIB_GAP; });

  const edges = nodes.filter(n => n.parent_id).map(n => ({
    id: n.id, status: n.status, d: edgeD(byId.get(n.parent_id!)!, n),
  }));

  // Original cover autoFit equations, with a fixed 480 x 280 card and margins.
  const minX = Math.min(...nodes.map(n => n.tx)), maxX = Math.max(...nodes.map(n => n.tx));
  const minY = Math.min(...nodes.map(n => n.ty)), maxY = Math.max(...nodes.map(n => n.ty));
  const padX = 110, padY = 110;
  const w = Math.max(maxX - minX + padX, 1), h = Math.max(maxY - minY + padY, 1);
  const k = Math.min(480 / w, 280 / h, 1.5);
  const x = (480 - w * k) / 2 - (minX - padX / 2) * k;
  const y = (280 - h * k) / 2 - (minY - padY * 0.4) * k;
  return { nodes, edges, transform: `translate(${x} ${y}) scale(${k})` };
}

export function edgeD(p: TreeNode, c: TreeNode) {
  const x1 = p.tx + p.r, x2 = c.tx - c.r, mx = (x1 + x2) / 2;
  return `M ${x1} ${p.ty} C ${mx} ${p.ty}, ${mx} ${c.ty}, ${x2} ${c.ty}`;
}
