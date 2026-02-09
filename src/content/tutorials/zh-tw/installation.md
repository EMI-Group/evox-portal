---
title: "2. 安裝與環境設定"
order: 2
---

# 2. 安裝與環境設定

在使用 EvoX 之前，您需要正確安裝軟體及其依賴項。本章涵蓋 Windows 和 Linux 的安裝步驟，以及如何準備和配置所需的依賴項。安裝前請確保滿足基本系統需求：**Python 3.10+**、足夠的磁碟空間，以及可選的支援 GPU 和相應的驅動程式。

## 依賴項與準備工作

- **Python 環境**：EvoX 建立在 Python 之上，因此請確保已安裝 Python 3.10 或更高版本。建議使用虛擬環境（如 `venv`）以避免依賴項衝突。

- **PyTorch**：EvoX 使用 PyTorch 進行張量運算和硬體加速。因此，**在安裝 EvoX 之前必須先安裝 PyTorch**。根據您的硬體選擇版本：如果有 NVIDIA GPU，請安裝 CUDA 版本；如果是 AMD GPU，請安裝 ROCm 版本；如果沒有 GPU，則安裝 CPU 版本。請參閱 [PyTorch 官方指南](https://pytorch.org) 獲取相應的指令，例如：

  ```bash
  # For NVIDIA GPUs (CUDA)
  pip install torch torchvision torchaudio

  # For AMD GPUs (ROCm)
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # For CPU-only
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

建議在安裝前將 `pip` 更新至最新版本，並確保網路連線穩定（套件將從 PyPI 下載）。環境準備就緒後，即可安裝 EvoX。

### Windows 安裝

Windows 使用者可以選擇 **自動腳本安裝** 或 **手動安裝**。官方的一鍵安裝程式提供了一種簡單的方法，可以在乾淨的環境中設定 EvoX 及其依賴項，但手動安裝允許更多的控制權。

**選項 1：使用一鍵安裝腳本 (win-install.bat)**
EvoX 為 Windows 10/11 (64-bit) 提供了一個 [快速安裝腳本](/_static/win-install.bat)。該腳本會安裝 Miniforge3（輕量級 Conda）、Python、PyTorch（含 CUDA）、EvoX 以及 VSCode 和 Git 等實用工具。使用方法：

1. 從 EvoX 文件或 GitHub 下載 `win-install.bat`。確保您已安裝 [NVIDIA 驅動程式](https://www.nvidia.com/en-us/drivers/) 並擁有穩定的網路連線。
2. 執行腳本。它不需要管理員權限，但在執行過程中可能會請求權限——請允許。腳本將自動安裝並配置所有內容。
3. 等待完成。成功後，您會看到一條訊息，VSCode 可能會自動開啟。EvoX 及其依賴項將被安裝。

> **注意**：如果腳本因網路問題失敗，請關閉並重新執行。它支援失敗後續傳。

**選項 2：手動安裝**
手動安裝 EvoX：

1. **安裝 GPU 驅動程式**：從 [官方網站](https://www.nvidia.cn/Download/index.aspx) 安裝最新的 NVIDIA 驅動程式。如果沒有獨立 GPU，請跳過此步驟。

2. **安裝 Python**：下載 [適用於 Windows 的 Python 3.10+](https://www.python.org/downloads/windows/)，並在安裝過程中啟用「Add Python to PATH」。

3. **安裝 PyTorch**：開啟 CMD 或 PowerShell，根據您的硬體安裝 PyTorch：

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **(可選) 安裝 Triton 編譯器**：Windows 上的 PyTorch 缺乏 Triton 支援。如果您想使用 `torch.compile`（在 PyTorch 2.0 中可用），請安裝第三方 [triton-windows](https://github.com/woct0rdho/triton-windows)。這是可選的，但對效能優化很有用。

5. **安裝 EvoX**：

   ```bash
   pip install "evox[default]"

   # Optional extras:
   pip install "evox[vis]"           # Visualization support
   pip install "evox[neuroevolution]" # Neuroevolution support
   ```


  `> **注意：**
> 某些套件可能需要額外的系統依賴項。如果是這種情況，安裝程式會提示您類似以下的訊息：console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  當您遇到此類訊息時，請按照提供的說明安裝必要的依賴項，然後再繼續。
  ````


### Linux 安裝

在 Linux（例如 Ubuntu）上安裝 EvoX 非常簡單，主要透過 `pip` 處理。

1. **安裝系統依賴項**：確保已安裝基本的開發工具和 Python 3.10+。您可以使用套件管理器（apt, yum）或 Anaconda。

2. **安裝 GPU 驅動程式**（如果使用 GPU）：使用適當的套件管理器（例如 `apt`）安裝 NVIDIA 驅動程式。使用 `nvidia-smi` 驗證安裝。如果使用 CPU 則跳過。

> **注意：**
> 在 WSL 上，**不要**在 Linux 子系統內安裝 NVIDIA 驅動程式——請在 Windows 端安裝。

> **提示：**
> 您很可能只需要安裝驅動程式，而**不需要**安裝 CUDA 或其他依賴項。
> 這些函式庫已經包含在透過 pip 安裝的 PyTorch 中。

> **提示：**
> 所需的驅動程式版本取決於您的硬體。如果您擁有較新的 NVIDIA GPU，使用最新的驅動程式版本通常是最佳選擇。
> 為了確保更好的相容性並獲取最新的驅動程式，通常建議使用較新的 Linux 發行版（例如 Ubuntu 25.04 而非 22.04）。

1. **安裝 PyTorch**：與 Windows 一樣，根據硬體進行安裝。請參閱 [PyTorch 官方指南](https://pytorch.org)。

2. **安裝 EvoX**：

   ```bash
   pip install evox
   ```

   或者安裝額外組件：

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   這將安裝視覺化模組和神經進化依賴項（如 Brax）。您也可以選擇單獨的額外組件，如 `vis` 或 `neuroevolution`。

#### 容器安裝 (Docker, Podman)

對於 AMD GPU 使用者或尋求環境隔離的使用者，建議使用 Docker。例如，使用帶有 ROCm 的官方 PyTorch Docker 映像檔：

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

在容器內，像往常一樣使用 `pip` 安裝 EvoX。

## 驗證 EvoX 安裝

要驗證 EvoX 是否已正確安裝：

- **基本檢查**：在終端機或 Python shell 中執行：

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  這將列印 PyTorch 和系統配置資訊。如果匯入 EvoX 沒有錯誤，則安裝成功。您也可以檢查版本：

  ```python
  import evox
  print(evox.__version__)
  ```

- **可選設定**：您可以調整與效能相關的設定，例如：

  - 設定環境變數如 `OMP_NUM_THREADS` 以控制 CPU 執行緒數量
  - 使用 `--shm-size` 增加 Docker 共享記憶體
  - 確保您的 IDE（Jupyter, PyCharm 等）使用正確的 Python 環境

設定完成後，您就可以開始使用 EvoX 進行優化了。