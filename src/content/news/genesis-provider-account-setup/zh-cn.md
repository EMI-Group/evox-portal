---
title: "Genesis 串联账户设置、模型选择与 ChatGPT 登录"
pubDate: 2026-11-22
updatedDate: 2026-11-25
summary: "重建的提供方向导统一管理凭据、模型清单、推理选项和调度，并新增由 Genesis 管理的 ChatGPT 订阅连接。"
---

可用的模型连接不只是一个模型名称：认证、端点、支持的推理选项和共享账户限制必须相互匹配。2026 年 11 月 19—20 日合入 Genesis `main` 的变更，围绕提供方账户重建了 Welcome 与 Settings。PR #175 加入 **Sign in with ChatGPT**，替换 ChatGPT 订阅配置此前导入 Codex 凭据的方式。[已合并的集成][pr]

![账户钥匙与选定模型的配置配件整齐放在同一仪器盒内](./cover.webp)

*概念插画：认证与模型选择属于同一个配置账户。*

## 先配置账户，再配置模型

Welcome 现在采用分步提供方向导，Settings 负责后续账户管理。自动生成的账户名称与标识来自提供方，而不是所选模型。一个账户可以包含多种模型与推理选项，共享凭据、并发和调度；这些属性不同时，仍应分别建立账户。[配置约定][profiles]

例如，使用 OpenAI 兼容端点的团队可以先配置一次基础 URL 和凭据，再加入端点实际提供的模型，然后为任务选择模型和推理等级。合入的集成让自定义端点能够输入 API 密钥，并通过 OpenAI Chat Completions 路由自定义模型账户。每个可选模型仍必须有清单条目，仅填写默认模型名称不会完成登记。应测试选中的模型，而不只是确认凭据框已经填写。[集成与浏览器检查][pr]

向导将模型公布的推理选项与默认值分开。选定的默认值会进入保存的模型条目和连接测试请求。统一等级为 `none`、`minimal`、`low`、`medium`、`high`、`xhigh`；旧值 `max` 会按 `xhigh` 读取，后续保存时写成规范值。提供方自己的拼写在请求边界转换。支持范围仍取决于实际模型，界面展示等级不代表每个端点都接受全部选项。[推理规则][profiles]

## 通过 Genesis 授权 ChatGPT

在 Welcome 或 **Settings → LLM → Provider accounts** 中选择 **ChatGPT Subscription**。版本化指南给出的登录与检查命令为 `genesis chatgpt login`、`genesis chatgpt status` 和 `genesis chatgpt models`。从源码检出运行时，登录入口为 `mix genesis.chatgpt login`。在浏览器中打开显示的 URL，完成对 Genesis 的授权。[订阅指南][oauth]

登录后使用 **Check connection**，选择登记的账户以及该账户可用的模型。在 Settings 中，先保存账户，再运行 **Connection Test**；Welcome 则在完成设置前测试所选模型。为保持兼容，配置仍使用 `provider = "openai_codex"`，认证方式为 `auth_mode = "oauth"`，由 `siwc_account` 标识 Genesis 的账户登记。

现有订阅配置需要通过 Genesis 重新授权：此连接不使用旧版本从 Codex 导入的凭据。如果此前选择的模型不在新发现的清单中，应改选可用模型。OpenAI API 密钥账户仍是独立选项。需要多个登记账户时，可用 `genesis chatgpt login --account work` 指定别名，再在配置中选择该别名。[迁移与别名][oauth]

## 让连接归属于执行主机

所选账户的凭据在执行节点解析和刷新。登录 CLI 与运行中服务器之间的凭据更新会串行处理，避免把浏览器中可见的账户登记误当成另一台远程主机上的连接。[账户存储][store]

对于自托管部署，指南说明了如何通过 SSH 转发回环登录端口，并使用与 Genesis 服务相同的账户和配置目录执行登录。它还提供受保护的凭据转移方式，以及需要 HTTP CONNECT 代理时可用的 `GENESIS_SIWC_HTTPS_PROXY`。测试推理前应按具体主机完成配置；只在笔记本上登录不会配置另一台服务器。

PR 中的 ChatGPT 刷新和流式处理检查使用了测试夹具，该轮评审尚未验证真实 ChatGPT 账户的全新浏览器授权。对自己的部署，应以目标主机实际返回模型响应来确认设置成功。[验证范围][pr]

## 明确账户调度规则

同一账户模型还包含高峰与非高峰并发、时区和调度策略。新增预设可以预填受支持提供方的调度，但槽位数是可编辑的 Genesis 默认设置，不保证提供方容量或费用节省。同一账户的所有模型共享槽位，增加模型不会创建额外配额池。[预设实现][presets]

`off_peak_holidays = "CN"` 将内置中国日历加入账户调度，包括调休工作日。日历是静态数据，覆盖 2025—2027 年，不会自动更新。依赖它之前，应检查时区、周末规则与预设假设。高峰并发为零会让新请求排队；降低容量不会驱逐已经执行中的工作。[调度语义][profiles]

切换到包含这些变更的构建后，应重新检查各账户的模型清单、默认推理选项和执行主机。ChatGPT 配置需要重新授权并运行连接测试；采用调度的账户应检查保存的规则和预期的下一次切换。这些检查对应未来任务实际使用的身份与限制。

## 保存后刷新模型选项

2026 年 11 月 23 日合入 `main` 的更新，将保存 ChatGPT 注册信息与配置刷新连接起来。同一执行节点上的配置变化会重新加载项目的模型选择器；关闭工作台设置窗口也会触发重新加载。被丢弃的结果现在会显示可重试错误，避免选择器一直停在加载状态。远程连接就绪后再重试。 [GitHub](https://github.com/EMI-Group/genesis/commit/ffb0926723a4f2b695b1562a27954041be0cabd6)

账户尚未配置完整时，调度器不再陷入崩溃循环，而是记录默认模型无法解析的警告。请补全账户的模型列表并选择有效模型，再依赖该默认选项。 [GitHub](https://github.com/EMI-Group/genesis/commit/868842557371daff7bcf68ce5ad59199b897d807)

[pr]: https://github.com/EMI-Group/genesis/pull/175
[profiles]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/docs/llm-oauth.md
[store]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/auth/chatgpt/store.ex
[presets]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/config/provider_presets.ex
