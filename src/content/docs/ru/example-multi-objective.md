---
title: "Многокритериальный алгоритм"
order: 10
section: "examples"
---

# Многокритериальный алгоритм

В этом блокноте мы будем использовать эволюционный алгоритм с направляющими векторами (**RVEA**) для поиска оптимальных решений задачи **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Опционально) Использование GPU для запуска кода
Мы часто предпочитаем запускать наш код на GPU для более быстрого выполнения. Однако, если GPU недоступен, запуск на CPU также допустим.

```python
# Use GPU first to run the code.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Пример запуска: RVEA на задаче DTLZ2
Следующий код используется для настройки задачи `DTLZ2` и алгоритма `RVEA`. Дополнительную информацию о задаче и алгоритме можно найти в соответствующем разделе документации.

```python
# Init the problem, algorithm and workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

После завершения настройки мы можем приступить к оптимизации. Мы настроим многокритериальный алгоритм на выполнение 100 шагов оптимизации для этой задачи.

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