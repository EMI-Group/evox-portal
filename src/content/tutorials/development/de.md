---
title: "5. Entwicklung und Erweiterung"
order: 5
---

# 5. Entwicklung und Erweiterung

EvoX bietet nicht nur sofort einsatzbereite Funktionalität, sondern stellt Entwicklern und fortgeschrittenen Benutzern auch eine umfangreiche Reihe von Schnittstellen für benutzerdefinierte Entwicklung und erweiterte Integration zur Verfügung. Dieses Kapitel beschreibt im Detail, wie man benutzerdefinierte Algorithmen und Probleme implementiert, wie man die APIs von EvoX für eine tiefere Kontrolle nutzt und wie man EvoX mit anderen Tools integriert, um komplexere Anwendungen zu erstellen.

## 5.1 Entwicklung benutzerdefinierter Module

Manchmal ist das Problem, das Sie lösen, oder der Algorithmus, den Sie verwenden möchten, nicht in der Standardbibliothek von EvoX enthalten. In solchen Fällen können Sie unter Verwendung der von EvoX bereitgestellten Schnittstellen benutzerdefinierte Module entwickeln.

### 5.1.1 Benutzerdefinierte Probleme (MyProblem)

Wenn Ihre Zielfunktion nicht in `evox.problems` verfügbar ist, können Sie Ihre eigene definieren, indem Sie von der Basisklasse `evox.core.Problem` erben (oder der erforderlichen Schnittstelle entsprechen). Eine typische Problemklasse muss eine `evaluate`-Funktion implementieren, die einen Batch von Lösungen (`pop`) empfängt und die entsprechenden Fitness-/Zielwerte zurückgibt. Um parallele Berechnungen zu nutzen, verlangt EvoX, dass `evaluate` **Batch-Input** unterstützt.

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

Zum Beispiel, um die Summe der Kuben des Entscheidungsvektors zu minimieren:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Sie können eine `MyProblem`-Klasse wie folgt implementieren:

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

Hier ist `pop` ein Tensor der Form `(population_size, dim)`. Die `evaluate`-Funktion gibt einen 1D-Tensor mit Fitnesswerten zurück. Bei Problemen mit mehreren Zielen (Multi-Objective) können Sie ein Dictionary mit separaten Schlüsseln für jedes Ziel zurückgeben.

Sie können Ihr benutzerdefiniertes Problem wie ein eingebautes verwenden:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Benutzerdefinierte Algorithmen (MyAlgorithm)

Das Erstellen eines benutzerdefinierten Algorithmus ist aufwendiger, da es die Initialisierung, die Generierung neuer Lösungen und die Selektion umfasst. Um einen neuen Algorithmus zu erstellen, erben Sie von `evox.core.Algorithm` und implementieren Sie mindestens:

- `__init__`: Für die Initialisierung.
- `step`: Die Logik des evolutionären Hauptschritts.

Unten sehen Sie ein Beispiel für die Implementierung des Particle Swarm Optimization (PSO) Algorithmus in EvoX:

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

Um den Algorithmus in einen Workflow zu integrieren:

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

### 5.1.3 Andere benutzerdefinierte Module

Sie können auch `Monitor`, `Operator` oder jedes andere Modul in EvoX anpassen. Implementieren Sie beispielsweise einen `MyMonitor`, um die Populationsdiversität aufzuzeichnen, oder erstellen Sie einen `MyOperator` für benutzerdefinierte Crossover-/Mutationsstrategien. Beziehen Sie sich auf vorhandene Basisklassen und Beispiele, um zu verstehen, welche Methoden überschrieben werden müssen.

## 5.2 Verwendung der API

EvoX organisiert seine APIs in Modulen, was die Erweiterung und Kombination von Komponenten erleichtert.

### 5.2.1 Algorithmen und Probleme

- **Algorithmen**: Zu finden in `evox.algorithms.so` (single-objective) und `evox.algorithms.mo` (multi-objective).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Probleme**: Zu finden in `evox.problems`, einschließlich:
  - `numerical` – klassische Testfunktionen (z. B. Ackley, Sphere).
  - `neuroevolution` – RL-Umgebungen wie Brax.
  - `hpo_wrapper` – ML-Training in HPO-Probleme verpacken.

Beispiel: Verpacken eines PyTorch MLP mit einer Brax-Umgebung:

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

Beispiel: Verpacken eines Optimierungsprozesses für HPO:

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

### 5.2.2 Workflows und Tools

- **Workflows**: `evox.workflows.StdWorkflow` für grundlegende Optimierungsschleifen.
- **Monitors**: `EvalMonitor` zur Leistungsverfolgung.

Beispiel:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metriken**: `evox.metrics` bietet IGD, Hypervolume usw.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch-Interoperabilität**: Nahtlose Integration mit `torch.nn`, `torch.Tensor` usw.

## 5.3 Integration mit anderen Tools

EvoX ist so konzipiert, dass es sich leicht in externe Tools integrieren lässt.

### 5.3.1 Machine Learning Integration

Verwenden Sie EvoX zur Abstimmung von Hyperparametern:

1. Training/Validierung als `Problem` verpacken.
2. Einen Algorithmus wie CMA-ES verwenden.
3. Hyperparameter über mehrere Durchläufe hinweg optimieren.
4. Das endgültige Modell mit den besten Parametern trainieren.

### 5.3.2 Reinforcement Learning Integration

Verwenden Sie EvoX, um neuronale Netzwerk-Policies zu entwickeln:

1. RL-Umgebung mit `BraxProblem` verpacken.
2. Policy-Netzwerk mit `ParamsAndVector` verflachen (flatten).
3. Mit evolutionären Algorithmen wie GA oder CMA-ES optimieren.
4. Optimierte Policies direkt einsetzen oder mit RL feinabstimmen.

EvoX unterstützt Batch-Umgebungssimulationen, um die GPU/CPU-Leistung voll auszunutzen.

---

**Zusammenfassend** bietet EvoX leistungsstarke, modulare APIs und ein entwicklerfreundliches Design für die Implementierung benutzerdefinierter Algorithmen, das Verpacken beliebiger Optimierungsprobleme und die Integration mit ML- und RL-Tools. Wenn Sie Ihr Verständnis vertiefen, können Sie diese Schnittstellen kreativ anwenden, um maßgeschneiderte Optimierungslösungen zu erstellen.