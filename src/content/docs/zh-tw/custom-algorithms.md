---
title: "EvoX 中的自訂演算法和問題"
order: 5
section: "developer"
---

# EvoX 中的自訂演算法和問題

在本章中，我們將介紹如何在 EvoX 中實作您自己的演算法和問題。

## 演算法和問題的佈局

在大多數傳統的演化計算函式庫中，演算法通常在內部呼叫目標函數，這產生了以下佈局：

```
Algorithm
|
+--Problem
```

**但在 EvoX 中，我們有一個扁平的佈局：**

```
Algorithm.step -- Problem.evaluate
```

這種佈局使演算法和問題都更加通用：一個演算法可以最佳化不同的問題，而一個問題也可以適用於許多演算法。


## Algorithm 類別

`Algorithm` 類別繼承自 `ModuleBase`。

**總共有 5 個方法（其中 2 個是可選的）需要實作：**

| 方法       | 簽名                               | 用途                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | 初始化演算法實例，例如種群大小（在迭代過程中保持不變）、超參數（只能由 HPO 問題包裝器設定或在此處初始化）和/或可變張量（可以即時修改）。 |
| `step`               | `(self)`                        | 執行演算法的一次正常最佳化迭代步驟。 |
| `init_step`（可選） | `(self)` | 執行演算法最佳化的第一步。如果此方法未被覆寫，將改為呼叫 `step` 方法。 |

> **注意：**
> 靜態初始化仍然可以寫在 `__init__` 中，而可變子模組的初始化則不行。因此，如果覆寫的 `setup` 方法首先呼叫 `ModuleBase` 的 `setup()`，則可以多次呼叫 `setup` 進行重複初始化。
>
> 如果 `ModuleBase` 中的 `setup` 方法不適合您的演算法，您可以在建立自己的演算法類別時覆寫 `setup` 方法。


## Problem 類別

`Problem` 類別也繼承自 `ModuleBase`。

然而，Problem 類別非常簡單。**除了 `__init__` 方法外，唯一必要的方法是 `evaluate` 方法。**

| 方法     | 簽名                                   | 用途                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | 初始化問題的設定。       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | 評估給定種群的適應度。 |

然而，覆寫方法中 `evaluate` 的 `pop` 參數類型可以更改為其他 JIT 相容的類型。


## 範例

這裡我們給出一個**實作 PSO 演算法求解 Sphere 問題**的範例。

### 範例的虛擬碼

以下是虛擬碼：

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

以下是演算法和問題的每個部分在 EvoX 中的對應關係。

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

### 演算法範例：PSO 演算法

粒子群最佳化（PSO）是一種基於種群的元啟發式演算法，靈感來自鳥類和魚類的社會行為。它廣泛用於求解連續和離散最佳化問題。

**以下是 EvoX 中 PSO 演算法的實作範例：**

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

### 問題範例：Sphere 問題

Sphere 問題是一個簡單但基本的基準最佳化問題，用於測試最佳化演算法。

Sphere 函數定義為：

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**以下是 EvoX 中 Sphere 問題的實作範例：**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

現在，您可以初始化一個工作流程並執行它。
