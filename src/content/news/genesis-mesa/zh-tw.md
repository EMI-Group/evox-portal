---
title: "Genesis 將 MESA 的 13 個 Fortran 模組重構為 Rust"
pubDate: 2026-11-03
summary: "Genesis 的 MESA 案例展示科學軟體重構：1,052 項測試通過，記錄的模型 token 費用為 10.64 美元。"
---

科學軟體重構需要保留既有數值行為。Genesis 官網日期為 2026 年 9 月 7 日的 MESA 記錄，展示了以原實作為參照，將 **13 個 Fortran 模組改寫為 Rust crates** 的過程。

記錄指出，**139,414 行 Fortran 轉為 89,946 行 Rust**，**1,052 項測試通過**，模型 token 費用為 **10.64 美元**。儲存庫說明了與原 Fortran 輸出對照的黃金測試，並在通過項之外列出 18 項忽略的測試。

Evidence 頁給出的基準測試中位數加速為 **1.55–6.87 倍**，不能解釋為整個 MESA 的統一加速。另據儲存庫 README 的 8 月 5 日測試表，單區燃燒端到端代理負載的加速為 **1.25 倍**。不同快照、不同負載的結果應分別呈現。

此次移植涵蓋選定的數值與物理模組，並非完整 MESA 系統；恆星與雙星演化引擎不在已說明的範圍內。案例展示如何透過行為檢查，讓既有程式碼成為重構依據。結果由專案方報告，尚未獨立重現；token 費用不含硬體成本。

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
