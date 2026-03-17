---
title: "Решение задач Brax в EvoX"
order: 11
section: "examples"
---

# Решение задач Brax в EvoX

EvoX глубоко погружается в нейроэволюцию с помощью Brax.
Здесь мы покажем пример решения задачи Brax в EvoX.

```python
# install EvoX and Brax, skip it if you have already installed EvoX or Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# The dependent packages or functions in this example
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## Что такое Brax

Brax — это быстрый и полностью дифференцируемый физический движок, используемый для исследований и разработки в области робототехники, человеческого восприятия, материаловедения, обучения с подкреплением и других приложений с интенсивным моделированием. 

Здесь мы продемонстрируем среду "swimmer" из Brax. 

Для получения дополнительной информации вы можете посетить [Github Brax](https://github.com/google/brax).

## Проектирование класса нейронной сети

Для начала нам нужно решить, какую нейронную сеть мы собираемся построить.

Здесь мы приведем простой класс многослойного перцептрона (MLP). 

```python
# Construct an MLP using PyTorch.
# This MLP has 3 layers.


class SimpleMLP(nn.Module):
    def __init__(self):
        super(SimpleMLP, self).__init__()
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)
```

## Инициализация модели

С помощью класса `SimpleMLP` мы можем инициализировать модель MLP.

```python
# Make sure that the model is on the same device, better to be on the GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Reset the random seed
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Initialize the MLP model
model = SimpleMLP().to(device)
```

### Инициализация адаптера

Адаптер поможет нам преобразовывать данные туда и обратно.

```python
adapter = ParamsAndVector(dummy_model=model)
```

С помощью адаптера мы можем приступить к выполнению этой задачи нейроэволюции.

## Настройка процесса запуска

### Инициализация алгоритма и задачи

Мы инициализируем `алгоритм PSO`, а задачей будет `задача Brax` в среде "swimmer".

```python
# Set the population size
POP_SIZE = 1024

# Get the bound of the PSO algorithm
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Initialize the PSO, and you can also use any other algorithms
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Initialize the Brax problem
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
    device=device,
)
```

В данном случае мы будем использовать 1000 шагов для каждого эпизода, а среднее вознаграждение за 3 эпизода будет возвращено в качестве значения приспособленности (fitness).

### Настройка монитора

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Инициализация рабочего процесса

```python
# Initiate an workflow
workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
    device=device,
)
```

### Запуск рабочего процесса

Запустите рабочий процесс и увидите магию!

> **Примечание:**
> Выполнение следующего блока займет около 20 минут.
> Время может варьироваться в зависимости от вашего оборудования.

```python
# Set the maximum number of generations
max_generation = 50

# Run the workflow
workflow.init_step()
compiled_step = torch.compile(workflow.step)
for i in range(max_generation):
    if i % 10 == 0:
        print(f"Generation {i}")
    compiled_step()

print(f"Top fitness: {monitor.get_best_fitness()}")
best_params = adapter.to_params(monitor.get_best_solution())
print(f"Best params: {best_params}")
```

```python
monitor.get_best_fitness()
```

```python
monitor.plot()
```

```python
html_string = problem.visualize(best_params)
escaped_string = html_string.replace('"', "&quot;")
HTML(f'<iframe srcdoc="{escaped_string}" width="100%" height="480" frameborder="0"></iframe>')
```

> **Важно:**
> - Обычно для рендеринга достаточно `HTML(problem.visualize(best_params))`. Приведенный выше код является обходным решением для корректного отображения результата на нашем сайте.
> - Алгоритм PSO не оптимизирован специально для задач такого типа, поэтому ожидаются ограничения производительности. Этот пример предназначен для демонстрационных целей.

Мы надеемся, что вам понравится решать задачи Brax с помощью EvoX. Удачи!