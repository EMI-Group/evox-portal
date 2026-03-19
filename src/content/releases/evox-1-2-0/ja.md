---
title: "EvoX v1.2.0 リリースノート"
pubDate: 2025-04-23
summary: "final_step()、Mujoco Playground 環境、ユーザーチュートリアル、EvoMO 統合などの新機能。"
---

**新機能、改善、そして重要なバグ修正が満載の「EvoX v1.2.0」のリリースをお知らせします！**

**このアップデートにより、主要なモジュール全体でフレームワークの柔軟性とパフォーマンスが向上します。**

**ハイライト:**

-  よりスムーズな実行ワークフローのために、`final_step()` を追加し、`hpo_wrapper` と `std_workflow` を更新しました。

-  強化学習実験のための新しい環境である「Mujoco Playground」を導入しました。

-  ユーザーがすぐに使い始められるように、新しい[チュートリアル](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")を公開しました。

-  新しい EvoX 拡張機能を追加し、[EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/") のような姉妹プロジェクトとの統合を強化しました。

-  安定性と明確さを向上させるための、様々なバグ修正とドキュメントの更新を行いました。

**関連する Pull Request:**

- MOEA の Docstring 更新 -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py` における `vmap` の修正 -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  RVEAa の追加、および DTLZ、IGD、RVEA サポートの改善 -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- ワークフローモジュールにおける `final_step()` の更新 -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground 環境 -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  ドキュメントの改善 -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playground のバグ修正 -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  新しいユーザーチュートリアル -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**完全な変更履歴**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**オープンソースコード / コミュニティリソース**

論文:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

アップストリームプロジェクト (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ グループ: 297969717

![图片11.png](./evox-1-2-0-1.png)

QQ グループ | Evolving Machine Intelligence