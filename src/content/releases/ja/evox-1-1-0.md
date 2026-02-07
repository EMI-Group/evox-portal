---
title: "EvoX 1.1 リリース：torch.compile (TorchDynamo) 対応"
pubDate: 2025-03-01
summary: "EvoX 1.1 は torch.compile (TorchDynamo) の完全統合を導入し、TorchScript に代わる互換性とパフォーマンスの向上を実現。"
---

**EvoX 1.1**のリリースを発表できることを嬉しく思います。バックエンドコンパイラとして**torch.compile（TorchDynamo）の完全統合**を導入しました！このアップデートは従来のTorchScriptアプローチに代わるもので、EvoXを**より使いやすく、より広範なPythonエコシステムとの高い互換性**を実現します。

**torch.compile**を活用することで、EvoXは実行時に計算グラフを動的にキャプチャし、手動トレーシングの必要性を排除しながら、パフォーマンスを自動的に最適化します。

**新機能**

**torch.compile：よりスマートで柔軟なコンパイル**

EvoX 1.1では、新しいコンパイルバックエンドとして**torch.compile**を全面的に採用しました。従来のトレーシングベースのアプローチとは異なり、torch.compileは**内部的にTorchDynamo**を使用してPythonの実行をインターセプトし、計算グラフを動的に抽出してリアルタイムで最適化します。

これにより：

l  **手動トレーシングが不要に** -- **torch.compile(workflow.step)**を呼び出すだけで、EvoXが残りの処理を行います。

l  **シームレスなPython互換性** -- ネイティブPython関数やNumPy、SciPyなどの外部ライブラリと連携します。

l  **パフォーマンスの向上** -- 最適化された計算グラフにより、**より高速な実行とより効率的なハードウェア活用**を実現します。

l  **将来を見据えた設計** -- PyTorchのロードマップに沿い、長期的な互換性とパフォーマンス改善を保証します。

**なぜTorchScriptからtorch.compileへ移行するのか？**

以前のバージョンでは、EvoXは**トレーシングベースの手法**に依存していました：

l  **1.0.0以前**は計算グラフ抽出に**JAXトレーシング**を使用していました。

l  **v1.0.0**では**TorchScript**に切り替え、PyTorch統合を強化しました。

しかし、これらの手法にはいくつかの欠点がありました：

l  **使用が複雑** -- ユーザーは手動でグラフをトレースし、複雑なデバッグに対処する必要がありました。

l  **互換性の制限** -- 動的なワークフローやPyTorch以外の関数との連携に苦労しました。

l  **柔軟性の制約** -- ループ、条件分岐、その他のPython構文が常に正しくキャプチャされるとは限りませんでした。

torch.compileと**TorchDynamo**により、**これらの問題は解消されました**。EvoXは動的に最適化を行い、**ユーザーの追加作業なしに**より幅広いワークフローをサポートします。

**EvoX 1.1で作業がより簡単に**

l  **トレーシングの手間が不要に** -- すべてがバックグラウンドで処理され、コードがよりクリーンで保守しやすくなります。

l  **既存のPythonコードとそのまま連携** -- 互換性のためにワークフローを変更する必要はありません。

l  **より高速な実行、より優れたスケーリング** -- GPUおよびTPU向けのPyTorchの最新最適化の恩恵を受けられます。

l  **将来に対応** -- PyTorchの長期的な進化に沿い、継続的なパフォーマンス向上を確保します。

**今すぐEvoX 1.1にアップグレード！**

EvoX 1.1が正式にリリースされました！今すぐアップグレードして、**よりスマートで、より高速で、より直感的な**計算ワークフローを体験してください。

**EvoX 1.1を入手**: [GitHub](https://github.com/EMI-Group/EvoX)

ご質問やフィードバックがありましたら、GitHubでIssueを作成するか、コミュニティディスカッションにご参加ください。**計算知能の限界を一緒に押し広げましょう！**

**ソースコード / コミュニティ / ドキュメント**

論文: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

ドキュメント: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQグループ: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
