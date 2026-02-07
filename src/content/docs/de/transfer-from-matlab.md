---
title: "Transformation von MATLAB zu PyTorch und EvoX"
order: 18
section: "misc"
---

# Transformation von MATLAB zu PyTorch und EvoX

Dieses Dokument soll MATLAB-Benutzer beim Übergang zu PyTorch und EvoX für evolutionäre Berechnungen anleiten. Wir werden die Kernunterschiede zwischen MATLAB und PyTorch in Bezug auf Syntax, Datenstrukturen und Workflow hervorheben. Anschließend veranschaulichen wir diese Unterschiede anhand eines Partikelschwarmoptimierungs-Beispiels (PSO) in sowohl MATLAB als auch PyTorch.

## Syntaxunterschiede

### Array-Erstellung und Indizierung

#### MATLAB

- Verwendet 1-basierte Indizierung.
- Vektoren und Matrizen werden mit eckigen Klammern und Semikolons deklariert (z.B. `[1 2 3; 4 5 6]`). Zufällige Initialisierung mit `rand()` gibt Werte im Intervall $[0, 1)$ zurück.
- Slicing wird mit der `(start:end)`-Syntax durchgeführt und verwendet 1-basierte Indizierung.

#### PyTorch

- Verwendet 0-basierte Indizierung.
- Arrays (Tensoren) werden typischerweise mit Konstruktoren wie `torch.rand()`, `torch.zeros()` oder Python-Listen erstellt, die mit `torch.tensor()` in Tensoren konvertiert werden.
- Slicing wird mit `[start:end]` und 0-basierten Indizes durchgeführt.

### Matrixberechnung

#### MATLAB

- Führt lineare algebraische Matrixmultiplikation mit `*` durch.
- Verwendet `.*` zur Multiplikation entsprechender Elemente von Matrizen gleicher Größe.
- `/` repräsentiert die Matrix-Rechtsdivision.
- `.^` repräsentiert die elementweise Potenz.
- Nachfolgende und führende Dimension(en) von Tensoren mit Länge 1 werden **ignoriert**.
- Findet automatisch broadcastbare Dimensionen für elementweise Operationen und führt **implizite** Dimensionserweiterung durch.

#### PyTorch

- Führt lineare algebraische Matrixmultiplikation mit `@` oder `torch.matmul()` durch.
- Verwendet direkt `*` zur Multiplikation entsprechender Elemente von Tensoren gleicher Form oder broadcastbarer Formen.
- `/` repräsentiert die elementweise Division.
- `**` repräsentiert die elementweise Potenz.
- Dimension(en) von Tensoren mit Länge 1 werden **beibehalten** und als **Broadcast-Dimension** behandelt.
- **Verhindert** die meisten impliziten Dimensionserweiterungen, Broadcast-Dimension(en) sind normalerweise erforderlich.

### Funktionen und Definitionen

#### MATLAB

- Eine Funktion wird mit dem Schlüsselwort `function` definiert.
- Eine Datei kann mehrere Funktionen enthalten, aber typischerweise teilt die Hauptfunktion den Dateinamen.
- Anonyme Funktionen (z.B. `@(x) sum(x.^2)`) werden für kurze Inline-Berechnungen verwendet.

#### PyTorch

- Funktionen werden mit dem Schlüsselwort def definiert, typischerweise innerhalb einer einzelnen `.py`-Datei oder eines Moduls.
- Klassen werden verwendet, um Daten und Methoden objektorientiert zu kapseln.
- Lambdas dienen als kurze anonyme Funktionen (`lambda x: x.sum()`), aber mehrzeilige Lambdas sind nicht erlaubt.

### Kontrollfluss

#### MATLAB

- Verwendet for `i = 1:N` ... `end`-Schleifen mit 1-basierter Indizierung.
- Bedingte Anweisungen wie `if`, `elseif` und `else`.

#### PyTorch

- Verwendet `for i in range(N):` mit 0-basierter Indizierung.
- Einrückung ist für die Gültigkeitsbereiche in Schleifen und Bedingungen signifikant (kein `end`-Schlüsselwort).

### Ausgabe und Kommentare

#### MATLAB

- Verwendet `fprintf()`-Funktionen für formatierte Ausgabe.
- Verwendet `%` für einzeilige Kommentare.

#### PyTorch

- Verwendet `print` mit f-Strings für formatierte Ausgabe.
- Verwendet `#` für einzeilige Kommentare.

### Mehrzeiliger Code

#### MATLAB

- Verwendet `...` am Ende einer Zeile, um anzuzeigen, dass die nächste Zeile als dieselbe Zeile behandelt werden soll.
#### Python

- Verwendet `\` am Ende einer Zeile, um anzuzeigen, dass die nächste Zeile als dieselbe Zeile behandelt werden soll.
- Wenn mehrere Zeilen innerhalb von Klammern stehen, ist kein spezielles Endsymbol erforderlich.

## Wie schreibt man einen evolutionären Berechnungsalgorithmus mit EvoX?

### MATLAB

Ein MATLAB-Codebeispiel für den PSO-Algorithmus ist wie folgt:
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
In MATLAB initialisiert die Funktion `init_pso()` den Algorithmus, und eine separate Funktion `step_pso()` führt einen Iterationsschritt durch, und die Hauptfunktion `example_pso()` orchestriert die Schleife.

### EvoX
In EvoX können Sie den PSO-Algorithmus auf folgende Weise konstruieren:

Zunächst wird empfohlen, die notwendigen Module und Funktionen aus EvoX und PyTorch zu importieren.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Dann können Sie den MATLAB-Code entsprechend dem Abschnitt "Syntaxunterschiede" in Python-Code transformieren.
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
> Darüber hinaus müssen in PyTorch zu verkettende Tensoren die gleiche Anzahl von Dimensionen haben; daher wird zusätzlich `XXX.unsqueeze(0)` angewendet, um eine neue Dimension der Länge 1 vor der ersten Dimension hinzuzufügen.

In EvoX ist die PSO-Logik in einer Klasse gekapselt, die von `Algorithm` erbt. Dieses objektorientierte Design vereinfacht die Zustandsverwaltung und Iteration und führt folgende Vorteile ein:
- Geerbte `evaluate()`-Methode
    Sie können einfach `self.evaluate(self.population)` aufrufen, um Fitnesswerte zu berechnen, anstatt Ihre Zielfunktion bei jeder Iteration manuell zu übergeben.
- Eingebaute Workflow-Integration
    Wenn Sie Ihre PSO-Klasse bei einem Workflow `StdWorkflow` registrieren, übernimmt dieser die iterativen Aufrufe von `step()` für Sie.

Durch die Erweiterung von `Algorithm` richtet `__init__()` alle wichtigen PSO-Komponenten (Population, Geschwindigkeit, lokales/globales Bestes usw.) in einem Standard-Python-Klassenkonstruktor ein.
