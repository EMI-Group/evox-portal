---
title: "Transformation von MATLAB zu PyTorch und EvoX"
order: 18
section: "misc"
---

# Transformation von MATLAB zu PyTorch und EvoX

Dieses Dokument soll MATLAB-Benutzern den Übergang zu PyTorch und EvoX für evolutionäre Berechnungen erleichtern. Wir werden die wesentlichen Unterschiede zwischen MATLAB und PyTorch in Bezug auf Syntax, Datenstrukturen und Arbeitsabläufe hervorheben. Anschließend veranschaulichen wir diese Unterschiede anhand eines Beispiels zur Partikelschwarmoptimierung (PSO) sowohl in MATLAB als auch in PyTorch.

## Syntax-Unterschiede

### Array-Erstellung und Indizierung

#### MATLAB

- Verwendet 1-basierte Indizierung.
- Vektoren und Matrizen werden mit eckigen Klammern und Semikolons deklariert (z. B. `[1 2 3; 4 5 6]`). Die zufällige Initialisierung mit `rand()` liefert Werte im Intervall $[0, 1)$.
- Slicing erfolgt mit der Syntax `(start:end)` und verwendet 1-basierte Indizierung.

#### PyTorch

- Verwendet 0-basierte Indizierung.
- Arrays (Tensoren) werden typischerweise mit Konstruktoren wie `torch.rand()`, `torch.zeros()` oder durch Konvertierung von Python-Listen in Tensoren mit `torch.tensor()` erstellt.
- Slicing erfolgt mit `[start:end]` unter Verwendung von 0-basierten Indizes.

### Matrix-Berechnung

#### MATLAB

- Führt linear-algebraische Matrixmultiplikation mit `*` durch.
- Verwendet `.*`, um korrespondierende Elemente von Matrizen gleicher Größe zu multiplizieren.
- `/` steht für die Matrix-Rechtsdivision.
- `.^` steht für das elementweise Potenzieren.
- Führende und nachgestellte Dimension(en) von Tensoren mit der Länge 1 werden **ignoriert**.
- Findet automatisch broadcast-fähige Dimensionen für elementweise Operationen und führt eine **implizite** Dimensionserweiterung durch.

#### PyTorch

- Führt linear-algebraische Matrixmultiplikation mit `@` oder `torch.matmul()` durch.
- Verwendet direkt `*`, um korrespondierende Elemente von Tensoren gleicher Form oder broadcast-fähiger Formen zu multiplizieren.
- `/` steht für die elementweise Division.
- `**` steht für das elementweise Potenzieren.
- Dimension(en) von Tensoren mit der Länge 1 bleiben **erhalten** und werden als **Broadcast-Dimension** behandelt.
- **Verhindert** die meisten impliziten Dimensionserweiterungen; Broadcast-Dimension(en) sind normalerweise erforderlich.

### Funktionen und Definitionen

#### MATLAB

- Eine Funktion wird durch das Schlüsselwort `function` definiert.
- Eine Datei kann mehrere Funktionen enthalten, aber typischerweise teilt sich die Hauptfunktion den Dateinamen.
- Anonyme Funktionen (z. B. `@(x) sum(x.^2)`) werden für kurze Inline-Berechnungen verwendet.

#### PyTorch

- Funktionen werden mit dem Schlüsselwort `def` definiert, typischerweise innerhalb einer einzelnen `.py`-Datei oder eines Moduls.
- Klassen werden verwendet, um Daten und Methoden objektorientiert zu kapseln.
- Lambdas dienen als kurze anonyme Funktionen (`lambda x: x.sum()`), aber mehrzeilige Lambdas sind nicht erlaubt.

### Kontrollfluss

#### MATLAB

- Verwendet `for i = 1:N` ... `end`-Schleifen mit 1-basierter Indizierung.
- Bedingte Anweisungen wie `if`, `elseif` und `else`.

#### PyTorch

- Verwendet `for i in range(N):` mit 0-basierter Indizierung.
- Einrückung ist entscheidend für den Gültigkeitsbereich in Schleifen und Bedingungen (kein `end`-Schlüsselwort).

### Ausgabe und Kommentare

#### MATLAB

- Verwendet `fprintf()`-Funktionen für formatierte Ausgaben.
- Verwendet `%` für einzeilige Kommentare.

#### PyTorch

- Verwendet `print` mit f-Strings für formatierte Ausgaben.
- Verwendet `#` für einzeilige Kommentare.

### Mehrzeiliger Code

#### MATLAB

- Verwendet `...` am Ende einer Zeile, um anzuzeigen, dass die nächste Zeile als Fortsetzung derselben Zeile behandelt werden soll.
#### Python

- Verwendet `\` am Ende einer Zeile, um anzuzeigen, dass die nächste Zeile als Fortsetzung derselben Zeile behandelt werden soll.
- Wenn sich mehrere Zeilen innerhalb von Klammern befinden, ist kein spezielles Endsymbol erforderlich.

## Wie schreibt man einen evolutionären Berechnungsalgorithmus mit EvoX?

### MATLAB

Ein MATLAB-Codebeispiel für den PSO-Algorithmus sieht wie folgt aus:
```matlab
function [] = example_pso()
    pso = init_pso(100, [-10, -10], [10, 10], 0.6, 2.5, 0.8);
    test_fn = @(x) (sum(x .* x, 2));
    for i = 1:20
        pso = step_pso(pso, test_fn);
        fprintf("Iteration = %d, global best = %f\n", i, pso.global_best_fitness);
    end
end


function [self] = init_pso(pop_size, lb, ub, w, phi_p, phi_g)
    self = struct();
    self.pop_size = pop_size;
    self.dim = length(lb);
    self.w = w;
    self.phi_p = phi_p;
    self.phi_g = phi_g;
    % setup
    range = ub - lb;
    population = rand(self.pop_size, self.dim);
    population = range .* population + lb;
    velocity = rand(self.pop_size, self.dim);
    velocity = 2 .* range .* velocity - range;
    self.lb = lb;
    self.ub = ub;
    % mutable
    self.population = population;
    self.velocity = velocity;
    self.local_best_location = population;
    self.local_best_fitness = Inf(self.pop_size, 1);
    self.global_best_location = population(1, :);
    self.global_best_fitness = Inf;
end


function [self] = step_pso(self, evaluate)
    % Evaluate
    fitness = evaluate(self.population);
    % Update the local best
    compare = find(self.local_best_fitness > fitness);
    self.local_best_location(compare, :) = self.population(compare, :);
    self.local_best_fitness(compare) = fitness(compare);
    % Update the global best
    values = [self.global_best_location; self.population];
    keys = [self.global_best_fitness; fitness];
    [min_val, min_index] = min(keys);
    self.global_best_location = values(min_index, :);
    self.global_best_fitness = min_val;
    % Update velocity and position
    rg = rand(self.pop_size, self.dim);
    rp = rand(self.pop_size, self.dim);
    velocity = self.w .* self.velocity ...
        + self.phi_p .* rp .* (self.local_best_location - self.population) ...
        + self.phi_g .* rg .* (self.global_best_location - self.population);
    population = self.population + velocity;
    self.population = min(max(population, self.lb), self.ub);
    self.velocity = min(max(velocity, self.lb), self.ub);
end
```
In MATLAB initialisiert die Funktion `init_pso()` den Algorithmus, eine separate Funktion `step_pso()` führt einen Iterationsschritt aus, und die Hauptfunktion `example_pso()` steuert die Schleife.

### EvoX
In EvoX können Sie den PSO-Algorithmus auf folgende Weise konstruieren:

Zuerst wird empfohlen, die notwendigen Module und Funktionen von EvoX und PyTorch zu importieren.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Dann können Sie den MATLAB-Code entsprechend dem Abschnitt „Syntax-Unterschiede“ in Python-Code umwandeln.
```python
def main():
    pso = PSO(pop_size=10, lb=torch.tensor([-10.0, -10.0]), ub=torch.tensor([10.0, 10.0]))
    wf = StdWorkflow()
    wf.setup(algorithm=pso, problem=Sphere())
    for i in range(1, 21):
        wf.step()
        print(f"Iteration = {i}, global best = {wf.algorithm.global_best_fitness}")

@jit_class
class PSO(Algorithm):
    def __init__(self, pop_size, lb, ub, w=0.6, phi_p=2.5, phi_g=0.8):
        super().__init__()
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = w
        self.phi_p = phi_p
        self.phi_g = phi_g
        # setup
        lb = lb.unsqueeze(0)
        ub = ub.unsqueeze(0)
        range = ub - lb
        population = torch.rand(self.pop_size, self.dim)
        population = range * population + lb
        velocity = torch.rand(self.pop_size, self.dim)
        velocity = 2 * range * velocity - range
        self.lb = lb
        self.ub = ub
        # mutable
        self.population = population
        self.velocity = velocity
        self.local_best_location = population
        self.local_best_fitness = torch.full((self.pop_size,), fill_value=torch.inf)
        self.global_best_location = population[0, :]
        self.global_best_fitness = torch.tensor(torch.inf)

    def step(self):
        # Evaluate
        fitness = self.evaluate(self.population)
        # Update the local best
        compare = self.local_best_fitness > fitness
        self.local_best_location = torch.where(compare.unsqueeze(1), self.population, self.local_best_location)
        self.local_best_fitness = torch.where(compare, fitness, self.local_best_fitness)
        # Update the global best
        values = torch.cat([self.global_best_location.unsqueeze(0), self.population], dim=0)
        keys = torch.cat([self.global_best_fitness.unsqueeze(0), fitness], dim=0)
        min_index = torch.argmin(keys)
        self.global_best_location = values[min_index]
        self.global_best_fitness = keys[min_index]
        # Update velocity and position
        rg = torch.rand(self.pop_size, self.dim)
        rp = torch.rand(self.pop_size, self.dim)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)


# Run the main function
if __name__ == "__main__":
    main()
```

> **Hinweis:**
> Es ist erwähnenswert, dass wir in MATLAB `[]` mit `;` und `,` verwenden, um Matrizen und Vektoren entlang einer bestimmten Dimension zu verketten; in EvoX muss jedoch `torch.cat` mit dem Argument `dim` aufgerufen werden, um die Verkettungsdimension anzugeben.
> Außerdem müssen in PyTorch Tensoren, die verkettet werden sollen, die gleiche Anzahl von Dimensionen haben; daher wird zusätzlich `XXX.unsqueeze(0)` angewendet, um eine neue Dimension der Länge 1 vor der ersten Dimension hinzuzufügen.

In EvoX ist die PSO-Logik in einer Klasse gekapselt, die von `Algorithm` erbt. Dieses objektorientierte Design vereinfacht die Zustandsverwaltung und Iteration und bietet folgende Vorteile:
- Geerbte `evaluate()`-Methode
    Sie können einfach `self.evaluate(self.population)` aufrufen, um Fitnesswerte zu berechnen, anstatt Ihre Zielfunktion bei jeder Iteration manuell zu übergeben.
- Integrierte Workflow-Einbindung
    Wenn Sie Ihre PSO-Klasse bei einem Workflow `StdWorkflow` registrieren, übernimmt dieser die iterativen Aufrufe von `step()` für Sie.

Durch die Erweiterung von `Algorithm` richtet `__init__()` alle wichtigen PSO-Komponenten (Population, Geschwindigkeit, lokales/globales Optimum usw.) in einem Standard-Python-Klassenkonstruktor ein.