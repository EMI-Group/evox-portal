---
title: "EvoX Genesis（天演·啟元）：從零打造 25 萬行 C 編譯器的遞迴演化式 AI 系統"
pubDate: 2026-08-17
summary: "香港理工大學數據科學及人工智能學系的 EvoX 團隊發表了 EvoX Genesis（天演·啟元），一套遞迴演化式 AI 系統。它不依賴持續存在的 Agent 來維持長程開發，而是讓軟體世界本身持續演化：從空白儲存庫出發，系統在 123.4 小時內建構出 248,989 行的 C 編譯器，模型 token 總成本僅 44.38 美元。"
---

# EvoX Genesis（天演·啟元）：從零打造 25 萬行 C 編譯器的遞迴演化式 AI 系統

![image1.png](./evox-genesis-1.png)

香港理工大學數據科學及人工智能學系的 EvoX 團隊，發表了**EvoX Genesis（天演·啟元）**——一套遞迴演化式 AI 系統。

EvoX Genesis 不再依賴持續存在的 Agent 來維持長程開發，而是讓軟體世界本身持續演化。

從空白儲存庫出發，系統在 123.4 小時內建構出**248,989 行的 C 編譯器**，歷經 1,019 個 Agent episode，模型 token 成本僅為**44.38 美元**。

<center>

## 長程 Coding：邊界不斷推進

</center>

Coding Agent 的工作時間，已經從單次的短任務，延長到數十小時。

OpenAI 曾讓 Codex 從空白儲存庫連續執行約 25 小時，產出約 3 萬行程式碼；

Anthropic 則動用 16 個 Claude Agent，歷經近 2,000 個 session、約兩週時間與近 2 萬美元的 API 成本，從零打造出一個約 10 萬行的 C 編譯器。

時間越來越長，Agent 越來越多，軟體越來越複雜。

但研究的中心，仍然是 Agent：

更強的模型、更長的上下文、更持久的記憶、更多的 Agent。

**EvoX 團隊把問題轉向了另一個方向：**

**為什麼一定要讓 Agent 持續存在？**

如果真正需要持續存在的，是它所身處的軟體世界呢？

<center>

## 123.4 小時，25 萬行

</center>

我們讓 EvoX Genesis 從一個實作為空的儲存庫開始。

目標只有一個：打造一個 C 編譯器。

123.4 小時、1,019 個 Agent episode、**248,989 行程式碼**，模型 token 成本僅為**44.38 美元**。

最終的編譯器通過了 220/220 c-testsuite 測試、32/36 LLVM 測試案例，以及 93/93 Csmith 隨機程式測試。

那裡沒有一個現成的編譯器等待補全——**它是從零開始的。**

![image2.png](./evox-genesis-2.png)

<center>

_圖1：C 編譯器實驗結果 / 程式碼規模、執行時間、Agent episodes、成本與測試結果_

</center>

<center>

_（使用 DeepSeek V4 Flash 模型）_

</center>

<center>

## 不是讓 Agent 持續存活，而是讓軟體世界持續存活

</center>

複雜軟體的生命，天生就比單次 Agent 工作階段更長。

EvoX Genesis 將軟體組織成一個不斷遞迴展開的軟體世界：

上層 Agent 分解目標，新的 Agent 在各自的位置完成工作；

結果通過驗證後，便進入軟體的版本歷史，成為下一輪開發的現實。

然後，Agent 可以消失，

新的 Agent 從已經成形的軟體世界繼續出發。

持續存在的，不是某段 conversation，不是不斷膨脹的 scratchpad，也不是一個永遠在線的「總管 Agent」。

持續存在的是程式碼、結構、約束、驗證結果，以及已經發生的歷史。

**持續存在的不是 Agent，而是軟體世界。**

**Agent does not persist. Its validated consequences do.**

這就是 EvoX Genesis 的遞迴自主演化。對使用者而言，它也意味著一件非常簡單的事：

**你不需要打造 Agent——只需要描述你希望軟體成為什麼樣子。**

無需預先設計 Agent、角色或工作流程，也無需手動拆解完整的任務樹。

使用者只需要用一段簡短的文字描述軟體開發目標；

任務如何分解、Agent 如何生成、遞迴如何展開、結果如何驗證——這一切全部由 EvoX Genesis 自行完成。

![image3.png](./evox-genesis-3.png)

<center>

_圖2：Persistent Recursive World 概念圖 / Agent 誕生、行動、消失；軟體世界持續展開_

</center>

<center>

## 模型可以替換，軟體世界繼續

</center>

這種連續性甚至不要求從頭到尾使用同一個模型。

在另一組實驗中，一個最初由 GLM 5.2 建構的軟體世界，被交給 DeepSeek V4 Flash 繼續發展。

最終，在保留的 LLVM SingleSource 測試中，它通過了 1,820/1,820。

模型可以替換，Agent 可以替換——軟體世界繼續。

![image4.png](./evox-genesis-4.png)

<center>

_圖3：GLM 5.2 → DeepSeek V4 Flash 的跨模型接續實驗_

</center>

<center>

## 從無到有，或繼承歷史

</center>

從零打造只是軟體生命週期的一端；

另一端，是已經存在多年、沉積著大量結構與歷史的軟體世界。

我們將 EvoX Genesis 應用在 MESA——一個長期發展的恆星演化科學計算系統。

實驗涉及 13 個 Fortran 模組，共**139,414 行**；

EvoX Genesis 將它們重構為對應的 Rust crates，模型 token 成本約**10.6 美元**。

一個軟體世界可以從無到有，也可以繼承歷史、持續變化。

![image5.png](./evox-genesis-5.png)

<center>

_圖4：MESA Fortran → Rust，13 個模組、139,414 行程式碼、10.6 美元_

</center>

<center>

## 成本優勢，也會隨時間複利累積

</center>

長程軟體開發並不意味著成本會持續線性增長。

在 EvoX Genesis 中，已驗證的程式碼、結構與開發歷史會不斷累積，成為下一輪工作的基礎。後續的 Agent 不需要每次都從頭理解整個專案，大量既有資訊可以直接快取並重複使用，快取命中率高達 97.4%。

隨著系統持續運作，可重複使用的開發狀態越來越豐富，重複的運算越來越少，單位開發成本反而隨時間逐步下降。

這是一種隨時間不斷累積的工程複利。

<center>

## EvoX Genesis 現已開源

</center>

專案已開放原始碼，並提供 Windows、macOS 與 Linux 的安裝包。

🌐 官方網站：

https://genesis.evox.group/

🔗 **GitHub**：

https://github.com/EMI-Group/genesis

↓ **下載連結**：

**https://github.com/EMI-Group/genesis/releases**

**▤ 論文：**

**https://arxiv.org/abs/2608.10450**

🌐 QQ 交流群組：297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

<center>

**Agent 會離開，軟體世界持續演化**

**EvoX Genesis，天演·啟元**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>QQ交流群組｜</strong>演化機器智能</center>

參考文獻：

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
