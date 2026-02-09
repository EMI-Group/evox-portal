---
title: "多 GPU 與分散式工作流程"
order: 8
section: "experimental"
---

# 多 GPU 與分散式工作流程

EvoX 對分散式工作流程提供了實驗性支援，允許您在多個 GPU 甚至多台機器上執行任何一般的演化演算法。這可以顯著加速最佳化過程，特別是對於耗時的問題。

## 如何使用

要使用分散式工作流程，您需要進行一些設定：
1. 請確保您已手動固定隨機數生成器的種子 (seed)。
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **重要：**
> 請務必在進行任何 torch 或 numpy 操作**之前**設定所有隨機數生成器的種子。這能確保隨機數生成器在執行任何操作前處於已知狀態。
2. 使用 `torch.distributed` 或 `torchrun` 指令來啟動您的腳本。例如：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **提示：**
> `torchrun` 是啟動分散式 torch 程式的推薦方式。如需更多資訊，請參閱 [PyTorch 文件](https://pytorch.org/docs/stable/elastic/run.html)。