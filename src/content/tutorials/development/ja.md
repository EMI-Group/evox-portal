---
title: "5. 開発と拡張"
order: 5
---

# 5. 開発と拡張

EvoXは、すぐに使える機能を提供するだけでなく、開発者や上級ユーザー向けに、カスタム開発や拡張的な統合を行うための豊富なインターフェースも用意しています。本章では、独自のアルゴリズムや問題を実装する方法、EvoXのAPIを活用してより深い制御を行う方法、そしてEvoXを他のツールと統合してより複雑なアプリケーションを構築する方法について詳しく解説します。

## 5.1 カスタムモジュールの開発

解決したい問題や使用したいアルゴリズムが、EvoXの標準ライブラリに含まれていない場合があります。そのような場合、EvoXが提供するインターフェースを使用してカスタムモジュールを開発することができます。

### 5.1.1 カスタム問題 (MyProblem)

目的関数が `evox.problems` に存在しない場合、`evox.core.Problem` 基底クラスを継承する（または必要なインターフェースに準拠する）ことで独自の問題を定義できます。典型的な問題クラスでは、解のバッチ（`pop`）を受け取り、対応する適応度（fitness）や目的関数値を返す `evaluate` 関数を実装する必要があります。並列計算を活用するため、EvoXでは `evaluate` が **バッチ入力** をサポートしている必要があります。

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

例えば、決定変数の3乗和を最小化する場合：

$$
\min f(x) = \sum_{i=1}^{n} x_i^3
$$

次のように `MyProblem` クラスを実装できます：

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

ここで、`pop` は `(population_size, dim)` の形状を持つテンソルです。`evaluate` 関数は、適応度値の1次元テンソルを返します。多目的問題の場合は、各目的のキーを持つ辞書を返すことができます。

カスタム問題は、組み込みの問題と同様に使用できます：

```python
import torch
from MyProblems import MyProblem

popsize = 10
dim = 2
initial_pop = torch.rand(popsize, dim)
problem = MyProblem()
initial_fitness = problem.evaluate(initial_pop)
```

### 5.1.2 カスタムアルゴリズム (MyAlgorithm)

カスタムアルゴリズムの作成は、初期化、新しい解の生成、選択などが含まれるため、少し複雑になります。新しいアルゴリズムを作成するには、`evox.core.Algorithm` を継承し、少なくとも以下を実装します：

- `__init__`: 初期化のため。
- `step`: 進化のメインステップのロジック。

以下は、EvoXで粒子群最適化（PSO）アルゴリズムを実装する例です：

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

アルゴリズムをワークフローに統合するには、次のようにします：

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

`Monitor`、`Operator`、あるいはEvoX内の任意のモジュールをカスタマイズすることも可能です。例えば、個体群の多様性を記録する `MyMonitor` を実装したり、独自の交叉・突然変異戦略のための `MyOperator` を作成したりできます。どのメソッドをオーバーライドすべきかを理解するために、既存の基底クラスや例を参照してください。

## 5.2 APIの使用

EvoXはAPIをモジュール単位で整理しており、コンポーネントの拡張や組み合わせが容易になっています。

### 5.2.1 アルゴリズムと問題

- **アルゴリズム**: `evox.algorithms.so`（単目的）および `evox.algorithms.mo`（多目的）にあります。

```python
from evox.algorithms.so import PSO
from evox.algorithms.mo import RVEA
```

- **問題**: `evox.problems` にあり、以下のようなものが含まれます：
  - `numerical` – 古典的なテスト関数（例：Ackley, Sphere）。
  - `neuroevolution` – BraxなどのRL環境。
  - `hpo_wrapper` – MLトレーニングをHPO問題としてラップするもの。

例：PyTorchのMLPをBrax環境でラップする場合：

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

例：HPOのために最適化プロセスをラップする場合：

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

- **ワークフロー**: 基本的な最適化ループのための `evox.workflows.StdWorkflow`。
- **モニター**: パフォーマンスを追跡するための `EvalMonitor`。

例：

```python
workflow = StdWorkflow(algorithm, problem, monitor)
compiled_step = torch.compile(workflow.step)
for i in range(10):
    compiled_step()
    print("Top fitness:", monitor.topk_fitness)
```

- **メトリクス**: `evox.metrics` は IGD、Hypervolumeなどを提供します。

```python
from evox.metrics import igd
igd_value = igd(current_population, true_pareto_front)
```

- **PyTorchとの相互運用性**: `torch.nn` や `torch.Tensor` などとのシームレスな統合が可能です。

## 5.3 他のツールとの統合

EvoXは、外部ツールと容易に統合できるように設計されています。

### 5.3.1 機械学習との統合

EvoXを使用してハイパーパラメータを調整します：

1.  トレーニング/検証を `Problem` としてラップします。
2.  CMA-ESなどのアルゴリズムを使用します。
3.  複数回の実行にわたってハイパーパラメータを最適化します。
4.  最適なパラメータで最終モデルをトレーニングします。

### 5.3.2 強化学習との統合

EvoXを使用してニューラルネットワークの方策（ポリシー）を進化させます：

1.  `BraxProblem` を使用してRL環境をラップします。
2.  `ParamsAndVector` を使用して方策ネットワークを平坦化します。
3.  GAやCMA-ESなどの進化的アルゴリズムを使用して最適化します。
4.  最適化された方策を直接デプロイするか、RLでファインチューニングします。

EvoXはバッチ環境シミュレーションをサポートしており、GPU/CPUの能力を最大限に活用できます。

---

**まとめとして**、EvoXは強力でモジュール化されたAPIと、カスタムアルゴリズムの実装、あらゆる最適化問題のラップ、そしてMLやRLツールとの統合を容易にする開発者フレンドリーな設計を提供しています。理解を深めるにつれて、これらのインターフェースを創造的に適用し、目的に合わせた最適化ソリューションを構築できるようになるでしょう。