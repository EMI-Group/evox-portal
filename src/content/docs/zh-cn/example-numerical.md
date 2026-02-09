---
title: "数值优化"
order: 9
section: "examples"
---

# 数值优化

本 Notebook 提供了一个循序渐进的教程，介绍如何利用 EvoX 通过粒子群优化 (PSO) 算法来优化 Ackley 函数。PSO 算法和 Ackley 优化问题都作为内置组件集成在 EvoX 框架中。

首先，我们需要导入所有必要的模块，包括 `PSO`（算法）、`Ackley`（问题）以及 `StdWorkflow` 和 `EvalMonitor`（工作流）。

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

在这里，我们实例化 `PSO` 算法。我们指定以下设置：

- `pop_size`：粒子群（种群）的大小。
- `lb` 和 `ub`：搜索空间中每个维度的下界和上界。
- 其他参数均为默认值。请参阅详细的 API 文档。

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

接下来，我们在 EvoX 的数值问题中选择 `Ackley` 函数。

```python
# Define the problem
problem = Ackley()
```

我们创建一个 `EvalMonitor` 实例，用于在优化过程中跟踪必要的信息。

```python
# Define the monitor
monitor = EvalMonitor()
```

`StdWorkflow` 类提供了一个标准化的流程来集成算法、问题和监控器。

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

调用 `setup()` 会初始化组件，使工作流准备好执行优化步骤。

我们运行一定迭代次数的优化（本例中为 100 次）。在每次迭代中，`step()` 方法会更新 PSO 算法，在 Ackley 函数上评估新的候选解，并通过监控器跟踪它们的适应度。

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

最后，我们从工作流中检索 `monitor` 子模块，以访问目前找到的最优解 (`topk_solutions`) 及其对应的目标值 (`topk_fitness`)。然后我们打印最佳结果及其关联的解。

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```