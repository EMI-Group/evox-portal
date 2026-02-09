---
title: "EvoX 安裝指南"
order: 2
section: "install"
---

# EvoX 安裝指南

## 安裝 EvoX

EvoX 已發布於 PyPI，可透過以下方式安裝：

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

您也可以在安裝過程中指定額外的選項，目前可用的選項包括 `vis`、`neuroevolution`、`test`、`docs`、`default`。例如，要安裝包含所有功能的 EvoX，請執行以下指令：

```bash
pip install "evox[vis,neuroevolution]"
```

## 安裝支援加速器的 PyTorch

`evox` 依賴 `torch` 來提供硬體加速。
這些 Python 套件的整體架構如下所示：

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

總結來說，`evox` 是否支援 CPU、Nvidia GPU (CUDA) 或 AMD GPU (ROCm)，取決於所安裝的 PyTorch 版本。請參閱 PyTorch 官方網站以獲取更多安裝協助：[`torch`](https://pytorch.org/)


## Windows 上的 Nvidia GPU 支援

EvoX 透過 PyTorch 支援 GPU 加速。
在 Windows 上使用具備 GPU 加速功能的 PyTorch 有兩種方式：

1. 使用 WSL 2 (Windows Subsystem for Linux) 並在 Linux 端安裝 PyTorch。
2. 直接在 Windows 上安裝 PyTorch。

針對第二種方式，我們提供了一個 [一鍵腳本](/_static/win-install.bat)，用於在全新安裝的 Windows 10/11 64位元系統（配備 Nvidia GPU）上快速部署。該腳本不會使用 WSL 2，而是會在 Windows 上安裝原生的 Pytorch 版本。它還會自動安裝相關應用程式，如 VSCode、Git 和 MiniForge3。

* 請先確保已正確安裝 [Nvidia 驅動程式](https://www.nvidia.com/Download/index.aspx?lang=en-us)。否則腳本將退回至 CPU 模式。
* 執行腳本時，請確保網路連線穩定（需能存取 `github.com` 等網站）。
* 如果腳本因網路問題而失敗，請關閉並重新開啟以繼續安裝。

### Windows 手動安裝

如果您偏好直接在 Windows 上手動安裝 PyTorch，可以按照以下步驟操作：
1. 如上所述安裝 Nvidia 驅動程式。
2. 從 [python.org](https://www.python.org/downloads/) 安裝 Python 3.10 或更高版本。
3. 安裝 PyTorch。
4. （可選）安裝 [`triton-windows`](https://github.com/woct0rdho/triton-windows) 以在 Windows 上支援 `torch.compile`。
5. 安裝 EvoX。

### Windows WSL 2

下載並安裝 [最新的 NVIDIA Windows GPU 驅動程式](https://www.nvidia.com/Download/index.aspx?lang=en-us)。安裝後，您的 WSL 2 將在其 Linux 環境中支援 Nvidia GPU。

> **警告：**
> 請 **勿** 在 WSL 2 內部安裝任何 NVIDIA GPU Linux 驅動程式。請在 Windows 端安裝驅動程式。

```{seealso}
NVIDIA 提供了詳細的 [CUDA on WSL 使用者指南](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## AMD GPU (ROCm) 支援

我們建議使用來自 [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch) 的 Docker 容器。

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## 驗證安裝

開啟 Python 終端機，並執行以下指令：

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```