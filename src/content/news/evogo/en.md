---
title: "EvoGO: Learning How to Search from Evaluation Feedback"
pubDate: 2026-04-05
updatedDate: 2026-11-08
summary: "EvoGO connects generative learning with evolutionary optimization, turning evaluated candidates into experience for proposing the next population."
---

Scientific and engineering search repeatedly asks which experiment to run next. EvoGO studies a computational version of that question: can evaluations teach a generator how to improve its proposals? This connects EvoX's evolutionary AI direction to a search process that learns from the candidates it has already tested. [EvoGO](https://github.com/EMI-Group/evogo)

![Directional stencils focus a red search path](./learning-search-directions.webp)

## Predicament: Data-Driven Optimization Has Still Not Taken the Final Step

In recent years, data-driven evolutionary optimization methods have developed rapidly. Surrogate-assisted methods and generative-model-based methods have already pushed evolutionary optimization from fixed-operator-driven search toward learning-driven search. This means that learning models have begun to enter multiple stages of the pipeline, including evaluation, modeling, and even generation.

Yet this transformation is still incomplete. Existing methods may have learned how to “evaluate” or “generate” at different levels, but they have not truly learned how to “optimize.” On the one hand, the production of the next generation of candidate solutions still often depends on manually designed heuristic rules for coordination. On the other hand, the generation objective and the optimization objective are often insufficiently aligned. At the same time, the extremely limited online samples available in black-box optimization have not yet been systematically transformed into learnable and transferable optimization experience.

Therefore, what is truly missing today is not more models per se, but the final step: enabling optimization algorithms to directly learn the process of moving from worse solutions to better ones from historical data. This is exactly the step that EvoGO seeks to push forward.

## Breakthrough: How EvoGO Rewrites the Optimization Pipeline

To address the issues above, EvoGO does not continue along the traditional route of improving local operators such as crossover and mutation. Instead, it attempts to rewrite the optimization pipeline at a more holistic level. Its core idea is to remove the process of “how to generate the next generation of candidate solutions” from manually written rules and hand it over to a data-driven generative mechanism to learn. Specifically, EvoGO organizes the entire optimization process into three unified stages—**data preparation, model training, and population generation**—so that experience organization, directional learning, and population updating are no longer fragmented, but instead integrated into a single optimization loop.

![image2](./image2.png)

In the data preparation stage, EvoGO first filters high-quality samples from historical populations to build a more reliable training foundation. When samples are scarce, learned augmentation can also be used to alleviate data scarcity. More importantly, the samples are further divided into superior and inferior solutions and organized into paired relationships. As a result, what the model learns is no longer just a static distribution of candidate solutions, but rather the directional relationship of moving from inferior solutions to superior ones.

In the model training stage, EvoGO adopts a paired structure consisting of a surrogate model, a forward generator, and a pseudo-inverse generator. The surrogate model provides an approximate characterization of the objective landscape; the forward generator learns the mapping from inferior solutions to superior ones; and the pseudo-inverse generator maintains training stability through a reconstruction-consistency constraint. Unlike general generation tasks, the training objective here is not merely to fit the data distribution, but to ensure that the generation process moves toward better regions under the guidance of the objective landscape.

In the population generation stage, the trained generative model acts directly on the current population to produce a new generation of candidate solutions in parallel. These solutions are then evaluated by the real objective function, and the population state is updated accordingly before entering the next iteration. At this point, the way population updates are performed changes fundamentally. Traditional evolutionary optimization mainly relies on manually specified crossover, mutation, and selection rules to gradually probe the search space, whereas EvoGO turns this process into a parallel updating mechanism driven by historical data and implemented by a generative model.

EvoGO’s parallelism operates on two levels. On the one hand, the population can be represented in a tensorized form, allowing generation and evaluation of individuals to run in parallel on the GPU. On the other hand, EvoGO can also run multiple generative models simultaneously on a single GPU, enabling parallel optimization across different random seeds or different problem instances. Its parallel capability therefore exists both within populations and across multiple populations.

From this perspective, the key contribution of EvoGO is not simply the introduction of a generative model, but the unification of sample organization, objective alignment, and population updating within a single methodological framework. Traditional evolutionary optimization emphasizes search driven by pre-written rules, whereas EvoGO goes one step further by attempting to let the system learn the search process itself directly from historical data.

## Validation: Performance and Mechanistic Analysis

To rigorously evaluate the effectiveness of this new fully data-driven paradigm, the paper focuses on three key questions: Is EvoGO sufficiently powerful and efficient? What are the crucial design choices behind its success? What intelligent search behavior does it exhibit?

### 1. Performance Comparison: “10-Generation Convergence” Leads Across Benchmarks

The paper conducts a systematic evaluation on three categories of tasks—numerical optimization, classical control, and high-dimensional robotic control—covering 25 benchmark tests with problem dimensions ranging from 10 to 1000. EvoGO is comprehensively compared with Bayesian optimization, classical evolution strategies, heuristic methods, and advanced surrogate-assisted methods.

![image3](./image3.png)

![image4](./image4.png)

Overall, EvoGO shows clear advantages on most tasks. Notably, this advantage is not confined to low-dimensional or relatively regular problems. On the contrary, as problem dimensionality and task complexity increase, EvoGO’s advantage often becomes more pronounced. Under low-dimensional and small-sample conditions, some of the strongest surrogate-assisted methods remain highly competitive. But once the problems become high-dimensional, complex, and dependent on parallel computation, EvoGO’s generative mechanism is able to unfold more fully, and on most large-scale tasks it can converge in roughly 10 generations. This suggests that EvoGO’s value does not lie in achieving local superiority on a single type of problem, but in being better suited to the large-scale experience utilization and parallel search required by complex black-box optimization.

![image5](./image5.png)

This is especially evident in the high-dimensional robotic control environment Hopper in Brax. Under the same function-evaluation budget and runtime budget, EvoGO significantly outperforms traditional optimization algorithms such as CMA-ES and TPE, and also surpasses the PPO reinforcement learning algorithm, which requires online interaction with the environment. More importantly, thanks to the parallel computing power of modern hardware such as GPUs, EvoGO can reach a high reward level in about 500 seconds. When CMA-ES finally converges to its best performance level, the actual wall-clock time required for EvoGO to reach the same performance is much shorter—up to 134× speedup. This result shows that EvoGO’s advantage is not merely in reducing the number of generations, but in the fact that its search process itself is better matched to parallel computing resources, compressing optimization actions that would otherwise be spread across many generations into a high-throughput generative update process.

### 2. Ablation Study: Dissecting the Keys to Success

To verify the necessity of the core components in EvoGO’s “fully data-driven” design, the research team conducted systematic ablations centered on the paired generative architecture, the surrogate-guidance mechanism, and the optimization-oriented objective design. Five variants were constructed: a single-generator version, a no-surrogate version, an adversarial-objective version, an MLP-surrogate version, and a heuristic-surrogate version.

The experimental results show that the paired generative architecture, the surrogate-guidance mechanism, and the optimization-oriented objective design are all crucial to EvoGO’s effectiveness. Removing the pseudo-inverse generator leads to noticeably worse convergence stability and reduced population diversity, indicating that the paired structure formed by forward generation and inverse constraints is necessary for maintaining training stability and avoiding mode collapse. Removing the surrogate model, or replacing the original optimization objective with a general adversarial objective, also causes significant performance degradation, showing that surrogate guidance and objective alignment are central to the method’s advantage. Replacing the Gaussian process with a multilayer perceptron or heuristic rules still leaves the method functional, but with a slight overall decline, indicating that EvoGO does not depend on a specific surrogate form, although explicit uncertainty modeling is more beneficial for performance. Overall, EvoGO’s performance gains do not come from any single module, but from the synergy among the paired generative architecture, the surrogate-guidance mechanism, and the optimization-oriented objective design.

### 3. Behavior Visualization: Revealing a Data-Driven Dynamic Process

To more intuitively analyze EvoGO’s search dynamics, the paper presents a visualization experiment on the two-dimensional Ackley function, with the population size set to 100. Specifically, at different evolutionary generations, the transformation results of the trained forward generator on input solutions are recorded—that is, the mapping process from input solutions to output solutions is tracked. In the figure, arrows represent vectors from input solutions to output solutions, and their colors correspond to vector lengths. The star marks the global optimum, and dashed boxes indicate the regions covered by generated solutions in different generations. For clarity, the translation and rotation settings of the function landscape are omitted in this visualization.

![image7](./image7.png)

The visualization results show that what EvoGO learns is not directionless random perturbation, but an update pattern that adapts with the search stage. In the early stage, the generated vectors are generally longer, indicating that the algorithm tends toward large-amplitude global exploration. As evolution proceeds, vector lengths gradually decrease and the generated regions continue to contract, showing that the search shifts toward finer local exploitation. At the same time, the vectors as a whole gather toward the optimal region, indicating that the forward generator has already extracted a practically meaningful search direction from historical samples. At the behavioral level, this phenomenon supports EvoGO’s central property: it learns not merely the distribution of candidate solutions, but the update law that moves from the current state toward a better state.

## From benchmarks to scientific workflows

Generative search could be explored for engineering design, but a benchmark result does not establish airfoil-design accuracy or aircraft deployment. An engineering evaluation would need a defined dataset, held-out cases, constraint checks and independent simulator or experimental validation. The linked EvoGO paper reports numerical, control and robotics benchmarks; it does not establish quantitative airfoil-design results.

## Conclusion and Outlook

Choose one benchmark and preserve its evaluation history. Compare learned proposals with a baseline under the same evaluation budget, recording model-training time separately. [EvoGM: Autonomous LLM Merging via Population Evolution Without Retraining](/news/evogm)

## Resources

- [Research paper](https://arxiv.org/abs/2508.00380)
- [GitHub](https://github.com/EMI-Group/evogo)
- [EvoX](https://github.com/EMI-Group/evox)
