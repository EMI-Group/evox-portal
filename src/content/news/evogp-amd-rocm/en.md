---
title: "EvoGP: Bring Tree-Based Program Search to AMD GPUs"
pubDate: 2026-06-18
updatedDate: 2026-11-17
summary: "ROCm support connects EvoGP's PyTorch extension to AMD hardware, with backend-aware compilation and a correction to per-thread interpreter stacks."
---

A researcher with an AMD GPU should be able to explore EvoGP's tree-based genetic programming without maintaining a separate search engine. [PR #12][s2], merged on June 17, 2026 UTC (June 18 in Beijing), adds that route through ROCm/HIP. The change concerns both building the extension and preserving the meaning of each program when it runs.

![Matching program trees above two different accelerator boards](./rocm-backend.webp)

*Concept illustration: the same program representation crosses GPU backend boundaries.*

## One source base for CUDA and ROCm

The June integration uses PyTorch's build-time HIP conversion to compile EvoGP's CUDA-extension sources for AMD GPUs. Build flags are selected for the active backend, and a CUDA-only header is guarded so it does not break the HIP build. Users with a ROCm build of PyTorch can therefore build the extension without maintaining a separate algorithm implementation.

The work also replaces dynamic device stack allocation in the tree interpreters with fixed-size local arrays. The contributor traced incorrect AMD execution to allocation aliasing across resident wavefronts. Keeping per-thread stacks separate matters for program evaluation: a tree that executes with another thread's temporary state can produce an incorrect fitness value, undermining subsequent selection.

## Why translating kernel source is only part of the job

PyTorch's HIP conversion translates the CUDA sources, but compiler arguments still reach the device compiler. Flags intended for NVIDIA's compiler cannot simply be passed to `hipcc`. The merged setup selects arguments for the active backend, retaining the CUDA list and using `-O3` on the ROCm branch. A CUDA-only header is guarded separately. These are concrete build boundaries: selecting ROCm PyTorch supplies the conversion path, while EvoGP must still make its build configuration compatible. [Build changes][s2]

## Follow the backend's build environment

The [source installation instructions][s3] require a suitable GPU toolchain, a C++ compiler and a matching PyTorch build. For AMD, use ROCm with `hipcc` and ROCm PyTorch. EvoGP is then built from source with `--no-build-isolation`, allowing the extension build to use that installed PyTorch environment.

The examples continue to use `cuda` device strings under ROCm because that is PyTorch's interface for these devices. For a specific AMD target, `PYTORCH_ROCM_ARCH` controls the architecture selection. This is a build choice, not a request to rewrite the tree representation or the evolutionary operators.

## Run the same search on a verified backend

The contributor reports symbolic-regression checks on AMD MI250X, W7800, RX 9070 XT and PRO V710 with the operating systems and ROCm versions listed in the pull request. Those runs used 1,000 individuals, 100 generations and a fixed seed; they are project-reported validation for those configurations, not a hardware-independent performance guarantee.

```bash
python -m evogp.sr_test
```

For a symbolic-regression experiment, first establish that the extension builds and that the small regression gate finishes with finite fitness. The contributor's checks span both wave32 and wave64 devices; they report matching fixed-seed trajectories rather than a new general speedup claim. After that check, retain the dataset, population and seed when comparing your own hardware. The [EvoGP overview][related] explains the program representation, while the later [population-reporting correction][logging] addresses a different source of generation cost.

[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/5538d75470ee0fa444ee6bbe5ea98b2eed6e99f8/README.md
[related]: /news/evogp
[logging]: /news/evogp-rocm-population-execution
