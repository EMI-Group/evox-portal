---
title: "EvoXにおけるカスタムアルゴリズムと問題"
order: 5
section: "developer"
---

# EvoXにおけるカスタムアルゴリズムと問題

この章では、EvoXで独自のアルゴリズムと問題を実装する方法を紹介します。

## アルゴリズムと問題のレイアウト

ほとんどの従来のECライブラリでは、アルゴリズムは通常内部で目的関数を呼び出し、以下のようなレイアウトになります：

```
Algorithm
|
+--Problem
```

**しかしEvoXでは、フラットなレイアウトを採用しています：**

```
Algorithm.step -- Problem.evaluate
```

このレイアウトにより、アルゴリズムと問題の両方がより汎用的になります：アルゴリズムは異なる問題を最適化でき、問題も多くのアルゴリズムに適用できます。


## Algorithmクラス

`Algorithm`クラスは`ModuleBase`を継承しています。

**合計で、実装する必要があるメソッドは5つ（うち2つはオプション）です：**

| メソッド       | シグネチャ                               | 用途                                                                                                              |
| ------------ | --------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `__init__` | `(self, ...)`                   | アルゴリズムインスタンスを初期化します。例えば、集団サイズ（反復中は一定）、ハイパーパラメータ（HPO問題ラッパーによってのみ設定されるか、ここで初期化される）、および/またはミュータブルテンソル（実行中に変更可能）。 |
| `step`               | `(self)`                        | アルゴリズムの通常の最適化反復ステップを実行します。 |
| `init_step`（オプション） | `(self)` | アルゴリズムの最適化の最初のステップを実行します。このメソッドがオーバーライドされない場合、代わりに`step`メソッドが呼び出されます。 |

> **注意:**
> 静的な初期化は`__init__`に記述できますが、ミュータブルなサブモジュールの初期化はできません。そのため、オーバーライドされた`setup`メソッドが最初に`ModuleBase`の`setup()`を呼び出す場合、繰り返し初期化のための`setup`の複数回呼び出しが可能です。
>
> `ModuleBase`のそのような`setup`メソッドがアルゴリズムに適さない場合は、独自のアルゴリズムクラスを作成する際に`setup`メソッドをオーバーライドできます。


## Problemクラス

`Problem`クラスも`ModuleBase`を継承しています。

ただし、Problemクラスは非常にシンプルです。**`__init__`メソッドの他に、唯一必要なメソッドは`evaluate`メソッドです。**

| メソッド     | シグネチャ                                   | 用途                                         |
| ---------- | ------------------------------------------- | --------------------------------------------- |
| `__init__` | `(self, ...)`                       | 問題の設定を初期化します。       |
| `evaluate` | `(self, pop: torch.Tensor) -> torch.Tensor` | 与えられた集団の適応度を評価します。 |

ただし、`evaluate`の`pop`引数の型は、オーバーライドされたメソッドで他のJIT互換型に変更できます。


## 例

ここでは、**Sphere問題を解くPSOアルゴリズムの実装**の例を示します。

### 例の擬似コード

以下は擬似コードです：

```text
Set hyper-parameters

Generate the initial population
Do
    Compute fitness

    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

そして、アルゴリズムと問題の各部分がEvoXで何に対応するかを示します。

```text
Set hyper-parameters # Algorithm.__init__

Generate the initial population # Algorithm.setup
Do
    # Problem.evaluate (not part of the algorithm)
    Compute fitness

    # Algorithm.step
    Update the local best fitness and the global best fitness
    Update the velocity
    Update the population

Until stopping criterion
```

### アルゴリズムの例：PSOアルゴリズム

粒子群最適化（PSO）は、鳥や魚の社会的行動に着想を得た集団ベースのメタヒューリスティックアルゴリズムです。連続および離散最適化問題の解決に広く使用されています。

**以下はEvoXでのPSOアルゴリズムの実装例です：**

```python
import torch
from typing import List

from evox.utils import clamp
from evox.core import Parameter, Mutable, Algorithm

class PSO(Algorithm):
    #Initialize the PSO algorithm with the given parameters.
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
        assert lb.shape == ub.shape and lb.ndim == 1 and ub.ndim == 1 and lb.dtype == ub.dtype
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        # Here, Parameter is used to indicate that these values are hyper-parameters
        # so that they can be correctly traced and vector-mapped
        self.w = Parameter(w, device=device)
        self.phi_p = Parameter(phi_p, device=device)
        self.phi_g = Parameter(phi_g, device=device)
        lb = lb[None, :].to(device=device)
        ub = ub[None, :].to(device=device)
        length = ub - lb
        population = torch.rand(self.pop_size, self.dim, device=device)
        population = length * population + lb
        velocity = torch.rand(self.pop_size, self.dim, device=device)
        velocity = 2 * length * velocity - length
        self.lb = lb
        self.ub = ub
        # Mutable parameters
        self.population = Mutable(population)
        self.velocity = Mutable(velocity)
        self.local_best_location = Mutable(population)
        self.local_best_fitness = Mutable(torch.empty(self.pop_size, device=device).fill_(torch.inf))
        self.global_best_location = Mutable(population[0])
        self.global_best_fitness = Mutable(torch.tensor(torch.inf, device=device))

    def step(self):
        # Compute fitness
        fitness = self.evaluate(self.population)

        # Update the local best fitness and the global best fitness
        compare = self.local_best_fitness - fitness
        self.local_best_location = torch.where(
            compare[:, None] > 0, self.population, self.local_best_location
        )
        self.local_best_fitness = self.local_best_fitness - torch.relu(compare)
        self.global_best_location, self.global_best_fitness = self._min_by(
            [self.global_best_location.unsqueeze(0), self.population],
            [self.global_best_fitness.unsqueeze(0), fitness],
        )

        # Update the velocity
        rg = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        rp = torch.rand(self.pop_size, self.dim, dtype=fitness.dtype, device=fitness.device)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )

        # Update the population
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)

    def _min_by(self, values: List[torch.Tensor], keys: List[torch.Tensor]):
        # Find the value with the minimum key
        values = torch.cat(values, dim=0)
        keys = torch.cat(keys, dim=0)
        min_index = torch.argmin(keys)
        return values[min_index], keys[min_index]
```

### 問題の例：Sphere問題

Sphere問題は、最適化アルゴリズムをテストするために使用される、シンプルでありながら基本的なベンチマーク最適化問題です。

Sphere関数は以下のように定義されます：

$$
\min f(x)= \sum_{i=1}^{n} x_{i}^{2}
$$
**以下はEvoXでのSphere問題の実装例です：**

```python
import torch

from evox.core import Problem

class Sphere(Problem):
    def __init__(self):
        super().__init__()

    def evaluate(self, pop: torch.Tensor):
        return (pop**2).sum(-1)
```

これで、ワークフローを初期化して実行できます。
