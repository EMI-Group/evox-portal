---
title: "Genesis、MESA の Fortran 13 モジュールを Rust で再構築"
pubDate: 2026-11-03
summary: "Genesis の MESA 事例は科学ソフトウェアの再開発を示し、1,052 件のテスト合格と 10.64 米ドルのモデル token 費用を報告しています。"
---

科学ソフトウェアの再開発では、既存の数値的な振る舞いを保つ必要があります。2026 年 9 月 7 日付の MESA 記録は、元の実装を参照し、**Fortran 13 モジュールを Rust crates に書き換えた**事例です。

記録は **Fortran 139,414 行から Rust 89,946 行**への移行、**1,052 件のテスト合格**、**10.64 米ドル**のモデル token 費用を報告しています。リポジトリには元の Fortran 出力とのゴールデンテストが記述され、合格分とは別に 18 件の無視されたテストが示されています。

Evidence の**中央値で 1.55–6.87 倍**という高速化は、特定のベンチマーク結果であり、MESA 全体の一律な高速化ではありません。一方、README の 8 月 5 日の表では、エンドツーエンドの代理負荷である単一領域燃焼が **1.25 倍**です。時点と負荷が異なる結果は区別する必要があります。

移植対象は選択された数値・物理モジュールで、MESA 全体ではありません。恒星・連星進化エンジンは対象外です。既存コードの振る舞いを検証しながら再開発する事例であり、結果はプロジェクト側の報告で独立した再現はなく、token 費用にハードウェア費用は含まれません。

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
