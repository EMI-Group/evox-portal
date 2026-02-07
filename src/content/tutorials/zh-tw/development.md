---
title: "5. 開發與擴展"
order: 5
---

# 5. 開發與擴展

EvoX 不僅提供開箱即用的功能，還為開發者和進階使用者提供了豐富的介面，用於自訂開發和擴展整合。本章詳細介紹如何實作自訂演算法和問題、如何利用 EvoX 的 API 進行更深入的控制，以及如何將 EvoX 與其他工具整合以建構更複雜的應用。

## 5.1 開發自訂模組

有時您要解決的問題或想使用的演算法不在 EvoX 的標準函式庫中。在這種情況下，您可以使用 EvoX 提供的介面開發自訂模組。

### 5.1.1 自訂問題（MyProblem）

如果您的目標函數在 `evox.problems` 中不可用，您可以透過繼承 `evox.core.Problem` 基底類別（或符合所需介面）來定義自己的問題。典型的問題類別需要實作一個 `evaluate` 函數，它接收一批解（`pop`）並返回對應的適應度/目標值。為了利用平行計算，EvoX 要求 `evaluate` 支援**批次輸入**。

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

例如，要最小化決策向量的立方和：

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

您可以這樣實作一個 `MyProblem` 類別：

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

這裡，`pop` 是一個形狀為 `(population_size, dim)` 的張量。`evaluate` 函數返回一個一維的適應度值張量。對於多目標問題，您可以返回一個字典，每個目標對應一個鍵。

您可以像使用內建問題一樣使用自訂問題：

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 自訂演算法（MyAlgorithm）

建立自訂演算法更為複雜，因為它包括初始化、產生新解和選擇。要建立新演算法，請繼承 `evox.core.Algorithm` 並至少實作：

- `__init__`：用於初始化。
- `step`：主要的演化步驟邏輯。

以下是在 EvoX 中實作粒子群最佳化（PSO）演算法的範例：

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

要將演算法整合到工作流程中：

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

### 5.1.3 自訂其他模組

您也可以自訂 `Monitor`、`Operator` 或 EvoX 中的任何模組。例如，實作一個 `MyMonitor` 來記錄種群多樣性，或建立一個 `MyOperator` 用於自訂交叉/變異策略。請參考現有的基底類別和範例以了解需要覆寫哪些方法。

## 5.2 使用 API

EvoX 將其 API 組織成模組，使其易於擴展和組合元件。

### 5.2.1 演算法和問題

- **演算法**：位於 `evox.algorithms.so`（單目標）和 `evox.algorithms.mo`（多目標）。

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **問題**：位於 `evox.problems`，包括：
  - `numerical` – 經典測試函數（如 Ackley、Sphere）。
  - `neuroevolution` – 強化學習環境如 Brax。
  - `hpo_wrapper` – 將機器學習訓練包裝為 HPO 問題。

範例：使用 Brax 環境包裝 PyTorch MLP：

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

範例：為 HPO 包裝最佳化過程：

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

### 5.2.2 工作流程和工具

- **工作流程**：`evox.workflows.StdWorkflow` 用於基本最佳化迴圈。
- **監控器**：`EvalMonitor` 用於追蹤效能。

範例：

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **指標**：`evox.metrics` 提供 IGD、超體積等。

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch 互通性**：與 `torch.nn`、`torch.Tensor` 等無縫整合。

## 5.3 與其他工具整合

EvoX 設計為易於與外部工具整合。

### 5.3.1 機器學習整合

使用 EvoX 調整超參數：

1. 將訓練/驗證包裝為 `Problem`。
2. 使用 CMA-ES 等演算法。
3. 在多次執行中最佳化超參數。
4. 使用最佳參數訓練最終模型。

### 5.3.2 強化學習整合

使用 EvoX 演化神經網路策略：

1. 使用 `BraxProblem` 包裝強化學習環境。
2. 使用 `ParamsAndVector` 展平策略網路。
3. 使用 GA 或 CMA-ES 等演化演算法進行最佳化。
4. 直接部署最佳化後的策略或使用強化學習進行微調。

EvoX 支援批次環境模擬以充分利用 GPU/CPU 的能力。

---

**總結而言**，EvoX 提供了強大的模組化 API 和開發者友善的設計，用於實作自訂演算法、包裝任何最佳化問題，以及與機器學習和強化學習工具整合。隨著您加深理解，您可以創造性地應用這些介面來建構量身定制的最佳化解決方案。
