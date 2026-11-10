---
title: "Genesis 0.14.1：让模型选择跟随任务"
pubDate: 2026-11-10
summary: "提供商账户配置贯通 Genesis 的模型与推理设置，远程开发则统一使用同一个服务器。"
---

选择模型，也涉及账户、凭据和推理设置。2026 年 11 月 8 日发布的 Genesis 0.14.1，将这份选择贯通设置、项目、Assistant、调度器与运行环境，让任务指定的配置更可靠地进入实际执行。 [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

![选中的账户标签与对应模型选项保持连接](./provider-account-continuity.webp)

## 一份配置，贯通模型选择

规范化提供商配置将提供商账户与模型选择分开表达。共用选择器提供模型与推理选项；调度器修复保留显式任务选择和完整的已保存配置。受支持的配置还加入 OAuth／订阅认证、逐配置登录状态，以及从厂商 CLI 导入凭据文件的能力。

## 本地与远程共用一个服务器

远程开发现在采用与无界面仪表盘相同的 genesis_server 发行包，独立的 genesis_remote 发行包退出使用。CLI 管理远程启动、停止、状态与日志；分布式连接可在运行时切换，HTTP 服务持续可用。

## 升级时核对配置交接

升级后，先在设置中检查提供商账户、模型与推理选项，再核对一次显式指定模型的任务。自定义 OAuth 凭据路径属于各个模型配置。远程运维人员应在复用旧守护进程脚本前，检查共享服务器的变化。完整迁移与修复清单见发布说明。 [v0.14.1](https://github.com/EMI-Group/genesis/releases/tag/v0.14.1)

[Genesis Assistant：让运行中的任务更易理解和管理](/zh-cn/news/genesis-development-2026-11-07)
