---
title: "EvoX Compiler：Genesis で構築した明示的なテンソルグラフ基盤"
pubDate: 2026-11-03
summary: "Genesis の EvoX Compiler 事例は、NumPy、IREE、XLA、TVM の実行経路を持つ Python テンソルグラフコンパイラとランタイムを紹介します。"
---

EvoX Compiler（evoxc）は計算グラフを検査可能な成果物にします。フロントエンドが EvoXIR を構築・変換し、明示的な段階を通じて低水準化、コンパイル、ロード、実行を行います。必須依存は NumPy のみで、最適化とコード生成は外部コンパイラが担当します。

**2026 年 10 月 28 日**付の Evidence スナップショットは、**NumPy、IREE、XLA、TVM** の四つの実行経路を記録しています。リポジトリはコード、テスト、文書を Genesis で作成したと明記しています。初期構築からインターフェースとバックエンドの継続開発へ進む事例です。

IREE 導入構成での記録は、**6,789 件合格、46 件スキップ、3 件の想定内失敗**で、失敗はありません。これは過去の集計であり、現在の総数ではありません。**285,659 行の追跡対象テキスト**にはテスト、ベンチマークデータ、文書も含まれ、すべてがコンパイラのソースではありません。モデル token 費用は約 **50 米ドル**で、ハードウェアを除きます。

バックエンドの検証範囲は構成に依存します。記録された Vulkan 検証はソフトウェアデバイスを使い、TVM の ROCm はコンパイルのみです。結果はプロジェクト側の報告で、独立した再現はありません。開発者は明示的なグラフ処理手順とコミット済みのベンチマーク報告から始められます。

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
