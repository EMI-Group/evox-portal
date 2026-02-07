---
title: "使用 EvoX 進行高效 HPO"
order: 13
section: "examples"
---

# 使用 EvoX 進行高效 HPO

在本章中，我們將探討如何使用 EvoX 進行超參數最佳化（HPO）。

HPO 在許多機器學習任務中扮演著至關重要的角色，但由於其高計算成本（有時需要數天處理）以及部署中的挑戰，它經常被忽視。

透過 EvoX，我們可以使用 `HPOProblemWrapper` 簡化 HPO 部署，並透過利用 `vmap` 方法和 GPU 加速來實現高效計算。

## 將工作流程轉換為問題

![HPO structure](/_static/HPO_structure.png)

使用 EvoX 部署 HPO 的關鍵是使用 `HPOProblemWrapper` 將 `workflows` 轉換為 `problems`。轉換後，我們可以將 `workflows` 視為標準的 `problems`。「HPO 問題」的輸入由超參數組成，輸出是評估指標。

## 關鍵元件 -- `HPOProblemWrapper`

為了確保 `HPOProblemWrapper` 識別超參數，我們需要使用 `Parameter` 來包裝它們。透過這個簡單的步驟，超參數將被自動識別。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## 使用 `HPOFitnessMonitor`

我們提供了一個 `HPOFitnessMonitor`，它支援計算多目標問題的 'IGD' 和 'HV' 指標，以及單目標問題的最小值。

需要注意的是，`HPOFitnessMonitor` 是為 HPO 問題設計的基本監控器。您也可以使用[使用自訂演算法部署 HPO](#/guide/developer/custom_hpo_prob)中概述的方法靈活地建立自己的自訂監控器。

## 簡單範例

這裡，我們將展示一個使用 EvoX 進行 HPO 的簡單範例。具體來說，我們將使用 [PSO](#PSO) 演算法來最佳化 [PSO](#PSO) 演算法的超參數，以求解 sphere 問題。

請注意，本章僅提供 HPO 部署的簡要概述。更詳細的指南請參閱[使用自訂演算法部署 HPO](#/guide/developer/custom_hpo_prob)。

首先，讓我們匯入必要的模組。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

接下來，我們定義一個簡單的 Sphere 問題。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

接下來，我們可以使用 `StdWorkflow` 來包裝 `problem`、`algorithm` 和 `monitor`。然後我們使用 `HPOProblemWrapper` 將 `StdWorkflow` 轉換為 HPO 問題。

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

`HPOProblemWrapper` 接受 4 個參數：
1. `iterations`：最佳化過程中要執行的迭代次數。
2. `num_instances`：最佳化過程中要平行執行的實例數量。
3. `workflow`：最佳化過程中要使用的工作流程。
4. `copy_init_state`：是否為每次評估複製工作流程的初始狀態。預設為 `True`。如果您的工作流程包含對初始狀態中的張量進行就地修改的操作，則應設定為 `True`。否則，您可以設定為 `False` 以節省記憶體。

我們可以驗證 `HPOProblemWrapper` 是否正確識別了我們定義的超參數。由於 5 個實例之間沒有對超參數進行修改，它們在所有實例中應該是相同的。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

我們也可以定義一組自訂的超參數值。重要的是確保超參數集的數量與 `HPOProblemWrapper` 中的實例數量匹配。此外，自訂超參數必須以字典形式提供，其值使用 `Parameter` 包裝。

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

現在，我們使用 [PSO](#PSO) 演算法來最佳化 [PSO](#PSO) 演算法的超參數。

重要的是確保 [PSO](#PSO) 的種群大小與實例數量匹配；否則可能會發生意外錯誤。

此外，需要在外部工作流程中轉換解，因為 `HPOProblemWrapper` 要求輸入為字典形式。

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```
