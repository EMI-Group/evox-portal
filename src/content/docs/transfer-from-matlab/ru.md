---
title: "Переход от MATLAB к PyTorch и EvoX"
order: 18
section: "misc"
---

# Переход от MATLAB к PyTorch и EvoX

Этот документ призван помочь пользователям MATLAB перейти на PyTorch и EvoX для эволюционных вычислений. Мы выделим основные различия между MATLAB и PyTorch с точки зрения синтаксиса, структур данных и рабочего процесса. Затем мы проиллюстрируем эти различия на примере алгоритма оптимизации роем частиц (PSO) в MATLAB и PyTorch.

## Синтаксические различия

### Создание массивов и индексация

#### MATLAB

- Использует индексацию с единицы (1-based).
- Векторы и матрицы объявляются с использованием квадратных скобок и точек с запятой (например, `[1 2 3; 4 5 6]`). Случайная инициализация с помощью `rand()` возвращает значения в интервале $[0, 1)$.
- Срезы выполняются с использованием синтаксиса `(start:end)` и используют индексацию с единицы.

#### PyTorch

- Использует индексацию с нуля (0-based).
- Массивы (тензоры) обычно создаются с помощью конструкторов, таких как `torch.rand()`, `torch.zeros()`, или списков Python, преобразованных в тензоры с помощью `torch.tensor()`.
- Срезы выполняются с использованием `[start:end]` с индексами от нуля.

### Матричные вычисления

#### MATLAB

- Выполняет линейно-алгебраическое умножение матриц с помощью `*`.
- Использует `.*` для поэлементного умножения матриц одинакового размера.
- `/` обозначает правое деление матриц.
- `.^` обозначает поэлементное возведение в степень.
- Конечные и начальные измерения тензоров длиной 1 **игнорируются**.
- Автоматически находит измерения для трансляции (broadcasting) при поэлементных операциях и выполняет **неявное** расширение размерности.

#### PyTorch

- Выполняет линейно-алгебраическое умножение матриц с помощью `@` или `torch.matmul()`.
- Напрямую использует `*` для поэлементного умножения тензоров одинаковой формы или форм, поддерживающих трансляцию.
- `/` обозначает поэлементное деление.
- `**` обозначает поэлементное возведение в степень.
- Измерения тензоров длиной 1 **сохраняются** и рассматриваются как **измерения для трансляции**.
- **Предотвращает** большинство неявных расширений размерности, обычно требуются явные измерения для трансляции.

### Функции и определения

#### MATLAB

- Функция определяется ключевым словом `function`.
- Файл может содержать несколько функций, но обычно основная функция имеет то же имя, что и файл.
- Анонимные функции (например, `@(x) sum(x.^2)`) используются для коротких встроенных вычислений.

#### PyTorch

- Функции определяются с помощью ключевого слова `def`, обычно внутри одного файла `.py` или модуля.
- Классы используются для инкапсуляции данных и методов в объектно-ориентированном стиле.
- Лямбда-выражения служат короткими анонимными функциями (`lambda x: x.sum()`), но многострочные лямбды не допускаются.

### Управляющие конструкции

#### MATLAB

- Использует циклы `for i = 1:N` ... `end` с индексацией от 1.
- Условные операторы, такие как `if`, `elseif` и `else`.

#### PyTorch

- Использует `for i in range(N):` с индексацией от 0.
- Отступы имеют значение для определения области видимости в циклах и условиях (ключевое слово `end` отсутствует).

### Печать и комментарии

#### MATLAB

- Использует функции `fprintf()` для форматированного вывода.
- Использует `%` для однострочных комментариев.

#### PyTorch

- Использует `print` с f-строками для форматированного вывода.
- Использует `#` для однострочных комментариев.

### Многострочный код

#### MATLAB

- Использует `...` в конце строки, чтобы указать, что следующая строка должна рассматриваться как продолжение текущей.
#### Python

- Использует `\` в конце строки, чтобы указать, что следующая строка должна рассматриваться как продолжение текущей.
- Если несколько строк находятся внутри круглых скобок, специальный символ в конце строки не требуется.

## Как написать алгоритм эволюционных вычислений с помощью EvoX?

### MATLAB

Пример кода MATLAB для алгоритма PSO выглядит следующим образом:
```matlab
function [] = example_pso()
    pso = init_pso(100, [-10, -10], [10, 10], 0.6, 2.5, 0.8);
    test_fn = @(x) (sum(x .* x, 2));
    for i = 1:20
        pso = step_pso(pso, test_fn);
        fprintf("Iteration = %d, global best = %f\n", i, pso.global_best_fitness);
    end
end


function [self] = init_pso(pop_size, lb, ub, w, phi_p, phi_g)
    self = struct();
    self.pop_size = pop_size;
    self.dim = length(lb);
    self.w = w;
    self.phi_p = phi_p;
    self.phi_g = phi_g;
    % setup
    range = ub - lb;
    population = rand(self.pop_size, self.dim);
    population = range .* population + lb;
    velocity = rand(self.pop_size, self.dim);
    velocity = 2 .* range .* velocity - range;
    self.lb = lb;
    self.ub = ub;
    % mutable
    self.population = population;
    self.velocity = velocity;
    self.local_best_location = population;
    self.local_best_fitness = Inf(self.pop_size, 1);
    self.global_best_location = population(1, :);
    self.global_best_fitness = Inf;
end


function [self] = step_pso(self, evaluate)
    % Evaluate
    fitness = evaluate(self.population);
    % Update the local best
    compare = find(self.local_best_fitness > fitness);
    self.local_best_location(compare, :) = self.population(compare, :);
    self.local_best_fitness(compare) = fitness(compare);
    % Update the global best
    values = [self.global_best_location; self.population];
    keys = [self.global_best_fitness; fitness];
    [min_val, min_index] = min(keys);
    self.global_best_location = values(min_index, :);
    self.global_best_fitness = min_val;
    % Update velocity and position
    rg = rand(self.pop_size, self.dim);
    rp = rand(self.pop_size, self.dim);
    velocity = self.w .* self.velocity ...
        + self.phi_p .* rp .* (self.local_best_location - self.population) ...
        + self.phi_g .* rg .* (self.global_best_location - self.population);
    population = self.population + velocity;
    self.population = min(max(population, self.lb), self.ub);
    self.velocity = min(max(velocity, self.lb), self.ub);
end
```
В MATLAB функция `init_pso()` инициализирует алгоритм, отдельная функция `step_pso()` выполняет шаг итерации, а основная функция `example_pso()` управляет циклом.

### EvoX
В EvoX вы можете построить алгоритм PSO следующим образом:

Во-первых, рекомендуется импортировать необходимые модули и функции из EvoX и PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Затем вы можете преобразовать код MATLAB в код Python в соответствии с разделом «Синтаксические различия».
```python
def main():
    pso = PSO(pop_size=10, lb=torch.tensor([-10.0, -10.0]), ub=torch.tensor([10.0, 10.0]))
    wf = StdWorkflow()
    wf.setup(algorithm=pso, problem=Sphere())
    for i in range(1, 21):
        wf.step()
        print(f"Iteration = {i}, global best = {wf.algorithm.global_best_fitness}")

@jit_class
class PSO(Algorithm):
    def __init__(self, pop_size, lb, ub, w=0.6, phi_p=2.5, phi_g=0.8):
        super().__init__()
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = w
        self.phi_p = phi_p
        self.phi_g = phi_g
        # setup
        lb = lb.unsqueeze(0)
        ub = ub.unsqueeze(0)
        range = ub - lb
        population = torch.rand(self.pop_size, self.dim)
        population = range * population + lb
        velocity = torch.rand(self.pop_size, self.dim)
        velocity = 2 * range * velocity - range
        self.lb = lb
        self.ub = ub
        # mutable
        self.population = population
        self.velocity = velocity
        self.local_best_location = population
        self.local_best_fitness = torch.full((self.pop_size,), fill_value=torch.inf)
        self.global_best_location = population[0, :]
        self.global_best_fitness = torch.tensor(torch.inf)

    def step(self):
        # Evaluate
        fitness = self.evaluate(self.population)
        # Update the local best
        compare = self.local_best_fitness > fitness
        self.local_best_location = torch.where(compare.unsqueeze(1), self.population, self.local_best_location)
        self.local_best_fitness = torch.where(compare, fitness, self.local_best_fitness)
        # Update the global best
        values = torch.cat([self.global_best_location.unsqueeze(0), self.population], dim=0)
        keys = torch.cat([self.global_best_fitness.unsqueeze(0), fitness], dim=0)
        min_index = torch.argmin(keys)
        self.global_best_location = values[min_index]
        self.global_best_fitness = keys[min_index]
        # Update velocity and position
        rg = torch.rand(self.pop_size, self.dim)
        rp = torch.rand(self.pop_size, self.dim)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)


# Run the main function
if __name__ == "__main__":
    main()
```

> **Примечание:**
> Стоит отметить, что в MATLAB мы используем `[]` с `;` и `,` для объединения матриц и векторов по определенному измерению; однако в EvoX функцию `torch.cat` необходимо вызывать с аргументом `dim`, чтобы указать измерение объединения.
> Более того, в PyTorch объединяемые тензоры должны иметь одинаковое количество измерений; поэтому применяется дополнительный метод `XXX.unsqueeze(0)` для добавления нового измерения длиной 1 перед первым измерением.

В EvoX логика PSO инкапсулирована в классе, который наследуется от `Algorithm`. Этот объектно-ориентированный дизайн упрощает управление состоянием и итерациями, а также дает следующие преимущества:
- Наследуемый метод `evaluate()`
    Вы можете просто вызвать `self.evaluate(self.population)` для вычисления значений приспособленности, вместо того чтобы вручную передавать целевую функцию на каждой итерации.
- Встроенная интеграция с рабочими процессами (Workflow)
    Когда вы регистрируете свой класс PSO в рабочем процессе `StdWorkflow`, он берет на себя итеративные вызовы `step()` от вашего имени.

Путем расширения `Algorithm`, `__init__()` настраивает все основные компоненты PSO (популяцию, скорость, локальный/глобальный оптимум и т. д.) в стандартном конструкторе класса Python.