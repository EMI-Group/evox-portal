---
title: "Optimizacion Numerica"
order: 9
section: "examples"
---

# Optimizacion Numerica

Este cuaderno ofrece un tutorial paso a paso sobre como utilizar EvoX para optimizar la funcion Ackley a traves del algoritmo de Optimizacion por Enjambre de Particulas (PSO). Tanto el algoritmo PSO como el problema de optimizacion Ackley estan integrados como componentes incorporados dentro del framework EvoX.

Primero, debemos importar todos los modulos necesarios incluyendo `PSO` (algoritmo), `Ackley` (problema) y `StdWorkflow` & `EvalMonitor` (flujo de trabajo).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Aqui, instanciamos el algoritmo `PSO`. Especificamos las siguientes configuraciones:

- `pop_size`: El tamano del enjambre de particulas (poblacion).
- `lb` y `ub`: Los limites inferior y superior para cada dimension en el espacio de busqueda.
- Otros parametros son todos predeterminados. Consulta la API detallada.

```python
# Definir el algoritmo
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

A continuacion, elegimos la funcion `Ackley` en los problemas numericos de EvoX.

```python
# Definir el problema
problem = Ackley()
```

Creamos una instancia de `EvalMonitor` para rastrear la informacion necesaria durante el procedimiento de optimizacion.

```python
# Definir el monitor
monitor = EvalMonitor()
```

La clase `StdWorkflow` proporciona un proceso estandarizado para integrar el algoritmo, el problema y el monitor.

```python
# Definir el flujo de trabajo
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Llamar a `setup()` inicializa los componentes para que el flujo de trabajo este listo para realizar pasos de optimizacion.

Ejecutamos la optimizacion durante un cierto numero de iteraciones (100 en este ejemplo). En cada iteracion, el metodo `step()` actualiza el algoritmo PSO, evalua nuevas soluciones candidatas en la funcion Ackley y rastrea su aptitud a traves del monitor.

```python
# Realizar el procedimiento de optimizacion de la funcion Ackley
for _ in range(100):
    workflow.step()
```

Finalmente, recuperamos el submodulo `monitor` del flujo de trabajo para acceder a las mejores soluciones encontradas hasta ahora (`topk_solutions`) y sus valores objetivo correspondientes (`topk_fitness`). Luego imprimimos el mejor resultado y la solucion asociada.

```python
# Obtener la mejor solucion y su aptitud
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"La mejor solucion es:\n{population},\ncon el valor minimo:\n{fitness}")
```

```python
monitor.plot()
```
