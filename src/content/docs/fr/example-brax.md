---
title: "Résoudre des problèmes Brax dans EvoX"
order: 11
section: "examples"
---

# Résoudre des problèmes Brax dans EvoX

EvoX explore la neuroévolution en profondeur avec Brax.
Ici, nous montrerons un exemple de résolution d'un problème Brax dans EvoX.

```python
# install EvoX and Brax, skip it if you have already installed EvoX or Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# The dependent packages or functions in this example
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## Qu'est-ce que Brax

Brax est un moteur physique rapide et entièrement différentiable utilisé pour la recherche et le développement en robotique, perception humaine, science des matériaux, apprentissage par renforcement et autres applications nécessitant beaucoup de simulation.

Ici, nous ferons la démonstration avec un environnement « swimmer » de Brax.

Pour plus d'informations, vous pouvez consulter le [Github de Brax](https://github.com/google/brax).

## Concevoir une classe de réseau de neurones

Pour commencer, nous devons décider quel réseau de neurones nous allons construire.

Ici, nous présenterons une classe simple de Perceptron Multicouche (MLP).

```python
# Construct an MLP using PyTorch.
# This MLP has 3 layers.


class SimpleMLP(nn.Module):
    def __init__(self):
        super(SimpleMLP, self).__init__()
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)
```

## Initialiser un modèle

Grâce à la classe ``SimpleMLP``, nous pouvons initialiser un modèle MLP.

```python
# Make sure that the model is on the same device, better to be on the GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Reset the random seed
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Initialize the MLP model
model = SimpleMLP().to(device)
```

### Initialiser un adaptateur

Un adaptateur peut nous aider à convertir les données dans les deux sens.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Avec un adaptateur, nous pouvons entreprendre cette tâche de neuroévolution.

## Configurer le processus d'exécution

### Initialiser un algorithme et un problème

Nous initialisons un [algorithme PSO](#evox.algorithms.so.pso_variants.pso.PSO), et le problème est un [problème Brax](#evox.problems.neuroevolution.brax.BraxProblem) dans l'environnement « swimmer ».

```python
# Set the population size
POP_SIZE = 1024

# Get the bound of the PSO algorithm
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Initialize the PSO, and you can also use any other algorithms
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Initialize the Brax problem
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
    device=device,
)
```

Dans ce cas, nous utiliserons 1000 étapes pour chaque épisode, et la récompense moyenne de 3 épisodes sera renvoyée comme valeur de fitness.

### Définir un moniteur

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Initialiser un workflow

```python
# Initiate an workflow
workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
    device=device,
)
```

### Exécuter le workflow

Exécutez le workflow et voyez la magie opérer !

> **Note :**
> Le bloc suivant prendra environ 20 minutes à s'exécuter.
> Le temps peut varier en fonction de votre matériel.

```python
# Set the maximum number of generations
max_generation = 50

# Run the workflow
workflow.init_step()
compiled_step = torch.compile(workflow.step)
for i in range(max_generation):
    if i % 10 == 0:
        print(f"Generation {i}")
    compiled_step()

print(f"Top fitness: {monitor.get_best_fitness()}")
best_params = adapter.to_params(monitor.get_best_solution())
print(f"Best params: {best_params}")
```

```python
monitor.get_best_fitness()
```

```python
monitor.plot()
```

```python
html_string = problem.visualize(best_params)
escaped_string = html_string.replace('"', "&quot;")
HTML(f'<iframe srcdoc="{escaped_string}" width="100%" height="480" frameborder="0"></iframe>')
```

> **Important :**
> - Normalement, vous n'avez besoin que de `HTML(problem.visualize(best_params))` pour le rendu. Le code ci-dessus est une solution de contournement pour garantir que le résultat s'affiche correctement sur notre site web.
> - L'algorithme PSO n'est pas spécifiquement optimisé pour ce type de tâche, des limitations de performance sont donc attendues. Cet exemple est à des fins de démonstration.

Nous espérons que vous apprécierez la résolution de problèmes Brax avec EvoX et que vous vous amuserez !