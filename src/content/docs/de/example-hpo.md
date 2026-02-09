---
title: "Effiziente HPO mit EvoX"
order: 13
section: "examples"
---

# Effiziente HPO mit EvoX

In diesem Kapitel werden wir untersuchen, wie man EvoX für die Hyperparameter-Optimierung (HPO) verwendet.

HPO spielt bei vielen Aufgaben des maschinellen Lernens eine entscheidende Rolle, wird jedoch oft aufgrund der hohen Rechenkosten übersehen, die manchmal Tage in Anspruch nehmen können, sowie aufgrund der Herausforderungen bei der Bereitstellung.

Mit EvoX können wir die HPO-Bereitstellung mithilfe des `HPOProblemWrapper` vereinfachen und durch die Nutzung der `vmap`-Methode und GPU-Beschleunigung eine effiziente Berechnung erreichen.

## Transformation von Workflows in Problems

![HPO structure](/_static/HPO_structure.png)

Der Schlüssel zur Bereitstellung von HPO mit EvoX liegt darin, die `workflows` mithilfe des `HPOProblemWrapper` in `problems` umzuwandeln. Nach der Transformation können wir die `workflows` als Standard-`problems` behandeln. Die Eingabe für das 'HPO-Problem' besteht aus den Hyperparametern, und die Ausgabe sind die Bewertungsmetriken.

## Die Schlüsselkomponente -- `HPOProblemWrapper`

Um sicherzustellen, dass der `HPOProblemWrapper` die Hyperparameter erkennt, müssen wir sie mit `Parameter` verpacken. Mit diesem einfachen Schritt werden die Hyperparameter automatisch identifiziert.

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

## Nutzung des `HPOFitnessMonitor`

Wir stellen einen `HPOFitnessMonitor` zur Verfügung, der die Berechnung von 'IGD'- und 'HV'-Metriken für Probleme mit mehreren Zielen sowie den Minimalwert für Probleme mit einem Ziel unterstützt.

Es ist wichtig zu beachten, dass der `HPOFitnessMonitor` ein grundlegender Monitor ist, der für HPO-Probleme entwickelt wurde. Sie können auch flexibel Ihren eigenen benutzerdefinierten Monitor erstellen, indem Sie den Ansatz verwenden, der in [HPO mit benutzerdefinierten Algorithmen bereitstellen](#/guide/developer/custom_hpo_prob) beschrieben ist.

## Ein einfaches Beispiel

Hier zeigen wir ein einfaches Beispiel für die Verwendung von EvoX für HPO. Konkret werden wir den [PSO](#PSO)-Algorithmus verwenden, um die Hyperparameter des [PSO](#PSO)-Algorithmus zur Lösung des Sphere-Problems zu optimieren.

Bitte beachten Sie, dass dieses Kapitel nur einen kurzen Überblick über die HPO-Bereitstellung bietet. Für eine detailliertere Anleitung lesen Sie bitte [HPO mit benutzerdefinierten Algorithmen bereitstellen](#/guide/developer/custom_hpo_prob).

Lassen Sie uns zunächst die erforderlichen Module importieren.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Als Nächstes definieren wir ein einfaches Sphere-Problem.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Als Nächstes können wir den `StdWorkflow` verwenden, um `problem`, `algorithm` und `monitor` zu verpacken. Dann verwenden wir den `HPOProblemWrapper`, um den `StdWorkflow` in ein HPO-Problem zu transformieren.

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

Der `HPOProblemWrapper` akzeptiert 4 Argumente:
1. `iterations`: Die Anzahl der Iterationen, die im Optimierungsprozess ausgeführt werden sollen.
2. `num_instances`: Die Anzahl der Instanzen, die im Optimierungsprozess parallel ausgeführt werden sollen.
3. `workflow`: Der Workflow, der im Optimierungsprozess verwendet werden soll.
4. `copy_init_state`: Ob der Anfangszustand des Workflows für jede Auswertung kopiert werden soll. Standardmäßig `True`. Wenn Ihr Workflow Operationen enthält, die Tensor(en) im Anfangszustand IN-PLACE modifizieren, sollte dies auf `True` gesetzt werden. Andernfalls können Sie es auf `False` setzen, um Speicher zu sparen.

Wir können überprüfen, ob der `HPOProblemWrapper` die von uns definierten Hyperparameter korrekt erkennt. Da über die 5 Instanzen hinweg keine Änderungen an den Hyperparametern vorgenommen werden, sollten sie für alle Instanzen identisch bleiben.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Wir können auch einen benutzerdefinierten Satz von Hyperparameter-Werten definieren. Es ist wichtig sicherzustellen, dass die Anzahl der Hyperparameter-Sätze mit der Anzahl der Instanzen im `HPOProblemWrapper` übereinstimmt. Zusätzlich müssen benutzerdefinierte Hyperparameter als Dictionary bereitgestellt werden, dessen Werte mit `Parameter` verpackt sind.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Nun verwenden wir den [PSO](#PSO)-Algorithmus, um die Hyperparameter des [PSO](#PSO)-Algorithmus zu optimieren.

Es ist wichtig sicherzustellen, dass die Populationsgröße des [PSO](#PSO) mit der Anzahl der Instanzen übereinstimmt; andernfalls können unerwartete Fehler auftreten.

Zusätzlich muss die Lösung im äußeren Workflow transformiert werden, da der `HPOProblemWrapper` die Eingabe in Form eines Dictionaries erwartet.

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