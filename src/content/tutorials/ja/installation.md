---
title: "2. インストールと環境設定"
order: 2
---

# 2. インストールと環境設定

EvoXを使用する前に、ソフトウェアとその依存関係を適切にインストールする必要があります。この章では、WindowsとLinuxの両方のインストール手順、および必要な依存関係の準備と設定方法について説明します。インストール前に基本的なシステム要件を満たしていることを確認してください：**Python 3.10以上**、十分なディスク容量、およびオプションで適切なドライバーを備えたサポートされたGPU。

## 依存関係と準備

- **Python環境**: EvoXはPython上に構築されているため、Python 3.10以上がインストールされていることを確認してください。依存関係の競合を避けるために、仮想環境（`venv`など）の使用を推奨します。

- **PyTorch**: EvoXはテンソル演算とハードウェアアクセラレーションにPyTorchを使用します。そのため、**EvoXをインストールする前にPyTorchをインストールする必要があります**。ハードウェアに基づいてバージョンを選択してください：NVIDIA GPUがある場合はCUDAバージョン、AMD GPUの場合はROCmバージョン、GPUがない場合はCPUバージョンをインストールします。適切なコマンドについては[PyTorch公式ガイド](https://pytorch.org)を参照してください。例：

  ```bash
  # NVIDIA GPU（CUDA）の場合
  pip install torch torchvision torchaudio

  # AMD GPU（ROCm）の場合
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # CPUのみの場合
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

インストール前に`pip`を最新バージョンに更新し、安定したインターネット接続を確保することを推奨します（パッケージはPyPIからダウンロードされます）。環境が準備できたら、EvoXをインストールできます。

### Windowsでのインストール

Windowsユーザーは**自動スクリプトインストール**または**手動インストール**を選択できます。公式のワンクリックインストーラーは、クリーンな環境でEvoXとその依存関係を簡単にセットアップする方法を提供しますが、手動インストールではより多くの制御が可能です。

**オプション1：ワンクリックインストールスクリプト（win-install.bat）の使用**
EvoXはWindows 10/11（64ビット）用の[クイックインストールスクリプト](/_static/win-install.bat)を提供しています。このスクリプトはMiniforge3（軽量Conda）、Python、PyTorch（CUDA付き）、EvoX、およびVSCodeやGitなどの便利なツールをインストールします。使用方法：

1. EvoXのドキュメントまたはGitHubから`win-install.bat`をダウンロードします。[NVIDIAドライバー](https://www.nvidia.com/en-us/drivers/)がインストールされており、安定したインターネット接続があることを確認してください。
2. スクリプトを実行します。管理者権限は不要ですが、実行中に許可を求められる場合があります。許可してください。スクリプトはすべてを自動的にインストールおよび設定します。
3. 完了を待ちます。成功すると、メッセージが表示され、VSCodeが開く場合があります。EvoXとその依存関係がインストールされます。

> **注意**: ネットワークの問題でスクリプトが失敗した場合は、閉じて再実行してください。失敗時の再開をサポートしています。

**オプション2：手動インストール**
EvoXを手動でインストールするには：

1. **GPUドライバーのインストール**: [公式ウェブサイト](https://www.nvidia.cn/Download/index.aspx)から最新のNVIDIAドライバーをインストールします。専用GPUがない場合は、このステップをスキップしてください。

2. **Pythonのインストール**: [Windows用Python 3.10以上](https://www.python.org/downloads/windows/)をダウンロードし、インストール時に「Add Python to PATH」を有効にしてください。

3. **PyTorchのインストール**: CMDまたはPowerShellを開き、ハードウェアに基づいてPyTorchをインストールします：

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **（オプション）Tritonコンパイラのインストール**: WindowsのPyTorchにはTritonサポートがありません。`torch.compile`（PyTorch 2.0で利用可能）を使用したい場合は、サードパーティの[triton-windows](https://github.com/woct0rdho/triton-windows)をインストールしてください。オプションですが、パフォーマンス最適化に便利です。

5. **EvoXのインストール**:

   ```bash
   pip install "evox[default]"

   # オプションのエクストラ：
   pip install "evox[vis]"           # 可視化サポート
   pip install "evox[neuroevolution]" # ニューロエボリューションサポート
   ```


  `> **注意:**
> 一部のパッケージには追加のシステム依存関係が必要な場合があります。その場合、インストーラーは次のようなメッセージを表示します：console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  このようなメッセージが表示された場合は、提供された指示に従って必要な依存関係をインストールしてから続行してください。
  ````


### Linuxでのインストール

Linux（例：Ubuntu）へのEvoXのインストールは簡単で、主に`pip`で処理されます。

1. **システム依存関係のインストール**: 基本的な開発ツールとPython 3.10以上がインストールされていることを確認してください。パッケージマネージャー（apt、yum）またはAnacondaを使用できます。

2. **GPUドライバーのインストール**（GPUを使用する場合）: 適切なパッケージマネージャー（例：`apt`）を使用してNVIDIAドライバーをインストールします。`nvidia-smi`でインストールを確認してください。CPUを使用する場合はスキップしてください。

> **注意:**
> WSLでは、Linuxサブシステム内にNVIDIAドライバーをインストール**しないでください**。Windows側にインストールしてください。

> **ヒント:**
> ドライバーのインストールのみが必要で、CUDAやその他の依存関係のインストールは不要な場合がほとんどです。
> これらのライブラリはpip経由のPyTorchインストールに既に含まれています。

> **ヒント:**
> 必要なドライバーバージョンはハードウェアに依存します。最近のNVIDIA GPUをお持ちの場合、最新のドライバーバージョンを使用するのが最良の選択であることが多いです。
> より良い互換性と最新のドライバーへのアクセスを確保するために、一般的に新しいLinuxディストリビューション（例：22.04ではなくUbuntu 25.04）を使用することをお勧めします。

1. **PyTorchのインストール**: Windowsと同様に、ハードウェアに基づいてインストールします。[PyTorch公式ガイド](https://pytorch.org)を参照してください。

2. **EvoXのインストール**:

   ```bash
   pip install evox
   ```

   またはエクストラ付き：

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   これにより、可視化モジュールとニューロエボリューション依存関係（Braxなど）がインストールされます。`vis`や`neuroevolution`などの個別のエクストラを選択することもできます。

#### コンテナインストール（Docker、Podman）

AMD GPUユーザーや環境の分離を求める方には、Dockerを推奨します。例えば、ROCm付きの公式PyTorch Dockerイメージを使用する場合：

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

コンテナ内で、通常通り`pip`を使用してEvoXをインストールします。

## EvoXインストールの確認

EvoXが正しくインストールされていることを確認するには：

- **基本チェック**: ターミナルまたはPythonシェルで以下を実行します：

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  これによりPyTorchとシステム設定情報が表示されます。EvoXがエラーなくインポートされれば、インストールは成功です。バージョンも確認できます：

  ```python
  import evox
  print(evox.__version__)
  ```

- **オプション設定**: パフォーマンス関連の設定を調整できます。例えば：

  - `OMP_NUM_THREADS`などの環境変数を設定してCPUスレッド数を制御
  - `--shm-size`でDockerの共有メモリを増加
  - IDE（Jupyter、PyCharmなど）が正しいPython環境を使用していることを確認

セットアップが完了したら、EvoXで最適化を開始する準備が整いました。
