---
title: "Solving Brax Problems in EvoX"
order: 11
section: "examples"
---

# Solving Brax Problems in EvoX

EvoX deeply dives into neuroevolution with Brax.
Here we will show an example of solving Brax problem in EvoX.

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

## What is Brax

Brax is a fast and fully differentiable physics engine used for research and development of robotics, human perception, materials science, reinforcement learning, and other simulation-heavy applications. 

Here we will demonstrate a "swimmer" environment of Brax. 

For more information, you can browse the [Github of Brax](https://github.com/google/brax).

## Design a neural network class

To start with, we need to decide which neural network we are about to construct.

Here we will give a simple Multilayer Perceptron (MLP) class. 

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

## Initiate a model

Through the ``SimpleMLP`` class, we can initiate a MLP model.

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

### Initiate an adapter

An adapter can help us convert the data back-and-forth.

```python
adapter = ParamsAndVector(dummy_model=model)
```

With an adapter, we can set out to do this Neuroevolution Task.

## Set up the running process

### Initiate an algorithm and a problem

We initiate a `PSO algorithm`, and the problem is a `Brax problem` in "swimmer" environment.

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

In this case, we will be using 1000 steps for each episode, and the average reward of 3 episodes will be returned as the fitness value.

### Set an monitor

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### Initiate an workflow

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

### Run the workflow

Run the workflow and see the magic!

> **Note:**
> The following block will take around 20 minute to run.
> The time may vary depending on your hardware.

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

> **Important:**
> - Normally, you only need `HTML(problem.visualize(best_params))` to render. The code above is a workaround to ensure the result is displayed correctly on our website.
> - The PSO algorithm is not specifically optimized for this type of task, so performance limitations are expected. This example is for demonstration purposes.

We hope you enjoy solving Brax problems with EvoX and have fun!
