---
title: "7. 实践示例"
order: 7
---

# 7. 实践示例

本章提供了几个完整的实践示例，以演示如何应用前几章的知识。我们将从头构建一个优化项目，并展示 EvoX 如何与其他工具集成。这些示例涵盖了一系列问题类型，旨在帮助您在实际场景中应用 EvoX。

---

## 示例 1：单目标优化

**问题**：优化经典的 Rastrigin 函数：

```math
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

其中 $\mathbf{x} \in \mathbb{R}^d$， $d$ 为维度。全局最优值为 0，位于原点。该函数具有高度多模态性，非常适合用于测试全局优化算法。下面是 Rastrigin 函数的图像

![Rastrigin 函数图像](/_static/rastrigin_function.svg)

*Rastrigin 函数*

在本例中，我们将使用粒子群优化 (PSO) 算法来优化 10 维 Rastrigin 函数。

**步骤 1：设置**

假设您已按照第 2 章的说明配置好了 EvoX 环境。

**步骤 2：工作流设置**

创建一个 Python 脚本 `opt_rastrigin_10.py`：

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

定义 PSO 算法：

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

设置问题和工作流：

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**步骤 3：运行优化**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**示例输出**：

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

正如预期的那样，PSO 算法找到了接近原点的近优解。

---

## 示例 2：多目标优化

**问题**：最小化两个目标：

```math
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Pareto 前沿位于 $x = 0$（$f_1$ 的最优解）和 $x = 2$（$f_2$ 的最优解）之间。

**步骤 1：环境设置**

确保您安装的 EvoX 支持 NSGA-II。

**步骤 2：定义自定义问题**

EvoX 有许多内置的多目标测试问题，但在本例中，我们将定义一个自定义问题来优化这两个目标：

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Import evox core classes, see Chapter 5 for details
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Optional: Define the Pareto front function
    def pf(self) -> torch.Tensor:
        pass
```

**步骤 3：定义算法和工作流**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**步骤 4：优化和可视化**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

我们可以使用 Matplotlib 可视化结果。蓝点代表优化后的种群，红线显示 Pareto 前沿。

![NSGA-II 种群图像](/_static/example_nsga2_result.svg)

*优化后的 NSGA-II 种群图像*

在 Jupyter Notebook 中，您可以使用 EvoX 内置的绘图功能来可视化优化过程，并监控种群随代数的演变情况。

```python
monitor.plot()
```

---

## 示例 3：超参数优化 (HPO)

**问题**：调整乳腺癌数据集上逻辑回归分类器的 `C` 和 `max_iter` 参数，以最大化验证准确率。

**步骤 1：加载数据和模型**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**步骤 2：定义问题**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```

**步骤 3：工作流设置**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**步骤 4：优化**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**示例输出**：

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

只需几行代码，EvoX 就能自动完成繁琐的超参数调优试错过程。

---

这些实践示例展示了 EvoX 如何有效地应用于各个领域，从数学测试函数到机器学习工作流。一旦您熟悉了 **Algorithm + Problem + Monitor + Workflow** 这一基本结构，就可以调整 EvoX 以适应几乎任何优化任务。