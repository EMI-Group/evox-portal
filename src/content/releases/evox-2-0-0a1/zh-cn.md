---
title: "EvoX v2.0.0a1：基于 EvoX Compiler 的全新重构"
pubDate: 2026-10-30
summary: "实验性 Alpha 版本带来新的函数式 API 和显式张量图编译器。生产使用仍推荐稳定的 1.x 系列。"
---

![展开程序结构以检查编译过程](./experimental-compiler-runtime.webp)

**EvoX v2.0.0a1** 是基于 [EvoX Compiler（`evoxc`）](https://github.com/EMI-Group/evoxc) 完全重写后的首个 Alpha 版本。

> **实验性预发布版本：** 新 API 与 1.x 不兼容，无法直接替换升级。生产使用仍推荐稳定的 1.x 系列；请在独立环境中试用 Alpha。

## 显式编译流水线

EvoX Compiler 让张量图可检查、可变换，并将追踪、图变换、降低、编译与执行拆分为独立阶段。它支持 `vectorize`/`vmap`、`grad`、`jvp`、`vjp` 和 `batch_functions` 等可组合变换，提供 NumPy、IREE、TVM 和 XLA/PJRT 后端。StableHLO 为编译后端提供统一的降低边界。

EvoX 2.0 不再依赖 PyTorch 或 JAX。NumPy 是 EvoX Compiler 唯一必需的运行时依赖；编译后端为可选组件。

## 新的函数式 API

- 算法使用 `init(config, key)` 和 `step(config, state, evaluate)`。
- 问题使用 `evaluate(config, state, candidates)`。
- 配置不可变，张量状态显式传递，随机性使用可复现的 PRNG key。
- `StdWorkflow` 追踪一个演化步骤，使用所选后端编译并执行优化循环。

## 首个 Alpha 包含的功能

- **32 个算法类**和 **15 个演化算子**。
- 基础数值基准、DTLZ、CEC2022 和虚拟神经演化。
- GD、IGD 和超体积指标；Plotly 可视化与 `.exv` 轨迹。
- 主机端超参数优化，以及通过 `evox_ext` 自动发现扩展。

上游发布说明报告 **NumPy 后端通过了 552 项测试**；这不代表编译后端或 GPU 具有同等测试覆盖。

## 安装

需要 **Python 3.11+**。请在独立环境中选择一种安装方式：

```bash
pip install --pre "evox==2.0.0a1"
```

如需可选的编译器支持：

```bash
pip install --pre "evox[iree]==2.0.0a1"
pip install --pre "evox[compilers]==2.0.0a1"
```

## 当前限制

分布式工作流、Brax/MuJoCo、PyTorch 神经网络集成和 Triton 内核尚未移植。编译后端和 GPU 执行仍处于实验阶段，部分算子与控制流模式尚不能跨所有后端使用。监控、可视化、指标与 HPO 目前在编译图之外执行。预发布期间 API 仍可能变化。

欢迎通过 [GitHub Issues](https://github.com/EMI-Group/evox/issues) 提交错误报告、基准结果和 API 反馈。

**发布记录**: [v2.0.0a1](https://github.com/EMI-Group/evox/releases/tag/v2.0.0a1)
