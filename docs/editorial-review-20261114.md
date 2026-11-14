# Editorial review, November 12–14, 2026

Reviewed against `evox-news-editor`: narrative, mechanisms, evidence, classification, article-specific illustrations, localization and rendered metadata. Production base: `d6fc61d`. Scope comes from Git introduction dates, not just frontmatter: nine production articles plus the current EvoNAS draft.

## Findings and changes

**EvoMO constraint-aware search — corrected.** The performance section explained eager versus compiled timing but omitted the source's solution-quality consequence. Added a paragraph alongside performance explaining that compiled RNG/floating-point execution can alter trajectories, and that the five-seed CUDA ZDT3 comparison had worse mean IGD under compilation. The recommendation now explicitly compares quality and runtime at equal evaluation budgets. Source: https://github.com/EMI-Group/evomo/pull/48 . Updated all 13 locales; retained `pubDate`, added `updatedDate: 2026-11-14`.

## Article decisions

| Article | Decision | Editorial basis |
| --- | --- | --- |
| EvoGP ROCm / population reporting | Retain | Concrete Python-reduction bottleneck and backend support mechanism; reported hardware checks are scoped; no unsupported benchmark multiplier. |
| EvoMO constraint-aware search | Revise | Added the missing quality implication beside compilation performance. Constraint scope, odd populations and algorithm-specific limits remain clear. |
| EvoRL JAX training consistency | Retain | Explains gradient, placement and metric-shape consequences with a versioned source snapshot and concrete analysis scenario. |
| TensorNEAT gradient / memory | Retain | Distinguishes numerical gradients from discrete structure and active batch size from population size; documents renamed configuration and fixed-seed evidence. |
| EvoMO 0.3.1 | Retain | Correct release collection; clearly separates the documentation patch from 0.3.0 functionality; includes upgrade and affected correctness paths. |
| EvoX Compiler 0.1.1 | Retain | Covers batching, graph preparation, backend errors and installation; does not equate compilation savings with faster kernels. |
| Genesis local MCP | Retain | Local connection contract, task identity and a parser-test delegation scenario explain practical use and boundaries. |
| Genesis Assistant sessions | Retain | Explains returning to a conversation, retained session context and reviewing a concrete write; avoids claiming indefinite persistence after restart. |
| EvoRL JSONL recording | Retain | Strong write-order versus step-identity tension, concrete merge example, serialization behavior and destination handling. |
| EvoNAS draft | Retain current revision | Current draft centres unreliable candidate ranking, shared representations and deployment trade-offs; previous diagram was already replaced by an article-specific generated illustration. |

## Visual review

Inspected all nine production covers and the revised EvoNAS cover. Their subjects are distinct and grounded in their articles: backend boards and trees, feasibility gate, robot calibration, batched network population, algorithm toolkit, grouped programs, local terminal handoff, bookmarked conversation, retained experiment records, and geometry-preserving network frames. They use neutral gray/charcoal drawing with small crimson accents; no fabricated experimental charts or UI screenshots. Retained existing images rather than regenerating compliant work.

The existing editorial records contain content/style prompts and original image provenance: `ecosystem-backfill-editorial-20261112.json`, `genesis-news-editorial-20261112.json`, and `evorl-jsonl-editorial-20261113.json`. EvoNAS generation notes are retained in `docs/evonas-editorial-20261114.md`.

## Dates and validation

Historical dates in the six backfilled articles are intentional: the retained publication record explicitly states that the user requested upstream event dates. They were not reset during this review.

Read all ten English bodies and their Chinese counterparts; inspected the existing editorial source records and reopened primary sources for the principal claims. Locale validation covers all 130 rendered routes, canonical URLs, cover references and the new paragraph in all 13 languages. It is not a new independent reproduction of the research or training workflows.

Build completed. Repository SEO audit: 650 article pages, no errors. All ten Chinese pages checked at 390px and 1280px: images loaded and no horizontal overflow. Screenshots and machine-readable checks are in `artifacts/review/`. English-body lengths are appropriate for regular features; no padding was added merely to reach a word count.

Publication authorized by the user on November 14; production rollout and live checks follow this review.
