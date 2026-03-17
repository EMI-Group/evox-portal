---
title: "MetaDE: Evolving Differential Evolution by Differential Evolution"
pubDate: 2025-02-15
summary: "MetaDE is a meta-evolutionary method that uses Differential Evolution to evolve its own hyperparameters and strategies, published in IEEE TEVC."
---

Differential Evolution (DE), one of the core algorithms in evolutionary computation, has been widely employed in black-box optimization problems due to its simplicity and high efficiency. Nevertheless, its performance is heavily dependent on the selection of hyperparameters and strategies, a persistent issue for researchers. To address this challenge, the EvoX team recently published a study in *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* entitled "MetaDE: Evolving Differential Evolution by Differential Evolution." As a meta-evolutionary method that leverages DE to evolve its own hyperparametes and strategies, MetaDE enables the dynamic adjustment of parameters and strategies while incorporating GPU-accelerated parallel computing. This design substantially improves computational efficiency alongside optimization performance. Experimental resultsdemonstrate that MetaDE delivers outstanding performance on both the CEC2022 benchmark suite and robot control tasks. The source code for MetaDE is open sourced on GitHu b at [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Background**

In the field of Evolutionary Computation, the performance of algorithms is often significantly influenced by the choice of hyperparameters. Determining the most suitable parameter settings for a specific problem has been a longstanding research challenge. Differential Evolution (DE), as a classical evolutionary algorithm, is widely favored for its simplicity and robust global search capability; nonetheless, its performance is highly sensitive to hyperparameter selection. Conventional methods typically rely on either experience-based tuning or adaptive mechanisms to improve performance. However, in the face of diverse problem scenarios, these approaches frequently struggle to balance efficiency and broad applicability.

The concept of "Meta-Evolution" was introduced as early as the previous century, aiming to use evolutionary algorithms themselves to optimize the hyperparameter configurations of these algorithms. Although meta-evolution has existed for many years, its practical application has been constrained by the high computational demands. Recent advances in GPU computing have eased these constraints, providing strong hardware support for evolutionary algorithms. In particular, the introduction of the distributed GPU-accelerated EvoX framework has greatly facilitated the development of GPU-based evolutionary algorithms. Against this backdrop, our research team proposed a novel meta-evolution approach that leverages DE to evolve its own hyperparameters and strategies, thereby offering a new avenue to solve the longstanding parameter-tuning problem in evolutionary algorithms.



**What Is Meta-Evolution?**

The core idea behind meta-evolution can be summarized as "**using an evolutionary algorithm to evolve itself**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). This concept transcends traditional evolutionary computation methods by not only employing evolutionary algorithms to search for optimal solutions to a problem, but also adapting the algorithms' hyperpa rameters and strategies through their own evolutionary processes.

In other words, meta-evolution introduces a "**self-evolution**" paradigm, enabling algorithms to optimize themselves as they explore the search space for problem solutions. By continuously refining themselves during the evolutionary process, algorithms become more adaptive and can maintain high efficiency in various problem scenarios.

Taking MetaDE as an example, its design is rooted in this philosophy. In a two-layer structure, the lower layer (the "**executor**") solves the given optimization problem using a parameterized DE. The upper layer (the "**evolver**") simultaneously employs DE to optimize the executor's hyperparameter configurations. This framework lets DE not only serve as a solver, but also "explore" how best to adjust its own parameters and strategies to more effectively solve different problems. Such a process is akin to a system incrementally understanding and refining itself--a transformation from **"passively solving a problem" to "actively self-evolving."** Consequently, it can better adapt to diverse tasks. **If we regard DE as a complex system, MetaDE effectively enables a "recursive" manner of self-understanding and self-improvement within this system.**

The term "**recursion**" in computer science typically describes a function or procedure that calls itself. Within MetaDE, this concept takes on a new meaning: it is an **internally recursive** optimization mechanism that employs DE to evolve DE's hyperparameters. This self-referential scheme not only embodies powerful adaptivity, but also provides a novel perspective on the "no free lunch" theorem. Because there is no single, universally optimal set of parameters for all problems, allowing the algorithm to evolve itself autonomously is key to finding the best parameter configurations for a given task.

Through this recursive meta-evolutionary approach, MetaDE achieves several benefits:

**1. Automated Parameter Tuning**

     The labor-intensive manual tuning process is eliminated. The algorithm itself learns how to adjust its hyperparameters, reducing human intervention and improving efficiency.

**2. Enhanced Adaptability**

     MetaDE responds dynamically to changing problem characteristics and conditions, modifying strategies in real time to improve performance. This significantly increases the algorithm's flexibility.

**3. Efficient Search**
      By leveraging inherent parallelism, MetaDE greatly accelerates searches in large-scale optimization problems. It delivers feasible solutions to high-dimensional, complex problems within reasonable time frames.

**Algorithmic Implementation**

MetaDE employs tensor-based techniques and GPU acceleration to enable efficient parallel computing. By processing many individuals of a population simultaneously, the overall computational efficiency is markedly improved, making it particularly advantageous in single-objective black-box optimization and large-scale optimization problems. Through tensorization of key parameters and data structures (e.g., population, fitness, strategy parameters), MetaDE not only achieves higher computational efficiency but also enhances its capacity to tackle complex optimization challenges. Compared with classical DE and other evolutionary algorithms (EAs), MetaDE shows superior performance in solving large-scale problems. Owing to the tensor-based approach, MetaDE harnesses computational resources more effectively, yielding faster solutions and more precise optimization outcomes than traditional methods.

![1.png](/images/articles/metade-4.png "1.png")

PDE Architecture

The research team first proposed a parameterized DE algorithm framework (PDE) that fully supports modifications of parameters and strategies. In this framework, F and CR are continuous parameters, whereas other parameters are discrete. The dashed boxes indicate the range of allowable parameter values. The mutation function is derived from the left and right base vectors, along with the parameter controlling the number of difference vectors.

![2.png](/images/articles/metade-5.png "2.png")

MetaDE Architecture

MetaDE adopts a two-layer structure, comprising **an evolver** (upper layer) and **multiple executors** (lower layer). The evolver is a DE (or potentially another evolutionary algorithm), responsible for optimizing the parameters of PDE. Each individual![spacer.gif](/images/articles/metade-6.gif) x_i in the evolver's population corresponds to a unique parameter configuration θ_i . These configurations are passed to the PDE to instantiate different DE variants, each managed by an executor that runs independently on the given optimization task. Each executor returns its best fitness value y^* to the evolver, which assigns that fitness value y_i to the corresponding individual x_i.



**Experimental Performance**

To comprehensively assess the effectiveness of MetaDE, the research team performed systematic experiments spanning multiple benchmark tests and real-world scenarios. Each experiment used an evolver (DE with rand/1/bin strategy) and executors (PDE with a population size of 100). Key experimental components include:

**CEC2022 Benchmark**
 Comparing MetaDE to various DE variants in single-objective optimization tasks.

**Comparison with the Top Four CEC2022 Algorithms**
 Evaluating MetaDE against the four best-performing algorithms from the CEC2022 competition under identical function evaluations (FEs) budgets.

**Function Evaluations (FEs) Under Fixed Wall-Clock Time**
 Analyzing MetaDE's computational efficiency under GPU acceleration.

**Robot Control Tasks**
 Applying MetaDE to robot control tasks in a Brax platform environment to validate its practical utility.



**CEC2022 Benchmark: Comparison with Mainstream DE Variants**

The team compared MetaDE to several representative DE variants on the CEC2022 benchmark suite, including:

* **Standard DE (rand/1/bin)**
* **SaDE and JaDE (adaptive DE algorithms)**
* **CoDE (DE with strategy integration)**
* **SHADE and LSHADE-RSP (success-history-based adaptive DE)**
* **EDEV (integrated DE variants)**

All algorithms were implemented on the EvoX platform, utilizing GPU acceleration with a population size of 100 for fairness. Experiments were conducted on different dimensionalities (10D and 20D) under **the same computational time constraint (60 seconds)**.

![3.png](/images/articles/metade-7.png "3.png")

10D CEC2022 Optimization Results

![4.png](/images/articles/metade-8.png "4.png")

20D CEC2022 Optimization Results

MetaDE generally achieves more rapid and stable convergence across most test functions. Its parameterized DE (PDE) coupled with upper-layer optimization enables dynamic adaptation to different problem spaces, improving overall robustness and search performance.



**Comparison with Top Four CEC2022 Algorithms (Under Identical FEs)**

To further evaluate MetaDE's optimization capability, we compared it with the top four algorithms from the CEC2022 competition within **the same function evaluation budget**:

* **EA4eig**: A hybrid method integrating multiple EAs
* **NL-SHADE-LBC**: An improved adaptive DE
* **NL-SHADE-RSP-MID**: An enhanced SHADE with midpoint estimation
* **S-LSHADE-DP**: A DE variant maintaining population diversity through dynamic perturbation

Each of these algorithms was run with its official parameter settings and source code under **the same FE constraints**. Statistical comparisons (Wilcoxon rank-sum test, significance level 0.05)

were conducted between MetaDE and each baseline on the CEC2022 test suite. The last row of the table shows the performance of each algorithm compared to MetaDE on the different test functions: + (significantly better), ≈ (no significant difference), and − (significantly worse).

![5.png](/images/articles/metade-9.png "5.png")

Comparison of 10D CEC2022 Competition Algorithms (Same FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparison of 20D CEC2022 Competition Algorithms (Same FEs)

MetaDE consistently demonstrates strong performance, especially on complex problems requiring robust convergence. Owing to its **self-adaptive mechanism**, MetaDE effectively adjusts its strategy for different search landscapes, thereby improving search efficiency and global optimization capability. These results indicate that MetaDE not only outperforms mainstream DE variants but also exhibits strong competitiveness against top-tier competition algorithms.



**Computational Efficiency: FEs Within a Fixed Time (60 seconds)**

The research team further recorded **the number of function evaluations (FEs) completed by different algorithms within the same fixed runtime (60 seconds)**.

![图片2.png](/images/articles/metade-11.png)

           FEs Achieved by Each Algorithm in 60 Seconds

Under the same EvoX framework with GPU-accelerated parallel computation, MetaDE on average achieved **10****⁹**-level FEs, whereas traditional DE variants only reached around***10^6*** FEs. This advantage arises from MetaDE's parameterized approach, which conducts **large-scale parallel evaluations** of individuals, enabling **more efficient hardware resource utilization.** Consequently, the algorithm explores more solutions within the same time window, improving both solution quality and stability.



**Evolutionary Reinforcement Learning: Robot Control Tasks**

In Reinforcement Learning (RL), the efficiency and stability of policy optimization are crucial. Gradient-based methods such as PPO and SAC can suffer from gradient vanishing or exploding in high-dimensional environments. By contrast, Evolutionary Reinforcement Learning (EvoRL) circumvents these issues by using **gradient-free searches** to directly optimize policy parameters.

![8.png](/images/articles/metade-12.png "8.png")

Evolutionary Reinforcement Learning Process

Within the EvoRL framework, MetaDE:

* **Automatically optimizes neural network parameters**, increasing the adaptability of policy models.
* **Dynamically adjusts hyperparameters**, improving training stability.
* **Leverages GPU acceleration** to speed up policy optimization.

To evaluate MetaDE's performance on complex optimization tasks, we applied it to **robot control problems** using GPU-accelerated optimization in the **Brax simulation platform**. The study included three tasks--**Swimmer**, **Hopper**, and **Reacher**--each modeled by a three-layer fully connected neural network (MLP) with the objective of **maximizing the reward**. Notably, each MLP contains about **1,500 parameters**, creating a **1,500-dimensional optimization challenge** for evolutionary algorithms (EAs). This imposes stringent requirements on both search capability and computational efficiency.

![9.png](/images/articles/metade-13.png "9.png")

Convergence Curves for Three Brax Environments

As shown in the figure, MetaDE demonstrates strong performance in Brax-based robot control tasks, achieving the best results on the Swimmer task and near-optimal results on Hopper and Reacher. Its main advantage lies in the high quality of the initial population, enabling rapid early-stage convergence and producing high-quality solutions. These findings suggest that MetaDE can **efficiently optimize neural network policies**, making it **well-suited for robot control tasks with complex physical simulations** and **offering broad potential for practical applications**.



**Conclusion and Future Directions**

MetaDE is an innovative meta-evolution approach that not only excels in solving optimization tasks but also autonomously tunes and refines its own strategies. Capitalizing on the strengths of Differential Evolution, MetaDE exhibits strong potential in adaptive parameter configuration and strategy evolution. Experimental results show superior robustness in a range of benchmark tests, and its real-world applicability is underscored by success in robot control tasks via evolutionary reinforcement learning. A core challenge involves maintaining an optimal balance between generalization and specialization--ensuring that the algorithm can adapt to diverse tasks while also optimizing effectively for specific problems. This research offers new perspectives for self-adaptive evolutionary algorithms and may spur further advances in meta-evolution for complex systems.



**Open-Source Code and Community**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Upstream Project (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ Group**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

  QQ Group | Evolving Machine Intelligence

MetaDE is built on the EvoX framework. If you are interested in EvoX, please check out the article on EvoX 1.0 for more details.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")
