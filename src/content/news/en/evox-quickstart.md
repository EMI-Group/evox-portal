---
title: "EvoX Quickstart: Run GPU-Accelerated Evolutionary Computation in Just 10 Minutes"
pubDate: 2025-04-30
summary: "A beginner's tutorial to get started with GPU-accelerated evolutionary computation using EvoX in just 10 minutes."
---

On the one hand, Evolutionary Computation is extremely powerful in real-world research and engineering, yet difficult to invoke. On the other hand, the capabilities of GPUs are becoming increasingly powerful, but it is difficult for them to exert their power in evolutionary computing tasks.

We need a truly modern solution: native GPU support, modular architecture, clear interfaces, out-of-the-box usability, and customizable scalability. This is EvoX - an evolutionary computing engine for the future.

To help users get started quickly, the EvoX team has released the "EvoX Beginner's Tutorial". The tutorial consists of 8 chapters, covering everything from the basics to advanced practical application, guiding you step by step on how to run evolutionary algorithms on a GPU.

**Complete Tutorial Resources**

Chinese online tutorial:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Chinese PDF tutorial:

Please join the QQ group to obtain it: 297969717

Next, we will take you through the entire process from installation to operation in just 10 minutes.

**Step 1: Environment Setup**

Open your terminal and create a clean Python environment:

![代码片段1.png](/images/articles/quickstart-1.png)

You can also use your preferred tool to create a clean Python environment.

**Step 2: Install PyTorch and EvoX**

![代码片段2.png](/images/articles/quickstart-2.png)

Check whether the GPU is available:

![代码片段3.png](/images/articles/quickstart-3.png)

**Step 3: Run your first evolutionary algorithm**

**![代码片段4.png](/images/articles/quickstart-4.png)![图片2.4.png](/images/articles/quickstart-5.png)**

What does this do? It composes an algorithm (PSO), a problem (Ackley), and a monitor (EvalMonitor) via a standard interface. EvoX takes care of all the parallelism, acceleration, and monitoring!

**Step 4: Plot The Convergence Curve**

Only one line is enough:

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

See that descending curve? That is the **trajectory where your evolutionary algorithm is approaching the target**, and **the path it takes to explore the unknown world.**

**Step 5: Try Extending**

If "just running an Ackley" is not satisfying, you can:

· Swap PSO for GA, DE, CMA-ES, NSGA-II, RVEA...
 · Swap Ackley for Rastrigin, Griewank, CEC2022
 · Switch to a multi-objective problem by setting n_objs >= 2
 · Implement your own logic with MyProblem and MyAlgorithm
 · Hook into PyTorch models or reinforcement-learning environments (Gym, Brax, MuJoCo Playground)

Whether it's hyperparameter tuning, architecture search, neuroevolution, or control-strategy optimization, EvoX handles it all with ease.

**Why Choose EvoX?**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**Acknowledgement**

This tutorial was written by **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng**, and **Xinyao Li**. **Beichen Huang** was responsible for the collation, editing and online release of the tutorial.

We sincerely thank every member of the EvoX community. It is our joint efforts that have enabled EvoX to keep evolving.

**Open Source Code / Community Resources**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Upstream Project (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ Group: 297969717

![图片11.png](/images/articles/evox-1-1-0-1.png)

QQ Group | Evolving Machine Intelligence

EvoMO is built upon the EvoX framework. If you are interested in learning more about EvoX, feel free to check out the official article on EvoX 1.0 published on our WeChat public account for further details.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
