---
title: "文件撰寫指南"
order: 7
section: "developer"
---

# 文件撰寫指南

本指南概述了撰寫和維護程式碼庫及補充檔案文件的最佳實踐。

---

## 程式碼內文件 (Docstrings)

Docstrings 對於理解程式碼的目的、用法和行為至關重要。請遵守以下約定：

### 一般規則

- 使用 docstrings 記錄 **所有公開類別 (classes)、方法 (methods) 和函式 (functions)**。
- 使用 **Sphinx 風格** 的 docstrings。
- **不要** 在 docstring 中包含參數型別——這些應透過型別提示 (type hints) 在函式簽章中宣告。

### 格式與指令

使用以下指令來描述不同的元素：

- `:param <name>:` — 描述參數。
- `:return:` — 描述回傳值。
- `:raises <exception>:` — 描述函式可能引發的例外。

#### 範例

```python
def add(a: int, b: int) -> int:
    """
    Add two integers.

    :param a: The first integer.
    :param b: The second integer.
    :return: The sum of the two integers.
    :raises ValueError: If either input is not an integer.
    """
    if not isinstance(a, int) or not isinstance(b, int):
        raise ValueError("Inputs must be integers.")
    return a + b
```

---

## 外部文件 (`docs/` 目錄)

所有專案層級的文件都位於 `docs/` 目錄中。這些文件透過提供指南、範例和參考資料來支援使用者和開發者。

### 格式

- 使用 **Markdown (`.md`)** 或 **Jupyter Notebooks (`.ipynb`)** 撰寫文件。
- 敘述性內容和靜態文件首選 Markdown。
- 對於可執行的互動式內容（例如教學或展示），請使用 Jupyter Notebooks。

### Jupyter Notebook 指南

- 確保所有 notebooks 都是 **完全可執行** 的。
- 在提交 (commit) 之前，務必 **執行所有儲存格 (cells)** 並 **儲存輸出**。
- 我們的 CI/CD 環境 **不支援 GPU 執行**，因此 notebooks 必須在本地預先執行。

### Markdown 與 Notebook 指令

使用以下模式進行豐富格式化：

- `[name](#ref)` — 內部交叉參照，例如 `[ModuleBase](#evox.core.module.ModuleBase)` 或 `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — 嵌入圖片，例如 `![Module base](/_static/modulebase.png)`

---

## 翻譯

文件支援多語言內容。請按照以下步驟更新或產生翻譯。

### 更新翻譯（例如 `zh_CN`）

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```