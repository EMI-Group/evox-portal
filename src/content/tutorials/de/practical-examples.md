---
title: "7. Praktische Beispiele"
order: 7
---

# 7. Praktische Beispiele

Dieses Kapitel präsentiert mehrere vollständige, praktische Beispiele, um zu demonstrieren, wie das Wissen aus den vorherigen Kapiteln angewendet wird. Wir werden ein Optimierungsprojekt von Grund auf neu erstellen und zeigen, wie EvoX mit anderen Tools integriert werden kann. Diese Beispiele decken eine Reihe von Problemtypen ab, um Ihnen zu helfen, EvoX in realen Szenarien anzuwenden.

---

## Beispiel 1: Einzelziel-Optimierung

**Problem**: Optimierung der klassischen Rastrigin-Funktion:

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

wobei $\mathbf{x} \in \mathbb{R}^d$ und $d$ die Dimensionalität ist. Das globale Optimum ist 0 im Ursprung. Die Funktion ist hochgradig multimodal, was sie ideal zum Testen globaler Optimierungsalgorithmen macht. Hier ist eine Darstellung der Rastrigin-Funktion

```{figure} /_static/rastrigin_function.svg
:alt: Eine Darstellung der Rastrigin-Funktion
:figwidth: 70%
:align: center

Rastrigin-Funktion
```

In diesem Beispiel verwenden wir den Particle Swarm Optimization (PSO) Algorithmus, um die 10-dimensionale Rastrigin-Funktion zu optimieren.

**Schritt 1: Einrichtung**

Vorausgesetzt, Sie haben Ihre EvoX-Umgebung wie in Kapitel 2 beschrieben konfiguriert.

**Schritt 2: Workflow-Einrichtung**

Erstellen Sie ein Python-Skript `opt_rastrigin_10.py`:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Definieren Sie den PSO-Algorithmus:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

Richten Sie das Problem und den Workflow ein:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Schritt 3: Optimierung ausführen**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Beispielausgabe**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

Der PSO-Algorithmus findet wie erwartet eine nahezu optimale Lösung nahe dem Ursprung.

---

## Beispiel 2: Mehrziel-Optimierung

**Problem**: Minimierung von zwei Zielen:

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Die Pareto-Front liegt zwischen $x = 0$ (optimal für $f_1$) und $x = 2$ (optimal für $f_2$).

**Schritt 1: Umgebungseinrichtung**

Stellen Sie sicher, dass Sie EvoX mit NSGA-II-Unterstützung installiert haben.

**Schritt 2: Definieren des benutzerdefinierten Problems**

EvoX verfügt über viele integrierte Mehrziel-Testprobleme, aber für dieses Beispiel werden wir ein benutzerdefiniertes Problem definieren, um die beiden Ziele zu optimieren:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Import evox core classes, see Chapter 5 for details
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Optional: Define the Pareto front function
    def pf(self) -> torch.Tensor:
        pass
```

**Schritt 3: Algorithmus und Workflow definieren**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Schritt 4: Optimierung und Visualisierung**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Wir können die Ergebnisse mit Matplotlib visualisieren. Die blauen Punkte stellen die optimierte Population dar, während die rote Linie die Pareto-Front zeigt.

```{figure} /_static/example_nsga2_result.svg
:alt: Eine Darstellung der NSGA-II-Population
:figwidth: 70%
:align: center

Eine Darstellung der NSGA-II-Population nach der Optimierung
```

In Jupyter Notebook können Sie die integrierten Plotting-Funktionen von EvoX nutzen, um den Optimierungsprozess zu visualisieren und zu überwachen, wie sich die Population über Generationen hinweg entwickelt.

```python
monitor.plot()
```

---

## Beispiel 3: Hyperparameter-Optimierung (HPO)

**Problem**: Feinabstimmung von `C` und `max_iter` eines logistischen Regressionsklassifikators auf dem Brustkrebs-Datensatz, um die Validierungsgenauigkeit zu maximieren.

**Schritt 1: Daten und Modell laden**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**Schritt 2: Problem definieren**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```

**Schritt 3: Workflow-Einrichtung**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Schritt 4: Optimierung**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Beispielausgabe**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Mit nur wenigen Zeilen Code automatisiert EvoX das mühsame Trial-and-Error der Hyperparameter-Optimierung.

---

Diese praktischen Beispiele veranschaulichen, wie EvoX effektiv in verschiedenen Bereichen eingesetzt werden kann, von mathematischen Testfunktionen bis hin zu Machine-Learning-Workflows. Sobald Sie mit der grundlegenden Struktur vertraut sind – **Algorithm + Problem + Monitor + Workflow** – können Sie EvoX an fast jede Optimierungsaufgabe anpassen.