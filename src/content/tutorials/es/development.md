---
title: "5. Desarrollo y Extension"
order: 5
---

# 5. Desarrollo y Extension

EvoX no solo ofrece funcionalidad lista para usar, sino que tambien proporciona a los desarrolladores y usuarios avanzados un rico conjunto de interfaces para desarrollo personalizado e integracion extendida. Este capitulo detalla como implementar algoritmos y problemas personalizados, como utilizar las APIs de EvoX para un control mas profundo, y como integrar EvoX con otras herramientas para construir aplicaciones mas complejas.

## 5.1 Desarrollo de Modulos Personalizados

A veces el problema que esta resolviendo o el algoritmo que desea usar no esta incluido en la biblioteca estandar de EvoX. En tales casos, puede desarrollar modulos personalizados usando las interfaces que EvoX proporciona.

### 5.1.1 Problemas Personalizados (MyProblem)

Si su funcion objetivo no esta disponible en `evox.problems`, puede definir la suya propia heredando de la clase base `evox.core.Problem` (o conformandose a la interfaz requerida). Una clase de problema tipica necesita implementar una funcion `evaluate`, que recibe un lote de soluciones (`pop`) y devuelve los valores de aptitud/objetivo correspondientes. Para aprovechar el calculo paralelo, EvoX requiere que `evaluate` soporte **entrada por lotes**.

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

Por ejemplo, para minimizar la suma de cubos del vector de decision:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Puede implementar una clase `MyProblem` asi:

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

Aqui, `pop` es un tensor de forma `(population_size, dim)`. La funcion `evaluate` devuelve un tensor 1D de valores de aptitud. Para problemas multiobjetivo, puede devolver un diccionario con claves separadas para cada objetivo.

Puede usar su problema personalizado como uno incorporado:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Algoritmos Personalizados (MyAlgorithm)

Crear un algoritmo personalizado es mas complejo, ya que incluye inicializacion, generacion de nuevas soluciones y seleccion. Para crear un nuevo algoritmo, herede de `evox.core.Algorithm` e implemente al menos:

- `__init__`: Para inicializacion.
- `step`: La logica principal del paso evolutivo.

A continuacion se muestra un ejemplo de implementacion del algoritmo de Optimizacion por Enjambre de Particulas (PSO) en EvoX:

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

Para integrar el algoritmo en un flujo de trabajo:

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

### 5.1.3 Otros Modulos Personalizados

Tambien puede personalizar `Monitor`, `Operator` o cualquier modulo en EvoX. Por ejemplo, implementar un `MyMonitor` para registrar la diversidad de la poblacion o crear un `MyOperator` para estrategias personalizadas de cruce/mutacion. Consulte las clases base existentes y los ejemplos para entender que metodos sobreescribir.

## 5.2 Uso de la API

EvoX organiza sus APIs en modulos, facilitando la extension y combinacion de componentes.

### 5.2.1 Algoritmos y Problemas

- **Algoritmos**: Se encuentran en `evox.algorithms.so` (objetivo unico) y `evox.algorithms.mo` (multiobjetivo).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Problemas**: Se encuentran en `evox.problems`, incluyendo:
  - `numerical` -- funciones de prueba clasicas (por ejemplo, Ackley, Sphere).
  - `neuroevolution` -- entornos de RL como Brax.
  - `hpo_wrapper` -- envolver entrenamiento de ML en problemas HPO.

Ejemplo: Envolver un MLP de PyTorch con un entorno Brax:

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

Ejemplo: Envolver un proceso de optimizacion para HPO:

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

### 5.2.2 Flujos de Trabajo y Herramientas

- **Flujos de Trabajo**: `evox.workflows.StdWorkflow` para bucles de optimizacion basicos.
- **Monitores**: `EvalMonitor` para rastrear el rendimiento.

Ejemplo:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metricas**: `evox.metrics` proporciona IGD, Hipervolumen, etc.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Interoperabilidad con PyTorch**: Integracion perfecta con `torch.nn`, `torch.Tensor`, etc.

## 5.3 Integracion con Otras Herramientas

EvoX esta disenado para integrarse facilmente con herramientas externas.

### 5.3.1 Integracion con Aprendizaje Automatico

Use EvoX para ajustar hiperparametros:

1. Envuelva el entrenamiento/validacion como un `Problem`.
2. Use un algoritmo como CMA-ES.
3. Optimice hiperparametros a lo largo de multiples ejecuciones.
4. Entrene el modelo final con los mejores parametros.

### 5.3.2 Integracion con Aprendizaje por Refuerzo

Use EvoX para evolucionar politicas de redes neuronales:

1. Envuelva el entorno de RL usando `BraxProblem`.
2. Aplane la red de politicas usando `ParamsAndVector`.
3. Optimice usando algoritmos evolutivos como GA o CMA-ES.
4. Despliegue las politicas optimizadas directamente o ajuste con RL.

EvoX soporta simulacion de entornos por lotes para utilizar completamente la potencia de GPU/CPU.

---

**En resumen**, EvoX proporciona APIs potentes y modulares y un diseno amigable para desarrolladores para implementar algoritmos personalizados, envolver cualquier problema de optimizacion e integrarse con herramientas de ML y RL. A medida que profundice su comprension, puede aplicar creativamente estas interfaces para construir soluciones de optimizacion a medida.
