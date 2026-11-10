---
title: "Genesis Builds EvoX Compiler: Contracts, Graph Tests and Device Synchronization"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "How Genesis developed a tensor-graph compiler around explicit stages, transformation checks and backend contracts, with concrete examples from its public tests."
---

Building a tensor-graph compiler means keeping several implementations of the same calculation in agreement. A graph transformation can change tensor layout; an adapter can reject an operation; a device call can return before the computation finishes. Genesis's EvoX Compiler case becomes useful when those boundaries are examined individually.

![Compiler graphs checked against regression tests](./compiler-contract-layers.webp)

The [October 28 Evidence snapshot](https://genesis.evox.group/evidence/evoxc/) records 6,789 passing tests and approximately US$50 in model-token charges. To examine the engineering behind those figures, this article also uses the publicly accessible v0.1.0 source. The snapshot and release have different test totals; the implementation examples below are identified by their version.

## Turn the objective into interfaces that can be tested

EvoX Compiler owns the tensor language, EvoXIR graph and staging interfaces. External compilers receive its exported representation and handle optimization, scheduling and code generation. Its [package contracts](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) document dependency direction: value types and IR underpin tracing and operations, while transformations and adapters build on those layers. The separate `evoxc_hf` package consumes the public compiler API; the compiler does not import the model integration.

That division gives local development work a concrete boundary. For example, a transformation produces another ordinary graph rather than requiring each backend to understand Python's `vmap`. A backend gap must become an explicit error instead of silently changing the execution path. Package-level context documents record the APIs and constraints that another development task must preserve.

The public pipeline is `trace → lower → compile → load → run`. Each stage returns a distinct object. The [specification tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) check wrong-stage inputs, reject direct eager calls to graph definitions, and verify that convenience functions expand to the documented pipeline. They also reject capturing a concrete tensor from a closure unless the author explicitly embeds it. The practical benefit is that an apparently convenient shortcut cannot quietly introduce a second set of semantics.

According to the Evidence record, development proceeded layer by layer, with pytest checks required before continuing to the next layer. The repository provides inspectable contracts and tests for that method; it does not provide a complete archived sequence of agent decisions.

## A population transformation checked against two references

One demanding feature is `batch_functions`: combine multiple programs with matching input/output signatures into a single graph. Its contract is stronger than “the combined graph runs”: output row i must still equal the result of program i.

The [v0.1.0 integration tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) exercise a small, readable example. At the same graph position, three programs perform `x + 1`, `x * 2` and `x - 3`. With `switch_ops=True`, the merged graph represents the different operations through per-row selection. The tests compile that graph through IREE's CPU path and compare its output with both the NumPy execution of the merged graph and the stacked NumPy results of the original functions, at `rtol=atol=1e-5`.

Compiler-free checks inspect StableHLO output for the expected selection operation. Another check merges identical programs and compares the result with `vmap`, where no selection should be needed. Together, these tests probe program preservation, export and backend integration, rather than using successful compilation as the only acceptance condition.

## Device placement is part of correctness

An executable running on a GPU should not accept host data by pretending it is already device-resident. The [tensor and placement specification tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) check that data has a physical device, that transfers are explicit through `Tensor.to(device)`, and that invalid placement raises `DeviceError`.

This also matters for performance measurement. If every call transfers model weights again, a latency figure measures a different workload from one that keeps them resident. The [v0.1.0 model-integration documentation](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) separates checkpoint loading, the forward computation and executable staging. Parameters remain explicit graph inputs, making their placement visible.

## A returned call is not necessarily completed work

The XLA device-resident path can enqueue work and return before completion. Timing only `run` would therefore undercount execution. The [synchronization tests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) check the event lifecycle: runs accumulate completion handles; `synchronize()` waits for and destroys them; a second synchronization does no additional plugin work.

The error cases are equally specific. If waiting fails, the remaining handles must still be processed and the first error raised. A plugin that supplies no completion event must trigger an explicit error rather than a false completion claim.

These tests use a small fake PJRT plugin that performs no numerical computation. They verify synchronization semantics and cleanup, not GPU throughput or numerical accuracy. That distinction keeps the test's evidence matched to the claim.

## Keep the historical result and the release result separate

| Record | Configuration | Reported result |
| --- | --- | --- |
| October 28 Evidence snapshot | IREE installed | 6,789 passed; 46 skipped; 3 expected failures; 0 failed |
| October 28 Evidence snapshot | Compiler-free | 6,367 passed; 95 skipped; 3 expected failures |
| v0.1.0 release README | Core and model-integration suites, all listed extras installed | 7,511 passed; 77 skipped; 4 expected failures; 0 failed |

Sources: [Evidence verification](https://genesis.evox.group/evidence/evoxc/#verification) and [versioned release status](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). These are project-reported runs. Dependency and hardware guards explain unexercised paths; a passing CPU test is not validation of every accelerator.

The Evidence snapshot's 285,659 tracked text lines include tests, documentation and benchmark material. Its approximately US$50 covers model tokens, excluding hardware; model, episode count and active execution time were not reported. The repository's calendar span is not continuous autonomous runtime.

The repository credits Genesis with producing its code, tests and documentation. The concrete result is a compiler with separately inspectable stage contracts, graph-preservation tests and device-completion semantics. Start with the [population integration test](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) to follow one feature across those boundaries; the [EvoX Compiler overview](/news/evox-compiler) explains the user-facing pipeline.
