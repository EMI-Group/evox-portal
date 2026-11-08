---
title: "EvoX VirtualES: More Candidates, Fewer Stored Weights"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "A shared parameter center and per-candidate seeds let VirtualES reconstruct neural-network perturbations on demand, changing the memory budget for population search."
---

A larger neural-network population usually means storing more copies of its weights. EvoX's July 7–8, 2026 changes take another route: VirtualES stores one shared parameter center and a random seed per candidate, then reconstructs the differences during evaluation. The useful question becomes how much search diversity can fit before parameter storage consumes the memory budget.

![A solid shared form, red seeds and translucent variations illustrate a virtual population](./virtuales-shared-center.webp)

*Concept illustration: one shared center, many reconstructable candidates.*

## Store the recipe for a candidate

For P candidates with D parameters each, explicit parameter storage grows as P × D. The center-and-seed representation uses approximately D + P entries. This comparison covers the population's parameter representation; activations, optimizer state and evaluation buffers remain part of the total memory bill. [VirtualES implementation](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

VirtualES passes `(center, seeds, sigma)` to the workflow. VirtualProblem evaluates each network layer using a fused Triton operation that combines the base linear computation with seeded weight and bias perturbations. Fitness then guides the next update of the center. The implementation uses full Gaussian perturbations, replacing the earlier low-rank LoRA formulation. [Evaluation implementation](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## Keep each candidate's feedback distinct

The supported starting point is an `nn.Sequential` network with linear layers and documented activations. Set the loss function's `reduction='none'` so VirtualProblem can aggregate losses separately for each candidate. A scalar loss would be expanded across the population, losing that distinction. This small interface choice matters to the search itself.

The virtual path skips distributed evaluation and solution transforms; VirtualProblem also excludes the HPO wrapper. Check these boundaries before adapting an existing experiment. [Workflow integration](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## Measure what the representation makes possible

Start with a supported network, then vary population size while recording peak memory, evaluation time and fitness under a fixed evaluation budget. That separates the storage benefit from the cost of regenerating noise and processing activations. The July changes also include a [Triton compilation fix](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef) for the noise helper.

For an introduction to EvoX's experiment structure, see the [quickstart](/news/evox-quickstart). VirtualES offers a concrete next question: how does a larger search population change your experiment once storing every candidate is no longer the starting requirement?
