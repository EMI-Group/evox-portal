---
title: "Genesis、モデル交代後もコンパイラ開発を継続"
pubDate: 2026-11-03
summary: "GLM 5.2 から DeepSeek V4 Flash への交代後、評価対象の LLVM SingleSource 1,820 件すべてに合格したと Genesis の記録が報告しています。"
---

基盤モデルが変わっても、ソフトウェア開発は続けられるのでしょうか。2026 年 9 月 7 日付の Compiler Continuation 記録は、前の Agent の会話コンテキストを引き継がず、採用済みのコンパイラリポジトリから開発を再開した事例です。

記録によると、**GLM 5.2 から DeepSeek V4 Flash** へ交代し、タスクの再帰深度は **4 から 8** に増加しました。継続開発後、評価対象として保持された **LLVM SingleSource 1,820/1,820 件**に合格しました。これは指定された評価集合の結果であり、LLVM テストスイート全体の合格を意味しません。

採用済みコードとプロジェクト履歴が次の作業の土台となる、Genesis の継続性を示す事例です。コンパイラの初期構築と継続開発は同じリポジトリを共有しており、独立した二つのプロジェクトではありません。

本記事は Evidence 記録の振り返りです。結果はプロジェクト側の報告で、独立した再現は行われていません。継続開発の費用と追加コード量は未報告です。リンク先の既定ブランチの README は別の評価時点を記述しており、その件数と今回の結果は合算できません。

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
