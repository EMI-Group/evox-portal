---
title: "7. 実践例"
order: 7
---

# 7. 実践例

この章では、前の章で学んだ知識を応用する方法を示すために、いくつかの完全で実践的な例を紹介します。ゼロから最適化プロジェクトを構築し、EvoXを他のツールと統合する方法を紹介します。これらの例はさまざまな問題タイプをカバーしており、実際のシナリオでEvoXを適用するのに役立ちます。

---

## 例1：単目的最適化

**問題**: 古典的なRastrigin関数を最適化する：

```{math}
f(\mathbf{x}) = 10 d + \sum_{i=1}^{d}[x_i^2 - 10 \cos{(2\pi x_i)}],
```

ここで$\mathbf{x} \in \mathbb{R}^d$、$d$は次元数です。グローバル最適値は原点で0です。この関数は高度にマルチモーダルであり、グローバル最適化アルゴリズムのテストに最適です。以下はRastrigin関数のプロットです。

```{figure} /_static/rastrigin_function.svg
:alt: Rastrigin関数のプロット
:figwidth: 70%
:align: center

Rastrigin関数
```

この例では、粒子群最適化（PSO）アルゴリズムを使用して10次元のRastrigin関数を最適化します。

**ステップ1：セットアップ**

第2章で説明したようにEvoX環境を設定済みであることを前提とします。

**ステップ2：ワークフローのセットアップ**

Pythonスクリプト`opt_rastrigin_10.py`を作成します：

```python
import torch
from evox.algorithms.so.pso_variants import PSO
from evox.problems.numerical.basic import Rastrigin
from evox.workflows import StdWorkflow, EvalMonitor
```

PSOアルゴリズムを定義します：

```python
dim = 10
algo = PSO(
    pop_size=50,
    lb=-32 * torch.ones(dim),
    ub=32 * torch.ones(dim)
)
```

問題とワークフローをセットアップします：

```python
prob = Rastrigin()
monitor = EvalMonitor()
workflow = StdWorkflow(
    algorithm=algo,
    problem=prob,
    monitor=monitor
)
```

**ステップ3：最適化の実行**

```python
workflow.init_step()
for iter in range(501):
    workflow.step()
    if iter % 100 == 0:
        current_best_fitness = monitor.get_best_fitness().item()
        print(f"Iter {iter}, Best Fitness: {current_best_fitness}")

print(f"Final Best Solution: {monitor.get_best_solution()}")
```

**サンプル出力**:

```
Iter 0, Best Fitness: 1398.625
Iter 100, Best Fitness: 11.608497619628906
Iter 200, Best Fitness: 2.5700759887695312
Iter 300, Best Fitness: 1.9909820556640625
Iter 400, Best Fitness: 1.9899139404296875
Iter 500, Best Fitness: 0.9976348876953125
Final Best Solution: tensor([...])
```

PSOアルゴリズムは、期待通り原点に近い準最適解を見つけます。

---

## 例2：多目的最適化

**問題**: 2つの目的を最小化する：

```{math}
f_1(x) = x^2, \quad
f_2(x) = (x - 2)^2
```

パレートフロントは$x = 0$（$f_1$に最適）と$x = 2$（$f_2$に最適）の間にあります。

**ステップ1：環境のセットアップ**

NSGA-IIサポート付きのEvoXがインストールされていることを確認してください。

**ステップ2：カスタム問題の定義**

EvoXには多くの組み込み多目的テスト問題がありますが、この例では2つの目的を最適化するカスタム問題を定義します：

```python
import torch
import numpy as np
import matplotlib.pyplot as plt

from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor
# evoxコアクラスをインポート、詳細は第5章を参照
from evox.core import Problem

class TwoObjectiveProblem(Problem):
    def __init__(
        self,
        d: int = 1,
        m: int = 2,
    ):
        super().__init__()
        self.d = d
        self.m = m

    def evaluate(self, X: torch.Tensor) -> torch.Tensor:
        x = X[:, 0]
        f_1 = x ** 2
        f_2 = (x - 2) ** 2
        return torch.stack([f_1, f_2], dim=1)

    # オプション：パレートフロント関数を定義
    def pf(self) -> torch.Tensor:
        pass
```

**ステップ3：アルゴリズムとワークフローの定義**

```python
from evox.algorithms import NSGA2
from evox.workflows import StdWorkflow, EvalMonitor

prob = TwoObjectiveProblem()
torch.set_default_device("cuda:0")

algo = NSGA2(
    pop_size=50,
    n_objs=2,
    lb=-5 * torch.ones(1),
    ub=5 * torch.ones(1),
    device=torch.device("cuda"),
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**ステップ4：最適化と可視化**

```python
workflow.init_step()
for i in range(100):
    workflow.step()

data = algo.fit.cpu().numpy()

import numpy as np
import matplotlib.pyplot as plt

x_vals = np.linspace(0, 2, 400)
pf_f1 = x_vals ** 2
pf_f2 = (x_vals - 2) ** 2

plt.figure(figsize=(8, 6))
plt.scatter(data[:, 0], data[:, 1], c='blue', label='Optimized Population', alpha=0.7)
plt.plot(pf_f1, pf_f2, 'r-', linewidth=2, label='Pareto Front')
plt.xlabel("f1")
plt.ylabel("f2")
plt.title("NSGA-II on Bi-objective Problem")
plt.legend()
plt.grid(True)
plt.show()
```

Matplotlibを使用して結果を可視化できます。青い点は最適化された集団を表し、赤い線はパレートフロントを示します。

```{figure} /_static/example_nsga2_result.svg
:alt: NSGA-II集団のプロット
:figwidth: 70%
:align: center

最適化後のNSGA-II集団のプロット
```

Jupyter Notebookでは、EvoXの組み込みプロット機能を使用して、最適化プロセスを可視化し、世代を通じて集団がどのように進化するかを監視できます。

```python
monitor.plot()
```

---

## 例3：ハイパーパラメータ最適化（HPO）

**問題**: 乳がんデータセットでのロジスティック回帰分類器の`C`と`max_iter`を調整して、検証精度を最大化する。

**ステップ1：データとモデルの読み込み**

```python
import torch
from sklearn.datasets import load_breast_cancer
from sklearn.linear_model import LogisticRegression
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from evox.core import Problem

X, y = load_breast_cancer(return_X_y=True)
X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)
scaler = StandardScaler().fit(X_train)
X_train = scaler.transform(X_train)
X_val = scaler.transform(X_val)
```

**ステップ2：問題の定義**

```python
class HyperParamOptProblem(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop):
        pop = pop.detach().cpu().numpy()
        objs = []
        for C_val, max_iter_val in pop:
            C_val = float(max(1e-3, C_val))
            max_iter_val = int(max(50, max_iter_val))
            model = LogisticRegression(C=C_val, max_iter=max_iter_val, solver='liblinear')
            model.fit(X_train, y_train)
            acc = model.score(X_val, y_val)
            objs.append(1 - acc)  # エラー率
        return torch.tensor(objs)
```

**ステップ3：ワークフローのセットアップ**

```python
from evox.algorithms.so.es_variants import CMAES
from evox.workflows import EvalMonitor, StdWorkflow

prob = HyperParamOptProblem()
init_params = torch.tensor([1.0, 100.0])
print("Initial error rate:", prob.evaluate(init_params.unsqueeze(0)).item())

algo = CMAES(
    mean_init=init_params,
    sigma=1.0,
)

monitor = EvalMonitor()
workflow = StdWorkflow(algo, prob, monitor)
```

**ステップ4：最適化**

```python
workflow.init_step()
for _ in range(100):
    workflow.step()

best_params = monitor.get_best_solution()
best_error = prob.evaluate(best_params.unsqueeze(0)).item()
print("Optimized error rate:", best_error)
```

**サンプル出力**:

```
Initial error rate: 0.0263
Optimized error rate: 0.0088
```

わずか数行のコードで、EvoXはハイパーパラメータチューニングの面倒な試行錯誤を自動化します。

---

これらの実践例は、数学的テスト関数から機械学習ワークフローまで、さまざまなドメインでEvoXを効果的に適用する方法を示しています。基本構造である**Algorithm + Problem + Monitor + Workflow**に慣れれば、ほぼあらゆる最適化タスクに合わせてEvoXを適応させることができます。
