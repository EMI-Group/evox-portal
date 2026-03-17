---
title: "5. Sviluppo ed Estensione"
order: 5
---

# 5. Sviluppo ed Estensione

EvoX non offre solo funzionalità pronte all'uso, ma fornisce anche a sviluppatori e utenti avanzati un ricco set di interfacce per lo sviluppo personalizzato e l'integrazione estesa. Questo capitolo descrive in dettaglio come implementare algoritmi e problemi personalizzati, come utilizzare le API di EvoX per un controllo più approfondito, e come integrare EvoX con altri strumenti per costruire applicazioni più complesse.

## 5.1 Sviluppo di Moduli Personalizzati

A volte il problema che stai risolvendo o l'algoritmo che vuoi usare non è incluso nella libreria standard di EvoX. In questi casi, puoi sviluppare moduli personalizzati usando le interfacce fornite da EvoX.

### 5.1.1 Problemi Personalizzati (MyProblem)

Se la tua funzione obiettivo non è disponibile in `evox.problems`, puoi definirne una tua ereditando dalla classe base `evox.core.Problem` (o conformandoti all'interfaccia richiesta). Una tipica classe problema deve implementare una funzione `evaluate`, che riceve un batch di soluzioni (`pop`) e restituisce i corrispondenti valori di fitness/obiettivo. Per sfruttare il calcolo parallelo, EvoX richiede che `evaluate` supporti l'**input batch**.

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

Ad esempio, per minimizzare la somma dei cubi del vettore decisionale:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Puoi implementare una classe `MyProblem` come questa:

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

Qui, `pop` è un tensore di forma `(population_size, dim)`. La funzione `evaluate` restituisce un tensore 1D di valori di fitness. Per problemi multi-obiettivo, puoi restituire un dizionario con chiavi separate per ogni obiettivo.

Puoi usare il tuo problema personalizzato come uno integrato:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Algoritmi Personalizzati (MyAlgorithm)

Creare un algoritmo personalizzato è più complesso, poiché include l'inizializzazione, la generazione di nuove soluzioni e la selezione. Per creare un nuovo algoritmo, eredita da `evox.core.Algorithm` e implementa almeno:

- `__init__`: Per l'inizializzazione.
- `step`: La logica principale del passo evolutivo.

Di seguito è riportato un esempio di implementazione dell'algoritmo di Ottimizzazione a Sciame di Particelle (PSO) in EvoX:

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

Per integrare l'algoritmo in un workflow:

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

### 5.1.3 Personalizzazione di Altri Moduli

Puoi anche personalizzare `Monitor`, `Operator` o qualsiasi modulo in EvoX. Ad esempio, implementa un `MyMonitor` per registrare la diversità della popolazione o crea un `MyOperator` per strategie personalizzate di crossover/mutazione. Consulta le classi base esistenti e gli esempi per capire quali metodi sovrascrivere.

## 5.2 Utilizzo dell'API

EvoX organizza le sue API in moduli, rendendo facile estendere e combinare i componenti.

### 5.2.1 Algoritmi e Problemi

- **Algoritmi**: Si trovano in `evox.algorithms.so` (mono-obiettivo) e `evox.algorithms.mo` (multi-obiettivo).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Problemi**: Si trovano in `evox.problems`, inclusi:
  - `numerical` -- funzioni di test classiche (ad es. Ackley, Sphere).
  - `neuroevolution` -- ambienti RL come Brax.
  - `hpo_wrapper` -- incapsula l'addestramento ML in problemi HPO.

Esempio: Incapsulare un MLP PyTorch con un ambiente Brax:

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

Esempio: Incapsulare un processo di ottimizzazione per HPO:

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

### 5.2.2 Workflow e Strumenti

- **Workflow**: `evox.workflows.StdWorkflow` per cicli di ottimizzazione di base.
- **Monitor**: `EvalMonitor` per il tracciamento delle prestazioni.

Esempio:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Metriche**: `evox.metrics` fornisce IGD, Hypervolume, ecc.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Interoperabilità con PyTorch**: Integrazione trasparente con `torch.nn`, `torch.Tensor`, ecc.

## 5.3 Integrazione con Altri Strumenti

EvoX è progettato per integrarsi facilmente con strumenti esterni.

### 5.3.1 Integrazione con il Machine Learning

Usa EvoX per regolare gli iperparametri:

1. Incapsula addestramento/validazione come un `Problem`.
2. Usa un algoritmo come CMA-ES.
3. Ottimizza gli iperparametri su più esecuzioni.
4. Addestra il modello finale con i migliori parametri.

### 5.3.2 Integrazione con l'Apprendimento per Rinforzo

Usa EvoX per evolvere le politiche delle reti neurali:

1. Incapsula l'ambiente RL usando `BraxProblem`.
2. Appiattisci la rete della politica usando `ParamsAndVector`.
3. Ottimizza usando algoritmi evolutivi come GA o CMA-ES.
4. Distribuisci le politiche ottimizzate direttamente o affina con RL.

EvoX supporta la simulazione batch degli ambienti per sfruttare appieno la potenza GPU/CPU.

---

**In sintesi**, EvoX fornisce API potenti e modulari e un design orientato allo sviluppatore per implementare algoritmi personalizzati, incapsulare qualsiasi problema di ottimizzazione e integrarsi con strumenti ML e RL. Man mano che approfondisci la tua comprensione, puoi applicare creativamente queste interfacce per costruire soluzioni di ottimizzazione su misura.
