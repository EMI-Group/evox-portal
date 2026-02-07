---
title: "7. Практические примеры"
order: 7
---

# 7. Практические примеры

В этой главе представлено несколько полных практических примеров, демонстрирующих применение знаний из предыдущих глав. Мы построим проект оптимизации с нуля и покажем, как EvoX может быть интегрирован с другими инструментами. Эти примеры охватывают различные типы задач, чтобы помочь вам применить EvoX в реальных сценариях.

---

## Пример 1: Одноцелевая оптимизация

**Задача**: Оптимизировать классическую функцию Растригина:

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

где $\mathbf{x} \in \mathbb{R}^d$ и $d$ — размерность. Глобальный оптимум равен 0 в начале координат. Функция является сильно мультимодальной, что делает её идеальной для тестирования алгоритмов глобальной оптимизации. Вот график функции Растригина

```{figure} /_static/rastrigin_function.svg
:alt: График функции Растригина
:figwidth: 70%
:align: center

Функция Растригина
```

В этом примере мы используем алгоритм оптимизации роем частиц (PSO) для оптимизации 10-мерной функции Растригина.

**Шаг 1: Настройка**

Предполагается, что вы настроили окружение EvoX, как описано в Главе 2.

**Шаг 2: Настройка рабочего процесса**

Создайте Python-скрипт `opt_rastrigin_10.py`:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Определите алгоритм PSO:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```
Настройте задачу и рабочий процесс:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Шаг 3: Запуск оптимизации**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Пример вывода**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

Алгоритм PSO находит решение, близкое к оптимальному, вблизи начала координат, как и ожидалось.

---

## Пример 2: Многоцелевая оптимизация

**Задача**: Минимизировать две цели:

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Фронт Парето лежит между $x = 0$ (оптимум для $f_1$) и $x = 2$ (оптимум для $f_2$).

**Шаг 1: Настройка окружения**

Убедитесь, что EvoX установлен с поддержкой NSGA-II.

**Шаг 2: Определение пользовательской задачи**

EvoX имеет множество встроенных многоцелевых тестовых задач, но для этого примера мы определим пользовательскую задачу для оптимизации двух целей:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Импорт базовых классов evox, подробнее см. Главу 5
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Опционально: Определение функции фронта Парето
    def pf(self) -> torch.Tensor:
        pass
```
**Шаг 3: Определение алгоритма и рабочего процесса**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Шаг 4: Оптимизация и визуализация**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Мы можем визуализировать результаты с помощью Matplotlib. Синие точки представляют оптимизированную популяцию, а красная линия показывает фронт Парето.

```{figure} /_static/example_nsga2_result.svg
:alt: График популяции NSGA-II
:figwidth: 70%
:align: center

График популяции NSGA-II после оптимизации
```

В Jupyter Notebook вы можете использовать встроенные возможности построения графиков EvoX для визуализации процесса оптимизации и наблюдения за эволюцией популяции по поколениям.

```python
monitor.plot()
```

---

## Пример 3: Оптимизация гиперпараметров (HPO)

**Задача**: Настроить `C` и `max_iter` классификатора логистической регрессии на наборе данных рака молочной железы для максимизации точности валидации.

**Шаг 1: Загрузка данных и модели**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**Шаг 2: Определение задачи**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```
**Шаг 3: Настройка рабочего процесса**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Шаг 4: Оптимизация**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Пример вывода**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Всего несколькими строками кода EvoX автоматизирует утомительный процесс подбора гиперпараметров методом проб и ошибок.

---

Эти практические примеры иллюстрируют, как EvoX может быть эффективно применён в различных областях — от математических тестовых функций до рабочих процессов машинного обучения. Как только вы освоите базовую структуру — **Алгоритм + Задача + Монитор + Рабочий процесс** — вы сможете адаптировать EvoX практически для любой задачи оптимизации.
