---
title: "カスタムアルゴリズムを用いたHPOのデプロイ"
order: 6
section: "developer"
---

# カスタムアルゴリズムを用いたHPOのデプロイ

本章では、全体的なワークフローよりも詳細に重点を置いて、カスタムアルゴリズムを用いたHPO（ハイパーパラメータ最適化）のデプロイに焦点を当てます。HPOのデプロイに関する簡単な紹介は[チュートリアル](/ja/tutorials/practical-examples)にありますので、事前に読んでおくことを強く推奨します。

## アルゴリズムの並列化

内部アルゴリズムを問題（problem）に変換する必要があるため、内部アルゴリズムが並列化可能であることが重要です。したがって、アルゴリズムにいくつかの修正が必要になる場合があります。

1. アルゴリズムは、アルゴリズム自体の属性に対してインプレース操作（in-place operations）を行うメソッドを持ってはいけません。

```python
class ExampleAlgorithm(Algorithm):
    def __init__(self,...):
        self.pop = torch.rand(10,10) #attribute of the algorithm itself

    def step_in_place(self): # method with in-place operations
        self.pop.copy_(pop)

    def step_out_of_place(self): # method without in-place operations
        self.pop = pop
```

2. コードロジックはPythonの制御フローに依存してはいけません。

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


## HPOMonitorの活用

HPOタスクでは、各内部アルゴリズムの指標を追跡するために `HPOMonitor` を使用する必要があります。`HPOMonitor` は、標準の `monitor` と比較して `tell_fitness` というメソッドを1つだけ追加しています。HPOタスクは多次元で複雑な指標を伴うことが多いため、この追加は指標の評価においてより高い柔軟性を提供するために設計されています。

ユーザーは `HPOMonitor` のサブクラスを作成し、`tell_fitness` メソッドをオーバーライドしてカスタム評価指標を定義するだけで済みます。

また、多目的問題に対する 'IGD' や 'HV' 指標の計算、および単一目的問題に対する最小値の計算をサポートする、シンプルな `HPOFitnessMonitor` も提供しています。

## 簡単な例

ここでは、EvoXでHPOを使用する簡単な例を示します。`PSO` アルゴリズムを使用して、Sphere問題を解くための基本的なアルゴリズムの最適なハイパーパラメータを探索します。

まず、必要なモジュールをインポートします。

```python
import torch

from evox.algorithms.pso_variants.pso import PSO
from evox.core import Algorithm, Mutable, Parameter, Problem
from evox.problems.hpo_wrapper import HPOFitnessMonitor, HPOProblemWrapper
from evox.workflows import EvalMonitor, StdWorkflow
```

次に、単純なSphere問題を定義します。これは一般的な `problems` と違いがないことに注意してください。

```python
class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, x: torch.Tensor):
        return (x * x).sum(-1)
```

次に、アルゴリズムを定義します。`torch.cond` 関数を使用し、並列化可能であることを確認します。具体的には、インプレース操作を修正し、Pythonの制御フローを調整します。

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

Pythonの制御フローを扱うために [`torch.cond`](https://pytorch.org/docs/stable/generated/torch.cond.html) を使用します。次に、`StdWorkflow` を使用して `problem`、`algorithm`、`monitor` をラップします。そして、`HPOProblemWrapper` を使用して `StdWorkflow` をHPO問題に変換します。

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

`HPOProblemWrapper` が定義したハイパーパラメータを正しく認識しているかどうかをテストできます。7つのインスタンスに対してハイパーパラメータに変更を加えていないため、すべてのインスタンスで同一であるはずです。

```python
params = hpo_prob.get_init_params()
print("init params:\n", params)
```

独自のハイパーパラメータ値のセットを指定することもできます。ハイパーパラメータセットの数は、`HPOProblemWrapper` のインスタンス数と一致する必要があることに注意してください。カスタムハイパーパラメータは、値が `Parameter` でラップされた辞書として提供する必要があります。

```python
params = hpo_prob.get_init_params()
# since we have 7 instances, we need to pass 7 sets of hyperparameters
params["self.algorithm.hp"] = torch.nn.Parameter(torch.rand(7, 4), requires_grad=False)
result = hpo_prob.evaluate(params)
print("params:\n", params, "\n")
print("result:\n", result)
```

これで、`PSO` アルゴリズムを使用して `ExampleAlgorithm` のハイパーパラメータを最適化します。`PSO` の個体群サイズ（population size）はインスタンス数と一致する必要があることに注意してください。そうでない場合、予期しないエラーが発生する可能性があります。この場合、`HPOProblemWrapper` は辞書を入力として必要とするため、外部ワークフローで解（solution）を変換する必要があります。

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