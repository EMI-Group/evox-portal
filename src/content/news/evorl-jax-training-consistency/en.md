---
title: "EvoRL: Keep Gradients, Devices and Metrics in Agreement"
pubDate: 2026-11-08
summary: "November 8 development updates address JAX differentiation and Playground compatibility, building on device-placement and population-metric corrections."
---

A reinforcement-learning run can fail before it learns anything, or finish with logs that hide what was measured. EvoRL's November 8, 2026 main-branch updates address JAX differentiation and environment compatibility, alongside October corrections to device placement and population metrics. The [v0.2.0 source tag][s1] captures this development snapshot for reproducible inspection.

![A simulated walker aligned with calibration frames and a ground grid](./cover.webp)

*Concept illustration: consistent training depends on several aligned execution contracts.*

## A gradient path sensitive to JAX versions

The November 8 [compatibility change][s2] extends EvoRL's local workaround to JAX 0.12.0.1. In JAX 0.12.0 and 0.12.0.1, derivatives involving `erf` and `erfc` inside `shard_map` can fail VMA checks. The affected Tanh Normal distribution path uses an alternative calculation of the Normal log CDF, including a tail expansion, for those versions.

For continuous-control training, this sits in a concrete place: policy distributions must provide differentiable probabilities for parameter updates. An environment can initialize successfully while a later gradient calculation fails. The fix is version-scoped; other JAX releases retain the original path. The tagged README documents JAX 0.11.0 with CUDA 13 as the tested installation recommendation for that snapshot.

## Keep environment and device assumptions explicit

The same commit constrains the dependency to `playground>=0.2.0,<1`, preserving the JAX/MJX interface used by EvoRL's adapter. Upgrading an environment package without preserving that interface can change the foundation beneath an otherwise unchanged training configuration.

Earlier October work also rebuilds captured array defaults with an explicit copy so eager JAX execution respects the active mesh. ARS uses the ordinary evaluator when observation normalization is disabled, avoiding statistics that should not exist in that mode. Together, these corrections make placement and normalization settings part of the execution contract rather than assumptions hidden in initialization. [Device and ARS correction][s3]

## A population is not one policy

The October 28 [metric correction][s4] distinguishes collections from per-policy results. Population fields such as `pop_episode_returns` and `pop_episode_lengths` retain the population axis; per-policy and center-policy results use singular names where appropriate. ERL-EDA's single learner receives scalar training metrics, while learner collections preserve their array structure.

Imagine comparing a population-based method with a single-policy baseline. Averaging an already aggregated field again, or treating a population vector as a scalar, can produce a plausible-looking but misleading chart. Before reusing analysis scripts, inspect field names and shapes at the logging boundary. A naming migration should preserve the intended population, episode and learner reductions.

## Reproduce a small run before resuming a study

The tagged source requires Python 3.12 or newer and JAX/jaxlib 0.10.0 or newer. Its distribution is named `evorl-jax`, while the import remains `evorl`. For scripts and configurations, check out the source tag and follow its installation instructions; the README's basic example is `python scripts/train.py agent=ppo env=brax/ant`.

Use a small run to check gradient execution, expected device placement and the resulting metric shapes before comparing learning curves. Default logging includes Aim; optional recorders require their own SDKs. Keep the environment configuration, seed and evaluation budget with the results. The [EvoRL introduction][related] explains the framework's learning-and-evolution design; these changes make the assumptions behind an individual experiment easier to verify.

[s1]: https://github.com/EMI-Group/evorl/blob/v0.2.0/README.md
[s2]: https://github.com/EMI-Group/evorl/commit/5c889cad465ca88e3ec0d9112b0ec55835eb68fc
[s3]: https://github.com/EMI-Group/evorl/commit/a1ca25e9b232fdb6a6160c12cfc8bd702477096b
[s4]: https://github.com/EMI-Group/evorl/commit/992a554eb164a87ef9249592711cebd319ad9ebc
[related]: /news/evorl
