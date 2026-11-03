---
title: "EvoX v2.0.0a1：EvoX Compiler を基盤に全面刷新"
pubDate: 2026-10-30
summary: "新しい関数型 API と明示的なテンソルグラフコンパイラーを備えた実験的アルファ版。本番環境には引き続き安定版 1.x を推奨します。"
---

**EvoX v2.0.0a1** は、[EvoX Compiler（`evoxc`）](https://github.com/EMI-Group/evoxc) を基盤に全面的に書き直した最初のアルファ版です。

> **実験的なプレリリース:** 新 API は 1.x と互換性がなく、そのまま置き換えることはできません。本番環境には引き続き安定版 1.x を推奨します。アルファ版は別の環境でお試しください。

## 明示的なコンパイルパイプライン

EvoX Compiler はテンソルグラフを検査・変換可能にし、トレース、グラフ変換、低水準表現への変換、コンパイル、実行を分離します。`vectorize`/`vmap`、`grad`、`jvp`、`vjp`、`batch_functions` を組み合わせて利用でき、NumPy、IREE、TVM、XLA/PJRT バックエンドに対応します。StableHLO がコンパイル用バックエンドの共通の中間表現となります。

EvoX 2.0 は PyTorch や JAX に依存しません。EvoX Compiler の必須実行時依存は NumPy のみで、コンパイル用バックエンドは任意です。

## 新しい関数型 API

- アルゴリズムは `init(config, key)` と `step(config, state, evaluate)` を使用します。
- 問題は `evaluate(config, state, candidates)` を使用します。
- 設定は不変で、テンソル状態は明示的に扱い、再現可能な PRNG キーで乱数を管理します。
- `StdWorkflow` は進化の1ステップをトレースし、選択したバックエンドでコンパイルして最適化ループを実行します。

## アルファ版に含まれる機能

- **32 のアルゴリズムクラス**と **15 の進化演算子**。
- 基本数値ベンチマーク、DTLZ、CEC2022、仮想神経進化。
- GD、IGD、ハイパーボリューム指標、Plotly 可視化、`.exv` トレース。
- ホスト側のハイパーパラメーター最適化と `evox_ext` による拡張検出。

上流のリリースでは **NumPy バックエンドで 552 件のテストに合格**したと報告されています。コンパイル用バックエンドや GPU の同等のテスト範囲を保証するものではありません。

## インストール

**Python 3.11+** が必要です。別の環境でインストール方法を1つ選んでください。

```bash
pip install --pre "evox==2.0.0a1"
```

任意のコンパイラーサポートを追加する場合：

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## 現在の制限

分散ワークフロー、Brax/MuJoCo、PyTorch ニューラルネットワーク統合、Triton カーネルは未移植です。コンパイル用バックエンドと GPU 実行は実験段階で、一部の演算子や制御フローはすべてのバックエンドでは利用できません。監視、可視化、指標、HPO は現在コンパイル済みグラフの外で実行されます。プレリリース期間中は API が変更される可能性があります。

不具合、ベンチマーク結果、API へのご意見は [GitHub Issues](https://github.com/EMI-Group/evox/issues) にお寄せください。

**リリース**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
