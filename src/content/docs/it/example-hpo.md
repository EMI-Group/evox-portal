---
title: "HPO Efficiente con EvoX"
order: 13
section: "examples"
---

# HPO Efficiente con EvoX

In questo capitolo, esploreremo come usare EvoX per l'ottimizzazione degli iperparametri (HPO).

L'HPO gioca un ruolo cruciale in molte attività di machine learning ma è spesso trascurata a causa del suo alto costo computazionale, che a volte può richiedere giorni per l'elaborazione, nonché delle sfide coinvolte nel deployment.

Con EvoX, possiamo semplificare il deployment dell'HPO usando l'`HPOProblemWrapper` e ottenere un calcolo efficiente sfruttando il metodo `vmap` e l'accelerazione GPU.

## Trasformare il Workflow in Problema

![HPO structure](/_static/HPO_structure.png)

La chiave per il deployment dell'HPO con EvoX è trasformare i `workflows` in `problems` usando l'`HPOProblemWrapper`. Una volta trasformati, possiamo trattare i `workflows` come `problems` standard. L'input al 'problema HPO' consiste negli iperparametri, e l'output sono le metriche di valutazione.

## Il Componente Chiave -- `HPOProblemWrapper`

Per assicurare che l'`HPOProblemWrapper` riconosca gli iperparametri, dobbiamo incapsularli usando `Parameter`. Con questo semplice passaggio, gli iperparametri verranno identificati automaticamente.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## Utilizzo dell'`HPOFitnessMonitor`

Forniamo un `HPOFitnessMonitor` che supporta il calcolo delle metriche 'IGD' e 'HV' per problemi multi-obiettivo, nonché il valore minimo per problemi mono-obiettivo.

È importante notare che l'`HPOFitnessMonitor` è un monitor di base progettato per problemi HPO. Puoi anche creare il tuo monitor personalizzato in modo flessibile usando l'approccio descritto in [Deploy HPO con Algoritmi Personalizzati](#/guide/developer/custom_hpo_prob).

## Un semplice esempio

Qui dimostreremo un semplice esempio di utilizzo di EvoX per l'HPO. Nello specifico, useremo l'algoritmo [PSO](#PSO) per ottimizzare gli iperparametri dell'algoritmo [PSO](#PSO) per risolvere il problema sphere.

Si prega di notare che questo capitolo fornisce solo una breve panoramica del deployment HPO. Per una guida più dettagliata, consulta [Deploy HPO con Algoritmi Personalizzati](#/guide/developer/custom_hpo_prob).

Per iniziare, importiamo i moduli necessari.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Successivamente, definiamo un semplice problema Sphere.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Successivamente, possiamo usare `StdWorkflow` per incapsulare il `problem`, l'`algorithm` e il `monitor`. Poi usiamo l'`HPOProblemWrapper` per trasformare lo `StdWorkflow` in un problema HPO.

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

L'`HPOProblemWrapper` accetta 4 argomenti:
1. `iterations`: Il numero di iterazioni da eseguire nel processo di ottimizzazione.
2. `num_instances`: Il numero di istanze da eseguire in parallelo nel processo di ottimizzazione.
3. `workflow`: Il workflow da usare nel processo di ottimizzazione.
4. `copy_init_state`: Se copiare lo stato iniziale del workflow per ogni valutazione. Il valore predefinito è `True`. Se il tuo workflow contiene operazioni che modificano IN-PLACE i tensori nello stato iniziale, questo dovrebbe essere impostato su `True`. Altrimenti, puoi impostarlo su `False` per risparmiare memoria.

Possiamo verificare se l'`HPOProblemWrapper` riconosce correttamente gli iperparametri che definiamo. Poiché non vengono apportate modifiche agli iperparametri tra le 5 istanze, dovrebbero rimanere identici per tutte le istanze.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Possiamo anche definire un set personalizzato di valori degli iperparametri. È importante assicurarsi che il numero di set di iperparametri corrisponda al numero di istanze nell'`HPOProblemWrapper`. Inoltre, gli iperparametri personalizzati devono essere forniti come dizionario i cui valori sono incapsulati usando `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Ora, usiamo l'algoritmo [PSO](#PSO) per ottimizzare gli iperparametri dell'algoritmo [PSO](#PSO).

È importante assicurarsi che la dimensione della popolazione del [PSO](#PSO) corrisponda al numero di istanze; altrimenti, potrebbero verificarsi errori imprevisti.

Inoltre, la soluzione deve essere trasformata nel workflow esterno, poiché l'`HPOProblemWrapper` richiede che l'input sia sotto forma di dizionario.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```
