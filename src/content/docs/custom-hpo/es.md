---
title: "Desplegar HPO con algoritmos personalizados"
order: 6
section: "developer"
---

# Desplegar HPO con algoritmos personalizados

En este capítulo, nos centraremos en el despliegue de HPO con algoritmos personalizados, haciendo hincapié en los detalles más que en el flujo de trabajo general. Se proporciona una breve introducción al despliegue de HPO en el [tutorial](/es/tutorials/practical-examples), y se recomienda encarecidamente su lectura previa.

## Hacer que los algoritmos sean paralelizables

Dado que necesitamos transformar el algoritmo interno en el problema, es crucial que el algoritmo interno sea paralelizable. Por lo tanto, pueden ser necesarias algunas modificaciones en el algoritmo.

1. El algoritmo no debe tener métodos con operaciones in-place sobre los atributos del propio algoritmo.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. La lógica del código no depende del flujo de control de Python.

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


## Utilizar el HPOMonitor

En la tarea de HPO, debemos usar el `HPOMonitor` para realizar un seguimiento de las métricas de cada algoritmo interno. El `HPOMonitor` añade un único método, `tell_fitness`, en comparación con el `monitor` estándar. Esta adición está diseñada para ofrecer una mayor flexibilidad al evaluar métricas, ya que las tareas de HPO a menudo implican métricas multidimensionales y complejas.

Los usuarios solo necesitan crear una subclase de `HPOMonitor` y sobrescribir el método `tell_fitness` para definir métricas de evaluación personalizadas.

También proporcionamos un `HPOFitnessMonitor` sencillo, que admite el cálculo de las métricas 'IGD' y 'HV' para problemas multiobjetivo, y el valor mínimo para problemas de un solo objetivo.

## Un ejemplo sencillo

Aquí, mostraremos un ejemplo sencillo de cómo usar HPO con EvoX. Utilizaremos el algoritmo `PSO` para buscar los hiperparámetros óptimos de un algoritmo básico para resolver el problema de la esfera.

Primero, importemos los módulos necesarios.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

A continuación, definimos un problema de esfera sencillo. Nótese que esto no presenta diferencias con los `problems` comunes.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Luego, definimos el algoritmo, utilizamos la función `torch.cond` y nos aseguramos de que sea paralelizable. Específicamente, modificamos las operaciones in-place y ajustamos el flujo de control de Python.

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

Para manejar el flujo de control de Python, utilizamos [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html); a continuación, podemos usar el `StdWorkflow` para envolver el `problem`, el `algorithm` y el `monitor`. Luego, usamos el `HPOProblemWrapper` para transformar el `StdWorkflow` en un problema de HPO.

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

Podemos comprobar si el `HPOProblemWrapper` reconoce correctamente los hiperparámetros que definimos. Dado que no hemos realizado modificaciones en los hiperparámetros para las 7 instancias, estos deberían ser idénticos en todas ellas.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

También podemos especificar nuestro propio conjunto de valores de hiperparámetros. Tenga en cuenta que el número de conjuntos de hiperparámetros debe coincidir con el número de instancias en el `HPOProblemWrapper`. Los hiperparámetros personalizados deben proporcionarse como un diccionario cuyos valores estén envueltos en el `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Ahora, utilizamos el algoritmo `PSO` para optimizar los hiperparámetros de `ExampleAlgorithm`. Tenga en cuenta que el tamaño de la población del `PSO` debe coincidir con el número de instancias; de lo contrario, pueden producirse errores inesperados. En este caso, necesitamos transformar la solución en el flujo de trabajo externo, ya que el `HPOProblemWrapper` requiere un diccionario como entrada.

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