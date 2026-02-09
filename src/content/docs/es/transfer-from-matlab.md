---
title: "Transformación de MATLAB a PyTorch y EvoX"
order: 18
section: "misc"
---

# Transformación de MATLAB a PyTorch y EvoX

Este documento tiene como objetivo guiar a los usuarios de MATLAB en la transición a PyTorch y EvoX para la computación evolutiva. Destacaremos las diferencias principales entre MATLAB y PyTorch en términos de sintaxis, estructuras de datos y flujo de trabajo. A continuación, ilustraremos estas diferencias utilizando un ejemplo de Optimización por Enjambre de Partículas (PSO) tanto en MATLAB como en PyTorch.

## Diferencias de sintaxis

### Creación e indexación de arrays

#### MATLAB

- Utiliza indexación basada en 1.
- Los vectores y matrices se declaran utilizando corchetes y puntos y coma (por ejemplo, `[1 2 3; 4 5 6]`). La inicialización aleatoria con `rand()` devuelve valores en el intervalo $[0, 1)$.
- El troceado (slicing) se realiza mediante la sintaxis `(start:end)` y utiliza indexación basada en 1.

#### PyTorch

- Utiliza indexación basada en 0.
- Los arrays (tensores) se crean normalmente utilizando constructores como `torch.rand()`, `torch.zeros()` o listas de Python convertidas en tensores con `torch.tensor()`.
- El troceado se realiza mediante `[start:end]` con índices basados en 0.

### Computación matricial

#### MATLAB

- Realiza la multiplicación de matrices de álgebra lineal mediante `*`.
- Utiliza `.*` para multiplicar los elementos correspondientes de matrices del mismo tamaño.
- `/` representa la división matricial a la derecha.
- `.^` representa la potencia elemento a elemento.
- Las dimensiones iniciales y finales de los tensores con longitud 1 son **ignoradas**.
- Busca automáticamente dimensiones compatibles para el broadcasting en operaciones elemento a elemento y realiza una extensión de dimensiones **implícita**.

#### PyTorch

- Realiza la multiplicación de matrices de álgebra lineal mediante `@` o `torch.matmul()`.
- Utiliza directamente `*` para multiplicar los elementos correspondientes de tensores con la misma forma o formas compatibles para broadcasting.
- `/` representa la división elemento a elemento.
- `**` representa la potencia elemento a elemento.
- Las dimensiones de los tensores con longitud 1 se **preservan** y se tratan como **dimensiones de broadcasting**.
- **Evita** la mayoría de las extensiones de dimensiones implícitas; normalmente se requieren dimensiones de broadcasting explícitas.

### Funciones y definiciones

#### MATLAB

- Una función se define mediante la palabra clave `function`.
- Un archivo puede contener múltiples funciones, pero normalmente la función principal comparte el nombre del archivo.
- Las funciones anónimas (por ejemplo, `@(x) sum(x.^2)`) se utilizan para cálculos cortos en línea.

#### PyTorch

- Las funciones se definen utilizando la palabra clave `def`, normalmente dentro de un único archivo `.py` o módulo.
- Las clases se utilizan para encapsular datos y métodos de manera orientada a objetos.
- Las lambdas sirven como funciones anónimas cortas (`lambda x: x.sum()`), pero no se permiten lambdas de varias líneas.

### Flujo de control

#### MATLAB

- Utiliza bucles `for i = 1:N` ... `end` con indexación basada en 1.
- Sentencias condicionales como `if`, `elseif` y `else`.

#### PyTorch

- Utiliza `for i in range(N):` con indexación basada en 0.
- La sangría (indentación) es significativa para el alcance en bucles y condicionales (no hay palabra clave `end`).

### Impresión y comentarios

#### MATLAB

- Utiliza las funciones `fprintf()` para la salida formateada.
- Utiliza `%` para comentarios de una sola línea.

#### PyTorch

- Utiliza `print` con f-strings para la salida formateada.
- Utiliza `#` para comentarios de una sola línea.

### Código multilínea

#### MATLAB

- Utiliza `...` al final de una línea para indicar que la siguiente línea debe tratarse como parte de la misma.
#### Python

- Utiliza `\` al final de una línea para indicar que la siguiente línea debe tratarse como parte de la misma.
- Si hay varias líneas dentro de paréntesis, no se requiere ningún símbolo final específico.

## ¿Cómo escribir algoritmos de computación evolutiva a través de EvoX?

### MATLAB

Un ejemplo de código MATLAB para el algoritmo PSO es el siguiente:
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
En MATLAB, la función `init_pso()` inicializa el algoritmo, una función separada `step_pso()` realiza un paso de iteración y la función principal `example_pso()` orquesta el bucle.

### EvoX
En EvoX, puedes construir el algoritmo PSO de la siguiente manera:

En primer lugar, se recomienda importar los módulos y funciones necesarios de EvoX y PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

A continuación, puedes transformar el código MATLAB al código Python correspondiente de acuerdo con la sección "Diferencias de sintaxis".
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
> Cabe destacar que en MATLAB utilizamos `[]` con `;` y `,` para concatenar matrices y vectores a lo largo de una dimensión específica; sin embargo, en EvoX, `torch.cat` debe invocarse con el argumento `dim` para indicar la dimensión de concatenación.
> Además, en PyTorch, los tensores que se van a concatenar deben tener el mismo número de dimensiones; por lo tanto, se aplica un `XXX.unsqueeze(0)` adicional para añadir una nueva dimensión de longitud 1 antes de la primera dimensión.

En EvoX, la lógica de PSO se encapsula dentro de una clase que hereda de `Algorithm`. Este diseño orientado a objetos simplifica la gestión del estado y la iteración, e introduce las siguientes ventajas:
- Método `evaluate()` heredado
    Simplemente puedes llamar a `self.evaluate(self.population)` para calcular los valores de aptitud (fitness), en lugar de pasar manualmente tu función objetivo en cada iteración.
- Integración de flujo de trabajo (Workflow) integrada
    Cuando registras tu clase PSO con un flujo de trabajo `StdWorkflow`, este se encarga de las llamadas iterativas a `step()` por ti.

Al extender `Algorithm`, `__init__()` configura todos los componentes principales de PSO (población, velocidad, mejor local/global, etc.) en un constructor de clase estándar de Python.