---
title: "Desplegar HPO con Algoritmos Personalizados"
order: 6
section: "developer"
---

# Desplegar HPO con Algoritmos Personalizados

En este capitulo, nos centraremos en desplegar HPO con algoritmos personalizados, enfatizando los detalles en lugar del flujo de trabajo general. Se proporciona una breve introduccion al despliegue de HPO en el [tutorial](#/tutorial/tutorial_part7), y se recomienda encarecidamente su lectura previa.

## Hacer los Algoritmos Paralelizables

Dado que necesitamos transformar el algoritmo interno en el problema, es crucial que el algoritmo interno sea paralelizable. Por lo tanto, pueden ser necesarias algunas modificaciones al algoritmo.

1. El algoritmo no debe tener metodos con operaciones in situ sobre los atributos del propio algoritmo.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. La logica del codigo no debe depender del flujo de control de Python.

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

En la tarea HPO, debemos usar el `HPOMonitor` para rastrear las metricas de cada algoritmo interno. El `HPOMonitor` agrega solo un metodo, `tell_fitness`, comparado con el `monitor` estandar. Esta adicion esta disenada para ofrecer mayor flexibilidad en la evaluacion de metricas, ya que las tareas HPO a menudo involucran metricas multidimensionales y complejas.

Los usuarios solo necesitan crear una subclase de `HPOMonitor` y sobreescribir el metodo `tell_fitness` para definir metricas de evaluacion personalizadas.

Tambien proporcionamos un simple `HPOFitnessMonitor`, que soporta el calculo de las metricas 'IGD' y 'HV' para problemas multiobjetivo, y el valor minimo para problemas de objetivo unico.

## Un ejemplo simple

Aqui, demostraremos un ejemplo simple de como usar HPO con EvoX. Usaremos el algoritmo `PSO` para buscar los hiperparametros optimos de un algoritmo basico para resolver el problema sphere.

Primero, importemos los modulos necesarios.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

A continuacion, definimos un problema sphere simple. Tenga en cuenta que esto no tiene diferencia con los `problems` comunes.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

A continuacion, definimos el algoritmo, usamos la funcion `torch.cond` y nos aseguramos de que sea paralelizable. Especificamente, modificamos las operaciones in situ y ajustamos el flujo de control de Python.

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

Para manejar el flujo de control de Python, usamos [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html), a continuacion, podemos usar el `StdWorkflow` para envolver el `problem`, `algorithm` y `monitor`. Luego usamos el `HPOProblemWrapper` para transformar el `StdWorkflow` en un problema HPO.

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

Podemos probar si el `HPOProblemWrapper` reconoce correctamente los hiperparametros que definimos. Dado que no hemos realizado modificaciones a los hiperparametros para las 7 instancias, deben ser identicos en todas las instancias.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Tambien podemos especificar nuestro propio conjunto de valores de hiperparametros. Tenga en cuenta que el numero de conjuntos de hiperparametros debe coincidir con el numero de instancias en el `HPOProblemWrapper`. Los hiperparametros personalizados deben proporcionarse como un diccionario cuyos valores estan envueltos en el `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Ahora, usamos el algoritmo `PSO` para optimizar los hiperparametros de `ExampleAlgorithm`. Tenga en cuenta que el tamano de poblacion del `PSO` debe coincidir con el numero de instancias; de lo contrario, pueden ocurrir errores inesperados. En este caso, necesitamos transformar la solucion en el flujo de trabajo externo, ya que el `HPOProblemWrapper` requiere un diccionario como entrada.

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
