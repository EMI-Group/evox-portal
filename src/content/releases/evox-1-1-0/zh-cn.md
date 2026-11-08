---
title: "EvoX 1.1 发布：现已支持 torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 使用 torch.compile 替代 TorchScript，通过 TorchDynamo 在 Python 执行过程中捕获计算图。"
---

![展开程序结构以检查编译过程](./execution-graph-capture.webp)

## 编译后端更新

EvoX 1.1 使用 `torch.compile` 替代 TorchScript，通过 TorchDynamo 在 Python 执行过程中捕获计算图。

## 工作流编译

本次更新引入工作流步骤编译，使执行路径与 PyTorch 编译器衔接，支持的张量操作可在计算图内统一优化。

## 兼容性

图捕获取决于工作流使用的操作与控制流。不支持的代码可能造成图中断；接入编译器并不意味着任意 Python 库调用都能被编译。

## 相关资源

- [GitHub](https://github.com/EMI-Group/evox)
- [文档](https://evox.readthedocs.io/en/latest/)
