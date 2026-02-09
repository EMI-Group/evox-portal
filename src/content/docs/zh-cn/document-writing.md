---
title: "文档编写指南"
order: 7
section: "developer"
---

# 文档编写指南

本指南概述了在代码库和补充文件中编写及维护文档的最佳实践。

---

## 代码内文档（Docstrings）

Docstrings 对于理解代码的用途、用法和行为至关重要。请遵守以下约定：

### 通用规则

- 使用 docstrings 为**所有公共类、方法和函数**编写文档。
- 使用 **Sphinx 风格**的 docstrings。
- **不要**在 docstring 中包含参数类型——应通过类型提示（type hints）在函数签名中声明。

### 格式与指令

使用以下指令来描述不同的元素：

- `:param <name>:` — 描述参数。
- `:return:` — 描述返回值。
- `:raises <exception>:` — 描述函数可能引发的异常。

#### 示例

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

## 外部文档（`docs/` 目录）

所有项目级文档都位于 `docs/` 目录中。这些文档通过提供指南、示例和参考资料来支持用户和开发者。

### 格式

- 使用 **Markdown (`.md`)** 或 **Jupyter Notebooks (`.ipynb`)** 编写文档。
- 叙述性内容和静态文档首选 Markdown。
- 可执行的交互式内容（例如教程或演示）请使用 Jupyter Notebooks。

### Jupyter Notebook 指南

- 确保所有 notebook 都是**完全可执行的**。
- 提交前务必**运行所有单元格**并**保存输出**。
- 我们的 CI/CD 环境**不支持 GPU 执行**，因此 notebook 必须在本地预先执行。

### Markdown 与 Notebook 指令

使用以下模式进行富文本格式化：

- `[name](#ref)` — 内部交叉引用，例如 `[ModuleBase](#evox.core.module.ModuleBase)` 或 `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — 嵌入图像，例如 `![Module base](/_static/modulebase.png)`

---

## 翻译

文档支持多语言内容。请按照以下步骤更新或生成翻译。

### 更新翻译（例如 `zh_CN`）

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```