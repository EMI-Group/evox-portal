---
title: "5. Desarrollo y extensión"
order: 5
---

# 5. Desarrollo y extensión

EvoX no solo ofrece funcionalidad lista para usar, sino que también proporciona a los desarrolladores y usuarios avanzados un conjunto rico de interfaces para el desarrollo personalizado y la integración extendida. Este capítulo detalla cómo implementar algoritmos y problemas personalizados, cómo utilizar las API de EvoX para un control más profundo y cómo integrar EvoX con otras herramientas para construir aplicaciones más complejas.

## 5.1 Desarrollo de módulos personalizados

A veces, el problema que estás resolviendo o el algoritmo que quieres usar no está incluido en la biblioteca estándar de EvoX. En tales casos, puedes desarrollar módulos personalizados utilizando las interfaces que proporciona EvoX.

### 5.1.1 Problemas personalizados (MyProblem)

Si tu función objetivo no está disponible en `evox.problems`, puedes definir la tuya propia heredando de la clase base `evox.core.Problem` (o ajustándote a la interfaz requerida). Una clase de problema típica necesita implementar una función `evaluate`, que recibe un lote de soluciones (`pop`) y devuelve los valores de fitness/objetivo correspondientes. Para aprovechar el cálculo paralelo, EvoX requiere que `evaluate` admita **entrada por lotes** (batch input).

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

Por ejemplo, para minimizar la suma de los cubos del vector de decisión:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Puedes implementar una clase `MyProblem` de esta manera:

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

Aquí, `pop` es un tensor con la forma `(population_size, dim)`. La función `evaluate` devuelve un tensor 1D de valores de fitness. Para problemas multiobjetivo, puedes devolver un diccionario con claves separadas para cada objetivo.

Puedes usar tu problema personalizado como si fuera uno integrado:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Algoritmos personalizados (MyAlgorithm)

Crear un algoritmo personalizado es más complejo, ya que incluye la inicialización, la generación de nuevas soluciones y la selección. Para crear un nuevo algoritmo, hereda de `evox.core.Algorithm` e implementa al menos:

- `__init__`: Para la inicialización.
- `step`: La lógica principal del paso evolutivo.

A continuación se muestra un ejemplo de implementación del algoritmo Particle Swarm Optimization (PSO) en EvoX:

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

Para integrar el algoritmo en un workflow:

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

### 5.1.3 Otros módulos personalizados

También puedes personalizar `Monitor`, `Operator` o cualquier módulo en EvoX. Por ejemplo, implementa un `MyMonitor` para registrar la diversidad de la población o crea un `MyOperator` para estrategias personalizadas de cruce/mutación. Consulta las clases base y los ejemplos existentes para entender qué métodos sobrescribir.

## 5.2 Uso de la API

EvoX organiza sus API en módulos, lo que facilita la extensión y combinación de componentes.

### 5.2.1 Algoritmos y problemas

- **Algoritmos**: Se encuentran en `evox.algorithms.so` (objetivo único) y `evox.algorithms.mo` (multiobjetivo).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Problemas**: Se encuentran en `evox.problems`, incluyendo:
  - `numerical` – funciones de prueba clásicas (ej. Ackley, Sphere).
  - `neuroevolution` – entornos de RL como Brax.
  - `hpo_wrapper` – envolver el entrenamiento de ML en problemas de HPO.

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

Ejemplo: Envolver un proceso de optimización para HPO:

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

### 5.2.2 Workflows y herramientas

- **Workflows**: `evox.workflows.StdWorkflow` para bucles de optimización básicos.
- **Monitors**: `EvalMonitor` para el seguimiento del rendimiento.

Ejemplo:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metrics**: `evox.metrics` proporciona IGD, Hypervolume, etc.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Interoperabilidad con PyTorch**: Integración fluida con `torch.nn`, `torch.Tensor`, etc.

## 5.3 Integración con otras herramientas

EvoX está diseñado para integrarse fácilmente con herramientas externas.

### 5.3.1 Integración con Machine Learning

Usa EvoX para ajustar hiperparámetros:

1. Envuelve el entrenamiento/validación como un `Problem`.
2. Usa un algoritmo como CMA-ES.
3. Optimiza los hiperparámetros a lo largo de múltiples ejecuciones.
4. Entrena el modelo final con los mejores parámetros.

### 5.3.2 Integración con Reinforcement Learning

Usa EvoX para evolucionar políticas de redes neuronales:

1. Envuelve el entorno de RL usando `BraxProblem`.
2. Aplana la red de la política usando `ParamsAndVector`.
3. Optimiza utilizando algoritmos evolutivos como GA o CMA-ES.
4. Despliega las políticas optimizadas directamente o ajústalas con RL.

EvoX admite la simulación de entornos por lotes para utilizar plenamente la potencia de la GPU/CPU.

---

**En resumen**, EvoX proporciona API potentes y modulares, y un diseño amigable para el desarrollador para implementar algoritmos personalizados, envolver cualquier problema de optimización e integrarse con herramientas de ML y RL. A medida que profundices en tu comprensión, podrás aplicar creativamente estas interfaces para construir soluciones de optimización a medida.