---
title: "Genesis WASM Render: From Local Code Generation to System Construction"
pubDate: 2026-10-15
updatedDate: 2026-11-08
summary: "Genesis's software-renderer case examines how interfaces, tests and accepted changes coordinate the construction of a complete graphics pipeline."
---

Building a software system requires useful local changes to remain compatible as the project grows. Genesis's WASM Render case examines that challenge through a graphics pipeline, connecting EvoX's Agentic AI direction to system construction: shader processing, rendering and API behavior must develop into a coherent whole.

![Wireframe geometry becomes a shaded pixel image](./software-graphics-pipeline.webp)

Genesis's public record describes a TypeScript software renderer developed with DeepSeek V4 Flash. It reports 2,017/2,019 Khronos CTS cases passing, including 1,184/1,184 WebGL2 cases in the evaluated set. Approximately US$36 covers model tokens, not hardware. The evidence archive records 65.9 hours between the first and last agent commits, which is a repository time span rather than measured active-agent runtime.

[Genesis Evidence](https://genesis.evox.group/evidence/tbench-wasm/)

## From Local Code to a Complete System: What Makes It Difficult?

WASM Render is a graphics systems challenge in Terminal-Bench Challenges: run WebGL programs without a browser, GPU, or external runtime libraries.

This amounts to implementing a graphics pipeline in software: interpreting shader programs, computing graphics, and keeping a large set of interfaces and state changes consistent. A working individual feature is still a long way from an entire system working together. The task requires AI to stay aligned with the goal over multiple development rounds, handle module dependencies, correct errors based on test feedback, and ultimately complete system integration and regression validation.

The earlier 12-hour trial and this run use different development budgets, so their pass rates are not a controlled ranking. The Evidence archive additionally reports 16/38 three.js visual cases at the strict 0.1% threshold and 13/16 Babylon.js cases, both curated subsets. High API-conformance coverage therefore does not mean all visual-regression tests passed or that full graphics compatibility was established.

![WebGL2.0 conformance test results and Genesis's Khronos CTS test records](./wasm-render-results-en.png)

*WebGL2.0 conformance test results and Genesis's Khronos CTS test records.*

The archive counts 135,165 tracked text lines, including generated renderer.js, vendored code, a lockfile and documentation; this is not renderer source alone. The project describes its result as an early autonomous challenge submission, but this is not a maintainer-published ranking. Results are source-reported and have not been independently reproduced.

The development run ultimately passed 2,017 Khronos CTS tests, with approximately US$36 in model token charges and a cache hit rate of about 98%. Sustaining and integrating such a large-scale software engineering project at a low model cost also demonstrates Genesis's ability to carry out long-horizon development using economical open-source models.

## Let the Project Keep Evolving, and Agents Join as Needed

Genesis is a recursive AI system for software evolution. Users describe a software development objective, and the system unfolds tasks around it, assigning local agents where work is needed and preserving accepted code and validation results in the software project.

For large projects, an intuitive approach is to give agents more: longer contexts, more persistent sessions, and more elaborate predefined collaboration. Genesis places development continuity in the software project itself. Top-level objectives and constraints guide development throughout, while tasks unfold recursively along the repository structure. Agents handle local work and exit when finished; subsequent agents continue from the project that has already taken shape.

Previously, Genesis started from an empty repository, built a C compiler comprising approximately 250,000 lines of code, and carried out cross-model continuation of development. The WASM Render test results further validate Genesis's autonomous construction and integration capabilities in complex graphics systems development.

## Open systems that can keep evolving

The open-source value of this case lies in making system construction inspectable: interfaces, implementations and validation results remain available for subsequent work. It advances the EvoX direction of software that can accumulate useful changes across agent tasks, with progress assessed through the behavior of the integrated system.

🔗 Genesis repository: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Genesis paper: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Challenge results repository: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Upstream project (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 QQ group: 297969717
