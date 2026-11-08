---
title: "EvoX v1.0.1 發布說明"
pubDate: 2025-01-20
summary: "修正 Windows 安裝腳本、DE 系列演算法的基底向量選擇，以及 SHADE 在較大族群下的索引越界問題。"
---

![檢查並校正演算法行為](./bounded-random-selection.webp)

**EvoX v1.0.1** 是一次維護更新，包含三項修正：

- 更新 Windows 安裝腳本 `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- 修正 DE、ODE 和 JaDE 的基底向量選擇，採用真正的隨機選擇 ([#205](https://github.com/EMI-Group/evox/pull/205)).
- 修正 SHADE 在 `pop_size > 100` 時的陣列索引越界錯誤 ([#206](https://github.com/EMI-Group/evox/pull/206)).

**發布紀錄**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **完整變更紀錄**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
