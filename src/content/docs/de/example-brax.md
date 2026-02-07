---
title: "Lösung von Brax-Problemen in EvoX"
order: 11
section: "examples"
---

# Lösung von Brax-Problemen in EvoX

EvoX taucht tief in die Neuroevolution mit Brax ein.
Hier zeigen wir ein Beispiel zur Lösung eines Brax-Problems in EvoX.

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

## Was ist Brax

Brax ist eine schnelle und vollständig differenzierbare Physik-Engine, die für Forschung und Entwicklung in den Bereichen Robotik, menschliche Wahrnehmung, Materialwissenschaft, Reinforcement Learning und andere simulationsintensive Anwendungen eingesetzt wird.

Hier demonstrieren wir eine "swimmer"-Umgebung von Brax.

Weitere Informationen finden Sie auf dem [Github von Brax](https://github.com/google/brax).

## Ein neuronales Netzwerk entwerfen

Zunächst müssen wir entscheiden, welches neuronale Netzwerk wir konstruieren möchten.

Hier geben wir eine einfache Multilayer-Perceptron (MLP)-Klasse an.

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

## Ein Modell initiieren

Durch die ``SimpleMLP``-Klasse können wir ein MLP-Modell initiieren.

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

### Einen Adapter initiieren

Ein Adapter kann uns helfen, die Daten hin und her zu konvertieren.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Mit einem Adapter können wir diese Neuroevolution-Aufgabe in Angriff nehmen.

## Den Ausführungsprozess einrichten

### Einen Algorithmus und ein Problem initiieren

Wir initiieren einen [PSO-Algorithmus](#evox.algorithms.so.pso_variants.pso.PSO), und das Problem ist ein [Brax-Problem](#evox.problems.neuroevolution.brax.BraxProblem) in der "swimmer"-Umgebung.

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

In diesem Fall verwenden wir 1000 Schritte für jede Episode, und die durchschnittliche Belohnung von 3 Episoden wird als Fitnesswert zurückgegeben.

### Einen Monitor einrichten

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Einen Workflow initiieren

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

### Den Workflow ausführen

Führen Sie den Workflow aus und erleben Sie die Magie!

> **Hinweis:**
> Der folgende Block benötigt etwa 20 Minuten zur Ausführung.
> Die Zeit kann je nach Ihrer Hardware variieren.

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

> **Wichtig:**
> - Normalerweise benötigen Sie nur `HTML(problem.visualize(best_params))` zum Rendern. Der obige Code ist ein Workaround, um sicherzustellen, dass das Ergebnis auf unserer Website korrekt angezeigt wird.
> - Der PSO-Algorithmus ist nicht speziell für diese Art von Aufgabe optimiert, daher sind Leistungseinschränkungen zu erwarten. Dieses Beispiel dient Demonstrationszwecken.

Wir hoffen, dass Sie Spaß beim Lösen von Brax-Problemen mit EvoX haben!
