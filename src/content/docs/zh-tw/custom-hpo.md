---
title: "使用自訂演算法部署 HPO"
order: 6
section: "developer"
---

# 使用自訂演算法部署 HPO

在本章中，我們將重點介紹使用自訂演算法部署 HPO，強調細節而非整體工作流程。HPO 部署的簡要介紹在[教學](#/tutorial/tutorial_part7)中提供，強烈建議先閱讀。

## 使演算法可平行化

由於我們需要將內部演算法轉換為問題，因此內部演算法必須是可平行化的。因此，可能需要對演算法進行一些修改。

1. 演算法不應有對演算法自身屬性進行就地操作的方法。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. 程式碼邏輯不依賴 Python 控制流。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #attribute of the algorithm itself
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # function with python control flow
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # function without python control flow
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```


## 使用 HPOMonitor

在 HPO 任務中，我們應使用 `HPOMonitor` 來追蹤每個內部演算法的指標。與標準 `monitor` 相比，`HPOMonitor` 僅增加了一個方法 `tell_fitness`。此新增旨在提供更大的評估指標靈活性，因為 HPO 任務通常涉及多維度和複雜的指標。

使用者只需建立 `HPOMonitor` 的子類別並覆寫 `tell_fitness` 方法來定義自訂評估指標。

我們還提供了一個簡單的 `HPOFitnessMonitor`，它支援計算多目標問題的 'IGD' 和 'HV' 指標，以及單目標問題的最小值。

## 簡單範例

這裡，我們將展示一個如何在 EvoX 中使用 HPO 的簡單範例。我們將使用 `PSO` 演算法來搜尋一個基本演算法的最優超參數，以求解 sphere 問題。

首先，讓我們匯入必要的模組。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

接下來，我們定義一個簡單的 sphere 問題。請注意，這與普通的 `problems` 沒有區別。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

接下來，我們定義演算法，使用 `torch.cond` 函數並確保它是可平行化的。具體來說，我們修改就地操作並調整 Python 控制流。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # the hyperparameters to be optimized
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # one update strategy
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  #  the other update strategy
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simply random sampling
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

為了處理 Python 控制流，我們使用 [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html)，接下來，我們可以使用 `StdWorkflow` 來包裝 `problem`、`algorithm` 和 `monitor`。然後我們使用 `HPOProblemWrapper` 將 `StdWorkflow` 轉換為 HPO 問題。

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

我們可以測試 `HPOProblemWrapper` 是否正確識別了我們定義的超參數。由於我們沒有對 7 個實例的超參數進行修改，它們在所有實例中應該是相同的。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

我們也可以指定自己的一組超參數值。請注意，超參數集的數量必須與 `HPOProblemWrapper` 中的實例數量匹配。自訂超參數應以字典形式提供，其值使用 `Parameter` 包裝。

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

現在，我們使用 `PSO` 演算法來最佳化 `ExampleAlgorithm` 的超參數。請注意，`PSO` 的種群大小必須與實例數量匹配；否則可能會發生意外錯誤。在這種情況下，我們需要在外部工作流程中轉換解，因為 `HPOProblemWrapper` 要求字典作為輸入。

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {"self.algorithm.hp": x}


outer_algo = PSO(7, -3 * torch.ones(4), 3 * torch.ones(4))
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow()
outer_workflow.setup(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
for _ in range(20):
    outer_workflow.step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```
