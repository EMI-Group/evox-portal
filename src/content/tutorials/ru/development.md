---
title: "5. Разработка и расширение"
order: 5
---

# 5. Разработка и расширение

EvoX предлагает не только готовые функциональные возможности, но и предоставляет разработчикам и продвинутым пользователям богатый набор интерфейсов для кастомной разработки и расширенной интеграции. В этой главе подробно описывается, как реализовывать собственные алгоритмы и задачи, как использовать API EvoX для более глубокого контроля и как интегрировать EvoX с другими инструментами для создания более сложных приложений.

## 5.1 Разработка кастомных модулей

Иногда решаемая вами задача или алгоритм, который вы хотите использовать, не входят в стандартную библиотеку EvoX. В таких случаях вы можете разрабатывать кастомные модули, используя интерфейсы, предоставляемые EvoX.

### 5.1.1 Кастомные задачи (MyProblem)

Если ваша целевая функция недоступна в `evox.problems`, вы можете определить свою собственную, унаследовав её от базового класса `evox.core.Problem` (или приведя в соответствие с требуемым интерфейсом). Типичный класс задачи должен реализовывать функцию `evaluate`, которая получает пакет решений (`pop`) и возвращает соответствующие значения приспособленности/целевой функции. Чтобы использовать преимущества параллельных вычислений, EvoX требует, чтобы `evaluate` поддерживала **пакетный ввод** (batch input).

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

Здесь `pop` — это тензор формы `(population_size, dim)`. Функция `evaluate` возвращает одномерный тензор значений приспособленности. Для многокритериальных задач вы можете возвращать словарь с отдельными ключами для каждого критерия.

Вы можете использовать свою кастомную задачу так же, как и встроенную:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Кастомные алгоритмы (MyAlgorithm)

Создание кастомного алгоритма сложнее, так как оно включает инициализацию, генерацию новых решений и отбор. Чтобы создать новый алгоритм, унаследуйте его от `evox.core.Algorithm` и реализуйте как минимум:

- `__init__`: Для инициализации.
- `step`: Основная логика эволюционного шага.

Ниже приведен пример реализации алгоритма оптимизации роем частиц (Particle Swarm Optimization, PSO) в EvoX:

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

Чтобы интегрировать алгоритм в рабочий процесс (workflow):

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

### 5.1.3 Другие кастомные модули

Вы также можете настраивать `Monitor`, `Operator` или любой другой модуль в EvoX. Например, реализовать `MyMonitor` для записи разнообразия популяции или создать `MyOperator` для кастомных стратегий скрещивания/мутации. Обратитесь к существующим базовым классам и примерам, чтобы понять, какие методы следует переопределять.

## 5.2 Использование API

EvoX организует свои API в модули, что позволяет легко расширять и комбинировать компоненты.

### 5.2.1 Алгоритмы и задачи

- **Алгоритмы**: Находятся в `evox.algorithms.so` (однокритериальные) и `evox.algorithms.mo` (многокритериальные).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Задачи**: Находятся в `evox.problems`, включая:
  - `numerical` – классические тестовые функции (например, Ackley, Sphere).
  - `neuroevolution` – среды RL, такие как Brax.
  - `hpo_wrapper` – обертка для обучения ML в задачи HPO.

Пример: Обертывание PyTorch MLP средой Brax:

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

Пример: Обертывание процесса оптимизации для HPO:

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

- **Рабочие процессы (Workflows)**: `evox.workflows.StdWorkflow` для базовых циклов оптимизации.
- **Мониторы (Monitors)**: `EvalMonitor` для отслеживания производительности.

Пример:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Метрики (Metrics)**: `evox.metrics` предоставляет IGD, Hypervolume и т. д.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Взаимодействие с PyTorch**: Бесшовная интеграция с `torch.nn`, `torch.Tensor` и т. д.

## 5.3 Интеграция с другими инструментами

EvoX разработан для легкой интеграции с внешними инструментами.

### 5.3.1 Интеграция с машинным обучением

Используйте EvoX для настройки гиперпараметров:

1. Оберните обучение/валидацию как `Problem`.
2. Используйте алгоритм, такой как CMA-ES.
3. Оптимизируйте гиперпараметры в течение нескольких запусков.
4. Обучите финальную модель с лучшими параметрами.

### 5.3.2 Интеграция с обучением с подкреплением

Используйте EvoX для эволюции стратегий (policies) нейронных сетей:

1. Оберните среду RL с помощью `BraxProblem`.
2. Разверните (flatten) сеть стратегии с помощью `ParamsAndVector`.
3. Оптимизируйте, используя эволюционные алгоритмы, такие как GA или CMA-ES.
4. Развертывайте оптимизированные стратегии напрямую или дообучайте их с помощью RL.

EvoX поддерживает пакетную симуляцию сред для полного использования мощностей GPU/CPU.

---

**Подводя итог**, EvoX предоставляет мощные модульные API и удобный для разработчиков дизайн для реализации кастомных алгоритмов, обертывания любых задач оптимизации и интеграции с инструментами ML и RL. По мере углубления вашего понимания вы сможете творчески применять эти интерфейсы для создания индивидуальных решений по оптимизации.