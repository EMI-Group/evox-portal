/* Illustrative recursive-agent episode (RLM style), not real agent output. A parent dispatches all its
   subagents at once, waits until every one has finished, then merges the surviving commits together in
   one merge commit; a rejected commit ends its branch as a fossil. Each parent decides on its own when
   to dispatch, so nested subagents start at different times. Main fast-forwards to the root's merge:
   it is the same commit, and main's ref reaches it at MAIN_MERGE. Times are fractions of the episode
   timeline; each lane leaves room for its task name and final commit id. */
export const MAIN_MERGE = .88;
export type Agent = {
  name: string; level: number; z: number; parent: number; spawn: number;
  // Parents work until `dispatch`, then wait; their `commit` is the merge of all their subagents.
  dispatch: number | null; commit: number; rejected?: boolean;
  // Earlier commits on the branch, before its final commit or merge.
  commits: number[];
  // Further stretches of a parent's own work while it waits.
  work: [number, number][];
};
// Order: root, front subagent and its two subagents' names, back subagent and its two.
const TASKS = [
  ["compiler", "parser", "lexer", "ast", "codegen", "x86", "regalloc"],
  ["compiler", "semantic", "types", "scopes", "optimizer", "inline", "dce"],
  ["compiler", "runtime", "libc", "startup", "tests", "csmith", "llvm"],
];
// Commit rhythms rotate per episode, so agents differ from each other and from one episode to the next:
// small frequent commits, one large commit, or a long gap before the next. The front parent commits
// its own work while it waits; the back parent commits a plan before it dispatches. Earlier commits
// sit after the task name and at least .14 before the final commit, clear of its id; no node sits
// under the id printed between its lane and the lane in front.
const RHYTHMS: { a: number[]; b: number[]; a1: number[]; a2: number[]; b1: number[]; b2: number[] }[] = [
  { a: [.29, .36], b: [.21], a1: [.30, .39], a2: [], b1: [.42], b2: [.46] },
  { a: [.36], b: [], a1: [.33], a2: [.39], b1: [], b2: [.40, .47] },
  { a: [.27, .32, .36], b: [.18, .23], a1: [], a2: [.32, .38], b1: [.40, .44], b2: [] },
];
const cache = new Map<number, Agent[]>();
export function agentEpisode(episode: number): Agent[] {
  const hit = cache.get(episode);
  if (hit) return hit;
  const [root, a, a1, a2, b, b1, b2] = TASKS[episode % TASKS.length];
  // Every other episode, one nested commit is rejected: that branch stops and is not merged.
  const redo = episode % 2 === 1;
  const r = RHYTHMS[episode % RHYTHMS.length];
  const agents: Agent[] = [
    { name: root, level: 0, z: 0, parent: -1, spawn: .03, dispatch: .10, commit: .84, commits: [], work: [] },
    { name: a, level: 1, z: -22, parent: 0, spawn: .10, dispatch: .18, commit: .78, commits: r.a, work: [[.22, .36]] },
    { name: b, level: 1, z: 22, parent: 0, spawn: .10, dispatch: .27, commit: .70, commits: r.b, work: [] },
    { name: a1, level: 2, z: -33, parent: 1, spawn: .18, dispatch: null, commit: .54, commits: r.a1, work: [] },
    { name: a2, level: 2, z: -11, parent: 1, spawn: .18, dispatch: null, commit: redo ? .60 : .64, rejected: redo, commits: r.a2, work: [] },
    { name: b1, level: 2, z: 11, parent: 2, spawn: .27, dispatch: null, commit: .62, commits: r.b1, work: [] },
    { name: b2, level: 2, z: 33, parent: 2, spawn: .27, dispatch: null, commit: .66, commits: r.b2, work: [] },
  ];
  if (cache.size > 8) cache.clear();
  cache.set(episode, agents);
  return agents;
}
export function commitId(key: string) {
  let h = 2166136261;
  for (let i = 0; i < key.length; i++) { h ^= key.charCodeAt(i); h = Math.imul(h, 16777619); }
  h ^= h >>> 13; h = Math.imul(h, 0x5bd1e995); h ^= h >>> 15;
  return ((h >>> 0).toString(16) + "0000000").slice(0, 7);
}
