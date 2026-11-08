---
title: "EvoX 入门：构建第一个演化工作流"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "通过完整的 EvoX 1.4.1 实验，理解问题、种群、评价与执行如何组成可复用的演化工作流。"
---

本文完成一个小而完整的优化实验：使用 PSO 最小化二维 Ackley 函数，确认执行设备并绘制搜索历史。示例对应 **EvoX 1.4.1 与 PyTorch**，不适用于实验性的 2.x 编译器 API。小规模任务用于理解流程，不作为 GPU 性能基准。

![搜索地形上的候选小球与工作流框架相连](./first-search-workflow.webp)

## 准备独立环境

使用 Python 3.10 或更新版本。创建虚拟环境，再按终端类型激活。

```bash
python -m venv .venv
```

macOS/Linux：

```bash
source .venv/bin/activate
```

Windows PowerShell：

```powershell
.\.venv\Scripts\Activate.ps1
```

## 安装匹配的软件包

根据操作系统与硬件，在 [PyTorch 官方安装页面](https://pytorch.org/get-started/locally/)选择安装命令。CUDA 软件包需要受支持的驱动，安装 EvoX 本身并不保证 GPU 可用。然后安装本文固定版本：

```bash
python -m pip install "evox[vis]==1.4.1"
```

## 运行完整实验

将以下内容保存为 Python 脚本。代码在 CUDA 可用时选择 GPU，否则使用 CPU，打印实际设备，并将算法状态和监控放在所选设备上。固定随机种子有助于重复实验，但跨设备或软件版本仍可能得到不同结果。

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## 理解并可视化结果

PSO 维护候选向量，Ackley 负责评价，StdWorkflow 连接组件，EvalMonitor 记录进展。适应度越小越好，理论最优值为原点处的零。最终数值具有随机性，本示例不承诺固定分数。

搜索结束后，在同一进程中运行以下命令。安装步骤已包含可视化依赖。图片沿用原教程，用于说明曲线形式，不是该随机种子的保证输出。

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## 有目的地扩展实验

逐次修改维度、种群规模或随机种子。自定义问题需要为每个候选解返回目标值。多目标优化还需匹配的算法、目标形状和监控配置，不能只修改一个参数。

计时时应区分编译、预热与稳定执行，对 CUDA 测量进行同步，并使用相同评价预算。小任务可能在 CPU 上更快；先跑通基线，再研究编译优化。

## 教程资源与致谢

原教程由 Boqing Xu、Xinmeng Yu、Bowen Zheng 和 Xinyao Li 编写，Beichen Huang 整理、编辑并上线。下方保留原教程的概览图。

![EvoX overview](./quickstart-8.png)

本示例以[版本源码](https://github.com/EMI-Group/evox/tree/v1.4.1)为依据，更多教程见[文档](https://evox.readthedocs.io/en/latest/)。复制较新资料的 API 前，请先确认其对应版本。

扩展示例前，将软件包版本、实际设备、随机种子和最佳适应度保存在一起。每次修改一个设置，并使用相同预算重跑。转向存在竞争目标的任务时，[EvoMO 解读](/zh-cn/news/gpu-accelerated-emo)介绍了需要增加的选择与评估设计。
