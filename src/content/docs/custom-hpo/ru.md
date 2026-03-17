---
title: "Развертывание HPO с пользовательскими алгоритмами"
order: 6
section: "developer"
---

# Развертывание HPO с пользовательскими алгоритмами

В этой главе мы сосредоточимся на развертывании HPO с использованием пользовательских алгоритмов, уделяя внимание деталям, а не общему рабочему процессу. Краткое введение в развертывание HPO приведено в [руководстве](../../tutorials/practical-examples), и предварительное ознакомление с ним настоятельно рекомендуется.

## Обеспечение параллелизуемости алгоритмов

Поскольку нам нужно преобразовать внутренний алгоритм в задачу (`problem`), крайне важно, чтобы внутренний алгоритм был параллелизуемым. Поэтому могут потребоваться некоторые модификации алгоритма.

1. Алгоритм не должен иметь методов с операциями in-place над атрибутами самого алгоритма.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. Логика кода не должна полагаться на управляющие конструкции (control flow) Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #attribute of the algorithm itself
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # function with python control flow
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # function without python control flow
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```


## Использование HPOMonitor

В задаче HPO следует использовать `HPOMonitor` для отслеживания метрик каждого внутреннего алгоритма. `HPOMonitor` добавляет только один метод, `tell_fitness`, по сравнению со стандартным `monitor`. Это дополнение предназначено для обеспечения большей гибкости при оценке метрик, так как задачи HPO часто включают многомерные и сложные метрики.

Пользователям достаточно создать подкласс `HPOMonitor` и переопределить метод `tell_fitness` для определения пользовательских метрик оценки.

Мы также предоставляем простой `HPOFitnessMonitor`, который поддерживает расчет метрик 'IGD' и 'HV' для многокритериальных задач и минимального значения для однокритериальных задач.

## Простой пример

Здесь мы продемонстрируем простой пример использования HPO в EvoX. Мы будем использовать алгоритм `PSO` для поиска оптимальных гиперпараметров базового алгоритма для решения задачи сферы (sphere problem).

Сначала импортируем необходимые модули.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Далее определим простую задачу сферы. Обратите внимание, что она ничем не отличается от обычных `problems`.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Далее определим алгоритм. Мы используем функцию `torch.cond` и обеспечиваем его параллелизуемость. В частности, мы изменяем операции in-place и корректируем управляющие конструкции Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # the hyperparameters to be optimized
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # one update strategy
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  #  the other update strategy
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simply random sampling
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

Для обработки управляющих конструкций Python мы используем [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html). Далее мы можем использовать `StdWorkflow` для обертки `problem`, `algorithm` и `monitor`. Затем мы используем `HPOProblemWrapper` для преобразования `StdWorkflow` в задачу HPO.

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

Мы можем проверить, правильно ли `HPOProblemWrapper` распознает определенные нами гиперпараметры. Поскольку мы не вносили никаких изменений в гиперпараметры для 7 экземпляров, они должны быть идентичны во всех экземплярах.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Мы также можем указать собственный набор значений гиперпараметров. Обратите внимание, что количество наборов гиперпараметров должно соответствовать количеству экземпляров в `HPOProblemWrapper`. Пользовательские гиперпараметры должны быть предоставлены в виде словаря, значения которого обернуты в `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Теперь мы используем алгоритм `PSO` для оптимизации гиперпараметров `ExampleAlgorithm`. Обратите внимание, что размер популяции `PSO` должен соответствовать количеству экземпляров; в противном случае могут возникнуть непредвиденные ошибки. В данном случае нам нужно преобразовать решение во внешнем рабочем процессе, так как `HPOProblemWrapper` требует словарь на входе.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {"self.algorithm.hp": x}


outer_algo = PSO(7, -3 * torch.ones(4), 3 * torch.ones(4))
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow()
outer_workflow.setup(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
for _ in range(20):
    outer_workflow.step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```