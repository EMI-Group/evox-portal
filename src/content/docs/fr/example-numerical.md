---
title: "Optimisation Numérique"
order: 9
section: "examples"
---

# Optimisation Numérique

Ce notebook propose un tutoriel étape par étape sur l'utilisation d'EvoX pour optimiser la fonction Ackley via l'algorithme d'optimisation par essaim particulaire (PSO). L'algorithme PSO et le problème d'optimisation Ackley sont tous deux intégrés comme composants natifs au sein du framework EvoX.

Tout d'abord, nous devons importer tous les modules nécessaires, y compris `PSO` (algorithme), `Ackley` (problème) ainsi que `StdWorkflow` et `EvalMonitor` (flux de travail).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Ici, nous instancions l'algorithme `PSO`. Nous spécifions les paramètres suivants :

- `pop_size` : La taille de l'essaim de particules (population).
- `lb` et `ub` : Les bornes inférieures et supérieures pour chaque dimension de l'espace de recherche.
- Les autres paramètres sont laissés par défaut. Veuillez vous référer à l'API détaillée.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Ensuite, nous choisissons la fonction `Ackley` parmi les problèmes numériques d'EvoX.

```python
# Define the problem
problem = Ackley()
```

Nous créons une instance `EvalMonitor` pour suivre les informations nécessaires pendant la procédure d'optimisation.

```python
# Define the monitor
monitor = EvalMonitor()
```

La classe `StdWorkflow` fournit un processus standardisé pour intégrer l'algorithme, le problème et le moniteur.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

L'appel à `setup()` initialise les composants afin que le flux de travail soit prêt à effectuer les étapes d'optimisation.

Nous exécutons l'optimisation pour un certain nombre d'itérations (100 dans cet exemple). À chaque itération, la méthode `step()` met à jour l'algorithme PSO, évalue les nouvelles solutions candidates sur la fonction Ackley et suit leur fitness via le moniteur.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Enfin, nous récupérons le sous-module `monitor` du flux de travail pour accéder aux meilleures solutions trouvées jusqu'à présent (`topk_solutions`) et à leurs valeurs objectives correspondantes (`topk_fitness`). Nous imprimons ensuite le meilleur résultat et la solution associée.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```