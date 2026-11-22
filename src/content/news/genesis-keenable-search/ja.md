---
title: "Genesis、API キー不要の検索経路を選択可能に"
pubDate: 2026-11-22
summary: "Keenable アダプターが公開検索の明示的な有効化に対応し、キー付きアクセスと従来の既定プロバイダーも維持します。"
---

Web 検索に別の認証情報が必要だと、Agent の調査は最初の問い合わせ前に止まることがあります。2026 年 11 月 19 日に `main` にマージされた Genesis PR #174 は、API キー未設定でも公開エンドポイントを使える **Keenable** を任意選択のプロバイダーとして追加しました。既存環境の既定動作は変わりません。[検索アダプター][pr]

![開いた図書館の入口が参照元を示す文書へ続く](./cover.webp)

*概念図：Web 調査への任意の公開経路。*

## 公開経路を明示的に有効にする

`[tools.search]` に `enabled = true` と `provider = "keenable"` を設定します。キーがない場合、アダプターは検索語と結果上限を公開エンドポイントへ送り、`X-Keenable-Title: Genesis` を付け、`X-API-Key` は省きます。認証情報ストアに `KEENABLE_API_KEY` を追加するとキー付きアクセスになります。[要求の構築][adapter]

実装は必要な二つの判定を変更します。キー不要の選択プロバイダーで Agent の検索ツールを有効にでき、実行時もキーがないという理由だけでは拒否しません。認証が必要なプロバイダーの確認は維持されます。

## 制限を踏まえて結果を読む

文書の参考資料を集めるタスクでは、検索前の設定を一つ減らせます。タイトル、URL、`snippet` は既存の結果形式に変換されます。`max_results` は適用されますが、Keenable に対応項目がない `search_depth` は無視されます。[応答の変換][adapter]

公開経路には IP 単位のレート制限があります。PR には要求構築、解析、ツール有効化、模擬実行のテストが記録されていますが、実際の Keenable API 呼び出しは報告されていません。有効化後、実行ホストから小さな検索を一度試し、出典リンクやサービスエラーを確認してから大きな調査に使ってください。[記録された確認][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
