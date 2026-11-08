// A deterministic local toy task, not output from real agents or a Python runtime.
// Each candidate sums finite numeric inputs; these flags describe the displayed code.
export type AgentCandidate = { id: string; parent: string | null; edits: boolean[]; tests: boolean[]; score: number };
export type AgentPopulation = { candidates: AgentCandidate[]; winner: number };
export const agentCode = (edits: boolean[]) => [
  edits[0] ? "xs = parse(x)" : "xs = x",
  edits[1] ? "xs = finite(xs)" : "xs = xs",
  edits[2] ? "return sum(xs)" : "return max(xs)",
];
export function evaluateAgent(edits: boolean[]) {
  const cases = [{ input: [], expected: 0 }, { input: ["2", 3], expected: 5 }, { input: [2, NaN], expected: 2 }];
  return cases.map(({input, expected}) => {
    let values: (string | number)[] = edits[0] ? input.map(Number) : [...input];
    if (edits[1]) values = values.filter(value => typeof value === "number" && Number.isFinite(value));
    if (!edits[2]) return Math.max(...values.map(Number)) === expected;
    // A missing parse step is a failure for non-numeric inputs.
    if (values.some(value => typeof value !== "number")) return false;
    return (values as number[]).reduce((sum, value) => sum + value, 0) === expected;
  });
}
export function nextAgentPopulation(previous: AgentPopulation | undefined, generation: number): AgentPopulation {
  const parent = previous?.candidates[previous.winner];
  const mutation = parent ? parent.edits.indexOf(false) : -1;
  const firstEdit = mutation >= 0 ? mutation : generation % 3;
  const initial = [[false, false, true], [true, false, true], [true, true, false]];
  const candidates = initial.map((initialEdits, i) => {
    const edits = parent ? [...parent.edits] : initialEdits;
    if (parent && i > 0) {
      const index = (firstEdit + i - 1) % 3;
      edits[index] = !edits[index];
    }
    const tests = evaluateAgent(edits);
    return { id: parent && i === 0 ? parent.id : `agent-${generation}-${i}`, parent: parent?.id ?? null, edits, tests, score: tests.filter(Boolean).length };
  });
  return { candidates, winner: candidates.reduce((best, candidate, i) => candidate.score > candidates[best].score ? i : best, 0) };
}
