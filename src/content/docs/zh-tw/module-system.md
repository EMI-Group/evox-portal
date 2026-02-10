---
title: "在 EvoX 中使用 Module"
order: 4
section: "developer"
---

# 在 EvoX 中使用 Module

**Module（模組）** 是程式設計中的一個基本概念，指的是一個獨立的程式碼單元，旨在執行特定任務或一組相關任務。

本筆記將介紹 EvoX 中的基礎 Module：`ModuleBase`。

## Module 簡介

在 [教學](#/tutorial/index) 中，我們提到了 EvoX 的基本執行流程：

<center><b>初始化演算法和問題 -- 設定監控器 -- 初始化工作流 -- 執行工作流</b></center>

這個過程需要 EvoX 中的四個基本類別：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


有必要為它們提供一個統一的 Module。在 EvoX 中，這四個類別都繼承自基礎 Module —— `ModuleBase`。

![Module 基礎](/_static/modulebase.png)

## ModuleBase 類別

`ModuleBase` 類別繼承自 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)。

這個類別中有許多方法，以下是一些重要的方法：

| 方法 | 簽章 | 用法 |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__` | `(self, ...)` | 初始化 Module。 |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | 將參數和緩衝區從 `state_dict` 複製到此 Module 及其子 Module 中。它覆寫了 [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)。 |
| `add_mutable` | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | 在此 Module 中定義一個可變數值，該數值可以透過 `self.[name]` 存取並進行原地（in-place）修改。 |

## Module 的作用

在 EvoX 中，`ModuleBase` 可以協助：

- **包含可變數值**

	此 Module 是一個物件導向的模組，可以包含可變數值。

- **支援函數式程式設計**

	透過 `self.state_dict()` 和 `self.load_state_dict(...)` 支援函數式程式設計模型。

- **標準化初始化**：

	基本上，將被**加入**到此 Module 並在稍後的成員方法中存取的預定義子 Module（submodule），應被視為「非靜態成員」，而任何其他成員應被視為「靜態成員」。

	建議將非靜態成員的 Module 初始化寫在覆寫的 `setup` 方法（或其他成員方法）中，而不是 `__init__` 中。

## Module 的用法

具體來說，在 EvoX 中使用 `ModuleBase` 有一些規則：

### 靜態方法

需要進行 JIT 編譯的靜態方法應定義如下：

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非靜態方法

如果帶有 Python 動態控制流（如 `if`）的方法要與 `vmap` 一起使用，
請使用 [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) 來明確定義控制流。