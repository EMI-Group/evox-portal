---
title: "使用 EvoX 進行高效 HPO"
order: 13
section: "examples"
---

# 使用 EvoX 進行高效 HPO

在本章中，我們將探討如何使用 EvoX 進行超參數優化（Hyperparameter Optimization, HPO）。

HPO 在許多機器學習任務中扮演著至關重要的角色，但由於其高昂的計算成本（有時需要數天才能處理完畢）以及部署上的挑戰，往往被忽視。

透過 EvoX，我們可以使用 `HPOProblemWrapper` 簡化 HPO 的部署，並利用 `vmap` 方法和 GPU 加速來實現高效計算。

## 將工作流轉化為問題

![HPO structure](/_static/HPO_structure.png)

使用 EvoX 部署 HPO 的關鍵在於使用 `HPOProblemWrapper` 將 `workflows`（工作流）轉換為 `problems`（問題）。轉換完成後，我們可以將 `workflows` 視為標準的 `problems`。'HPO problem' 的輸入由超參數組成，輸出則是評估指標。

## 核心組件 —— `HPOProblemWrapper`

為了確保 `HPOProblemWrapper` 能夠識別超參數，我們需要使用 `Parameter` 對其進行封裝。透過這個簡單的步驟，超參數將被自動識別。

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

值得注意的是，`HPOFitnessMonitor` 是一個專為 HPO 問題設計的基礎監控器。您也可以按照 [使用自定義演算法部署 HPO](/zh-tw/docs/custom-hpo) 中概述的方法，靈活地創建自定義監控器。

## 一個簡單的範例

在這裡，我們將展示一個使用 EvoX 進行 HPO 的簡單範例。具體來說，我們將使用 `PSO` 演算法來優化用於解決 Sphere 問題的 `PSO` 演算法的超參數。

請注意，本章僅提供 HPO 部署的簡要概述。有關更詳細的指南，請參閱 [使用自定義演算法部署 HPO](/zh-tw/docs/custom-hpo)。

首先，讓我們導入必要的模組。

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

接著，我們可以使用 `StdWorkflow` 來封裝 `problem`、`algorithm` 和 `monitor`。然後使用 `HPOProblemWrapper` 將 `StdWorkflow` 轉換為 HPO 問題。

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
1. `iterations`：優化過程中執行的迭代次數。
2. `num_instances`：優化過程中並行執行的實例數量。
3. `workflow`：優化過程中使用的 workflow。
4. `copy_init_state`：是否為每次評估複製 workflow 的初始狀態。預設為 `True`。如果您的 workflow 包含會就地（IN-PLACE）修改初始狀態中張量的操作，則應將其設為 `True`。否則，您可以將其設為 `False` 以節省記憶體。

我們可以驗證 `HPOProblemWrapper` 是否正確識別了我們定義的超參數。由於 5 個實例的超參數未做任何修改，因此所有實例的超參數應保持一致。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

我們也可以定義一組自定義的超參數值。重要的是要確保超參數組的數量與 `HPOProblemWrapper` 中的實例數量相匹配。此外，自定義超參數必須以字典形式提供，其值需使用 `Parameter` 進行封裝。

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

現在，我們使用 `PSO` 演算法來優化 `PSO` 演算法的超參數。

務必確保 `PSO` 的種群大小與實例數量相匹配；否則可能會發生意外錯誤。

此外，解需要在外部 workflow 中進行轉換，因為 `HPOProblemWrapper` 要求輸入必須是字典形式。

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