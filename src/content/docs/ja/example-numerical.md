---
title: "数値最適化"
order: 9
section: "examples"
---

# 数値最適化

このノートブックでは、粒子群最適化（PSO）アルゴリズムを使用してAckley関数を最適化するためにEvoXを活用するステップバイステップのチュートリアルを提供します。PSOアルゴリズムとAckley最適化問題の両方が、EvoXフレームワーク内の組み込みコンポーネントとして統合されています。

まず、`PSO`（アルゴリズム）、`Ackley`（問題）、`StdWorkflow`と`EvalMonitor`（ワークフロー）を含むすべての必要なモジュールをインポートする必要があります。

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

ここでは、`PSO`アルゴリズムをインスタンス化します。以下の設定を指定します：

- `pop_size`: 粒子群（集団）のサイズ。
- `lb`と`ub`: 探索空間の各次元の下限と上限。
- その他のパラメータはすべてデフォルトです。詳細なAPIを参照してください。

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

次に、EvoXの数値問題から`Ackley`関数を選択します。

```python
# Define the problem
problem = Ackley()
```

最適化手順中に必要な情報を追跡するための`EvalMonitor`インスタンスを作成します。

```python
# Define the monitor
monitor = EvalMonitor()
```

`StdWorkflow`クラスは、アルゴリズム、問題、モニターを統合するための標準化されたプロセスを提供します。

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

`setup()`を呼び出すとコンポーネントが初期化され、ワークフローが最適化ステップを実行する準備が整います。

一定回数の反復（この例では100回）で最適化を実行します。各反復で、`step()`メソッドがPSOアルゴリズムを更新し、Ackley関数上で新しい候補解を評価し、モニターを通じて適応度を追跡します。

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

最後に、ワークフローから`monitor`サブモジュールを取得して、これまでに見つかったトップソリューション（`topk_solutions`）とそれに対応する目的値（`topk_fitness`）にアクセスします。次に、最良の結果と関連するソリューションを表示します。

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```
