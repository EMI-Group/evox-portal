---
title: "Déployer l'HPO avec des algorithmes personnalisés"
order: 6
section: "developer"
---

# Déployer l'HPO avec des algorithmes personnalisés

Dans ce chapitre, nous nous concentrerons sur le déploiement de l'HPO avec des algorithmes personnalisés, en mettant l'accent sur les détails plutôt que sur le flux de travail global. Une brève introduction au déploiement de l'HPO est fournie dans le [tutoriel](#/tutorial/tutorial_part7), et sa lecture préalable est vivement recommandée.

## Rendre les algorithmes parallélisables

Puisque nous devons transformer l'algorithme interne en problème, il est crucial que l'algorithme interne soit parallélisable. Par conséquent, certaines modifications de l'algorithme peuvent être nécessaires.

1. L'algorithme ne doit avoir aucune méthode avec des opérations sur place (in-place) sur les attributs de l'algorithme lui-même.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. La logique du code ne repose pas sur le flux de contrôle Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #attribute of the algorithm itself
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # function with python control flow
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # function without python control flow
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```


## Utilisation du HPOMonitor

Dans la tâche HPO, nous devons utiliser le `HPOMonitor` pour suivre les métriques de chaque algorithme interne. Le `HPOMonitor` n'ajoute qu'une seule méthode, `tell_fitness`, par rapport au `monitor` standard. Cet ajout est conçu pour offrir une plus grande flexibilité dans l'évaluation des métriques, car les tâches HPO impliquent souvent des métriques multidimensionnelles et complexes.

Les utilisateurs doivent simplement créer une sous-classe de `HPOMonitor` et surcharger la méthode `tell_fitness` pour définir des métriques d'évaluation personnalisées.

Nous fournissons également un `HPOFitnessMonitor` simple, qui prend en charge le calcul des métriques 'IGD' et 'HV' pour les problèmes multi-objectifs, et la valeur minimale pour les problèmes mono-objectifs.

## Un exemple simple

Ici, nous allons présenter un exemple simple de l'utilisation de l'HPO avec EvoX. Nous utiliserons l'algorithme `PSO` pour rechercher les hyper-paramètres optimaux d'un algorithme de base afin de résoudre le problème de la sphère.

Tout d'abord, importons les modules nécessaires.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Ensuite, nous définissons un problème de sphère simple. Notez que cela ne diffère pas des `problems` courants.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Ensuite, nous définissons l'algorithme, nous utilisons la fonction `torch.cond` et nous nous assurons qu'il est parallélisable. Plus précisément, nous modifions les opérations sur place et ajustons le flux de contrôle Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # the hyperparameters to be optimized
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # one update strategy
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  #  the other update strategy
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simply random sampling
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

Pour gérer le flux de contrôle Python, nous utilisons [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html), ensuite, nous pouvons utiliser le `StdWorkflow` pour envelopper le `problem`, l'`algorithm` et le `monitor`. Puis nous utilisons le `HPOProblemWrapper` pour transformer le `StdWorkflow` en problème HPO.

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

Nous pouvons tester si le `HPOProblemWrapper` reconnaît correctement les hyper-paramètres que nous avons définis. Puisque nous n'avons apporté aucune modification aux hyper-paramètres pour les 7 instances, ils devraient être identiques pour toutes les instances.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Nous pouvons également spécifier notre propre ensemble de valeurs d'hyperparamètres. Notez que le nombre d'ensembles d'hyperparamètres doit correspondre au nombre d'instances dans le `HPOProblemWrapper`. Les hyper-paramètres personnalisés doivent être fournis sous forme de dictionnaire dont les valeurs sont enveloppées dans le `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Maintenant, nous utilisons l'algorithme `PSO` pour optimiser les hyper-paramètres de `ExampleAlgorithm`. Notez que la taille de la population du `PSO` doit correspondre au nombre d'instances ; sinon, des erreurs inattendues peuvent survenir. Dans ce cas, nous devons transformer la solution dans le flux de travail externe, car le `HPOProblemWrapper` nécessite un dictionnaire en entrée.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {"self.algorithm.hp": x}


outer_algo = PSO(7, -3 * torch.ones(4), 3 * torch.ones(4))
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow()
outer_workflow.setup(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
for _ in range(20):
    outer_workflow.step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```