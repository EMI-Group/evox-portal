---
title: "Algoritmi e problemi personalizzati in EvoX"
order: 5
section: "developer"
---

# Algoritmi e problemi personalizzati in EvoX

In questo capitolo, introdurremo come implementare i propri algoritmi e problemi in EvoX.

## Struttura degli algoritmi e dei problemi

Nella maggior parte delle librerie EC tradizionali, gli algoritmi di solito chiamano la funzione obiettivo internamente, il che dà la seguente struttura:

```
Algorithm
|
+--Problem
```

**Ma in EvoX, abbiamo una struttura piatta:**

```
Algorithm.step -- Problem.evaluate
```

Questa struttura rende sia gli algoritmi che i problemi più universali: un algoritmo può ottimizzare problemi diversi, mentre un problema può anche essere adatto a molti algoritmi.


## Classe Algorithm

La classe `Algorithm` eredita da `ModuleBase`.

**In totale, ci sono 5 metodi (2 metodi sono opzionali) che dobbiamo implementare:**

| Metodo       | Firma                               | Utilizzo                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Inizializza l'istanza dell'algoritmo, ad esempio, la dimensione della popolazione (rimane costante durante l'iterazione), gli iperparametri (possono essere impostati solo dal wrapper del problema HPO o inizializzati qui), e/o tensori mutabili (possono essere modificati al volo). |
| `step`               | `(self)`                        | Esegue un normale passo di iterazione dell'ottimizzazione dell'algoritmo. |
| `init_step` (opzionale) | `(self)` | Esegue il primo passo dell'ottimizzazione dell'algoritmo. Se questo metodo non viene sovrascritto, verrà invocato il metodo `step`. |

> **Nota:**
> L'inizializzazione statica può ancora essere scritta in `__init__` mentre l'inizializzazione dei sottomoduli mutabili no. Pertanto, chiamate multiple di `setup` per inizializzazioni ripetute sono possibili se il metodo `setup` sovrascritto invoca prima il `setup()` di `ModuleBase`.
>
> Se tale metodo `setup` in `ModuleBase` non è adatto al tuo algoritmo, puoi sovrascrivere il metodo `setup` quando crei la tua classe algoritmo.


## Classe Problem

La classe `Problem` eredita anch'essa da `ModuleBase`.

Tuttavia, la classe Problem è piuttosto semplice. **Oltre al metodo `__init__`, l'unico metodo necessario è il metodo `evaluate`.**

| Metodo     | Firma                                   | Utilizzo                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Inizializza le impostazioni del problema.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Valuta la fitness della popolazione data. |

Tuttavia, il tipo dell'argomento `pop` in `evaluate` può essere cambiato in altri tipi compatibili con JIT nel metodo sovrascritto.


## Esempio

Qui diamo un esempio di **implementazione di un algoritmo PSO che risolve il problema Sphere**.

### Pseudo-codice dell'esempio

Ecco uno pseudo-codice:

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

Ed ecco a cosa corrisponde ogni parte dell'algoritmo e del problema in EvoX.

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

### Esempio di algoritmo: algoritmo PSO

L'Ottimizzazione a Sciame di Particelle (PSO) è un algoritmo meta-euristico basato sulla popolazione ispirato al comportamento sociale degli uccelli e dei pesci. È ampiamente usato per risolvere problemi di ottimizzazione continui e discreti.

**Ecco un esempio di implementazione dell'algoritmo PSO in EvoX:**

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

### Esempio di problema: problema Sphere

Il problema Sphere è un problema di ottimizzazione benchmark semplice ma fondamentale usato per testare gli algoritmi di ottimizzazione.

La funzione Sphere è definita come:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Ecco un esempio di implementazione del problema Sphere in EvoX:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Ora puoi inizializzare un workflow ed eseguirlo.
