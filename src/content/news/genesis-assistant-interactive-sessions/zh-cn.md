---
title: "Genesis Assistant：回到刚才暂停的对话"
pubDate: 2026-11-12
updatedDate: 2026-11-17
summary: "Genesis 主分支以交互式会话延续 Assistant 对话，并在审批窗口显示拟执行的确切代码和目标节点。"
---

开发者可以先请 Genesis Assistant 检查失败任务，离开对话审阅变更，然后回来追问。这个过程需要找回原来的会话，也需要保留足够的上下文。2026 年 11 月 10 日至 12 日合入 Genesis `main` 的改动，让 Assistant 在会话存续期间保留交互状态，并把会话列表移到仪表板侧栏。[Assistant 指南][guide]

![开发者回到带标记的会话，查看一项拟执行操作](./genesis-assistant-interactive-sessions.webp)

*编辑插画：回到 Assistant 会话并审阅拟执行操作。*

## 回到等待输入的会话

在 **Active Tasks** 下方打开 **Conversations**。这里会同时列出所选节点上的活动会话和本地缓存的对话，状态会区分等待输入、运行中和已结束。选择会话会打开 `/assistant?session=<agent_id>`。旧的 `/help` 链接会跳转到 `/assistant`，保留原来的查询参数。[路由变更][route]

一次交互后，会话可以交出执行槽位，保留上下文和工作树，等待下一条输入。追问时会沿用同一个智能体会话和提示缓存标识。**New chat** 会新开一段对话，上一段仍留在列表里。已经结束的对话也可作为历史记录显示。[会话实现][session]

## 先看清任务，再决定怎么处理

11 月 17 日修订：普通聊天与任务控制无需 Genesis 源码检出。源码检查是可选且需审批的能力。只读任务查询直接运行，开发修改会显示确切结构化参数与执行目标供审批；高级求值调用仍保留代码级控制。项目选择、任务跟踪及附件操作见[项目任务工作流][newworkflow]。

## 审批时保留阅读位置

对于高级 `elixir_eval` 调用，代码级审批仍采用以下方式。

对话与输入框之间的固定状态栏会提示有待处理请求。点击 **Review**，弹窗一次展示一条请求。检查将执行的确切代码与目标，再选择 **Allow once** 或 **Deny**。属于 `sudo` 权限的请求会显示醒目的警告，因为它会以 Genesis 服务器身份运行原生 Elixir。

审批窗口现在会读取运行时标记的目标节点，并显示请求附带的警告。若有多条请求，可以逐条审阅。请求仍处于待处理状态时，恢复会话后也可显示。状态栏变化时，对话正文和输入框的位置保持稳定。[审批改动][approval]

## 回到任务确认结果

写入请求获准后，查看生成的任务及其状态，确认工作是否完成。若响应中断或写入超时，应先检查当前状态，再决定是否发起第二次写入。要体验这套流程，可以在包含这些改动的构建上先进行一次只读任务检查，切到另一个仪表板页面，再从 **Conversations** 回来追问。[此前的 Assistant 介绍][related]介绍了这套会话流程所依托的操作工具。[当前 Assistant 指南][guide]

## 会话结束时保留最终回答

11 月 14 日补充：11 月 13 日合入 `main` 的更新，将最终权威快照交给 Assistant 和所选智能体的检查面板。对话正文与终止状态一起应用，迟到的任务广播不能重新打开已封闭的会话。如果交接不可用，界面保留最后一致的缓存文本，而不是另行读取历史。检查面板可在活动树之外保留已结束智能体的详情。在包含此更新的构建上，保持选中会话直至完成，确认最终文本与状态一致后再决定是否重试工作。[终止交接实现][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /zh-cn/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae

[newworkflow]: /zh-cn/news/genesis-assistant-project-workflows
