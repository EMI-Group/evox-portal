---
title: "Genesis: Softwarefortschritt über Modellwechsel hinweg bewahren"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Eine Compiler-Übergabe untersucht, wie akzeptierter Code, Projektstruktur und Prüfprotokolle die Entwicklung bei einem Modellwechsel fortsetzen lassen."
---

*Aktualisiert am 7. November 2026. Historische Ergebnisse behalten ihren ursprünglichen Bezugszeitpunkt.*

Evolutionäre KI-Systeme müssen nützlichen Fortschritt erhalten, wenn ihre Beteiligten wechseln. Genesis untersucht dies bei einer Compiler-Übergabe: Kann ein neues Modell vom akzeptierten Projekt aus weiterarbeiten und dessen Code, Randbedingungen und Tests als Grundlage verwenden?

## Ausgangspunkt: ein bestehender Compiler

Der [Evidence-Eintrag vom 7. September 2026](https://genesis.evox.group/evidence/compiler-continuation/) beschreibt die Übergabe von **GLM 5.2 an DeepSeek V4 Flash** innerhalb derselben akzeptierten Entwicklungslinie. Der frühere Gesprächskontext wurde nicht übertragen.

Quellcode, Struktur und akzeptierte Historie blieben jedoch verfügbar. Es geht um die Fortsetzung eines Projekts, nicht um einen zweiten unabhängigen Compiler.

## Was erhalten bleiben muss

Ein Compiler verbindet Parsing, semantische Analyse, Zwischendarstellung und Codegenerierung. Lokale Änderungen können andere Module beeinflussen. Zusätzlicher Code muss sich deshalb integrieren und Regressionstests bestehen.

Das jcc-Repository zeigt Rust-Implementierung, explizite Zwischendarstellung, Funktionsgrenzen und Testwerkzeuge. Seine README beschreibt einen anderen Entwicklungsstand und ersetzt den Fortführungsnachweis nicht.

## Berichtete Ergebnisse

Die rekursive Aufgabentiefe steigt von **4 auf 8**; nach der Übergabe bestehen **1.820/1.820 beibehaltene LLVM-SingleSource-Fälle**. Dies ist das festgelegte Evaluationsset, nicht die gesamte LLVM-Testsuite.

Die Tiefe beschreibt Aufgabenzerlegung, nicht unmittelbar Qualität. Verhaltensbelege liefern die Tests. Allgemeine Zuverlässigkeit würde weitere Aufgaben und Wiederholungen verlangen.

## Kontinuität praktisch verstehen

Bewahren Sie Artefakte, die Nachfolger prüfen können: Code, Schnittstellen, Bedingungen, akzeptierte Änderungen und Evaluationsverfahren. Gesprächsgedächtnis kann helfen, muss aber nicht alleiniger Träger des Fortschritts sein.

Beginnen Sie mit der übernommenen Baseline und dem genauen Testverzeichnis. Halten Sie geprüfte Revision, Ausschlüsse und Befehle fest, bevor Sie spätere Verbesserungen vergleichen.

## Entwicklung mit bleibenden Ergebnissen

Entstehung und Fortführung verwenden [dasselbe Repository](https://github.com/EMI-Group/genesis-demo-jcc). Zählen Sie sie nicht als unabhängige Projekte und addieren Sie keine verschieden abgegrenzten Tests. Zusätzlicher Codeumfang und Kosten der Fortführung wurden nicht berichtet.

Dieser Projektbericht macht Entwicklungskontinuität zu einer Architekturfrage: Was muss ein Softwareprojekt bewahren, damit spätere Agenten es erweitern können? Im EvoX-Ökosystem verbindet dies Modellfähigkeiten mit kumulativer Systementwicklung. Der beibehaltene Testsatz belegt diese Übergabe; allgemeinere Zuverlässigkeit erfordert weitere Bewertungen.
