---
title: "HPO Eficiente com EvoX"
order: 13
section: "examples"
---

# HPO Eficiente com EvoX

Neste capítulo, vamos explorar como utilizar o EvoX para a otimização de hiperparâmetros (HPO).

A HPO desempenha um papel crucial em muitas tarefas de machine learning, mas é frequentemente negligenciada devido ao seu elevado custo computacional, que por vezes pode levar dias a processar, bem como aos desafios envolvidos na implementação.

Com o EvoX, podemos simplificar a implementação de HPO utilizando o `HPOProblemWrapper` e alcançar uma computação eficiente ao tirar partido do método `vmap` e da aceleração por GPU.

## Transformar o Workflow num Problema

![Estrutura de HPO](/_static/HPO_structure.png)

A chave para implementar HPO com o EvoX é transformar os `workflows` em `problems` utilizando o `HPOProblemWrapper`. Uma vez transformados, podemos tratar os `workflows` como `problems` padrão. A entrada para o 'problema de HPO' consiste nos hiperparâmetros, e a saída são as métricas de avaliação.

## O Componente Chave -- `HPOProblemWrapper`

Para garantir que o `HPOProblemWrapper` reconhece os hiperparâmetros, precisamos de os envolver utilizando `Parameter`. Com este passo simples, os hiperparâmetros serão identificados automaticamente.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...): 
        self.omega = Parameter([1.0, 2.0]) # wrap the hyper-parameters with `Parameter`
        self.beta = Parameter(0.1)
        pass

    def step(self):
        # run algorithm step depending on the value of self.omega and self.beta
        pass
```

## Utilizar o `HPOFitnessMonitor`

Disponibilizamos um `HPOFitnessMonitor` que suporta o cálculo das métricas 'IGD' e 'HV' para problemas multi-objetivo, bem como o valor mínimo para problemas de objetivo único.

É importante notar que o `HPOFitnessMonitor` é um monitor básico concebido para problemas de HPO. Também pode criar o seu próprio monitor personalizado de forma flexível utilizando a abordagem descrita em [Implementar HPO com Algoritmos Personalizados](#/guide/developer/custom_hpo_prob).

## Um exemplo simples

Aqui, demonstraremos um exemplo simples de utilização do EvoX para HPO. Especificamente, utilizaremos o algoritmo [PSO](#PSO) para otimizar os hiperparâmetros do algoritmo [PSO](#PSO) para resolver o problema da esfera.

Tenha em atenção que este capítulo fornece apenas uma breve visão geral da implementação de HPO. Para um guia mais detalhado, consulte [Implementar HPO com Algoritmos Personalizados](#/guide/developer/custom_hpo_prob).

Para começar, vamos importar os módulos necessários.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

De seguida, definimos um problema Sphere simples.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Em seguida, podemos utilizar o `StdWorkflow` para envolver o `problem`, o `algorithm` e o `monitor`. Depois, utilizamos o `HPOProblemWrapper` para transformar o `StdWorkflow` num problema de HPO.

```python
# the inner loop is a PSO algorithm with a population size of 50
torch.set_default_device("cuda" if torch.cuda.is_available() else "cpu")
inner_algo = PSO(50, -10 * torch.ones(10), 10 * torch.ones(10))
inner_prob = Sphere()
inner_monitor = HPOFitnessMonitor()
inner_workflow = StdWorkflow(inner_algo, inner_prob, monitor=inner_monitor)
# Transform the inner workflow to an HPO problem
hpo_prob = HPOProblemWrapper(iterations=30, num_instances=128, workflow=inner_workflow, copy_init_state=True)
```

O `HPOProblemWrapper` aceita 4 argumentos:
1. `iterations`: O número de iterações a serem executadas no processo de otimização.
2. `num_instances`: O número de instâncias a serem executadas em paralelo no processo de otimização.
3. `workflow`: O workflow a ser utilizado no processo de otimização.
4. `copy_init_state`: Se deve copiar o estado inicial do workflow para cada avaliação. O valor predefinido é `True`. Se o seu workflow contiver operações que modifiquem IN-PLACE o(s) tensor(es) no estado inicial, isto deve ser definido como `True`. Caso contrário, pode defini-lo como `False` para poupar memória.

Podemos verificar se o `HPOProblemWrapper` reconhece corretamente os hiperparâmetros que definimos. Uma vez que não são feitas modificações nos hiperparâmetros nas 5 instâncias, eles devem permanecer idênticos para todas as instâncias.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

Também podemos definir um conjunto personalizado de valores de hiperparâmetros. É importante garantir que o número de conjuntos de hiperparâmetros corresponde ao número de instâncias no `HPOProblemWrapper`. Além disso, os hiperparâmetros personalizados devem ser fornecidos como um dicionário cujos valores são envolvidos utilizando o `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Agora, utilizamos o algoritmo [PSO](#PSO) para otimizar os hiperparâmetros do algoritmo [PSO](#PSO).

É importante garantir que o tamanho da população do [PSO](#PSO) corresponde ao número de instâncias; caso contrário, podem ocorrer erros inesperados.

Além disso, a solução precisa de ser transformada no workflow externo, uma vez que o `HPOProblemWrapper` exige que a entrada esteja na forma de um dicionário.

```python
class solution_transform(torch.nn.Module):
    def forward(self, x: torch.Tensor):
        return {
            "algorithm.w": x[:, 0],
            "algorithm.phi_p": x[:, 1],
            "algorithm.phi_g": x[:, 2],
        }


outer_algo = PSO(128, 0 * torch.ones(3), 3 * torch.ones(3))  # search each hyperparameter in the range [0, 3]
monitor = EvalMonitor(full_sol_history=False)
outer_workflow = StdWorkflow(outer_algo, hpo_prob, monitor=monitor, solution_transform=solution_transform())
outer_workflow.init_step()
compiled_step = torch.compile(outer_workflow.step)
for _ in range(100):
    compiled_step()
monitor = outer_workflow.get_submodule("monitor")
print("params:\n", monitor.topk_solutions, "\n")
print("result:\n", monitor.topk_fitness)
```

```python
monitor.plot()
```