---
title: "EvoXクイックスタート：わずか10分でGPU加速の進化計算を実行"
pubDate: 2025-04-30
summary: "初心者向けチュートリアル。EvoXを使ってわずか10分でGPU加速の進化計算を始めましょう。"
---

一方では、進化計算は実世界の研究やエンジニアリングにおいて非常に強力でありながら、呼び出すのが難しいものです。他方では、GPUの能力はますます強力になっていますが、進化計算タスクでその力を発揮させることは困難です。

私たちには真にモダンなソリューションが必要です：ネイティブGPUサポート、モジュラーアーキテクチャ、明確なインターフェース、すぐに使える利便性、カスタマイズ可能な拡張性。これがEvoX -- 未来のための進化計算エンジンです。

ユーザーが素早く始められるよう、EvoXチームは「EvoX初心者チュートリアル」をリリースしました。チュートリアルは8章で構成されており、基礎から高度な実践的応用まで、GPUで進化アルゴリズムを実行する方法をステップバイステップでガイドします。

**チュートリアルリソース一覧**

中国語オンラインチュートリアル：

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

中国語PDFチュートリアル：

QQグループに参加して入手してください：297969717

次に、インストールから実行までの全プロセスをわずか10分でご案内します。

**ステップ1：環境構築**

ターミナルを開き、クリーンなPython環境を作成します：

![代码片段1.png](/images/articles/quickstart-1.png)

お好みのツールを使用してクリーンなPython環境を作成することもできます。

**ステップ2：PyTorchとEvoXのインストール**

![代码片段2.png](/images/articles/quickstart-2.png)

GPUが利用可能かどうかを確認します：

![代码片段3.png](/images/articles/quickstart-3.png)

**ステップ3：最初の進化アルゴリズムを実行する**

**![代码片段4.png](/images/articles/quickstart-4.png)![図片2.4.png](/images/articles/quickstart-5.png)**

これは何をしているのでしょうか？標準インターフェースを通じて、アルゴリズム（PSO）、問題（Ackley）、モニター（EvalMonitor）を組み合わせています。EvoXがすべての並列化、加速、モニタリングを処理します！

**ステップ4：収束曲線をプロットする**

たった1行で十分です：

![代码片段5.png](/images/articles/quickstart-6.png "代码片段5.png")

![monitor_output.png](/images/articles/quickstart-7.png)

あの下降する曲線が見えますか？それは**進化アルゴリズムが目標に近づいていく軌跡**であり、**未知の世界を探索する道筋**です。

**ステップ5：拡張してみる**

「Ackleyを実行するだけ」では物足りない場合は、以下のことができます：

· PSOをGA、DE、CMA-ES、NSGA-II、RVEAなどに変更する...
 · AckleyをRastrigin、Griewank、CEC2022に変更する
 · n_objs >= 2に設定して多目的問題に切り替える
 · MyProblemとMyAlgorithmで独自のロジックを実装する
 · PyTorchモデルや強化学習環境（Gym、Brax、MuJoCo Playground）と連携する

ハイパーパラメータチューニング、アーキテクチャ探索、ニューロエボリューション、制御戦略最適化など、EvoXはすべてを簡単に処理します。

**なぜEvoXを選ぶのか？**

![表格-英文.png](/images/articles/quickstart-8.png "表格-英文.png")



**謝辞**

このチュートリアルは**Boqing Xu**、**Xinmeng Yu**、**Bowen Zheng**、**Xinyao Li**によって執筆されました。**Beichen Huang**がチュートリアルの整理、編集、オンライン公開を担当しました。

EvoXコミュニティのすべてのメンバーに心から感謝いたします。皆様の共同の努力により、EvoXは進化し続けることができています。

**オープンソースコード / コミュニティリソース**

論文:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

上流プロジェクト (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQグループ: 297969717

![図片11.png](/images/articles/evox-1-1-0-1.png)

QQグループ | Evolving Machine Intelligence

EvoMOはEvoXフレームワーク上に構築されています。EvoXについてもっと知りたい方は、WeChat公式アカウントで公開されたEvoX 1.0に関する公式記事をぜひご覧ください。

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))
