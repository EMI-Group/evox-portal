---
title: "Implementar HPO com Algoritmos Personalizados"
order: 6
section: "developer"
---

# Implementar HPO com Algoritmos Personalizados

Neste capítulo, focar-nos-emos na implementação de HPO com algoritmos personalizados, enfatizando os detalhes em vez do fluxo de trabalho geral. Uma breve introdução à implementação de HPO é fornecida no [tutorial](#/tutorial/tutorial_part7), e a leitura prévia é altamente recomendada.

## Tornar Algoritmos Paralelizáveis

Uma vez que precisamos de transformar o algoritmo interno no problema, é crucial que o algoritmo interno seja paralelizável. Portanto, algumas modificações ao algoritmo podem ser necessárias.

1. O algoritmo não deve ter métodos com operações in-place nos atributos do próprio algoritmo.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. A lógica do código não depende do fluxo de controlo Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = rand(10,10) #attribute of the algorithm itself
        pass

    def plus(self, y):
        return self.pop + y

    def minus(self, y):
        return self.pop - y

    def step_with_python_control_flow(self, y): # function with python control flow
        x = rand()
        if x > 0.5:
            self.pop = self.plus(y)
        else:
            self.pop = self.minus(y)

    def step_without_python_control_flow(self, y): # function without python control flow
        x = rand()
        cond = x > 0.5
        self.pop = torch.cond(cond, self.plus, self.minus, y)
```


## Utilizar o HPOMonitor

Na tarefa de HPO, devemos utilizar o `HPOMonitor` para acompanhar as métricas de cada algoritmo interno. O `HPOMonitor` adiciona apenas um método, `tell_fitness`, em comparação com o `monitor` padrão. Esta adição é concebida para oferecer maior flexibilidade na avaliação de métricas, uma vez que as tarefas de HPO frequentemente envolvem métricas multidimensionais e complexas.

Os utilizadores apenas precisam de criar uma subclasse de `HPOMonitor` e substituir o método `tell_fitness` para definir métricas de avaliação personalizadas.

Também fornecemos um `HPOFitnessMonitor` simples, que suporta o cálculo das métricas 'IGD' e 'HV' para problemas multi-objetivo, e o valor mínimo para problemas de objetivo único.

## Um exemplo simples

Aqui, demonstraremos um exemplo simples de como utilizar HPO com o EvoX. Utilizaremos o algoritmo `PSO` para procurar os hiperparâmetros ótimos de um algoritmo básico para resolver o problema sphere.

Primeiro, vamos importar os módulos necessários.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

A seguir, definimos um problema sphere simples. Note que isto não tem diferença dos `problems` comuns.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

A seguir, definimos o algoritmo, utilizamos a função `torch.cond` e certificamo-nos de que é paralelizável. Especificamente, modificamos operações in-place e ajustamos o fluxo de controlo Python.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self, pop_size: int, lb: torch.Tensor, ub: torch.Tensor):
        super().__init__()
        assert lb.ndim == 1 and ub.ndim == 1, f"Lower and upper bounds shall have ndim of 1, got {lb.ndim} and {ub.ndim}"
        assert lb.shape == ub.shape, f"Lower and upper bounds shall have same shape, got {lb.ndim} and {ub.ndim}"
        self.pop_size = pop_size
        self.hp = Parameter([1.0, 2.0, 3.0, 4.0])  # the hyperparameters to be optimized
        self.lb = lb
        self.ub = ub
        self.dim = lb.shape[0]
        self.pop = Mutable(torch.empty(self.pop_size, lb.shape[0], dtype=lb.dtype, device=lb.device))
        self.fit = Mutable(torch.empty(self.pop_size, dtype=lb.dtype, device=lb.device))

    def strategy_1(self, pop):  # one update strategy
        pop = pop * (self.hp[0] + self.hp[1])
        self.pop = pop

    def strategy_2(self, pop):  #  the other update strategy
        pop = pop * (self.hp[2] + self.hp[3])
        self.pop = pop

    def step(self):
        pop = torch.rand(self.pop_size, self.dim, dtype=self.lb.dtype, device=self.lb.device)  # simply random sampling
        pop = pop * (self.ub - self.lb)[None, :] + self.lb[None, :]
        control_number = torch.rand()
        self.pop = torch.cond(control_number < 0.5, self.strategy_1, self.strategy_2, (pop,))
        self.fit = self.evaluate(self.pop)

```

Para lidar com o fluxo de controlo Python, utilizamos [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html), a seguir, podemos utilizar o `StdWorkflow` para envolver o `problem`, `algorithm` e `monitor`. Depois utilizamos o `HPOProblemWrapper` para transformar o `StdWorkflow` em problema HPO.

```python
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = ExampleAlgorithm(10, -10 * torch.ones(8), 10 * torch.ones(8))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_monitor.setup()
inner_workflow = StdWorkflow()
inner_workflow.setup(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=9, num_instances=7, workflow=inner_workflow, copy_init_state=True)
```

Podemos testar se o `HPOProblemWrapper` reconhece corretamente os hiperparâmetros que definimos. Uma vez que não fizemos modificações aos hiperparâmetros para as 7 instâncias, devem ser idênticos em todas as instâncias.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Também podemos especificar o nosso próprio conjunto de valores de hiperparâmetros. Note que o número de conjuntos de hiperparâmetros deve corresponder ao número de instâncias no `HPOProblemWrapper`. Os hiperparâmetros personalizados devem ser fornecidos como um dicionário cujos valores são envolvidos no `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Agora, utilizamos o algoritmo `PSO` para otimizar os hiperparâmetros do `ExampleAlgorithm`. Note que o tamanho da população do `PSO` deve corresponder ao número de instâncias; caso contrário, podem ocorrer erros inesperados. Neste caso, precisamos de transformar a solução no workflow externo, uma vez que o `HPOProblemWrapper` requer um dicionário como entrada.

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
