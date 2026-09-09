---
title: "EvoX Genesis Completes and Submits the Terminal-Bench WASM Render Challenge for $36"
pubDate: 2026-09-10
summary: "The EvoX team has used Genesis to complete and submit the WASM Render challenge in Terminal-Bench Challenges, with $36 in recorded model cost for the run — far below Terminal-Bench's stated expectation of more than $1,000 per challenge. As of publication, Genesis may be the first autonomous system to publicly report completing and submitting a Terminal-Bench Challenge result."
---

![EvoX Genesis completes and submits the Terminal-Bench WASM Render challenge](./evox-genesis-terminal-bench-hero.png)

The EvoX team has used Genesis to complete and submit the WASM Render challenge in Terminal-Bench Challenges, with **$36 in recorded model cost** for the run.

As of publication, **Genesis may be the first autonomous system to publicly report completing and submitting a Terminal-Bench Challenge result**.

## WASM Render: Building a Complete WebGL Software Stack from Scratch

WASM Render asks participants to implement a pure JavaScript/WASM software renderer that provides WebGL 1.0 and 2.0 APIs to Node.js projects. The target environment cannot depend on a browser, GPU, native C++ bindings, or external libraries.

Under the challenge specification, the solution must cover a GLSL compiler, triangle rasterization, and the broader WebGL API surface. Terminal-Bench defines the verification scope as 2,071 Khronos CTS tests together with visual regression suites for three.js and Babylon.js. This describes the challenge's acceptance target; it does not mean that the Genesis submission has already passed an official Terminal-Bench evaluation.

Many coding-agent benchmarks evaluate a single bug fix or a localized feature. WASM Render is different: the work spans a large set of interdependent modules, and the entire codebase must remain coherent through continued implementation, integration, and validation.

Tasks of this kind expose central problems in long-horizon development: whether local changes remain consistent with the overall architecture, whether later work correctly inherits earlier decisions, and whether validation evidence can reliably guide the next stage. Terminal-Bench Challenges expands the unit of evaluation to a complete software project in order to examine these capabilities.

![Terminal-Bench Challenges compared with shorter-horizon coding tasks](./evox-genesis-terminal-bench-comparison.jpg)

## How Genesis Sustains Long-Horizon Development

Genesis does not rely on one persistent agent or an ever-growing context to retain the entire development state. The software project is the persistent “world”: the accepted software version records the current state, while repository paths define where an agent is situated and what it is responsible for.

Finite-lived agents unfold recursively around the repository. Within bounded scopes, they implement, inspect, and validate candidate changes. Agent outputs begin as proposals; only accepted code and validation evidence enter project history and become available for later agents to inherit.

For a systems project such as WASM Render, this lets each agent address a focused, bounded problem while the compiler, rendering pipeline, state management, and compatibility work continue to evolve through one shared code and validation history.

Genesis completed the WASM Render challenge for just $36, far below Terminal-Bench's stated expectation of more than $1,000 per challenge.

Our internal, non-formal testing also suggests that Genesis can work effectively with codebases around the 100,000-line scale. We have less experience with codebases of one million lines or more, but our attempts so far have proceeded smoothly.

🌐 Project website:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 QQ group: 297969717

![QQ group QR code](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>QQ Group｜</strong>Evolutionary Machine Intelligence</center>
