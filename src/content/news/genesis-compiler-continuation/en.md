---
title: "Genesis: Carrying Software Progress Across Model Changes"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "A compiler handoff explores how accepted code, project structure and verification records can sustain development when the underlying model changes."
---

*Updated November 7, 2026. Historical results retain their original snapshot dates.*

Evolutionary AI systems need a way for useful progress to survive changes in their participants. Genesis's compiler handoff examines this requirement in software development: can a new model continue from the accepted project, using its code, constraints and tests as the basis for further work?

## Starting from an existing compiler

The [Evidence record dated September 7, 2026](https://genesis.evox.group/evidence/compiler-continuation/) describes a handoff from **GLM 5.2 to DeepSeek V4 Flash** on an accepted compiler lineage. The receiving model did not inherit the previous agent's conversational context.

That does not mean it started without information. The existing source, project structure and accepted history remained available. The experiment concerns continuing an established project, rather than building a second independent compiler.

## What the new model needed to preserve

A compiler connects parsing, semantic analysis, intermediate representations and code generation. A local fix can affect behavior far beyond the changed file. Successful continuation therefore requires more than generating additional code: changes must integrate with the inherited system and survive regression checks.

The linked jcc repository illustrates this engineering context through its Rust implementation, explicit intermediate representation, documented feature boundaries and test harnesses. Its README describes a separate development snapshot and must not be used as a substitute for the continuation record.

## What was reported

The continuation record reports recursion depth increasing from **4 to 8** and **1,820/1,820 retained LLVM SingleSource cases passing** after the handoff. This is the specified evaluation set, not the entire LLVM test suite.

Recursion depth describes task decomposition in this run; it is not a direct measure of software quality. The test result is the relevant behavioral evidence, while a broader claim of general reliability would require additional workloads and repeated runs.

## How to interpret continuity

The useful design lesson is to preserve the artifacts a successor can verify: code, interfaces, constraints, accepted changes and evaluation procedures. Conversational memory can help, but this case illustrates that it need not be the sole carrier of progress.

For readers applying that lesson, a practical review starts with the inherited baseline and the exact test manifest. Record which revision passed, which cases were excluded and which commands produced the result before comparing later improvements.

## Development that accumulates

The formation and continuation records share [the same repository](https://github.com/EMI-Group/genesis-demo-jcc). Do not add them together as independent projects or merge their differently scoped test totals. The continuation's added code volume and cost were not reported.

This project-reported case makes development continuity a concrete architectural question: what must a software project preserve so later agents can extend it? In the EvoX ecosystem, that connects model capability to cumulative system development. The retained test set provides evidence for this handoff; broader reliability still requires further evaluation.
