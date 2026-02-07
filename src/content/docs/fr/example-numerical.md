---
title: "Optimisation numérique"
order: 9
section: "examples"
---

# Optimisation numérique

Ce notebook offre un tutoriel étape par étape sur l'utilisation d'EvoX pour optimiser la fonction d'Ackley grâce à l'algorithme d'Optimisation par Essaim de Particules (PSO). L'algorithme PSO et le problème d'optimisation d'Ackley sont intégrés comme composants natifs dans le framework EvoX.

Tout d'abord, nous devons importer tous les modules nécessaires incluant `PSO` (algorithme), `Ackley` (problème) et `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Ici, nous instancions l'algorithme `PSO`. Nous spécifions les paramètres suivants :

- `pop_size` : La taille de l'essaim de particules (population).
- `lb` et `ub` : Les bornes inférieure et supérieure pour chaque dimension dans l'espace de recherche.
- Les autres paramètres sont tous par défaut. Veuillez consulter l'API détaillée.

```python
# Définir l'algorithme
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Ensuite, nous choisissons la fonction `Ackley` dans les problèmes numériques d'EvoX.

```python
# Définir le problème
problem = Ackley()
```

Nous créons une instance `EvalMonitor` pour suivre les informations nécessaires pendant la procédure d'optimisation.

```python
# Définir le moniteur
monitor = EvalMonitor()
```

La classe `StdWorkflow` fournit un processus standardisé pour intégrer l'algorithme, le problème et le moniteur.

```python
# Définir le workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

L'appel à `setup()` initialise les composants afin que le workflow soit prêt à effectuer les étapes d'optimisation.

Nous exécutons l'optimisation pendant un certain nombre d'itérations (100 dans cet exemple). À chaque itération, la méthode `step()` met à jour l'algorithme PSO, évalue les nouvelles solutions candidates sur la fonction d'Ackley et suit leur fitness via le moniteur.

```python
# Effectuer la procédure d'optimisation de la fonction d'Ackley
for _ in range(100):
    workflow.step()
```

Enfin, nous récupérons le sous-module `monitor` du workflow pour accéder aux meilleures solutions trouvées jusqu'à présent (`topk_solutions`) et leurs valeurs objectif correspondantes (`topk_fitness`). Nous affichons ensuite le meilleur résultat et la solution associée.

```python
# Obtenir la meilleure solution et sa fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
