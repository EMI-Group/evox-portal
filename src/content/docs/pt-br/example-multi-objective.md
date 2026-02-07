---
title: "Algoritmo Multiobjetivo"
order: 10
section: "examples"
---

# Algoritmo Multiobjetivo

Neste notebook, usaremos o Algoritmo Evolutivo Guiado por Vetor de Referência (**RVEA**) para encontrar as soluções ótimas do problema **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Opcional) Usar GPU para executar o código
Frequentemente preferimos executar nosso código em uma GPU para execução mais rápida. No entanto, se uma GPU não estiver disponível, executar na CPU também é aceitável.

```python
# Use GPU primeiro para executar o código.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Exemplo de execução: RVEA no problema DTLZ2
O código a seguir é usado para configurar o problema `DTLZ2` e o algoritmo `RVEA`. Mais informações sobre o problema e o algoritmo podem ser encontradas na seção correspondente da documentação.

```python
# Inicializar o problema, algoritmo e workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Com essa configuração pronta, podemos agora começar a otimizar. Definimos que o algoritmo multiobjetivo otimize por 100 passos neste problema.

```python
# Executar o workflow por 100 passos
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
