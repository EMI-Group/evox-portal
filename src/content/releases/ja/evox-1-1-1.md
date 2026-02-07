---
title: "EvoX v1.1.1 リリースノート"
pubDate: 2025-03-16
summary: "torch.compile のグラフキャプチャ、use_state のグラフブレイク、BatchedTensor のリークに関するバグ修正。"
---

**変更内容**

**このマイナーリリースは主にバグ修正と改善を含みます：**

- `torch.compile`が`workflow.step`を正しくキャプチャしない問題を修正しました。

- `use_state`がグラフブレイクを引き起こす問題を修正しました。

- 一部の不正なモデルバッファの使用を修正しました。

- monitor.plotが意図通りに機能しない問題を修正しました。

- `torch.compile`および`torch.vmap`の特定の制限に対処するための新しいラッパー`evox.compile`を導入しました。

- `BatchedTensor`関連のさまざまな問題を解決しました：- EvalMonitorを含むワークフローをvmapする際にBatchedTensorリークが発生するバグを修正しました。

- HPOProblemがBraxProblemと連携できない問題を修正しました。

- RVEAとCSOの実装を改善し、パフォーマンスと信頼性を向上させました。

- BraxProblemの実装を改善しました。

- その他のさまざまな小規模な修正と改善を行いました。

**オープンソースコードとコミュニティ**

**論文**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**上流プロジェクト (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQグループ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQグループ | Evolving Machine Intelligence
