---
title: "Benutzerdefinierter Algorithmus und Problem"
order: 14
section: "examples"
---

# Benutzerdefinierter Algorithmus und Problem
In diesem Notebook zeigen wir, wie man `Algorithm` und `Problem` verwendet, um einen benutzerdefinierten Algorithmus und ein benutzerdefiniertes Problem zu erstellen. Hier geben wir ein Beispiel für die **Implementierung eines PSO-Algorithmus, der das Sphere-Problem löst**.


```python
import torch

from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.utils import clamp
from evox.workflows import EvalMonitor, StdWorkflow
```

## Algorithmus-Beispiel: PSO-Algorithmus

Partikelschwarmoptimierung (PSO) ist ein populationsbasierter metaheuristischer Algorithmus, der vom Sozialverhalten von Vögeln und Fischen inspiriert ist. Er wird häufig zur Lösung kontinuierlicher und diskreter Optimierungsprobleme eingesetzt.

**Hier ist ein Implementierungsbeispiel des PSO-Algorithmus in EvoX:**

```python
def min_by(
    values,
    keys,
):
    """A helper function to find the minimum value in a list of values."""
    values = torch.cat(values, dim=0)
    keys = torch.cat(keys, dim=0)
    min_index = torch.argmin(keys)
    return values[min_index[None]][0], keys[min_index[None]][0]


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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        # setup
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        pop = torch.rand(self.pop_size, self.dim, device=device)
        pop = length * pop + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        # write to self
        self.lb = lb
        self.ub = ub
        # mutable
        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop)
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
        """Perform the first step of the PSO optimization.

        See `step` for more details.
        """
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

## Problem-Beispiel: Sphere-Problem

Das Sphere-Problem ist ein einfaches, aber grundlegendes Benchmark-Optimierungsproblem, das zum Testen von Optimierungsalgorithmen verwendet wird.

Die Sphere-Funktion ist definiert als:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Hier ist ein Implementierungsbeispiel des Sphere-Problems in EvoX:**

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

## Den Algorithmus zur Lösung des Problems verwenden

### Algorithmus, Problem und Monitor initiieren

```python
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0]),
    w=0.6,
    phi_p=2.5,
    phi_g=0.8,
)
problem = Sphere()
monitor = EvalMonitor()
```

### Workflow initiieren und ausführen

```python
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)

for _ in range(100):
    workflow.step()
```

```python
workflow.monitor.plot()
```
