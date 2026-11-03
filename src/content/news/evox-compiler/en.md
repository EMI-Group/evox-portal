---
title: "EvoX Compiler v0.1.0: Explicit Tensor Graphs, Multiple Backends"
pubDate: 2026-10-29
summary: "EvoX Compiler’s first release brings inspectable computation graphs, composable transformations and NumPy, IREE, XLA and TVM execution paths to Python."
---

**EvoX Compiler (evoxc) v0.1.0 was released on October 29, 2026.** It is a Python tensor-graph compiler and runtime for developers who want to inspect, transform, save and execute the program itself. The project is licensed under Apache-2.0 and requires Python 3.11 or newer.

## A program you can inspect

evoxc exposes each stage through `trace → lower → compile → load → run`. The frontend represents computations in EvoXIR and exports StableHLO for external compilers, which handle optimization and code generation. Intermediate graphs and artifacts remain available for inspection and persistence.

Graph transformations include `vmap`, `grad`, `jvp` and `vjp`. For neural architecture search, genetic programming and algorithm synthesis, `batch_functions` can combine candidate programs with matching input/output specifications into one graph. Explicit compilation caching helps workloads that repeatedly generate static programs.

## Four execution paths

NumPy is the only mandatory dependency and provides the default CPU interpreter. Optional adapters connect the graph to IREE, XLA through a user-supplied PJRT plugin, and TVM. Backend and device choices are explicit; operator and hardware coverage depend on the adapter. The release documents Vulkan validation on Mesa lavapipe and TVM ROCm support at compilation only.

The release README reports **7,511 passed, 77 skipped and 4 expected failures, with 0 failures**, across the core and `evoxc_hf` suites with IREE, TVM and torch installed. These are project-reported results for that configuration. The repository credits EvoX Genesis with producing its code, tests and documentation.

## Get started

Install the release with the command below. Optional compiler adapters are documented in the versioned README; the HuggingFace integration is distributed separately as `evoxc-hf`.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
