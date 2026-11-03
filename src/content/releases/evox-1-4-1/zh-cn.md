---
title: "EvoX v1.4.1 发布说明"
pubDate: 2026-10-30
summary: "修复 CMA-ES、DE 变体、PSO、演化策略、锦标赛选择和超体积计算中的问题。"
---

**EvoX v1.4.1** 修复稳定版 1.x 系列中的算法正确性与运行问题。

## 算法修复

- **CMA-ES：** 修正协方差矩阵的秩一更新和累积常数 `c_c`；修复 `torch.cond` 中的崩溃并重新启用测试 ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **DE 变体：** 将 `DE_binary_crossover` 的采样分布从正态分布改为均匀分布。修复 SHADE 的 `F`、`CR` 自适应机制，并确保 DE 变体的初始种群在边界内采样 ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO：** 修复边界张量的设备迁移问题 ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **演化策略：** 修复 ASEBO 在梯度子空间激活后的问题、XNES/SeparableNES 的默认 `pop_size` 问题，以及 Guided ES 的子空间崩溃 ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## 算子与指标

- 修复 `n_round=1` 时锦标赛选择的崩溃 ([#259](https://github.com/EMI-Group/evox/pull/259)).
- 超体积（`hv`）计算现在忽略不支配参考点的点 ([#254](https://github.com/EMI-Group/evox/pull/254)).

感谢 @bbopen、@raashish1601、@Arthur031221 和 @flyingdoubleG 的首次贡献。

**发布记录**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **完整变更日志**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
