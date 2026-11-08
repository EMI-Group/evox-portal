---
title: "EvoX 1.1 リリース: torch.compile (TorchDynamo) を搭載"
pubDate: 2025-03-01
summary: "EvoX 1.1 は TorchScript を torch.compile に置き換え、TorchDynamo によって Python 実行中に計算グラフを取得します。"
---

![コンパイラの検査に向けて可視化されたプログラム構造](./execution-graph-capture.webp)

## コンパイル基盤の更新

EvoX 1.1 は TorchScript を `torch.compile` に置き換え、TorchDynamo によって Python 実行中に計算グラフを取得します。

## ワークフローのコンパイル

ワークフローのステップをコンパイルし、対応するテンソル演算を PyTorch コンパイラでまとめて最適化します。

## 互換性

グラフ取得は使用する演算と制御フローに依存します。未対応のコードではグラフが分割される場合があり、すべての Python ライブラリ呼び出しがコンパイルされるわけではありません。

## 関連資料

- [GitHub](https://github.com/EMI-Group/evox)
- [ドキュメント](https://evox.readthedocs.io/en/latest/)
