---
title: "Пользовательские алгоритмы и задачи в EvoX"
order: 5
section: "developer"
---

# Пользовательские алгоритмы и задачи в EvoX

В этой главе мы расскажем, как реализовать собственные алгоритмы и задачи в EvoX.

## Структура алгоритмов и задач

В большинстве традиционных библиотек эволюционных вычислений (EC) алгоритмы обычно вызывают целевую функцию внутри себя, что дает следующую структуру:

```
Algorithm
|
+--Problem
```

**Но в EvoX мы используем плоскую структуру:**

```
Algorithm.step -- Problem.evaluate
```

Такая структура делает и алгоритмы, и задачи более универсальными: один алгоритм может оптимизировать различные задачи, в то время как задача может подходить для множества алгоритмов.


## Класс Algorithm

Класс `Algorithm` наследуется от `ModuleBase`.

**Всего нам необходимо реализовать 5 методов (2 из которых являются необязательными):**

| Метод | Сигнатура | Использование |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)` | Инициализация экземпляра алгоритма, например, размера популяции (остается постоянным во время итерации), гиперпараметров (могут быть установлены только оберткой задачи HPO или инициализированы здесь) и/или изменяемых тензоров (могут быть изменены на лету). |
| `step` | `(self)` | Выполнение обычного шага итерации оптимизации алгоритма. |
| `init_step` (необязательно) | `(self)` | Выполнение первого шага оптимизации алгоритма. Если этот метод не переопределен, вместо него будет вызван метод `step`. |

> **Примечание:**
> Статическую инициализацию по-прежнему можно прописать в `__init__`, в то время как инициализацию изменяемых подмодулей — нет. Таким образом, возможны многократные вызовы `setup` для повторной инициализации, если переопределенный метод `setup` сначала вызывает `setup()` из `ModuleBase`.
> 
> Если такой метод `setup` в `ModuleBase` не подходит для вашего алгоритма, вы можете переопределить метод `setup` при создании собственного класса алгоритма.


## Класс Problem

Класс `Problem` также наследуется от `ModuleBase`.

Однако класс `Problem` довольно прост. **Помимо метода `__init__`, единственным необходимым методом является `evaluate`.**

| Метод | Сигнатура | Использование |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)` | Инициализация настроек задачи. |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Оценка приспособленности (fitness) данной популяции. |

Тем не менее, тип аргумента `pop` в `evaluate` может быть изменен на другие JIT-совместимые типы в переопределенном методе.


## Пример

Здесь мы приводим пример **реализации алгоритма PSO, который решает задачу Sphere**.

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

А вот как каждая часть алгоритма и задачи соотносится с EvoX.

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

Метод роя частиц (Particle Swarm Optimization, PSO) — это популяционный метаэвристический алгоритм, вдохновленный социальным поведением птиц и рыб. Он широко используется для решения задач непрерывной и дискретной оптимизации.

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

Задача Sphere — это простая, но фундаментальная тестовая задача оптимизации, используемая для проверки алгоритмов оптимизации.

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

Теперь вы можете инициировать рабочий процесс (workflow) и запустить его.