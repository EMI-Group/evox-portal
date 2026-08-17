---
title: "EvoX Genesis：递归演化式AI系统，从零构建25万行C编译器"
pubDate: 2026-08-17
summary: "香港理工大学数据科学及人工智能学系 EvoX 团队发布 EvoX Genesis（天演·启元），一套递归演化式AI系统。它不依赖持续存在的 Agent 维持长程开发，而是让软件世界本身持续演化：从空仓库出发，在 123.4 小时内构建出 248,989 行 C 编译器，模型 token 成本仅 44.38 美元。"
---

# EvoX Genesis：递归演化式AI系统，从零构建25万行C编译器

![image1.png](./evox-genesis-1.png)

香港理工大学数据科学及人工智能学系EvoX团队发布**EvoX Genesis（天演·启元）**，一套递归演化式AI系统。

EvoX Genesis不再依赖持续存在的Agent来维持长程开发，而是让软件世界本身持续演化。

从空仓库出发，系统在123.4小时内构建出**248,989行C编译器**，经历1,019个Agent episode，模型token成本仅为**44.38美元**。

## 长程编程，边界正在出现

Coding Agent的工作时间，已经从一次短任务延伸到数十小时。

OpenAI曾让Codex从空仓库连续运行约25小时，形成约3万行代码；

Anthropic则用16个Claude Agent，经过近2,000个sessions、约两周和接近2万美元的API成本，从零构建了一个约10万行的C编译器。

时间越来越长，Agent越来越多，软件越来越复杂。

但研究的中心，仍然是Agent：

更强的模型、更长的上下文、更持久的记忆、更多的Agent。

**EvoX团队把问题转向了另一个方向：**

**为什么一定要让Agent持续？**

如果真正需要持续的，是它所在的软件世界呢？

## 123.4小时，25万行

我们让EvoX Genesis从一个实现为空的仓库开始。

目标只有一个：构建一个C编译器

123.4小时、1,019个Agent episode、**248,989行代码**、模型token成本仅为**44.38美元**。

最终编译器通过了220/220 c-testsuite测试、32/36 LLVM评测用例，以及 93/93 Csmith随机程序测试。

没有一个现成的编译器在那里等待补全，**它从零开始。**

![image2.png](./evox-genesis-2.png)

_图1：C 编译器实验结果图 /代码规模、运行时间、Agent episodes、成本与测试结果_

_（使用DeepSeek V4 Flash模型）_

## 不让 Agent 持续，让软件世界持续

复杂软件的生命，天然比一次Agent会话更长。

EvoX Genesis将软件组织成一个不断递归展开的软件世界：

上层Agent分解目标，新的Agent在局部位置完成工作；

结果经过验证后进入软件版本，成为下一轮发展的现实。

然后，Agent可以消失，

新的 Agent从已经形成的软件世界继续。

长期存在的不是某段conversation，不是一个越来越长的scratchpad，也不是一个永远在线的"总管Agent"。

持续存在的是代码、结构、约束、验证结果，以及已经发生的历史。

**持续的不是Agent，而是软件世界。**

**Agent does not persist. Its validated consequences do.**

这就是EvoX Genesis的递归自主演化。对用户而言，这也意味着一件很简单的事：

**不需要构建Agent，只需要描述想让软件成为什么。**

无需预先设计Agent、角色或工作流，也无需手工拆分完整任务树。

用户只需用一段简短文字描述软件开发目标；

任务如何分解、Agent如何生成、递归如何展开、结果如何验证，由EvoX Genesis自行完成。

![image3.png](./evox-genesis-3.png)

_图2：Persistent Recursive World 概念图 / Agent 出生、行动、消失；软件世界持续展开_

## 模型可以换，软件世界继续

这种连续性甚至不要求始终使用同一个模型。

在另一组实验中，一个由GLM 5.2开始构建的软件世界，随后交给DeepSeek V4 Flash继续发展。

最终，在保留的LLVM SingleSource测试中通过 1,820/1,820。

模型可以更换，Agent 可以更换，软件世界继续。

![image4.png](./evox-genesis-4.png)

_图3：GLM 5.2 → DeepSeek V4 Flash 的跨模型延续实验_

## 从无到有，也可以继承历史

从零构建只是软件生命周期的一端；

另一端，是已经存在多年、沉淀着大量结构与历史的软件世界。

我们将EvoX Genesis用在了MESA——一个长期发展的恒星演化科学计算系统。

实验涉及13个Fortran模块，共**139,414行**；

EvoX Genesis将其重构为对应的Rust crates，模型token成本约**10.6美元**；

一个软件世界可以从无到有，也可以继承历史，继续变化。

![image5.png](./evox-genesis-5.png)

_图4：MESA Fortran → Rust，13 个模块、139,414 行代码、10.6美元_

## 成本优势，也会随时间积累

长程软件开发并不意味着成本持续线性增长。

在EvoX Genesis中，已经验证的代码、结构和开发历史会持续沉淀，成为下一轮工作的基础。后续Agent无需反复从头理解整个项目，大量已有信息可以直接缓存和复用，缓存命中率可达97.4%。

随着系统持续运行，可复用的开发状态越来越丰富，重复计算越来越少，单位开发成本反而会逐步下降。

这是一种随时间积累的工程复利。

## EvoX Genesis 已经开源

项目已经开源，并提供Windows、macOS和 Linux安装版本。

🌐 项目官网：

https://genesis.evox.group/

🔗 **GitHub**：

https://github.com/EMI-Group/genesis

↓ 下载链接**：**

**https://github.com/EMI-Group/genesis/releases**

**▤ 论文:**

**https://arxiv.org/abs/2608.10450**

🌐 QQ交流群：297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

**Agent 会离开，软件世界继续发展**

**EvoX Genesis，天演·启元**

![image8.png](./evox-genesis-8.png)

参考：

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
