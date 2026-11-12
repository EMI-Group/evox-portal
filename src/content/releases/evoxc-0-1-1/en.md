---
title: "EvoX Compiler v0.1.1: Less Work Before a Population Can Run"
pubDate: 2026-10-30
summary: "The October 30 release improves program batching, graph preparation and backend failure handling, including an XLA client-locking fix."
---

Searching over programs makes compilation part of the experimental budget. If every generation spends too long preparing its graphs, faster device execution solves only part of the problem. [EvoX Compiler v0.1.1][s1], released on October 30, 2026, improves that preparation path and fixes backend failure cases. Its [45-commit change set][s2] builds on the explicit graph pipeline introduced in v0.1.0.

![Different program structures gathered into compact parallel bands](./cover.webp)

*Concept illustration: organizing a population of programs before compilation.*

## Grouping programs needs a cost model

The population transformation `batch_functions` combines compatible candidate programs into one graph. Version 0.1.1 propagates row dependence through the internal class graph and expands the geometric band search used by `bands="auto"`. These changes help the transformation reason about which work depends on individual population members and how candidates should be grouped.

For a genetic-programming experiment, candidates can share an input signature while containing different operations. A single flat grouping is not necessarily the cheapest representation. Banding offers another organization, and the automatic policy compares candidates using its cost model. The useful check is still semantic: row i of the merged result must agree with running candidate i separately. The release updates regression tests around that contract.

## Remove repeated work from graph preparation

Several changes target CPU work before device execution: source locations are captured with a direct frame walk, redundant verification passes are removed from lowering, and IR verification uses linear use tracking with memoized result-type inference. StableHLO export also gains bulk constant-text emission, cached type text and table-driven operation dispatch.

These are related improvements at different stages. Faster export does not imply that a GPU kernel itself became faster. When comparing versions, keep tracing, transformation, lowering, compilation and steady-state execution as separate measurements. A large population with many constants may exercise different costs from a small graph with an expensive numerical kernel.

## Backend failures become easier to diagnose

The IREE adapter now surfaces a per-dispatch HAL binding-limit failure as an actionable `BackendError`. The change makes a backend resource limit easier to distinguish from a malformed numerical program. The XLA adapter also stops holding its shared-client lock across `PJRT_Client_Create`, addressing a same-thread finalizer deadlock; a regression test accompanies that fix.

Backend support still follows the versioned support matrix. NumPy provides the CPU interpreter. IREE, XLA and TVM have different dependency and device requirements, so a successful interpreter run is a useful reference before checking a compiled path. The [versioned README][s3] explains those boundaries and the explicit device-transfer model.

## Upgrade around one representative population

For the base package, install `pip install evoxc==0.1.1`; an IREE environment can use `pip install "evoxc[iree]==0.1.1"`. Python 3.11 or newer is required. The separate `evoxc-hf` distribution has its own version and upgrade cycle. Preserve any backend plugin configuration used by the existing experiment.

Start with a saved population and fixed inputs. Compare merged outputs with individual reference runs, then measure preparation and execution separately. If an accelerator reports a binding error, retain the graph and backend details for diagnosis rather than silently changing the experiment. The [v0.1.0 overview][related] explains the pipeline; v0.1.1 makes its preparation stages and backend boundaries more practical to work with.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /releases/evoxc-0-1-0
