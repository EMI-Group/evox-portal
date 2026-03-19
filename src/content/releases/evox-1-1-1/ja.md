---
title: "EvoX v1.1.1 リリースノート"
pubDate: 2025-03-16
summary: "torch.compileのグラフキャプチャ、use_stateによるグラフの中断、およびBatchedTensorのリークに関するバグ修正。"
---

**変更点**

**このマイナーリリースには、主にバグ修正と改善が含まれています：**

- `torch.compile`が`workflow.step`を正しくキャプチャしない問題を修正しました。

- `use_state`がグラフの中断（graph break）を引き起こす問題を修正しました。

- モデルバッファの誤った使用法をいくつか修正しました。

- `monitor.plot`が意図した通りに機能しない問題を修正しました。

- `torch.compile`と`torch.vmap`の特定の制限を回避するために、新しいラッパー`evox.compile`を導入しました。

- `BatchedTensor`に関連する様々な問題を解決しました：`EvalMonitor`を含むワークフローに`vmap`を適用する際、`BatchedTensor`のリークが発生するバグを修正しました。

- `HPOProblem`が`BraxProblem`と連携して動作しない問題を修正しました。

- パフォーマンスと信頼性を向上させるため、RVEAとCSOの実装を強化しました。

- `BraxProblem`の実装を強化しました。

- その他、様々な小さな修正と改善を行いました。

**オープンソースコードとコミュニティ**

**論文**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**アップストリームプロジェクト (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQグループ**: 297969717

![image.png](./evox-1-1-1-1.png)

  QQグループ | Evolving Machine Intelligence