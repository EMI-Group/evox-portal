---
title: "2. 安装与环境配置"
order: 2
---

# 2. 安装与环境配置

在使用 EvoX 之前，您需要正确安装软件及其依赖项。本章涵盖了 Windows 和 Linux 的安装步骤，以及如何准备和配置所需的依赖项。安装前请确保满足基本系统要求：**Python 3.10+**、足够的磁盘空间，以及可选的支持 GPU 和相应的驱动程序。

## 依赖项与准备工作

- **Python 环境**：EvoX 基于 Python 构建，因此请确保安装了 Python 3.10 或更高版本。建议使用虚拟环境（如 `venv`）以避免依赖冲突。

- **PyTorch**：EvoX 使用 PyTorch 进行张量运算和硬件加速。因此，**在安装 EvoX 之前必须先安装 PyTorch**。根据您的硬件选择版本：如果有 NVIDIA GPU，请安装 CUDA 版本；如果是 AMD GPU，请安装 ROCm 版本；如果没有 GPU，请安装 CPU 版本。请参考 [PyTorch 官方指南](https://pytorch.org) 获取相应的命令，例如：

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

建议在安装前将 `pip` 更新到最新版本，并确保网络连接稳定（软件包将从 PyPI 下载）。环境准备就绪后，即可安装 EvoX。

### Windows 安装

Windows 用户可以选择 **自动脚本安装** 或 **手动安装**。官方的一键安装程序提供了一种简单的方法，可以在干净的环境中设置 EvoX 及其依赖项，但手动安装允许更多的控制权。

**选项 1：使用一键安装脚本 (win-install.bat)**
EvoX 为 Windows 10/11 (64-bit) 提供了一个 [快速安装脚本](/_static/win-install.bat)。该脚本会安装 Miniforge3（轻量级 Conda）、Python、PyTorch (CUDA 版)、EvoX 以及 VSCode 和 Git 等实用工具。使用方法：

1. 从 EvoX 文档或 GitHub 下载 `win-install.bat`。确保已安装 [NVIDIA 驱动](https://www.nvidia.com/en-us/drivers/) 并保持网络连接稳定。
2. 运行脚本。它不需要管理员权限，但在执行过程中可能会请求权限——请允许。脚本将自动安装和配置所有内容。
3. 等待完成。成功后，您会看到一条消息，VSCode 可能会自动打开。EvoX 及其依赖项即安装完毕。

> **注意**：如果脚本因网络问题失败，请关闭并重新运行。它支持断点续传。

**选项 2：手动安装**
要手动安装 EvoX：

1. **安装 GPU 驱动**：从 [官方网站](https://www.nvidia.cn/Download/index.aspx) 安装最新的 NVIDIA 驱动。如果没有独立 GPU，请跳过此步骤。

2. **安装 Python**：下载 [Python 3.10+ for Windows](https://www.python.org/downloads/windows/) 并在安装过程中勾选 “Add Python to PATH”。

3. **安装 PyTorch**：打开 CMD 或 PowerShell，根据您的硬件安装 PyTorch：

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(可选) 安装 Triton 编译器**：Windows 上的 PyTorch 缺少 Triton 支持。如果您想使用 `torch.compile`（在 PyTorch 2.0 中可用），请安装第三方的 [triton-windows](https://github.com/woct0rdho/triton-windows)。这是可选的，但对性能优化很有用。

5. **安装 EvoX**：

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


> **注意：**
> 某些软件包可能需要额外的系统依赖项。如果是这种情况，安装程序会提示类似以下的消息：
> ```console
> error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
> ```
> 遇到此类消息时，请按照提供的说明安装必要的依赖项，然后再继续。


### Linux 安装

在 Linux（如 Ubuntu）上安装 EvoX 非常简单，主要通过 `pip` 处理。

1. **安装系统依赖**：确保已安装基本的开发工具和 Python 3.10+。您可以使用包管理器（apt, yum）或 Anaconda。

2. **安装 GPU 驱动**（如果使用 GPU）：使用相应的包管理器（如 `apt`）安装 NVIDIA 驱动。使用 `nvidia-smi` 验证安装。如果使用 CPU，请跳过。

> **注意：**
> 在 WSL 上，**不要**在 Linux 子系统内安装 NVIDIA 驱动——请在 Windows 端安装。

> **提示：**
> 很可能您只需要安装驱动程序，而**不需要**安装 CUDA 或其他依赖项。
> 这些库已经包含在通过 pip 安装的 PyTorch 中。

> **提示：**
> 所需的驱动程序版本取决于您的硬件。如果您拥有较新的 NVIDIA GPU，使用最新的驱动程序版本通常是最佳选择。
> 为了确保更好的兼容性并获取最新的驱动程序，通常建议使用较新的 Linux 发行版（例如 Ubuntu 25.04 而不是 22.04）。

1. **安装 PyTorch**：与 Windows 一样，根据硬件进行安装。请参考 [PyTorch 官方指南](https://pytorch.org)。

2. **安装 EvoX**：

   ```bash
   pip install evox
   ```

   或者安装扩展功能：

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   这将安装可视化模块和神经进化依赖项（如 Brax）。您也可以选择单独的扩展，如 `vis` 或 `neuroevolution`。

#### 容器安装 (Docker, Podman)

对于 AMD GPU 用户或寻求环境隔离的用户，建议使用 Docker。例如，使用带有 ROCm 的官方 PyTorch Docker 镜像：

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

在容器内，像往常一样使用 `pip` 安装 EvoX。

## 验证 EvoX 安装

要验证 EvoX 是否已正确安装：

- **基本检查**：在终端或 Python shell 中运行：

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  这将打印 PyTorch 和系统配置信息。如果导入 EvoX 没有报错，则安装成功。您还可以检查版本：

  ```python
  import evox
  print(evox.__version__)
  ```

- **可选设置**：您可以调整与性能相关的设置，例如：

  - 设置环境变量（如 `OMP_NUM_THREADS`）以控制 CPU 线程数
  - 使用 `--shm-size` 增加 Docker 共享内存
  - 确保您的 IDE（Jupyter, PyCharm 等）使用正确的 Python 环境

设置完成后，您就可以开始使用 EvoX 进行优化了。