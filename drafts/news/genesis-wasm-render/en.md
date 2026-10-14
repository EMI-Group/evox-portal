---
title: "EvoX Genesis Completes WASM Render in About Two Days for $36"
pubDate: 2026-10-14
summary: "Using DeepSeek V4 Flash, EvoX Genesis completed WASM Render in about two days for just $36 in model charges, becoming the first AI system worldwide to submit a result for the challenge. Team test records show 2,017/2,019 Khronos CTS tests passed (99.90%), including all 1,184/1,184 WebGL2.0 conformance tests run."
---

The ability to sustain long-horizon tasks and ultimately deliver a complete engineering project is becoming an important measure of AI capability. Terminal-Bench is a representative benchmark for AI agents, focusing on programming and command-line tasks in terminal environments. Terminal-Bench Challenges takes evaluation further, to building complete software projects from scratch, with an official estimated cost of more than US$1,000 per challenge.

EvoX Genesis, the recursive AI system for software evolution developed by the EvoX team, used DeepSeek V4 Flash to complete the WASM Render challenge in about **two days**, spending just **US$36** in model charges, becoming **the first AI system worldwide to submit a result for this challenge.** The team's test records show that it passed 2,017/2,019 tests in the Khronos CTS suite (99.90%), including all 1,184/1,184 WebGL2.0 conformance tests.

## From Local Code to a Complete System: What Makes It Difficult?

WASM Render is a graphics systems challenge in Terminal-Bench Challenges: run WebGL programs without a browser, GPU, or external runtime libraries.

This amounts to implementing a graphics pipeline in software: interpreting shader programs, computing graphics, and keeping a large set of interfaces and state changes consistent. A working individual feature is still a long way from an entire system working together. The task requires AI to stay aligned with the goal over multiple development rounds, handle module dependencies, correct errors based on test feedback, and ultimately complete system integration and regression validation.

According to the Terminal-Bench team's published results from an early 12-hour trial, Cognition's AI software development product Devin, paired with Fable 5, achieved a 20.5% pass rate on the more demanding WebGL2.0 conformance tests. After about two days of development, Genesis brought the pass rate of the WebGL2.0 conformance tests it ran to 100%.

![WebGL2.0 conformance test results and Genesis's Khronos CTS test records](./wasm-render-results-en.png)

*WebGL2.0 conformance test results and Genesis's Khronos CTS test records.*

Genesis's public results repository contains approximately **130,000 lines of code**, covering a GLSL shader language compiler, WebGL interfaces and state management, software rasterization, and image presentation. These TypeScript implementations are built into a JavaScript renderer, connecting language processing, graphics computation, and interface behavior.

The development run ultimately passed 2,017 Khronos CTS tests, with approximately US$36 in model token charges and a cache hit rate of about 98%. Sustaining and integrating such a large-scale software engineering project at a low model cost also demonstrates Genesis's ability to carry out long-horizon development using economical open-source models.

## Let the Project Keep Evolving, and Agents Join as Needed

Genesis is a recursive AI system for software evolution. Users describe a software development objective, and the system unfolds tasks around it, assigning local agents where work is needed and preserving accepted code and validation results in the software project.

For large projects, an intuitive approach is to give agents more: longer contexts, more persistent sessions, and more elaborate predefined collaboration. Genesis places development continuity in the software project itself. Top-level objectives and constraints guide development throughout, while tasks unfold recursively along the repository structure. Agents handle local work and exit when finished; subsequent agents continue from the project that has already taken shape.

Previously, Genesis started from an empty repository, built a C compiler comprising approximately 250,000 lines of code, and carried out cross-model continuation of development. The WASM Render test results further validate Genesis's autonomous construction and integration capabilities in complex graphics systems development.

## Open Source and Community

The EvoX team will continue developing recursive AI systems for software evolution, helping code, validation results, and development experience accumulate in the open-source community. We invite more developers to take part in sustainable software evolution and build an open software development ecosystem together.

🔗 Genesis repository: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Genesis paper: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Challenge results repository: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Upstream project (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 QQ group: 297969717
