---
title: "5. 開発と拡張"
order: 5
---

# 5. 開発と拡張

EvoXはすぐに使える機能を提供するだけでなく、開発者や上級ユーザー向けにカスタム開発と拡張統合のための豊富なインターフェースを提供しています。この章では、カスタムアルゴリズムと問題の実装方法、EvoXのAPIを使用したより深い制御方法、およびEvoXを他のツールと統合してより複雑なアプリケーションを構築する方法について詳しく説明します。

## 5.1 カスタムモジュールの開発

解決しようとしている問題や使用したいアルゴリズムがEvoXの標準ライブラリに含まれていない場合があります。そのような場合、EvoXが提供するインターフェースを使用してカスタムモジュールを開発できます。

### 5.1.1 カスタム問題（MyProblem）

目的関数が`evox.problems`にない場合、`evox.core.Problem`基底クラスを継承して（または必要なインターフェースに準拠して）独自の問題を定義できます。典型的な問題クラスは`evaluate`関数を実装する必要があり、これは解のバッチ（`pop`）を受け取り、対応する適応度/目的値を返します。並列計算を活用するために、EvoXでは`evaluate`が**バッチ入力**をサポートする必要があります。

```python
import torch
from abc import ABC
from typing import Any, Dict
from evox.core.module import ModuleBase

class Problem(ModuleBase, ABC):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor) -> torch.Tensor:
        return torch.empty(0)
```

例えば、決定変数ベクトルの立方和を最小化する場合：

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

`MyProblem`クラスを次のように実装できます：

```python
import torch
from evox.core import Problem

class MyProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        fitness = torch.sum(pop**3, dim=1)
        return fitness
```

ここで、`pop`は形状`(population_size, dim)`のテンソルです。`evaluate`関数は1次元の適応度値テンソルを返します。多目的問題の場合は、各目的に対して別々のキーを持つ辞書を返すことができます。

カスタム問題を組み込みのものと同様に使用できます：

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 カスタムアルゴリズム（MyAlgorithm）

カスタムアルゴリズムの作成はより複雑で、初期化、新しい解の生成、選択が含まれます。新しいアルゴリズムを作成するには、`evox.core.Algorithm`を継承し、少なくとも以下を実装します：

- `__init__`: 初期化用。
- `step`: メインの進化ステップロジック。

以下は、EvoXでの粒子群最適化（PSO）アルゴリズムの実装例です：

```python
import torch
from evox.core import Algorithm, Mutable, Parameter
from evox.utils import clamp
from evox.algorithms.so.pso_variants.utils import min_by

class PSO(Algorithm):
    def __init__(
        self,
        pop_size: int,
        lb: torch.Tensor,
        ub: torch.Tensor,
        w: float = 0.6,
        phi_p: float = 2.5,
        phi_g: float = 0.8,
        device: torch.device | None = None,
    ):
        super().__init__()
        device = torch.get_default_device() if device is None else device
        assert lb.shape == ub.shape and lb.ndim == 1

        self.pop_size = pop_size
        self.dim = lb.shape[0]

        lb = lb[None, :].to(device)
        ub = ub[None, :].to(device)
        length = ub - lb

        pop = length * torch.rand(self.pop_size, self.dim, device=device) + lb
        velocity = 2 * length * torch.rand(self.pop_size, self.dim, device=device) - length

        self.lb = lb
        self.ub = ub

        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)

        self.pop = Mutable(pop)
        self.velocity = Mutable(velocity)
        self.fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.local_best_location = Mutable(pop.clone())
        self.local_best_fit = Mutable(torch.full((self.pop_size,), torch.inf, device=device))
        self.global_best_location = Mutable(pop[0])
        self.global_best_fit = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        compare = self.local_best_fit > self.fit
        self.local_best_location = torch.where(compare[:, None], self.pop, self.local_best_location)
        self.local_best_fit = torch.where(compare, self.fit, self.local_best_fit)
        self.global_best_location, self.global_best_fit = min_by(
            [self.global_best_location.unsqueeze(0), self.pop],
            [self.global_best_fit.unsqueeze(0), self.fit],
        )
        rg = torch.rand(self.pop_size, self.dim, device=self.fit.device)
        rp = torch.rand(self.pop_size, self.dim, device=self.fit.device)

        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.pop)
            + self.phi_g * rg * (self.global_best_location - self.pop)
        )
        pop = self.pop + velocity
        self.pop = clamp(pop, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)
        self.fit = self.evaluate(self.pop)

    def init_step(self):
        self.fit = self.evaluate(self.pop)
        self.local_best_fit = self.fit
        self.global_best_fit = torch.min(self.fit)
```

アルゴリズムをワークフローに統合するには：

```python
import torch
from MyProblems import MyProblem
from evox.workflows import EvalMonitor, StdWorkflow
from evox.algorithms import PSO

problem = MyProblem()
algorithm = PSO(
    pop_size=100,
    lb=torch.tensor([-10.0]),
    ub=torch.tensor([10.0])
)
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)
for i in range(10):
    workflow.step()
```

### 5.1.3 その他のカスタムモジュール

`Monitor`、`Operator`、またはEvoXの任意のモジュールもカスタマイズできます。例えば、集団の多様性を記録する`MyMonitor`を実装したり、カスタム交叉/突然変異戦略のための`MyOperator`を作成したりできます。オーバーライドすべきメソッドを理解するために、既存の基底クラスと例を参照してください。

## 5.2 APIの使用

EvoXはAPIをモジュールに整理しており、コンポーネントの拡張と組み合わせが容易です。

### 5.2.1 アルゴリズムと問題

- **アルゴリズム**: `evox.algorithms.so`（単目的）と`evox.algorithms.mo`（多目的）にあります。

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **問題**: `evox.problems`にあり、以下が含まれます：
  - `numerical` -- 古典的なテスト関数（例：Ackley、Sphere）。
  - `neuroevolution` -- BraxなどのRL環境。
  - `hpo_wrapper` -- MLトレーニングをHPO問題にラップ。

例：PyTorch MLPをBrax環境でラップ：

```python
import torch.nn as nn
from evox.problems.neuroevolution.brax import BraxProblem

class SimpleMLP(nn.Module):
    ...

policy = SimpleMLP().to(device)
problem = BraxProblem(
    policy=policy,
    env_name="swimmer",
    ...
)
```

例：HPO用の最適化プロセスのラップ：

```python
from evox.problems.hpo_wrapper import HPOProblemWrapper
...
hpo_problem = HPOProblemWrapper(
    iterations=30,
    num_instances=128,
    workflow=inner_workflow,
    copy_init_state=True
)
```

### 5.2.2 ワークフローとツール

- **ワークフロー**: 基本的な最適化ループ用の`evox.workflows.StdWorkflow`。
- **モニター**: パフォーマンス追跡用の`EvalMonitor`。

例：

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **メトリクス**: `evox.metrics`はIGD、Hypervolumeなどを提供します。

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorch相互運用性**: `torch.nn`、`torch.Tensor`などとのシームレスな統合。

## 5.3 他のツールとの統合

EvoXは外部ツールとの統合が容易に設計されています。

### 5.3.1 機械学習との統合

EvoXを使用してハイパーパラメータを調整：

1. トレーニング/検証を`Problem`としてラップ。
2. CMA-ESなどのアルゴリズムを使用。
3. 複数回の実行でハイパーパラメータを最適化。
4. 最良のパラメータで最終モデルをトレーニング。

### 5.3.2 強化学習との統合

EvoXを使用してニューラルネットワークポリシーを進化：

1. `BraxProblem`を使用してRL環境をラップ。
2. `ParamsAndVector`を使用してポリシーネットワークをフラット化。
3. GAやCMA-ESなどの進化アルゴリズムを使用して最適化。
4. 最適化されたポリシーを直接デプロイするか、RLで微調整。

EvoXはGPU/CPUパワーを最大限に活用するためのバッチ環境シミュレーションをサポートしています。

---

**まとめ**として、EvoXはカスタムアルゴリズムの実装、あらゆる最適化問題のラッピング、MLおよびRLツールとの統合のための強力でモジュラーなAPIと開発者フレンドリーな設計を提供します。理解を深めるにつれて、これらのインターフェースを創造的に適用して、カスタマイズされた最適化ソリューションを構築できます。
