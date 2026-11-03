---
title: "EvoX Quickstart: Run GPU-Accelerated Evolutionary Computation in Just 10 Minutes"
pubDate: 2025-04-30
summary: "A beginner's tutorial to get started with GPU-accelerated evolutionary computation using EvoX in just 10 minutes."
---

On the one hand, Evolutionary Computation is extremely powerful in real-world research and engineering, yet difficult to invoke. On the other hand, the capabilities of GPUs are becoming increasingly powerful, but it is difficult for them to exert their power in evolutionary computing tasks.

We need a truly modern solution: native GPU support, modular architecture, clear interfaces, out-of-the-box usability, and customizable scalability. This is EvoX - an evolutionary computing engine for the future.

To help users get started quickly, the EvoX team has released the "EvoX Beginner's Tutorial". The tutorial consists of 8 chapters, covering everything from the basics to advanced practical application, guiding you step by step on how to run evolutionary algorithms on a GPU.

## Complete Tutorial Resources

Chinese online tutorial:

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Chinese PDF tutorial:

Please join the QQ group to obtain it: 297969717

Next, we will take you through the entire process from installation to operation in just 10 minutes.

## Step 1: Environment Setup

Open your terminal and create a clean Python environment:

```bash
python -m venv .venv
source .venv/bin/activate
```

You can also use your preferred tool to create a clean Python environment.

## Step 2: Install PyTorch and EvoX

```bash
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu128
pip install "evox[vis]"
```

Check whether the GPU is available:

```python
import torch
print(torch.cuda.is_available())
```

## Step 3: Run your first evolutionary algorithm

```python
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
import torch

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2),
    ub=32 * torch.ones(2),
)
problem = Ackley()
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Best fitness:", float(monitor.get_best_fitness()))
```

What does this do? It composes an algorithm (PSO), a problem (Ackley), and a monitor (EvalMonitor) via a standard interface. EvoX takes care of all the parallelism, acceleration, and monitoring!

## Step 4: Plot The Convergence Curve

Only one line is enough:

```python
monitor.plot()
```

![monitor_output.png](./quickstart-7.png)

See that descending curve? That is the **trajectory where your evolutionary algorithm is approaching the target**, and **the path it takes to explore the unknown world.**

## Step 5: Try Extending

If "just running an Ackley" is not satisfying, you can:

- Swap PSO for GA, DE, CMA-ES, NSGA-II, RVEA...
 · Swap Ackley for Rastrigin, Griewank, CEC2022
 · Switch to a multi-objective problem by setting n_objs >= 2
 · Implement your own logic with MyProblem and MyAlgorithm
 · Hook into PyTorch models or reinforcement-learning environments (Gym, Brax, MuJoCo Playground)

Whether it's hyperparameter tuning, architecture search, neuroevolution, or control-strategy optimization, EvoX handles it all with ease.

## Why Choose EvoX?

![表格-英文.png](./quickstart-8.png "表格-英文.png")

## Acknowledgement

This tutorial was written by **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng**, and **Xinyao Li**. **Beichen Huang** was responsible for the collation, editing and online release of the tutorial.

We sincerely thank every member of the EvoX community. It is our joint efforts that have enabled EvoX to keep evolving.

## Resources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
