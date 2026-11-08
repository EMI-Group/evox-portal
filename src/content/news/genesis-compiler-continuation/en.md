---
title: "Genesis: Carrying Software Progress Across Model Changes"
pubDate: 2026-11-03
summary: "A compiler handoff explores how accepted code, project structure and verification records can sustain development when the underlying model changes."
updatedDate: 2026-11-08
---

The [Evidence record dated September 7, 2026](https://genesis.evox.group/evidence/compiler-continuation/) describes a handoff from **GLM 5.2 to DeepSeek V4 Flash** on an accepted compiler lineage. The receiving model did not inherit the previous agent's conversational context.

![A continuous bridge spans two different drafting surfaces](./compiler-model-handoff.webp)

The existing source, project structure and accepted history remained available.

## What the new model needed to preserve

A compiler connects parsing, semantic analysis, intermediate representations and code generation. A local fix can affect behavior far beyond the changed file. Successful continuation therefore requires more than generating additional code: changes must integrate with the inherited system and survive regression checks.

The linked jcc repository illustrates this engineering context through its Rust implementation, explicit intermediate representation, documented feature boundaries and test harnesses. Its README describes a separate development snapshot and must not be used as a substitute for the continuation record.

## What was reported

The continuation record reports recursion depth increasing from **4 to 8** and **1,820/1,820 retained LLVM SingleSource cases passing** after the handoff. This is the specified evaluation set, not the entire LLVM test suite. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

Recursion depth describes task decomposition in this run; it is not a direct measure of software quality. The test result is the relevant behavioral evidence, while a broader claim of general reliability would require additional workloads and repeated runs.

## How to interpret continuity

The useful design lesson is to preserve the artifacts a successor can verify: code, interfaces, constraints, accepted changes and evaluation procedures. Conversational memory can help, but this case illustrates that it need not be the sole carrier of progress.

## Development that accumulates

The formation and continuation records share [the same repository](https://github.com/EMI-Group/genesis-demo-jcc). Do not add them together as independent projects or merge their differently scoped test totals. The continuation's added code volume and cost were not reported.

A useful handoff package pairs an accepted revision with its test manifest, execution commands and known exclusions. Give the next model a small, checkable change, then compare it against that baseline. The [development-history view](/news/genesis-development-history) provides related context for following contributions after an agent finishes.
