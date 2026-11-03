---
title: "EvoX v1.0.1 发布说明"
pubDate: 2025-01-20
summary: "修复 Windows 安装脚本、DE 系列算法的基向量选择，以及 SHADE 在较大种群下的越界问题。"
---

**EvoX v1.0.1** 是一次维护性更新，包含三项修复：

- 更新 Windows 安装脚本 `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- 修正 DE、ODE 和 JaDE 的基向量选择，使其采用真正的随机选择 ([#205](https://github.com/EMI-Group/evox/pull/205)).
- 修复 SHADE 在 `pop_size > 100` 时的数组索引越界错误 ([#206](https://github.com/EMI-Group/evox/pull/206)).

**发布记录**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **完整变更日志**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
