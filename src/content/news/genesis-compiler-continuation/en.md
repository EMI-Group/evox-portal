---
title: "Genesis Continues Compiler Development Across a Model Handoff"
pubDate: 2026-11-03
summary: "A Genesis continuation experiment reports 1,820/1,820 retained LLVM SingleSource cases passing after development moved from GLM 5.2 to DeepSeek V4 Flash."
---

Can a software project keep progressing when its underlying model changes? Genesis’s Compiler Continuation evidence record, dated September 7, 2026, describes development continuing from an accepted compiler repository without carrying over the previous agent’s conversational context.

The record reports a handoff from **GLM 5.2 to DeepSeek V4 Flash**, with recursive task depth growing from **4 to 8**. The continuation passed **1,820/1,820 retained LLVM SingleSource cases**. This is a specified evaluation set, not a claim of passing the entire LLVM test suite.

The result illustrates Genesis’s approach to continuity: accepted code and project history provide the basis for subsequent work. The compiler formation and continuation records share a repository and should not be counted as independent projects.

This retrospective follows the Evidence record. Its result is source-reported and has not been independently reproduced; continuation cost and added code volume were not reported. The linked repository’s default-branch README describes a different evaluation snapshot, so its test counts should not be merged with this continuation result.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
