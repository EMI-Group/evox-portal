---
title: "EvoX v1.4.1 リリースノート"
pubDate: 2026-10-30
summary: "CMA-ES、DE 派生手法、PSO、進化戦略、トーナメント選択、ハイパーボリューム計算の不具合を修正。"
---

**EvoX v1.4.1** は、安定版 1.x 系列のアルゴリズムの正確性と実行時の問題を修正します。

## アルゴリズムの修正

- **CMA-ES:** 共分散のランク1更新と累積定数 `c_c` を修正。`torch.cond` 内でのクラッシュを修正し、テストを再有効化 ([#251](https://github.com/EMI-Group/evox/pull/251), [#255](https://github.com/EMI-Group/evox/pull/255), [#256](https://github.com/EMI-Group/evox/pull/256)).
- **DE 派生手法:** `DE_binary_crossover` のサンプリングを正規分布から一様分布に変更。SHADE の `F` と `CR` の適応を修正し、DE 派生手法の初期個体群を境界内でサンプリングするよう修正 ([#252](https://github.com/EMI-Group/evox/pull/252), [#258](https://github.com/EMI-Group/evox/pull/258)).
- **PSO:** 境界テンソルのデバイス転送を修正 ([#253](https://github.com/EMI-Group/evox/pull/253)).
- **進化戦略:** 勾配部分空間が有効になった後の ASEBO、XNES/SeparableNES のデフォルト `pop_size`、Guided ES の部分空間のクラッシュを修正 ([#257](https://github.com/EMI-Group/evox/pull/257), [#259](https://github.com/EMI-Group/evox/pull/259)).

## 演算子と指標

- `n_round=1` の場合のトーナメント選択のクラッシュを修正 ([#259](https://github.com/EMI-Group/evox/pull/259)).
- ハイパーボリューム（`hv`）計算で参照点を支配しない点を除外 ([#254](https://github.com/EMI-Group/evox/pull/254)).

初めて貢献された @bbopen、@raashish1601、@Arthur031221、@flyingdoubleG に感謝します。

**リリース**: [v1.4.1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · **全変更履歴**: [v1.4.0...v1.4.1](https://github.com/EMI-Group/evox/compare/v1.4.0...v1.4.1)
