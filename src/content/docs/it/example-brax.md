---
title: "Risolvere Problemi Brax in EvoX"
order: 11
section: "examples"
---

# Risolvere Problemi Brax in EvoX

EvoX approfondisce la neuroevoluzione con Brax.
Qui mostreremo un esempio di risoluzione di un problema Brax in EvoX.

```python
# installa EvoX e Brax, salta se hai già installato EvoX o Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# I pacchetti o le funzioni dipendenti in questo esempio
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## Cos'è Brax

Brax è un motore fisico veloce e completamente differenziabile usato per la ricerca e lo sviluppo di robotica, percezione umana, scienza dei materiali, apprendimento per rinforzo e altre applicazioni ad alta intensità di simulazione.

Qui dimostreremo un ambiente "swimmer" di Brax.

Per maggiori informazioni, puoi consultare il [Github di Brax](https://github.com/google/brax).

## Progettare una classe di rete neurale

Per iniziare, dobbiamo decidere quale rete neurale costruire.

Qui daremo una semplice classe Multilayer Perceptron (MLP).

```python
# Costruisci un MLP usando PyTorch.
# Questo MLP ha 3 strati.


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
# Assicurati che il modello sia sullo stesso dispositivo, preferibilmente sulla GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Reimposta il seed casuale
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Inizializza il modello MLP
model = SimpleMLP().to(device)
```

### Inizializzare un adattatore

Un adattatore può aiutarci a convertire i dati avanti e indietro.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Con un adattatore, possiamo procedere con questa attività di Neuroevoluzione.

## Configurare il processo di esecuzione

### Inizializzare un algoritmo e un problema

Inizializziamo un [algoritmo PSO](#evox.algorithms.so.pso_variants.pso.PSO), e il problema è un [problema Brax](#evox.problems.neuroevolution.brax.BraxProblem) nell'ambiente "swimmer".

```python
# Imposta la dimensione della popolazione
POP_SIZE = 1024

# Ottieni i limiti dell'algoritmo PSO
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Inizializza il PSO, puoi anche usare qualsiasi altro algoritmo
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Inizializza il problema Brax
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
    device=device,
)
```

In questo caso, useremo 1000 passi per ogni episodio, e la ricompensa media di 3 episodi verrà restituita come valore di fitness.

### Impostare un monitor

```python
# imposta un monitor, che può registrare le 3 migliori fitness
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Inizializzare un workflow

```python
# Inizializza un workflow
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
> Il seguente blocco impiegherà circa 20 minuti per l'esecuzione.
> Il tempo può variare a seconda del tuo hardware.

```python
# Imposta il numero massimo di generazioni
max_generation = 50

# Esegui il workflow
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
> - Normalmente, ti basta `HTML(problem.visualize(best_params))` per il rendering. Il codice sopra è un workaround per assicurare che il risultato sia visualizzato correttamente sul nostro sito web.
> - L'algoritmo PSO non è specificamente ottimizzato per questo tipo di attività, quindi sono previste limitazioni di prestazioni. Questo esempio è a scopo dimostrativo.

Speriamo che ti diverta a risolvere problemi Brax con EvoX!
