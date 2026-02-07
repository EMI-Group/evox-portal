---
title: "EvoX v1.2.0 リリースノート"
pubDate: 2025-04-23
summary: "final_step()、Mujoco Playground 環境、ユーザーチュートリアル、EvoMO 統合などの新機能。"
---

**新機能、改善、重要なバグ修正を満載した「EvoX v1.2.0」のリリースを発表できることを嬉しく思います！**

**このアップデートは、主要モジュール全体にわたるフレームワークの柔軟性とパフォーマンスを向上させます。**

**ハイライト：**

-  `final_step()`を追加し、`hpo_wrapper`と`std_workflow`を更新して、よりスムーズな実行ワークフローを実現しました。

-  強化学習実験のための新しい環境「Mujoco Playground」を導入しました。

-  ユーザーが素早く使い始められるよう、新しい[チュートリアル](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/")をリリースしました。

-  新しいEvoX拡張関数を追加し、[EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/")などの姉妹プロジェクトとのより良い統合を可能にしました。

-  安定性と明確性を向上させるためのさまざまなバグ修正とドキュメント更新を行いました。

**関連するPull Requests：**

- MOEAのDocstring更新 -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- `hpo_wrapper.py`の`vmap`修正 -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  RVEAaの追加およびDTLZ、IGD、RVEAサポートの改善 -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- ワークフローモジュールの`final_step()`更新 -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Mujoco Playground環境 -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  ドキュメントの改善 -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Mujoco Playgroundのバグ修正 -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  新しいユーザーチュートリアル -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**完全な変更履歴**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**オープンソースコード / コミュニティリソース**

論文:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上流プロジェクト (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQグループ: 297969717

![図片11.png](/images/articles/evox-1-2-0-1.png)

QQグループ | Evolving Machine Intelligence
