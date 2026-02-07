---
title: "Otimização Numérica"
order: 9
section: "examples"
---

# Otimização Numérica

Este notebook oferece um tutorial passo a passo sobre a utilização do EvoX para otimizar a função Ackley através do algoritmo de Otimização por Enxame de Partículas (PSO). Tanto o algoritmo PSO como o problema de otimização Ackley estão integrados como componentes nativos na framework EvoX.

Primeiro, devemos importar todos os módulos necessários incluindo `PSO` (algoritmo), `Ackley` (problema) e `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Aqui, instanciamos o algoritmo `PSO`. Especificamos as seguintes definições:

- `pop_size`: O tamanho do enxame de partículas (população).
- `lb` e `ub`: Os limites inferior e superior para cada dimensão no espaço de busca.
- Outros parâmetros são todos padrão. Por favor, consulte a API detalhada.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

A seguir, escolhemos a função `Ackley` nos problemas numéricos do EvoX.

```python
# Define the problem
problem = Ackley()
```

Criamos uma instância `EvalMonitor` para acompanhar informações necessárias durante o procedimento de otimização.

```python
# Define the monitor
monitor = EvalMonitor()
```

A classe `StdWorkflow` fornece um processo padronizado para integrar o algoritmo, problema e monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Chamar `setup()` inicializa os componentes para que o workflow esteja pronto para realizar passos de otimização.

Executamos a otimização durante um certo número de iterações (100 neste exemplo). Em cada iteração, o método `step()` atualiza o algoritmo PSO, avalia novas soluções candidatas na função Ackley e acompanha a sua aptidão através do monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Finalmente, recuperamos o submódulo `monitor` do workflow para aceder às melhores soluções encontradas até agora (`topk_solutions`) e os seus valores objetivo correspondentes (`topk_fitness`). Depois imprimimos o melhor resultado e a solução associada.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
