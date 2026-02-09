---
title: "Resolvendo Problemas Brax no EvoX"
order: 11
section: "examples"
---

# Resolvendo Problemas Brax no EvoX

O EvoX mergulha profundamente na neuroevolução com o Brax.
Aqui mostraremos um exemplo de como resolver um problema Brax no EvoX.

```python
# install EvoX and Brax, skip it if you have already installed EvoX or Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# The dependent packages or functions in this example
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## O que é o Brax

O Brax é um motor de física rápido e totalmente diferenciável usado para pesquisa e desenvolvimento de robótica, percepção humana, ciência de materiais, aprendizado por reforço e outras aplicações com uso intensivo de simulação. 

Aqui demonstraremos um ambiente "swimmer" do Brax. 

Para mais informações, você pode navegar pelo [Github do Brax](https://github.com/google/brax).

## Projetando uma classe de rede neural

Para começar, precisamos decidir qual rede neural iremos construir.

Aqui forneceremos uma classe simples de Multilayer Perceptron (MLP). 

```python
# Construct an MLP using PyTorch.
# This MLP has 3 layers.


class SimpleMLP(nn.Module):
    def __init__(self):
        super(SimpleMLP, self).__init__()
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)
```

## Inicializando um modelo

Através da classe `SimpleMLP`, podemos inicializar um modelo MLP.

```python
# Make sure that the model is on the same device, better to be on the GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Reset the random seed
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Initialize the MLP model
model = SimpleMLP().to(device)
```

### Inicializando um adaptador

Um adaptador pode nos ajudar a converter os dados de um lado para o outro.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Com um adaptador, podemos começar a realizar esta tarefa de Neuroevolução.

## Configurando o processo de execução

### Inicializando um algoritmo e um problema

Inicializamos um [algoritmo PSO](#evox.algorithms.so.pso_variants.pso.PSO), e o problema é um [problema Brax](#evox.problems.neuroevolution.brax.BraxProblem) no ambiente "swimmer".

```python
# Set the population size
POP_SIZE = 1024

# Get the bound of the PSO algorithm
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Initialize the PSO, and you can also use any other algorithms
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Initialize the Brax problem
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
    device=device,
)
```

Neste caso, usaremos 1000 passos para cada episódio, e a recompensa média de 3 episódios será retornada como o valor de fitness.

### Configurando um monitor

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Inicializando um workflow

```python
# Initiate an workflow
workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
    device=device,
)
```

### Executando o workflow

Execute o workflow e veja a mágica acontecer!

> **Nota:**
> O bloco a seguir levará cerca de 20 minutos para ser executado.
> O tempo pode variar dependendo do seu hardware.

```python
# Set the maximum number of generations
max_generation = 50

# Run the workflow
workflow.init_step()
compiled_step = torch.compile(workflow.step)
for i in range(max_generation):
    if i % 10 == 0:
        print(f"Generation {i}")
    compiled_step()

print(f"Top fitness: {monitor.get_best_fitness()}")
best_params = adapter.to_params(monitor.get_best_solution())
print(f"Best params: {best_params}")
```

```python
monitor.get_best_fitness()
```

```python
monitor.plot()
```

```python
html_string = problem.visualize(best_params)
escaped_string = html_string.replace('"', "&quot;")
HTML(f'<iframe srcdoc="{escaped_string}" width="100%" height="480" frameborder="0"></iframe>')
```

> **Importante:**
> - Normalmente, você só precisa de `HTML(problem.visualize(best_params))` para renderizar. O código acima é uma solução alternativa para garantir que o resultado seja exibido corretamente em nosso site.
> - O algoritmo PSO não é otimizado especificamente para este tipo de tarefa, portanto, limitações de desempenho são esperadas. Este exemplo é para fins de demonstração.

Esperamos que você goste de resolver problemas Brax com o EvoX e divirta-se!