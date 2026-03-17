---
title: "Otimização Numérica"
order: 9
section: "examples"
---

# Otimização Numérica

Este notebook oferece um tutorial passo a passo sobre como utilizar o EvoX para otimizar a função Ackley através do algoritmo Particle Swarm Optimization (PSO). Tanto o algoritmo PSO como o problema de otimização Ackley estão integrados como componentes nativos no framework EvoX.

Primeiro, devemos importar todos os módulos necessários, incluindo `PSO` (algoritmo), `Ackley` (problema) e `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Aqui, instanciamos o algoritmo `PSO`. Especificamos as seguintes configurações:

- `pop_size`: O tamanho do enxame de partículas (população).
- `lb` e `ub`: Os limites inferior (lower bound) e superior (upper bound) para cada dimensão no espaço de procura.
- Os restantes parâmetros são todos os pré-definidos (default). Por favor, consulte a API detalhada.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Em seguida, escolhemos a função `Ackley` nos problemas numéricos do EvoX.

```python
# Define the problem
problem = Ackley()
```

Criamos uma instância de `EvalMonitor` para acompanhar a informação necessária durante o procedimento de otimização.

```python
# Define the monitor
monitor = EvalMonitor()
```

A classe `StdWorkflow` fornece um processo padronizado para integrar o algoritmo, o problema e o monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Chamar `setup()` inicializa os componentes para que o workflow esteja pronto para realizar os passos de otimização.

Executamos a otimização durante um determinado número de iterações (100 neste exemplo). Em cada iteração, o método `step()` atualiza o algoritmo PSO, avalia novas soluções candidatas na função Ackley e monitoriza o seu fitness através do monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Finalmente, recuperamos o submódulo `monitor` do workflow para aceder às melhores soluções encontradas até ao momento (`topk_solutions`) e aos seus valores de objetivo correspondentes (`topk_fitness`). Em seguida, imprimimos o melhor resultado e a solução associada.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```