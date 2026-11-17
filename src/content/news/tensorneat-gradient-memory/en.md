---
title: "TensorNEAT: Keep the Population, Bound the Working Memory"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Population batching and smaller lookup intermediates reduce the simultaneous working set of NEAT execution without shrinking the search population."
---

A neural-network population can exhaust GPU memory even when its stored genomes fit. Transformation and evaluation create additional working arrays. TensorNEAT's [April 4, 2026 update][s2] moves transformation inside sequential population batches and reduces lookup intermediates. It gives researchers a way to control the working set while retaining the number of candidates in the search.

![Different neural networks pass through a small processing aperture in groups](./cover.webp)

*Concept illustration: preserve the population while limiting the active working batch.*

## Batch the working set, not the search space

The April update adds `pop_batch_size` to NEAT and Pipeline. A Pipeline value overrides the algorithm setting, and the population must be divisible by the batch size. The older Pipeline argument `eval_batch_size` is replaced, so existing configurations using it need updating.

In the single-device evaluation path, transformation now happens inside a `jax.lax.scan` batch loop. Rather than materializing the whole population's dense adjacency intermediates before evaluation, the pipeline transforms and evaluates a batch at a time. Mutation operations also use the population-batch control. The population remains the same size; the simultaneous working set changes. This distinction is useful when an experiment needs diversity but reaches GPU memory limits.

The important boundary is where the batch begins. Dividing evaluation after a full-population transformation would leave the large adjacency intermediate already allocated. Moving both operations into the scan body changes that lifetime. The commit describes an intermediate shaped like population × nodes × nodes becoming batch × nodes × nodes. That is an implementation-level comparison, not a formula for total device memory: genomes, persistent state and other buffers still occupy space. [Transformation change][s2]

Read batching as an execution choice. It does not select a smaller set of survivors or change the population requested by the experiment. Conversely, reducing the population changes which candidates participate and can change the search itself. Keep those settings separate when diagnosing an out-of-memory failure. A useful first comparison holds the population constant and varies only a valid divisor for the working batch.

## Lookups no longer need broad comparison intermediates

The update also replaces nested comparisons in crossover with hashed matching and sorted lookup, and maps connection keys to node indices with sorting and search. These changes target large temporary arrays that become costly when both population size and network capacity increase.

The commit reports identical evolution trajectories in its fixed-seed comparisons for DefaultGene and OriginGene configurations over 15 generations. That is a specific regression result, not a promise that every dependency version or hardware combination will reproduce every trajectory. The repository includes correctness and memory profiling scripts so the implementation can be examined alongside its claims.

## Choose a batch size with a reproducible experiment

Start with a small function-fitting task and fixed node and connection limits. Record the unbatched loss or fitness sequence, then choose a batch size that divides the population. Compare correctness first, and measure peak memory, compilation time and step time separately. A smaller batch can reduce memory pressure while changing how much parallel work is available.

Use the [April source snapshot][s4] to fix the configuration semantics, including the renamed batch argument. TensorNEAT is JAX-based; its documented EvoX integration targets the JAX-era EvoX branch. Record dependency versions with measurements. If the intended experiment also refines network parameters, the separate [population-gradient article][gradient] explains that learning path. First verify that changing the batch preserves your chosen run's results, then evaluate the memory and time trade-off.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /news/tensorneat-population-gradients
