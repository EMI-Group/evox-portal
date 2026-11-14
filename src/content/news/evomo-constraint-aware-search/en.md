---
title: "EvoMO: Keep Feasibility Attached to Every Candidate"
pubDate: 2026-10-30
updatedDate: 2026-11-14
summary: "Constraint-aware selection, aligned odd populations and a more efficient OSP-NSDE path make multiobjective experiments easier to control."
---

A good objective value is useful only if the candidate also satisfies the problem's constraints. On October 30, 2026, EvoMO merged [PR #48][s1] into main, extending constraint handling across existing multiobjective algorithms and correcting population bookkeeping. The update connects three concerns that often surface together in experiments: which solutions survive, whether their stored state stays aligned, and how much selection costs.

![Candidate paths cross a constraint boundary through a selected gate](./cover.webp)

*Concept illustration: feasibility travels with the candidate throughout selection.*

## Feasibility must survive the whole workflow

A constrained problem can return `(fitness, cv)`, pairing objective values with constraint violations. The merged implementation carries this information through initialization, probes, mating, archives and survivor updates. Shared utilities address positive total violation, ties and different constraint shapes while keeping decisions, fitness and constraint state indexed together.

That matters when two candidates exchange positions during selection: their feasibility information must follow them. Consider a design search balancing performance and resource use under a hard operating limit. Sorting only the objectives could retain a visually attractive but infeasible design. Carrying constraint state gives each algorithm the information needed to apply its documented selection rule. The precise rule remains algorithm-specific.

## An odd population should remain a valid population

The same change fixes first-generation shape mismatches for requested population sizes such as 51 in eight algorithms, including SparseEA, SparseEA2, DMMOEA and OSP_NSDE. Parent pairing and offspring counts now stay aligned with masks, fitness and constraints. This is especially relevant when a population size comes from an experimental budget rather than a convenient even number.

Sparse and dynamic algorithms also receive reference-flow corrections. DMMOEA detects environmental changes by reevaluating sampled solutions and refreshes cached fitness and constraint values. SparseEA-family changes keep decision variables and sparsity masks together during variation and selection. These details affect which search is actually being executed, not just whether a run completes.

## Faster selection with explicit execution limits

OSP-NSDE sorts neighbor distances once and updates them after deletions. Optional Triton kernels move supported cutoff-front truncation onto CUDA. The automatic path covers supported devices, float32/float64 and requested populations up to 128; other configurations use PyTorch. Non-dominated ranking remains in PyTorch.

For compilation, the documented sequence is to initialize first, then use `torch.compile(workflow.step, fullgraph=False)`. Prediction, local search and mixture-model work still include eager sections. The PR reports local RTX 5060 Ti measurements with synchronized timing and fixed budgets; its full-run results also show that compilation does not always beat optimized eager execution. Choose a path by measuring the complete workload.

Compilation can also change random-number generation and floating-point execution, so the same seed need not produce the same search trajectory. The PR’s five-seed CUDA ZDT3 comparison found worse mean IGD for the compiled path than for eager execution. Measure solution quality alongside runtime at the same evaluation budget before selecting an execution mode. [Quality comparison][s1]

## Check the search before scaling it

Four public algorithms are added: MaOEAHAP, NRVMOEA, HEA and GCNMOEA. The first three explicitly reject constraint tuples; GCNMOEA uses constraint violation in neighborhood replacement while other components remain objective-based. Read those boundaries before treating every available method as interchangeable.

For an existing experiment, pin the [merged source][s2], retain the seed and evaluation budget, and check stored objectives and constraint values against fresh evaluation after a step. Include an odd population and a constrained case in that comparison. Record feasibility, solution quality and runtime separately. The earlier [EvoMO version overview][related] provides the released baseline; this main-branch update supplies the subsequent constraint and selection work.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /releases/evomo-0-3-1
