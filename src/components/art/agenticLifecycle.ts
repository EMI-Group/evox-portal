export type AgenticState = "pending" | "running" | "waiting" | "ready" | "processing" | "completed";
export type AgenticPhase = "root" | "dispatch-l2" | "l2-ready" | "dispatch-l3" | "l3-pending" | "l3-work" | "return-parked" | "parked" | "return-selected" | "parent-processing" | "resume-selected" | "selected-processing" | "dispatch-l4" | "l4-pending" | "l4-working" | "hold" | "reset";

export interface AgenticNodeFrame {
  id: string;
  depth: number;
  state: AgenticState;
  parked: boolean;
  bornAt: number;
}
export interface AgenticEdgeFrame {
  id: string;
  parentId: string;
  state: AgenticState | "dispatching";
  parked: boolean;
  growth: number;
  startsAt: number;
  endsAt: number;
}
export interface AgenticSignalFrame {
  id: string;
  edgeId: string;
  direction: "outbound" | "return";
  progress: number;
  startsAt: number;
  endsAt: number;
}
export interface AgenticFrame {
  elapsed: number;
  phase: AgenticPhase;
  opacity: number;
  nodes: AgenticNodeFrame[];
  edges: AgenticEdgeFrame[];
  signals: AgenticSignalFrame[];
}

export const AGENTIC_DURATION = 13_000;
export const AGENTIC_FINAL_TIME = 10_000;

const births = [
  { id: "r", depth: 0, bornAt: 0 },
  { id: "m0", parentId: "r", depth: 1, startsAt: 500, bornAt: 1300 },
  { id: "m1", parentId: "r", depth: 1, startsAt: 500, bornAt: 1300 },
  { id: "m0-0", parentId: "m0", depth: 2, startsAt: 1800, bornAt: 2700 },
  { id: "m0-1", parentId: "m0", depth: 2, startsAt: 1800, bornAt: 2700 },
  { id: "m1-0", parentId: "m1", depth: 2, startsAt: 1800, bornAt: 2700 },
  { id: "m1-1", parentId: "m1", depth: 2, startsAt: 1800, bornAt: 2700 },
  { id: "m0-1-0", parentId: "m0-1", depth: 3, startsAt: 7550, bornAt: 8400 },
  { id: "m0-1-1", parentId: "m0-1", depth: 3, startsAt: 7550, bornAt: 8400 },
] as const;

const messages: { id: string; edgeId: string; direction: AgenticSignalFrame["direction"]; start: number; end: number }[] = [
  ...births.flatMap(node => "parentId" in node ? [{
    id: `create-${node.id}`, edgeId: node.id, direction: "outbound" as const, start: node.startsAt, end: node.bornAt,
  }] : []),
  { id: "return-parked", edgeId: "m0-0", direction: "return", start: 3900, end: 4700 },
  { id: "return-selected", edgeId: "m0-1", direction: "return", start: 5100, end: 5900 },
  { id: "resume-selected", edgeId: "m0-1", direction: "outbound", start: 6400, end: 7200 },
];

const phases: [number, AgenticPhase][] = [
  [0, "root"], [500, "dispatch-l2"], [1300, "l2-ready"], [1800, "dispatch-l3"],
  [2700, "l3-pending"], [3500, "l3-work"], [3900, "return-parked"], [4700, "parked"],
  [5100, "return-selected"], [5900, "parent-processing"], [6400, "resume-selected"],
  [7200, "selected-processing"], [7550, "dispatch-l4"], [8400, "l4-pending"],
  [9200, "l4-working"], [9900, "hold"], [12200, "reset"],
];

// Reconcile only at semantic boundaries. Native animations interpolate between
// these events; the player never samples paths or rewrites the SVG every frame.
export const AGENTIC_EVENT_TIMES = [...new Set([
  ...phases.map(([time]) => time),
  ...births.flatMap(node => "startsAt" in node ? [node.startsAt, node.bornAt] : [node.bornAt]),
  ...messages.flatMap(message => [message.start, message.end]),
  1600, 6150, AGENTIC_DURATION,
])].sort((a, b) => a - b);

const clamp = (value: number) => Math.max(0, Math.min(1, value));
const smooth = (value: number) => { const x = clamp(value); return x * x * (3 - 2 * x); };

function stateAt(id: string, time: number): AgenticState {
  if (id === "r") return time < 500 ? "running" : "waiting";
  if (id === "m0" || id === "m1") {
    if (time < 1600) return "pending";
    if (time < 1800) return "running";
    if (id === "m0" && time >= 5900 && time < 6150) return "ready";
    if (id === "m0" && time >= 6150 && time < 6400) return "processing";
    return "waiting";
  }
  if (id === "m0-0") return time < 3500 ? "pending" : time < 3900 ? "running" : "completed";
  if (id === "m0-1") {
    if (time < 3500) return "pending";
    if (time < 5100) return "running";
    if (time < 7200) return "completed";
    return time < 7550 ? "processing" : "waiting";
  }
  if (id === "m1-0" || id === "m1-1") return time < 3500 ? "pending" : "running";
  if (id === "m0-1-0") return time < 9200 ? "pending" : time < 9900 ? "running" : "completed";
  return "pending";
}

/** A complete, deterministic snapshot; callers can seek without replaying events. */
export function getAgenticFrame(elapsed: number): AgenticFrame {
  const time = Number.isFinite(elapsed) ? Math.max(0, elapsed) % AGENTIC_DURATION : 0;
  const nodes: AgenticNodeFrame[] = births.filter(node => time >= node.bornAt).map(node => ({
    id: node.id, depth: node.depth, bornAt: node.bornAt, state: stateAt(node.id, time),
    parked: node.id === "m0-0" && time >= 4700,
  }));
  const edges: AgenticEdgeFrame[] = births.flatMap(node => {
    if (!("parentId" in node) || time < node.startsAt) return [];
    return [{ id: node.id, parentId: node.parentId,
      state: time < node.bornAt ? "dispatching" : stateAt(node.id, time),
      parked: node.id === "m0-0" && time >= 4700,
      growth: clamp((time - node.startsAt) / (node.bornAt - node.startsAt)),
      startsAt: node.startsAt, endsAt: node.bornAt,
    }];
  });
  const signals = messages.filter(message => time >= message.start && time < message.end).map(message => ({
    id: message.id, edgeId: message.edgeId, direction: message.direction,
    progress: (time - message.start) / (message.end - message.start),
    startsAt: message.start, endsAt: message.end,
  }));
  let phase: AgenticPhase = "root";
  for (const [start, candidate] of phases) { if (time >= start) phase = candidate; }
  return { elapsed: time, phase, nodes, edges, signals,
    opacity: Math.min(smooth(time / 240), 1 - smooth((time - 12200) / 800)),
  };
}

export function getAgenticFinalFrame(): AgenticFrame {
  return getAgenticFrame(AGENTIC_FINAL_TIME);
}
