---
title: "MATLABからPyTorchとEvoXへの移行"
order: 18
section: "misc"
---

# MATLABからPyTorchとEvoXへの移行

このドキュメントは、MATLABユーザーが進化計算のためにPyTorchとEvoXに移行するためのガイドです。構文、データ構造、ワークフローの観点から、MATLABとPyTorchの主要な違いを強調します。次に、MATLABとPyTorchの両方での粒子群最適化（PSO）の例を使用して、これらの違いを説明します。

## 構文の違い

### 配列の作成とインデックス

#### MATLAB

- 1ベースのインデックスを使用します。
- ベクトルと行列は角括弧とセミコロンを使用して宣言されます（例：`[1 2 3; 4 5 6]`）。`rand()`によるランダム初期化は区間$[0, 1)$の値を返します。
- スライスは`(start:end)`構文を使用し、1ベースのインデックスを利用します。

#### PyTorch

- 0ベースのインデックスを使用します。
- 配列（テンソル）は通常、`torch.rand()`、`torch.zeros()`などのコンストラクタ、またはPythonリストを`torch.tensor()`でテンソルに変換して作成されます。
- スライスは0ベースのインデックスで`[start:end]`を使用して行われます。

### 行列計算

#### MATLAB

- `*`で線形代数的な行列乗算を実行します。
- `.*`を使用して同じサイズの行列の対応する要素を乗算します。
- `/`は行列の右除算を表します。
- `.^`は要素ごとのべき乗を表します。
- 長さ1の末尾および先頭の次元は**無視**されます。
- 要素ごとの演算のためにブロードキャスト可能な次元を自動的に見つけ、**暗黙的な**次元拡張を実行します。

#### PyTorch

- `@`または`torch.matmul()`で線形代数的な行列乗算を実行します。
- `*`を直接使用して、同じ形状またはブロードキャスト可能な形状のテンソルの対応する要素を乗算します。
- `/`は要素ごとの除算を表します。
- `**`は要素ごとのべき乗を表します。
- 長さ1の次元は**保持**され、**ブロードキャスト次元**として扱われます。
- ほとんどの暗黙的な次元拡張を**防止**し、通常ブロードキャスト次元が必要です。

### 関数と定義

#### MATLAB

- 関数は`function`キーワードで定義されます。
- ファイルには複数の関数を含めることができますが、通常、主要な関数はファイル名を共有します。
- 無名関数（例：`@(x) sum(x.^2)`）は短いインライン計算に使用されます。

#### PyTorch

- 関数はdefキーワードを使用して定義され、通常は単一の`.py`ファイルまたはモジュール内にあります。
- クラスはオブジェクト指向の方法でデータとメソッドをカプセル化するために使用されます。
- ラムダは短い無名関数として機能します（`lambda x: x.sum()`）が、複数行のラムダは許可されていません。

### 制御フロー

#### MATLAB

- `for i = 1:N` ... `end`ループを1ベースのインデックスで使用します。
- `if`、`elseif`、`else`などの条件文。

#### PyTorch

- `for i in range(N):`を0ベースのインデックスで使用します。
- ループと条件文のスコープにはインデントが重要です（`end`キーワードなし）。

### 出力とコメント

#### MATLAB

- フォーマットされた出力には`fprintf()`関数を使用します。
- 単一行コメントには`%`を使用します。

#### PyTorch

- フォーマットされた出力にはf文字列付きの`print`を使用します。
- 単一行コメントには`#`を使用します。

### 複数行コーディング

#### MATLAB

- 行の末尾に`...`を使用して、次の行が同じ行として扱われることを示します。
#### Python

- 行の末尾に`\`を使用して、次の行が同じ行として扱われることを示します。
- 複数行が括弧内にある場合、特定の末尾記号は不要です。

## EvoXで進化計算アルゴリズムを書く方法

### MATLAB

PSOアルゴリズムのMATLABコード例は以下の通りです：
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
MATLABでは、関数`init_pso()`がアルゴリズムを初期化し、別の関数`step_pso()`が反復ステップを実行し、メイン関数`example_pso()`がループを制御します。

### EvoX
EvoXでは、以下の方法でPSOアルゴリズムを構築できます：

まず、EvoXとPyTorchから必要なモジュールと関数をインポートすることを推奨します。
```python
import torch

from evox.core import *
from evox.utils import *
from evox.workflows import *
from evox.problems.numerical import Sphere
```

次に、「構文の違い」セクションに従って、MATLABコードを対応するPythonコードに変換できます。
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

> **注意:**
> MATLABでは`[]`と`;`、`,`を使用して特定の次元に沿って行列やベクトルを連結しますが、EvoXでは`torch.cat`を引数`dim`付きで呼び出して連結次元を指定する必要があることに注意してください。
> さらに、PyTorchでは連結されるテンソルは同じ次元数を持つ必要があるため、最初の次元の前に長さ1の新しい次元を追加するために追加の`XXX.unsqueeze(0)`が適用されます。

EvoXでは、PSOロジックは`Algorithm`を継承するクラス内にカプセル化されています。このオブジェクト指向設計は状態管理と反復を簡素化し、以下の利点を導入します：
- 継承された`evaluate()`メソッド
    各反復で目的関数を手動で渡す代わりに、`self.evaluate(self.population)`を呼び出すだけで適応度値を計算できます。
- 組み込みワークフロー統合
    PSOクラスをワークフロー`StdWorkflow`に登録すると、`step()`の反復呼び出しを代行してくれます。

`Algorithm`を拡張することで、`__init__()`は標準的なPythonクラスコンストラクタですべての主要なPSOコンポーネント（集団、速度、ローカル/グローバルベストなど）をセットアップします。
