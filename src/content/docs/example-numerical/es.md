---
title: "Optimización Numérica"
order: 9
section: "examples"
---

# Optimización Numérica

Este notebook ofrece un tutorial paso a paso sobre cómo utilizar EvoX para optimizar la función Ackley mediante el algoritmo Particle Swarm Optimization (PSO). Tanto el algoritmo PSO como el problema de optimización Ackley están integrados como componentes nativos dentro del framework EvoX.

En primer lugar, debemos importar todos los módulos necesarios, incluyendo `PSO` (algoritmo), `Ackley` (problema) y `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Aquí, instanciamos el algoritmo `PSO`. Especificamos los siguientes ajustes:

- `pop_size`: El tamaño del enjambre de partículas (población).
- `lb` y `ub`: Los límites inferior y superior para cada dimensión en el espacio de búsqueda.
- El resto de parámetros se mantienen por defecto. Por favor, consulta la API detallada.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

A continuación, seleccionamos la función `Ackley` dentro de los problemas numéricos de EvoX.

```python
# Define the problem
problem = Ackley()
```

Creamos una instancia de `EvalMonitor` para realizar un seguimiento de la información necesaria durante el procedimiento de optimización.

```python
# Define the monitor
monitor = EvalMonitor()
```

La clase `StdWorkflow` proporciona un proceso estandarizado para integrar el algoritmo, el problema y el monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Al llamar a `setup()` se inicializan los componentes para que el workflow esté listo para ejecutar los pasos de optimización.

Ejecutamos la optimización durante un número determinado de iteraciones (100 en este ejemplo). En cada iteración, el método `step()` actualiza el algoritmo PSO, evalúa las nuevas soluciones candidatas en la función Ackley y registra su fitness a través del monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Finalmente, recuperamos el submódulo `monitor` del workflow para acceder a las mejores soluciones encontradas hasta el momento (`topk_solutions`) y sus correspondientes valores objetivo (`topk_fitness`). A continuación, imprimimos el mejor resultado y la solución asociada.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```