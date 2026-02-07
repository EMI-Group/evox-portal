---
title: "EvoX 中的自定义算法和问题"
order: 5
section: "developer"
---

# EvoX 中的自定义算法和问题

在本章中，我们将介绍如何在 EvoX 中实现自己的算法和问题。

## 算法和问题的布局

在大多数传统的进化计算库中，算法通常在内部调用目标函数，这产生了以下布局：

```
Algorithm
|
+--Problem
```

**但在 EvoX 中，我们采用扁平布局：**

```
Algorithm.step -- Problem.evaluate
```

这种布局使算法和问题都更加通用：一个算法可以优化不同的问题，而一个问题也可以适用于多种算法。


## Algorithm 类

`Algorithm` 类继承自 `ModuleBase`。

**总共需要实现 5 个方法（其中 2 个是可选的）：**

| 方法         | 签名                                    | 用途                                                                                                               |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | 初始化算法实例，例如种群大小（在迭代过程中保持不变）、超参数（只能由 HPO 问题包装器设置或在此处初始化）和/或可变张量（可以动态修改）。 |
| `step`               | `(self)`                        | 执行算法的一次常规优化迭代步骤。 |
| `init_step`（可选） | `(self)` | 执行算法优化的第一步。如果未重写此方法，将调用 `step` 方法代替。 |

> **注意：**
> 静态初始化仍然可以写在 `__init__` 中，但可变子模块的初始化不能。因此，如果重写的 `setup` 方法首先调用了 `ModuleBase` 的 `setup()`，则可以多次调用 `setup` 进行重复初始化。
>
> 如果 `ModuleBase` 中的 `setup` 方法不适合你的算法，你可以在创建自己的算法类时重写 `setup` 方法。


## Problem 类

`Problem` 类同样继承自 `ModuleBase`。

然而，Problem 类非常简单。**除了 `__init__` 方法外，唯一必要的方法是 `evaluate` 方法。**

| 方法       | 签名                                        | 用途                                          |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | 初始化问题的设置。                            |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | 评估给定种群的适应度。                        |

但是，重写方法中 `evaluate` 的 `pop` 参数类型可以更改为其他 JIT 兼容的类型。


## 示例

这里我们给出一个**实现 PSO 算法求解 Sphere 问题**的示例。

### 示例伪代码

以下是伪代码：

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

以下是算法和问题的各部分在 EvoX 中的对应关系。

```text
Set hyper-parameters # Algorithm.__init__

Generate the initial population # Algorithm.setup
Do
    # Problem.evaluate (not part of the algorithm)
    Compute fitness

    # Algorithm.step
    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### 算法示例：PSO 算法

粒子群优化（PSO）是一种基于种群的元启发式算法，灵感来源于鸟群和鱼群的社会行为。它被广泛用于求解连续和离散优化问题。

**以下是 EvoX 中 PSO 算法的实现示例：**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        # Mutable parameters
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        # Compute fitness
        fitness = self.evaluate(self.population)

        # Update the local best fitness and the global best fitness
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )

        # Update the velocity
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )

        # Update the population
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        # Find the value with the minimum key
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### 问题示例：Sphere 问题

Sphere 问题是一个简单但基础的基准优化问题，用于测试优化算法。

Sphere 函数定义为：

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**以下是 EvoX 中 Sphere 问题的实现示例：**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

现在，你可以初始化工作流并运行它。
