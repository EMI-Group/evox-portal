---
title: "EvoX v1.1.1 Release Note"
pubDate: 2025-03-16
summary: "Bug fixes for torch.compile graph capture, use_state graph breaks, and BatchedTensor leaks."
---

**What's Changed**

**This minor release primarily includes bug fixes and improvements:**

- Fixed an issue where `torch.compile` did not properly capture `workflow.step`.

- Fixed an issue where `use_state` leads to a graph break.

- Fixed some incorrect model buffer usage.

- Fixed an issue where monitor.plot was not functioning as intended.

- Introduced a new wrapper, `evox.compile`, to work around certain limitations with `torch.compile` and `torch.vmap`.

- Resolved various `BatchedTensor`-related issues:- Fixed a bug where vmapping a workflow with EvalMonitor could cause BatchedTensor leaks.

- Fixed an issue preventing HPOProblem from working with BraxProblem.

- Enhanced the implementations of RVEA and CSO for better performance and reliability.

- Enhanced the implementation of BraxProblem.

- Various small fixes and improvements.

**Open-Source Code and Community**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Upstream Project (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ Group**: 297969717

![image.png](./evox-1-1-1-1.png)

  QQ Group | Evolving Machine Intelligence
