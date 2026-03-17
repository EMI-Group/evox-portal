---
title: "Numerische Optimierung"
order: 9
section: "examples"
---

# Numerische Optimierung

Dieses Notebook bietet eine Schritt-für-Schritt-Anleitung zur Verwendung von EvoX zur Optimierung der Ackley-Funktion durch den Particle Swarm Optimization (PSO) Algorithmus. Sowohl der PSO-Algorithmus als auch das Ackley-Optimierungsproblem sind als integrierte Komponenten im EvoX-Framework enthalten.

Zuerst sollten wir alle notwendigen Module importieren, einschließlich `PSO` (Algorithmus), `Ackley` (Problem) sowie `StdWorkflow` & `EvalMonitor` (Workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Hier instanziieren wir den `PSO`-Algorithmus. Wir legen die folgenden Einstellungen fest:

- `pop_size`: Die Größe des Partikelschwarms (Population).
- `lb` und `ub`: Die unteren und oberen Grenzen für jede Dimension im Suchraum.
- Alle anderen Parameter sind Standardwerte. Bitte beziehen Sie sich auf die detaillierte API.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Als Nächstes wählen wir die `Ackley`-Funktion aus den numerischen Problemen von EvoX.

```python
# Define the problem
problem = Ackley()
```

Wir erstellen eine `EvalMonitor`-Instanz, um notwendige Informationen während des Optimierungsvorgangs zu verfolgen.

```python
# Define the monitor
monitor = EvalMonitor()
```

Die Klasse `StdWorkflow` bietet einen standardisierten Prozess zur Integration von Algorithmus, Problem und Monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Der Aufruf von `setup()` initialisiert die Komponenten, sodass der Workflow bereit ist, Optimierungsschritte durchzuführen.

Wir führen die Optimierung für eine bestimmte Anzahl von Iterationen durch (100 in diesem Beispiel). In jeder Iteration aktualisiert die Methode `step()` den PSO-Algorithmus, bewertet neue Kandidatenlösungen anhand der Ackley-Funktion und verfolgt deren Fitness über den Monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Schließlich rufen wir das `monitor`-Submodul aus dem Workflow ab, um auf die bisher gefundenen besten Lösungen (`topk_solutions`) und ihre entsprechenden Zielwerte (`topk_fitness`) zuzugreifen. Anschließend geben wir das beste Ergebnis und die zugehörige Lösung aus.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```