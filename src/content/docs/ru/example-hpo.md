---
title: "Эффективная HPO с EvoX"
order: 13
section: "examples"
---

# Эффективная HPO с EvoX

В этой главе мы рассмотрим, как использовать EvoX для оптимизации гиперпараметров (HPO).

HPO играет важную роль во многих задачах машинного обучения, но часто упускается из виду из-за высокой вычислительной стоимости, которая иногда может занимать дни обработки, а также из-за сложностей развёртывания.

С EvoX мы можем упростить развёртывание HPO с помощью `HPOProblemWrapper` и достичь эффективных вычислений, используя метод `vmap` и ускорение на GPU.

## Преобразование рабочего процесса в задачу

![HPO structure](/_static/HPO_structure.png)

Ключ к развёртыванию HPO с EvoX — преобразование `workflows` в `problems` с помощью `HPOProblemWrapper`. После преобразования мы можем рассматривать `workflows` как стандартные `problems`. Входные данные «задачи HPO» состоят из гиперпараметров, а выходные — из метрик оценки.

## Ключевой компонент -- `HPOProblemWrapper`

Чтобы `HPOProblemWrapper` распознал гиперпараметры, нам нужно обернуть их с помощью `Parameter`. С этим простым шагом гиперпараметры будут автоматически идентифицированы.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## Использование `HPOFitnessMonitor`

Мы предоставляем `HPOFitnessMonitor`, который поддерживает вычисление метрик 'IGD' и 'HV' для многоцелевых задач, а также минимального значения для одноцелевых задач.

Важно отметить, что `HPOFitnessMonitor` — это базовый монитор, предназначенный для задач HPO. Вы также можете создать собственный настраиваемый монитор, используя подход, описанный в [Развёртывание HPO с пользовательскими алгоритмами](#/guide/developer/custom_hpo_prob).
## Простой пример

Здесь мы продемонстрируем простой пример использования EvoX для HPO. В частности, мы будем использовать алгоритм [PSO](#PSO) для оптимизации гиперпараметров алгоритма [PSO](#PSO) для решения задачи sphere.

Обратите внимание, что эта глава даёт лишь краткий обзор развёртывания HPO. Для более подробного руководства обратитесь к [Развёртывание HPO с пользовательскими алгоритмами](#/guide/developer/custom_hpo_prob).

Для начала импортируем необходимые модули.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Далее определим простую задачу Sphere.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Далее мы можем использовать `StdWorkflow` для обёртки `problem`, `algorithm` и `monitor`. Затем используем `HPOProblemWrapper` для преобразования `StdWorkflow` в задачу HPO.

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

`HPOProblemWrapper` принимает 4 аргумента:
1. `iterations`: Количество итераций, выполняемых в процессе оптимизации.
2. `num_instances`: Количество экземпляров, выполняемых параллельно в процессе оптимизации.
3. `workflow`: Рабочий процесс, используемый в процессе оптимизации.
4. `copy_init_state`: Копировать ли начальное состояние рабочего процесса для каждой оценки. По умолчанию `True`. Если ваш рабочий процесс содержит операции, которые ИЗМЕНЯЮТ НА МЕСТЕ тензор(ы) в начальном состоянии, это должно быть установлено в `True`. В противном случае можно установить `False` для экономии памяти.

Мы можем проверить, правильно ли `HPOProblemWrapper` распознаёт определённые нами гиперпараметры. Поскольку не было внесено изменений в гиперпараметры для 5 экземпляров, они должны оставаться идентичными для всех экземпляров.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Мы также можем определить пользовательский набор значений гиперпараметров. Важно убедиться, что количество наборов гиперпараметров соответствует количеству экземпляров в `HPOProblemWrapper`. Кроме того, пользовательские гиперпараметры должны быть предоставлены в виде словаря, значения которого обёрнуты с помощью `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Теперь мы используем алгоритм [PSO](#PSO) для оптимизации гиперпараметров алгоритма [PSO](#PSO).

Важно убедиться, что размер популяции [PSO](#PSO) соответствует количеству экземпляров; в противном случае могут возникнуть непредвиденные ошибки.

Кроме того, решение необходимо преобразовать во внешнем рабочем процессе, так как `HPOProblemWrapper` требует входные данные в форме словаря.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```
