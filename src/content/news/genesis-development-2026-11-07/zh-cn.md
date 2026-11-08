---
title: "Genesis Assistant：让运行中的任务更易理解和管理"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "在一次对话中查看任务、了解系统容量并执行操作。Genesis 主分支近期还简化了远程服务、后台任务和模型凭证配置。"
---

一项长时间运行的软件任务启动后，问题才刚刚开始：哪些工作还在进行？某个任务为什么失败？接下来该怎么处理？2026 年 11 月 4—7 日合入 Genesis `main` 分支的更新，把这些问题带进了仪表盘的 Assistant 对话入口，也梳理了它背后的服务与任务管理方式。

![概念插画：一个对话入口连接共享平台上的多条任务流](./genesis-assistant-task-flows.webp)

*一个对话入口，多条持续推进的任务流——本次更新主线的编辑插画。*

## 从任务出发，找到下一步操作

Genesis Assistant 可以读取 Genesis 源码和文档、查看任务，并检查调度器的实时容量。开发者可以让它分析失败任务的状态、错误和结果，再请求继续先前的工作。解释和操作围绕当前查看的节点展开，问题与处理动作因此能够衔接起来。

[Assistant 指南][assistant]给出了具体切入点：查看正在运行的工作、检查可用模型槽位，或在处理合并时暂停调度。暂停针对调度过程，已经在执行的工作仍会继续。临时运行设置与保存到文件的配置也保持区分，当前会话的调整不必悄然变成长期默认值。

查看状态使用 `read` 层级；修改使用 `write`，执行前需要批准具体代码；`sudo` 则有独立审批卡片。当一个问题转化为一次操作时，开发者可以看清实际准备执行的动作。

## 一个服务实例，两种连接方式

远程开发与 HTTP 仪表盘现在共用一个服务实例。此前，远程命令会启动单独的分布式连接实例。[共享服务的变更][remote]让 `genesis remote stop` 只关闭远程分布式连接，HTTP 仪表盘仍可访问。结束远程开发连接，不再需要停止这个共享的 HTTP 服务。

## 让工作更容易追踪的细节

[后台任务][jobs]现在采用 `bash-1` 等简短标识。调用代理仅拥有一个任务时，`job_output` 可以自动定位它，无需传入 `job_id`；存在多个任务时，则返回标识、状态和标签，便于选择正确的目标。

[OAuth 凭证文件的自定义路径][oauth]现在放在 `[[llm.models]]` 下的各个模型配置中，替代全局 `[llm] oauth_file` 设置。使用自定义凭证路径的开发者，可以把路径与其服务的模型放在一起管理。

这些变化为正在推进的工作提供了更清晰的操作入口：要查看的任务、要批准的动作，以及更容易理解的服务状态。了解整体系统，可阅读 [Genesis 介绍][intro]；查看具体操作，可继续阅读 [Assistant 指南][assistant]。

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /zh-cn/news/evox-genesis

