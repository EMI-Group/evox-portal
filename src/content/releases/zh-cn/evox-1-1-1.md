---
title: "EvoX v1.1.1 版本说明"
pubDate: 2025-03-16
summary: "修复 torch.compile 图捕获、use_state 图中断和 BatchedTensor 泄漏等问题。"
---

**更新内容**

**此次小版本更新主要包含错误修复和改进：**

- 修复了 `torch.compile` 未能正确捕获 `workflow.step` 的问题。

- 修复了 `use_state` 导致图中断的问题。

- 修复了一些不正确的模型缓冲区使用。

- 修复了 monitor.plot 未按预期工作的问题。

- 引入了新的包装器 `evox.compile`，以解决 `torch.compile` 和 `torch.vmap` 的某些限制。

- 解决了多个 `BatchedTensor` 相关问题：- 修复了对带有 EvalMonitor 的工作流进行 vmapping 时可能导致 BatchedTensor 泄漏的错误。

- 修复了 HPOProblem 无法与 BraxProblem 配合使用的问题。

- 增强了 RVEA 和 CSO 的实现，提升了性能和可靠性。

- 增强了 BraxProblem 的实现。

- 其他各种小修复和改进。

**开源代码与社区**

**论文**：[https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**：[https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**上游项目（EvoX）**：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ群**：297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQ群 | Evolving Machine Intelligence
