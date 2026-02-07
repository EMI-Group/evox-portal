---
title: "Пользовательские алгоритмы и задачи в EvoX"
order: 5
section: "developer"
---

# Пользовательские алгоритмы и задачи в EvoX

В этой главе мы расскажем, как реализовать собственные алгоритмы и задачи в EvoX.

## Структура алгоритмов и задач

В большинстве традиционных библиотек ЭВ алгоритмы обычно вызывают целевую функцию внутренне, что даёт следующую структуру:

```
Algorithm
|
+--Problem
```

**Но в EvoX используется плоская структура:**

```
Algorithm.step -- Problem.evaluate
```

Эта структура делает и алгоритмы, и задачи более универсальными: алгоритм может оптимизировать разные задачи, а задача также может подходить для многих алгоритмов.


## Класс Algorithm

Класс `Algorithm` наследуется от `ModuleBase`.

**Всего необходимо реализовать 5 методов (2 метода опциональны):**

| Метод       | Сигнатура                               | Использование                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Инициализация экземпляра алгоритма, например, размер популяции (остаётся постоянным во время итерации), гиперпараметры (могут быть установлены только обёрткой HPO-задачи или инициализированы здесь) и/или изменяемые тензоры (могут быть изменены на лету). |
| `step`               | `(self)`                        | Выполнение обычного шага итерации оптимизации алгоритма. |
| `init_step` (опционально) | `(self)` | Выполнение первого шага оптимизации алгоритма. Если этот метод не переопределён, вместо него будет вызван метод `step`. |

> **Примечание:**
> Статическая инициализация всё ещё может быть написана в `__init__`, тогда как инициализация изменяемых подмодулей — нет. Поэтому возможны множественные вызовы `setup` для повторных инициализаций, если переопределённый метод `setup` сначала вызывает `setup()` из `ModuleBase`.
>
> Если такой метод `setup` в `ModuleBase` не подходит для вашего алгоритма, вы можете переопределить метод `setup` при создании собственного класса алгоритма.
## Класс Problem

Класс `Problem` также наследуется от `ModuleBase`.

Однако класс Problem довольно прост. **Помимо метода `__init__`, единственный необходимый метод — это метод `evaluate`.**

| Метод     | Сигнатура                                   | Использование                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Инициализация настроек задачи.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Оценка приспособленности данной популяции. |

Однако тип аргумента `pop` в `evaluate` может быть изменён на другие JIT-совместимые типы в переопределённом методе.


## Пример

Здесь мы приводим пример **реализации алгоритма PSO, решающего задачу Sphere**.

### Псевдокод примера

Вот псевдокод:

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

А вот что каждая часть алгоритма и задачи соответствует в EvoX.

```text
Set hyper-parameters # Algorithm.__init__

Generate the initial population # Algorithm.setup
Do
    # Problem.evaluate (not part of the algorithm)
    Compute fitness

    # Algorithm.step
    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### Пример алгоритма: алгоритм PSO

Оптимизация роем частиц (PSO) — это популяционный метаэвристический алгоритм, вдохновлённый социальным поведением птиц и рыб. Он широко используется для решения задач непрерывной и дискретной оптимизации.

**Вот пример реализации алгоритма PSO в EvoX:**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
    def __init__(
        self,
        pop_size: int,
        lb: torch.Tensor,
        ub: torch.Tensor,
        w: float = 0.6,
        phi_p: float = 2.5,
        phi_g: float = 0.8,
        device: torch.device | None = None,
    ):
        super().__init__()
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        # Mutable parameters
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        # Compute fitness
        fitness = self.evaluate(self.population)

        # Update the local best fitness and the global best fitness
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )

        # Update the velocity
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )

        # Update the population
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        # Find the value with the minimum key
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### Пример задачи: задача Sphere

Задача Sphere — это простая, но фундаментальная тестовая задача оптимизации, используемая для тестирования алгоритмов оптимизации.

Функция Sphere определяется как:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Вот пример реализации задачи Sphere в EvoX:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Теперь вы можете инициировать рабочий процесс и запустить его.
