---
title: "Multi-Objective-Algorithmus"
order: 10
section: "examples"
---

# Multi-Objective-Algorithmus

In diesem Notebook werden wir den Reference Vector Guided Evolutionary Algorithm (**RVEA**) verwenden, um die optimalen Lösungen des **DTLZ2**-Problems zu finden.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Optional) Verwendung einer GPU zur Ausführung des Codes
Wir bevorzugen oft die Ausführung unseres Codes auf einer GPU für eine schnellere Ausführung. Wenn jedoch keine GPU verfügbar ist, ist die Ausführung auf einer CPU ebenfalls akzeptabel.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Ausführungsbeispiel: RVEA auf dem DTLZ2-Problem
Der folgende Code wird verwendet, um das `DTLZ2`-Problem und den `RVEA`-Algorithmus einzurichten. Weitere Informationen über das Problem und den Algorithmus finden Sie im entsprechenden Abschnitt der Dokumentation.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Mit dieser Einrichtung können wir nun mit der Optimierung beginnen. Wir lassen den Multi-Objective-Algorithmus dieses Problem über 100 Schritte optimieren.

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