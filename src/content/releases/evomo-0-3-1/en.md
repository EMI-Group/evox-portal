---
title: "EvoMO v0.3.1: A Broader Toolkit for Multiobjective Experiments"
pubDate: 2026-10-08
summary: "The v0.3 series expands tensorized algorithms, corrects selection and benchmark behavior, and adds documentation for reproducible comparisons."
---

Multiobjective optimization needs more than a fast objective evaluator: selection must preserve useful trade-offs, benchmark formulas must be correct, and experiment state must survive a restart. EvoMO's [v0.3.1 release][s1], published October 8, 2026 in Beijing time, adds documentation to the v0.3 line. The substantive algorithm expansion and corrections arrived in [v0.3.0 on September 24][s2].

![A cabinet of varied search instruments above a landscape of competing objectives](./cover.webp)

*Concept illustration: different algorithms explore different useful trade-offs.*

## More algorithms on a common tensor foundation

Version 0.3.0 adds 48 tensorized multiobjective algorithms, widening the set of search mechanisms available within EvoMO. Sharing a tensor-oriented foundation makes it easier to compare methods under a common evaluation workflow, but the algorithms retain different selection, variation and state-update rules.

For a study balancing several competing objectives, that breadth supports a controlled comparison: hold the problem, decision bounds, population and evaluation budget fixed while changing the algorithm. The value is access to alternative search behavior. Algorithm count alone does not establish that one method will produce better trade-offs on a particular task.

## Correctness changes affect the comparison itself

The release includes fixes to population updates and selection across multiple methods. Non-dominated sorting stops after completing the cutoff front needed for environmental selection, while crowding-distance handling addresses constant objectives, small populations, masks and device placement. PyTorch remains the default sorting implementation; the optional Triton backend is experimental and selected explicitly. [Selection changes][s3]

Benchmark and metric corrections are equally important. ZDT1–4 and ZDT6 receive row-wise evaluation fixes, including ZDT6's dimension-dependent calculation. Monte Carlo hypervolume handling is corrected for minimization, reference points, empty inputs and sampling devices. If an existing study used affected paths, keep the old results and rerun a controlled comparison rather than mixing values computed by different definitions.

## Constraints and simulation need their own checks

The v0.3 line builds on the constrained-problem support introduced in v0.2.2: 86 constrained benchmarks, constraint-aware NSGA-II and `UnifiedWorkflow`. Subsequent fixes add lazy constraint-buffer registration and checkpoint restoration support, and include constrained Pareto-front resources in distributions. [Constraint baseline][s4]

MoRobtrol also gains Playground/MJX support, task-specific objectives and visualization, with work on observation normalization and checkpoints. For a robotic-control comparison, record the simulator configuration and objective definitions as carefully as the optimizer. An apparently better Pareto set may otherwise reflect a changed task or metric. [Simulation and integration changes][s5]

## Upgrade with a small reference experiment

The [versioned installation guide][s6] installs EvoX first, then EvoMO. To target this release, use `pip install evox` followed by `pip install evomo==0.3.1`, and record the resolved dependency versions. Source installations can use the v0.3.1 tag. The patch adds documentation; the v0.3.0 notes remain the entry point for the underlying functional changes.

Before restarting a large benchmark, check a known objective calculation, a small environmental-selection case and checkpoint restoration with the intended state. For constrained runs, verify feasibility alongside objective quality; for hypervolume, preserve the same reference point and sampling setup. The [GPU-accelerated multiobjective research overview][related] explains why tensorization matters. The v0.3 releases provide a broader and more carefully specified foundation for putting those ideas into experiments.

[s1]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.1
[s2]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.0
[s3]: https://github.com/EMI-Group/evomo/pull/38
[s4]: https://github.com/EMI-Group/evomo/pull/34
[s5]: https://github.com/EMI-Group/evomo/pull/39
[s6]: https://github.com/EMI-Group/evomo/blob/v0.3.1/README.md
[related]: /news/gpu-accelerated-emo
