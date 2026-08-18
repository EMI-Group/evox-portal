---
title: "EvoX Genesis：長期の自律的なソフトウェア進化のための再帰的AIシステム、ゼロから25万行のC compilerを構築"
pubDate: 2026-08-17
summary: "香港理工大学データサイエンス・人工知能学科のEvoXチームは、長期の自律的なソフトウェア進化のための再帰的AIシステム「EvoX Genesis」をリリースしました。永続的なagentに依存して長期開発を維持するのではなく、ソフトウェア世界そのものを進化させ続けます。空のリポジトリから出発し、システムは123.4時間で248,989行のC compilerを構築しました。モデルのtokenコスト総額はわずか44.38ドルです。"
---

# EvoX Genesis：長期の自律的なソフトウェア進化のための再帰的AIシステム、ゼロから25万行のC compilerを構築

![image1.png](./evox-genesis-1.png)

香港理工大学データサイエンス・人工知能学科のEvoXチームは、長期の自律的なソフトウェア進化のための再帰的AIシステム**EvoX Genesis**をリリースしました。

EvoX Genesisは、長期開発を維持するために永続的なagentに依存するやり方を脱却し、ソフトウェア世界そのものを進化させ続けます。

空のリポジトリから出発し、システムは1,019回のagentエピソードを経て、123.4時間で**248,989行のC compiler**を構築しました。モデルのtokenコストはわずか**44.38ドル**です。

<center>

## ロングホライズン・コーディング：境界は動き続ける

</center>

コーディングagentの稼働時間は、単発の短いタスクから数十時間へと延伸しています。

OpenAIはCodexを空のリポジトリから約25時間連続で実行し、約3万行のコードを生成しました。

Anthropicは16個のClaude agentを使い、約2,000回のセッション、約2週間、約2万ドルのAPIコストをかけて、約10万行のC compilerをゼロから構築しました。

時間は長くなり、agentは増え、ソフトウェアは複雑になり続けています。

しかし研究の中心は依然としてagentにあります：

より強力なモデル、より長いコンテキスト、より永続的なメモリ、より多くのagent。

**EvoXチームは問いの方向を変えました：**

**なぜagentは存続し続けなければならないのか？**

本当に存続すべきは、agentが棲むソフトウェア世界の方ではないか？

<center>

## 123.4時間、25万行

</center>

私たちはEvoX Genesisを、実装が空のリポジトリから始めさせました。

目標はただ一つ：C compilerを構築すること。

123.4時間、1,019回のagentエピソード、**248,989行のコード**、そしてモデルのtokenコストはわずか**44.38ドル**でした。

最終的に、構築されたcompilerはc-testsuiteの220/220、LLVMテストケースの32/36、Csmithランダムプログラムテストの93/93に合格しました。

そこに補完を待つ既存のcompilerはありません。**ゼロから始めたのです。**

![image2.png](./evox-genesis-2.png)

<center>

_図1：C compilerの実験結果 / コード規模、稼働時間、agentエピソード、コスト、テスト結果_

</center>

<center>

_（DeepSeek V4 Flashモデルを使用）_

</center>

<center>

## agentを存続させない——ソフトウェア世界を存続させる

</center>

複雑なソフトウェアの寿命は、単一のagentセッションよりも自然に長くなります。

EvoX Genesisはソフトウェアを、再帰的に展開し続けるソフトウェア世界として組織します：

上位のagentが目標を分解し、新しいagentがそれぞれの局所的な位置で作業を完了します；

結果が検証されると、ソフトウェアのバージョン履歴に入り、次の開発ラウンドにおける現実となります。

そしてagentは消えてもよく、

新しいagentが、すでに形になったソフトウェア世界から続けていきます。

存続するのは、ある会話でも、際限なく成長するスクラッチパッドでも、常にオンラインの「マスターエージェント」でもありません。

存続するのは、コード、構造、制約、検証結果、そしてすでに起きた歴史です。

**存続するのはagentではなく、ソフトウェア世界です。**

**Agent does not persist. Its validated consequences do.**

これが、EvoX Genesisが長期の自律的なソフトウェア進化を持続させる仕組みです。ユーザーにとって、これは非常にシンプルなことを意味します：

**agentを構築する必要はなく、ソフトウェアに何になってほしいかを記述するだけです。**

agent、役割、ワークフローを事前に設計する必要も、完全なタスクツリーを手作業で分解する必要もありません。

ユーザーはソフトウェア開発目標を短い文章で記述するだけでよく、

タスクの分解、agentの生成、再帰の展開、結果の検証は、すべてEvoX Genesis自身が行います。

![image3.png](./evox-genesis-3.png)

<center>

_図2：Persistent Recursive Worldの概念図 / agentは生まれ、行動し、消える；ソフトウェア世界は展開し続ける_

</center>

<center>

## モデルは交代できる、ソフトウェア世界は続く

</center>

この連続性は、同じモデルを使い続けることすら要求しません。

別の一連の実験では、GLM 5.2が構築を始めたソフトウェア世界を、DeepSeek V4 Flashに引き継いで開発を続けさせました。

最終的に、保持されたLLVM SingleSourceテストの1,820/1,820に合格しました。

モデルは交代でき、agentも交代できる——ソフトウェア世界は続いていきます。

![image4.png](./evox-genesis-4.png)

<center>

_図3：GLM 5.2 → DeepSeek V4 Flashのクロスモデル継続実験_

</center>

<center>

## ゼロからも、歴史を継いでからも

</center>

ゼロからの構築は、ソフトウェアライフサイクルの一端にすぎません；

もう一端は、長年存在し、構造と歴史に富んだソフトウェア世界です。

私たちはEvoX GenesisをMESA——長年開発が続けられてきた恒星進化の科学計算システム——に適用しました。

実験は13のFortranモジュール、合計**139,414行**を対象とし、

EvoX Genesisはそれらを対応するRust cratesへリファクタリングしました。モデルのtokenコストは約**10.6ドル**です。

ソフトウェア世界は無から創造されることもできれば、歴史を継いで変化し続けることもできます。

![image5.png](./evox-genesis-5.png)

<center>

_図4：MESA Fortran → Rust、13モジュール、139,414行のコード、10.6ドル_

</center>

<center>

## コスト優位は時間とともに複利で積み上がる

</center>

長期のソフトウェア開発は、コストが線形に増え続けることを意味しません。

EvoX Genesisでは、検証済みのコード、構造、開発履歴が蓄積され続け、次のラウンドの作業の基盤になります。後続のagentはプロジェクト全体をゼロから再理解する必要がなく、既存の情報の多くはそのままキャッシュして再利用でき、キャッシュヒット率は最大97.4%に達します。

システムが動き続けるほど、再利用可能な開発状態は豊かになり、冗長な計算は減り、開発の単価はむしろ下がっていきます。

これは時間とともに積み上がるエンジニアリングの複利です。

<center>

## EvoX Genesisはオープンソース化されました

</center>

プロジェクトはオープンソースで、Windows、macOS、Linux向けのインストールパッケージが提供されています。

🌐 公式サイト：

https://genesis.evox.group/

🔗 **GitHub**：

https://github.com/EMI-Group/genesis

↓ **ダウンロード**：

**https://github.com/EMI-Group/genesis/releases**

**▤ 論文：**

**https://arxiv.org/abs/2608.10450**

🌐 QQグループ：297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

<center>

**agentは去り、ソフトウェア世界は進化し続ける**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>QQグループ｜</strong>Evolutionary Machine Intelligence</center>

参考：

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
