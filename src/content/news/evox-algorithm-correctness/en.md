---
title: "EvoX 1.4.1: When a Small Fix Changes the Search"
pubDate: 2026-10-30
summary: "Corrections to SHADE, differential evolution and CMA-ES highlight why reliable evolutionary infrastructure needs both efficient execution and faithful algorithm behavior."
updatedDate: 2026-11-08
---

A search can finish successfully while following the wrong update rule. EvoX 1.4.1, released on October 30, 2026, addresses that gap in SHADE, differential evolution and CMA-ES: the corrections restore adaptation, sampling and execution behavior that the algorithms depend on.

![Checking and correcting algorithm behavior](./algorithm-behavior-calibration.webp)

*Calibrating implementation against intended algorithm behavior.*

## When running code searches differently

In SHADE, the success-history memory for F and CR was not adapting. Improvement values were calculated after fitness had already been replaced, and arithmetic with NaN-filled arrays contaminated the selected values. The correction computes improvements before the update and selects successful entries with `torch.where`. [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

The shared binary crossover operator for differential evolution had compared normally distributed random samples with a crossover probability. The correction uses uniform sampling, matching the meaning of that probability. Related fixes also initialize CoDE, SaDE and SHADE populations uniformly within their bounds. These changes affect what candidates are generated, not just whether the program crashes. [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## Numerical definitions and runtime contracts

CMA-ES fixes cover the rank-one covariance update and the cumulation constant, alongside failures caused by aliasing restrictions in `torch.cond`. The latter correction also re-enables a previously disabled CMA-ES test. Mathematical formulas and execution-framework contracts both need attention: satisfying one does not automatically satisfy the other. [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

The release also addresses evolution-strategy initialization and subspaces, tournament selection, PSO device transfers and hypervolume handling. [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## Reliability is part of the infrastructure

The SHADE correction adds a regression test that runs five workflow steps, checks that the adaptation memory changes and verifies that it remains finite. For comparisons across versions, record the seed, objective, population and evaluation budget, then rerun affected baselines. The [release notes](/releases/evox-1-4-1) provide the upgrade reference.
