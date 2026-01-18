import torch
from evox.algorithms import RVEA
from evox.problems.numerical import DTLZ2
from evox.workflows import StdWorkflow, EvalMonitor

torch.set_default_device("cuda")
prob = DTLZ2(m=3)
pf = prob.pf()
algo = RVEA(pop_size=100, n_objs=3, lb=-torch.zeros(12), ub=torch.ones(12))
monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)

workflow.init_step()
for i in range(100):
    workflow.step()