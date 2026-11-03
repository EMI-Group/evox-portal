---
title: "Genesis 跨模型接力开发编译器，通过 1,820 项 LLVM 用例"
pubDate: 2026-11-03
summary: "Genesis 的续开发案例记录显示，开发从 GLM 5.2 切换至 DeepSeek V4 Flash 后，通过了保留评测集中的全部 1,820 项 LLVM SingleSource 用例。"
---

底层模型更换之后，软件项目能否继续推进？Genesis 官网日期为 2026 年 9 月 7 日的 Compiler Continuation 记录，展示了从已接纳的编译器仓库继续开发的过程，交接时没有携带前一 Agent 的对话上下文。

记录报告，开发从 **GLM 5.2 切换至 DeepSeek V4 Flash**，任务递归深度从 **4 层增加至 8 层**。续开发后，保留评测集中的 **1,820/1,820 项 LLVM SingleSource 用例全部通过**。这一结果对应指定评测集，不代表通过整个 LLVM 测试套件。

该案例体现了 Genesis 维持开发连续性的方式：已接纳的代码和项目历史为后续工作提供基础。编译器初次构建与续开发记录共用一个仓库，不应算作两个独立项目。

本文按 Evidence 记录补发。结果来自项目方报告，尚未独立复现；本次续开发的成本与新增代码量未披露。链接仓库默认分支的 README 描述的是另一份评测快照，其测试数量不宜与本次续开发结果合并。

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
