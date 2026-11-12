---
title: "EvoGP: Broader GPU Access, Less Work in Population Logging"
pubDate: 2026-10-16
summary: "AMD ROCm support and a tensor-reduction fix address two practical barriers to running large genetic-programming populations."
---

A fast genetic-programming kernel is only part of a usable search system. The available GPU must be supported, and ordinary progress reporting must not dominate every generation. EvoGP's [October 16, 2026 merge][s1] replaces Python-level fitness reductions in its standard pipeline. It follows [AMD ROCm support merged on June 17][s2], widening access to the same tree-based search implementation.

![Matching program trees above two different accelerator boards](./cover.webp)

*Concept illustration: the same program representation crosses GPU backend boundaries.*

## Keep population statistics in tensor operations

The reporting change replaces Python's built-in maximum and minimum over the fitness tensor with `torch.max` and `torch.min`. Iterating a large device tensor through Python creates work at the language boundary that a tensor reduction can handle within the numerical framework. This becomes especially relevant when the fitness function itself is inexpensive.

For symbolic regression with a large population, evaluating candidate expressions may be highly parallel while printing each generation's extrema remains unexpectedly costly. The correction removes that mismatch without changing the intended statistic. The pull request reports a large improvement in its million-individual example, but does not provide a complete benchmark protocol; the actionable lesson is to profile the whole generation, including reporting.

## One source base for CUDA and ROCm

The June integration uses PyTorch's build-time HIP conversion to compile EvoGP's CUDA-extension sources for AMD GPUs. Build flags are selected for the active backend, and a CUDA-only header is guarded so it does not break the HIP build. Users with a ROCm build of PyTorch can therefore build the extension without maintaining a separate algorithm implementation.

The work also replaces dynamic device stack allocation in the tree interpreters with fixed-size local arrays. The contributor traced incorrect AMD execution to allocation aliasing across resident wavefronts. Keeping per-thread stacks separate matters for program evaluation: a tree that executes with another thread's temporary state can produce an incorrect fitness value, undermining subsequent selection.

## Follow the backend's build environment

The [source installation instructions][s3] require a suitable GPU toolchain, a C++ compiler and a matching PyTorch build. For AMD, use ROCm with `hipcc` and ROCm PyTorch. EvoGP is then built from source with `--no-build-isolation`, allowing the extension build to use that installed PyTorch environment.

The examples continue to use `cuda` device strings under ROCm because that is PyTorch's interface for these devices. For a specific AMD target, `PYTORCH_ROCM_ARCH` controls the architecture selection. This is a build choice, not a request to rewrite the tree representation or the evolutionary operators.

## Validate a small search, then increase the population

The contributor reports symbolic-regression checks on AMD MI250X, W7800, RX 9070 XT and PRO V710 with the operating systems and ROCm versions listed in the pull request. Those runs used 1,000 individuals, 100 generations and a fixed seed; they are project-reported validation for those configurations, not a hardware-independent performance guarantee.

After building, run `python -m evogp.sr_test` and check for finite fitness and successful completion. Then compare a representative experiment with reporting enabled and disabled while keeping inputs, seed and population fixed. This separates evaluator cost from bookkeeping before scaling. The [EvoGP research overview][related] explains tensorized program trees; these two changes address the practical path from that representation to a working search on available hardware.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/85c9f96490185b371438768668da53de930cc3f6/README.md
[related]: /news/evogp
