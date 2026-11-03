---
title: "EvoX 1.1 Release: Now with torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 replaces TorchScript with torch.compile, using TorchDynamo to capture computation graphs during Python execution."
---

## Compilation update

EvoX 1.1 replaces TorchScript with `torch.compile`, using TorchDynamo to capture computation graphs during Python execution.

## Workflow compilation

The release introduces compilation of workflow steps and aligns the execution path with the PyTorch compiler. Supported tensor operations can be optimized together.

## Compatibility

Graph capture depends on the operations and control flow used by a workflow. Unsupported code may cause graph breaks; integration does not mean every Python library call is compiled.

## Resources

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentation](https://evox.readthedocs.io/en/latest/)
