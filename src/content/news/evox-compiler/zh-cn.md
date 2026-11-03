---
title: "EvoX Compiler v0.1.0 发布：显式计算图，多后端执行"
pubDate: 2026-10-29
summary: "EvoX Compiler 首个版本为 Python 带来可检查的计算图、可组合的图变换，以及 NumPy、IREE、XLA 和 TVM 执行路径。"
---

**EvoX Compiler（evoxc）v0.1.0 于 2026 年 10 月 29 日发布。** 这是一套 Python 张量图编译器与运行时，面向希望直接检查、变换、保存和执行程序本身的开发者。项目采用 Apache-2.0 许可证，要求 Python 3.11 或更高版本。

## 让计算过程成为可检查的程序

evoxc 通过 `trace → lower → compile → load → run` 显式开放各个阶段。前端以 EvoXIR 表达计算，并导出 StableHLO 交给外部编译器完成优化与代码生成。中间计算图和编译产物可以保留下来，供检查与持久化存储。

图变换包括 `vmap`、`grad`、`jvp` 和 `vjp`。针对神经架构搜索、遗传编程与算法合成，`batch_functions` 可将输入输出规格一致的候选程序合并为一个计算图；显式编译缓存则服务于反复生成静态程序的工作负载。

## 四种执行路径

NumPy 是唯一必需依赖，并提供默认 CPU 解释执行路径。可选适配器将计算图连接至 IREE、通过用户提供的 PJRT 插件接入的 XLA，以及 TVM。后端和设备由开发者显式选择，算子与硬件覆盖范围取决于适配器。发布文档中的 Vulkan 验证使用 Mesa lavapipe，TVM 的 ROCm 支持仅验证到编译阶段。

发布版 README 报告，在安装 IREE、TVM 和 torch 的配置下，核心与 `evoxc_hf` 两套测试共 **7,511 项通过、77 项跳过、4 项预期失败、0 项失败**。这是项目方在该配置下报告的结果。仓库同时注明，其代码、测试和文档均使用 EvoX Genesis 产出。

## 开始使用

可使用下方命令安装该发布版本。可选编译器适配器的配置见对应版本 README；HuggingFace 集成以 `evoxc-hf` 独立分发。

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
