---
title: "7. Exemples pratiques"
order: 7
---

# 7. Exemples pratiques

Ce chapitre présente plusieurs exemples complets et pratiques pour démontrer comment appliquer les connaissances des chapitres précédents. Nous construirons un projet d'optimisation à partir de zéro et montrerons comment EvoX peut être intégré avec d'autres outils. Ces exemples couvrent une gamme de types de problèmes pour vous aider à appliquer EvoX dans des scénarios réels.

---

## Exemple 1 : Optimisation mono-objectif

**Problème** : Optimiser la fonction classique de Rastrigin :

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

où $\mathbf{x} \in \mathbb{R}^d$ et $d$ est la dimensionnalité. L'optimum global est 0 à l'origine. La fonction est hautement multimodale, ce qui la rend idéale pour tester les algorithmes d'optimisation globale. Voici un graphique de la fonction de Rastrigin

```{figure} /_static/rastrigin_function.svg
:alt: Un graphique de la fonction de Rastrigin
:figwidth: 70%
:align: center

Fonction de Rastrigin
```

Dans cet exemple, nous utiliserons l'algorithme d'Optimisation par Essaim de Particules (PSO) pour optimiser la fonction de Rastrigin en 10 dimensions.

**Étape 1 : Configuration**

En supposant que vous avez configuré votre environnement EvoX comme expliqué au Chapitre 2.

**Étape 2 : Configuration du workflow**

Créez un script Python `opt_rastrigin_10.py` :

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Définissez l'algorithme PSO :

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```
Configurez le problème et le workflow :

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Étape 3 : Exécuter l'optimisation**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Exemple de sortie** :

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

L'algorithme PSO trouve une solution quasi-optimale proche de l'origine, comme attendu.

---

## Exemple 2 : Optimisation multi-objectif

**Problème** : Minimiser deux objectifs :

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Le front de Pareto se situe entre $x = 0$ (optimal pour $f_1$) et $x = 2$ (optimal pour $f_2$).

**Étape 1 : Configuration de l'environnement**

Assurez-vous d'avoir EvoX installé avec le support NSGA-II.

**Étape 2 : Définir le problème personnalisé**

EvoX dispose de nombreux problèmes de test multi-objectif intégrés, mais pour cet exemple, nous définirons un problème personnalisé pour optimiser les deux objectifs :

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Importer les classes de base evox, voir le Chapitre 5 pour les détails
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

    # Optionnel : Définir la fonction du front de Pareto
    def pf(self) -> torch.Tensor:
        pass
```
**Étape 3 : Définir l'algorithme et le workflow**

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

**Étape 4 : Optimisation et visualisation**

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

Nous pouvons visualiser les résultats en utilisant Matplotlib. Les points bleus représentent la population optimisée, tandis que la ligne rouge montre le front de Pareto.

```{figure} /_static/example_nsga2_result.svg
:alt: Un graphique de la population NSGA-II
:figwidth: 70%
:align: center

Un graphique de la population NSGA-II après optimisation
```

Dans Jupyter Notebook, vous pouvez utiliser les capacités de tracé intégrées d'EvoX pour visualiser le processus d'optimisation et surveiller comment la population évolue au fil des générations.

```python
monitor.plot()
```

---

## Exemple 3 : Optimisation d'hyperparamètres (HPO)

**Problème** : Ajuster `C` et `max_iter` d'un classifieur de régression logistique sur le jeu de données du cancer du sein pour maximiser la précision de validation.

**Étape 1 : Charger les données et le modèle**

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

**Étape 2 : Définir le problème**

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

**Étape 3 : Configuration du workflow**

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

**Étape 4 : Optimisation**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Exemple de sortie** :

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Avec seulement quelques lignes de code, EvoX automatise le fastidieux processus d'essai-erreur du réglage des hyperparamètres.

---

Ces exemples pratiques illustrent comment EvoX peut être efficacement appliqué dans divers domaines, des fonctions de test mathématiques aux workflows d'apprentissage automatique. Une fois que vous êtes à l'aise avec la structure de base — **Algorithme + Problème + Moniteur + Workflow** — vous pouvez adapter EvoX à presque n'importe quelle tâche d'optimisation.
