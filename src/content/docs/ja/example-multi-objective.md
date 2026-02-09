---
title: "多目的アルゴリズム"
order: 10
section: "examples"
---

# 多目的アルゴリズム

このノートブックでは、Reference Vector Guided Evolutionary Algorithm (**RVEA**) を使用して、**DTLZ2** 問題の最適解を探索します。

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (オプション) GPU を使用してコードを実行する
高速に実行するために、GPU 上でコードを実行することが推奨されます。ただし、GPU が利用できない場合は、CPU で実行することも可能です。

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## 実行例: DTLZ2 問題に対する RVEA
以下のコードは、`DTLZ2` 問題と `RVEA` アルゴリズムを設定するために使用されます。問題とアルゴリズムに関する詳細は、ドキュメントの該当するセクションを参照してください。

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

これで設定が完了したので、最適化を開始できます。ここでは、この問題に対して多目的アルゴリズムを 100 ステップ実行して最適化を行うように設定します。

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