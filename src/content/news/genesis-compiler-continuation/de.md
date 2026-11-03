---
title: "Genesis setzt Compilerentwicklung nach Modellwechsel fort"
pubDate: 2026-11-03
summary: "Der Fortsetzungsversuch von Genesis meldet 1,820/1,820 bestandene ausgewählte LLVM-SingleSource-Fälle nach dem Wechsel von GLM 5.2 zu DeepSeek V4 Flash."
---

Kann ein Softwareprojekt nach einem Modellwechsel weiter vorankommen? Der Eintrag Compiler Continuation vom 7. September 2026 beschreibt die Fortsetzung auf Basis des akzeptierten Compiler-Repositorys, ohne den Gesprächskontext des vorherigen Agents zu übernehmen.

Laut Eintrag wechselte die Entwicklung von **GLM 5.2 zu DeepSeek V4 Flash**; die Rekursionstiefe stieg von **4 auf 8**. Danach bestanden **1,820/1,820 beibehaltene LLVM-SingleSource-Testfälle**. Das betrifft eine definierte Auswahl, nicht die gesamte LLVM-Testsuite.

Akzeptierter Code und Projekthistorie bilden die Grundlage weiterer Arbeit. Darin zeigt sich Genesis’ Ansatz zur Kontinuität. Erstentwicklung und Fortsetzung des Compilers teilen sich ein Repository und zählen nicht als unabhängige Projekte.

Dieser Rückblick folgt dem Evidence-Eintrag. Die Ergebnisse stammen vom Projekt selbst und wurden nicht unabhängig reproduziert. Kosten und zusätzliches Codevolumen der Fortsetzung fehlen. Die README des Standardbranches beschreibt einen anderen Evaluierungsstand; ihre Testzahlen dürfen nicht mit diesem Ergebnis zusammengeführt werden.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
