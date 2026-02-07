---
title: "多目标算法"
order: 10
section: "examples"
---

# 多目标算法

在本教程中，我们将使用参考向量引导进化算法（**RVEA**）来寻找 **DTLZ2** 问题的最优解。

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## （可选）使用 GPU 运行代码
我们通常倾向于在 GPU 上运行代码以获得更快的执行速度。但如果 GPU 不可用，在 CPU 上运行也是可以的。

```python
# 优先使用 GPU 运行代码。
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 运行示例：在 DTLZ2 问题上运行 RVEA
以下代码用于设置 `DTLZ2` 问题和 `RVEA` 算法。有关问题和算法的更多信息，请参阅文档的相应章节。

```python
# 初始化问题、算法和工作流。
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

完成设置后，我们现在可以开始优化。我们设置让多目标算法在此问题上优化 100 步。

```python
# 运行工作流 100 步
t = time.time()
workflow.init_step()
for i in range(100):
    compiled_step()
    fit = workflow.algorithm.fit
    fit = fit[~torch.isnan(fit).any(dim=1)]
    if i % 10 == 0:
        print(igd(fit, pf))
```

```python
monitor.plot()
```
