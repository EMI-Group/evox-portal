---
title: "EvoX v1.2.1 リリースノート"
pubDate: 2025-05-13
summary: "安定性の改善、新しいベンチマーク関数（Ellipsoid、Griewank）の追加およびバグ修正。"
---

これは安定性の改善とバグ修正に焦点を当てたマイナーリリースで、いくつかの利便性向上も含まれています。

**新機能**

新しいベンチマーク関数：単目的数値関数`Ellipsoid`と`Griewank`を追加しました。

**バグ修正**

* 他のアルゴリズムを継承するアルゴリズムで`StdWorkflow`が動作しない問題を修正しました。

* `latin_hypercube_sampling_standard`関数のバグを修正しました。

* `torch.compile`下で`non_dominate`が失敗する問題を解決しました。

* 特定のケースで`PSO`がデフォルトデバイスを正しく使用しない問題を修正しました。

**リファクタリングとメンテナンス**

* よく使用されるユーティリティをトップレベルに再エクスポートし、利便性を向上させました。例：

* `evox.core.compile`の代わりに`evox.compile`

* `evox.core.vmap`の代わりに`evox.vmap`

* 非推奨または冗長なコードを削除しました。

完全な変更履歴: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**オープンソースコード / コミュニティリソース**

論文:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上流プロジェクト (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQグループ: 297969717

![図片11.png](/images/articles/evox-1-2-1-1.png)

QQグループ | Evolving Machine Intelligence
