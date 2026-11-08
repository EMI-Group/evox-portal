---
title: "EvoX 1.4.1：一个小修正，为什么会改变搜索"
pubDate: 2026-10-30
summary: "SHADE、差分演化与 CMA-ES 的修复说明，可靠的演化计算基础设施需要同时关注执行效率和算法行为的一致性。"
updatedDate: 2026-11-08
---

一次搜索顺利结束，也可能始终沿着错误的更新规则运行。2026 年 10 月 30 日发布的 EvoX 1.4.1，修正了 SHADE、差分演化与 CMA-ES 中的这类偏差，让适应机制、采样和执行行为回到算法所依赖的定义。

![校准工具将深色搜索轮廓与红色参考线对齐](./algorithm-behavior-calibration.webp)

*让实现与算法预期行为对齐。*

## 程序运行了，搜索却可能不同

SHADE 的 F 与 CR 成功历史记忆此前未能自适应更新。改进量在适应度被替换后才计算，且与填充 NaN 的数组进行算术操作污染了所选数值。修复将改进量计算提前到适应度更新之前，并使用 `torch.where` 选择成功条目。 [SHADE](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3)

差分演化共用的二项交叉算子曾将正态分布随机样本与交叉概率比较。修复改用均匀采样，使其符合概率的含义。相关更新也让 CoDE、SaDE 和 SHADE 在边界内均匀初始化种群。这些变化影响生成什么候选，而不只是程序是否报错。 [DE](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716)

## 数学定义与运行框架约束

CMA-ES 的修复涉及秩一协方差更新、累积常数，以及 `torch.cond` 别名限制造成的运行失败。后者还重新启用了此前被禁用的 CMA-ES 测试。数学公式和执行框架的约束都需要检查，满足其中一个并不自动满足另一个。 [CMA-ES](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)

该版本还处理了演化策略的初始化和子空间、锦标赛选择、PSO 设备转移及超体积计算。 [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1)

## 可靠性也是基础设施的一部分

SHADE 修正还加入了回归测试：运行五步工作流，检查适应记忆确实发生变化，并保持有限值。跨版本比较时，应记录种子、目标、种群和评估预算，再重跑受影响的基线。升级参考可见[版本记录](/zh-cn/releases/evox-1-4-1)。
