---
title: "Genesis 将 MESA 的 13 个 Fortran 模块重构为 Rust"
pubDate: 2026-11-03
summary: "Genesis 的 MESA 案例展示科学软件重构：1,052 项测试通过，记录的模型 token 费用为 10.64 美元。"
---

科学软件重构需要保留既有数值行为。Genesis 官网日期为 2026 年 9 月 7 日的 MESA 记录，展示了以原实现为参照，将 **13 个 Fortran 模块改写为 Rust crates** 的过程。

记录报告，**139,414 行 Fortran 转为 89,946 行 Rust**，**1,052 项测试通过**，模型 token 费用为 **10.64 美元**。仓库说明了与原 Fortran 输出对照的黄金测试，并在通过项之外列出 18 项忽略的测试。

Evidence 页给出的基准测试中位数提速为 **1.55–6.87 倍**，不能解释为整个 MESA 的统一提速。另据仓库 README 的 8 月 5 日测试表，单区燃烧端到端代理负载的提速为 **1.25 倍**。不同快照、不同负载的结果应分别呈现。

此次移植覆盖选定的数值与物理模块，并非完整 MESA 系统；恒星与双星演化引擎不在已说明的范围内。案例展示了如何通过行为检查，让既有代码库成为重构依据。结果来自项目方报告，尚未独立复现；token 费用不含硬件成本。

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
