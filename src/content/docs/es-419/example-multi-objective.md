---
title: "Algoritmo Multiobjetivo"
order: 10
section: "examples"
---

# Algoritmo Multiobjetivo

En este cuaderno, usaremos el Algoritmo Evolutivo Guiado por Vectores de Referencia (**RVEA**) para encontrar las soluciones optimas del problema **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Opcional) Usar GPU para ejecutar el codigo
Frecuentemente preferimos ejecutar nuestro codigo en una GPU para una ejecucion mas rapida. Sin embargo, si una GPU no esta disponible, ejecutar en CPU tambien es aceptable.

```python
# Usar GPU primero para ejecutar el codigo.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Ejemplo de ejecucion: RVEA en el problema DTLZ2
El siguiente codigo se usa para configurar el problema `DTLZ2` y el algoritmo `RVEA`. Mas informacion sobre el problema y el algoritmo se puede encontrar en la seccion correspondiente de la documentacion.

```python
# Inicializar el problema, algoritmo y flujo de trabajo.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Con esta configuracion lista, ahora podemos comenzar a optimizar. Configuramos el algoritmo multiobjetivo para optimizar durante 100 pasos en este problema

```python
# Ejecutar el flujo de trabajo por 100 pasos
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
