---
title: "数値最適化"
order: 9
section: "examples"
---

# 数値最適化

このノートブックでは、EvoXを使用して粒子群最適化（PSO）アルゴリズムによりAckley関数を最適化するためのステップバイステップのチュートリアルを提供します。PSOアルゴリズムとAckley最適化問題は、どちらもEvoXフレームワーク内の組み込みコンポーネントとして統合されています。

まず、`PSO`（アルゴリズム）、`Ackley`（問題）、および`StdWorkflow`と`EvalMonitor`（ワークフロー）を含む必要なすべてのモジュールをインポートします。

```python
import torch

from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor
```

ここで、`PSO`アルゴリズムをインスタンス化します。以下の設定を指定します：

- `pop_size`: 粒子群（個体群）のサイズ。
- `lb` および `ub`: 探索空間における各次元の下限と上限。
- その他のパラメータはすべてデフォルトです。詳細なAPIを参照してください。

```python
# Define the algorithm
algorithm = PSO(pop_size=100, lb=-32 * torch.ones(10), ub=32 * torch.ones(10))
```

次に、EvoXの数値問題にある`Ackley`関数を選択します。

```python
# Define the problem
problem = Ackley()
```

最適化プロセス中に必要な情報を追跡するために、`EvalMonitor`インスタンスを作成します。

```python
# Define the monitor
monitor = EvalMonitor()
```

`StdWorkflow`クラスは、アルゴリズム、問題、およびモニターを統合するための標準化されたプロセスを提供します。

```python
# Define the workflow
workflow = StdWorkflow(algorithm=algorithm, problem=problem, monitor=monitor)
```

`setup()`を呼び出すとコンポーネントが初期化され、ワークフローが最適化ステップを実行する準備が整います。

一定の反復回数（この例では100回）だけ最適化を実行します。各反復において、`step()`メソッドはPSOアルゴリズムを更新し、Ackley関数で新しい候補解を評価し、モニターを通じてそれらの適応度（fitness）を追跡します。

```python
# Perform the Ackley function optimization procedure
for _ in range(100):
    workflow.step()
```

最後に、ワークフローから`monitor`サブモジュールを取得し、これまでに発見された上位の解（`topk_solutions`）とそれに対応する目的関数値（`topk_fitness`）にアクセスします。そして、最良の結果とそれに関連する解を出力します。

```python
# Get the best solution and its fitness
population = monitor.topk_solutions
fitness = monitor.topk_fitness
print(f"The best solution is:\n{population},\nwith the minimum value:\n{fitness}")
```

```python
monitor.plot()
```