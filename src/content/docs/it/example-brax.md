---
title: "Risolvere Problemi Brax in EvoX"
order: 11
section: "examples"
---

# Risolvere Problemi Brax in EvoX

EvoX si immerge profondamente nella neuroevoluzione con Brax.
Qui mostreremo un esempio di risoluzione di un problema Brax in EvoX.

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

## Cos'è Brax

Brax è un motore fisico veloce e completamente differenziabile utilizzato per la ricerca e lo sviluppo di robotica, percezione umana, scienza dei materiali, reinforcement learning e altre applicazioni ad alta intensità di simulazione.

Qui dimostreremo un ambiente "swimmer" di Brax.

Per maggiori informazioni, puoi consultare il [Github di Brax](https://github.com/google/brax).

## Progettare una classe di rete neurale

Per iniziare, dobbiamo decidere quale rete neurale stiamo per costruire.

Qui forniremo una semplice classe Multilayer Perceptron (MLP).

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

## Inizializzare un modello

Attraverso la classe ``SimpleMLP``, possiamo inizializzare un modello MLP.

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

### Inizializzare un adapter

Un adapter può aiutarci a convertire i dati avanti e indietro.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Con un adapter, possiamo accingerci a svolgere questo task di Neuroevoluzione.

## Impostare il processo di esecuzione

### Inizializzare un algoritmo e un problema

Inizializziamo un `algoritmo PSO`, e il problema è un `problema Brax` nell'ambiente "swimmer".

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

In questo caso, utilizzeremo 1000 step per ogni episodio, e la ricompensa media di 3 episodi verrà restituita come valore di fitness.

### Impostare un monitor

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Inizializzare un workflow

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

### Eseguire il workflow

Esegui il workflow e guarda la magia!

> **Nota:**
> Il seguente blocco impiegherà circa 20 minuti per essere eseguito.
> Il tempo può variare a seconda del tuo hardware.

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

> **Importante:**
> - Normalmente, hai solo bisogno di `HTML(problem.visualize(best_params))` per il rendering. Il codice sopra è un workaround per garantire che il risultato venga visualizzato correttamente sul nostro sito web.
> - L'algoritmo PSO non è specificamente ottimizzato per questo tipo di task, quindi sono previste limitazioni nelle prestazioni. Questo esempio è a scopo dimostrativo.

Speriamo che ti piaccia risolvere problemi Brax con EvoX e buon divertimento!