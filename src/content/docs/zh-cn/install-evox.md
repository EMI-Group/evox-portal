---
title: "EvoX 安装指南"
order: 2
section: "install"
---

# EvoX 安装指南

## 安装 EvoX

EvoX 已发布在 PyPI 上，可以通过以下方式安装：

```bash
# install pytorch first
# for example:
pip install torch

# then install EvoX
pip install "evox[default]"
```

您也可以在安装过程中指定额外的选项，目前可用的选项包括 `vis`、`neuroevolution`、`test`、`docs` 和 `default`。例如，要安装包含所有功能的 EvoX，请运行以下命令：

```bash
pip install "evox[vis,neuroevolution]"
```

## 安装支持硬件加速的 PyTorch

`evox` 依赖 `torch` 来提供硬件加速。
这些 Python 包的整体架构如下所示：

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

总而言之，`evox` 是否支持 CPU、Nvidia GPU (CUDA) 或 AMD GPU (ROCm)，取决于所安装的 PyTorch 版本。请参阅 PyTorch 官网获取更多安装帮助：[`torch`](https://pytorch.org/)


## Windows 上的 Nvidia GPU 支持

EvoX 通过 PyTorch 支持 GPU 加速。
在 Windows 上使用支持 GPU 加速的 PyTorch 有两种方法：

1. 使用 WSL 2 (Windows Subsystem for Linux) 并在 Linux 端安装 PyTorch。
2. 直接在 Windows 上安装 PyTorch。

对于选项 2，我们提供了一个[一键脚本](/_static/win-install.bat)，用于在配备 Nvidia GPU 的全新 Windows 10/11 64位系统上快速部署。该脚本不使用 WSL 2，而是安装 Windows 原生的 PyTorch 版本。它会自动安装 VSCode、Git 和 MiniForge3 等相关应用程序。

* 请确保先正确安装了 [Nvidia 驱动](https://www.nvidia.com/Download/index.aspx?lang=en-us)。否则脚本将回退到 CPU 模式。
* 运行脚本时，请确保网络连接稳定（能够访问 `github.com` 等网站）。
* 如果脚本因网络故障而失败，请关闭并重新打开它以继续安装。

### Windows 手动安装

如果您更喜欢直接在 Windows 上手动安装 PyTorch，可以按照以下步骤操作：
1. 如上所述安装 Nvidia 驱动。
2. 从 [python.org](https://www.python.org/downloads/) 安装 Python 3.10 或更高版本。
3. 安装 PyTorch。
4. (可选) 安装 [`triton-windows`](https://github.com/woct0rdho/triton-windows) 以在 Windows 上支持 `torch.compile`。
5. 安装 EvoX。

### Windows WSL 2

下载并安装[最新的 NVIDIA Windows GPU 驱动](https://www.nvidia.com/Download/index.aspx?lang=en-us)。然后您的 WSL 2 将在其 Linux 环境中支持 Nvidia GPU。

> **警告：**
> **不要**在 WSL 2 内部安装任何 NVIDIA GPU Linux 驱动。请在 Windows 端安装驱动。

```{seealso}
NVIDIA 提供了详细的 [CUDA on WSL 用户指南](https://docs.nvidia.com/cuda/wsl-user-guide/index.html)
```

## AMD GPU (ROCm) 支持

我们建议使用来自 [`rocm/pytorch`](https://hub.docker.com/r/rocm/pytorch) 的 Docker 容器。

```shell
docker run -it --network=host --device=/dev/kfd --device=/dev/dri --group-add=video --ipc=host --cap-add=SYS_PTRACE --security-opt seccomp=unconfined --shm-size 8G -v $HOME/dockerx:/dockerx -w /dockerx rocm/pytorch​:latest
```

## 验证安装

打开 Python 终端，并运行以下命令：

```python
from torch.utils.collect_env import get_pretty_env_info
import evox

print(get_pretty_env_info())
```