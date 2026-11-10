---
title: "EvoX Genesis：从空实现到 C 编译器，开发阶段与回归验证如何衔接"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "从端到端编译骨架、CIR 验证到外部测试集，公开记录展示了 Genesis 构建 C 编译器的工程阶段与验收方法。"
---

从空实现开始是一个清晰的目标；而生成一个行为正确的可执行文件则是一个要求高得多的验收条件。Genesis 的 C 编译器案例可以通过其构建的接口以及围绕这些接口的验证层来进行考察。

![源代码模块组装成不断增长的软件项目](./software-world-continuity.webp)

[C Compiler Evidence 记录](https://genesis.evox.group/evidence/c-compiler/)报告了 **248,989 行 Rust 代码**、**1,019 个归档的智能体执行回合**、**123.4 小时**以及 **44.38 美元的模型 token 费用**（使用 DeepSeek V4 Flash）。它列出了 220/220 个 c-testsuite 案例、32/36 个已评估的 LLVM 案例以及 2,904/2,904 个 Rust 测试。这些是项目报告的结果，而非针对本文进行的重新复现。

## 首先使一个程序贯穿所有阶段

公开的编译器 jcc 记录了一系列工程里程碑：建立工作区、构建端到端编译骨架、扩展语言覆盖范围、添加优化，然后运行外部套件和应用程序构建。[路线图](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md)定义了这些阶段验收条件；它应当被视为仓库的开发记录，而非 Genesis 每个执行回合的带时间戳的执行日志。

其[架构](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)连接了预处理、词法和语法分析、语义检查、CIR 表示转换、优化、机器码生成、目标文件生成和链接。不同的 crate 负责这些阶段。

这种结构产生了有用的中间产物。`-E` 在预处理后停止；`-emit-jcc-ir` 暴露 CIR；`-S` 输出汇编；`-c` 生成目标文件。当编译后的程序失败时，这些边界可以在更改整个流水线之前缩小调查范围。

## 通过中间表示保留 C 语义

CIR 是编译器的有类型 SSA 表示，独立于 LLVM IR。优化将 CIR 转换为 CIR；记录的调试构建工作流在各 pass 之后运行验证器。[测试指南](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md)描述了针对表示转换、无效表示、重写、指令编码和命令行行为的检查。

表示验证只是一个层面，并非正确编译的证明。结构上有效的转换仍可能改变程序的运行结果。这就是为什么测试策略还包括编译并执行 C 程序并对比其输出。

测试用例集中包含了刻意的编译失败案例：测试会检查诊断严重程度、消息和源码位置范围（source span）。这在确保成功执行行为的同时，也保留了对无效输入的拒绝行为。编译器的 [C11 合规性文档](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md)记录了支持的结构和扩展策略。

## 外部套件测试完整路径

[c-testsuite 测试框架](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py)提供了一个外部语言测试验收条件。[LLVM 运行器](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py)通过被测编译器驱动 CMake，构建程序并将执行结果与参考输出进行对比。其默认数值比较使用 1e-4 的容差，非数值文本与退出状态则必须完全匹配。

[Csmith 测试框架](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py)增加了针对参考编译器的生成程序差异测试。在审查的 README 快照中，其 100 个种子的运行报告为 **93 次通过、0 次失败和 7 次跳过**，跳过归因于两个编译器均超时。如果撇开跳过的种子而称其为“93/93”，将会掩盖部分工作负载。

这些检查检测不同类别的错误：语言套件探测指定的结构，随机程序探索组合，而链接的应用程序构建则共同检验驱动程序、目标文件和运行时接口。

## 把结果落实到实际通过的操作

[版本化的 README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) 报告了 lz4 的构建并通过了其八项核心测试。它描述了 SQLite 已通过解析和表示转换，并记录了进一步的全文件验证工作。解析 SQLite 是一个有用的集成里程碑；但这并不等同于通过 SQLite 的完整运行时测试套件。

同一来源列出了部分 `long double` 运算、推迟的平台支持以及记录在案的扩展策略限制。因此，32/36 的 LLVM 结果必须保留其评估子集和排除项。README 和 Evidence 页面也有不同的工作区测试计数；本文将 Evidence 的总数与其记录挂钩，而非合并快照。

## 开发任务之间持久存在的内容

Genesis 的[开发模型说明](https://genesis.evox.group/getting-started/)围绕软件项目使用递归任务分解。在这种情况下，持久的工程产物是具体的：源代码模块、表示契约、中间输出、诊断和回归框架。后续任务可以针对这些产物开展工作，而不仅仅依赖于前序任务的对话。

[模型延续案例](/news/genesis-compiler-continuation)考察了稍后的交接及其独立范围内的 1,820 个案例结果。[MESA 重写](/news/genesis-mesa)使用原始数值行为作为参考，而 [EvoX Compiler](/news/genesis-evoxc) 则检查张量图和设备契约。这些是截然不同的验证问题，而非同一编译器实验的额外运行。

44.38 美元涵盖了模型 token，不包括硬件。这些公开记录为编译器构建成果提供了具体依据；它们并未建立不受限的 C 兼容性。如需审查结果，请遵循[架构](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)进入某个外部框架，然后检查定义其门控的具体程序和输出。
