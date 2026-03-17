---
title: "HPO mit benutzerdefinierten Algorithmen einsetzen"
order: 6
section: "developer"
---

# HPO mit benutzerdefinierten Algorithmen einsetzen

In diesem Kapitel konzentrieren wir uns auf den Einsatz von HPO mit benutzerdefinierten Algorithmen, wobei der Schwerpunkt eher auf den Details als auf dem gesamten Workflow liegt. Eine kurze Einführung in den HPO-Einsatz finden Sie im [Tutorial](../../tutorials/practical-examples), und die vorherige Lektüre wird dringend empfohlen.

## Algorithmen parallelisierbar machen

Da wir den inneren Algorithmus in das Problem transformieren müssen, ist es entscheidend, dass der innere Algorithmus parallelisierbar ist. Daher können einige Modifikationen am Algorithmus erforderlich sein.

1. Der Algorithmus sollte keine Methoden mit In-Place-Operationen auf den Attributen des Algorithmus selbst haben.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. Die Code-Logik verlässt sich nicht auf den Python-Kontrollfluss.

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


## Verwendung des HPOMonitor

Bei der HPO-Task sollten wir den `HPOMonitor` verwenden, um die Metriken jedes inneren Algorithmus zu verfolgen. Der `HPOMonitor` fügt im Vergleich zum Standard-`monitor` nur eine Methode hinzu: `tell_fitness`. Diese Ergänzung soll eine größere Flexibilität bei der Auswertung von Metriken bieten, da HPO-Tasks oft mehrdimensionale und komplexe Metriken beinhalten.

Benutzer müssen lediglich eine Unterklasse von `HPOMonitor` erstellen und die Methode `tell_fitness` überschreiben, um benutzerdefinierte Bewertungsmetriken zu definieren.

Wir stellen auch einen einfachen `HPOFitnessMonitor` zur Verfügung, der die Berechnung der Metriken 'IGD' und 'HV' für Probleme mit mehreren Zielen sowie den Minimalwert für Probleme mit einem einzigen Ziel unterstützt.

## Ein einfaches Beispiel

Hier zeigen wir ein einfaches Beispiel, wie man HPO mit EvoX verwendet. Wir werden den `PSO`-Algorithmus verwenden, um nach den optimalen Hyperparametern eines Basisalgorithmus zur Lösung des Sphere-Problems zu suchen.

Zuerst importieren wir die notwendigen Module.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Als Nächstes definieren wir ein einfaches Sphere-Problem. Beachten Sie, dass es keinen Unterschied zu den üblichen `problems` gibt.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Als Nächstes definieren wir den Algorithmus, verwenden die Funktion `torch.cond` und stellen sicher, dass er parallelisierbar ist. Konkret modifizieren wir In-Place-Operationen und passen den Python-Kontrollfluss an.

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

Um den Python-Kontrollfluss zu handhaben, verwenden wir [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html). Als Nächstes können wir den `StdWorkflow` verwenden, um `problem`, `algorithm` und `monitor` zu verpacken. Dann verwenden wir den `HPOProblemWrapper`, um den `StdWorkflow` in ein HPO-Problem zu transformieren.

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

Wir können testen, ob der `HPOProblemWrapper` die von uns definierten Hyperparameter korrekt erkennt. Da wir keine Änderungen an den Hyperparametern für die 7 Instanzen vorgenommen haben, sollten sie über alle Instanzen hinweg identisch sein.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Wir können auch unseren eigenen Satz von Hyperparameter-Werten angeben. Beachten Sie, dass die Anzahl der Hyperparameter-Sätze mit der Anzahl der Instanzen im `HPOProblemWrapper` übereinstimmen muss. Die benutzerdefinierten Hyperparameter sollten als Dictionary bereitgestellt werden, dessen Werte in `Parameter` verpackt sind.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Nun verwenden wir den `PSO`-Algorithmus, um die Hyperparameter von `ExampleAlgorithm` zu optimieren. Beachten Sie, dass die Populationsgröße des `PSO` mit der Anzahl der Instanzen übereinstimmen muss; andernfalls können unerwartete Fehler auftreten. In diesem Fall müssen wir die Lösung im äußeren Workflow transformieren, da der `HPOProblemWrapper` ein Dictionary als Eingabe benötigt.

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