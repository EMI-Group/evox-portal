---
title: "多 GPU 与分布式工作流"
order: 8
section: "experimental"
---

# 多 GPU 与分布式工作流

EvoX 对分布式工作流提供了实验性支持，允许你在多个 GPU 甚至多台机器上运行任何常规进化算法。这可以显著加速优化过程，尤其是对于耗时较长的问题。

## 使用方法

要使用分布式工作流，你需要进行以下设置：
1. 确保手动固定随机数生成器的种子。
```python
torch.manual_seed(seed)
# 可选：设置 numpy 的种子
np.random.seed(seed)
# 可选：使用确定性算法
torch.use_deterministic_algorithms(True)
```
> **重要：**
> 确保在任何 torch 或 numpy 操作**之前**设置所有随机数生成器的种子。这可以确保随机数生成器在执行任何操作之前处于已知状态。
2. 使用 `torch.distributed` 或 `torchrun` 命令来启动你的脚本。例如：
```bash
torchrun
    --standalone
    --nnodes=1
    --nproc-per-node=$NUM_GPUS
    your_program.py (--arg1 ... train script args...)
```
> **提示：**
> `torchrun` 是启动分布式 torch 程序的推荐方式。更多信息请参阅 [PyTorch 文档](https://pytorch.org/docs/stable/elastic/run.html)。
