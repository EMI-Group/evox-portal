---
title: "EvoX 快速入门：只需 10 分钟即可运行 GPU 加速的演化计算"
pubDate: 2025-04-30
summary: "一份新手教程，带您在 10 分钟内上手使用 EvoX 进行 GPU 加速的演化计算。"
---

一方面，演化计算在现实世界的研究和工程中极其强大，但难以调用。另一方面，GPU 的能力日益强大，但难以在演化计算任务中发挥其威力。

我们需要一个真正现代化的解决方案：原生 GPU 支持、模块化架构、清晰的接口、开箱即用以及可定制的扩展性。这就是 EvoX —— 面向未来的演化计算引擎。

为了帮助用户快速上手，EvoX 团队发布了《EvoX 新手教程》。该教程共包含 8 章，涵盖了从基础知识到高级实际应用的方方面面，一步步指导您如何在 GPU 上运行演化算法。

## 完整教程资源

中文在线教程：

[EvoX 新手教程 - EvoX 文档](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

中文 PDF 教程：

请加入 QQ 群获取：297969717

接下来，我们将带您在短短 10 分钟内完成从安装到运行的全过程。

## 第一步：环境设置

打开终端并创建一个干净的 Python 环境：

![代码片段1.png](./quickstart-1.png)

您也可以使用您喜欢的工具来创建一个干净的 Python 环境。

## 第二步：安装 PyTorch 和 EvoX

![代码片段2.png](./quickstart-2.png)

检查 GPU 是否可用：

![代码片段3.png](./quickstart-3.png)

## 第三步：运行您的第一个演化算法

**![代码片段4.png](./quickstart-4.png)![图片2.4.png](./quickstart-5.png)**

这是做什么的？它通过标准接口组合了一个算法（PSO）、一个问题（Ackley）和一个监控器（EvalMonitor）。EvoX 负责所有的并行化、加速和监控！

## 第四步：绘制收敛曲线

只需要一行代码：

![代码片段5.png](./quickstart-6.png "代码片段5.png")

![monitor_output.png](./quickstart-7.png)

看到那条下降的曲线了吗？那是**您的演化算法接近目标的轨迹**，也是**它探索未知世界的路径。**

## 第五步：尝试扩展

如果“仅仅运行一个 Ackley”不能满足您，您可以：

· 将 PSO 替换为 GA, DE, CMA-ES, NSGA-II, RVEA...
 · 将 Ackley 替换为 Rastrigin, Griewank, CEC2022
 · 通过设置 n_objs >= 2 切换到多目标问题
 · 使用 MyProblem 和 MyAlgorithm 实现您自己的逻辑
 · 挂接到 PyTorch 模型或强化学习环境（Gym, Brax, MuJoCo Playground）

无论是超参数调优、架构搜索、神经演化还是控制策略优化，EvoX 都能轻松应对。

## 为什么选择 EvoX？

![表格-英文.png](./quickstart-8.png "表格-英文.png")



## 致谢

本教程由 **Boqing Xu**、**Xinmeng Yu**、**Bowen Zheng** 和 **Xinyao Li** 编写。**Beichen Huang** 负责教程的整理、编辑和在线发布。

我们衷心感谢 EvoX 社区的每一位成员。正是我们的共同努力，让 EvoX 能够不断演化。

## 开源代码 / 社区资源

论文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游项目 (EvoX)：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 群：297969717

![图片11.png](./evox-1-1-0-1.png)

QQ 群 | 演化机器智能

EvoMO 构建于 EvoX 框架之上。如果您有兴趣了解更多关于 EvoX 的信息，欢迎查看我们在微信公众号上发布的关于 EvoX 1.0 的官方文章以获取更多详情。

![image.png](./metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))