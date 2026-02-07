---
title: "EvoX 中的模块系统"
order: 4
section: "developer"
---

# EvoX 中的模块系统

**模块**是编程中的一个基本概念，指的是一个独立的代码单元，旨在执行特定任务或一组相关任务。

本教程将介绍 EvoX 中的基础模块：`ModuleBase`。

## 模块简介

在[教程](#/tutorial/index)中，我们已经提到了 EvoX 的基本运行流程：

<center><b>初始化算法和问题 -- 设置监视器 -- 初始化工作流 -- 运行工作流</b></center>

此流程需要 EvoX 中的四个基础类：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


为它们提供统一的模块是必要的。在 EvoX 中，这四个类都继承自基础模块 -- `ModuleBase`。

![Module base](/_static/modulebase.png)

## ModuleBase 类

`ModuleBase` 类继承自 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)。

该类中有许多方法，以下是一些重要的方法：

| 方法              | 签名                                                         | 用途                                                         |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__`        | `(self, ...)`                                                | 初始化模块。                                                 |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | 将 `state_dict` 中的参数和缓冲区复制到此模块及其子模块中。它覆盖了 [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)。 |
| `add_mutable`     | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | 在此模块中定义一个可变值，可以通过 `self.[name]` 访问并就地修改。 |

## 模块的作用

在 EvoX 中，`ModuleBase` 可以帮助：

- **包含可变值**

	该模块是面向对象的，可以包含可变值。

- **支持函数式编程**

	通过 `self.state_dict()` 和 `self.load_state_dict(...)` 支持函数式编程模型。

- **标准化初始化**：

	基本上，预定义的子模块（将被添加到此模块并在成员方法中稍后访问）应被视为"非静态成员"，而其他任何成员应被视为"静态成员"。

	非静态成员的模块初始化建议写在重写的 `setup` 方法（或其他成员方法）中，而不是 `__init__` 中。

## 模块的使用

具体来说，在 EvoX 中使用 `ModuleBase` 有以下规则：

### 静态方法

需要 JIT 的静态方法应如下定义：

```Python
# 模块中定义的静态方法示例

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非静态方法

如果一个包含 Python 动态控制流（如 `if`）的方法需要与 `vmap` 一起使用，
请使用 [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) 来显式定义控制流。
