---
title: "EvoX 入門：最初の進化的ワークフローを構築する"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "EvoX 1.4.1 の実験を実行し、問題、集団、評価、実行が再利用可能な進化的ワークフローをどう構成するかを学びます。"
---

PSO で二次元 Ackley 関数を最小化し、実行デバイスを確認して履歴を描画します。対象は **EvoX 1.4.1 と PyTorch**で、実験的な 2.x コンパイラ API ではありません。小規模な例は手順の理解用であり、GPU 性能のベンチマークではありません。

![探索地形上の候補球とワークフローの枠](./first-search-workflow.webp)

## 独立した環境を準備する

Python 3.10 以降で仮想環境を作り、シェルに対応したコマンドで有効化します。

```bash
python -m venv .venv
```

macOS/Linux：

```bash
source .venv/bin/activate
```

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

## 適切なパッケージをインストールする

OS とハードウェアに合うコマンドを [PyTorch 公式サイト](https://pytorch.org/get-started/locally/)で選びます。CUDA パッケージには対応ドライバが必要で、EvoX のインストールだけでは GPU 利用は保証されません。続いて対象バージョンを入れます。

```bash
python -m pip install "evox[vis]==1.4.1"
```

## 実験を実行する

以下を Python スクリプトとして保存します。CUDA があれば GPU、それ以外は CPU を選び、実際のデバイスを表示します。状態と監視は同じデバイスに置きます。乱数シードの固定は再実行に役立ちますが、デバイスやバージョンが異なると結果も変わり得ます。

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## 結果を理解して可視化する

PSO が候補ベクトルを保持し、Ackley が評価、StdWorkflow が接続、EvalMonitor が記録を担当します。適応度は小さいほどよく、理論上の最適値は原点でゼロです。結果は確率的なので固定スコアは保証しません。

探索後、同じプロセスで次を実行します。可視化用依存関係はインストール済みです。画像は元の教材の参考例で、このシードの出力を保証するものではありません。

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## 意図を持って実験を拡張する

次元、集団サイズ、シードを一つずつ変更してください。独自問題は各候補に目的値を返します。多目的最適化には対応アルゴリズム、出力形状、監視設定も必要で、一つのパラメータ変更だけでは不十分です。

計時ではコンパイルとウォームアップを定常実行から分け、CUDA を同期し、同じ評価予算で比較します。小さな課題は CPU の方が速い場合があります。まず基準例を動かし、その後にコンパイルを検討してください。

## 教材と謝辞

元の教材は Boqing Xu、Xinmeng Yu、Bowen Zheng、Xinyao Li が執筆し、Beichen Huang が編集・公開しました。概要図を以下に残しています。

![EvoX overview](./quickstart-8.png)

この例には[バージョン固定のソース](https://github.com/EMI-Group/evox/tree/v1.4.1)、続きの学習には[ドキュメント](https://evox.readthedocs.io/en/latest/)を参照してください。新しい資料の API を使う前に対象バージョンを確認してください。

拡張前に、パッケージのバージョン、使用デバイス、シード、最良適応度を一緒に保存します。設定を一つ変え、同じ予算で再実行します。競合する目的に進む際は、[EvoMO の解説](/ja/news/gpu-accelerated-emo)が選択と評価の設計を紹介します。
