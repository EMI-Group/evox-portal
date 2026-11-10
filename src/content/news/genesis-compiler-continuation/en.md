---
title: "Genesis Compiler Handoff: What the Next Model Inherits and How Continuation Is Checked"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "A model handoff retains an accepted compiler lineage. Its reported result and the public compiler's regression harnesses show what can be checked across that boundary."
---

The [September 7, 2026 Evidence record](https://genesis.evox.group/evidence/compiler-continuation/) describes a compiler handoff from **GLM 5.2 to DeepSeek V4 Flash**, without carrying the previous agent's conversational context. The accepted source tree and Git lineage remained available. The engineering question is what the receiving model can inspect and how subsequent changes can be evaluated.

![A compiler project retained between different toolsets](./compiler-model-handoff.webp)

The record reports **1,820/1,820 retained LLVM SingleSource cases passing** after continuation and task-recursion depth growing from 4 to 8. It does not publish a per-fix transcript or the continuation's added code volume and cost. The public jcc sources below explain the compiler's interfaces and regression mechanisms; their separate snapshot does not reconstruct the exact sequence of handoff actions.

## An inherited compiler has boundaries a successor must preserve

The [jcc architecture](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) separates the frontend, typed CIR intermediate representation, optimizer, machine-code backend, assembler and command-line driver. The frontend hands a checked syntax tree to lowering; later stages consume the resulting representation rather than reinterpreting the original source independently.

That matters when a new model changes one component. An arithmetic fix in lowering must still satisfy CIR typing; a calling-convention change must agree with register allocation and object emission. These are examples of the dependencies documented by the architecture, not claims about particular handoff repairs.

The driver exposes intermediate stopping points: `-E` for preprocessing, `-emit-jcc-ir` for CIR, `-S` for assembly and `-c` for object emission. Those artifacts help locate which stage changed before testing a linked executable.

## Regression checks cover successful programs and deliberate rejection

The [testing guide](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) describes compile-and-run cases that check exit status and output, alongside compile-fail cases that check diagnostic severity, message and source span. Optimization passes also have representation-verification checks.

A successor therefore has more than one acceptance condition. Generating an executable is insufficient if its output changes; accepting a program is insufficient if the language policy requires rejecting it. Testing diagnostics preserves behavior that a success-only benchmark would miss.

The [versioned README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#feature-status) lists concrete limits such as partial `long double` arithmetic and deferred targets. Those limits are useful inherited information: changing a documented rejection is a feature decision, not automatically a regression fix.

## What the LLVM harness actually compares

The public [LLVM-suite runner](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) configures the suite with the compiler under test, builds executables and compares their output with reference files. Its direct comparison is whitespace-token based: nonnumeric tokens must match exactly; numeric tokens use a configurable floating-point tolerance, defaulting to 1e-4; the final exit code must match exactly.

This illustrates why a test count needs a manifest and comparison policy. The runner's documented 36-case Regression/C subset is a different evaluation scope from the continuation record's 1,820 retained cases. The smaller snapshot cannot be used to infer the handoff's starting pass rate, and subtracting the two totals would not measure progress.

## Keep the reported handoff result attached to its scope

| Item | What the continuation record reports |
| --- | --- |
| Model transition | GLM 5.2 → DeepSeek V4 Flash |
| Carried conversational context | 0 |
| Preserved project state | Accepted compiler lineage |
| Task-recursion depth | 4 → 8 |
| Final evaluation | 1,820/1,820 retained LLVM SingleSource cases |

Source: [GW-000002](https://genesis.evox.group/evidence/compiler-continuation/). These are project-reported results from one handoff. Recursion depth describes task decomposition; the test result supplies the behavioral evidence.

The initial compiler and continuation records link the same repository. They should not be counted as two independent compiler projects, and their differently scoped test totals should remain separate.

## Make a handoff inspectable

For a developer applying this approach, a useful handoff package consists of an accepted revision, build commands, interface contracts, the exact regression manifest and known exclusions. That is a practical recommendation drawn from the public architecture and harnesses, rather than a claim that a complete package of this form was archived for the experiment.

Begin with a small change and compare its intermediate artifacts, diagnostics and executable behavior against that revision. The [Genesis development-history view](/news/genesis-development-history) provides related context for following contributions after the agent that made them has finished.
