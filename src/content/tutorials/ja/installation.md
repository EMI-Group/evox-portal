---
title: "2. インストールと環境設定"
order: 2
---

# 2. インストールと環境設定

EvoXを使用する前に、ソフトウェアとその依存関係を適切にインストールする必要があります。本章では、WindowsおよびLinuxでのインストール手順と、必要な依存関係の準備・設定方法について説明します。インストール前に、基本的なシステム要件（**Python 3.10以上**、十分なディスク容量、および必要に応じて適切なドライバを備えたサポート対象のGPU）を満たしていることを確認してください。

## 依存関係と準備

- **Python環境**: EvoXはPythonで構築されているため、Python 3.10以上がインストールされていることを確認してください。依存関係の競合を避けるために、仮想環境（`venv`など）の使用を推奨します。

- **PyTorch**: EvoXはテンソル演算とハードウェアアクセラレーションにPyTorchを使用します。そのため、**EvoXをインストールする前にPyTorchをインストールする必要があります**。ハードウェアに合わせてバージョンを選択してください：NVIDIA GPUをお持ちの場合はCUDA版、AMD GPUの場合はROCm版、GPUがない場合はCPU版をインストールします。適切なコマンドについては[PyTorch公式ガイド](https://pytorch.org)を参照してください。例：

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

インストール前に`pip`を最新バージョンに更新し、安定したインターネット接続を確保することを推奨します（パッケージはPyPIからダウンロードされます）。環境の準備ができたら、EvoXをインストールできます。

### Windowsでのインストール

Windowsユーザーは、**自動スクリプトインストール**または**手動インストール**を選択できます。公式のワンクリックインストーラーを使用すると、クリーンな環境でEvoXとその依存関係を簡単にセットアップできますが、手動インストールではより詳細な制御が可能です。

**オプション1: ワンクリックインストールスクリプトの使用 (win-install.bat)**
EvoXは、Windows 10/11 (64-bit) 用の[クイックインストールスクリプト](/_static/win-install.bat)を提供しています。このスクリプトは、Miniforge3（軽量なConda）、Python、PyTorch（CUDA対応）、EvoX、およびVSCodeやGitなどの便利なツールをインストールします。使用方法：

1. EvoXのドキュメントまたはGitHubから`win-install.bat`をダウンロードします。[NVIDIAドライバ](https://www.nvidia.com/en-us/drivers/)がインストールされており、安定したインターネット接続があることを確認してください。
2. スクリプトを実行します。管理者権限は不要ですが、実行中に許可を求められる場合がありますので、許可してください。スクリプトはすべてを自動的にインストールおよび設定します。
3. 完了するまで待ちます。成功するとメッセージが表示され、VSCodeが開く場合があります。これでEvoXとその依存関係がインストールされます。

> **注**: ネットワークの問題でスクリプトが失敗した場合は、閉じてから再実行してください。失敗した箇所からの再開をサポートしています。

**オプション2: 手動インストール**
EvoXを手動でインストールするには：

1. **GPUドライバのインストール**: [公式サイト](https://www.nvidia.cn/Download/index.aspx)から最新のNVIDIAドライバをインストールします。専用GPUがない場合は、この手順をスキップしてください。

2. **Pythonのインストール**: [Windows用Python 3.10+](https://www.python.org/downloads/windows/)をダウンロードし、インストール中に「Add Python to PATH」を有効にしてください。

3. **PyTorchのインストール**: CMDまたはPowerShellを開き、ハードウェアに基づいてPyTorchをインストールします：

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(オプション) Tritonコンパイラのインストール**: Windows上のPyTorchにはTritonサポートが含まれていません。`torch.compile`（PyTorch 2.0で使用可能）を使用したい場合は、サードパーティ製の[triton-windows](https://github.com/woct0rdho/triton-windows)をインストールしてください。パフォーマンス最適化に役立ちますが、必須ではありません。

5. **EvoXのインストール**:

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


> **注:**
> 一部のパッケージには追加のシステム依存関係が必要な場合があります。その場合、インストーラーは次のようなメッセージを表示します：
> ```console
> error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
> ```
>
> このようなメッセージが表示された場合は、指示に従って必要な依存関係をインストールしてから続行してください。


### Linuxでのインストール

Linux（例：Ubuntu）へのEvoXのインストールは簡単で、主に`pip`を介して行われます。

1. **システム依存関係のインストール**: 基本的な開発ツールとPython 3.10以上がインストールされていることを確認してください。パッケージマネージャー（apt, yum）またはAnacondaを使用できます。

2. **GPUドライバのインストール**（GPUを使用する場合）: 適切なパッケージマネージャー（例：`apt`）を使用してNVIDIAドライバをインストールします。`nvidia-smi`でインストールを確認してください。CPUを使用する場合はスキップしてください。

> **注:**
> WSL上では、Linuxサブシステム内にはNVIDIAドライバを**インストールしないでください**。Windows側にインストールしてください。

> **ヒント:**
> ドライバのみをインストールすればよく、CUDAやその他の依存関係をインストールする必要は**ない**可能性が高いです。
> これらのライブラリは、pip経由のPyTorchインストールにすでに含まれています。

> **ヒント:**
> 必要なドライバのバージョンはハードウェアによって異なります。最新のNVIDIA GPUをお持ちの場合、最新のドライババージョンを使用するのが最良の選択であることが多いです。
> 互換性を高め、最新のドライバにアクセスするには、一般的に新しいLinuxディストリビューション（例：Ubuntu 22.04ではなく25.04）を使用することをお勧めします。

1. **PyTorchのインストール**: Windowsと同様に、ハードウェアに基づいてインストールします。[PyTorch公式ガイド](https://pytorch.org)を参照してください。

2. **EvoXのインストール**:

   ```bash
   pip install evox
   ```

   またはextrasを含める場合：

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   これにより、可視化モジュールとニューロエボリューションの依存関係（Braxなど）がインストールされます。`vis`や`neuroevolution`などの個別のextrasを選択することもできます。

#### コンテナインストール (Docker, Podman)

AMD GPUユーザーや環境の分離を求めるユーザーには、Dockerが推奨されます。例えば、ROCmを使用した公式PyTorch Dockerイメージを使用する場合：

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

コンテナ内で、通常通り`pip`を使用してEvoXをインストールします。

## EvoXインストールの確認

EvoXが正しくインストールされていることを確認するには：

- **基本的な確認**: ターミナルまたはPythonシェルで以下を実行します：

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  これにより、PyTorchとシステム構成情報が出力されます。EvoXがエラーなくインポートされれば、インストールは成功です。バージョンを確認することもできます：

  ```python
  import evox
  print(evox.__version__)
  ```

- **オプション設定**: パフォーマンス関連の設定を調整することができます。例：

  - `OMP_NUM_THREADS`などの環境変数を設定してCPUスレッド数を制御する
  - `--shm-size`でDockerの共有メモリを増やす
  - IDE（Jupyter, PyCharmなど）が正しいPython環境を使用していることを確認する

セットアップが完了したら、EvoXを使用して最適化を開始する準備が整いました。