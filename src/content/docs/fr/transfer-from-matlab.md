---
title: "Transformation de MATLAB vers PyTorch et EvoX"
order: 18
section: "misc"
---

# Transformation de MATLAB vers PyTorch et EvoX

Ce document vise à guider les utilisateurs de MATLAB dans leur transition vers PyTorch et EvoX pour le calcul évolutionnaire. Nous mettrons en évidence les différences fondamentales entre MATLAB et PyTorch en termes de syntaxe, de structures de données et de flux de travail. Nous illustrerons ensuite ces différences à l'aide d'un exemple d'optimisation par essaim particulaire (PSO) en MATLAB et en PyTorch.

## Différences de syntaxe

### Création de tableaux et indexation

#### MATLAB

- Utilise une indexation basée sur 1.
- Les vecteurs et les matrices sont déclarés à l'aide de crochets et de points-virgules (par exemple, `[1 2 3; 4 5 6]`). L'initialisation aléatoire avec `rand()` renvoie des valeurs dans l'intervalle $[0, 1)$.
- Le découpage (slicing) est effectué à l'aide de la syntaxe `(start:end)` et utilise une indexation basée sur 1.

#### PyTorch

- Utilise une indexation basée sur 0.
- Les tableaux (tenseurs) sont généralement créés à l'aide de constructeurs tels que `torch.rand()`, `torch.zeros()`, ou à partir de listes Python converties en tenseurs avec `torch.tensor()`.
- Le découpage se fait en utilisant `[start:end]` avec des indices basés sur 0.

### Calcul matriciel

#### MATLAB

- Effectue la multiplication matricielle d'algèbre linéaire avec `*`.
- Utilise `.*` pour multiplier les éléments correspondants de matrices de même taille.
- `/` représente la division matricielle à droite.
- `.^` représente la puissance élément par élément.
- Les dimensions de tête et de queue des tenseurs de longueur 1 sont **ignorées**.
- Trouve automatiquement les dimensions diffusables (broadcastable) pour les opérations élément par élément et effectue une extension de dimension **implicite**.

#### PyTorch

- Effectue la multiplication matricielle d'algèbre linéaire avec `@` ou `torch.matmul()`.
- Utilise directement `*` pour multiplier les éléments correspondants de tenseurs de même forme ou de formes diffusables.
- `/` représente la division élément par élément.
- `**` représente la puissance élément par élément.
- Les dimensions des tenseurs de longueur 1 sont **préservées** et traitées comme des **dimensions de diffusion** (broadcast dimensions).
- **Empêche** la plupart des extensions de dimension implicites ; les dimensions de diffusion sont généralement requises.

### Fonctions et définitions

#### MATLAB

- Une fonction est définie par le mot-clé `function`.
- Un fichier peut contenir plusieurs fonctions, mais généralement la fonction principale porte le même nom que le fichier.
- Les fonctions anonymes (par exemple, `@(x) sum(x.^2)`) sont utilisées pour de courts calculs en ligne.

#### PyTorch

- Les fonctions sont définies à l'aide du mot-clé `def`, généralement au sein d'un seul fichier `.py` ou module.
- Les classes sont utilisées pour encapsuler les données et les méthodes de manière orientée objet.
- Les lambdas servent de courtes fonctions anonymes (`lambda x: x.sum()`), mais les lambdas sur plusieurs lignes ne sont pas autorisées.

### Flux de contrôle

#### MATLAB

- Utilise des boucles `for i = 1:N` ... `end` avec une indexation basée sur 1.
- Instructions conditionnelles comme `if`, `elseif` et `else`.

#### PyTorch

- Utilise `for i in range(N):` avec une indexation basée sur 0.
- L'indentation est significative pour la portée dans les boucles et les conditions (pas de mot-clé `end`).

### Affichage et commentaires

#### MATLAB

- Utilise la fonction `fprintf()` pour la sortie formatée.
- Utilise `%` pour les commentaires sur une seule ligne.

#### PyTorch

- Utilise `print` avec des f-strings pour la sortie formatée.
- Utilise `#` pour les commentaires sur une seule ligne.

### Codage sur plusieurs lignes

#### MATLAB

- Utilise `...` à la fin d'une ligne pour indiquer que la ligne suivante doit être traitée comme faisant partie de la même ligne.
#### Python

- Utilise `\` à la fin d'une ligne pour indiquer que la ligne suivante doit être traitée comme faisant partie de la même ligne.
- Si plusieurs lignes sont à l'intérieur de parenthèses, aucun symbole de fin spécifique n'est requis.

## Comment écrire un algorithme de calcul évolutionnaire via EvoX ?

### MATLAB

Un exemple de code MATLAB pour l'algorithme PSO est le suivant :
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
En MATLAB, la fonction `init_pso()` initialise l'algorithme, une fonction séparée `step_pso()` effectue une étape d'itération et la fonction principale `example_pso()` orchestre la boucle.

### EvoX
Dans EvoX, vous pouvez construire l'algorithme PSO de la manière suivante :

Tout d'abord, il est recommandé d'importer les modules et fonctions nécessaires depuis EvoX et PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Ensuite, vous pouvez transformer le code MATLAB en code Python de manière correspondante selon la section « Différences de syntaxe ».
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

> **Remarque :**
> Il est important de noter que nous utilisons `[]` avec `;` et `,` dans MATLAB pour concaténer des matrices et des vecteurs le long d'une dimension spécifique ; cependant, dans EvoX, `torch.cat` doit être invoqué avec l'argument `dim` pour indiquer la dimension de concaténation.
> De plus, dans PyTorch, les tenseurs à concaténer doivent avoir le même nombre de dimensions ; par conséquent, un `XXX.unsqueeze(0)` supplémentaire est appliqué pour ajouter une nouvelle dimension de longueur 1 avant la première dimension.

Dans EvoX, la logique PSO est encapsulée dans une classe qui hérite de `Algorithm`. Cette conception orientée objet simplifie la gestion de l'état et l'itération, et présente les avantages suivants :
- Méthode `evaluate()` héritée
    Vous pouvez simplement appeler `self.evaluate(self.population)` pour calculer les valeurs de fitness, plutôt que de passer manuellement votre fonction objectif à chaque itération.
- Intégration de flux de travail (Workflow) intégrée
    Lorsque vous enregistrez votre classe PSO avec un flux de travail `StdWorkflow`, celui-ci gère les appels itératifs à `step()` pour vous.

En étendant `Algorithm`, `__init__()` configure tous les composants majeurs du PSO (population, vitesse, meilleur local/global, etc.) dans un constructeur de classe Python standard.