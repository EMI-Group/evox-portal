---
title: "Mehrziel-Algorithmus"
order: 10
section: "examples"
---

# Mehrziel-Algorithmus

In diesem Notebook verwenden wir den Reference Vector Guided Evolutionary Algorithm (**RVEA**), um die optimalen Lösungen des **DTLZ2**-Problems zu finden.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Optional) GPU verwenden, um den Code auszuführen
Wir bevorzugen es oft, unseren Code auf einer GPU für schnellere Ausführung auszuführen. Wenn jedoch keine GPU verfügbar ist, ist die Ausführung auf einer CPU ebenfalls akzeptabel.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Laufendes Beispiel: RVEA auf dem DTLZ2-Problem
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

Mit dieser Einrichtung können wir nun mit der Optimierung beginnen. Wir lassen den Mehrziel-Algorithmus 100 Schritte auf diesem Problem optimieren.

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
