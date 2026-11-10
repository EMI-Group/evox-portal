---
title: "EvoX Genesis：從空實現到 C 編譯器，開發階段與迴歸驗證如何銜接"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "從端到端編譯骨架、CIR 驗證到外部測試集，公開記錄展示了 Genesis 構建 C 編譯器的工程階段與驗收方法。"
---

從空實現開始是一個清晰的目標；而生成一個行為正確的可執行檔案則是一個要求高得多的驗收條件。Genesis 的 C 編譯器案例可以透過其構建的介面以及圍繞這些介面的驗證層來進行考察。

![原始碼模組組裝成不斷增長的軟體專案](./software-world-continuity.webp)

[C Compiler Evidence 記錄](https://genesis.evox.group/evidence/c-compiler/)報告了 **248,989 行 Rust 程式碼**、**1,019 個歸檔的智慧體執行回合**、**123.4 小時**以及 **44.38 美元的模型 token 費用**（使用 DeepSeek V4 Flash）。它列出了 220/220 個 c-testsuite 案例、32/36 個已評估的 LLVM 案例以及 2,904/2,904 個 Rust 測試。這些是專案報告的結果，而非針對本文進行的重新復現。

## 首先使一個程式貫穿所有階段

公開的編譯器 jcc 記錄了一系列工程里程碑：建立工作區、構建端到端編譯骨架、擴充套件語言覆蓋範圍、新增最佳化，然後執行外部套件和應用程式構建。[路線圖](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md)定義了這些階段驗收條件；它應當被視為倉庫的開發記錄，而非 Genesis 每個執行回合的帶時間戳的執行日誌。

其[架構](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)連線了預處理、詞法和語法分析、語義檢查、CIR 表示轉換、最佳化、機器碼生成、目標檔案生成和連結。不同的 crate 負責這些階段。

這種結構產生了有用的中間產物。`-E` 在預處理後停止；`-emit-jcc-ir` 暴露 CIR；`-S` 輸出彙編；`-c` 生成目標檔案。當編譯後的程式失敗時，這些邊界可以在更改整個流水線之前縮小調查範圍。

## 透過中間表示保留 C 語義

CIR 是編譯器的有型別 SSA 表示，獨立於 LLVM IR。最佳化將 CIR 轉換為 CIR；記錄的除錯構建工作流在各 pass 之後執行驗證器。[測試指南](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md)描述了針對表示轉換、無效表示、重寫、指令編碼和命令列行為的檢查。

表示驗證只是一個層面，並非正確編譯的證明。結構上有效的轉換仍可能改變程式的執行結果。這就是為什麼測試策略還包括編譯並執行 C 程式並對比其輸出。

測試用例集中包含了刻意的編譯失敗案例：測試會檢查診斷嚴重程度、訊息和原始碼位置範圍（source span）。這在確保成功執行行為的同時，也保留了對無效輸入的拒絕行為。編譯器的 [C11 合規性文件](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md)記錄了支援的結構和擴充套件策略。

## 外部套件測試完整路徑

[c-testsuite 測試框架](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py)提供了一個外部語言測試驗收條件。[LLVM 執行器](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py)透過被測編譯器驅動 CMake，構建程式並將執行結果與參考輸出進行對比。其預設數值比較使用 1e-4 的容差，非數值文字與退出狀態則必須完全匹配。

[Csmith 測試框架](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py)增加了針對參考編譯器的生成程式差異測試。在審查的 README 快照中，其 100 個種子的執行報告為 **93 次透過、0 次失敗和 7 次跳過**，跳過歸因於兩個編譯器均超時。如果撇開跳過的種子而稱其為“93/93”，將會掩蓋部分工作負載。

這些檢查檢測不同類別的錯誤：語言套件探測指定的結構，隨機程式探索組合，而連結的應用程式構建則共同檢驗驅動程式、目標檔案和執行時介面。

## 把結果落實到實際透過的操作

[版本化的 README](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) 報告了 lz4 的構建並透過了其八項核心測試。它描述了 SQLite 已透過解析和表示轉換，並記錄了進一步的全檔案驗證工作。解析 SQLite 是一個有用的整合里程碑；但這並不等同於透過 SQLite 的完整執行時測試套件。

同一來源列出了部分 `long double` 運算、推遲的平臺支援以及記錄在案的擴充套件策略限制。因此，32/36 的 LLVM 結果必須保留其評估子集和排除項。README 和 Evidence 頁面也有不同的工作區測試計數；本文將 Evidence 的總數與其記錄掛鉤，而非合併快照。

## 開發任務之間持久存在的內容

Genesis 的[開發模型說明](https://genesis.evox.group/getting-started/)圍繞軟體專案使用遞迴任務分解。在這種情況下，持久的工程產物是具體的：原始碼模組、表示契約、中間輸出、診斷和迴歸框架。後續任務可以針對這些產物開展工作，而不僅僅依賴於前序任務的對話。

[模型延續案例](/news/genesis-compiler-continuation)考察了稍後的交接及其獨立範圍內的 1,820 個案例結果。[MESA 重寫](/news/genesis-mesa)使用原始數值行為作為參考，而 [EvoX Compiler](/news/genesis-evoxc) 則檢查張量圖和裝置契約。這些是截然不同的驗證問題，而非同一編譯器實驗的額外執行。

44.38 美元涵蓋了模型 token，不包括硬體。這些公開記錄為編譯器構建成果提供了具體依據；它們並未建立不受限的 C 相容性。如需審查結果，請遵循[架構](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md)進入某個外部框架，然後檢查定義其門控的具體程式和輸出。
