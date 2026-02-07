---
title: "Multi-Objective Algorithm"
order: 10
section: "examples"
---

# Multi-Objective Algorithm

In this notebook, we will use the Reference Vector Guided Evolutionary Algorithm (**RVEA**) to find the optimal solutions of the **DTLZ2** problem.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Optional) Use GPU to run the code
We often prefer to run our code on a GPU for faster execution. However, if a GPU is unavailable, running on a CPU is also acceptable.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Running example: RVEA on DTLZ2 problem
The following code is used to set up the `DTLZ2` problem and the `RVEA` algorithm. More information about the problem and algorithm can be found in the corresponding section of the documentation.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

With this setup in place, we can now start to optimize. We set to let the multi-objective algorithm optimize for 100 steps on this problem

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
