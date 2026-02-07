---
title: "多目的アルゴリズム"
order: 10
section: "examples"
---

# 多目的アルゴリズム

このノートブックでは、参照ベクトルガイド進化アルゴリズム（**RVEA**）を使用して**DTLZ2**問題の最適解を見つけます。

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## （オプション）GPUを使用してコードを実行
より高速な実行のためにGPU上でコードを実行することが好ましいです。ただし、GPUが利用できない場合は、CPUでの実行も許容されます。

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 実行例：DTLZ2問題でのRVEA
以下のコードは、`DTLZ2`問題と`RVEA`アルゴリズムをセットアップするために使用されます。問題とアルゴリズムの詳細については、ドキュメントの対応するセクションを参照してください。

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

このセットアップが完了したら、最適化を開始できます。多目的アルゴリズムがこの問題で100ステップ最適化するように設定します。

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
