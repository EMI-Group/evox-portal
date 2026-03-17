---
title: "HPO Efficace avec EvoX"
order: 13
section: "examples"
---

# HPO Efficace avec EvoX

Dans ce chapitre, nous explorerons comment utiliser EvoX pour l'optimisation des hyperparamètres (HPO).

L'HPO joue un rôle crucial dans de nombreuses tâches de machine learning, mais elle est souvent négligée en raison de son coût de calcul élevé, qui peut parfois prendre des jours à traiter, ainsi que des défis liés au déploiement.

Avec EvoX, nous pouvons simplifier le déploiement de l'HPO en utilisant le `HPOProblemWrapper` et obtenir un calcul efficace en tirant parti de la méthode `vmap` et de l'accélération GPU.

## Transformer un Workflow en Problème

![Structure HPO](/_static/HPO_structure.png)

La clé pour déployer l'HPO avec EvoX est de transformer les `workflows` en `problems` à l'aide du `HPOProblemWrapper`. Une fois transformés, nous pouvons traiter les `workflows` comme des `problems` standard. L'entrée du 'problème HPO' consiste en les hyperparamètres, et la sortie correspond aux métriques d'évaluation.

## Le Composant Clé -- `HPOProblemWrapper`

Pour s'assurer que le `HPOProblemWrapper` reconnaisse les hyperparamètres, nous devons les envelopper en utilisant `Parameter`. Avec cette étape simple, les hyperparamètres seront automatiquement identifiés.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...): 
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## Utilisation du `HPOFitnessMonitor`

Nous fournissons un `HPOFitnessMonitor` qui prend en charge le calcul des métriques 'IGD' et 'HV' pour les problèmes multi-objectifs, ainsi que la valeur minimale pour les problèmes mono-objectifs.

Il est important de noter que le `HPOFitnessMonitor` est un moniteur de base conçu pour les problèmes HPO. Vous pouvez également créer votre propre moniteur personnalisé de manière flexible en utilisant l'approche décrite dans [Déployer l'HPO avec des Algorithmes Personnalisés](../custom-hpo).

## Un exemple simple

Ici, nous allons démontrer un exemple simple d'utilisation d'EvoX pour l'HPO. Plus précisément, nous utiliserons l'algorithme `PSO` pour optimiser les hyperparamètres de l'algorithme `PSO` afin de résoudre le problème de la sphère.

Veuillez noter que ce chapitre ne fournit qu'un bref aperçu du déploiement de l'HPO. Pour un guide plus détaillé, reportez-vous à [Déployer l'HPO avec des Algorithmes Personnalisés](../custom-hpo).

Pour commencer, importons les modules nécessaires.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Ensuite, nous définissons un problème Sphere simple.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Ensuite, nous pouvons utiliser le `StdWorkflow` pour envelopper le `problem`, l'`algorithm` et le `monitor`. Puis nous utilisons le `HPOProblemWrapper` pour transformer le `StdWorkflow` en un problème HPO.

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

Le `HPOProblemWrapper` prend 4 arguments :
1. `iterations` : Le nombre d'itérations à exécuter dans le processus d'optimisation.
2. `num_instances` : Le nombre d'instances à exécuter en parallèle dans le processus d'optimisation.
3. `workflow` : Le workflow à utiliser dans le processus d'optimisation.
4. `copy_init_state` : Indique s'il faut copier l'état initial du workflow pour chaque évaluation. La valeur par défaut est `True`. Si votre workflow contient des opérations qui modifient sur place (IN-PLACE) le(s) tenseur(s) dans l'état initial, ceci doit être défini sur `True`. Sinon, vous pouvez le définir sur `False` pour économiser de la mémoire.

Nous pouvons vérifier si le `HPOProblemWrapper` reconnaît correctement les hyperparamètres que nous définissons. Puisqu'aucune modification n'est apportée aux hyperparamètres sur les 5 instances, ils devraient rester identiques pour toutes les instances.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Nous pouvons également définir un ensemble personnalisé de valeurs d'hyperparamètres. Il est important de s'assurer que le nombre d'ensembles d'hyperparamètres correspond au nombre d'instances dans le `HPOProblemWrapper`. De plus, les hyperparamètres personnalisés doivent être fournis sous forme de dictionnaire dont les valeurs sont enveloppées en utilisant `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Maintenant, nous utilisons l'algorithme `PSO` pour optimiser les hyperparamètres de l'algorithme `PSO`.

Il est important de s'assurer que la taille de la population du `PSO` correspond au nombre d'instances ; sinon, des erreurs inattendues peuvent survenir.

De plus, la solution doit être transformée dans le workflow externe, car le `HPOProblemWrapper` nécessite que l'entrée soit sous la forme d'un dictionnaire.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```