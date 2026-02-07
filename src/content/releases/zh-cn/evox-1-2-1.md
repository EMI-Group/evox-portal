---
title: "EvoX v1.2.1 版本说明"
pubDate: 2025-05-13
summary: "稳定性改进，新增基准函数（Ellipsoid、Griewank）及错误修复。"
---

这是一个专注于提升稳定性和修复错误的小版本更新，同时包含一些便利性改进。

**新功能**

新增基准函数：添加了单目标数值函数：`Ellipsoid` 和 `Griewank`。

**错误修复**

* 修复了 `StdWorkflow` 无法与继承自其他算法的算法配合使用的问题。

* 修正了 `latin_hypercube_sampling_standard` 函数中的错误。

* 解决了 `non_dominate` 在 `torch.compile` 下失败的问题。

* 修正了 `PSO` 在某些情况下未正确使用默认设备的问题。

**重构与维护**

* 将常用工具重新导出到顶层以方便使用，例如：

* 使用 `evox.compile` 代替 `evox.core.compile`

* 使用 `evox.vmap` 代替 `evox.core.vmap`。

* 移除了已弃用或冗余的代码。

完整更新日志：[https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**开源代码 / 社区资源**

论文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游项目（EvoX）：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ群：297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ群 | Evolving Machine Intelligence
