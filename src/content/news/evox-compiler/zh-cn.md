---
title: "EvoX Compiler v0.1.0：让程序在运行之前就可检查"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "显式计算图、可组合变换与独立执行阶段，让研究者能够检查程序结构，并将多个候选程序合并评估。"
---

当搜索的候选对象本身就是程序，只检查最终输出，会让实验中的许多环节隐而不见。EvoX Compiler 把程序本身变成可检查的对象：研究者可以保留计算图、施加变换，再通过清晰分开的阶段选择执行后端。

![展开程序结构以检查编译过程](./evoxc-visible-stages.webp)

*概念插画：从程序定义到执行，中间结构清晰可见。*

**EvoX Compiler（evoxc）v0.1.0** 于 2026 年 10 月 29 日发布。这套 Python 张量图前端与运行时要求 Python 3.11 或更新版本，采用 Apache-2.0 许可。 [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## 从定义走向可检查的可执行对象

处理流程是 `trace → lower → compile → load → run`：追踪阶段根据程序定义和输入规格构建 EvoXIR 图；表示转换阶段准备后端表示；编译生成产物；加载将产物绑定到执行设备；运行阶段提供实际数据。每一步都有可检查的对象。

这种分离有助于定位问题：计算图无效、算子无法转换和设备不匹配，是不同层面的问题。图与受支持的编译产物也可以保存。优化、调度与代码生成由外部编译器负责，evoxc 提供前端与阶段间的接口约定。

## 把一组候选程序放进同一张图

`vmap`、`grad`、`jvp`、`vjp` 等变换生成新的图，可以在执行前组合。对于程序空间搜索，[`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) 能将输入输出规格匹配的候选函数组合成一个种群计算图。

这适用于遗传编程、神经架构搜索和算法合成：候选对象可能是不同程序，而不只是不同参数向量。合并有机会减少重复编译与调用开销，但收益取决于程序结构和后端，并非任何种群都会自动加速。

## 按所需运算选择后端

NumPy 是唯一必需依赖，提供参考 CPU 解释器。可选适配器连接 IREE、通过用户提供的 PJRT 插件使用的 XLA，以及通过 StableHLO 前端接入的 TVM。后端可用，不等于算子与硬件覆盖完全一致。

版本 README 记录的 Vulkan 验证使用 Mesa lavapipe 软件设备，TVM ROCm 只完成了编译验证。GPU 输入和设备放置需要显式处理；将 CPU 图迁移到其他目标前，应先核对适配器的算子支持范围。

## 先在 CPU 上运行，再迁移计算图

安装固定版本，运行 README 的 CPU 示例，检查图结构，再选择编译后端：

```bash
pip install evoxc==0.1.0
```

独立的 HuggingFace 集成以 `evoxc-hf` 安装，拥有自己的发行包与升级周期。

## 结合环境理解验证结果

在安装文档所列扩展依赖的环境中，版本 README 报告核心与集成测试共 **7,511 项通过、77 项跳过、4 项预期失败**，没有非预期失败。跳过项包括硬件与依赖条件检查。仓库注明代码、测试和文档均由 Genesis 生成。

API 与支持矩阵见[版本 README](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md)，发布产物见[版本记录](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)，后续开发见 [GitHub](https://github.com/EMI-Group/evoxc)。

编译器背后的智能体开发过程，见 [Genesis 与 EvoX Compiler](/zh-cn/news/genesis-evoxc)。开始自己的实验时，可以保留一张参考图，逐步检查变换，再比较不同后端的行为。
