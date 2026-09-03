---
title: "5. 开发与扩展"
order: 5
---

# 5. 开发与扩展

EvoX 不仅提供开箱即用的功能，还为开发者和高级用户提供了一套丰富的接口，用于自定义开发和扩展集成。本章详细介绍了如何实现自定义算法和问题，如何利用 EvoX 的 API 进行更深层次的控制，以及如何将 EvoX 与其他工具集成以构建更复杂的应用。

## 5.1 开发自定义模块

有时，您要解决的问题或想要使用的算法并未包含在 EvoX 的标准库中。在这种情况下，您可以使用 EvoX 提供的接口开发自定义模块。

### 5.1.1 自定义问题 (MyProblem)

如果您的目标函数在 `evox.problems` 中不可用，您可以通过继承 `evox.core.Problem` 基类（或遵循所需的接口规范）来定义自己的问题。典型的问题类需要实现一个 `evaluate` 函数，该函数接收一批解 (`pop`) 并返回相应的适应度/目标值。为了利用并行计算，EvoX 要求 `evaluate` 支持**批量输入**。

```python
import torch
from abc import ABC
from typing import Any, Dict
from evox.core.module import ModuleBase

class Problem(ModuleBase, ABC):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor) -> torch.Tensor:
        return torch.empty(0)
```

例如，要最小化决策向量的立方和：

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

您可以像这样实现一个 `MyProblem` 类：

```python
import torch
from evox.core import Problem

class MyProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        fitness = torch.sum(pop**3, dim=1)
        return fitness
```

这里，`pop` 是一个形状为 `(population_size, dim)` 的张量。`evaluate` 函数返回一个适应度值的一维张量。对于多目标问题，您可以返回一个字典，其中包含每个目标的单独键。

您可以像使用内置问题一样使用您的自定义问题：

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 自定义算法 (MyAlgorithm)

创建自定义算法稍微复杂一些，因为它涉及初始化、生成新解和选择。要创建一个新算法，请继承 `evox.core.Algorithm` 并至少实现：

- `__init__`：用于初始化。
- `step`：主要的演化步骤逻辑。

下面是在 EvoX 中实现粒子群优化 (PSO) 算法的示例：

```python
import torch
from evox.core import Algorithm, Mutable, Parameter
from evox.utils import clamp
from evox.algorithms.so.pso_variants.utils import min_by

class PSO(Algorithm):
    def __init__(
        self,
        pop_size: int,
        lb: torch.Tensor,
        ub: torch.Tensor,
        w: float = 0.6,
        phi_p: float = 2.5,
        phi_g: float = 0.8,
        device: torch.device | None = None,
    ):
        super().__init__()
        device = torch.get_default_device() if device is None else device
        assert lb.shape == ub.shape and lb.ndim == 1

        self.pop_size = pop_size
        self.dim = lb.shape[0]

        lb = lb[None, :].to(device)
        ub = ub[None, :].to(device)
        length = ub - lb

        pop = length * torch.rand(self.pop_size, self.dim, device=device) + lb
        velocity = 2 * length * torch.rand(self.pop_size, self.dim, device=device) - length

        self.lb = lb
        self.ub = ub

        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)

        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop.clone())
        self.local_best_fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.global_best_location = Mutable(pop[0])
        self.global_best_fit = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        compare = self.local_best_fit > self.fit
        self.local_best_location = torch.where(compare[:, None], self.pop, self.local_best_location)
        self.local_best_fit = torch.where(compare, self.fit, self.local_best_fit)
        self.global_best_location, self.global_best_fit = min_by(
            [self.global_best_location.unsqueeze(0), self.pop],
            [self.global_best_fit.unsqueeze(0), self.fit],
        )
        rg = torch.rand(self.pop_size, self.dim, device=self.fit.device)
        rp = torch.rand(self.pop_size, self.dim, device=self.fit.device)

        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.pop)
            + self.phi_g * rg * (self.global_best_location - self.pop)
        )
        pop = self.pop + velocity
        self.pop = clamp(pop, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)
        self.fit = self.evaluate(self.pop)

    def init_step(self):
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

要将算法集成到工作流中：

```python
import torch
from MyProblems import MyProblem
from evox.workflows import EvalMonitor, StdWorkflow
from evox.algorithms import PSO

problem = MyProblem()
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0])
)
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)
for i in range(10):
    workflow.step()
```

### 5.1.3 自定义其他模块

您还可以自定义 `Monitor`、`Operator` 或 EvoX 中的任何模块。例如，实现一个 `MyMonitor` 来记录种群多样性，或者创建一个 `MyOperator` 用于自定义交叉/变异策略。请参考现有的基类和示例，以了解需要覆盖哪些方法。

## 5.2 使用 API

EvoX 将其 API 组织成模块，使其易于扩展和组合组件。

### 5.2.1 算法和问题

- **算法**：位于 `evox.algorithms.so`（单目标）和 `evox.algorithms.mo`（多目标）中。

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **问题**：位于 `evox.problems` 中，包括：
  - `numerical` – 经典测试函数（例如 Ackley, Sphere）。
  - `neuroevolution` – 强化学习环境，如 Brax。
  - `hpo_wrapper` – 将机器学习训练封装为 HPO 问题。

示例：使用 Brax 环境封装 PyTorch MLP：

```python
import torch.nn as nn
from evox.problems.neuroevolution.brax import BraxProblem

class SimpleMLP(nn.Module):
    ...

policy = SimpleMLP().to(device)
problem = BraxProblem(
    policy=policy,
    env_name="swimmer",
    ...
)
```

示例：封装 HPO 的优化过程：

```python
from evox.problems.hpo_wrapper import HPOProblemWrapper
...
hpo_problem = HPOProblemWrapper(
    iterations=30,
    num_instances=128,
    workflow=inner_workflow,
    copy_init_state=True
)
```

### 5.2.2 工作流和工具

- **工作流**：`evox.workflows.StdWorkflow` 用于基本的优化循环。
- **监控器**：`EvalMonitor` 用于跟踪性能。

示例：

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **指标**：`evox.metrics` 提供 IGD, Hypervolume 等。

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch 互操作性**：与 `torch.nn`、`torch.Tensor` 等无缝集成。

## 5.3 与其他工具集成

EvoX 旨在轻松与外部工具集成。

### 5.3.1 机器学习集成

使用 EvoX 调整超参数：

1. 将训练/验证封装为 `Problem`。
2. 使用像 CMA-ES 这样的算法。
3. 在多次运行中优化超参数。
4. 使用最佳参数训练最终模型。

### 5.3.2 强化学习集成

使用 EvoX 演化神经网络策略：

1. 使用 `BraxProblem` 封装 RL 环境。
2. 使用 `ParamsAndVector` 展平策略网络。
3. 使用 GA 或 CMA-ES 等演化算法进行优化。
4. 直接部署优化后的策略或使用 RL 进行微调。

EvoX 支持批量环境模拟，以充分利用 GPU/CPU 算力。

---

**总之**，EvoX 提供了强大、模块化的 API 和对开发者友好的设计，用于实现自定义算法、封装任何优化问题以及与 ML 和 RL 工具集成。随着您理解的加深，您可以创造性地应用这些接口来构建定制的优化解决方案。