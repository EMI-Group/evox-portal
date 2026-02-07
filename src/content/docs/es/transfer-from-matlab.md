---
title: "Transformacion de MATLAB a PyTorch y EvoX"
order: 18
section: "misc"
---

# Transformacion de MATLAB a PyTorch y EvoX

Este documento tiene como objetivo guiar a los usuarios de MATLAB en la transicion a PyTorch y EvoX para computacion evolutiva. Destacaremos las diferencias principales entre MATLAB y PyTorch en terminos de sintaxis, estructuras de datos y flujo de trabajo. Luego ilustraremos estas diferencias usando un ejemplo de Optimizacion por Enjambre de Particulas (PSO) tanto en MATLAB como en PyTorch.

## Diferencias de Sintaxis

### Creacion e Indexacion de Arrays

#### MATLAB

- Usa indexacion basada en 1.
- Los vectores y matrices se declaran usando corchetes y punto y coma (por ejemplo, `[1 2 3; 4 5 6]`). La inicializacion aleatoria con `rand()` devuelve valores en el intervalo $[0, 1)$.
- El rebanado se realiza usando la sintaxis `(start:end)` y utiliza indexacion basada en 1.

#### PyTorch

- Usa indexacion basada en 0.
- Los arrays (tensores) se crean tipicamente usando constructores como `torch.rand()`, `torch.zeros()`, o listas de Python convertidas a tensores con `torch.tensor()`.
- El rebanado se hace usando `[start:end]` con indices basados en 0.

### Computacion Matricial

#### MATLAB

- Realiza multiplicacion matricial de algebra lineal con `*`.
- Usa `.*` para multiplicar elementos correspondientes de matrices del mismo tamano.
- `/` representa la division matricial derecha.
- `.^` representa la potencia elemento a elemento.
- Las dimensiones iniciales y finales de tensores con longitud 1 se **ignoran**.
- Encuentra automaticamente dimensiones difundibles para operaciones elemento a elemento y realiza extension de dimension **implicita**.

#### PyTorch

- Realiza multiplicacion matricial de algebra lineal con `@` o `torch.matmul()`.
- Usa directamente `*` para multiplicar elementos correspondientes de tensores de la misma forma o formas difundibles.
- `/` representa la division elemento a elemento.
- `**` representa la potencia elemento a elemento.
- Las dimensiones de tensores con longitud 1 se **preservan** y se tratan como **dimensiones de difusion**.
- **Previene** la mayoria de las extensiones de dimension implicitas, generalmente se requieren dimensiones de difusion.

### Funciones y Definiciones

#### MATLAB

- Una funcion se define con la palabra clave `function`.
- Un archivo puede contener multiples funciones, pero tipicamente la funcion principal comparte el nombre del archivo.
- Las funciones anonimas (por ejemplo, `@(x) sum(x.^2)`) se usan para calculos cortos en linea.

#### PyTorch

- Las funciones se definen usando la palabra clave def, tipicamente dentro de un solo archivo `.py` o modulo.
- Las clases se usan para encapsular datos y metodos de manera orientada a objetos.
- Las lambdas sirven como funciones anonimas cortas (`lambda x: x.sum()`), pero las lambdas multilinea no estan permitidas.

### Flujo de Control

#### MATLAB

- Usa bucles `for i = 1:N` ... `end` con indexacion basada en 1.
- Sentencias condicionales como `if`, `elseif` y `else`.

#### PyTorch

- Usa `for i in range(N):` con indexacion basada en 0.
- La indentacion es significativa para el alcance en bucles y condicionales (sin palabra clave `end`).

### Impresion y Comentarios

#### MATLAB

- Usa funciones `fprintf()` para salida formateada.
- Usa `%` para comentarios de una linea.

#### PyTorch

- Usa `print` con f-strings para salida formateada.
- Usa `#` para comentarios de una linea.

### Codificacion Multilinea

#### MATLAB

- Usa `...` al final de una linea para indicar que la siguiente linea debe tratarse como la misma linea.
#### Python

- Usa `\` al final de una linea para indicar que la siguiente linea debe tratarse como la misma linea.
- Si multiples lineas estan dentro de parentesis, no se requiere ningun simbolo especial al final.

## Como Escribir un Algoritmo de Computacion Evolutiva con EvoX?

### MATLAB

Un ejemplo de codigo MATLAB para el algoritmo PSO es el siguiente:
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
En MATLAB, la funcion `init_pso()` inicializa el algoritmo, y una funcion separada `step_pso()` realiza un paso de iteracion y la funcion principal `example_pso()` orquesta el bucle.

### EvoX
En EvoX, puede construir el algoritmo PSO de la siguiente manera:

Primero, se recomienda importar los modulos y funciones necesarios de EvoX y PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Luego, puede transformar el codigo MATLAB al codigo Python correspondiente segun la seccion "Diferencias de Sintaxis".
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
> Vale la pena notar que usamos `[]` con `;` y `,` en MATLAB para concatenar matrices y vectores a lo largo de una dimension especifica; sin embargo, en EvoX, se debe invocar `torch.cat` con el argumento `dim` para indicar la dimension de concatenacion.
> Ademas, en PyTorch, los tensores a concatenar deben tener el mismo numero de dimensiones; por lo tanto, se aplica `XXX.unsqueeze(0)` adicional para agregar una nueva dimension de longitud 1 antes de la primera dimension.

En EvoX, la logica de PSO esta encapsulada dentro de una clase que hereda de `Algorithm`. Este diseno orientado a objetos simplifica la gestion del estado y la iteracion, e introduce las siguientes ventajas:
- Metodo `evaluate()` heredado
    Puede simplemente llamar a `self.evaluate(self.population)` para calcular valores de aptitud, en lugar de pasar manualmente su funcion objetivo en cada iteracion.
- Integracion con Flujo de Trabajo Incorporado
    Cuando registra su clase PSO con un flujo de trabajo `StdWorkflow`, este maneja las llamadas iterativas a `step()` en su nombre.

Al extender `Algorithm`, `__init__()` configura todos los componentes principales de PSO (poblacion, velocidad, mejor local/global, etc.) en un constructor de clase Python estandar.
