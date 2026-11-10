---
title: "EvoX Genesis: Building a C Compiler Through Inspectable Stages and Regression Gates"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "The C compiler case follows an empty implementation through compiler stages, diagnostics and external test harnesses, with results kept within their documented scope."
---

Starting from an empty implementation is a clear goal; producing an executable that behaves correctly is a much more demanding acceptance condition. Genesis's C compiler case can be examined through the interfaces it built and the layers of verification around them.

![Source modules assembled into a growing software project](./software-world-continuity.webp)

The [C Compiler Evidence record](https://genesis.evox.group/evidence/c-compiler/) reports **248,989 lines of Rust**, **1,019 archived agent episodes**, **123.4 hours** and **US$44.38 in model-token charges**, using DeepSeek V4 Flash. It lists 220/220 c-testsuite cases, 32/36 evaluated LLVM cases and 2,904/2,904 Rust tests. These are project-reported results, not a fresh reproduction for this article.

## First make one program travel through every stage

The public compiler, jcc, documents a sequence of engineering milestones: establish the workspace, build an end-to-end compilation skeleton, extend language coverage, add optimization, then exercise external suites and application builds. The [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) defines those gates; it should be read as the repository's development record rather than a timestamped transcript of every Genesis episode.

The [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) connects preprocessing, lexical and syntactic analysis, semantic checks, CIR lowering, optimization, machine-code generation, object assembly and linking. Separate crates own those stages.

That structure creates useful intermediate artifacts. `-E` stops after preprocessing; `-emit-jcc-ir` exposes CIR; `-S` emits assembly; `-c` produces an object. When a compiled program fails, these boundaries narrow the investigation before changing the entire pipeline.

## Preserve C semantics through the intermediate representation

CIR is the compiler's typed SSA representation, separate from LLVM IR. Optimization transforms CIR into CIR; the documented debug-build workflow runs the verifier after passes. The [testing guide](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) describes checks for lowering, invalid representations, rewrites, instruction encoding and command-line behavior.

Representation verification is one layer, not proof of correct compilation. A structurally valid transformation can still change a program's result. That is why the test strategy also compiles and executes C programs and compares their output.

The corpus includes deliberate compilation failures: tests check the diagnostic severity, message and source span. This preserves rejection behavior for invalid inputs alongside successful execution behavior. The compiler's [C11 compliance document](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) records supported constructs and extension policy.

## External suites test the complete path

The [c-testsuite harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) provides an external language-test gate. The [LLVM runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) drives CMake with the compiler under test, builds programs and compares execution against reference output. Its default numerical comparison uses a 1e-4 tolerance while nonnumeric tokens and exit status must match exactly.

The [Csmith harness](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) adds generated-program differential testing against a reference compiler. In the inspected README snapshot, its 100-seed run reports **93 passes, 0 failures and 7 skips**, with the skips attributed to both compilers timing out. Calling this “93/93” without the skipped seeds would hide part of the workload.

These checks detect different classes of error: a language suite probes specified constructs, random programs explore combinations, and linked application builds exercise the driver, object files and runtime interfaces together.

## Keep success tied to the tested operation

The [versioned README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) reports lz4 building and passing its eight essentials tests. It describes SQLite as parsing and lowering cleanly, with further full-file verification work recorded. Parsing SQLite is a useful integration milestone; it is not the same as passing SQLite's complete runtime test suite.

The same source lists partial `long double` arithmetic, deferred platforms and documented extension-policy gates. The 32/36 LLVM result must therefore retain its evaluated subset and exclusions. The README and Evidence page also have different workspace-test counts; this article keeps the Evidence total attached to its record rather than combining snapshots.

## What persists between development tasks

Genesis's [documented development model](https://genesis.evox.group/getting-started/) uses recursive task decomposition around a software project. In this case, the durable engineering artifacts are concrete: source modules, representation contracts, intermediate outputs, diagnostics and regression harnesses. A later task can work against those artifacts instead of relying solely on a predecessor's conversation.

The [model-continuation case](/news/genesis-compiler-continuation) examines a later handoff and its separately scoped 1,820-case result. The [MESA rewrite](/news/genesis-mesa) uses original numerical behavior as a reference, while [EvoX Compiler](/news/genesis-evoxc) checks tensor graphs and device contracts. Those are distinct verification problems rather than additional runs of the same compiler experiment.

US$44.38 covers model tokens and excludes hardware. The public records support a substantial compiler-building case within their reported scope; they do not establish unrestricted C compatibility. To inspect the result, follow the [architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) into one external harness, then examine the exact programs and outputs that define its gate.
