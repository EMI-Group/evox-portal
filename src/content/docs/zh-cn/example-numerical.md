---
title: "数值优化"
order: 9
section: "examples"
---

# 数值优化

本教程提供了使用 EvoX 通过粒子群优化（PSO）算法优化 Ackley 函数的分步指南。PSO 算法和 Ackley 优化问题都作为内置组件集成在 EvoX 框架中。

首先，我们需要导入所有必要的模块，包括 `PSO`（算法）、`Ackley`（问题）以及 `StdWorkflow` 和 `EvalMonitor`（工作流）。

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

这里，我们实例化 `PSO` 算法。我们指定以下设置：

- `pop_size`：粒子群（种群）的大小。
- `lb` 和 `ub`：搜索空间中每个维度的下界和上界。
- 其他参数均为默认值。请参阅详细的 API 文档。

```python
# 定义算法
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

接下来，我们选择 EvoX 数值问题中的 `Ackley` 函数。

```python
# 定义问题
problem = Ackley()
```

我们创建一个 `EvalMonitor` 实例来跟踪优化过程中的必要信息。

```python
# 定义监视器
monitor = EvalMonitor()
```

`StdWorkflow` 类提供了一个标准化流程来集成算法、问题和监视器。

```python
# 定义工作流
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

调用 `setup()` 初始化各组件，使工作流准备好执行优化步骤。

我们运行一定次数的迭代优化（本例中为 100 次）。在每次迭代中，`step()` 方法更新 PSO 算法，在 Ackley 函数上评估新的候选解，并通过监视器跟踪其适应度。

```python
# 执行 Ackley 函数优化过程
for _ in range(100):
    workflow.step()
```

最后，我们从工作流中获取 `monitor` 子模块，以访问迄今为止找到的最优解（`topk_solutions`）及其对应的目标值（`topk_fitness`）。然后我们打印最佳结果和相关解。

```python
# 获取最佳解及其适应度
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
