---
title: "Algorithmes et problèmes personnalisés dans EvoX"
order: 5
section: "developer"
---

# Algorithmes et problèmes personnalisés dans EvoX

Dans ce chapitre, nous présenterons comment implémenter vos propres algorithmes et problèmes dans EvoX.

## Organisation des algorithmes et problèmes

Dans la plupart des bibliothèques EC traditionnelles, les algorithmes appellent généralement la fonction objectif en interne, ce qui donne l'organisation suivante :

```
Algorithm
|
+--Problem
```

**Mais dans EvoX, nous avons une organisation plate :**

```
Algorithm.step -- Problem.evaluate
```

Cette organisation rend les algorithmes et les problèmes plus universels : un algorithme peut optimiser différents problèmes, tandis qu'un problème peut également convenir à de nombreux algorithmes.


## Classe Algorithm

La classe `Algorithm` hérite de `ModuleBase`.

**Au total, il y a 5 méthodes (dont 2 optionnelles) que nous devons implémenter :**

| Méthode       | Signature                               | Utilisation                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Initialiser l'instance de l'algorithme, par exemple la taille de la population (constante pendant l'itération), les hyperparamètres (ne peuvent être définis que par le wrapper de problème HPO ou initialisés ici), et/ou les tenseurs mutables (modifiables à la volée). |
| `step`               | `(self)`                        | Effectuer une étape d'itération d'optimisation normale de l'algorithme. |
| `init_step` (optionnel) | `(self)` | Effectuer la première étape de l'optimisation de l'algorithme. Si cette méthode n'est pas surchargée, la méthode `step` sera invoquée à la place. |

> **Note :**
> L'initialisation statique peut toujours être écrite dans le `__init__` tandis que l'initialisation des sous-modules mutables ne le peut pas. Par conséquent, des appels multiples de `setup` pour des initialisations répétées sont possibles si la méthode `setup` surchargée invoque d'abord le `setup()` de `ModuleBase`.
>
> Si une telle méthode `setup` dans `ModuleBase` ne convient pas à votre algorithme, vous pouvez surcharger la méthode `setup` lorsque vous créez votre propre classe d'algorithme.


## Classe Problem

La classe `Problem` hérite également de `ModuleBase`.

Cependant, la classe Problem est assez simple. **En plus de la méthode `__init__`, la seule méthode nécessaire est la méthode `evaluate`.**

| Méthode     | Signature                                   | Utilisation                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Initialiser les paramètres du problème.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Évaluer la fitness de la population donnée. |

Cependant, le type de l'argument `pop` dans `evaluate` peut être changé en d'autres types compatibles JIT dans la méthode surchargée.
## Exemple

Ici, nous donnons un exemple d'**implémentation d'un algorithme PSO qui résout le problème Sphere**.

### Pseudo-code de l'exemple

Voici un pseudo-code :

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

Et voici ce à quoi chaque partie de l'algorithme et du problème correspond dans EvoX.

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

### Exemple d'algorithme : algorithme PSO

L'Optimisation par Essaim de Particules (PSO) est un algorithme métaheuristique basé sur la population, inspiré du comportement social des oiseaux et des poissons. Il est largement utilisé pour résoudre des problèmes d'optimisation continus et discrets.

**Voici un exemple d'implémentation de l'algorithme PSO dans EvoX :**

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

### Exemple de problème : problème Sphere

Le problème Sphere est un problème d'optimisation de référence simple mais fondamental utilisé pour tester les algorithmes d'optimisation.

La fonction Sphere est définie comme :

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Voici un exemple d'implémentation du problème Sphere dans EvoX :**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Maintenant, vous pouvez initier un workflow et l'exécuter.
