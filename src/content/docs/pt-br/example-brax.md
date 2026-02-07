---
title: "Resolvendo Problemas Brax no EvoX"
order: 11
section: "examples"
---

# Resolvendo Problemas Brax no EvoX

O EvoX mergulha profundamente na neuroevolução com o Brax.
Aqui mostraremos um exemplo de resolução de problema Brax no EvoX.

```python
# instalar EvoX e Brax, pule se você já instalou o EvoX ou Brax
from importlib.util import find_spec
from IPython.display import HTML

if find_spec("evox") is None:
    %pip install evox
if find_spec("brax") is None:
    %pip install brax
```

```python
# Os pacotes ou funções dependentes neste exemplo
import torch
import torch.nn as nn

from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow
```

## O que é o Brax

O Brax é um motor de física rápido e totalmente diferenciável usado para pesquisa e desenvolvimento de robótica, percepção humana, ciência dos materiais, aprendizado por reforço e outras aplicações que dependem fortemente de simulação.

Aqui demonstraremos um ambiente "swimmer" do Brax.

Para mais informações, você pode navegar pelo [Github do Brax](https://github.com/google/brax).

## Projetar uma classe de rede neural

Para começar, precisamos decidir qual rede neural vamos construir.

Aqui daremos uma classe simples de Perceptron Multicamadas (MLP).

```python
# Construir um MLP usando PyTorch.
# Este MLP tem 3 camadas.


class SimpleMLP(nn.Module):
    def __init__(self):
        super(SimpleMLP, self).__init__()
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)
```

## Iniciar um modelo

Através da classe ``SimpleMLP``, podemos iniciar um modelo MLP.

```python
# Certifique-se de que o modelo está no mesmo dispositivo, preferencialmente na GPU
device = "cuda" if torch.cuda.is_available() else "cpu"
# Redefinir a semente aleatória
seed = 1234
torch.manual_seed(seed)
torch.cuda.manual_seed_all(seed)

# Inicializar o modelo MLP
model = SimpleMLP().to(device)
```

### Iniciar um adaptador

Um adaptador pode nos ajudar a converter os dados de ida e volta.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Com um adaptador, podemos começar a realizar esta Tarefa de Neuroevolução.

## Configurar o processo de execução

### Iniciar um algoritmo e um problema

Iniciamos um [algoritmo PSO](#evox.algorithms.so.pso_variants.pso.PSO), e o problema é um [problema Brax](#evox.problems.neuroevolution.brax.BraxProblem) no ambiente "swimmer".

```python
# Definir o tamanho da população
POP_SIZE = 1024

# Obter os limites do algoritmo PSO
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lower_bound = torch.full_like(pop_center, -5)
upper_bound = torch.full_like(pop_center, 5)

# Inicializar o PSO, e você também pode usar qualquer outro algoritmo
algorithm = PSO(
    pop_size=POP_SIZE,
    lb=lower_bound,
    ub=upper_bound,
    device=device,
)

# Inicializar o problema Brax
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

### Definir um monitor

```python
# definir um monitor, e ele pode registrar os 3 melhores fitness
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Iniciar um workflow

```python
# Iniciar um workflow
workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
    device=device,
)
```

### Executar o workflow

Execute o workflow e veja a magia!

> **Nota:**
> O bloco a seguir levará cerca de 20 minutos para executar.
> O tempo pode variar dependendo do seu hardware.

```python
# Definir o número máximo de gerações
max_generation = 50

# Executar o workflow
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
> - O algoritmo PSO não é especificamente otimizado para este tipo de tarefa, então limitações de desempenho são esperadas. Este exemplo é para fins de demonstração.

Esperamos que você se divirta resolvendo problemas Brax com o EvoX!
