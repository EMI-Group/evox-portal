---
title: "Genesis 开发进展：为项目建立持久登记册"
pubDate: 2026-11-10
summary: "11 月 9 日合入 main 的变更，用数据库项目登记册替代最近项目记录，并区分本地与远程项目选择。"
---

在另一台机器上打开仓库时，项目身份应与本地项目保持清晰边界。2026 年 11 月 9 日合入 Genesis main 的变更，将项目页和项目选择面板接入数据库支持的 VCT 项目登记册，替代原先的最近项目列表。 [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![项目文件夹按主机分柜保存，并与登记标签对应](./project-host-registry.webp)

## 为项目登记一个位置

打开或创建项目时，通过识别节点的项目接口登记挂载。选择面板搜索已登记路径，当前项目可以显示挂载点。远程项目列表来自所选主机；远程连接尚未完成时，本地条目不会混入该视图。 [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## 继续工作前核对主机

使用这些变更的开发构建时，可分别重新打开本地和远程仓库，检查项目身份与路径建议。登记册提供导航记录，代码变更仍沿用项目的正常验证流程审查。

[Genesis 多仓库协作：一个目标，多份独立历史](/zh-cn/news/genesis-multi-repository)
