---
title: "EvoXによる効率的なHPO"
order: 13
section: "examples"
---

# EvoXによる効率的なHPO

この章では、EvoXをハイパーパラメータ最適化（HPO）に使用する方法を探ります。

HPOは多くの機械学習タスクで重要な役割を果たしますが、処理に数日かかることもある高い計算コストやデプロイメントの課題のため、しばしば見過ごされています。

EvoXを使用すると、`HPOProblemWrapper`を使用してHPOデプロイメントを簡素化し、`vmap`メソッドとGPUアクセラレーションを活用して効率的な計算を実現できます。

## ワークフローから問題への変換

![HPO structure](/_static/HPO_structure.png)

EvoXでHPOをデプロイする鍵は、`HPOProblemWrapper`を使用して`workflows`を`problems`に変換することです。変換後、`workflows`を標準的な`problems`として扱うことができます。「HPO問題」への入力はハイパーパラメータで構成され、出力は評価メトリクスです。

## 主要コンポーネント -- `HPOProblemWrapper`

`HPOProblemWrapper`がハイパーパラメータを認識できるようにするには、`Parameter`を使用してラップする必要があります。この簡単なステップにより、ハイパーパラメータが自動的に識別されます。

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

## `HPOFitnessMonitor`の活用

多目的問題の「IGD」と「HV」メトリクスの計算、および単目的問題の最小値をサポートする`HPOFitnessMonitor`を提供しています。

`HPOFitnessMonitor`はHPO問題用に設計された基本的なモニターであることに注意してください。[カスタムアルゴリズムによるHPOのデプロイ](#/guide/developer/custom_hpo_prob)で概説されているアプローチを使用して、独自のカスタマイズされたモニターを柔軟に作成することもできます。

## 簡単な例

ここでは、EvoXをHPOに使用する簡単な例を示します。具体的には、[PSO](#PSO)アルゴリズムを使用して、sphere問題を解くための[PSO](#PSO)アルゴリズムのハイパーパラメータを最適化します。

この章ではHPOデプロイメントの簡単な概要のみを提供しています。より詳細なガイドについては、[カスタムアルゴリズムによるHPOのデプロイ](#/guide/developer/custom_hpo_prob)を参照してください。

まず、必要なモジュールをインポートしましょう。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

次に、シンプルなSphere問題を定義します。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

次に、`StdWorkflow`を使用して`problem`、`algorithm`、`monitor`をラップします。そして`HPOProblemWrapper`を使用して`StdWorkflow`をHPO問題に変換します。

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

`HPOProblemWrapper`は4つの引数を取ります：
1. `iterations`: 最適化プロセスで実行される反復回数。
2. `num_instances`: 最適化プロセスで並列に実行されるインスタンス数。
3. `workflow`: 最適化プロセスで使用されるワークフロー。
4. `copy_init_state`: 各評価のためにワークフローの初期状態をコピーするかどうか。デフォルトは`True`です。ワークフローに初期状態のテンソルをインプレースで変更する操作が含まれている場合は、`True`に設定する必要があります。そうでない場合は、メモリを節約するために`False`に設定できます。

`HPOProblemWrapper`が定義したハイパーパラメータを正しく認識するか確認できます。5つのインスタンスに対してハイパーパラメータを変更していないため、すべてのインスタンスで同一であるはずです。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

カスタムのハイパーパラメータ値のセットを定義することもできます。ハイパーパラメータセットの数が`HPOProblemWrapper`のインスタンス数と一致することが重要です。また、カスタムハイパーパラメータは`Parameter`でラップされた値を持つ辞書として提供する必要があります。

```python
params = hpo_prob.get_init_params()
# since we have 128 instances, we need to pass 128 sets of hyperparameters
params["algorithm.w"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_p"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
params["algorithm.phi_g"] = torch.nn.Parameter(torch.rand(128, 1), requires_grad=False)
result = hpo_prob.evaluate(params)
print("The result of the first 3 parameter sets:\n", result[:3])
```

次に、[PSO](#PSO)アルゴリズムを使用して[PSO](#PSO)アルゴリズムのハイパーパラメータを最適化します。

[PSO](#PSO)の集団サイズがインスタンス数と一致することが重要です。そうでないと、予期しないエラーが発生する可能性があります。

また、`HPOProblemWrapper`は辞書形式の入力を必要とするため、外部ワークフローで解を変換する必要があります。

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
