---
title: "EvoXでのModuleの扱い方"
order: 4
section: "developer"
---

# EvoXでのModuleの扱い方

**Module**（モジュール）はプログラミングにおける基本的な概念であり、特定のタスクや関連する一連のタスクを実行するために設計された、自己完結型のコード単位を指します。

このノートブックでは、EvoXにおける基本的なモジュールである `ModuleBase` について紹介します。

## Moduleの紹介

[チュートリアル](#/tutorial/index)では、EvoXにおける基本的な実行プロセスについて触れました：

<center><b>アルゴリズムと問題を初期化 -- モニターを設定 -- ワークフローを初期化 -- ワークフローを実行</b></center>

このプロセスには、EvoXの4つの基本的なクラスが必要です：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


これらに統一されたモジュールを提供する必要があります。EvoXでは、これら4つのクラスはすべてベースモジュールである `ModuleBase` を継承しています。

![Module base](/_static/modulebase.png)

## ModuleBaseクラス

`ModuleBase` クラスは [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#) を継承しています。

このクラスには多くのメソッドがありますが、重要なメソッドを以下に示します：

| メソッド          | シグネチャ                                                   | 用途                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | モジュールを初期化します。                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | パラメータとバッファを `state_dict` からこのモジュールとその子孫にコピーします。これは [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict) をオーバーライドします。 |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | このモジュール内で、`self.[name]` を介してアクセスでき、インプレースで変更可能なミュータブルな値を定義します。 |

## Moduleの役割

EvoXにおいて、`ModuleBase` は以下のことに役立ちます：

- **ミュータブルな値を保持する**

	このモジュールは、ミュータブル（可変）な値を保持できるオブジェクト指向のモジュールです。

- **関数型プログラミングをサポートする**

	関数型プログラミングモデルは、`self.state_dict()` と `self.load_state_dict(...)` を介してサポートされます。

- **初期化を標準化する**:

	基本的に、このモジュールに**追加**され、後でメンバーメソッド内でアクセスされる定義済みのサブモジュールは「非静的メンバー（non-static members）」として扱われるべきであり、その他のメンバーは「静的メンバー（static members）」として扱われるべきです。

	非静的メンバーのモジュール初期化は、`__init__` ではなく、オーバーライドされた `setup` メソッド（またはその他のメンバーメソッド）に記述することが推奨されます。

## Moduleの使用法

具体的には、EvoXで `ModuleBase` を使用するためのいくつかのルールがあります：

### 静的メソッド

JITコンパイルされる静的メソッドは、以下のように定義する必要があります：

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非静的メソッド

`if` のようなPythonの動的制御フローを持つメソッドを `vmap` と共に使用する場合は、[`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) を使用して制御フローを明示的に定義してください。