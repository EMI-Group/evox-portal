---
title: "EvoX v1.2.1 Release Note"
pubDate: 2025-05-13
summary: "Stability improvements with new benchmark functions (Ellipsoid, Griewank) and bug fixes."
---

This is a minor release focused on improving stability and addressing bugs, with a few quality-of-life enhancements.

**New Features**

New Benchmark Functions: Added single-objective numerical functions: `Ellipsoid` and `Griewank`.

**Bug Fixes**

* Fixed an issue where `StdWorkflow` failed to work with algorithms that inherit from other algorithms.

* Corrected a bug in `latin_hypercube_sampling_standard` function.

* Resolved an issue with `non_dominate` failing under `torch.compile`.

* Corrected a problem where `PSO` did not use the default device properly in certain cases.

**Refactoring & Maintenance**

* Re-exported commonly used utilities to the top level for convenience, for example:

* `evox.compile` instead of `evox.core.compile`

* `evox.vmap` instead of `evox.core.vmap`.

* Removed deprecated or redundant code.

Full Changelog: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Open Source Code / Community Resources**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Upstream Project (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ Group: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ Group | Evolving Machine Intelligence
