---
title: "EvoX Compiler opens its pipeline to custom compilation"
pubDate: 2026-11-25
summary: "New main-branch interfaces accept custom calls, inline StableHLO and edited modules, while backend capabilities keep unsupported paths explicit."
---

An experimental operation can outgrow a tensor library before the surrounding program needs to change. EvoX Compiler’s November 23–24, 2026 default-branch updates add ways to insert compiler-specific operations, compile edited intermediate code and select custom backend implementations. The useful question is where the extension should run: inside a compiler, as a runtime kernel, or as an entire backend. [Implementation and guide][guide]

![A removable optical cartridge joins a modular rail with a continuous red light path](./cover.webp)

*Concept illustration: replace one stage while keeping the surrounding pipeline explicit.*

## Choose the boundary for custom work

`custom_call` emits a named StableHLO call with declared results and optional backend configuration. The external compiler decides whether that target exists and can be lowered. `inline_stablehlo` instead embeds a raw snippet: operands use `%in0` and subsequent indices, while outputs must be assigned as `%out0` and subsequent indices. Result specifications remain explicit. Names, configuration and snippets are static graph-specializing values. [Operation contract][ops]

These interfaces do not register an arbitrary kernel with IREE or PJRT. For a Python or Triton kernel that must execute at runtime, the existing `external_call` registration path remains the relevant mechanism. For a portable operation expressed in ordinary EvoX Compiler operations, a block with its own decomposition is another choice. This distinction prevents a compiler declaration from being mistaken for a runtime implementation.

## Edit the intermediate program, then compile

For example, a compiler developer can inspect an executable with `source_text()`, edit its StableHLO and submit that text through `compile_text` with input and output specifications. This bypasses tracing and graph construction, then uses the normal compile and load stages. The specifications describe outer tuples, so the execution contract must preserve tuple inputs and outputs. The external compiler validates the module; successful text submission alone does not establish numerical correctness. [Pipeline implementation][pipeline]

Keep a small input set and compare results against the original program after each edit. A missing custom target should be diagnosed at compiler legalization, not worked around by silently switching backend. The NumPy interpreter and native CPU engine reject these compiler extensions explicitly. The new in-graph operations also lack automatic batching and differentiation rules, so those transformations require a supported alternative. [Capabilities and limitations][guide]

## Plug in a backend deliberately

Backend instances now remain consistent across pipeline stages. Registration supports explicit replacement and removal, while entry points allow external packages to provide backends. A compiler backend declares capabilities and supported dtypes and implements compilation and loading; an empty dtype set rejects graphs. Custom IREE compiler and runtime modules can be supplied through options or environment variables. This makes testing a custom compiler build possible without confusing its runtime with the default module. [Backend extension guide][guide]

## Check transfers and numerical comparisons separately

The same development window changes Vulkan transfers: uploads use mapped coherent buffers up to 16 MiB and a copy path above that threshold; readback distinguishes host memory from GPU memory that merely happens to be host-visible. The recorded measurements concern one Intel integrated-GPU/Mesa/IREE setup, so measure transfer and execution separately on your own hardware. [Transfer implementation][transfer]

Native CPU changes also reuse storage for large buffers and incoming arrays, targeting repeated allocation costs. Reduction workers split independent outputs while preserving each output’s fold order. Compiler adapters additionally expose `split_reduction_threshold` and `split_reduction_non_exact`; changing reduction policy calls for checking numerical results as well as timing. [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

A native CPU `power` correction also aligns exponent handling with NumPy’s floating-power path, while the parity harness explicitly distinguishes exact integer/boolean checks from tolerance-based floating comparisons. Before adopting this source revision, retain your reference outputs, test the chosen compiler and device, and check the comparison tolerance. The earlier [v0.1.1 release][release] explains the original preparation pipeline; these source changes extend how developers can customize it. [Numerical correction][power]

[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /releases/evoxc-0-1-1
