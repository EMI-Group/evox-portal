---
title: "EvoXにおけるモジュールの操作"
order: 4
section: "developer"
---

# EvoXにおけるモジュールの操作

**モジュール**はプログラミングにおける基本的な概念であり、特定のタスクまたは関連するタスクのセットを実行するために設計された自己完結型のコード単位を指します。

このノートブックでは、EvoXの基本モジュールである`ModuleBase`を紹介します。

## モジュールの紹介

[チュートリアル](#/tutorial/index)では、EvoXの基本的な実行プロセスについて説明しました：

<center><b>アルゴリズムと問題を初期化 -- モニターを設定 -- ワークフローを初期化 -- ワークフローを実行</b></center>

このプロセスには、EvoXの4つの基本クラスが必要です：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


これらに統一されたモジュールを提供する必要があります。EvoXでは、4つのクラスはすべて基本モジュール`ModuleBase`を継承しています。

![Module base](/_static/modulebase.png)

## ModuleBaseクラス

`ModuleBase`クラスは[`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)を継承しています。

このクラスには多くのメソッドがあり、重要なメソッドは以下の通りです：

| メソッド            | シグネチャ                                                    | 用途                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | モジュールを初期化します。                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | `state_dict`からこのモジュールとその子孫にパラメータとバッファをコピーします。[`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)をオーバーライドしています。 |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | このモジュールにミュータブルな値を定義します。`self.[name]`でアクセスでき、インプレースで変更できます。 |

## モジュールの役割

EvoXでは、`ModuleBase`は以下のことに役立ちます：

- **ミュータブルな値の保持**

	このモジュールはオブジェクト指向であり、ミュータブルな値を保持できます。

- **関数型プログラミングのサポート**

	`self.state_dict()`と`self.load_state_dict(...)`を介して関数型プログラミングモデルがサポートされています。

- **初期化の標準化**:

	基本的に、このモジュールに追加され、後でメンバーメソッドでアクセスされる事前定義されたサブモジュールは「非静的メンバー」として扱われ、その他のメンバーは「静的メンバー」として扱われるべきです。

	非静的メンバーのモジュール初期化は、`__init__`ではなく、オーバーライドされた`setup`メソッド（または他のメンバーメソッド）に記述することを推奨します。

## モジュールの使用方法

具体的に、EvoXで`ModuleBase`を使用するためのいくつかのルールがあります：

### 静的メソッド

JIT対象の静的メソッドは以下のように定義します：

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非静的メソッド

`if`のようなPythonの動的制御フローを持つメソッドを`vmap`で使用する場合は、[`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond)を使用して制御フローを明示的に定義してください。
