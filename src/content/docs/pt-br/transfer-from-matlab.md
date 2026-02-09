---
title: "Transformação de MATLAB para PyTorch e EvoX"
order: 18
section: "misc"
---

# Transformação de MATLAB para PyTorch e EvoX

Este documento visa orientar os usuários de MATLAB na transição para PyTorch e EvoX para computação evolutiva. Destacaremos as principais diferenças entre MATLAB e PyTorch em termos de sintaxe, estruturas de dados e fluxo de trabalho. Em seguida, ilustraremos essas diferenças usando um exemplo de Otimização por Enxame de Partículas (PSO) tanto em MATLAB quanto em PyTorch.

## Diferenças de Sintaxe

### Criação e Indexação de Arrays

#### MATLAB

- Usa indexação baseada em 1.
- Vetores e matrizes são declarados usando colchetes e pontos e vírgulas (ex: `[1 2 3; 4 5 6]`). A inicialização aleatória com `rand()` retorna valores no intervalo $[0, 1)$.
- O fatiamento (slicing) é realizado usando a sintaxe `(start:end)` e utiliza indexação baseada em 1.

#### PyTorch

- Usa indexação baseada em 0.
- Arrays (tensores) são tipicamente criados usando construtores como `torch.rand()`, `torch.zeros()`, ou listas Python convertidas em tensores com `torch.tensor()`.
- O fatiamento é feito usando `[start:end]` com índices baseados em 0.

### Computação de Matrizes

#### MATLAB

- Realiza multiplicação de matrizes de álgebra linear por `*`.
- Usa `.*` para multiplicar elementos correspondentes de matrizes do mesmo tamanho.
- `/` representa a divisão de matriz à direita.
- `.^` representa a potência elemento a elemento.
- Dimensões finais e iniciais de tensores com comprimento 1 são **ignoradas**.
- Encontra automaticamente dimensões compatíveis para broadcasting em operações elemento a elemento e realiza extensão de dimensão **implícita**.

#### PyTorch

- Realiza multiplicação de matrizes de álgebra linear por `@` ou `torch.matmul()`.
- Usa diretamente `*` para multiplicar elementos correspondentes de tensores do mesmo formato ou formatos compatíveis para broadcasting.
- `/` representa a divisão elemento a elemento.
- `**` representa a potência elemento a elemento.
- Dimensões de tensores com comprimento 1 são **preservadas** e tratadas como **dimensão de broadcast**.
- **Evita** a maioria das extensões de dimensão implícitas; dimensões de broadcast geralmente são obrigatórias.

### Funções e Definições

#### MATLAB

- Uma função é definida pela palavra-chave `function`.
- Um arquivo pode conter múltiplas funções, mas tipicamente a função primária compartilha o nome do arquivo.
- Funções anônimas (ex: `@(x) sum(x.^2)`) são usadas para cálculos curtos em linha.

#### PyTorch

- Funções são definidas usando a palavra-chave `def`, tipicamente dentro de um único arquivo `.py` ou módulo.
- Classes são usadas para encapsular dados e métodos de maneira orientada a objetos.
- Lambdas servem como funções anônimas curtas (`lambda x: x.sum()`), mas lambdas de múltiplas linhas não são permitidas.

### Fluxo de Controle

#### MATLAB

- Usa loops `for i = 1:N` ... `end` com indexação baseada em 1.
- Declarações condicionais como `if`, `elseif` e `else`.

#### PyTorch

- Usa `for i in range(N):` com indexação baseada em 0.
- A indentação é significativa para o escopo em loops e condicionais (sem a palavra-chave `end`).

### Impressão e Comentários

#### MATLAB

- Usa funções `fprintf()` para saída formatada.
- Usa `%` para comentários de linha única.

#### PyTorch

- Usa `print` com f-strings para saída formatada.
- Usa `#` para comentários de linha única.

### Codificação em Múltiplas Linhas

#### MATLAB

- Usa `...` ao final de uma linha para indicar que a próxima linha deve ser tratada como a mesma linha.
#### Python

- Usa `\` ao final de uma linha para indicar que a próxima linha deve ser tratada como a mesma linha.
- Se múltiplas linhas estiverem dentro de parênteses, nenhum símbolo final específico é necessário.

## Como Escrever Algoritmos de Computação Evolutiva via EvoX?

### MATLAB

Um exemplo de código MATLAB para o algoritmo PSO é o seguinte:
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
No MATLAB, a função `init_pso()` inicializa o algoritmo, uma função separada `step_pso()` realiza um passo de iteração e a função principal `example_pso()` orquestra o loop.

### EvoX
No EvoX, você pode construir o algoritmo PSO da seguinte maneira:

Primeiro, recomenda-se importar os módulos e funções necessários do EvoX e PyTorch.
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

Em seguida, você pode transformar o código MATLAB para o código Python correspondente de acordo com a seção "Diferenças de Sintaxe".
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
> Vale notar que usamos `[]` com `;` e `,` no MATLAB para concatenar matrizes e vetores ao longo de uma dimensão específica; no entanto, no EvoX, o `torch.cat` deve ser invocado com o argumento `dim` para indicar a dimensão de concatenação.
> Além disso, no PyTorch, os tensores a serem concatenados devem ter o mesmo número de dimensões; portanto, um `XXX.unsqueeze(0)` adicional é aplicado para adicionar uma nova dimensão de comprimento 1 antes da primeira dimensão.

No EvoX, a lógica do PSO é encapsulada dentro de uma classe que herda de `Algorithm`. Este design orientado a objetos simplifica o gerenciamento de estado e a iteração, e introduz as seguintes vantagens:
- Método `evaluate()` herdado
    Você pode simplesmente chamar `self.evaluate(self.population)` para calcular os valores de fitness, em vez de passar manualmente sua função objetivo a cada iteração.
- Integração de Fluxo de Trabalho Integrada
    Quando você registra sua classe PSO com um fluxo de trabalho `StdWorkflow`, ele lida com as chamadas iterativas para `step()` em seu nome.

Ao estender `Algorithm`, o `__init__()` configura todos os principais componentes do PSO (população, velocidade, melhor local/global, etc.) em um construtor de classe Python padrão.