---
title: "Численная оптимизация"
order: 9
section: "examples"
---

# Численная оптимизация

Этот ноутбук представляет собой пошаговое руководство по использованию EvoX для оптимизации функции Ackley с помощью алгоритма Particle Swarm Optimization (PSO). Как алгоритм PSO, так и задача оптимизации Ackley интегрированы в качестве встроенных компонентов в фреймворк EvoX.

Сначала необходимо импортировать все нужные модули, включая `PSO` (алгоритм), `Ackley` (задача), а также `StdWorkflow` и `EvalMonitor` (рабочий процесс).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Здесь мы создаем экземпляр алгоритма `PSO`. Мы указываем следующие настройки:

- `pop_size`: Размер роя частиц (популяции).
- `lb` и `ub`: Нижняя и верхняя границы для каждого измерения в пространстве поиска.
- Остальные параметры оставлены по умолчанию. Пожалуйста, обратитесь к подробному описанию API.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Далее мы выбираем функцию `Ackley` из численных задач EvoX.

```python
# Define the problem
problem = Ackley()
```

Мы создаем экземпляр `EvalMonitor` для отслеживания необходимой информации в процессе оптимизации.

```python
# Define the monitor
monitor = EvalMonitor()
```

Класс `StdWorkflow` предоставляет стандартизированный процесс для интеграции алгоритма, задачи и монитора.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Вызов `setup()` инициализирует компоненты, подготавливая рабочий процесс к выполнению шагов оптимизации.

Мы запускаем оптимизацию на определенное количество итераций (100 в данном примере). На каждой итерации метод `step()` обновляет алгоритм PSO, оценивает новые решения-кандидаты на функции Ackley и отслеживает их приспособленность (fitness) с помощью монитора.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Наконец, мы извлекаем подмодуль `monitor` из рабочего процесса, чтобы получить доступ к лучшим найденным решениям (`topk_solutions`) и соответствующим значениям целевой функции (`topk_fitness`). Затем мы выводим лучший результат и соответствующее ему решение.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```