---
title: "HPO Eficiente con EvoX"
order: 13
section: "examples"
---

# HPO Eficiente con EvoX

En este capitulo, exploraremos como usar EvoX para la optimizacion de hiperparametros (HPO).

HPO juega un papel crucial en muchas tareas de aprendizaje automatico pero a menudo se pasa por alto debido a su alto costo computacional, que a veces puede tardar dias en procesarse, asi como los desafios involucrados en el despliegue.

Con EvoX, podemos simplificar el despliegue de HPO usando el `HPOProblemWrapper` y lograr una computacion eficiente aprovechando el metodo `vmap` y la aceleracion por GPU.

## Transformar el Flujo de Trabajo en Problema

![HPO structure](/_static/HPO_structure.png)

La clave para desplegar HPO con EvoX es transformar los `workflows` en `problems` usando el `HPOProblemWrapper`. Una vez transformados, podemos tratar los `workflows` como `problems` estandar. La entrada al 'problema HPO' consiste en los hiperparametros, y la salida son las metricas de evaluacion.

## El Componente Clave -- `HPOProblemWrapper`

Para asegurar que el `HPOProblemWrapper` reconozca los hiperparametros, necesitamos envolverlos usando `Parameter`. Con este paso sencillo, los hiperparametros seran identificados automaticamente.

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

## Utilizar el `HPOFitnessMonitor`

Proporcionamos un `HPOFitnessMonitor` que soporta el calculo de metricas 'IGD' y 'HV' para problemas multiobjetivo, asi como el valor minimo para problemas de objetivo unico.

Es importante notar que el `HPOFitnessMonitor` es un monitor basico disenado para problemas HPO. Tambien puede crear su propio monitor personalizado de forma flexible usando el enfoque descrito en [Desplegar HPO con Algoritmos Personalizados](#/guide/developer/custom_hpo_prob).

## Un ejemplo simple

Aqui, demostraremos un ejemplo simple de uso de EvoX para HPO. Especificamente, usaremos el algoritmo [PSO](#PSO) para optimizar los hiperparametros del algoritmo [PSO](#PSO) para resolver el problema sphere.

Tenga en cuenta que este capitulo proporciona solo una breve descripcion general del despliegue de HPO. Para una guia mas detallada, consulte [Desplegar HPO con Algoritmos Personalizados](#/guide/developer/custom_hpo_prob).

Para comenzar, importemos los modulos necesarios.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

A continuacion, definimos un problema Sphere simple.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

A continuacion, podemos usar el `StdWorkflow` para envolver el `problem`, `algorithm` y `monitor`. Luego usamos el `HPOProblemWrapper` para transformar el `StdWorkflow` en un problema HPO.

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

El `HPOProblemWrapper` toma 4 argumentos:
1. `iterations`: El numero de iteraciones a ejecutar en el proceso de optimizacion.
2. `num_instances`: El numero de instancias a ejecutar en paralelo en el proceso de optimizacion.
3. `workflow`: El flujo de trabajo a usar en el proceso de optimizacion.
4. `copy_init_state`: Si copiar el estado inicial del flujo de trabajo para cada evaluacion. Por defecto es `True`. Si su flujo de trabajo contiene operaciones que modifican IN SITU el/los tensor(es) en el estado inicial, esto debe establecerse en `True`. De lo contrario, puede establecerlo en `False` para ahorrar memoria.

Podemos verificar si el `HPOProblemWrapper` reconoce correctamente los hiperparametros que definimos. Dado que no se realizan modificaciones a los hiperparametros en las 5 instancias, deben permanecer identicos para todas las instancias.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Tambien podemos definir un conjunto personalizado de valores de hiperparametros. Es importante asegurar que el numero de conjuntos de hiperparametros coincida con el numero de instancias en el `HPOProblemWrapper`. Ademas, los hiperparametros personalizados deben proporcionarse como un diccionario cuyos valores estan envueltos usando el `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Ahora, usamos el algoritmo [PSO](#PSO) para optimizar los hiperparametros del algoritmo [PSO](#PSO).

Es importante asegurar que el tamano de poblacion del [PSO](#PSO) coincida con el numero de instancias; de lo contrario, pueden ocurrir errores inesperados.

Ademas, la solucion necesita ser transformada en el flujo de trabajo externo, ya que el `HPOProblemWrapper` requiere que la entrada sea en forma de diccionario.

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
