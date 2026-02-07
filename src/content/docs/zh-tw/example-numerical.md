---
title: "數值最佳化"
order: 9
section: "examples"
---

# 數值最佳化

本筆記本提供了使用 EvoX 透過粒子群最佳化（PSO）演算法來最佳化 Ackley 函數的逐步教學。PSO 演算法和 Ackley 最佳化問題都作為內建元件整合在 EvoX 框架中。

首先，我們應該匯入所有必要的模組，包括 `PSO`（演算法）、`Ackley`（問題）和 `StdWorkflow` 及 `EvalMonitor`（工作流程）。

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

在這裡，我們實例化 `PSO` 演算法。我們指定以下設定：

- `pop_size`：粒子群（種群）的大小。
- `lb` 和 `ub`：搜尋空間中每個維度的下界和上界。
- 其他參數均為預設值。請參閱詳細的 API。

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

接下來，我們選擇 EvoX 數值問題中的 `Ackley` 函數。

```python
# Define the problem
problem = Ackley()
```

我們建立一個 `EvalMonitor` 實例來追蹤最佳化過程中的必要資訊。

```python
# Define the monitor
monitor = EvalMonitor()
```

`StdWorkflow` 類別提供了一個標準化的流程來整合演算法、問題和監控器。

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

呼叫 `setup()` 初始化元件，使工作流程準備好執行最佳化步驟。

我們執行一定次數的迭代（本範例中為 100 次）。在每次迭代中，`step()` 方法更新 PSO 演算法，在 Ackley 函數上評估新的候選解，並透過監控器追蹤其適應度。

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

最後，我們從工作流程中檢索 `monitor` 子模組，以存取目前找到的最佳解（`topk_solutions`）及其對應的目標值（`topk_fitness`）。然後我們列印最佳結果和相關的解。

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
