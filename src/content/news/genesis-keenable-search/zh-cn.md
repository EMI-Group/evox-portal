---
title: "Genesis 新增可选的免 API 密钥搜索入口"
pubDate: 2026-11-22
summary: "Keenable 适配器支持显式启用公开网页搜索，同时保留密钥访问和现有默认提供方。"
---

如果网页搜索还需要单独准备凭据，Agent 研究任务可能在第一次查询之前就停在配置环节。Genesis PR #174 于 2026 年 11 月 19 日合入 `main`，新增可选提供方 **Keenable**，无需配置 API 密钥即可使用其公开端点。已有安装保持原来的默认行为。[已合并的搜索适配器][pr]

![敞开的图书馆入口通向一组带来源标记的文档](./cover.webp)

*概念插画：进入网页研究的一条可选公开通路。*

## 显式启用公开通路

在 `[tools.search]` 中设置 `enabled = true` 和 `provider = "keenable"`。没有密钥时，适配器向公开端点提交查询与结果数量上限，携带 `X-Keenable-Title: Genesis`，不发送 `X-API-Key`。在凭据存储中加入 `KEENABLE_API_KEY` 后，则切换为密钥访问。[请求构造][adapter]

实现同时修改了让这条通路真正可用的两个检查点：选中的免密钥提供方可以启用 Agent 搜索工具，执行时也不再仅因缺少密钥而拒绝该提供方。需要凭据的其他提供方保留原有检查。

## 结合限制阅读结果

对于收集文档参考资料的任务，这减少了搜索前的一项配置。适配器把结果标题、URL 与 `snippet` 映射到现有搜索结果格式，并遵守 `max_results`；Keenable 没有对应的 `search_depth` 参数，因此会忽略该选项。[响应映射][adapter]

公开通路按 IP 限流。PR 记录了请求构造、解析和工具启用测试，包括经模拟执行接口进行的检查，没有报告真实 Keenable API 调用。启用后，可先从实际执行主机发送一次小查询，检查来源链接和服务错误，再将它用于更大的研究任务。[已记录检查][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
