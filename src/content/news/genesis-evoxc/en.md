---
title: "EvoX Compiler: An Explicit Tensor-Graph Stack Built with Genesis"
pubDate: 2026-11-03
summary: "Genesis’s EvoX Compiler case documents a Python tensor-graph compiler and runtime with NumPy, IREE, XLA and TVM execution paths."
---

EvoX Compiler (evoxc) makes a program’s computation graph an inspectable artifact. Its frontend constructs and transforms EvoXIR, while explicit stages take the program through lowering, compilation, loading and execution. NumPy is the only hard dependency; external compilers handle optimization and code generation.

The Genesis Evidence snapshot dated **October 28, 2026** documents four execution paths: **NumPy, IREE, XLA and TVM**. The repository credits Genesis with producing its code, tests and documentation. This case follows a project from initial construction into continued development of its interfaces and backends.

The snapshot reports **6,789 tests passing, 46 skipped and 3 expected failures**, with no failures, in the IREE-installed configuration. These are historical counts, not the current repository total. Its **285,659 tracked text lines** include tests, benchmark data and documentation; they do not measure compiler source alone. Reported model-token charges were approximately **US$50**, excluding hardware.

Backend validation remains configuration-specific: the recorded Vulkan run used a software device, while TVM’s ROCm path was compile-only. The results are project-reported and have not been independently reproduced. For developers, the practical starting point is the repository’s explicit graph pipeline and the committed benchmark reports.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
