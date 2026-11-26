---
title: "Genesis、ダッシュボードの依存ライブラリを強化"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main で Phoenix、LiveView、Bandit、jsv を更新。ソースからの導入では再ビルドが必要です。"
---

Genesis は2026年11月23日、`main` の4つの依存ライブラリを更新しました。対象は、ワークベンチへのアクセスを支える共通の Web 基盤です。ソースから Genesis をビルドするチームにとって重要なのは、稼働中のサービスを構築した依存関係の組み合わせです。[依存関係の更新][lock]

![交換部品によって補強された共用ドアの錠機構](./cover.webp)

*概念図：共用の入口を守る部品の保守。*

## 画面の下で変わったこと

Genesis の依存宣言は、Phoenix の更新を presence トラッカーとブロードキャスト配信のクラッシュ修正に、LiveView の最低バージョン変更を URL のない接続要求でセッション初期化フックが省略される問題の修正に結び付けています。Bandit の HTTP/2 検証と強化も説明されています。これは Genesis の保守担当者が記録した理由であり、特定の導入環境が影響を受けたかどうかを示すものではありません。[依存要件][pins]

ロックファイルでは Phoenix が1.8.16から1.8.17へ、LiveView が1.2.13から1.2.15へ、Bandit が1.14.1から1.15.0へ、jsv が0.28.0から0.28.1へ更新されました。LiveView の宣言上の最低版は1.2.14ですが、固定ビルドは1.2.15を使用します。対応する Nix 変更では依存ハッシュを再計算しています。[固定バージョン][lock] · [Nix の変更][nix]

## 実際に配置したビルドを確認する

例えば、自前で運用するチームがソースだけを更新し、古いバイナリを動かし続ける場合があります。これらのコミットを含むリビジョンを使い、通常の導入手順で再ビルドして再配置してください。ビルドの `mix.lock` と、該当する場合は対応する Nix ハッシュを確認し、配置後に画面へのアクセスとライブ再接続を検証します。ソースディレクトリの更新だけでは稼働中のサービスは置き換わりません。[導入ガイド][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

2026 年 11 月 25 日の保守では `db_connection` も 2.10.3 に更新されました。ソースは、偽造されたストリーム構造がログオプションに到達する問題への対策と説明しています。Markdown のネイティブ依存と Nix ハッシュも更新されました。対応するロックファイルと Nix 定義で再ビルドしてください。 [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
