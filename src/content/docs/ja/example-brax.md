---
title: "EvoXでBrax問題を解く"
order: 11
section: "examples"
---

# EvoXでBrax問題を解く

EvoXはBraxを用いたニューロエボリューション（神経進化）を深くサポートしています。
ここでは、EvoXを使用してBraxの問題を解く例を紹介します。

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

## Braxとは

Braxは、ロボティクス、人間の知覚、材料科学、強化学習、その他のシミュレーション重視のアプリケーションの研究開発に使用される、高速で完全に微分可能な物理エンジンです。

ここでは、Braxの「swimmer」環境を例示します。

詳細については、[BraxのGithub](https://github.com/google/brax)をご覧ください。

## ニューラルネットワーククラスの設計

まず、構築するニューラルネットワークを決定する必要があります。

ここでは、シンプルな多層パーセプトロン（MLP）クラスを提示します。

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

## モデルの初期化

`SimpleMLP`クラスを通じて、MLPモデルを初期化できます。

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

### アダプターの初期化

アダプターを使用することで、データの相互変換が可能になります。

```python
adapter = ParamsAndVector(dummy_model=model)
```

アダプターがあれば、このニューロエボリューションタスクに取り組む準備が整います。

## 実行プロセスのセットアップ

### アルゴリズムと問題の初期化

[PSOアルゴリズム](#evox.algorithms.so.pso_variants.pso.PSO)を初期化し、問題として「swimmer」環境の[Brax問題](#evox.problems.neuroevolution.brax.BraxProblem)を設定します。

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

このケースでは、各エピソードに1000ステップを使用し、3エピソードの平均報酬を適応度（fitness）として返します。

### モニターの設定

```python
# set an monitor, and it can record the top 3 best fitnesses
monitor = EvalMonitor(
    topk=3,
    device=device,
)
```

### ワークフローの初期化

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

### ワークフローの実行

ワークフローを実行して、その成果を確認しましょう！

> **注:**
> 以下のブロックの実行には約20分かかります。
> 時間はハードウェアによって異なる場合があります。

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

> **重要:**
> - 通常、レンダリングには `HTML(problem.visualize(best_params))` だけで十分です。上記のコードは、当Webサイト上で結果が正しく表示されるようにするための回避策です。
> - PSOアルゴリズムはこの種のタスクに特化して最適化されているわけではないため、性能には限界があることが予想されます。この例はデモンストレーションを目的としています。

EvoXを使ったBrax問題の解決を楽しんでいただければ幸いです！