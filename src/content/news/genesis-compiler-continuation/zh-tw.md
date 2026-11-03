---
title: "Genesis 跨模型接力開發編譯器，通過 1,820 項 LLVM 案例"
pubDate: 2026-11-03
summary: "Genesis 的持續開發案例記錄顯示，開發從 GLM 5.2 切換至 DeepSeek V4 Flash 後，通過了保留評測集中的全部 1,820 項 LLVM SingleSource 案例。"
---

底層模型更換之後，軟體專案能否繼續推進？Genesis 官網日期為 2026 年 9 月 7 日的 Compiler Continuation 記錄，展示了從已接納的編譯器儲存庫繼續開發的過程，交接時沒有攜帶前一 Agent 的對話上下文。

記錄指出，開發從 **GLM 5.2 切換至 DeepSeek V4 Flash**，任務遞迴深度從 **4 層增加至 8 層**。持續開發後，保留評測集中的 **1,820/1,820 項 LLVM SingleSource 案例全部通過**。這對應指定評測集，不代表通過整個 LLVM 測試套件。

此案例呈現 Genesis 維持開發連續性的方式：已接納的程式碼和專案歷史為後續工作提供基礎。編譯器初次建構與持續開發記錄共用一個儲存庫，不應算作兩個獨立專案。

本文依 Evidence 記錄補發。結果由專案方報告，尚未獨立重現；本次持續開發的成本與新增程式碼量未披露。連結儲存庫預設分支的 README 描述另一份評測快照，其測試數量不宜與本次結果合併。

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
