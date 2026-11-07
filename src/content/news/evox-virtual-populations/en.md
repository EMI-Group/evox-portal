---
title: "EvoX VirtualES: Searching Neural Parameters Without Storing Every Candidate"
pubDate: 2026-07-08
summary: "VirtualES and VirtualProblem use seeded, on-demand perturbations to reduce parameter-population storage and explore a different scaling path for neuroevolution."
---

The EvoX changes of July 7–8, 2026 introduce a virtual-population path for neuroevolution. A conventional population can require a separate parameter vector for every candidate network. VirtualES instead keeps a shared center and a random seed for each individual, reconstructing Gaussian perturbations when needed. This addresses a concrete infrastructure question: how much candidate diversity can an experiment represent within its memory budget?

## A compact population, an explicit evaluation path

For P candidates with D parameters, materializing all candidate parameters requires storage proportional to P × D. The center-and-seed representation requires approximately D + P entries instead. That comparison concerns parameter representation: activations, fitness values, optimizer state and evaluation buffers still consume memory.

VirtualES sends `(center, seeds, sigma)` through the workflow. VirtualProblem evaluates the resulting candidates layer by layer. Its fused Triton operation combines the base linear computation with weight and bias perturbations generated from the seeds, avoiding a full tensor of perturbed networks. Fitness then informs the update of the shared center, preparing the next generation of search.

## What the implementation supports

This implementation uses full Gaussian perturbations rather than the earlier low-rank LoRA formulation. VirtualProblem supports `nn.Sequential` networks containing linear layers and specified activation functions. It is not a general evaluator for arbitrary neural architectures, and its documented interface does not support the HPO wrapper. The virtual workflow path also skips distributed evaluation and solution transforms.

## Why the representation matters

The contribution is a different way to connect population search with execution. Researchers can investigate memory trade-offs without first storing every candidate's weights. Actual peak memory and throughput still depend on network shape, population size, batches and hardware; the code changes alone establish no universal speedup. For EvoX, this is a concrete step toward making evolutionary exploration a more flexible computational workload.

[1](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6) · [2](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921) · [3](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697) · [4](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)
