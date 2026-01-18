import torch
import torch.nn as nn
from evox.algorithms import PSO
from evox.problems.neuroevolution.brax import BraxProblem
from evox.utils import ParamsAndVector
from evox.workflows import EvalMonitor, StdWorkflow

class SimpleMLP(nn.Module):
    def __init__(self):
        super().__init__()
        # observation space is 17-dim, action space is 6-dim.
        self.features = nn.Sequential(nn.Linear(17, 8), nn.Tanh(), nn.Linear(8, 6))

    def forward(self, x):
        x = self.features(x)
        return torch.tanh(x)

# Initialize the MLP model
torch.set_default_device('cuda')
model = SimpleMLP()
adapter = ParamsAndVector(dummy_model=model)

# Set the population size
POP_SIZE = 1024

# Get the bound of the PSO algorithm
model_params = dict(model.named_parameters())
pop_center = adapter.to_vector(model_params)
lb = torch.full_like(pop_center, -5)
ub = torch.full_like(pop_center, 5)

# Initialize the PSO
algorithm = PSO(pop_size=POP_SIZE, lb=lb, ub=ub)

# Initialize the Brax problem
problem = BraxProblem(
    policy=model,
    env_name="halfcheetah",
    max_episode_length=1000,
    num_episodes=3,
    pop_size=POP_SIZE,
)

monitor = EvalMonitor(topk=3)

workflow = StdWorkflow(
    algorithm=algorithm,
    problem=problem,
    monitor=monitor,
    opt_direction="max",
    solution_transform=adapter,
)

workflow.init_step()
for i in range(50):
    workflow.step()