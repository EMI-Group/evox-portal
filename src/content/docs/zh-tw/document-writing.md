---
title: "文件撰寫指南"
order: 7
section: "developer"
---

# 文件撰寫指南

本指南概述了在程式碼庫和補充檔案中撰寫和維護文件的最佳實踐。

---

## 程式碼內文件（Docstrings）

Docstrings 對於理解程式碼的目的、用法和行為至關重要。請遵循以下慣例：

### 一般規則

- 使用 docstrings 記錄**所有公開的類別、方法和函數**。
- 使用 **Sphinx 風格**的 docstrings。
- **不要**在 docstring 中包含參數類型——它們應該在函數簽名中使用型別提示宣告。

### 格式和指令

使用以下指令來描述不同的元素：

- `:param <name>:` — 描述一個參數。
- `:return:` — 描述返回值。
- `:raises <exception>:` — 描述函數可能引發的例外。

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

## 外部文件（`docs/` 目錄）

所有專案級別的文件位於 `docs/` 目錄中。這些文件透過提供指南、範例和參考資料來支援使用者和開發者。

### 格式

- 使用 **Markdown（`.md`）** 或 **Jupyter Notebooks（`.ipynb`）** 撰寫文件。
- Markdown 適用於敘述性內容和靜態文件。
- 使用 Jupyter Notebooks 撰寫可執行的互動式內容（如教學或演示）。

### Jupyter Notebook 指南

- 確保所有筆記本**完全可執行**。
- 在提交前始終**執行所有儲存格**並**儲存輸出**。
- 我們的 CI/CD 環境**不支援 GPU 執行**，因此筆記本必須在本地預先執行。

### Markdown 和 Notebook 指令

使用以下模式進行豐富的格式化：

- `[name](#ref)` — 內部交叉引用，例如 `[ModuleBase](#evox.core.module.ModuleBase)` 或 `[ModuleBase](#ModuleBase)`
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
