---
title: "EvoX v1.2.0 发布说明"
pubDate: 2025-04-23
summary: "新特性包括 final_step()、Mujoco Playground 环境、用户教程以及 EvoMO 集成。"
---

**我们很高兴地宣布 "EvoX v1.2.0" 正式发布，此次更新带来了丰富的新功能、改进以及重要的错误修复！**

**本次更新增强了框架关键模块的灵活性和性能**。

**亮点：**

-  新增了 `final_step()` 并更新了 `hpo_wrapper` 和 `std_workflow`，以实现更流畅的执行工作流。

-  引入了 "Mujoco Playground" —— 一个用于强化学习实验的新环境。

-  发布了全新的 [教程](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")，帮助用户快速上手。

-  新增了 EvoX 扩展功能，能够更好地与 [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/") 等兄弟项目集成。

-  修复了各种错误并更新了文档，以提高稳定性和清晰度。

**相关 Pull Requests：**

- MOEA 的文档字符串更新 -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py` 中的 `vmap` 修复 -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  新增 RVEAa 并改进了对 DTLZ、IGD、RVEA 的支持 -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- 工作流模块中的 `final_step()` 更新 -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground 环境 -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  文档优化 -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playground 的错误修复 -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  新用户教程 -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**完整变更日志**：[v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**开源代码 / 社区资源**

论文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上游项目 (EvoX)：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ 群：297969717

![图片11.png](./evox-1-2-0-1.png)

QQ 群 | 演化机器智能