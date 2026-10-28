<h1 align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/source/_static/evox_brand_light.svg">
    <source media="(prefers-color-scheme: light)" srcset="docs/source/_static/evox_brand_dark.svg">
    <img alt="EvoX Logo" height="128" width="500px" src="docs/source/_static/evox_brand_dark.svg">
  </picture>
</h1>

<h3 align="center">面向演化式 AI 系统的基础设施</h3>
<p align="center">
  <em>让智能跨越数字与物理世界，持续适应、创造与演化。</em>
</p>

<div align="center">
  <a href="https://evox.group/zh-cn"><img src="https://img.shields.io/badge/website-evox.group-0d9488" alt="官方网站"></a>
  <a href="https://evox.group/zh-cn/libs"><img src="https://img.shields.io/badge/ecosystem-15%2B%20projects-2563eb" alt="生态系统"></a>
  <a href="https://evox.readthedocs.io/zh_CN/latest/index.html"><img src="https://img.shields.io/badge/readthedocs-docs-green?logo=readthedocs" alt="文档"></a>
  <a href="https://discord.gg/Vbtgcpy7G4"><img src="https://img.shields.io/badge/discord-evox-%235865f2?logo=discord" alt="Discord 社区"></a>
  <a href="https://qm.qq.com/q/vTPvoMUGAw"><img src="https://img.shields.io/badge/QQ-297969717-%231db4f4?logo=tencentqq" alt="QQ 群"></a>
</div>

<p align="center">
  <a href="#02--生态系统-ecosystem"><strong>生态系统</strong></a> ·
  <a href="#03--架构总览-architecture"><strong>架构总览</strong></a> ·
  <a href="https://evox.group/zh-cn"><strong>官方网站</strong></a> ·
  <a href="https://evox.readthedocs.io/zh_CN/latest/index.html"><strong>文档</strong></a>
</p>

<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-f6f5f4" alt="English README"></a>
  <a href="./README_ZH.md"><img src="https://img.shields.io/badge/简体中文-f6f5f4" alt="中文 README"></a>
</p>

---

## 01 · 简介 (Introduction)

**EvoX** 是面向演化式 AI 系统的开源基础设施。它汇集了一组库、一个编译器和若干端到端系统，把同一个循环——*生成候选、真实评估、保留有效方案并在此基础上继续构建*——应用到模型、智能体、机器人、科学设计与优化之中。

- **一个循环，五大应用方向**——生成式 AI、智能体 AI、物理 AI、AI for Science 与优化。
- **15+ 个开源项目**，整个生态合计 **140+ 种演化算法**与 **240+ 个基准问题 / 环境**。
- **统一的编译路径**——EvoX Compiler 将显式张量计算图经由 IREE、XLA 与 TVM 编译到 CPU、NVIDIA 与 AMD GPU，以及 Vulkan GPU（包括 ARM Mali、高通 Adreno 等移动端与边缘端 GPU）。
- **天然面向异构硬件**——从笔记本 CPU 到 GPU 服务器、移动 GPU 与集群。

---

## 02 · 生态系统 (Ecosystem)

| 方向 | 生态覆盖的内容 | 项目 |
| :--- | :--- | :--- |
| **生成式 AI** | 演化模型本身——模型融合、生成式优化与架构搜索。 | [EvoGM](https://github.com/EMI-Group/evogm) · [EvoNAS](https://github.com/EMI-Group/evonas) · [EvoXBench](https://github.com/EMI-Group/evoxbench) |
| **智能体 AI** | 由协作智能体驱动的长周期、自主软件演化。 | [EvoX Genesis](https://genesis.evox.group) · [EvoGit](https://github.com/BillHuang2001/evogit) |
| **物理 AI** | 通过大规模并行仿真演化控制策略与神经网络拓扑。 | [EvoRL](https://github.com/EMI-Group/evorl) · [TensorNEAT](https://github.com/EMI-Group/tensorneat) |
| **AI for Science** | 面向科学与工程设计的数据驱动黑盒优化。 | [EvoGO](https://github.com/EMI-Group/evogo) |
| **优化** | GPU 加速的演化算法、多目标优化、遗传编程与自动化算法设计。 | [EvoX](https://github.com/EMI-Group/evox) · [EvoMO](https://github.com/EMI-Group/evomo) · [EvoGP](https://github.com/EMI-Group/evogp) · [MetaDE](https://github.com/EMI-Group/metade) · [iStratDE](https://github.com/EMI-Group/istratde) · [AutoPSO](https://github.com/EMI-Group/autopso) · [EvoCmo](https://github.com/785509490/EvoCmo) · [EvoCoCo](https://github.com/EMI-Group/evococo) |
| **编译器与基础设施** | 借助外部机器学习编译器，将显式张量计算图编译到异构硬件。 | [EvoX Compiler（evoxc）](https://github.com/EMI-Group/evoxc) |

每个项目都是拥有独立文档的独立仓库。全部项目见 [**evox.group/zh-cn/libs**](https://evox.group/zh-cn/libs)。

---

## 03 · 架构总览 (Architecture)

<p align="center">
  <img src="docs/source/_static/evox_architecture.svg" alt="EvoX 生态架构" width="840">
</p>

| 层级 | 作用 |
| :--- | :--- |
| **应用层（Applications）** | EvoX 面向的问题：生成式 AI、智能体 AI、物理 AI、AI for Science 与优化。 |
| **EvoX 库（EvoX Libraries）** | 一组相互独立的项目，各自聚焦一类问题。 |
| **编译器与运行时（Compiler & Runtime）** | **EvoX Compiler** 负责显式、可检查的张量计算图及其变换，并将 StableHLO 交给 IREE、XLA 或 TVM 完成优化与代码生成；各项目也运行在 **PyTorch** 与 **JAX** 运行时之上。 |
| **异构硬件（Heterogeneous Hardware）** | CPU、NVIDIA 与 AMD GPU、Vulkan GPU（含 ARM Mali、高通 Adreno）、Apple Silicon、华为昇腾与集群。 |

> 上图表达的是各部分之间的关系，而非一套必须整体采用的技术栈——每个项目会说明自己使用的运行时或编译路径。

---

## 04 · 硬件支持与验证范围 (Hardware Support)

| 硬件 | 状态 | 方式 |
| :--- | :--- | :--- |
| **CPU** | 支持 | PyTorch / JAX · EvoX Compiler（numpy 解释器、IREE、TVM） |
| **NVIDIA GPU** | 支持 | 通过 PyTorch / JAX 使用 CUDA · EvoX Compiler 经由 IREE 或 XLA |
| **AMD GPU** | 支持 | 通过 PyTorch 使用 ROCm · EvoX Compiler 经由 IREE 或 XLA |
| **Vulkan GPU**（含 ARM Mali、高通 Adreno） | 通过 EvoX Compiler 支持 | IREE Vulkan-SPIRV，覆盖桌面、移动与边缘设备 |
| **Apple Silicon** | 通过 MPS 支持 | PyTorch MPS（Eager 模式）；`torch.compile` 受上游后端限制 |
| **华为昇腾 (Huawei Ascend)** | 项目级验证 | 已在特定算子与项目工作流上验证，并非全生态范围 |
| **多设备 / 集群** | 实验性 | `torch.distributed`；编译器中的集合通信为显式图算子，尚未被任何后端编译 |

具体支持范围因项目而异，以各仓库自身说明为准。

---

## 05 · 资源 (Resources)

- **网站**：[evox.group](https://evox.group/zh-cn) · [生态系统](https://evox.group/zh-cn/libs) · [新闻](https://evox.group/zh-cn/news)
- **文档**：[EvoX 中文文档](https://evox.readthedocs.io/zh_CN/latest/index.html) · [English Docs](https://evox.readthedocs.io/en/latest/index.html)
- **社区**：[GitHub Discussions](https://github.com/EMI-Group/evox/discussions) · [Discord](https://discord.gg/Vbtgcpy7G4) · [QQ 群](https://qm.qq.com/q/vTPvoMUGAw)（`297969717`）

### 引用 (Citation)

如果 EvoX 对你的工作有所帮助，请引用：

```bibtex
@article{evox,
  title   = {{EvoX}: {A} {Distributed} {GPU}-accelerated {Framework} for {Scalable} {Evolutionary} {Computation}},
  author  = {Huang, Beichen and Cheng, Ran and Li, Zhuozhao and Jin, Yaochu and Tan, Kay Chen},
  journal = {IEEE Transactions on Evolutionary Computation},
  year    = {2024},
  doi     = {10.1109/TEVC.2024.3388550}
}
```

各项目的论文请见其各自仓库。

### 开源协议 (License)

各项目的开源协议在其各自仓库中设定。本仓库的协议见 [LICENSE](./LICENSE)。
