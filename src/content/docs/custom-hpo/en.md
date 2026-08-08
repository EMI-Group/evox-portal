---
title: "Deploy HPO with Custom Algorithms"
order: 6
section: "developer"
---

# Deploy HPO with Custom Algorithms

In this chapter, we will focus on deploying HPO with custom algorithms, emphasizing the details rather than the overall workflow. A brief introduction to HPO deployment is provided in the [tutorial](/tutorials/practical-examples), and prior reading is highly recommended.

## Making Algorithms Parallelizable

Since we need to transform the inner algorithm into the problem, it's crucial that the inner algorithm is parallelizable. Therefore, some modifications to the algorithm may be necessary.

1. The algorithm should have no methods with in-place operations on the attributes of the algorithm itself.

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. The code logic does not rely on python control flow.

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


## Utilizing the HPOMonitor

In the HPO task, we should use the `HPOMonitor` to track the metrics of each inner algorithm. The `HPOMonitor` adds only one method, `tell_fitness`, compared to the standard `monitor`. This addition is designed to offer greater flexibility in evaluating metrics, as HPO tasks often involve multi-dimensional and complex metrics.

Users only need to create a subclass of `HPOMonitor` and override the `tell_fitness` method to define custom evaluation metrics.

We also provide a simple `HPOFitnessMonitor`, which supports calculating the 'IGD' and 'HV' metrics for multi-objective problems, and the minimum value for single-objective problems.

## A simple example

Here, we'll demonstrate a simple example of how to use HPO with EvoX. We will use the `PSO` algorithm to search for the optimal hyper-parameters of a basic algorithm to solve the sphere problem.

First, let's import the necessary modules.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Next, we define an simple sphere problem. Note that this has no difference from the common `problems`.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Next, we define the algorithm, we use the `torch.cond` function and make sure it is parallelizable. Specifically, we modify in-place operations and adjust the Python control flow.

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

To handle the Python control flow, we use [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html), next, we can use the `StdWorkflow` to wrap the `problem`, `algorithm` and `monitor`. Then we use the `HPOProblemWrapper` to transform the `StdWorkflow` to HPO problem.

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

We can test whether the `HPOProblemWrapper` correctly recognizes the hyper-parameters we defined. Since we have made no modifications to the hyper-parameters for the 7 instances, they should be identical across all instances.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

We can also specify our own set of hyperparameter values. Note that the number of hyperparameter sets must match the number of instances in the `HPOProblemWrapper`. The custom hyper-parameters should be provided as a dictionary whose values are wrapped in the `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

Now, we use the `PSO` algorithm to optimize the hyper-parameters of `ExampleAlgorithm`. Note that the population size of the `PSO` must match the number of instances; otherwise, unexpected errors may occur. In this case, we need to transform the solution in the outer workflow, as the `HPOProblemWrapper` requires a dictionary as input.

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
