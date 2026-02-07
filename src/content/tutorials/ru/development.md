---
title: "5. Разработка и расширение"
order: 5
---

# 5. Разработка и расширение

EvoX не только предлагает готовую к использованию функциональность, но и предоставляет разработчикам и продвинутым пользователям богатый набор интерфейсов для пользовательской разработки и расширенной интеграции. В этой главе подробно описано, как реализовать пользовательские алгоритмы и задачи, как использовать API EvoX для более глубокого контроля и как интегрировать EvoX с другими инструментами для создания более сложных приложений.

## 5.1 Разработка пользовательских модулей

Иногда задача, которую вы решаете, или алгоритм, который хотите использовать, не включены в стандартную библиотеку EvoX. В таких случаях вы можете разработать пользовательские модули, используя интерфейсы EvoX.

### 5.1.1 Пользовательские задачи (MyProblem)

Если ваша целевая функция недоступна в `evox.problems`, вы можете определить свою собственную, наследуя от базового класса `evox.core.Problem` (или соответствуя требуемому интерфейсу). Типичный класс задачи должен реализовать функцию `evaluate`, которая получает пакет решений (`pop`) и возвращает соответствующие значения приспособленности/целевой функции. Для использования параллельных вычислений EvoX требует, чтобы `evaluate` поддерживал **пакетный ввод**.

```python
import torch
from abc import ABC
from typing import Any, Dict
from evox.core.module import ModuleBase

class Problem(ModuleBase, ABC):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor) -> torch.Tensor:
        return torch.empty(0)
```

Например, для минимизации суммы кубов вектора решений:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Вы можете реализовать класс `MyProblem` следующим образом:

```python
import torch
from evox.core import Problem

class MyProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        fitness = torch.sum(pop**3, dim=1)
        return fitness
```

Здесь `pop` — тензор формы `(population_size, dim)`. Функция `evaluate` возвращает одномерный тензор значений приспособленности. Для многоцелевых задач можно вернуть словарь с отдельными ключами для каждой цели.
Вы можете использовать свою пользовательскую задачу так же, как встроенную:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Пользовательские алгоритмы (MyAlgorithm)

Создание пользовательского алгоритма более сложно, так как включает инициализацию, генерацию новых решений и отбор. Для создания нового алгоритма наследуйте от `evox.core.Algorithm` и реализуйте как минимум:

- `__init__`: Для инициализации.
- `step`: Основная логика эволюционного шага.

Ниже приведён пример реализации алгоритма оптимизации роем частиц (PSO) в EvoX:

```python
import torch
from evox.core import Algorithm, Mutable, Parameter
from evox.utils import clamp
from evox.algorithms.so.pso_variants.utils import min_by

class PSO(Algorithm):
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
        device = torch.get_default_device() if device is None else device
        assert lb.shape == ub.shape and lb.ndim == 1

        self.pop_size = pop_size
        self.dim = lb.shape[0]

        lb = lb[None, :].to(device)
        ub = ub[None, :].to(device)
        length = ub - lb

        pop = length * torch.rand(self.pop_size, self.dim, device=device) + lb
        velocity = 2 * length * torch.rand(self.pop_size, self.dim, device=device) - length

        self.lb = lb
        self.ub = ub

        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)

        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop.clone())
        self.local_best_fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.global_best_location = Mutable(pop[0])
        self.global_best_fit = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        compare = self.local_best_fit > self.fit
        self.local_best_location = torch.where(compare[:, None], self.pop, self.local_best_location)
        self.local_best_fit = torch.where(compare, self.fit, self.local_best_fit)
        self.global_best_location, self.global_best_fit = min_by(
            [self.global_best_location.unsqueeze(0), self.pop],
            [self.global_best_fit.unsqueeze(0), self.fit],
        )
        rg = torch.rand(self.pop_size, self.dim, device=self.fit.device)
        rp = torch.rand(self.pop_size, self.dim, device=self.fit.device)

        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.pop)
            + self.phi_g * rg * (self.global_best_location - self.pop)
        )
        pop = self.pop + velocity
        self.pop = clamp(pop, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)
        self.fit = self.evaluate(self.pop)

    def init_step(self):
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

Для интеграции алгоритма в рабочий процесс:

```python
import torch
from MyProblems import MyProblem
from evox.workflows import EvalMonitor, StdWorkflow
from evox.algorithms import PSO

problem = MyProblem()
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0])
)
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)
for i in range(10):
    workflow.step()
```
### 5.1.3 Пользовательские другие модули

Вы также можете настроить `Monitor`, `Operator` или любой модуль в EvoX. Например, реализовать `MyMonitor` для записи разнообразия популяции или создать `MyOperator` для пользовательских стратегий скрещивания/мутации. Обратитесь к существующим базовым классам и примерам, чтобы понять, какие методы нужно переопределить.

## 5.2 Использование API

EvoX организует свои API в модули, что упрощает расширение и комбинирование компонентов.

### 5.2.1 Алгоритмы и задачи

- **Алгоритмы**: Находятся в `evox.algorithms.so` (одноцелевые) и `evox.algorithms.mo` (многоцелевые).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Задачи**: Находятся в `evox.problems`, включая:
  - `numerical` — классические тестовые функции (например, Ackley, Sphere).
  - `neuroevolution` — среды RL, такие как Brax.
  - `hpo_wrapper` — обёртка обучения ML в задачи HPO.

Пример: Обёртка MLP PyTorch со средой Brax:

```python
import torch.nn as nn
from evox.problems.neuroevolution.brax import BraxProblem

class SimpleMLP(nn.Module):
    ...

policy = SimpleMLP().to(device)
problem = BraxProblem(
    policy=policy,
    env_name="swimmer",
    ...
)
```

Пример: Обёртка процесса оптимизации для HPO:

```python
from evox.problems.hpo_wrapper import HPOProblemWrapper
...
hpo_problem = HPOProblemWrapper(
    iterations=30,
    num_instances=128,
    workflow=inner_workflow,
    copy_init_state=True
)
```

### 5.2.2 Рабочие процессы и инструменты

- **Рабочие процессы**: `evox.workflows.StdWorkflow` для базовых циклов оптимизации.
- **Мониторы**: `EvalMonitor` для отслеживания производительности.

Пример:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Метрики**: `evox.metrics` предоставляет IGD, Hypervolume и т.д.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Совместимость с PyTorch**: Бесшовная интеграция с `torch.nn`, `torch.Tensor` и т.д.

## 5.3 Интеграция с другими инструментами

EvoX разработан для лёгкой интеграции с внешними инструментами.

### 5.3.1 Интеграция с машинным обучением

Используйте EvoX для настройки гиперпараметров:

1. Оберните обучение/валидацию как `Problem`.
2. Используйте алгоритм, такой как CMA-ES.
3. Оптимизируйте гиперпараметры за несколько запусков.
4. Обучите финальную модель с лучшими параметрами.

### 5.3.2 Интеграция с обучением с подкреплением

Используйте EvoX для эволюции политик нейронных сетей:

1. Оберните среду RL с помощью `BraxProblem`.
2. Преобразуйте сеть политики с помощью `ParamsAndVector`.
3. Оптимизируйте с помощью эволюционных алгоритмов, таких как GA или CMA-ES.
4. Разверните оптимизированные политики напрямую или дообучите с помощью RL.

EvoX поддерживает пакетное моделирование сред для полного использования мощности GPU/CPU.

---

**Подводя итог**, EvoX предоставляет мощные, модульные API и дружественный к разработчикам дизайн для реализации пользовательских алгоритмов, обёртки любой задачи оптимизации и интеграции с инструментами ML и RL. По мере углубления понимания вы сможете творчески применять эти интерфейсы для создания индивидуальных решений оптимизации.
