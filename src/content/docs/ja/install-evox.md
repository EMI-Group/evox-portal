---
title: "EvoXインストールガイド"
order: 2
section: "install"
---

# EvoXインストールガイド

## EvoXのインストール

EvoXはPyPIで利用可能で、以下のコマンドでインストールできます：

```bash
# まずpytorchをインストール
# 例：
pip install torch

# 次にEvoXをインストール
pip install "evox[default]"
```

インストール時に追加オプションを指定することもできます。現在利用可能なエクストラは`vis`、`neuroevolution`、`test`、`docs`、`default`です。例えば、すべての機能を含むEvoXをインストールするには、以下のコマンドを実行します：

```bash
pip install "evox[vis,neuroevolution]"
```

## アクセラレータサポート付きPyTorchのインストール

`evox`はハードウェアアクセラレーションを提供するために`torch`に依存しています。
これらのPythonパッケージの全体的なアーキテクチャは以下のようになります：

```{mermaid}
stateDiagram-v2
    torch : torch
    nv_gpu : NVIDIA GPU
    amd_gpu : AMD GPU
    cpu : CPU

    direction LR

    evox --> torch
    torch --> nv_gpu
    torch --> amd_gpu
    torch --> cpu
```

要約すると、`evox`がCPUサポートを持つか、Nvidia GPUサポート（CUDA）を持つか、AMD GPUサポート（ROCm）を持つかは、インストールされたPyTorchバージョンに依存します。詳細なインストールヘルプについては、PyTorch公式ウェブサイトを参照してください：[`torch`](https://pytorch.org/)


## WindowsでのNvidia GPUサポート

EvoXはPyTorchを通じてGPUアクセラレーションをサポートしています。
WindowsでGPUアクセラレーション付きPyTorchを使用するには2つの方法があります：

1. WSL 2（Windows Subsystem for Linux）を使用し、Linux側にPyTorchをインストールする。
2. Windows上に直接PyTorchをインストールする。

オプション2については、新規インストールされたWindows 10/11 64ビット（Nvidia GPU搭載）での高速デプロイメント用の[ワンクリックスクリプト](/_static/win-install.bat)を提供しています。このスクリプトはWSL 2を使用せず、Windows上にネイティブPyTorchバージョンをインストールします。VSCode、Git、MiniForge3などの関連アプリケーションを自動的にインストールします。

* まず[Nvidiaドライバー](https://www.nvidia.com/Download/index.aspx?lang=en-us)が正しくインストールされていることを確認してください。そうでない場合、スクリプトはCPUモードにフォールバックします。
* スクリプト実行時は、安定したネットワーク（`github.com`などにアクセス可能）を確保してください。
* ネットワーク障害によりスクリプトが失敗した場合は、閉じて再度開いてインストールを続行してください。

### Windowsでの手動インストール

Windows上でPyTorchを手動でインストールする場合は、以下の手順に従ってください：
1. 上記のようにNvidiaドライバーをインストールします。
2. [python.org](https://www.python.org/downloads/)からPython 3.10以上をインストールします。
3. PyTorchをインストールします。
4. （オプション）Windowsでの`torch.compile`サポートのために[`triton-windows`](https://github.com/woct0rdho/triton-windows)をインストールします。
5. EvoXをインストールします。

### Windows WSL 2

[最新のNVIDIA Windows GPUドライバー](https://www.nvidia.com/Download/index.aspx?lang=en-us)をダウンロードしてインストールします。これにより、WSL 2のLinux環境でNvidia GPUがサポートされます。

> **警告:**
> WSL 2内にNVIDIA GPU Linuxドライバーをインストール**しないでください**。ドライバーはWindows側にインストールしてください。

```{seealso}
NVIDIAには詳細な[CUDA on WSLユーザーガイド](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)があります
```

## AMD GPU（ROCm）サポート

[`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch)のDockerコンテナの使用を推奨します。

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## インストールの確認

Pythonターミナルを開き、以下を実行します：

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```
