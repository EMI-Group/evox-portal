---
title: "Ottimizzazione Numerica"
order: 9
section: "examples"
---

# Ottimizzazione Numerica

Questo notebook offre un tutorial passo-passo sull'utilizzo di EvoX per ottimizzare la funzione Ackley tramite l'algoritmo di Ottimizzazione a Sciame di Particelle (PSO). Sia l'algoritmo PSO che il problema di ottimizzazione Ackley sono integrati come componenti predefiniti nel framework EvoX.

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
- Gli altri parametri sono tutti predefiniti. Consulta l'API dettagliata.

```python
# Definisci l'algoritmo
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Successivamente, scegliamo la funzione `Ackley` tra i problemi numerici di EvoX.

```python
# Definisci il problema
problem = Ackley()
```

Creiamo un'istanza di `EvalMonitor` per tracciare le informazioni necessarie durante la procedura di ottimizzazione.

```python
# Definisci il monitor
monitor = EvalMonitor()
```

La classe `StdWorkflow` fornisce un processo standardizzato per integrare l'algoritmo, il problema e il monitor.

```python
# Definisci il workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Chiamare `setup()` inizializza i componenti in modo che il workflow sia pronto per eseguire i passi di ottimizzazione.

Eseguiamo l'ottimizzazione per un certo numero di iterazioni (100 in questo esempio). In ogni iterazione, il metodo `step()` aggiorna l'algoritmo PSO, valuta le nuove soluzioni candidate sulla funzione Ackley e traccia la loro fitness tramite il monitor.

```python
# Esegui la procedura di ottimizzazione della funzione Ackley
for _ in range(100):
    workflow.step()
```

Infine, recuperiamo il sottomodulo `monitor` dal workflow per accedere alle migliori soluzioni trovate finora (`topk_solutions`) e i corrispondenti valori obiettivo (`topk_fitness`). Poi stampiamo il miglior risultato e la soluzione associata.

```python
# Ottieni la migliore soluzione e la sua fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
