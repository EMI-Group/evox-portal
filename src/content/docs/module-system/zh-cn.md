---
title: "在 EvoX 中使用 Module"
order: 4
section: "developer"
---

# 在 EvoX 中使用 Module

**模块**（Module）是编程中的一个基本概念，指的是一个独立的、旨在执行特定任务或一组相关任务的代码单元。

本 notebook 将介绍 EvoX 中的基础模块：`ModuleBase`。

## Module 简介

在 [教程](/zh-cn/tutorials) 中，我们提到了 EvoX 的基本运行流程：

<center><b>初始化算法和问题 -- 设置监视器 -- 初始化工作流 -- 运行工作流</b></center>

这个过程需要 EvoX 中的四个基本类：

- `Algorithm`
- `Problem`
- `Monitor`
- `Workflow`


有必要为它们提供一个统一的模块。在 EvoX 中，这四个类都继承自基础模块 —— `ModuleBase`。

![Module base](/_static/modulebase.png)

## ModuleBase 类

`ModuleBase` 类继承自 [`torch.nn.Module`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#)。

该类中有许多方法，其中一些重要方法如下：

| 方法 | 签名 | 用法 |
| ----------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| `__init__` | `(self, ...)` | 初始化模块。 |
| `load_state_dict` | `(self, state_dict: Mapping[str, torch.Tensor], copy: bool = False, ...)` | 将参数和缓冲区从 `state_dict` 复制到此模块及其后代中。它重写了 [`torch.nn.Module.load_state_dict`](https://pytorch.org/docs/stable/generated/torch.nn.Module.html#torch.nn.Module.load_state_dict)。 |
| `add_mutable` | `(self, name: str, value: Union[torch.Tensor \| nn.Module, Sequence[torch.Tensor \| nn.Module], Dict[str, torch.Tensor \| nn.Module]]) -> None` | 在此模块中定义一个可变值，可以通过 `self.[name]` 访问并进行原地修改。 |

## Module 的作用

在 EvoX 中，`ModuleBase` 可以帮助：

- **包含可变值**

	该模块是一个面向对象的模块，可以包含可变值。

- **支持函数式编程**

	通过 `self.state_dict()` 和 `self.load_state_dict(...)` 支持函数式编程模型。

- **标准化初始化**：

	基本上，将被**添加**到此模块并在稍后的成员方法中访问的预定义子模块应被视为“非静态成员”，而任何其他成员应被视为“静态成员”。

	建议将非静态成员的模块初始化写在重写的 `setup` 方法（或任何其他成员方法）中，而不是 `__init__` 中。

## Module 的用法

具体来说，在 EvoX 中使用 `ModuleBase` 有一些规则：

### 静态方法

需要进行 JIT（即时编译）的静态方法应定义如下：

```python
# One example of the static method defined in a Module

@jit
def func(x: torch.Tensor, y: torch.Tensor) -> torch.Tensor:
    return x + y
```
### 非静态方法

如果带有 Python 动态控制流（如 `if`）的方法要与 `vmap` 一起使用，
请使用 [`torch.cond`](https://pytorch.org/docs/main/generated/torch.cond.html#torch.cond) 显式定义控制流。