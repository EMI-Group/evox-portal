---
title: "Numerical Optimization"
order: 9
section: "examples"
---

# Numerical Optimization

This notebook offers a step-by-step tutorial on utilizing EvoX to optimize the Ackley function through the Particle Swarm Optimization (PSO) algorithm. Both the PSO algorithm and the Ackley optimization problem are integrated as built-in components within the EvoX framework.

First, we should import all necessary modules including `PSO` (algorithm), `Ackley` (problem) and `StdWorkflow` & `EvalMonitor` (workflow).

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

Here, we instantiate the `PSO` algorithm. We specify the following settings:

- `pop_size`: The size of the particle swarm (population).
- `lb` and `ub`: The lower and upper bounds for each dimension in the search space.
- Other parameters are all default. Please refer to the detailed API.

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

Next, we choose the `Ackley` function in EvoX' s numerical problem.

```python
# Define the problem
problem = Ackley()
```

We creat an `EvalMonitor` instance to track necessary information during the optimization procedure.

```python
# Define the monitor
monitor = EvalMonitor()
```

The `StdWorkflow` class provides a standardized process to integrate the algorithm, problem, and monitor.

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

Calling `setup()` initializes the components so that the workflow is ready to perform optimization steps.

We run the optimization for a certain number of iterations (100 in this example). In each iteration, the `step()` method updates the PSO algorithm, evaluates new candidate solutions on the Ackley function, and tracks their fitness via the monitor.

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

Finally, we retrieve the `monitor` submodule from the workflow to access the top solutions found so far (`topk_solutions`) and their corresponding objective values (`topk_fitness`). We then print the best result and the associated solution.

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
