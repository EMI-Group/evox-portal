---
title: "Genesis 與 MESA：追蹤從 Fortran 到 Rust 重寫過程中的數值差異"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "插值精度、解析雅可比矩陣以及匹配的基準測試輸入展示了 13 個 MESA 模組如何在 Rust 中重建並驗證。"
---

科學軟體的重寫可能會產生看似合理的答案，但卻改變了生成這些答案的數值路徑。Genesis 的 MESA 案例為該問題提供了具體的檢查手段：原始 Fortran 輸出、已解釋的浮點差異、求解步數記錄，以及比較匹配工作負載的基準測試。

![放大鏡下對比的 Fortran 與 Rust 輸出](./mesa-numerical-continuity.webp)

*概念插圖：用已有數值行為核對新的實現。*

[Evidence 記錄](https://genesis.evox.group/evidence/mesa/)報告了 13 個重新開發的模組，包含 139,414 行 Fortran 程式碼和 89,946 行 Rust 程式碼。下文的工程細節源自 [倉庫版本 2ad071e](https://github.com/EMI-Group/genesis-demo-mesa-rs/tree/2ad071e658f8d4de21aa9f0e906592c364e10023)，其記錄的基準測試日期為 2026 年 8 月 5 日。這些基準測試結果保留了各自的工作負載和計時定義。

## 按依賴關係重建 13 個模組

該工作區遵循從常量、工具函式和數學運算，到矩陣、插值和數值求解器，再到化學資料、反應率、中微子損失、反應網路、狀態方程（EOS）和不透明度的依賴鏈。每個原始模組都有一個對應的 Rust crate。[工作區清單](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/Cargo.toml)明確了這些包之間的關係。

反應網路能否工作，取決於底層數值例程與物理資料能否協同使用。公共 API 和每個目錄下的上下文文件提供了整合契約。[倉庫概覽](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#architecture--api-parity)描述了 Rust 結構體、方法和 `Result` 值，並在文件中保留了原始 Fortran 名稱，以便於交叉檢查。

該實現包含 Rust 求解器，而非透過 FFI 呼叫 LAPACK 或 BLAS。範圍保持在選定的數值和物理棧：完整的恆星與雙星演化引擎、完整的 EOS 多來源混合以及其他列出的元件不在移植範圍之內。

## 插值結果的偏差如何追溯到中間變數精度

[二維插值參考輸出測試](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-interp2d/tests/golden.rs)重建了原始的 31×35 網格和求值點。它區分了完全匹配的值與需要記錄容差的值。

測試原始碼記錄了一項具體的差異排查。一些原始 Fortran Hermite 插值的中間變數隱式使用了 `REAL(4)`：即在原本高精度的計算中使用了單精度。Rust 移植版則使用 `f64`。原始碼註釋報告稱，顯式使用雙精度的 Fortran 對照實現與 Rust 結果一致，而原始的混合精度路徑則重現了原有參考輸出。

這些插值記錄的最大相對差異約為 3.05e-8，設定的相對容差為 1e-7。其餘數值仍採用精確比較或更嚴格的容差。這是一種有用的工程區分：測試保留了數值差異的來源，而不是允許所有結果在統一的全域性閾值下漂移。單精度 `_sg` 測試塊尚未移植。

## 反應網路既需要數值路徑也需要導數路徑

[反應網路開發筆記](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/crates/mesa-net/CONTEXT.md)記錄了 approx21 解析雅可比矩陣的開發；這一導數矩陣會被剛性求解器使用。記錄的前後測量顯示，校驗和更接近 Fortran，且積分器的各項計數與 Fortran 完全匹配。

對於記錄的基準測試工作負載，兩種實現均達到了 **199 步：198 步接受，1 步拒絕**，其中包含 **8,889 次函式評估和 199 次雅可比矩陣評估**。同時核對這些計數，可以發現某次執行看似更快、實際卻改變了求解路徑的情況。

校驗和仍有約 3.1e-9 的差異。[基準測試輔助程式](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/common.py)將其歸因於 Fortran 數值路徑使用了四倍精度，而 Rust 使用了 f64。因此，測試框架使用了記錄在案的 1e-8 相對校驗和容差；若將要求收緊至 1e-9，這項工作負載會被標記為不匹配。匹配的求解步數支援了這一對比，而數值路徑的差異保持顯式記錄。

## 整合測試同時檢查模組是否實際連線

一個獨立的[單區整合測試](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/tests/one_zone_burn.rs)透過公共 `BurnEosInfo` 介面，分別使用理想氣體實現和 EOS 表實現執行燃燒計算。它預期兩種計算結果會有所不同，檢查守恆關係以及輸出是否為有限值，並驗證 EOS 呼叫次數等於函式評估與雅可比矩陣評估之和。

這是一個具有特定物理邊界的模組連線測試：燃燒溫度超過了可用表的最大值，因此 EOS 查表會將超出範圍的輸入限制在最高溫度行。它驗證了更換 EOS 實現確實會影響計算；這並非對完整高溫恆星 EOS 的驗證。其求解步數也屬於此獨立測試，而非上述基準測試。

## 以相同輸入、求解引數和計時範圍比較效能

[工作負載規範](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/bench-fortran/WORKLOADS.md)為兩種語言固定了輸入、規模、求解器引數和校驗和定義。例如，插值基準測試在相同網格上評估 200 萬個確定性點；初始化過程不計入這個迴圈的耗時。

[基準測試編排器](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/scripts/run_benchmarks.py)讀取驅動程式內部的計時和校驗和，進行對比並編寫報告。README 中 8 月 5 日的表格使用了 15 次執行的中位數，繫結到 CPU 0–3，對比了 gfortran `-O3 -march=native` 與 Rust 的 release 配置。

| 選定工作負載 | Fortran | Rust | 報告加速比 |
| --- | --- | --- | --- |
| 200 萬次雙三次插值評估 | 0.162522 s | 0.090700 s | 1.79× |
| 1 萬次牛頓法求解 | 0.057918 s | 0.009029 s | 6.41× |
| 單區 approx21 燃燒代理工作負載 | 0.303473 s | 0.243294 s | 1.25× |

來源：[版本化基準測試表](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/2ad071e658f8d4de21aa9f0e906592c364e10023/README.md#latest-verified-results-2026-08-05-15-run-medians-taskset-0-3)。Evidence 頁面另外報告了 1.55–6.87× 的中位數範圍。這些記錄並未確立一個通用的加速比，單區代理工作負載也沒有測量完整恆星模擬的效能。

## 從參考輸出與測試命令開始核查

倉庫報告 **1,052 項透過，0 項失敗，18 項忽略**。其 README 指出忽略的項為基準測試和耗時較長的完整時段燃燒測試。在準備好的 Rust 和 Fortran 環境中，記錄的入口點為：

```bash
cargo test --workspace
bash scripts/build_fortran_baselines.sh --all
python3 scripts/run_benchmarks.py --runs 15 --taskset-cpus 0-3
```

這些是原始碼記錄的命令，而非為本文執行的新復現。Evidence 記錄的 10.64 美元僅涵蓋模型 token 費用；模型、執行回合數和實際耗時未予報告。

若要進行有效的初步檢查，可以先閱讀插值參考輸出測試及其對照結果，然後遵循基準測試的輸入契約。該路徑使得重寫版本可以透過具體的數值行為和測得的工作量進行評估。
