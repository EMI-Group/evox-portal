---
title: "Genesis 開発状況：Assistant と共有リモートサーバー"
pubDate: 2026-11-07
summary: "main ブランチで操作チャット、共有リモートサーバー、バックグラウンドジョブの簡素化が進みました。"
---

2026年11月4〜7日に Genesis の `main` ブランチへ取り込まれた変更は、日常の操作を改善します。

Genesis Assistant はダッシュボードの操作チャットとなり、タスクやシステム容量の確認、タスク操作や設定変更の要求に対応します。read/write/sudo の実行レベルにより、参照操作と実行コードの承認を必要とする操作を区別し、sudo には専用の承認カードを用意します。境界は [Assistant ガイド][assistant] をご覧ください。

リモート開発は HTTP ダッシュボードと単一のサーバーインスタンスを共有します。`genesis remote stop` は HTTP を維持したままリモート分散接続を無効にします。バックグラウンドジョブには `bash-1` などの短い識別子が付き、呼び出し元エージェントのジョブが1件だけなら `job_output` の `job_id` を省略できます。

開発ビルドでは、OAuth 認証情報ファイルの上書きパスを、グローバルな `[llm] oauth_file` ではなく個々のモデルプロファイル（`[[llm.models]]`）に設定します。

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

