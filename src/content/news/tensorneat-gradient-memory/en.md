---
title: "TensorNEAT: Refine Different Networks Without Holding Every Intermediate"
pubDate: 2026-04-04
summary: "Population-parallel gradients and bounded-memory execution connect topology search with practical parameter refinement in JAX."
---

Searching neural-network structures creates a population whose members do not all look alike. TensorNEAT's March 3, 2026 [gradient-support merge][s1] makes parameter refinement available across those different topologies. An [April 4 memory update][s2] then reduces intermediate work and introduces population batching, giving researchers another control besides shrinking the search itself.

![Different neural networks pass through a small processing aperture in groups](./cover.webp)

*Concept illustration: preserve the population while limiting the active working batch.*

## Different structures can share a gradient operation

TensorNEAT represents NEAT networks as tensorized node and connection data. Its `genome.grad` interface returns a scalar loss and gradients for both arrays. Structural fields, such as indices and function types, and NaN padding receive zero gradients. The operation refines numerical parameters while preserving the encoded structure.

JAX vectorization can apply this calculation across a population even when its networks have different topologies. The [documented XOR example][s3] initializes a population, creates structural diversity through mutation and then optimizes the resulting networks with gradient descent. This supplies a concrete experimental building block: topology search and parameter refinement can be studied together without pretending that a gradient changes discrete connections.

## Batch the working set, not the search space

The April update adds `pop_batch_size` to NEAT and Pipeline. A Pipeline value overrides the algorithm setting, and the population must be divisible by the batch size. The older Pipeline argument `eval_batch_size` is replaced, so existing configurations using it need updating.

In the single-device evaluation path, transformation now happens inside a `jax.lax.scan` batch loop. Rather than materializing the whole population's dense adjacency intermediates before evaluation, the pipeline transforms and evaluates a batch at a time. Mutation operations also use the population-batch control. The population remains the same size; the simultaneous working set changes. This distinction is useful when an experiment needs diversity but reaches GPU memory limits.

## Lookups no longer need broad comparison intermediates

The update also replaces nested comparisons in crossover with hashed matching and sorted lookup, and maps connection keys to node indices with sorting and search. These changes target large temporary arrays that become costly when both population size and network capacity increase.

The commit reports identical evolution trajectories in its fixed-seed comparisons for DefaultGene and OriginGene configurations over 15 generations. That is a specific regression result, not a promise that every dependency version or hardware combination will reproduce every trajectory. The repository includes correctness and memory profiling scripts so the implementation can be examined alongside its claims.

## Choose a batch size with a reproducible experiment

Start with a small function-fitting task and fixed node and connection limits. Record the unbatched loss or fitness sequence, then choose a batch size that divides the population. Compare correctness first, and measure peak memory, compilation time and step time separately. A smaller batch can reduce memory pressure while changing how much parallel work is available.

For gradient experiments, inspect the XOR gradient example and keep the loss function and learning rate explicit. For memory experiments, use the [April source snapshot][s4] so the batching semantics stay fixed. TensorNEAT is JAX-based; the README's EvoX integration refers to the JAX-era EvoX branch, which matters when combining environments. These additions make a more focused question possible: how much structure and parameter search can fit within a particular memory budget?

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s3]: https://github.com/EMI-Group/tensorneat/blob/ce27fa9f794928c9416d9f12c398f58481c821ce/examples/func_fit/xor_grad.py
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
