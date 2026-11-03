---
title: "EvoX v1.0.1 リリースノート"
pubDate: 2025-01-20
summary: "Windows インストーラー、DE 系の基底ベクトル選択、大きな個体群での SHADE の不具合を修正。"
---

**EvoX v1.0.1** は、次の3点を修正するメンテナンスリリースです。

- Windows インストーラー `win-install.bat` を更新 ([#204](https://github.com/EMI-Group/evox/pull/204)).
- DE、ODE、JaDE の基底ベクトル選択を真のランダム選択に修正 ([#205](https://github.com/EMI-Group/evox/pull/205)).
- `pop_size > 100` の場合に SHADE で発生する配列の範囲外アクセスを修正 ([#206](https://github.com/EMI-Group/evox/pull/206)).

**リリース**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **全変更履歴**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
