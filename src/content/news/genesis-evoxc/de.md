---
title: "EvoX Compiler: Ein expliziter Tensorgraph-Stack, entwickelt mit Genesis"
pubDate: 2026-11-03
summary: "Der EvoX-Compiler-Fall von Genesis beschreibt einen Python-Tensorgraph-Compiler samt Laufzeit mit NumPy, IREE, XLA und TVM."
---

EvoX Compiler (evoxc) macht den Berechnungsgraphen zu einem prüfbaren Artefakt. Das Frontend baut EvoXIR auf und transformiert es; explizite Schritte übernehmen Absenkung, Kompilierung, Laden und Ausführung. NumPy ist die einzige Pflichtabhängigkeit. Externe Compiler verantworten Optimierung und Codegenerierung.

Der Evidence-Stand vom **28. Oktober 2026** dokumentiert vier Ausführungspfade: **NumPy, IREE, XLA und TVM**. Laut Repository wurden Code, Tests und Dokumentation mit Genesis erstellt. Der Fall verfolgt den Weg vom ersten Aufbau zur laufenden Weiterentwicklung von Schnittstellen und Backends.

Mit installiertem IREE meldet der Stand **6,789 bestandene, 46 übersprungene und 3 erwartungsgemäß fehlgeschlagene Tests**, ohne Fehler. Das sind historische Zahlen, nicht die aktuellen Gesamtwerte. Die **285,659 versionierten Textzeilen** enthalten Tests, Benchmarkdaten und Dokumentation, nicht nur Compilerquellcode. Die Modell-Token-Kosten lagen bei etwa **50 US-Dollar**, ohne Hardware.

Die Backendvalidierung hängt von der Konfiguration ab: Vulkan wurde auf einem Softwaregerät geprüft, TVMs ROCm-Pfad nur kompiliert. Es handelt sich um Eigenangaben ohne unabhängige Reproduktion. Die explizite Graphpipeline und die eingecheckten Benchmarkberichte bieten Entwicklern einen Einstieg.

[Genesis Evidence](https://genesis.evox.group/evidence/evoxc/) · [GitHub](https://github.com/EMI-Group/evoxc) · [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) · [evoxc_hf benchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md)
