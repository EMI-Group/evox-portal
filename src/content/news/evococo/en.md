---
title: "EvoCoCo: Automatic MATLAB-to-EvoX Code Conversion for GPU-Accelerated Multiobjective Optimization"
pubDate: 2026-10-09
summary: "EvoCoCo converts MATLAB multiobjective evolutionary algorithms into GPU-accelerated EvoX implementations through semantics-guided tensorization, execution feedback, and multi-agent validation. Evaluated on 48 algorithms, it achieves 88.2% optimization-fidelity coverage."
---

![EvoCoCo paper title and authors](./title_banner.png)

Can a multiobjective evolutionary algorithm (MOEA) implemented in MATLAB be handed directly to a large language model and automatically rewritten as a GPU-accelerated program? On the surface, this seems to mean replacing MATLAB with PyTorch, arrays with tensors, and loops with batched operations. The real difficulty, however, lies in algorithm semantics: which computations can run in parallel, which depend on an order that must be preserved, which variables are temporary, and which carry state across generations. If these distinctions are wrong, the converted code may run while implementing a different algorithm.

The EvoX team proposes EvoCoCo (Evolutionary Code Conversion), a multi-agent framework for semantics-guided automatic tensorization. It first understands the source algorithm, then explores different tensorized implementations, and finally uses execution feedback to validate, repair, and select candidates. EvoCoCo was evaluated on 48 MOEAs across three dimensions: migration reliability, optimization fidelity, and computational scalability. Overall optimization-fidelity coverage reached 88.2%. Median speedups were 22.6× when scaling population size and 80.2× when scaling decision-variable dimensionality. At a larger scale, the representative algorithm MOEA/D-DE achieved a speedup of 37,339×.

## The Hard Part of Moving to GPUs Is Algorithm Semantics

MOEAs offer substantial population-level parallelism. Objective evaluation, mutation, sorting, environmental selection, and archive operations often process batches of candidate solutions or relationships within a population, making them well suited to parallel execution through tensor computation on GPUs.

Parallelism in an algorithm does not mean that its existing implementation is ready for GPU execution. In PlatEMO, for example, MATLAB code combines vectorized operations with individual-level loops, dynamic containers, conditional branches, iterative extraction of nondominated fronts, object slicing, and various helper functions. Moving this code to a GPU requires reorganizing data representations, control flow, and state updates. This goes beyond simply replacing syntax.

The challenge is to identify which structures define the original algorithm:

- Which variables represent algorithm state that persists across generations?
- Which computations can be rewritten using broadcasting, masks, or batched indexing?
- Which loops contain genuine sequential dependencies and must be preserved?
- Which changes to state and update relationships would alter the optimization mechanism?

EvoCoCo addresses precisely these questions. Conversion may change data layouts, control flow, and execution strategies, while preserving the algorithm’s core operators, persistent state, dependencies, and update logic. This establishes the boundary between what automatic tensorization may restructure and what it must preserve.

## Automatic Tensorization Requires More Than One-Shot Code Generation

EvoCoCo divides code conversion into three stages: understanding, tensorization, and validation and selection. No single agent handles the conversion from beginning to end. The source algorithm is analyzed once to produce a shared semantic representation. Subsequent tensorization candidates are generated from that same representation and blueprint. This separates algorithm understanding from implementation generation.

![EvoCoCo multi-agent architecture](./fig2_architecture.png)

*Figure 1. EvoCoCo’s multi-agent architecture. The Source Analysis Agent reconstructs algorithmic semantics, the Rule Retriever retrieves migration rules, and the Blueprint Agent creates a tensorization blueprint. Multiple Tensorization Agents generate candidates in parallel under shared constraints. Execution feedback drives repair, and the Selection Agent makes the final selection.*

Step 1: Understanding. The Source Analysis Agent reconstructs the source algorithm’s semantics, identifying its core operators, persistent state, dependencies, and update logic. The Rule Retriever retrieves relevant migration rules based on the algorithm’s structure. The Blueprint Agent then creates a shared tensorization blueprint that specifies how state is mapped, how computation is restructured, and which constraints the target framework must satisfy.

Step 2: Tensorization. Under the same blueprint, k Tensorization Agents generate candidates in parallel, with different emphases on broadcasting, einsum optimization, masked operations, in-place updates, advanced tensor operators, and tensorization of iterative selection. They explore different computational implementations of the same algorithm, using the shared understanding of the source code. They do not each reinterpret the source code independently.

Step 3: Validation and selection. Candidate programs undergo static checks and runtime validation. Interface, tensor-shape, device, numerical, or control-flow issues exposed during execution are fed back to the Repair Agent for further repair. Among candidates that pass validation, the Selection Agent chooses the final implementation by considering optimization results, runtime, and the degree of tensorization.

The key idea is to share the understanding of the source algorithm while allowing diverse GPU implementations.

## Execution Feedback Refines the Conversion Process

One-shot translation compresses semantic understanding, framework adaptation, and tensorization design into a single generation step. An error in any one of these areas may become apparent only when the program actually runs, without a mechanism for further diagnosis and repair.

EvoCoCo includes execution in the conversion process. Candidate programs run in the target environment; problems with interfaces, tensor shapes, numerical behavior, and state updates become concrete feedback for repairing candidates. Multiple tensorization branches also provide alternative implementation paths. Code generation becomes a closed loop of generation, execution, repair, and selection.

![Stage-wise conversion outcomes](./figS1_stage_wise.png)

*Figure 2. Stage-wise outcomes across 240 independent conversion attempts per condition. Across three matched-backend comparisons, execution failures accounted for 62.9%–73.8% of one-shot translation attempts, compared with 6.7%–17.5% for EvoCoCo. More candidates could proceed to optimization evaluation.*

This change in where failures occur shows that the feedback loop does more than fix bugs: it lets the target environment help determine which tensorized implementations are actually usable. Many one-shot translations stop at the execution stage. EvoCoCo obtains diagnostic information through actual execution, then repairs and filters candidates so that more implementations can proceed to evaluation of their optimization behavior.

## Successful Execution Is Only the First Step in Migration

EvoCoCo’s experiments address three questions: whether automatic conversion can be completed reliably, whether converted algorithms retain acceptable optimization performance, and whether tensorization can unlock GPU parallelism. The evaluation covers migration reliability, optimization fidelity, and computational scalability.

### 1. Migration Reliability

In comparisons with matched model backends, each condition included 240 independent conversion attempts. EvoCoCo with Gemini 3 Flash achieved an execution pass rate of 93.33% and a convergence pass rate of 78.75%. For each of the 48 benchmark algorithms, EvoCoCo produced at least one implementation that passed convergence validation. The convergence pass rate was 52.08 percentage points higher than one-shot translation using the same backend. It was also 17.08 percentage points higher than GLM-5.1, the best-performing condition among all one-shot translations.

![Convergence pass rates](./fig3_reliability.png)

*Figure 3. EvoCoCo improved the convergence pass rate over one-shot translation in all three matched-backend comparisons. The dashed line represents GLM-5.1, the strongest one-shot translation baseline.*

### 2. Optimization Fidelity

Evolutionary algorithms are stochastic, so element-by-element output comparison from a single run cannot establish whether conversion preserves optimization behavior. The evaluation used independent repeated runs to compare the final inverted generational distance (IGD) values of PlatEMO and EvoX implementations under identical problem settings. The DTLZ, WFG, LSMOP, and MaF suites yielded 1,904 valid comparisons, of which 1,680 met the predefined fidelity criterion, giving overall coverage of 88.2%. Coverage exceeded 80% on all four suites, reaching 96.5% on WFG. Of the 48 algorithms, 41 achieved algorithm-level coverage of at least 80%.

![Optimization-fidelity coverage](./fig4_fidelity_coverage.png)

*Figure 4. Optimization-fidelity coverage for 48 tensorized algorithms. A total of 41 algorithms reached the 80% threshold.*

### 3. Computational Scalability

Across valid CPU–GPU comparisons, the median speedup was 22.6× when scaling population size and 80.2× when scaling decision-variable dimensionality. As problem sizes increased further, GPU implementations generally gained a larger runtime advantage.

| Scaling axis | Valid comparisons | Median speedup | Geometric mean speedup | Interquartile range |
| --- | --- | --- | --- | --- |
| Population size | 289 | 22.6× | 29.9× | 4.5–163.5× |
| Decision-variable dimensionality | 276 | 80.2× | 71.5× | 8.4–404.9× |

Speedups vary substantially across algorithms, but the overall trend is clear: as population size or decision-variable dimensionality increases, semantics-guided tensorization progressively unlocks population-level parallelism that was hidden in CPU program structures. Runtime curves for representative algorithms further illustrate this scaling advantage.

![Runtime scaling curves](./fig6_runtime_scaling.png)

*Figure 5. Panels (a) and (b) show population-size scaling; panels (c) and (d) show decision-variable dimensionality scaling. Annotations indicate speedups at the largest tested scales. MOEA/D-DE reached 37,339× at N = 16,384.*

Beyond the three core evaluations, component ablations and conversion from external sources further tested EvoCoCo’s key mechanisms and conversion capabilities. On a diagnostic subset of 12 algorithms, the full EvoCoCo framework achieved execution and convergence pass rates of 98.3% and 83.3%, respectively. Removing the Repair Agent reduced these rates to 60.0% and 41.7%; using a single generation branch reduced them to 68.3% and 40.0%. These results show that execution feedback and multi-branch generation are especially important for migration reliability. Across 10 external and legacy MATLAB/Octave implementations outside PlatEMO, EvoCoCo achieved an execution pass rate of 96% and a convergence pass rate of 62%. Nine algorithms obtained at least one implementation that passed convergence validation. The corresponding one-shot translation results were 34%, 18%, and 2 algorithms. This indicates that the staged automatic tensorization process can accommodate different code sources and styles, while optimization effectiveness remains the more difficult test.

## Code Can Change; the Algorithm Should Not

Moving from MATLAB to PyTorch and from CPUs to GPUs changes the language, data structures, and execution strategy. The algorithm’s core mechanisms should remain intact.

EvoCoCo is also significant for how it reframes code conversion. It shifts the focus from reproducing statements to identifying what must be preserved. When the computing platform changes, a successful conversion need not reproduce the original program structure. It should allow computation to be reorganized, provided that the relationships defining the algorithm continue to hold.

A programming language is one way to express an algorithm, and hardware is one way to execute computation. What must survive migration across languages and hardware is the structure underlying that computation.

## Open Source Code / Community Resources

Paper: [https://arxiv.org/abs/2609.02387](https://arxiv.org/abs/2609.02387)

GitHub: [https://github.com/EMI-Group/evococo](https://github.com/EMI-Group/evococo)

Upstream Project (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

QQ Group: 297969717

![QQ community QR code](./qq_group_qr.png)

QQ Group | Evolutionary Machine Intelligence

[![EvoX: GPU-accelerated evolutionary computation, PyTorch/JAX](./promo_upstream.png)](https://github.com/EMI-Group/evox)
