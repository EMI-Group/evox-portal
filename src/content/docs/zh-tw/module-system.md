---
title: "在 EvoX 中使用模組"
order: 4
section: "developer"
---

# 在 EvoX 中使用模組

**模組**是程式設計中的一個基本概念，指的是一個自包含的程式碼單元，設計用於執行特定任務或一組相關任務。

本筆記本將介紹 EvoX 中的基本模組：`ModuleBase`。

## 模組簡介

在[教學](#/tutorial/index)中，我們提到了 EvoX 中的基本執行流程：

<center><b>初始化演算法和問題 -- 設定監控器 -- 初始化工作流程 -- 執行工作流程</b></center>

此流程需要 EvoX 中的四個基本類別：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


有必要為它們提供一個統一的模組。在 EvoX 中，這四個類別都繼承自基底模組 — `ModuleBase`。

![Module base](/_static/modulebase.png)

## ModuleBase 類別

`ModuleBase` 類別繼承自 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)。

此類別中有許多方法，以下是一些重要的方法：

| 方法            | 簽名                                                    | 用途                                                        |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | 初始化模組。                                       |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | 將 `state_dict` 中的參數和緩衝區複製到此模組及其子模組中。它覆寫了 [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)。 |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | 在此模組中定義一個可變值，可透過 `self.[name]` 存取並就地修改。 |

## 模組的角色

在 EvoX 中，`ModuleBase` 可以幫助：

- **包含可變值**

	此模組是一個物件導向的模組，可以包含可變值。

- **支援函數式程式設計**

	透過 `self.state_dict()` 和 `self.load_state_dict(...)` 支援函數式程式設計模型。

- **標準化初始化**：

	基本上，預定義的子模組（將被新增到此模組並在成員方法中稍後存取）應被視為「非靜態成員」，而任何其他成員應被視為「靜態成員」。

	非靜態成員的模組初始化建議寫在覆寫的 `setup` 方法（或任何其他成員方法）中，而非 `__init__` 中。

## 模組的使用

具體來說，在 EvoX 中使用 `ModuleBase` 有一些規則：

### 靜態方法

要進行 JIT 的靜態方法應定義如下：

```Python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非靜態方法

如果一個包含 Python 動態控制流（如 `if`）的方法要與 `vmap` 一起使用，
請使用 [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) 來明確定義控制流。
