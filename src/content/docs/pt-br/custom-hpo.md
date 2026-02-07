---
title: "Implantar HPO com Algoritmos Personalizados"
order: 6
section: "developer"
---

# Implantar HPO com Algoritmos Personalizados

Neste capítulo, focaremos na implantação de HPO com algoritmos personalizados, enfatizando os detalhes em vez do fluxo de trabalho geral. Uma breve introdução à implantação de HPO é fornecida no [tutorial](#/tutorial/tutorial_part7), e a leitura prévia é altamente recomendada.

## Tornando Algoritmos Paralelizáveis

Como precisamos transformar o algoritmo interno no problema, é crucial que o algoritmo interno seja paralelizável. Portanto, algumas modificações no algoritmo podem ser necessárias.

1. O algoritmo não deve ter métodos com operações in-place nos atributos do próprio algoritmo.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #atributo do próprio algoritmo

    def step_in_place(self): # método com operações in-place
        self.pop.copy_(pop)

    def step_out_of_place(self): # método sem operações in-place
        self.pop = pop
```

2. A lógica do código não depende do fluxo de controle do Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #atributo do próprio algoritmo
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # função com fluxo de controle Python
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # função sem fluxo de controle Python
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```


## Utilizando o HPOMonitor

Na tarefa de HPO, devemos usar o `HPOMonitor` para rastrear as métricas de cada algoritmo interno. O `HPOMonitor` adiciona apenas um método, `tell_fitness`, comparado ao `monitor` padrão. Esta adição é projetada para oferecer maior flexibilidade na avaliação de métricas, pois tarefas de HPO frequentemente envolvem métricas multidimensionais e complexas.

Os usuários precisam apenas criar uma subclasse de `HPOMonitor` e sobrescrever o método `tell_fitness` para definir métricas de avaliação personalizadas.

Também fornecemos um `HPOFitnessMonitor` simples, que suporta o cálculo das métricas 'IGD' e 'HV' para problemas multiobjetivo, e o valor mínimo para problemas de objetivo único.

## Um exemplo simples

Aqui, demonstraremos um exemplo simples de como usar HPO com o EvoX. Usaremos o algoritmo `PSO` para buscar os hiperparâmetros ótimos de um algoritmo básico para resolver o problema sphere.

Primeiro, vamos importar os módulos necessários.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Em seguida, definimos um problema sphere simples. Note que isso não tem diferença dos `problems` comuns.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Em seguida, definimos o algoritmo, usamos a função `torch.cond` e garantimos que ele seja paralelizável. Especificamente, modificamos operações in-place e ajustamos o fluxo de controle do Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # os hiperparâmetros a serem otimizados
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # uma estratégia de atualização
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  # a outra estratégia de atualização
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simplesmente amostragem aleatória
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

Para lidar com o fluxo de controle do Python, usamos [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html). Em seguida, podemos usar o `StdWorkflow` para encapsular o `problem`, `algorithm` e `monitor`. Então usamos o `HPOProblemWrapper` para transformar o `StdWorkflow` em problema HPO.

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transformar o workflow interno em um problema HPO
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

Podemos testar se o `HPOProblemWrapper` reconhece corretamente os hiperparâmetros que definimos. Como não fizemos modificações nos hiperparâmetros para as 7 instâncias, eles devem ser idênticos em todas as instâncias.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Também podemos especificar nosso próprio conjunto de valores de hiperparâmetros. Note que o número de conjuntos de hiperparâmetros deve corresponder ao número de instâncias no `HPOProblemWrapper`. Os hiperparâmetros personalizados devem ser fornecidos como um dicionário cujos valores são encapsulados no `Parameter`.

```python
params = hpo_prob.get_init_params()
# como temos 7 instâncias, precisamos passar 7 conjuntos de hiperparâmetros
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Agora, usamos o algoritmo `PSO` para otimizar os hiperparâmetros do `ExampleAlgorithm`. Note que o tamanho da população do `PSO` deve corresponder ao número de instâncias; caso contrário, erros inesperados podem ocorrer. Neste caso, precisamos transformar a solução no workflow externo, pois o `HPOProblemWrapper` requer um dicionário como entrada.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {"self.algorithm.hp": x}


outer_algo = PSO(7, -3 * torch.ones(4), 3 * torch.ones(4))
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow()
outer_workflow.setup(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
for _ in range(20):
    outer_workflow.step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```
