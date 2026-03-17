---
title: "EvoX v1.1.1 发布说明"
pubDate: 2025-03-16
summary: "修复了 torch.compile 图捕获、use_state 图中断以及 BatchedTensor 泄漏等问题。"
---

**变更内容**

**本次小版本发布主要包含错误修复和改进：**

- 修复了 `torch.compile` 无法正确捕获 `workflow.step` 的问题。

- 修复了 `use_state` 导致图中断（graph break）的问题。

- 修复了一些模型缓冲区（buffer）使用不当的问题。

- 修复了 `monitor.plot` 功能未按预期工作的问题。

- 引入了一个新的包装器 `evox.compile`，以绕过 `torch.compile` 和 `torch.vmap` 的某些限制。

- 解决了多个与 `BatchedTensor` 相关的问题：修复了对带有 `EvalMonitor` 的工作流应用 vmap 时可能导致 `BatchedTensor` 泄漏的错误。

- 修复了导致 `HPOProblem` 无法与 `BraxProblem` 协同工作的问题。

- 增强了 `RVEA` 和 `CSO` 的实现，以获得更好的性能和可靠性。

- 增强了 `BraxProblem` 的实现。

- 各种小的修复和改进。

**开源代码与社区**

**论文**：[https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**：[https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**上游项目 (EvoX)**：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ 群**：297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQ 群 | 演化机器智能