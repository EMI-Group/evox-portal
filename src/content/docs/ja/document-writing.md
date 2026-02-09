---
title: "ドキュメント作成ガイド"
order: 7
section: "developer"
---

# ドキュメント作成ガイド

このガイドは、コードベースや関連ファイルにおけるドキュメントの作成と保守に関するベストプラクティスをまとめています。

---

## コード内ドキュメント (Docstrings)

Docstringは、コードの目的、使用方法、動作を理解するために不可欠です。以下の規約に従ってください。

### 一般的なルール

- **すべてのパブリッククラス、メソッド、関数**にDocstringを記述してください。
- **Sphinxスタイル**のDocstringを使用してください。
- Docstringにパラメータの型を含めないでください。型は型ヒント（Type Hints）を使用して関数シグネチャで宣言されることが想定されています。

### フォーマットとディレクティブ

以下のディレクティブを使用して、各要素を記述してください。

- `:param <name>:` — パラメータの説明。
- `:return:` — 戻り値の説明。
- `:raises <exception>:` — 関数が発生させる可能性のある例外の説明。

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

## 外部ドキュメント (`docs/` ディレクトリ)

プロジェクトレベルのドキュメントはすべて `docs/` ディレクトリに配置されています。これらのドキュメントは、ガイド、例、リファレンスを提供し、ユーザーと開発者の両方を支援します。

### フォーマット

- ドキュメントには **Markdown (`.md`)** または **Jupyter Notebooks (`.ipynb`)** を使用してください。
- 説明的なコンテンツや静的なドキュメントにはMarkdownが推奨されます。
- 実行可能なインタラクティブなコンテンツ（チュートリアルやデモなど）にはJupyter Notebooksを使用してください。

### Jupyter Notebook のガイドライン

- すべてのノートブックが**完全に実行可能**であることを確認してください。
- コミットする前に、必ず**すべてのセルを実行**し、**出力を保存**してください。
- CI/CD環境は**GPU実行をサポートしていない**ため、ノートブックはローカルで事前に実行しておく必要があります。

### Markdown と Notebook のディレクティブ

リッチなフォーマットには以下のパターンを使用してください。

- `[name](#ref)` — 内部相互参照。例：`[ModuleBase](#evox.core.module.ModuleBase)` または `[ModuleBase](#ModuleBase)`
- `![Alt Text](path)` — 画像の埋め込み。例：`![Module base](/_static/modulebase.png)`

---

## 翻訳

ドキュメントは多言語コンテンツをサポートしています。翻訳を更新または生成するには、以下の手順に従ってください。

### 翻訳の更新（例：`zh_CN` の場合）

```bash
cd docs
make gettext
sphinx-intl update -p build/gettext -l zh_CN
cd ..
python docs/fix_output.py
```