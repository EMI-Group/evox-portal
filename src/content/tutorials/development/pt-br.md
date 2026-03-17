---
title: "5. Desenvolvimento e Extensão"
order: 5
---

# 5. Desenvolvimento e Extensão

O EvoX não oferece apenas funcionalidades prontas para uso, mas também fornece aos desenvolvedores e usuários avançados um rico conjunto de interfaces para desenvolvimento personalizado e integração estendida. Este capítulo detalha como implementar algoritmos e problemas personalizados, como utilizar as APIs do EvoX para um controle mais profundo e como integrar o EvoX com outras ferramentas para construir aplicações mais complexas.

## 5.1 Desenvolvendo Módulos Personalizados

Às vezes, o problema que você está resolvendo ou o algoritmo que deseja usar não está incluído na biblioteca padrão do EvoX. Nesses casos, você pode desenvolver módulos personalizados usando as interfaces que o EvoX fornece.

### 5.1.1 Problemas Personalizados (MyProblem)

Se a sua função objetivo não estiver disponível em `evox.problems`, você pode definir a sua própria herdando da classe base `evox.core.Problem` (ou conformando-se à interface exigida). Uma classe de problema típica precisa implementar uma função `evaluate`, que recebe um lote (batch) de soluções (`pop`) e retorna os valores de fitness/objetivo correspondentes. Para aproveitar a computação paralela, o EvoX exige que o `evaluate` suporte **entrada em lote (batch input)**.

```python
import torch
from abc import ABC
from typing import Any, Dict
from evox.core.module import ModuleBase

class Problem(ModuleBase, ABC):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor) -> torch.Tensor:
        return torch.empty(0)
```

Por exemplo, para minimizar a soma dos cubos do vetor de decisão:

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

Você pode implementar uma classe `MyProblem` como esta:

```python
import torch
from evox.core import Problem

class MyProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        fitness = torch.sum(pop**3, dim=1)
        return fitness
```

Aqui, `pop` é um tensor de formato `(population_size, dim)`. A função `evaluate` retorna um tensor 1D de valores de fitness. Para problemas multi-objetivo, você pode retornar um dicionário com chaves separadas para cada objetivo.

Você pode usar seu problema personalizado como se fosse um nativo:

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 Algoritmos Personalizados (MyAlgorithm)

Criar um algoritmo personalizado é mais complexo, pois inclui inicialização, geração de novas soluções e seleção. Para criar um novo algoritmo, herde de `evox.core.Algorithm` e implemente pelo menos:

- `__init__`: Para inicialização.
- `step`: A lógica principal do passo evolutivo.

Abaixo está um exemplo de implementação do algoritmo Particle Swarm Optimization (PSO) no EvoX:

```python
import torch
from evox.core import Algorithm, Mutable, Parameter
from evox.utils import clamp
from evox.algorithms.so.pso_variants.utils import min_by

class PSO(Algorithm):
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
        device = torch.get_default_device() if device is None else device
        assert lb.shape == ub.shape and lb.ndim == 1

        self.pop_size = pop_size
        self.dim = lb.shape[0]

        lb = lb[None, :].to(device)
        ub = ub[None, :].to(device)
        length = ub - lb

        pop = length * torch.rand(self.pop_size, self.dim, device=device) + lb
        velocity = 2 * length * torch.rand(self.pop_size, self.dim, device=device) - length

        self.lb = lb
        self.ub = ub

        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)

        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop.clone())
        self.local_best_fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.global_best_location = Mutable(pop[0])
        self.global_best_fit = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        compare = self.local_best_fit > self.fit
        self.local_best_location = torch.where(compare[:, None], self.pop, self.local_best_location)
        self.local_best_fit = torch.where(compare, self.fit, self.local_best_fit)
        self.global_best_location, self.global_best_fit = min_by(
            [self.global_best_location.unsqueeze(0), self.pop],
            [self.global_best_fit.unsqueeze(0), self.fit],
        )
        rg = torch.rand(self.pop_size, self.dim, device=self.fit.device)
        rp = torch.rand(self.pop_size, self.dim, device=self.fit.device)

        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.pop)
            + self.phi_g * rg * (self.global_best_location - self.pop)
        )
        pop = self.pop + velocity
        self.pop = clamp(pop, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)
        self.fit = self.evaluate(self.pop)

    def init_step(self):
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

Para integrar o algoritmo em um workflow:

```python
import torch
from MyProblems import MyProblem
from evox.workflows import EvalMonitor, StdWorkflow
from evox.algorithms import PSO

problem = MyProblem()
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0])
)
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)
for i in range(10):
    workflow.step()
```

### 5.1.3 Outros Módulos Personalizados

Você também pode personalizar o `Monitor`, `Operator` ou qualquer módulo no EvoX. Por exemplo, implemente um `MyMonitor` para registrar a diversidade da população ou crie um `MyOperator` para estratégias personalizadas de crossover/mutação. Consulte as classes base existentes e os exemplos para entender quais métodos substituir.

## 5.2 Usando a API

O EvoX organiza suas APIs em módulos, facilitando a extensão e a combinação de componentes.

### 5.2.1 Algoritmos e Problemas

- **Algoritmos**: Encontrados em `evox.algorithms.so` (objetivo único) e `evox.algorithms.mo` (multi-objetivo).

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **Problemas**: Encontrados em `evox.problems`, incluindo:
  - `numerical` – funções de teste clássicas (ex: Ackley, Sphere).
  - `neuroevolution` – ambientes de RL como Brax.
  - `hpo_wrapper` – envolve o treinamento de ML em problemas de HPO.

Exemplo: Envolvendo um MLP do PyTorch com um ambiente Brax:

```python
import torch.nn as nn
from evox.problems.neuroevolution.brax import BraxProblem

class SimpleMLP(nn.Module):
    ...

policy = SimpleMLP().to(device)
problem = BraxProblem(
    policy=policy,
    env_name="swimmer",
    ...
)
```

Exemplo: Envolvendo um processo de otimização para HPO:

```python
from evox.problems.hpo_wrapper import HPOProblemWrapper
...
hpo_problem = HPOProblemWrapper(
    iterations=30,
    num_instances=128,
    workflow=inner_workflow,
    copy_init_state=True
)
```

### 5.2.2 Workflows e Ferramentas

- **Workflows**: `evox.workflows.StdWorkflow` para loops básicos de otimização.
- **Monitors**: `EvalMonitor` para rastrear o desempenho.

Exemplo:

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **Métricas**: `evox.metrics` fornece IGD, Hypervolume, etc.

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **Interoperabilidade com PyTorch**: Integração perfeita com `torch.nn`, `torch.Tensor`, etc.

## 5.3 Integração com Outras Ferramentas

O EvoX foi projetado para se integrar facilmente com ferramentas externas.

### 5.3.1 Integração com Machine Learning

Use o EvoX para ajustar hiperparâmetros:

1. Envolva o treinamento/validação como um `Problem`.
2. Use um algoritmo como o CMA-ES.
3. Otimize os hiperparâmetros ao longo de várias execuções.
4. Treine o modelo final com os melhores parâmetros.

### 5.3.2 Integração com Reinforcement Learning

Use o EvoX para evoluir políticas de redes neurais:

1. Envolva o ambiente de RL usando `BraxProblem`.
2. Achate a rede de política usando `ParamsAndVector`.
3. Otimize usando algoritmos evolutivos como GA ou CMA-ES.
4. Implante as políticas otimizadas diretamente ou faça o ajuste fino (fine-tune) com RL.

O EvoX suporta simulação de ambiente em lote (batch) para utilizar totalmente o poder da GPU/CPU.

---

**Em resumo**, o EvoX fornece APIs poderosas e modulares e um design amigável ao desenvolvedor para implementar algoritmos personalizados, envolver qualquer problema de otimização e integrar-se com ferramentas de ML e RL. À medida que você aprofunda seu entendimento, pode aplicar essas interfaces de forma criativa para construir soluções de otimização sob medida.