---
title: "EvoXクイックスタート：わずか10分でGPU加速による進化的計算を実行"
pubDate: 2025-04-30
summary: "EvoXを使用して、わずか10分でGPU加速による進化的計算を始めるための初心者向けチュートリアルです。"
---

一方で、進化的計算は現実世界の研究や工学において非常に強力ですが、活用するのは困難です。他方で、GPUの能力はますます強力になっていますが、進化的計算タスクでその力を発揮させることは困難です。

私たちには、真に現代的なソリューションが必要です。それは、ネイティブなGPUサポート、モジュラーアーキテクチャ、明確なインターフェース、すぐに使える利便性、そしてカスタマイズ可能なスケーラビリティです。これがEvoX、未来のための進化的計算エンジンです。

ユーザーがすぐに始められるように、EvoXチームは「EvoX初心者向けチュートリアル」を公開しました。このチュートリアルは全8章で構成されており、基礎から高度な実践的応用までを網羅し、GPU上で進化的アルゴリズムを実行する方法をステップバイステップで案内します。

**完全なチュートリアルリソース**

中国語オンラインチュートリアル：

[EvoX Beginners Tutorial - EvoX Document](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

中国語PDFチュートリアル：

QQグループに参加して入手してください：297969717

次に、インストールから実行までの全プロセスをわずか10分でご案内します。

**ステップ1：環境セットアップ**

ターミナルを開き、クリーンなPython環境を作成します：

![代码片段1.png](./quickstart-1.png)

お好みのツールを使用して、クリーンなPython環境を作成することもできます。

**ステップ2：PyTorchとEvoXのインストール**

![代码片段2.png](./quickstart-2.png)

GPUが利用可能かどうかを確認します：

![代码片段3.png](./quickstart-3.png)

**ステップ3：最初の進化的アルゴリズムの実行**

**![代码片段4.png](./quickstart-4.png)![图片2.4.png](./quickstart-5.png)**

これは一体何をしているのでしょうか？標準インターフェースを介して、アルゴリズム（PSO）、問題（Ackley）、およびモニター（EvalMonitor）を構成しています。EvoXが並列化、高速化、モニタリングのすべてを処理します！

**ステップ4：収束曲線のプロット**

たった1行で十分です：

![代码片段5.png](./quickstart-6.png "代码片段5.png")

![monitor_output.png](./quickstart-7.png)

下降している曲線が見えますか？それは、**進化的アルゴリズムがターゲットに近づいている軌跡**であり、**未知の世界を探索するために辿った道筋**です。

**ステップ5：拡張を試みる**

「単にAckleyを実行する」だけでは満足できない場合は、以下のようなことができます：

· PSOをGA、DE、CMA-ES、NSGA-II、RVEAなどに交換する
 · AckleyをRastrigin、Griewank、CEC2022などに交換する
 · `n_objs >= 2` に設定して多目的問題に切り替える
 · `MyProblem` や `MyAlgorithm` で独自のロジックを実装する
 · PyTorchモデルや強化学習環境（Gym、Brax、MuJoCo Playground）に接続する

ハイパーパラメータチューニング、アーキテクチャ探索、ニューロエボリューション、制御戦略の最適化など、EvoXはすべてを簡単に処理します。

**なぜEvoXを選ぶのか？**

![表格-英文.png](./quickstart-8.png "表格-英文.png")



**謝辞**

このチュートリアルは、**Boqing Xu**、**Xinmeng Yu**、**Bowen Zheng**、**Xinyao Li**によって執筆されました。**Beichen Huang**がチュートリアルの整理、編集、オンライン公開を担当しました。

EvoXコミュニティのすべてのメンバーに心から感謝します。EvoXが進化し続けることができるのは、私たちの共同の努力のおかげです。

**オープンソースコード / コミュニティリソース**

論文：

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub：

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

アップストリームプロジェクト（EvoX）：

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQグループ：297969717

![图片11.png](./evox-1-1-0-1.png)

QQグループ | Evolving Machine Intelligence

EvoMOはEvoXフレームワーク上に構築されています。EvoXについてさらに詳しく知りたい場合は、WeChat公式アカウントで公開されているEvoX 1.0に関する公式記事をご覧ください。

![image.png](./metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))