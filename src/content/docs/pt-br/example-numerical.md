---
title: "Otimização Numérica"
order: 9
section: "examples"
---

# Otimização Numérica

Este notebook oferece um tutorial passo a passo sobre como utilizar o EvoX para otimizar a função Ackley através do algoritmo de Otimização por Enxame de Partículas (PSO). Tanto o algoritmo PSO quanto o problema de otimização Ackley são integrados como componentes nativos dentro do framework EvoX.

Primeiro, devemos importar todos os módulos necessários incluindo `PSO` (algoritmo), `Ackley` (problema) e `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Aqui, instanciamos o algoritmo `PSO`. Especificamos as seguintes configurações:

- `pop_size`: O tamanho do enxame de partículas (população).
- `lb` e `ub`: Os limites inferior e superior para cada dimensão no espaço de busca.
- Outros parâmetros são todos padrão. Consulte a API detalhada.

```python
# Definir o algoritmo
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Em seguida, escolhemos a função `Ackley` nos problemas numéricos do EvoX.

```python
# Definir o problema
problem = Ackley()
```

Criamos uma instância de `EvalMonitor` para rastrear informações necessárias durante o procedimento de otimização.

```python
# Definir o monitor
monitor = EvalMonitor()
```

A classe `StdWorkflow` fornece um processo padronizado para integrar o algoritmo, problema e monitor.

```python
# Definir o workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Chamar `setup()` inicializa os componentes para que o workflow esteja pronto para executar passos de otimização.

Executamos a otimização por um certo número de iterações (100 neste exemplo). Em cada iteração, o método `step()` atualiza o algoritmo PSO, avalia novas soluções candidatas na função Ackley e rastreia seu fitness via o monitor.

```python
# Executar o procedimento de otimização da função Ackley
for _ in range(100):
    workflow.step()
```

Finalmente, recuperamos o submódulo `monitor` do workflow para acessar as melhores soluções encontradas até agora (`topk_solutions`) e seus valores objetivos correspondentes (`topk_fitness`). Em seguida, imprimimos o melhor resultado e a solução associada.

```python
# Obter a melhor solução e seu fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
