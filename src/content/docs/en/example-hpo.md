---
title: "Efficient HPO with EvoX"
order: 13
section: "examples"
---

# Efficient HPO with EvoX

In this chapter, we will explore how to use EvoX for hyperparameter optimization (HPO).

HPO plays a crucial role in many machine learning tasks but is often overlooked due to its high computational cost, which can sometimes take days to process, as well as the challenges involved in deployment.

With EvoX, we can simplify HPO deployment using the `HPOProblemWrapper` and achieve efficient computation by leveraging the `vmap` method and GPU acceleration.

## Transforming Workflow into Problem

![HPO structure](/_static/HPO_structure.png)

The key to deploying HPO with EvoX is to transform the `workflows` into `problems` using the `HPOProblemWrapper`. Once transformed, we can treat the `workflows` as standard `problems`. The input to the 'HPO problem' consists of the hyper-parameters, and the output is the evaluation metrics.

## The Key Component -- `HPOProblemWrapper`

To ensure the `HPOProblemWrapper` recognizes the hyper-parameters, we need to wrap them using `Parameter`. With this straightforward step, the hyper-parameters will be automatically identified.

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

## Utilizing the `HPOFitnessMonitor`

We provide an `HPOFitnessMonitor` that supports calculating 'IGD' and 'HV' metrics for multi-objective problems, as well as the minimum value for single-objective problems.

It is important to note that the `HPOFitnessMonitor` is a basic monitor designed for HPO problems. You can also create your own customized monitor flexibly using the approach outlined in [Deploy HPO with Custom Algorithms](#/guide/developer/custom_hpo_prob).

## A simple example

Here, we'll demonstrate a simple example of using EvoX for HPO. Specifically, we will use the [PSO](#PSO) algorithm to optimize the hyper-parameters of the [PSO](#PSO) algorithm for solving the sphere problem.

Please note that this chapter provides only a brief overview of HPO deployment. For a more detailed guide, refer to [Deploy HPO with Custom Algorithms](#/guide/developer/custom_hpo_prob).

To start, let's import the necessary modules.

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

Next, we define a simple Sphere problem.

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

Next, we can use the `StdWorkflow` to wrap the `problem`, `algorithm` and `monitor`. Then we use the `HPOProblemWrapper` to transform the `StdWorkflow` to an HPO problem.

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

The `HPOProblemWrapper` takes 4 arguments:
1. `iterations`: The number of iterations to be executed in the optimization process.
2. `num_instances`: The number of instances to be executed in parallel in the optimization process.
3. `workflow`: The workflow to be used in the optimization process.
4. `copy_init_state`: Whether to copy the initial state of the workflow for each evaluation. Defaults to `True`. If your workflow contains operations that IN-PLACE modify the tensor(s) in initial state, this should be set to `True`. Otherwise, you can set it to `False` to save memory.

We can verify whether the `HPOProblemWrapper` correctly recognizes the hyper-parameters we define. Since no modifications are made to the hyper-parameters across the 5 instances, they should remain identical for all instances.

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

We can also define a custom set of hyperparameter values. It is important to ensure that the number of hyperparameter sets matches the number of instances in the `HPOProblemWrapper`. Additionally, custom hyper-parameters must be provided as a dictionary whose values are wrapped using the `Parameter`.

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

Now, we use the [PSO](#PSO) algorithm to optimize the hyperparameters of the [PSO](#PSO) algorithm.

It is important to ensure that the population size of the [PSO](#PSO) matches the number of instances; otherwise, unexpected errors may occur.

Additionally, the solution needs to be transformed in the outer workflow, as the `HPOProblemWrapper` requires the input to be in the form of a dictionary.

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
