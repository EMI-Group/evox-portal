---
title: "EvoX Compiler、自分で拡張できるコンパイル工程へ"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "main にカスタム呼び出し、インライン StableHLO、編集済みモジュールの入口を追加。未対応の経路はバックエンドの能力宣言で明示します。"
---

実験的な演算がテンソルライブラリの範囲を超えても、周囲のプログラム全体を変更する必要はありません。EvoX Compiler の 2026 年 11 月 23～24 日のデフォルトブランチ更新は、コンパイラ固有の演算、編集済み中間コードのコンパイル、独自バックエンドの選択を可能にします。まず、拡張をコンパイラ内部、実行時カーネル、バックエンド全体のどこで動かすかを決めます。[実装とガイド][guide]

![交換可能な光学カートリッジを通り、モジュール式レールを赤い光がつなぐ](./cover.webp)

*概念図：周囲の工程を明示したまま、一つの段階を交換する。*

## 独自処理の境界を選ぶ

`custom_call` は、明示した結果と任意のバックエンド設定を伴う、名前付き StableHLO 呼び出しを出力します。ターゲットの存在と変換可否は外部コンパイラが判断します。`inline_stablehlo` はコード片を埋め込みます。入力は `%in0` から、出力への代入は `%out0` から順に番号を付け、結果仕様も明示します。名前、設定、コード片はグラフを特殊化する静的な値です。[演算の契約][ops]

これらの入口は任意のカーネルを IREE や PJRT に登録しません。実行時に動く Python/Triton カーネルには既存の `external_call` 登録経路を使います。通常の EvoX Compiler 演算で表せる可搬な処理には、分解実装を持つ block も選べます。コンパイラへの宣言と実行時の実装を区別することが重要です。

## 中間プログラムを編集してコンパイル

例えば開発者は `source_text()` で実行可能オブジェクトを調べ、StableHLO を編集して、入出力仕様とともに `compile_text` へ渡せます。トレースとグラフ構築を省き、通常のコンパイルとロードへ進みます。仕様は外側のタプルを表すため、実行時も入出力のタプル契約を守る必要があります。モジュールは外部コンパイラが検証しますが、テキストを受理しただけで数値の正しさは確認できません。[工程の実装][pipeline]

編集のたびに小さな入力セットで元のプログラムと結果を比較してください。存在しないカスタムターゲットはコンパイラの合法化段階で診断すべきで、黙ってバックエンドを変更して回避すべきではありません。NumPy インタープリタとネイティブ CPU エンジンはこれらの拡張を明示的に拒否します。新しいグラフ内演算には自動バッチ化・微分規則もないため、必要なら対応済みの別経路を選びます。[能力と制約][guide]

## バックエンドを明示的に接続

バックエンドのインスタンスは工程を通して維持されます。登録 API は明示的な置換・削除に対応し、エントリポイントで外部パッケージからも提供できます。コンパイラバックエンドは能力と dtype を宣言し、コンパイルとロードを実装します。dtype 集合が空なら全グラフを拒否します。独自の IREE コンパイラ・ランタイムモジュールはオプションや環境変数で指定でき、標準ランタイムとの混同を避けて独自ビルドを試せます。[拡張ガイド][guide]

## 転送と数値比較は別に確認

同時期に Vulkan 転送も変更されました。16 MiB 以下のアップロードはマップされたコヒーレントバッファを使い、それを超えるとコピー経路になります。読み戻しはホストメモリと、単にホスト可視の GPU メモリを区別します。記録された測定は一つの Intel 内蔵 GPU・Mesa・IREE 環境に限られるため、自分の機器で転送と実行を別々に測ってください。[転送実装][transfer]

ネイティブ CPU は大きなバッファと入力配列のストレージを再利用し、繰り返す割り当ての負担を抑えます。リダクションは出力ごとの集約順序を保って独立した出力を並列化します。コンパイラアダプタは `split_reduction_threshold` と `split_reduction_non_exact` も公開します。方針を変える際は時間と数値結果の両方を確認してください。 [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

ネイティブ CPU の `power` 修正は指数処理を NumPy の浮動小数点べき乗経路に合わせます。一致性確認ツールも、整数・真偽値の厳密比較と浮動小数点の許容誤差比較を区別します。このソースを採用する前に基準出力を保存し、選んだコンパイラと機器で許容誤差も確認してください。従来の準備工程は [v0.1.1 の記事][release]、今回の更新はそのカスタマイズ方法を扱います。[数値修正][power]

関連する更新 · 2026-11-26: [EvoX Compiler v0.2.3：ワークロードに合うバックエンドを導入する](/ja/releases/evoxc-0-2-3).


[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /ja/releases/evoxc-0-1-1
