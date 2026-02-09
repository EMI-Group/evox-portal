---
title: "5. Développement et Extension"
order: 5
---

# 5. Développement et Extension

EvoX offre non seulement des fonctionnalités prêtes à l'emploi, mais fournit également aux développeurs et aux utilisateurs avancés un riche ensemble d'interfaces pour le développement personnalisé et l'intégration étendue. Ce chapitre détaille comment implémenter des algorithmes et des problèmes personnalisés, comment utiliser les API d'EvoX pour un contrôle plus approfondi, et comment intégrer EvoX avec d'autres outils pour construire des applications plus complexes.

## 5.1 Développement de Modules Personnalisés

Parfois, le problème que vous résolvez ou l'algorithme que vous souhaitez utiliser n'est pas inclus dans la bibliothèque standard d'EvoX. Dans de tels cas, vous pouvez développer des modules personnalisés en utilisant les interfaces fournies par EvoX.

### 5.1.1 Problèmes Personnalisés (MyProblem)

Si votre fonction objectif n'est pas disponible dans `evox.problems`, vous pouvez définir la vôtre en héritant de la classe de base `evox.core.Problem` (ou en vous conformant à l'interface requise). Une classe de problème typique doit implémenter une fonction `evaluate`, qui reçoit un lot de solutions (`pop`) et renvoie les valeurs de fitness/objectif correspondantes. Pour tirer parti du calcul parallèle, EvoX exige que `evaluate` prenne en charge les **entrées par lots** (batch input).

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

Par exemple, pour minimiser la somme des cubes du vecteur de décision :

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Vous pouvez implémenter une classe `MyProblem` comme ceci :

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

Ici, `pop` est un tenseur de forme `(population_size, dim)`. La fonction `evaluate` renvoie un tenseur 1D de valeurs de fitness. Pour les problèmes multi-objectifs, vous pouvez renvoyer un dictionnaire avec des clés distinctes pour chaque objectif.

Vous pouvez utiliser votre problème personnalisé comme un problème intégré :

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Algorithmes Personnalisés (MyAlgorithm)

La création d'un algorithme personnalisé est plus complexe, car elle inclut l'initialisation, la génération de nouvelles solutions et la sélection. Pour créer un nouvel algorithme, héritez de `evox.core.Algorithm` et implémentez au moins :

- `__init__` : Pour l'initialisation.
- `step` : La logique principale de l'étape évolutive.

Voici un exemple d'implémentation de l'algorithme Particle Swarm Optimization (PSO) dans EvoX :

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

Pour intégrer l'algorithme dans un workflow :

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

### 5.1.3 Autres Modules Personnalisés

Vous pouvez également personnaliser `Monitor`, `Operator`, ou tout autre module dans EvoX. Par exemple, implémentez un `MyMonitor` pour enregistrer la diversité de la population ou créez un `MyOperator` pour des stratégies de croisement/mutation personnalisées. Référez-vous aux classes de base existantes et aux exemples pour comprendre quelles méthodes surcharger.

## 5.2 Utilisation de l'API

EvoX organise ses API en modules, ce qui facilite l'extension et la combinaison des composants.

### 5.2.1 Algorithmes et Problèmes

- **Algorithms** : Trouvés dans `evox.algorithms.so` (mono-objectif) et `evox.algorithms.mo` (multi-objectif).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Problems** : Trouvés dans `evox.problems`, incluant :
  - `numerical` – fonctions de test classiques (par ex. Ackley, Sphere).
  - `neuroevolution` – environnements RL comme Brax.
  - `hpo_wrapper` – envelopper l'entraînement ML dans des problèmes HPO.

Exemple : Envelopper un MLP PyTorch avec un environnement Brax :

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

Exemple : Envelopper un processus d'optimisation pour HPO :

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

### 5.2.2 Workflows et Outils

- **Workflows** : `evox.workflows.StdWorkflow` pour les boucles d'optimisation de base.
- **Monitors** : `EvalMonitor` pour suivre les performances.

Exemple :

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metrics** : `evox.metrics` fournit IGD, Hypervolume, etc.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Interopérabilité PyTorch** : Intégration transparente avec `torch.nn`, `torch.Tensor`, etc.

## 5.3 Intégration avec d'Autres Outils

EvoX est conçu pour s'intégrer facilement avec des outils externes.

### 5.3.1 Intégration avec le Machine Learning

Utilisez EvoX pour régler les hyperparamètres :

1. Enveloppez l'entraînement/validation en tant que `Problem`.
2. Utilisez un algorithme comme CMA-ES.
3. Optimisez les hyperparamètres sur plusieurs exécutions.
4. Entraînez le modèle final avec les meilleurs paramètres.

### 5.3.2 Intégration avec le Reinforcement Learning

Utilisez EvoX pour faire évoluer des politiques de réseaux de neurones :

1. Enveloppez l'environnement RL en utilisant `BraxProblem`.
2. Aplatissez le réseau de politique en utilisant `ParamsAndVector`.
3. Optimisez en utilisant des algorithmes évolutifs comme GA ou CMA-ES.
4. Déployez les politiques optimisées directement ou affinez-les avec le RL.

EvoX prend en charge la simulation d'environnement par lots pour utiliser pleinement la puissance GPU/CPU.

---

**En résumé**, EvoX fournit des API puissantes et modulaires ainsi qu'une conception conviviale pour les développeurs afin d'implémenter des algorithmes personnalisés, d'envelopper n'importe quel problème d'optimisation et de s'intégrer aux outils de ML et de RL. À mesure que vous approfondissez votre compréhension, vous pouvez appliquer ces interfaces de manière créative pour construire des solutions d'optimisation sur mesure.