---
title: "Genesis: Softwarefortschritt über Modellwechsel hinweg bewahren"
pubDate: 2026-11-03
summary: "Eine Compiler-Übergabe untersucht, wie akzeptierter Code, Projektstruktur und Prüfprotokolle die Entwicklung bei einem Modellwechsel fortsetzen lassen."
updatedDate: 2026-11-08
---

Der [Evidence-Eintrag vom 7. September 2026](https://genesis.evox.group/evidence/compiler-continuation/) beschreibt die Übergabe von **GLM 5.2 an DeepSeek V4 Flash** innerhalb derselben akzeptierten Entwicklungslinie. Der frühere Gesprächskontext wurde nicht übertragen.

![Eine durchgehende Brücke verbindet zwei unterschiedliche Zeichenflächen](./compiler-model-handoff.webp)

Quellcode, Struktur und akzeptierte Historie blieben jedoch verfügbar.

## Was erhalten bleiben muss

Ein Compiler verbindet Parsing, semantische Analyse, Zwischendarstellung und Codegenerierung. Lokale Änderungen können andere Module beeinflussen. Zusätzlicher Code muss sich deshalb integrieren und Regressionstests bestehen.

Das jcc-Repository zeigt Rust-Implementierung, explizite Zwischendarstellung, Funktionsgrenzen und Testwerkzeuge. Seine README beschreibt einen anderen Entwicklungsstand und ersetzt den Fortführungsnachweis nicht.

## Berichtete Ergebnisse

Die rekursive Aufgabentiefe steigt von **4 auf 8**; nach der Übergabe bestehen **1.820/1.820 beibehaltene LLVM-SingleSource-Fälle**. Dies ist das festgelegte Evaluationsset, nicht die gesamte LLVM-Testsuite. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

Die Tiefe beschreibt Aufgabenzerlegung, nicht unmittelbar Qualität. Verhaltensbelege liefern die Tests. Allgemeine Zuverlässigkeit würde weitere Aufgaben und Wiederholungen verlangen.

## Kontinuität praktisch verstehen

Bewahren Sie Artefakte, die Nachfolger prüfen können: Code, Schnittstellen, Bedingungen, akzeptierte Änderungen und Evaluationsverfahren. Gesprächsgedächtnis kann helfen, muss aber nicht alleiniger Träger des Fortschritts sein.

## Entwicklung mit bleibenden Ergebnissen

Entstehung und Fortführung verwenden [dasselbe Repository](https://github.com/EMI-Group/genesis-demo-jcc). Zählen Sie sie nicht als unabhängige Projekte und addieren Sie keine verschieden abgegrenzten Tests. Zusätzlicher Codeumfang und Kosten der Fortführung wurden nicht berichtet.

Eine brauchbare Übergabe bündelt die akzeptierte Revision, die Testliste, Ausführungsbefehle und bekannte Ausschlüsse. Lassen Sie das nächste Modell zunächst eine kleine, prüfbare Änderung vornehmen und vergleichen Sie sie mit der Basis. Die [Historienansicht](/de/news/genesis-development-history) erläutert die Nachverfolgung von Beiträgen nach dem Ende eines Agenten.
