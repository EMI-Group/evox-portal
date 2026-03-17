---
title: "EvoX v1.2.1 リリースノート"
pubDate: 2025-05-13
summary: "新しいベンチマーク関数（Ellipsoid, Griewank）の追加とバグ修正による安定性の向上。"
---

本リリースは、安定性の向上とバグ修正に焦点を当てたマイナーリリースであり、いくつかの使い勝手の向上も含まれています。

**新機能**

新しいベンチマーク関数：単目的数値関数 `Ellipsoid` と `Griewank` を追加しました。

**バグ修正**

* `StdWorkflow` が他のアルゴリズムを継承したアルゴリズムで動作しない問題を修正しました。

* `latin_hypercube_sampling_standard` 関数のバグを修正しました。

* `torch.compile` 環境下で `non_dominate` が失敗する問題を解決しました。

* 特定のケースで `PSO` がデフォルトデバイスを適切に使用しない問題を修正しました。

**リファクタリングとメンテナンス**

* 利便性向上のため、頻繁に使用されるユーティリティをトップレベルに再エクスポートしました。例：

* `evox.core.compile` の代わりに `evox.compile`

* `evox.core.vmap` の代わりに `evox.vmap`

* 非推奨または冗長なコードを削除しました。

完全な変更ログ: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**オープンソースコード / コミュニティリソース**

論文:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

アップストリームプロジェクト (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ グループ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ グループ | Evolving Machine Intelligence