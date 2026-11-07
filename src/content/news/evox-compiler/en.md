---
title: "EvoX Compiler v0.1.0: A Computational Foundation for Evolving Programs"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "EvoX Compiler separates program representation, transformation and execution, creating a computational foundation for experiments across program populations and backends."
---

*Updated November 7, 2026. Historical results retain their original snapshot dates.*

EvoX's vision of evolutionary AI requires computation to accommodate changing candidates, including programs with different structures. EvoX Compiler addresses that foundation: explicit graphs make programs inspectable and transformable before execution, while backend interfaces connect supported computations to different execution systems.

A numerical program is more than its final output. Researchers may need to inspect its graph, transform it, compare backends, or preserve a compiled artifact. **EvoX Compiler (evoxc) v0.1.0**, released on October 29, 2026, makes those intermediate stages explicit. It is a Python tensor-graph frontend and runtime, licensed under Apache-2.0, requiring Python 3.11 or newer.

## From a definition to an executable

The pipeline is `trace → lower → compile → load → run`. Tracing builds an EvoXIR graph from a definition and input specifications. Lowering prepares a backend representation; compilation creates an artifact; loading binds it to an execution device; running supplies the data. Each stage produces an inspectable object.

This separation helps locate errors: a malformed graph, an unsupported lowering operation and a device mismatch are different problems. Graphs and supported artifacts can also be persisted. External compilers handle optimization, scheduling and code generation; evoxc supplies the frontend and staging contract.

## Why graph transformations matter for evolution

Transformations such as `vmap`, `grad`, `jvp` and `vjp` produce graphs that can be composed before execution. For searches over programs, `batch_functions` combines candidate functions with matching input and output specifications into a population graph.

This is relevant to genetic programming, architecture search and algorithm synthesis, where candidates can be different programs rather than different parameter vectors. Combining them can reduce repeated compilation and dispatch, but the benefit depends on their structure and the backend; it is not an automatic speedup for every population.

## Choosing an execution path

NumPy is the only mandatory dependency and supplies the reference CPU interpreter. Optional adapters connect to IREE, XLA through a user-supplied PJRT plugin, and TVM through its StableHLO frontend. Backend availability does not imply equal operator or hardware coverage.

The versioned README documents Vulkan validation on Mesa lavapipe, a software device, and TVM ROCm support at compilation only. GPU inputs and device placement are explicit. Check the adapter's supported operations before moving a working CPU graph to another target.

## Start with the reference backend

Install the pinned release, run the README's CPU example, inspect the graph, and only then select a compiled backend:

```bash
pip install evoxc==0.1.0
```

The separate HuggingFace integration is distributed as `evoxc-hf`. This compiler release should not be confused with the EvoX optimization package or its version numbers.

## Validation within the computational foundation

The release README reports **7,511 passed, 77 skipped and 4 expected failures**, with no failures, across its core and integration suites in the documented environment. These counts describe that configuration, not universal hardware validation. The repository credits Genesis for producing its code, tests and documentation.

Use the [versioned README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) for the API and support matrix, the [release record](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) for the published artifact, and [GitHub](https://github.com/EMI-Group/evoxc) for subsequent development.
