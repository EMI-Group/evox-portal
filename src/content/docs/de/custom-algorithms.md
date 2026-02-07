---
title: "Benutzerdefinierte Algorithmen und Probleme in EvoX"
order: 5
section: "developer"
---

# Benutzerdefinierte Algorithmen und Probleme in EvoX

In diesem Kapitel stellen wir vor, wie Sie Ihre eigenen Algorithmen und Probleme in EvoX implementieren.

## Aufbau der Algorithmen und Probleme

In den meisten traditionellen EC-Bibliotheken rufen Algorithmen normalerweise die Zielfunktion intern auf, was folgenden Aufbau ergibt:

```
Algorithm
|
+--Problem
```

**Aber in EvoX haben wir einen flachen Aufbau:**

```
Algorithm.step -- Problem.evaluate
```

Dieser Aufbau macht sowohl Algorithmen als auch Probleme universeller: Ein Algorithmus kann verschiedene Probleme optimieren, während ein Problem auch für viele Algorithmen geeignet sein kann.


## Algorithm-Klasse

Die `Algorithm`-Klasse erbt von `ModuleBase`.

**Insgesamt gibt es 5 Methoden (2 Methoden sind optional), die wir implementieren müssen:**

| Methode       | Signatur                               | Verwendung                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Initialisiert die Algorithmusinstanz, zum Beispiel die Populationsgröße (bleibt während der Iteration konstant), Hyperparameter (können nur vom HPO-Problem-Wrapper gesetzt oder hier initialisiert werden) und/oder veränderliche Tensoren (können im laufenden Betrieb modifiziert werden). |
| `step`               | `(self)`                        | Führt einen normalen Optimierungsiterationsschritt des Algorithmus durch. |
| `init_step` (optional) | `(self)` | Führt den ersten Schritt der Optimierung des Algorithmus durch. Wenn diese Methode nicht überschrieben wird, wird stattdessen die `step`-Methode aufgerufen. |

> **Hinweis:**
> Die statische Initialisierung kann weiterhin in `__init__` geschrieben werden, während die Initialisierung veränderbarer Submodule dies nicht kann. Daher sind mehrere Aufrufe von `setup` für wiederholte Initialisierungen möglich, wenn die überschriebene `setup`-Methode zuerst `setup()` von `ModuleBase` aufruft.
>
> Wenn eine solche `setup`-Methode in `ModuleBase` nicht für Ihren Algorithmus geeignet ist, können Sie die `setup`-Methode überschreiben, wenn Sie Ihre eigene Algorithmusklasse erstellen.


## Problem-Klasse

Die `Problem`-Klasse erbt ebenfalls von `ModuleBase`.

Die Problem-Klasse ist jedoch recht einfach. **Neben der `__init__`-Methode ist die einzige notwendige Methode die `evaluate`-Methode.**

| Methode     | Signatur                                   | Verwendung                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Initialisiert die Einstellungen des Problems.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Bewertet die Fitness der gegebenen Population. |

Der Typ des `pop`-Arguments in `evaluate` kann jedoch in der überschriebenen Methode auf andere JIT-kompatible Typen geändert werden.


## Beispiel

Hier geben wir ein Beispiel für die **Implementierung eines PSO-Algorithmus, der das Sphere-Problem löst**.

### Pseudocode des Beispiels

Hier ist ein Pseudocode:

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

Und hier ist, was jeder Teil des Algorithmus und des Problems in EvoX entspricht.

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

### Algorithmus-Beispiel: PSO-Algorithmus

Partikelschwarmoptimierung (PSO) ist ein populationsbasierter metaheuristischer Algorithmus, der vom Sozialverhalten von Vögeln und Fischen inspiriert ist. Er wird häufig zur Lösung kontinuierlicher und diskreter Optimierungsprobleme eingesetzt.

**Hier ist ein Implementierungsbeispiel des PSO-Algorithmus in EvoX:**

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

### Problem-Beispiel: Sphere-Problem

Das Sphere-Problem ist ein einfaches, aber grundlegendes Benchmark-Optimierungsproblem, das zum Testen von Optimierungsalgorithmen verwendet wird.

Die Sphere-Funktion ist definiert als:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Hier ist ein Implementierungsbeispiel des Sphere-Problems in EvoX:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Jetzt können Sie einen Workflow initiieren und ausführen.
