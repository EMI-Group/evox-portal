---
title: "多 GPU 与分布式工作流"
order: 8
section: "experimental"
---

# 多 GPU 与分布式工作流

EvoX 对分布式工作流提供了实验性支持，允许你在多个 GPU 甚至多台机器上运行任何常规的进化算法。这可以显著加速优化过程，特别是对于耗时的问题。

## 如何使用

要使用分布式工作流，你需要进行以下设置：
1. 确保你已手动固定随机数生成器的种子。
```python
torch.manual_seed(seed)
# Optional: set the seed for numpy
np.random.seed(seed)
# Optional: use deterministic algorithms
torch.use_deterministic_algorithms(True)
```
> **重要提示：**
> 确保在执行任何 torch 或 numpy 操作**之前**设置所有随机数生成器的种子。这能确保随机数生成器在执行任何操作前处于已知状态。
2. 使用 `torch.distributed` 或 `torchrun` 命令启动你的脚本。例如：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **提示：**
> `torchrun` 是启动分布式 torch 程序的推荐方式。更多信息请参阅 [PyTorch 文档](https://pytorch.org/docs/stable/elastic/run.html)。