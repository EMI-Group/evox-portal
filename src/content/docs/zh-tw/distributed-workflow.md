---
title: "多 GPU 與分散式工作流程"
order: 8
section: "experimental"
---

# 多 GPU 與分散式工作流程

EvoX 對分散式工作流程有實驗性支援，允許您在多個 GPU 甚至多台機器上執行任何普通的演化演算法。這可以顯著加速最佳化過程，特別是對於耗時的問題。

## 如何使用

要使用分散式工作流程，您需要設定以下幾項：
1. 確保您已手動固定隨機數產生器的種子。
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **重要：**
> 確保在任何 torch 或 numpy 操作**之前**為所有隨機數產生器設定種子。這確保隨機數產生器在任何操作執行之前處於已知狀態。
2. 使用 `torch.distributed` 或 `torchrun` 命令來啟動您的腳本。例如：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **提示：**
> `torchrun` 是啟動分散式 torch 程式的推薦方式。更多資訊請參見 [PyTorch 文件](https://pytorch.org/docs/stable/elastic/run.html)。
