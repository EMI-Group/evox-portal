---
title: "Algorithme Multi-Objectif"
order: 10
section: "examples"
---

# Algorithme Multi-Objectif

Dans ce notebook, nous utiliserons l'algorithme Reference Vector Guided Evolutionary Algorithm (**RVEA**) pour trouver les solutions optimales du problème **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Optionnel) Utiliser un GPU pour exécuter le code
Nous préférons souvent exécuter notre code sur un GPU pour une exécution plus rapide. Cependant, si un GPU n'est pas disponible, l'exécution sur un CPU est également acceptable.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Exemple d'exécution : RVEA sur le problème DTLZ2
Le code suivant est utilisé pour configurer le problème `DTLZ2` et l'algorithme `RVEA`. Plus d'informations sur le problème et l'algorithme sont disponibles dans la section correspondante de la documentation.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Une fois cette configuration en place, nous pouvons maintenant commencer à optimiser. Nous allons laisser l'algorithme multi-objectif optimiser ce problème pendant 100 étapes.

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