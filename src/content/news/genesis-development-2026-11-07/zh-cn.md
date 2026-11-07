---
title: "Genesis 开发进展：Assistant 与共享远程服务"
pubDate: 2026-11-07
summary: "主分支近期加入操作助手、共享远程服务和更简洁的后台任务处理。"
---

2026 年 11 月 4—7 日合入 Genesis `main` 分支的变化改善了日常操作体验。**这是开发进展，不是新版本发布公告。** 截至 11 月 7 日检查时，最新已发布版本仍为 v0.14.0。

Genesis Assistant 成为仪表盘中的操作对话入口，可查看任务和系统容量，并请求执行任务或修改配置。其 read/write/sudo 分级执行机制区分只读检查和需要批准具体代码的操作；sudo 使用单独的审批卡片。具体边界见 [Assistant 指南][assistant]。

远程开发现在与 HTTP 仪表盘共用一个服务实例。`genesis remote stop` 关闭远程分布式连接，同时保留 HTTP 服务。后台任务采用 `bash-1` 等简短标识；当调用代理仅拥有一个任务时，`job_output` 可以省略 `job_id`。

对于跟踪开发构建的用户，OAuth 凭证文件的自定义路径现在属于单个模型配置（`[[llm.models]]`），不再使用全局 `[llm] oauth_file` 设置。更新开发配置前请查看下方变更；不要假定 v0.14.0 已包含这些功能。

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0) · [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

