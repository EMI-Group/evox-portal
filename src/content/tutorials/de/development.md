---
title: "5. Entwicklung und Erweiterung"
order: 5
---

# 5. Entwicklung und Erweiterung

EvoX bietet nicht nur sofort einsatzbereite Funktionalität, sondern stellt Entwicklern und fortgeschrittenen Benutzern auch eine umfangreiche Sammlung von Schnittstellen für benutzerdefinierte Entwicklung und erweiterte Integration zur Verfügung. Dieses Kapitel beschreibt im Detail, wie Sie benutzerdefinierte Algorithmen und Probleme implementieren, wie Sie die APIs von EvoX für tiefere Kontrolle nutzen und wie Sie EvoX mit anderen Tools integrieren, um komplexere Anwendungen zu erstellen.

## 5.1 Entwicklung benutzerdefinierter Module

Manchmal ist das Problem, das Sie lösen, oder der Algorithmus, den Sie verwenden möchten, nicht in der Standardbibliothek von EvoX enthalten. In solchen Fällen können Sie benutzerdefinierte Module mit den von EvoX bereitgestellten Schnittstellen entwickeln.

### 5.1.1 Benutzerdefinierte Probleme (MyProblem)

Wenn Ihre Zielfunktion nicht in `evox.problems` verfügbar ist, können Sie Ihre eigene definieren, indem Sie von der Basisklasse `evox.core.Problem` erben (oder die erforderliche Schnittstelle einhalten). Eine typische Problemklasse muss eine `evaluate`-Funktion implementieren, die einen Stapel von Lösungen (`pop`) empfängt und die entsprechenden Fitness-/Zielwerte zurückgibt. Um parallele Berechnung zu nutzen, erfordert EvoX, dass `evaluate` **Batch-Eingabe** unterstützt.

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

Um beispielsweise die Summe der Kuben des Entscheidungsvektors zu minimieren:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Können Sie eine `MyProblem`-Klasse wie folgt implementieren:

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

Hier ist `pop` ein Tensor der Form `(population_size, dim)`. Die `evaluate`-Funktion gibt einen 1D-Tensor von Fitnesswerten zurück. Für Mehrzielprobleme können Sie ein Dictionary mit separaten Schlüsseln für jedes Ziel zurückgeben.

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

Die Erstellung eines benutzerdefinierten Algorithmus ist aufwändiger, da sie Initialisierung, Generierung neuer Lösungen und Selektion umfasst. Um einen neuen Algorithmus zu erstellen, erben Sie von `evox.core.Algorithm` und implementieren Sie mindestens:

- `__init__`: Für die Initialisierung.
- `step`: Die Hauptlogik des evolutionären Schritts.

Unten ist ein Beispiel für die Implementierung des Partikelschwarmoptimierungs-Algorithmus (PSO) in EvoX:

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

### 5.1.3 Weitere benutzerdefinierte Module

Sie können auch `Monitor`, `Operator` oder jedes andere Modul in EvoX anpassen. Implementieren Sie beispielsweise einen `MyMonitor`, um die Populationsdiversität aufzuzeichnen, oder erstellen Sie einen `MyOperator` für benutzerdefinierte Crossover-/Mutationsstrategien. Beziehen Sie sich auf vorhandene Basisklassen und Beispiele, um zu verstehen, welche Methoden überschrieben werden müssen.

## 5.2 Verwendung der API

EvoX organisiert seine APIs in Modulen, was die Erweiterung und Kombination von Komponenten erleichtert.

### 5.2.1 Algorithmen und Probleme

- **Algorithmen**: Zu finden in `evox.algorithms.so` (Einziel) und `evox.algorithms.mo` (Mehrziel).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Probleme**: Zu finden in `evox.problems`, einschließlich:
  - `numerical` – klassische Testfunktionen (z.B. Ackley, Sphere).
  - `neuroevolution` – RL-Umgebungen wie Brax.
  - `hpo_wrapper` – ML-Training in HPO-Probleme einbetten.

Beispiel: Einbettung eines PyTorch-MLP mit einer Brax-Umgebung:

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

Beispiel: Einbettung eines Optimierungsprozesses für HPO:

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
- **Monitore**: `EvalMonitor` zur Leistungsverfolgung.

Beispiel:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metriken**: `evox.metrics` bietet IGD, Hypervolumen usw.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch-Interoperabilität**: Nahtlose Integration mit `torch.nn`, `torch.Tensor` usw.

## 5.3 Integration mit anderen Tools

EvoX ist so konzipiert, dass es sich leicht mit externen Tools integrieren lässt.

### 5.3.1 Integration mit maschinellem Lernen

Verwenden Sie EvoX zur Abstimmung von Hyperparametern:

1. Verpacken Sie Training/Validierung als `Problem`.
2. Verwenden Sie einen Algorithmus wie CMA-ES.
3. Optimieren Sie Hyperparameter über mehrere Durchläufe.
4. Trainieren Sie das endgültige Modell mit den besten Parametern.

### 5.3.2 Integration mit Reinforcement Learning

Verwenden Sie EvoX zur Evolution neuronaler Netzwerk-Policies:

1. Verpacken Sie die RL-Umgebung mit `BraxProblem`.
2. Flachen Sie das Policy-Netzwerk mit `ParamsAndVector` ab.
3. Optimieren Sie mit evolutionären Algorithmen wie GA oder CMA-ES.
4. Setzen Sie optimierte Policies direkt ein oder verfeinern Sie sie mit RL.

EvoX unterstützt Batch-Umgebungssimulation, um GPU-/CPU-Leistung voll auszunutzen.

---

**Zusammenfassend** bietet EvoX leistungsstarke, modulare APIs und ein entwicklerfreundliches Design für die Implementierung benutzerdefinierter Algorithmen, die Einbettung beliebiger Optimierungsprobleme und die Integration mit ML- und RL-Tools. Wenn Sie Ihr Verständnis vertiefen, können Sie diese Schnittstellen kreativ anwenden, um maßgeschneiderte Optimierungslösungen zu erstellen.
