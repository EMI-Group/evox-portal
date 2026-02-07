---
title: "ドキュメント作成ガイド"
order: 7
section: "developer"
---

# ドキュメント作成ガイド

このガイドでは、コードベースおよび補足ファイル全体でドキュメントを作成・維持するためのベストプラクティスを概説します。

---

## コード内ドキュメント（Docstring）

Docstringは、コードの目的、使用方法、動作を理解するために不可欠です。以下の規約に従ってください：

### 一般的なルール

- **すべてのパブリッククラス、メソッド、関数**にDocstringを記述してください。
- **Sphinxスタイル**のDocstringを使用してください。
- Docstringにパラメータの型を含め**ないでください**。型は型ヒントを使用して関数シグネチャで宣言されることが期待されます。

### フォーマットとディレクティブ

異なる要素を記述するために以下のディレクティブを使用してください：

- `:param <name>:` -- パラメータを記述します。
- `:return:` -- 戻り値を記述します。
- `:raises <exception>:` -- 関数が発生させる可能性のある例外を記述します。

#### 例

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

## 外部ドキュメント（`docs/`ディレクトリ）

すべてのプロジェクトレベルのドキュメントは`docs/`ディレクトリにあります。これらのドキュメントは、ガイド、例、リファレンスを提供することで、ユーザーと開発者の両方をサポートします。

### フォーマット

- ドキュメントには**Markdown（`.md`）**または**Jupyter Notebook（`.ipynb`）**を使用してください。
- 説明的なコンテンツや静的ドキュメントにはMarkdownが推奨されます。
- 実行可能でインタラクティブなコンテンツ（チュートリアルやデモなど）にはJupyter Notebookを使用してください。

### Jupyter Notebookガイドライン

- すべてのNotebookが**完全に実行可能**であることを確認してください。
- コミット前に常に**すべてのセルを実行**し、**出力を保存**してください。
- CI/CD環境は**GPU実行をサポートしていない**ため、Notebookはローカルで事前に実行する必要があります。

### MarkdownおよびNotebookディレクティブ

リッチフォーマットには以下のパターンを使用してください：

- `[name](#ref)` -- 内部クロスリファレンス、例：`[ModuleBase](#evox.core.module.ModuleBase)`または`[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` -- 画像の埋め込み、例：`![Module base](/_static/modulebase.png)`

---

## 翻訳

ドキュメントは多言語コンテンツをサポートしています。翻訳を更新または生成するには、以下の手順に従ってください。

### 翻訳の更新（例：`zh_CN`の場合）

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```
