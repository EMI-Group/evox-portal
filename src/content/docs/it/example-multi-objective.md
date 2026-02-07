---
title: "Algoritmo Multi-Obiettivo"
order: 10
section: "examples"
---

# Algoritmo Multi-Obiettivo

In questo notebook, useremo l'Algoritmo Evolutivo Guidato da Vettori di Riferimento (**RVEA**) per trovare le soluzioni ottimali del problema **DTLZ2**.

```python
import time
import torch

from evox.algorithms import RVEA
from evox.metrics import igd
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor
```

## (Opzionale) Usa la GPU per eseguire il codice
Spesso preferiamo eseguire il nostro codice su una GPU per un'esecuzione più veloce. Tuttavia, se una GPU non è disponibile, l'esecuzione su CPU è comunque accettabile.

```python
# Usa prima la GPU per eseguire il codice.
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
print(torch.get_default_device())
```

## Esempio di esecuzione: RVEA sul problema DTLZ2
Il seguente codice viene usato per configurare il problema `DTLZ2` e l'algoritmo `RVEA`. Maggiori informazioni sul problema e sull'algoritmo possono essere trovate nella sezione corrispondente della documentazione.

```python
# Inizializza il problema, l'algoritmo e il workflow.
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
compiled_step = torch.compile(workflow.step)
```

Con questa configurazione in atto, possiamo ora iniziare a ottimizzare. Impostiamo l'algoritmo multi-obiettivo per ottimizzare per 100 passi su questo problema

```python
# Esegui il workflow per 100 passi
t = time.time()
workflow.init_step()
for i in range(100):
    compiled_step()
    fit = workflow.algorithm.fit
    fit = fit[~torch.isnan(fit).any(dim=1)]
    if i % 10 == 0:
        print(igd(fit, pf))
```

```python
monitor.plot()
```
