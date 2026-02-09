---
title: "Implementare HPO con Algoritmi Personalizzati"
order: 6
section: "developer"
---

# Implementare HPO con Algoritmi Personalizzati

In questo capitolo, ci concentreremo sull'implementazione di HPO con algoritmi personalizzati, enfatizzando i dettagli piuttosto che il flusso di lavoro generale. Una breve introduzione al deployment di HPO è fornita nel [tutorial](#/tutorial/tutorial_part7), e una lettura preliminare è altamente raccomandata.

## Rendere gli Algoritmi Parallelizzabili

Poiché dobbiamo trasformare l'algoritmo interno nel problema, è fondamentale che l'algoritmo interno sia parallelizzabile. Pertanto, potrebbero essere necessarie alcune modifiche all'algoritmo.

1. L'algoritmo non deve avere metodi con operazioni in-place sugli attributi dell'algoritmo stesso.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. La logica del codice non deve basarsi sul flusso di controllo di Python.

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


## Utilizzare l'HPOMonitor

Nel task HPO, dovremmo usare l'`HPOMonitor` per tracciare le metriche di ogni algoritmo interno. L'`HPOMonitor` aggiunge solo un metodo, `tell_fitness`, rispetto al `monitor` standard. Questa aggiunta è progettata per offrire una maggiore flessibilità nella valutazione delle metriche, poiché i task HPO spesso coinvolgono metriche multidimensionali e complesse.

Gli utenti devono solo creare una sottoclasse di `HPOMonitor` e sovrascrivere il metodo `tell_fitness` per definire metriche di valutazione personalizzate.

Forniamo anche un semplice `HPOFitnessMonitor`, che supporta il calcolo delle metriche 'IGD' e 'HV' per problemi multi-obiettivo, e il valore minimo per problemi a singolo obiettivo.

## Un esempio semplice

Qui mostreremo un semplice esempio di come utilizzare HPO con EvoX. Useremo l'algoritmo `PSO` per cercare gli iperparametri ottimali di un algoritmo di base per risolvere il problema della sfera (sphere problem).

Per prima cosa, importiamo i moduli necessari.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Successivamente, definiamo un semplice problema della sfera. Notare che questo non differisce dai comuni `problems`.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Successivamente, definiamo l'algoritmo, utilizziamo la funzione `torch.cond` e ci assicuriamo che sia parallelizzabile. Nello specifico, modifichiamo le operazioni in-place e adattiamo il flusso di controllo Python.

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

Per gestire il flusso di controllo Python, utilizziamo [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html), successivamente, possiamo usare `StdWorkflow` per avvolgere `problem`, `algorithm` e `monitor`. Quindi utilizziamo `HPOProblemWrapper` per trasformare lo `StdWorkflow` in un problema HPO.

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

Possiamo testare se `HPOProblemWrapper` riconosce correttamente gli iperparametri che abbiamo definito. Poiché non abbiamo apportato modifiche agli iperparametri per le 7 istanze, dovrebbero essere identici in tutte le istanze.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Possiamo anche specificare il nostro set di valori degli iperparametri. Notare che il numero di set di iperparametri deve corrispondere al numero di istanze in `HPOProblemWrapper`. Gli iperparametri personalizzati devono essere forniti come un dizionario i cui valori sono avvolti in `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Ora, utilizziamo l'algoritmo `PSO` per ottimizzare gli iperparametri di `ExampleAlgorithm`. Notare che la dimensione della popolazione del `PSO` deve corrispondere al numero di istanze; altrimenti, potrebbero verificarsi errori imprevisti. In questo caso, dobbiamo trasformare la soluzione nel workflow esterno, poiché `HPOProblemWrapper` richiede un dizionario come input.

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