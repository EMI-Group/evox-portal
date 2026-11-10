---
title: "Genesis 0.14.1：让模型选择贯穿整个任务"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "账户级模型配置、订阅认证与统一远程服务器改变了 Genesis 0.14.1 的配置方式。本文展开关键机制、使用场景和升级检查。"
---

选择模型，也是在选择付费账户、认证凭据和随任务传递的推理设置。**Genesis 0.14.1 于 2026 年 11 月 8 日正式发布**，将这组身份贯通到 Settings、Projects、Assistant、调度器和运行时，同时将远程运行统一到无界面服务器，并增加更可控的运行时检查能力。[完整发布说明][release]

![选中的账户标签始终连接着对应的模型选项](./provider-account-continuity.webp)

## 账户配置一次，任务选择到位

Provider profile 保存认证、端点、并发和时间安排；其嵌套模型清单列出该账户可用的模型，以及模型专属的生成参数和推理设置。任务携带的是不含凭据的身份：账户配置 ID、模型 ID 和可选的推理强度。明确选择后，这组身份会在后续执行中锁定；**Auto** 则交由已配置的规则选择。

例如，工作账户下的两个模型共享该账户的并发槽位和限流退避。增加一个模型，不会增加一个独立配额池。个人账户可以另设凭据和调度策略；若两个账户需要不同 API key，除了使用不同 profile ID，还要设置不同的凭据名称。[账户配置与选择规则][profiles]

每个可选模型都需要写入 `[[llm.providers.models]]`，仅设置 `default_model` 不够。默认推理强度与支持的强度清单也分别配置：在仪表板中，清单非空但未解析出默认值时，会选择第一项；核心 API 调用省略强度时，则可以不发送该参数。因此，切换账户后应重新确认模型和强度。

本版修复了明确选择在任务、智能体和系统层之间丢失、调度器回退池不正确，以及保存的模型快照不完整而触发 `:model_spec_schema_unavailable` 等问题。归档设置也改为 JSON 安全格式，并隐去凭据。这些修复既影响新任务，也影响重新使用已保存配置的工作。

## 订阅登录沿账户配置解析

受支持的账户配置新增 OAuth/订阅认证和逐配置的登录状态。Genesis 将厂商 CLI 登录文件导入 ReqLLM 使用的受管凭据文件。`openai_codex` 仅支持 OAuth；Anthropic 订阅账户使用 `auth_mode = "oauth"`。版本化指南要求先在实际使用账户的节点上执行 `codex login`，或通过 Claude CLI 登录。[订阅认证设置][oauth]

默认受管文件是 `config.toml` 旁的 `auth.json`。自定义 `oauth_file` 应放在 provider profile 中，全局 `[llm] oauth_file` 已移除。新建受管文件使用 `0600` 权限，导入采用原子写入。文件按 provider 保存一条记录，因此，仅使用不同 profile ID 并不能隔离多个订阅登录。

远程工作时，应检查远程节点的登录状态。如果厂商登录存在，但受管凭据目标只读，需要将配置指向可写的私有路径；重新登录不能解决目标不可写的问题。仅通过环境变量提供的 OAuth token 无法自动刷新。新版状态信息会区分这些情况。

## 远程执行和仪表板使用同一服务器

独立的 `genesis_remote` 发行包退出使用。远程命令和引导流程改用共享的 `genesis_server`，HTTP 始终可用，Erlang distribution 则可通过 SIGHUP 触发的文件协议在运行时切换。CLI 提供 `genesis remote start`、`stop`、`status` 和 `logs`。[服务器与安装入口][readme]

对于在笔记本保留仪表板、通过 SSH 主机执行任务的用户，这直接改变了服务管理方式：需要检查引用旧发行包的脚本，转为管理共享服务器。本版还支持远程项目测试和在调用时恢复测试运行。无界面 HTTP 服务器默认监听 localhost，未内置认证；文档中的远程访问方式是 SSH 隧道。

## 长任务中的交互更容易恢复

分层、经代理的 Elixir 求值器增加了精确到代码的审批，以及聊天中的可恢复审批。输出超过剩余预算时会被截断，而不是直接失败。其他变化包括短暂的轮次上限恢复窗口、不调用工具的最终回复、更短的顺序任务编号，以及 OpenAI/Codex GPT 调用中稳定的单次智能体运行提示缓存身份。仪表板也加入融合胶囊面板，并统一任务与模型控件。[详细变化与修复][release]

## 把配置展开，再升级

1. 从 [v0.14.1][release] 获取适用于目标平台的安装包或服务器资源。调整账户结构前备份现有配置。旧 `[[llm.models]]` 仍可作为兼容输入；规范的 provider profiles 优先，显式保存 Settings/配置时执行迁移。
2. 在 **Settings → LLM → Provider profiles** 中检查认证、嵌套模型清单、默认推理强度和自定义 `oauth_file`。确保实际运行任务的进程能够取得凭据，远程服务器也一样。
3. 重启无界面服务器后，用 `genesis status` 检查状态；再核对一次明确指定账户/模型/强度的任务、一次 Auto 选择，以及实际使用的远程连接。复用旧守护进程脚本前先检查其内容。这些检查由文档记录的变化推导而来。

关于运行中任务的操作入口，可继续阅读 [Genesis Assistant：更清楚地掌握运行中的工作](/zh-cn/news/genesis-development-2026-11-07)。

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
