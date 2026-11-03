---
title: "EvoX Compiler v0.1.0：明示的なテンソルグラフと複数のバックエンド"
pubDate: 2026-10-29
summary: "EvoX Compiler の初版は、検査可能な計算グラフ、組み合わせ可能な変換、NumPy・IREE・XLA・TVM の実行経路を Python に提供します。"
---

**EvoX Compiler（evoxc）v0.1.0 は 2026 年 10 月 29 日に公開されました。** プログラム自体を検査、変換、保存、実行したい開発者向けの Python テンソルグラフコンパイラとランタイムです。Apache-2.0 ライセンスで、Python 3.11 以降が必要です。

## 検査できるプログラム

evoxc は `trace → lower → compile → load → run` の各段階を公開します。フロントエンドが計算を EvoXIR で表し、StableHLO を外部コンパイラへ渡します。最適化とコード生成は外部コンパイラが担当し、中間グラフや成果物は検査・保存できます。

グラフ変換には `vmap`、`grad`、`jvp`、`vjp` があります。ニューラルアーキテクチャ探索、遺伝的プログラミング、アルゴリズム合成では、`batch_functions` が入出力仕様の一致する候補プログラムを一つのグラフにまとめます。明示的なコンパイルキャッシュは静的プログラムを繰り返し生成する処理を支えます。

## 四つの実行経路

必須依存は NumPy のみで、標準の CPU インタープリタを提供します。追加アダプタは IREE、ユーザー提供の PJRT プラグインを使う XLA、TVM に接続します。バックエンドとデバイスは明示的に選択し、演算・ハードウェア対応範囲はアダプタごとに異なります。リリース文書の Vulkan 検証は Mesa lavapipe、TVM の ROCm はコンパイル段階のみです。

リリースの README は、IREE・TVM・torch 導入時のコアと `evoxc_hf` のテストを **7,511 件合格、77 件スキップ、4 件の想定内失敗、失敗 0 件**と報告しています。この構成でのプロジェクト側の報告です。リポジトリはコード、テスト、文書を EvoX Genesis で作成したと記しています。

## 使い始める

以下のコマンドでこのリリースをインストールできます。追加コンパイラの設定は当該バージョンの README を参照してください。HuggingFace 連携は `evoxc-hf` として別途配布されます。

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
