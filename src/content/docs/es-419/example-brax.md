---
title: "Resolviendo problemas de Brax en EvoX"
order: 11
section: "examples"
---

# Resolviendo problemas de Brax en EvoX

EvoX se adentra profundamente en la neuroevolución con Brax.
Aquí mostraremos un ejemplo de cómo resolver un problema de Brax en EvoX.

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

## ¿Qué es Brax?

Brax es un motor de física rápido y totalmente diferenciable utilizado para la investigación y el desarrollo de robótica, percepción humana, ciencia de materiales, reinforcement learning y otras aplicaciones con simulaciones intensivas. 

Aquí demostraremos un entorno "swimmer" de Brax. 

Para más información, puedes explorar el [Github de Brax](https://github.com/google/brax).

## Diseñar una clase de red neuronal

Para empezar, debemos decidir qué red neuronal vamos a construir.

Aquí presentaremos una clase simple de Perceptrón Multicapa (MLP). 

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

## Inicializar un modelo

A través de la clase `SimpleMLP`, podemos inicializar un modelo MLP.

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

### Inicializar un adaptador

Un adaptador puede ayudarnos a convertir los datos de un formato a otro.

```python
adapter = ParamsAndVector(dummy_model=model)
```

Con un adaptador, podemos disponernos a realizar esta tarea de Neuroevolución.

## Configurar el proceso de ejecución

### Inicializar un algoritmo y un problema

Inicializamos un [algoritmo PSO](#evox.algorithms.so.pso_variants.pso.PSO), y el problema es un [problema de Brax](#evox.problems.neuroevolution.brax.BraxProblem) en el entorno "swimmer".

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

En este caso, utilizaremos 1000 pasos para cada episodio, y la recompensa promedio de 3 episodios se devolverá como el valor de fitness.

### Configurar un monitor

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Inicializar un workflow

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

### Ejecutar el workflow

¡Ejecuta el workflow y observa la magia!

> **Nota:**
> El siguiente bloque tardará unos 20 minutos en ejecutarse.
> El tiempo puede variar dependiendo de tu hardware.

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
> - Normalmente, solo necesitas `HTML(problem.visualize(best_params))` para renderizar. El código anterior es una solución alternativa para asegurar que el resultado se muestre correctamente en nuestro sitio web.
> - El algoritmo PSO no está optimizado específicamente para este tipo de tareas, por lo que se esperan limitaciones de rendimiento. Este ejemplo es para fines de demostración.

¡Esperamos que disfrutes resolviendo problemas de Brax con EvoX y que te diviertas!