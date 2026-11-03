export const blogSamples = [
  { slug: "evococo", label: "EvoCoCo", topics: ["MATLAB → EvoX", "GPU", "Multi-Agent"] },
  { slug: "autopso", label: "AutoPSO", topics: ["PSO", "Meta-Evolution", "GPU"] },
  { slug: "evogm", label: "EvoGM", topics: ["LLM", "Model Merging", "Evolution"] },
  { slug: "codex-for-evox", label: "Codex × EvoX", topics: ["Algorithm", "Problem", "Workflow"] },
  { slug: "genesis-wasm-render", label: "Genesis", topics: ["WASM", "WebGL", "Agentic AI"] },
] as const;

export type BlogSampleSlug = typeof blogSamples[number]["slug"];
export const blogSamplePath = (slug: string) => slug === "evococo" ? "/preview/blog" : `/preview/blog/${slug}`;
