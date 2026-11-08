---
title: "Genesis Server：为软件开发提供持续运行的环境"
pubDate: 2026-11-02
summary: "从 0.13.11 的独立服务器发行包，到 0.14.0 的退出登录后持续运行支持，Genesis 为仪表盘和智能体建立可独立部署的运行环境。"
updatedDate: 2026-11-08
---

2026 年 11 月 2 日发布的 Genesis 0.14.0 在服务器启动时加入 systemd lingering 状态检测，并提供启用选项。它延续了 10 月 30 日在 0.13.11 中引入的独立服务器发行形式。这些变化让开发工作拥有可以独立于桌面会话管理生命周期的执行环境。

![屏风旁仍亮着指示灯的深灰色服务器](./persistent-server-session.webp)

## 具有运维控制的服务器发行包

独立服务器包含仪表盘和智能体运行环境，支持 Linux x64/arm64 及 macOS arm64。CLI 覆盖前台服务、启动、停止、状态、日志、健康检查与版本查询。安装脚本会校验文件摘要，安装或升级软件包，并链接可执行文件。 [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 处理执行周围的生命周期

在使用 systemd 的 Linux 系统上，用户服务可能需要 lingering 才能在退出登录后保持可用。 0.14.0 检查这一条件，并允许通过 `GENESIS_LINGER` 或 `--no-linger` 选项配置。 [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

此前版本也改进了远程启动：命令经由 POSIX shell 包装执行，正确处理包含空格的路径，并为连接失败提供可读原因。服务器模式修复与准确的运行时长报告，让运行状态更容易诊断。 [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## 让服务器持续运行前

将长任务移到服务器之前，先检查状态、日志和 `/health` 响应。在 systemd 主机上确认 lingering 配置，并在退出登录后再次检查服务可用性。这些检查建立执行基线；随后可通过[开发历史](/zh-cn/news/genesis-development-history)追踪在此产生的代码。
