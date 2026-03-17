---
title: "Transizione da MATLAB a PyTorch ed EvoX"
order: 18
section: "misc"
---

# Transizione da MATLAB a PyTorch ed EvoX

Questo documento mira a guidare gli utenti MATLAB nella transizione a PyTorch ed EvoX per il calcolo evolutivo. Evidenzieremo le differenze principali tra MATLAB e PyTorch in termini di sintassi, strutture dati e flusso di lavoro. Illustreremo poi queste differenze usando un esempio di Ottimizzazione a Sciame di Particelle (PSO) sia in MATLAB che in PyTorch.

## Differenze di Sintassi

### Creazione e Indicizzazione degli Array

#### MATLAB

- Usa indicizzazione basata su 1.
- Vettori e matrici sono dichiarati usando parentesi quadre e punti e virgola (ad es. `[1 2 3; 4 5 6]`). L'inizializzazione casuale con `rand()` restituisce valori nell'intervallo $[0, 1)$.
- Lo slicing viene eseguito usando la sintassi `(start:end)` e utilizza l'indicizzazione basata su 1.

#### PyTorch

- Usa indicizzazione basata su 0.
- Gli array (tensori) sono tipicamente creati usando costruttori come `torch.rand()`, `torch.zeros()`, o liste Python convertite in tensori con `torch.tensor()`.
- Lo slicing viene fatto usando `[start:end]` con indici basati su 0.

### Calcolo Matriciale

#### MATLAB

- Esegue la moltiplicazione matriciale algebrica lineare con `*`.
- Usa `.*` per moltiplicare gli elementi corrispondenti di matrici della stessa dimensione.
- `/` rappresenta la divisione destra matriciale.
- `.^` rappresenta la potenza elemento per elemento.
- Le dimensioni iniziali e finali dei tensori con lunghezza 1 vengono **ignorate**.
- Trova automaticamente le dimensioni broadcastabili per le operazioni elemento per elemento ed esegue l'estensione dimensionale **implicita**.

#### PyTorch

- Esegue la moltiplicazione matriciale algebrica lineare con `@` o `torch.matmul()`.
- Usa direttamente `*` per moltiplicare gli elementi corrispondenti di tensori della stessa forma o forme broadcastabili.
- `/` rappresenta la divisione elemento per elemento.
- `**` rappresenta la potenza elemento per elemento.
- Le dimensioni dei tensori con lunghezza 1 vengono **preservate** e trattate come **dimensioni broadcast**.
- **Previene** la maggior parte delle estensioni dimensionali implicite, le dimensioni broadcast sono solitamente richieste.

### Funzioni e Definizioni

#### MATLAB

- Una funzione è definita dalla parola chiave `function`.
- Un file può contenere più funzioni, ma tipicamente la funzione principale condivide il nome del file.
- Le funzioni anonime (ad es. `@(x) sum(x.^2)`) sono usate per brevi calcoli inline.

#### PyTorch

- Le funzioni sono definite usando la parola chiave def, tipicamente all'interno di un singolo file `.py` o modulo.
- Le classi sono usate per incapsulare dati e metodi in modo orientato agli oggetti.
- Le lambda servono come brevi funzioni anonime (`lambda x: x.sum()`), ma le lambda multi-riga non sono consentite.

### Flusso di Controllo

#### MATLAB

- Usa cicli for `i = 1:N` ... `end` con indicizzazione basata su 1.
- Istruzioni condizionali come `if`, `elseif` e `else`.

#### PyTorch

- Usa `for i in range(N):` con indicizzazione basata su 0.
- L'indentazione è significativa per lo scoping nei cicli e nei condizionali (nessuna parola chiave `end`).

### Stampa e Commenti

#### MATLAB

- Usa le funzioni `fprintf()` per l'output formattato.
- Usa `%` per i commenti su singola riga.

#### PyTorch

- Usa `print` con f-string per l'output formattato.
- Usa `#` per i commenti su singola riga.

### Codifica Multi-riga

#### MATLAB

- Usa `...` alla fine di una riga per indicare che la riga successiva deve essere trattata come la stessa riga.
#### Python

- Usa `\` alla fine di una riga per indicare che la riga successiva deve essere trattata come la stessa riga.
- Se più righe sono all'interno di parentesi, non è richiesto alcun simbolo finale specifico.

## Come Scrivere un Algoritmo di Calcolo Evolutivo tramite EvoX?

### MATLAB

Un esempio di codice MATLAB per l'algoritmo PSO è il seguente:
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
In MATLAB, la funzione `init_pso()` inizializza l'algoritmo, e una funzione separata `step_pso()` esegue un passo di iterazione e la funzione principale `example_pso()` orchestra il ciclo.

### EvoX
In EvoX, puoi costruire l'algoritmo PSO nel seguente modo:

Per prima cosa, si consiglia di importare i moduli e le funzioni necessarie da EvoX e PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Poi, puoi trasformare il codice MATLAB nel codice Python corrispondente secondo la sezione "Differenze di Sintassi".
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

> **Nota:**
> Vale la pena notare che usiamo `[]` con `;` e `,` in MATLAB per concatenare matrici e vettori lungo una dimensione specifica; tuttavia, in EvoX, `torch.cat` deve essere invocato con l'argomento `dim` per indicare la dimensione di concatenazione.
> Inoltre, in PyTorch, i tensori da concatenare devono avere lo stesso numero di dimensioni; pertanto, viene applicato un ulteriore `XXX.unsqueeze(0)` per aggiungere una nuova dimensione di lunghezza 1 prima della prima dimensione.

In EvoX, la logica PSO è incapsulata all'interno di una classe che eredita da `Algorithm`. Questo design orientato agli oggetti semplifica la gestione dello stato e l'iterazione, e introduce i seguenti vantaggi:
- Metodo `evaluate()` ereditato
    Puoi semplicemente chiamare `self.evaluate(self.population)` per calcolare i valori di fitness, piuttosto che passare manualmente la tua funzione obiettivo ad ogni iterazione.
- Integrazione con il Workflow Integrata
    Quando registri la tua classe PSO con un workflow `StdWorkflow`, questo gestisce le chiamate iterative a `step()` per tuo conto.

Estendendo `Algorithm`, `__init__()` configura tutti i componenti principali del PSO (popolazione, velocità, migliore locale/globale, ecc.) in un costruttore di classe Python standard.
