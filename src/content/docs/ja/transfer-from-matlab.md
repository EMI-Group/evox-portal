---
title: "MATLAB から PyTorch および EvoX への移行"
order: 18
section: "misc"
---

# MATLAB から PyTorch および EvoX への移行

このドキュメントは、MATLAB ユーザーが進化計算のために PyTorch や EvoX へ移行する際のガイドとなることを目的としています。構文、データ構造、ワークフローの観点から、MATLAB と PyTorch の主な違いを解説します。その後、MATLAB と PyTorch の両方で粒子群最適化（PSO）の例を用いて、これらの違いを説明します。

## 構文の違い

### 配列の作成とインデックス

#### MATLAB

- 1 始まりのインデックス（1-based indexing）を使用します。
- ベクトルや行列は、角括弧とセミコロンを使用して宣言します（例：`[1 2 3; 4 5 6]`）。`rand()` によるランダム初期化は、区間 $[0, 1)$ の値を返します。
- スライスは `(start:end)` 構文を使用し、1 始まりのインデックスを利用します。

#### PyTorch

- 0 始まりのインデックス（0-based indexing）を使用します。
- 配列（テンソル）は通常、`torch.rand()`、`torch.zeros()` などのコンストラクタを使用するか、Python のリストを `torch.tensor()` で変換して作成します。
- スライスは `[start:end]` を使用し、0 始まりのインデックスで行います。

### 行列計算

#### MATLAB

- 線形代数の行列乗算は `*` で行います。
- 同じサイズの行列の対応する要素同士を乗算するには `.*` を使用します。
- `/` は行列の右除算を表します。
- `.^` は要素ごとのべき乗を表します。
- 長さが 1 のテンソルの末尾および先頭の次元は **無視** されます。
- 要素ごとの演算においてブロードキャスト可能な次元を自動的に見つけ、**暗黙的** な次元拡張を行います。

#### PyTorch

- 線形代数の行列乗算は `@` または `torch.matmul()` で行います。
- 同じ形状またはブロードキャスト可能な形状のテンソルの対応する要素同士を乗算するには、直接 `*` を使用します。
- `/` は要素ごとの除算を表します。
- `**` は要素ごとのべき乗を表します。
- 長さが 1 のテンソルの次元は **保持** され、**ブロードキャスト次元** として扱われます。
- ほとんどの暗黙的な次元拡張は **防止** され、通常はブロードキャスト次元が必要です。

### 関数と定義

#### MATLAB

- 関数は `function` キーワードで定義されます。
- 1つのファイルに複数の関数を含めることができますが、通常、主要な関数はファイル名と同じ名前になります。
- 無名関数（例：`@(x) sum(x.^2)`）は、短いインライン計算に使用されます。

#### PyTorch

- 関数は `def` キーワードを使用して定義され、通常は単一の `.py` ファイルまたはモジュール内に記述されます。
- クラスは、オブジェクト指向の方法でデータとメソッドをカプセル化するために使用されます。
- ラムダ式は短い無名関数（`lambda x: x.sum()`）として機能しますが、複数行のラムダ式は許可されていません。

### 制御フロー

#### MATLAB

- 1 始まりのインデックスで `for i = 1:N` ... `end` ループを使用します。
- `if`、`elseif`、`else` などの条件文を使用します。

#### PyTorch

- 0 始まりのインデックスで `for i in range(N):` を使用します。
- ループや条件文のスコープにはインデントが重要です（`end` キーワードはありません）。

### 出力とコメント

#### MATLAB

- フォーマットされた出力には `fprintf()` 関数を使用します。
- 単一行コメントには `%` を使用します。

#### PyTorch

- フォーマットされた出力には f-string を用いた `print` を使用します。
- 単一行コメントには `#` を使用します。

### 複数行コーディング

#### MATLAB

- 行末に `...` を使用して、次の行が同じ行として扱われることを示します。
#### Python

- 行末に `\` を使用して、次の行が同じ行として扱われることを示します。
- 括弧内に複数行がある場合、特定の行末記号は不要です。

## EvoX で進化計算アルゴリズムを書くには？

### MATLAB

PSO アルゴリズムの MATLAB コード例は以下の通りです。
```matlab
function [] = example_pso()
    pso = init_pso(100, [-10, -10], [10, 10], 0.6, 2.5, 0.8);
    test_fn = @(x) (sum(x .* x, 2));
    for i = 1:20
        pso = step_pso(pso, test_fn);
        fprintf("Iteration = %d, global best = %f\n", i, pso.global_best_fitness);
    end
end


function [self] = init_pso(pop_size, lb, ub, w, phi_p, phi_g)
    self = struct();
    self.pop_size = pop_size;
    self.dim = length(lb);
    self.w = w;
    self.phi_p = phi_p;
    self.phi_g = phi_g;
    % setup
    range = ub - lb;
    population = rand(self.pop_size, self.dim);
    population = range .* population + lb;
    velocity = rand(self.pop_size, self.dim);
    velocity = 2 .* range .* velocity - range;
    self.lb = lb;
    self.ub = ub;
    % mutable
    self.population = population;
    self.velocity = velocity;
    self.local_best_location = population;
    self.local_best_fitness = Inf(self.pop_size, 1);
    self.global_best_location = population(1, :);
    self.global_best_fitness = Inf;
end


function [self] = step_pso(self, evaluate)
    % Evaluate
    fitness = evaluate(self.population);
    % Update the local best
    compare = find(self.local_best_fitness > fitness);
    self.local_best_location(compare, :) = self.population(compare, :);
    self.local_best_fitness(compare) = fitness(compare);
    % Update the global best
    values = [self.global_best_location; self.population];
    keys = [self.global_best_fitness; fitness];
    [min_val, min_index] = min(keys);
    self.global_best_location = values(min_index, :);
    self.global_best_fitness = min_val;
    % Update velocity and position
    rg = rand(self.pop_size, self.dim);
    rp = rand(self.pop_size, self.dim);
    velocity = self.w .* self.velocity ...
        + self.phi_p .* rp .* (self.local_best_location - self.population) ...
        + self.phi_g .* rg .* (self.global_best_location - self.population);
    population = self.population + velocity;
    self.population = min(max(population, self.lb), self.ub);
    self.velocity = min(max(velocity, self.lb), self.ub);
end
```
MATLAB では、関数 `init_pso()` がアルゴリズムを初期化し、別の関数 `step_pso()` が反復ステップを実行します。そして、メイン関数 `example_pso()` がループ全体を制御します。

### EvoX
EvoX では、以下の方法で PSO アルゴリズムを構築できます。

まず、EvoX と PyTorch から必要なモジュールと関数をインポートすることをお勧めします。
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

次に、「構文の違い」セクションに従って、MATLAB コードを対応する Python コードに変換できます。
```python
def main():
    pso = PSO(pop_size=10, lb=torch.tensor([-10.0, -10.0]), ub=torch.tensor([10.0, 10.0]))
    wf = StdWorkflow()
    wf.setup(algorithm=pso, problem=Sphere())
    for i in range(1, 21):
        wf.step()
        print(f"Iteration = {i}, global best = {wf.algorithm.global_best_fitness}")

@jit_class
class PSO(Algorithm):
    def __init__(self, pop_size, lb, ub, w=0.6, phi_p=2.5, phi_g=0.8):
        super().__init__()
        self.pop_size = pop_size
        self.dim = lb.shape[0]
        self.w = w
        self.phi_p = phi_p
        self.phi_g = phi_g
        # setup
        lb = lb.unsqueeze(0)
        ub = ub.unsqueeze(0)
        range = ub - lb
        population = torch.rand(self.pop_size, self.dim)
        population = range * population + lb
        velocity = torch.rand(self.pop_size, self.dim)
        velocity = 2 * range * velocity - range
        self.lb = lb
        self.ub = ub
        # mutable
        self.population = population
        self.velocity = velocity
        self.local_best_location = population
        self.local_best_fitness = torch.full((self.pop_size,), fill_value=torch.inf)
        self.global_best_location = population[0, :]
        self.global_best_fitness = torch.tensor(torch.inf)

    def step(self):
        # Evaluate
        fitness = self.evaluate(self.population)
        # Update the local best
        compare = self.local_best_fitness > fitness
        self.local_best_location = torch.where(compare.unsqueeze(1), self.population, self.local_best_location)
        self.local_best_fitness = torch.where(compare, fitness, self.local_best_fitness)
        # Update the global best
        values = torch.cat([self.global_best_location.unsqueeze(0), self.population], dim=0)
        keys = torch.cat([self.global_best_fitness.unsqueeze(0), fitness], dim=0)
        min_index = torch.argmin(keys)
        self.global_best_location = values[min_index]
        self.global_best_fitness = keys[min_index]
        # Update velocity and position
        rg = torch.rand(self.pop_size, self.dim)
        rp = torch.rand(self.pop_size, self.dim)
        velocity = (
            self.w * self.velocity
            + self.phi_p * rp * (self.local_best_location - self.population)
            + self.phi_g * rg * (self.global_best_location - self.population)
        )
        population = self.population + velocity
        self.population = clamp(population, self.lb, self.ub)
        self.velocity = clamp(velocity, self.lb, self.ub)


# Run the main function
if __name__ == "__main__":
    main()
```

> **注:**
> MATLAB では行列やベクトルを特定の次元に沿って連結するために `[]` と `;` や `,` を使用しますが、EvoX では `torch.cat` を呼び出す際に引数 `dim` で連結次元を指定する必要がある点に注意してください。
> さらに、PyTorch では連結するテンソルは同じ次元数を持つ必要があります。そのため、最初の次元の前に長さ 1 の新しい次元を追加するために、追加の `XXX.unsqueeze(0)` が適用されています。

EvoX では、PSO のロジックは `Algorithm` を継承したクラス内にカプセル化されます。このオブジェクト指向設計により、状態管理と反復が簡素化され、以下の利点がもたらされます。
- 継承された `evaluate()` メソッド
    各反復で目的関数を手動で渡すのではなく、`self.evaluate(self.population)` を呼び出すだけで適応度を計算できます。
- 組み込みワークフローとの統合
    PSO クラスをワークフロー `StdWorkflow` に登録すると、ワークフローが代わりに `step()` の反復呼び出しを処理します。

`Algorithm` を拡張することで、`__init__()` は標準的な Python クラスのコンストラクタ内で、すべての主要な PSO コンポーネント（個体群、速度、局所/大域最良解など）をセットアップします。