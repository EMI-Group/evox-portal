---
title: "EvoX Compiler：Genesis 构建的显式张量图编译系统"
pubDate: 2026-11-03
summary: "Genesis 的 EvoX Compiler 案例记录了一个 Python 张量图编译器与运行时，提供 NumPy、IREE、XLA 和 TVM 四种执行路径。"
---

EvoX Compiler（evoxc）将程序的计算图变成可检查的产物：前端构建和变换 EvoXIR，再通过显式阶段完成降低、编译、加载与执行。NumPy 是唯一必需依赖，外部编译器负责优化与代码生成。

Genesis 官网 **2026 年 10 月 28 日**的 Evidence 快照记录了 **NumPy、IREE、XLA 和 TVM** 四种执行路径。仓库声明，其代码、测试和文档均使用 Genesis 产出。案例呈现了项目从初次构建走向接口与后端持续开发的过程。

在安装 IREE 的配置下，快照报告 **6,789 项测试通过、46 项跳过、3 项预期失败**，无失败项。这是历史快照，不是当前仓库的测试总数。记录的 **285,659 行受版本控制文本**包含测试、基准数据和文档，不能全部视为编译器源码。模型 token 费用约 **50 美元**，不含硬件。

后端验证结果仍取决于具体配置：记录中的 Vulkan 验证使用软件设备，TVM 的 ROCm 路径仅完成编译验证。结果来自项目方报告，尚未独立复现。开发者可以从仓库里的显式计算图流程及已提交的基准报告开始了解和使用 evoxc。

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
