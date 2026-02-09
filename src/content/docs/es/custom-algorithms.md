---
title: "Algoritmos y problemas personalizados en EvoX"
order: 5
section: "developer"
---

# Algoritmos y problemas personalizados en EvoX

En este capítulo, presentaremos cómo implementar sus propios algoritmos y problemas en EvoX.

## Estructura de los algoritmos y problemas

En la mayoría de las librerías de EC tradicionales, los algoritmos suelen llamar internamente a la función objetivo, lo que da lugar a la siguiente estructura:

```
Algorithm
|
+--Problem
```

**Pero en EvoX, tenemos una estructura plana:**

```
Algorithm.step -- Problem.evaluate
```

Esta estructura hace que tanto los algoritmos como los problemas sean más universales: un algoritmo puede optimizar diferentes problemas, mientras que un problema también puede ser adecuado para muchos algoritmos.


## Clase Algorithm

La clase `Algorithm` hereda de `ModuleBase`.

**En total,** **hay 5 métodos (2 métodos son opcionales) que debemos implementar:**

| Método       | Firma                               | Uso                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Inicializa la instancia del algoritmo, por ejemplo, el tamaño de la población (se mantiene constante durante la iteración), los hiperparámetros (solo pueden ser establecidos por el wrapper del problema HPO o inicializados aquí) y/o tensores mutables (pueden modificarse sobre la marcha). |
| `step`               | `(self)`                        | Realiza un paso de iteración de optimización normal del algoritmo. |
| `init_step` (opcional) | `(self)` | Realiza el primer paso de la optimización del algoritmo. Si este método no se sobrescribe, se invocará el método `step` en su lugar. |

> **Nota:**
> La inicialización estática todavía se puede escribir en el `__init__`, mientras que la inicialización de los submódulos mutables no. Por lo tanto, son posibles múltiples llamadas a `setup` para inicializaciones repetidas si el método `setup` sobrescrito invoca primero el `setup()` de `ModuleBase`.
> 
> Si dicho método `setup` en `ModuleBase` no es adecuado para su algoritmo, puede sobrescribir el método `setup` cuando cree su propia clase de algoritmo.


## Clase Problem

La clase `Problem` también hereda de `ModuleBase`.

Sin embargo, la clase Problem es bastante sencilla. **Además del método `__init__`, el único método necesario es el método `evaluate`.**

| Método     | Firma                                   | Uso                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Inicializa la configuración del problema.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Evalúa el fitness de la población dada. |

Sin embargo, el tipo del argumento `pop` en `evaluate` puede cambiarse a otros tipos compatibles con JIT en el método sobrescrito.


## Ejemplo

Aquí presentamos un ejemplo de **implementación de un algoritmo PSO que resuelve el problema Sphere**.

### Pseudocódigo del ejemplo

Aquí hay un pseudocódigo:

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

Y aquí está a qué corresponde cada parte del algoritmo y del problema en EvoX.

```text
Set hyper-parameters # Algorithm.__init__

Generate the initial population # Algorithm.setup
Do
    # Problem.evaluate (not part of the algorithm)
    Compute fitness

    # Algorithm.step
    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### Ejemplo de algoritmo: algoritmo PSO

La Optimización por Enjambre de Partículas (PSO, por sus siglas en inglés) es un algoritmo metaheurístico basado en poblaciones inspirado en el comportamiento social de aves y peces. Se utiliza ampliamente para resolver problemas de optimización continuos y discretos.

**Aquí hay un ejemplo de implementación del algoritmo PSO en EvoX:**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        # Mutable parameters
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        # Compute fitness
        fitness = self.evaluate(self.population)

        # Update the local best fitness and the global best fitness
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )

        # Update the velocity
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )

        # Update the population
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        # Find the value with the minimum key
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### Ejemplo de problema: problema Sphere

El problema Sphere es un problema de optimización de referencia simple, pero fundamental, utilizado para probar algoritmos de optimización.

La función Sphere se define como:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Aquí hay un ejemplo de implementación del problema Sphere en EvoX:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Ahora, puede iniciar un workflow y ejecutarlo.