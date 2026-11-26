---
title: "Genesis 加固工作台背后的 Web 依赖"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main 分支更新 Phoenix、LiveView、Bandit 和 jsv；源码部署需要重新构建应用才能纳入这些变化。"
---

2026 年 11 月 23 日，Genesis 在 `main` 分支更新了四项依赖。本次维护涉及用户访问工作台所经过的共用 Web 基础设施。对于从源码构建 Genesis 的团队，关键是运行中服务实际使用了哪组构建依赖。[依赖更新][lock]

![替换后的锁扣部件加固共用门锁机构](./cover.webp)

*概念插画：维护保护共用入口的基础部件。*

## 界面之下更新了什么

Genesis 的依赖声明将 Phoenix 更新关联到 presence 跟踪器和广播分发崩溃修复，将 LiveView 最低版本调整关联到连接请求缺少 URL 时跳过会话初始化钩子的修复；同时说明 Bandit 的 HTTP/2 校验与加固变化。这些是 Genesis 维护者记录的更新理由，提交本身没有确定某个具体部署实例是否受到影响。[依赖要求][pins]

锁文件将 Phoenix 从 1.8.16 升至 1.8.17、LiveView 从 1.2.13 升至 1.2.15、Bandit 从 1.14.1 升至 1.15.0、jsv 从 0.28.0 升至 0.28.1。LiveView 声明的最低版本为 1.2.14，锁定构建实际使用 1.2.15。配套 Nix 变更为更新后的锁文件重新计算依赖哈希。[锁定版本][lock] · [Nix 构建更新][nix]

## 核对实际部署的构建

例如，自托管团队可能已经更新源码，但仍在运行旧工作台二进制。要应用本次变化，应使用包含这些提交的修订，按项目正常安装流程重新构建和部署。检查构建使用的 `mix.lock`；使用 Nix 时保留对应依赖哈希，并在部署后验证工作台访问及实时连接恢复。仅更新源码目录不会替换正在运行的服务。[构建与安装指南][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md

2026 年 11 月 25 日的维护还将 `db_connection` 提升至 2.10.3。源码说明，这一下限针对伪造流结构通过日志选项触发的安全问题；同时更新了 Markdown 原生依赖和 Nix 哈希。重新构建时应配套使用锁文件与 Nix 定义。 [GitHub](https://github.com/EMI-Group/genesis/commit/6e008cbed33eb16bd370136628097933e4906f10).
