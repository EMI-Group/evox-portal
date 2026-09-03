---
title: "多目标算法"
order: 10
section: "examples"
---

# 多目标算法

在本 Notebook 中，我们将使用参考向量引导演化算法 (**RVEA**) 来寻找 **DTLZ2** 问题的最优解。

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (可选) 使用 GPU 运行代码
我们通常倾向于在 GPU 上运行代码以获得更快的执行速度。但是，如果没有 GPU，在 CPU 上运行也是可以接受的。

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 运行示例：RVEA 求解 DTLZ2 问题
以下代码用于设置 `DTLZ2` 问题和 `RVEA` 算法。关于问题和算法的更多信息可以在文档的相应部分找到。

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

设置完成后，我们现在可以开始优化。我们将该多目标算法设置为在此问题上优化 100 步。

```python
# Run the workflow for 100 steps
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