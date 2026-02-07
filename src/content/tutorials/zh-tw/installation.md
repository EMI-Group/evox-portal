---
title: "2. 安裝與環境設定"
order: 2
---

# 2. 安裝與環境設定

在使用 EvoX 之前，您需要正確安裝軟體及其相依套件。本章涵蓋 Windows 和 Linux 的安裝步驟，以及如何準備和配置所需的相依項目。安裝前請確保您滿足基本系統需求：**Python 3.10+**、足夠的磁碟空間，以及可選的支援 GPU 和相應驅動程式。

## 相依項目與準備工作

- **Python 環境**：EvoX 基於 Python 建構，因此請確保已安裝 Python 3.10 或更高版本。建議使用虛擬環境（如 `venv`）以避免相依性衝突。

- **PyTorch**：EvoX 使用 PyTorch 進行張量運算和硬體加速。因此，**必須在安裝 EvoX 之前先安裝 PyTorch**。根據您的硬體選擇版本：如果有 NVIDIA GPU 則安裝 CUDA 版本，AMD GPU 則安裝 ROCm 版本，沒有 GPU 則安裝 CPU 版本。請參考 [PyTorch 官方指南](https://pytorch.org) 獲取相應的命令，例如：

  ```bash
  # 適用於 NVIDIA GPU（CUDA）
  pip install torch torchvision torchaudio

  # 適用於 AMD GPU（ROCm）
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/rocm6.2.4

  # 僅 CPU
  pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu
  ```

建議在安裝前將 `pip` 更新到最新版本，並確保網路連線穩定（套件將從 PyPI 下載）。環境準備就緒後，即可安裝 EvoX。

### 在 Windows 上安裝

Windows 使用者可以選擇**自動腳本安裝**或**手動安裝**。官方一鍵安裝程式提供了在乾淨環境中設定 EvoX 及其相依項目的簡便方式，但手動安裝可以提供更多控制。

**選項 1：使用一鍵安裝腳本（win-install.bat）**
EvoX 為 Windows 10/11（64 位元）提供了[快速安裝腳本](/_static/win-install.bat)。該腳本會安裝 Miniforge3（輕量級 Conda）、Python、PyTorch（含 CUDA）、EvoX，以及 VSCode 和 Git 等實用工具。使用方法：

1. 從 EvoX 文件或 GitHub 下載 `win-install.bat`。確保已安裝 [NVIDIA 驅動程式](https://www.nvidia.com/en-us/drivers/) 並有穩定的網路連線。
2. 執行腳本。它不需要管理員權限，但執行過程中可能會請求許可——請允許。腳本將自動安裝和配置所有內容。
3. 等待完成。成功後，您會看到一條訊息，VSCode 可能會開啟。EvoX 及其相依項目將已安裝完成。

> **注意**：如果腳本因網路問題而失敗，請關閉後重新執行。它支援失敗後繼續。

**選項 2：手動安裝**
手動安裝 EvoX：

1. **安裝 GPU 驅動程式**：從[官方網站](https://www.nvidia.cn/Download/index.aspx)安裝最新的 NVIDIA 驅動程式。如果沒有獨立 GPU，請跳過此步驟。

2. **安裝 Python**：下載 [Python 3.10+ Windows 版](https://www.python.org/downloads/windows/)，安裝時啟用「Add Python to PATH」。

3. **安裝 PyTorch**：開啟 CMD 或 PowerShell，根據您的硬體安裝 PyTorch：

   ```bash
   pip install torch torchvision torchaudio
   ```

4. **（可選）安裝 Triton 編譯器**：Windows 上的 PyTorch 缺少 Triton 支援。如果您想使用 `torch.compile`（PyTorch 2.0 提供），請安裝第三方 [triton-windows](https://github.com/woct0rdho/triton-windows)。可選但對效能最佳化有用。

5. **安裝 EvoX**：

   ```bash
   pip install "evox[default]"

   # 可選的額外功能：
   pip install "evox[vis]"           # 視覺化支援
   pip install "evox[neuroevolution]" # 神經演化支援
   ```


  `> **注意：**
> 某些套件可能需要額外的系統相依項目。如果是這種情況，安裝程式會提示您類似以下的訊息：console
  error: Microsoft Visual C++ 14.0 or greater is required. Get it with "Microsoft C++ Build Tools": https://visualstudio.microsoft.com/visual-cpp-build-tools/
  ```

  當您遇到此類訊息時，請按照提供的說明安裝必要的相依項目後再繼續。
  ````


### 在 Linux 上安裝

在 Linux（如 Ubuntu）上安裝 EvoX 非常簡單，主要透過 `pip` 處理。

1. **安裝系統相依項目**：確保已安裝基本開發工具和 Python 3.10+。您可以使用套件管理器（apt、yum）或 Anaconda。

2. **安裝 GPU 驅動程式**（如果使用 GPU）：使用適當的套件管理器（如 `apt`）安裝 NVIDIA 驅動程式。使用 `nvidia-smi` 驗證安裝。如果使用 CPU 則跳過。

> **注意：**
> 在 WSL 上，**不要**在 Linux 子系統內安裝 NVIDIA 驅動程式——請在 Windows 端安裝。

> **提示：**
> 您很可能只需要安裝驅動程式，而不需要安裝 CUDA 或其他相依項目。
> 這些函式庫已包含在透過 pip 安裝的 PyTorch 中。

> **提示：**
> 所需的驅動程式版本取決於您的硬體。如果您有較新的 NVIDIA GPU，使用最新的驅動程式版本通常是最佳選擇。
> 為了確保更好的相容性和存取最新的驅動程式，通常建議使用較新的 Linux 發行版（例如 Ubuntu 25.04 而非 22.04）。

1. **安裝 PyTorch**：與 Windows 相同，根據硬體安裝。請參考 [PyTorch 官方指南](https://pytorch.org)。

2. **安裝 EvoX**：

   ```bash
   pip install evox
   ```

   或帶有額外功能：

   ```bash
   pip install evox[vis,neuroevolution]
   ```

   這會安裝視覺化模組和神經演化相依項目（如 Brax）。您也可以選擇單獨的額外功能，如 `vis` 或 `neuroevolution`。

#### 容器安裝（Docker、Podman）

對於 AMD GPU 使用者或需要環境隔離的使用者，建議使用 Docker。例如，使用帶有 ROCm 的官方 PyTorch Docker 映像：

```bash
docker run -it --gpus all --shm-size=8g rocm/pytorch:latest
```

在容器內，照常使用 `pip` 安裝 EvoX。

## 驗證 EvoX 安裝

要驗證 EvoX 是否正確安裝：

- **基本檢查**：在終端機或 Python shell 中執行：

  ```python
  from torch.utils.collect_env import get_pretty_env_info
  import evox
  print(get_pretty_env_info())
  ```

  這會列印 PyTorch 和系統配置資訊。如果 EvoX 匯入時沒有錯誤，則安裝成功。您也可以檢查版本：

  ```python
  import evox
  print(evox.__version__)
  ```

- **可選設定**：您可以調整與效能相關的設定，例如：

  - 設定環境變數如 `OMP_NUM_THREADS` 來控制 CPU 執行緒數
  - 使用 `--shm-size` 增加 Docker 共享記憶體
  - 確保您的 IDE（Jupyter、PyCharm 等）使用正確的 Python 環境

設定完成後，您就可以開始使用 EvoX 進行最佳化了。
