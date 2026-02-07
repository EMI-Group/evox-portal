---
title: "多目標演算法"
order: 10
section: "examples"
---

# 多目標演算法

在本筆記本中，我們將使用參考向量引導演化演算法（**RVEA**）來尋找 **DTLZ2** 問題的最優解。

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## （可選）使用 GPU 執行程式碼
我們通常偏好在 GPU 上執行程式碼以獲得更快的執行速度。然而，如果 GPU 不可用，在 CPU 上執行也是可以接受的。

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 執行範例：RVEA 求解 DTLZ2 問題
以下程式碼用於設定 `DTLZ2` 問題和 `RVEA` 演算法。有關問題和演算法的更多資訊，請參閱文件的相應章節。

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

設定完成後，我們現在可以開始最佳化。我們設定讓多目標演算法在此問題上最佳化 100 步

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
