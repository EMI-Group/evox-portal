---
title: "Algoritmo Multiobjetivo"
order: 10
section: "examples"
---

# Algoritmo Multiobjetivo

En este notebook, utilizaremos el Reference Vector Guided Evolutionary Algorithm (**RVEA**) para encontrar las soluciones óptimas del problema **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Opcional) Usar GPU para ejecutar el código
A menudo preferimos ejecutar nuestro código en una GPU para una ejecución más rápida. Sin embargo, si no hay una GPU disponible, ejecutarlo en una CPU también es aceptable.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Ejemplo de ejecución: RVEA en el problema DTLZ2
El siguiente código se utiliza para configurar el problema `DTLZ2` y el algoritmo `RVEA`. Se puede encontrar más información sobre el problema y el algoritmo en la sección correspondiente de la documentación.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Con esta configuración lista, ahora podemos comenzar a optimizar. Configuramos el algoritmo multiobjetivo para que optimice durante 100 pasos en este problema.

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