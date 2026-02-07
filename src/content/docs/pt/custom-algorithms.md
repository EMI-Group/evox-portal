---
title: "Algoritmos e problemas personalizados no EvoX"
order: 5
section: "developer"
---

# Algoritmos e problemas personalizados no EvoX

Neste capítulo, apresentaremos como implementar os seus próprios algoritmos e problemas no EvoX.

## Disposição dos algoritmos e problemas

Na maioria das bibliotecas tradicionais de CE, os algoritmos normalmente chamam a função objetivo internamente, o que resulta na seguinte disposição:

```
Algorithm
|
+--Problem
```

**Mas no EvoX, temos uma disposição plana:**

```
Algorithm.step -- Problem.evaluate
```

Esta disposição torna tanto os algoritmos como os problemas mais universais: um algoritmo pode otimizar diferentes problemas, enquanto um problema também pode ser adequado para muitos algoritmos.


## Classe Algorithm

A classe `Algorithm` é herdada de `ModuleBase`.

**No total, existem 5 métodos (2 métodos são opcionais) que precisamos de implementar:**

| Método       | Assinatura                               | Utilização                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | Inicializar a instância do algoritmo, por exemplo, o tamanho da população (mantém-se constante durante a iteração), hiperparâmetros (só podem ser definidos pelo wrapper de problema HPO ou inicializados aqui), e/ou tensores mutáveis (podem ser modificados durante a execução). |
| `step`               | `(self)`                        | Realizar um passo normal de iteração de otimização do algoritmo. |
| `init_step` (opcional) | `(self)` | Realizar o primeiro passo da otimização do algoritmo. Se este método não for substituído, o método `step` será invocado em seu lugar. |

> **Nota:**
> A inicialização estática ainda pode ser escrita no `__init__` enquanto a inicialização de submódulo(s) mutável(eis) não pode. Portanto, múltiplas chamadas de `setup` para inicializações repetidas são possíveis se o método `setup` substituído invocar primeiro o `setup()` de `ModuleBase`.
>
> Se tal método `setup` em `ModuleBase` não for adequado para o seu algoritmo, pode substituir o método `setup` quando criar a sua própria classe de algoritmo.


## Classe Problem

A classe `Problem` também é herdada de `ModuleBase`.

No entanto, a classe Problem é bastante simples. **Além do método `__init__`, o único método necessário é o método `evaluate`.**

| Método     | Assinatura                                   | Utilização                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | Inicializar as definições do problema.       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | Avaliar a aptidão da população dada. |

No entanto, o tipo do argumento `pop` em `evaluate` pode ser alterado para outros tipos compatíveis com JIT no método substituído.


## Exemplo

Aqui damos um exemplo de **implementação de um algoritmo PSO que resolve o problema Sphere**.

### Pseudocódigo do exemplo

Aqui está um pseudocódigo:

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### Exemplo de Algoritmo: algoritmo PSO

A Otimização por Enxame de Partículas (PSO) é um algoritmo meta-heurístico baseado em população inspirado no comportamento social de aves e peixes. É amplamente utilizado para resolver problemas de otimização contínuos e discretos.

**Aqui está um exemplo de implementação do algoritmo PSO no EvoX:**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
    def __init__(
        self,
        pop_size: int,
        lb: torch.Tensor,
        ub: torch.Tensor,
        w: float = 0.6,
        phi_p: float = 2.5,
        phi_g: float = 0.8,
        device: torch.device | None = None,
    ):
        super().__init__()
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        fitness = self.evaluate(self.population)
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### Exemplo de Problema: problema Sphere

O problema Sphere e um problema de otimizacao de referencia simples, mas fundamental, utilizado para testar algoritmos de otimizacao.

A funcao Sphere e definida como:

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**Aqui esta um exemplo de implementacao do problema Sphere no EvoX:**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

Agora, pode iniciar um workflow e executa-lo.
