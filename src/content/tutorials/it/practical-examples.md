---
title: "7. Esempi Pratici"
order: 7
---

# 7. Esempi Pratici

Questo capitolo presenta diversi esempi completi e pratici per dimostrare come applicare le conoscenze dei capitoli precedenti. Costruiremo un progetto di ottimizzazione da zero e mostreremo come EvoX può essere integrato con altri strumenti. Questi esempi coprono una gamma di tipi di problemi per aiutarti ad applicare EvoX in scenari reali.

---

## Esempio 1: Ottimizzazione Mono-Obiettivo

**Problema**: Ottimizzare la classica funzione Rastrigin:

```math
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

dove $\mathbf{x} \in \mathbb{R}^d$ e $d$ è la dimensionalità. L'ottimo globale è 0 all'origine. La funzione è altamente multimodale, rendendola ideale per testare algoritmi di ottimizzazione globale. Ecco un grafico della funzione Rastrigin

![Un grafico della funzione Rastrigin](/_static/rastrigin_function.svg)

*Funzione Rastrigin*

In questo esempio, useremo l'algoritmo di Ottimizzazione a Sciame di Particelle (PSO) per ottimizzare la funzione Rastrigin a 10 dimensioni.

**Passo 1: Configurazione**

Supponendo che tu abbia configurato il tuo ambiente EvoX come spiegato nel Capitolo 2.

**Passo 2: Configurazione del Workflow**

Crea uno script Python `opt_rastrigin_10.py`:

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

Definisci l'algoritmo PSO:

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

Configura il problema e il workflow:

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**Passo 3: Esegui l'Ottimizzazione**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**Output di Esempio**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

L'algoritmo PSO trova una soluzione quasi ottimale vicina all'origine, come previsto.

---

## Esempio 2: Ottimizzazione Multi-Obiettivo

**Problema**: Minimizzare due obiettivi:

```math
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

Il fronte di Pareto si trova tra $x = 0$ (ottimale per $f_1$) e $x = 2$ (ottimale per $f_2$).

**Passo 1: Configurazione dell'Ambiente**

Assicurati di avere EvoX installato con supporto NSGA-II.

**Passo 2: Definisci il Problema Personalizzato**

EvoX ha molti problemi di test multi-obiettivo integrati, ma per questo esempio definiremo un problema personalizzato per ottimizzare i due obiettivi:

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# Importa le classi core di evox, vedi Capitolo 5 per i dettagli
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # Opzionale: Definisci la funzione del fronte di Pareto
    def pf(self) -> torch.Tensor:
        pass
```

**Passo 3: Definisci Algoritmo e Workflow**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Passo 4: Ottimizzazione e Visualizzazione**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Possiamo visualizzare i risultati usando Matplotlib. I punti blu rappresentano la popolazione ottimizzata, mentre la linea rossa mostra il fronte di Pareto.

![Un grafico della popolazione NSGA-II](/_static/example_nsga2_result.svg)

*Un grafico della popolazione NSGA-II dopo l'ottimizzazione*

In Jupyter Notebook, puoi usare le capacità di plotting integrate di EvoX per visualizzare il processo di ottimizzazione e monitorare come la popolazione evolve nel corso delle generazioni.

```python
monitor.plot()
```

---

## Esempio 3: Ottimizzazione degli Iperparametri (HPO)

**Problema**: Regolare `C` e `max_iter` di un classificatore di regressione logistica sul dataset del cancro al seno per massimizzare l'accuratezza di validazione.

**Passo 1: Carica Dati e Modello**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**Passo 2: Definisci il Problema**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # error rate
        return torch.tensor(objs)
```

**Passo 3: Configurazione del Workflow**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**Passo 4: Ottimizzazione**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**Output di Esempio**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

Con poche righe di codice, EvoX automatizza il tedioso processo di tentativi ed errori della regolazione degli iperparametri.

---

Questi esempi pratici illustrano come EvoX può essere applicato efficacemente in vari domini, dalle funzioni di test matematiche ai flussi di lavoro di machine learning. Una volta che ti senti a tuo agio con la struttura di base -- **Algoritmo + Problema + Monitor + Workflow** -- puoi adattare EvoX a quasi qualsiasi attività di ottimizzazione.
