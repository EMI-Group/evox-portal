---
title: "Ottimizzazione Numerica"
order: 9
section: "examples"
---

# Ottimizzazione Numerica

Questo notebook offre un tutorial passo-passo sull'utilizzo di EvoX per ottimizzare la funzione di Ackley tramite l'algoritmo Particle Swarm Optimization (PSO). Sia l'algoritmo PSO che il problema di ottimizzazione di Ackley sono integrati come componenti nativi all'interno del framework EvoX.

Per prima cosa, dobbiamo importare tutti i moduli necessari inclusi `PSO` (algoritmo), `Ackley` (problema) e `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Qui, istanziamo l'algoritmo `PSO`. Specifichiamo le seguenti impostazioni:

- `pop_size`: La dimensione dello sciame di particelle (popolazione).
- `lb` e `ub`: I limiti inferiore e superiore per ogni dimensione nello spazio di ricerca.
- Gli altri parametri sono tutti predefiniti. Si prega di fare riferimento all'API dettagliata.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Successivamente, scegliamo la funzione `Ackley` tra i problemi numerici di EvoX.

```python
# Define the problem
problem = Ackley()
```

Creiamo un'istanza di `EvalMonitor` per tracciare le informazioni necessarie durante la procedura di ottimizzazione.

```python
# Define the monitor
monitor = EvalMonitor()
```

La classe `StdWorkflow` fornisce un processo standardizzato per integrare l'algoritmo, il problema e il monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Chiamare `setup()` inizializza i componenti in modo che il workflow sia pronto per eseguire i passaggi di ottimizzazione.

Eseguiamo l'ottimizzazione per un certo numero di iterazioni (100 in questo esempio). In ogni iterazione, il metodo `step()` aggiorna l'algoritmo PSO, valuta le nuove soluzioni candidate sulla funzione di Ackley e traccia la loro fitness tramite il monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Infine, recuperiamo il sottomodulo `monitor` dal workflow per accedere alle migliori soluzioni trovate finora (`topk_solutions`) e ai loro corrispondenti valori obiettivo (`topk_fitness`). Stampiamo quindi il miglior risultato e la soluzione associata.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```