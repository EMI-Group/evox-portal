---
title: "EvoX 1.1 发布：现已支持 torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 引入了全面的 torch.compile (TorchDynamo) 集成，取代了 TorchScript，以获得更好的兼容性和性能。"
---

我们很高兴地宣布 **EvoX 1.1** 正式发布，引入了 **torch.compile (TorchDynamo) 的全面集成**作为后端编译器！此次更新取代了之前的 TorchScript 方法，使 EvoX **更加用户友好，并与更广泛的 Python 生态系统高度兼容**。

通过利用 **torch.compile**，EvoX 现在可以在运行时动态捕获计算图，消除了手动追踪（tracing）的需要，同时自动优化性能。

**有哪些新变化？**

**torch.compile：更智能、更灵活的编译**

在 EvoX 1.1 中，我们全面采用 **torch.compile** 作为新的编译后端。与之前基于追踪的方法不同，torch.compile——其**内部使用 TorchDynamo**——会拦截 Python 执行，动态提取计算图，并实时进行优化。

这意味着：

l  **不再需要手动追踪** —— 只需调用 **torch.compile(workflow.step)**，EvoX 会处理剩下的工作。

l  **无缝的 Python 兼容性** —— 适用于原生 Python 函数以及 NumPy 和 SciPy 等外部库。

l  **更好的性能** —— 优化的计算图带来**更快的执行速度和更好的硬件利用率**。

l  **面向未来的设计** —— 与 PyTorch 的路线图保持一致，确保长期的兼容性和性能提升。

**为什么要从 TorchScript 迁移到 torch.compile？**

在早期版本中，EvoX 依赖于**基于追踪的方法**：

l  **1.0.0 之前** 使用 **JAX tracing** 进行计算图提取。

l  **v1.0.0** 切换到 **TorchScript**，增强了 PyTorch 集成。

然而，这些方法有一些缺点：

l  **使用复杂** —— 用户必须手动追踪图并处理复杂的调试。

l  **兼容性有限** —— 在处理动态工作流和非 PyTorch 函数时遇到困难。

l  **灵活性受限** —— 循环、条件语句和其他 Python 结构并不总能被正确捕获。

有了 torch.compile 和 **TorchDynamo**，**这些问题都消失了**。EvoX 现在进行动态优化，支持更广泛的工作流，**用户无需付出额外努力**。

**EvoX 1.1 如何让您的工作更轻松**

l  **不再为追踪烦恼** —— 一切都在后台发生，使您的代码更整洁，更易于维护。

l  **适用于您现有的 Python 代码** —— 无需为了兼容性修改您的工作流。

l  **执行更快，扩展性更好** —— 受益于 PyTorch 针对 GPU 和 TPU 的最新优化。

l  **面向未来** —— 与 PyTorch 的长期演进保持一致，确保持续的性能增益。

**立即升级到 EvoX 1.1！**

EvoX 1.1 现已正式发布！立即升级，体验**更智能、更快速、更直观**的计算工作流。

**获取 EvoX 1.1**：[GitHub](https://github.com/EMI-Group/EvoX)

有问题或反馈？在 GitHub 上提交 issue 或加入我们的社区讨论。让我们一起拓展**计算智能的边界！**

**源代码 / 社区 / 文档**

论文：[https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub：[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

文档：[https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ 群：297969717

![4.png](/images/articles/evox-1-1-0-1.png)