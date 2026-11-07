---
title: "EvoX 1.4.1: Preserving Algorithm Semantics in Parallel Search"
pubDate: 2026-10-30
summary: "Corrections to SHADE, differential evolution and CMA-ES highlight why reliable evolutionary infrastructure needs both efficient execution and faithful algorithm behavior."
---

EvoX 1.4.1, released on October 30, 2026, brings a set of algorithm and runtime corrections. Their significance extends beyond maintenance: when thousands of candidates are evaluated together, a small implementation error can systematically change the search. An evolutionary computing foundation must preserve the intended algorithm as well as execute it efficiently.

## When running code searches differently

In SHADE, the success-history memory for F and CR was not adapting. Improvement values were calculated after fitness had already been replaced, and arithmetic with NaN-filled arrays contaminated the selected values. The correction computes improvements before the update and selects successful entries with `torch.where`.

The shared binary crossover operator for differential evolution had compared normally distributed random samples with a crossover probability. The correction uses uniform sampling, matching the meaning of that probability. Related fixes also initialize CoDE, SaDE and SHADE populations uniformly within their bounds. These changes affect what candidates are generated, not just whether the program crashes.

## Numerical definitions and runtime contracts

CMA-ES fixes cover the rank-one covariance update and the cumulation constant, alongside failures caused by aliasing restrictions in `torch.cond`. The latter correction also re-enables a previously disabled CMA-ES test. Mathematical formulas and execution-framework contracts both need attention: satisfying one does not automatically satisfy the other.

The release also addresses evolution-strategy initialization and subspaces, tournament selection, PSO device transfers and hypervolume handling. These are documented corrections, not evidence that all algorithms now outperform earlier versions on every benchmark.

## Reliability is part of the infrastructure

For researchers comparing runs, version and seed should accompany the objective, population settings and evaluation budget. Results affected by corrected behavior may need re-evaluation rather than direct comparison. The lesson for EvoX is concrete: testing algorithm semantics belongs alongside tensorization and acceleration, so experimental feedback reflects the search researchers intended to run.

[1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · [2](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3) · [3](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716) · [4](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)
