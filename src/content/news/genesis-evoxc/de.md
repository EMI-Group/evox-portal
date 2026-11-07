---
title: "Genesis entwickelt EvoX Compiler: KI baut evolutionäre Infrastruktur"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Der EvoX-Compiler-Fall verbindet zwei Ökosystemebenen: Genesis entwickelt Software, der resultierende Compiler unterstützt Programmtransformation und Ausführung."
---

*Aktualisiert am 7. November 2026. Historische Ergebnisse behalten ihren ursprünglichen Bezugszeitpunkt.*

Infrastruktur für evolutionäre KI ist selbst ein umfangreiches Softwarevorhaben. Der Genesis-EvoX-Compiler-Fall verbindet beide Ebenen: Ein agentisches Entwicklungssystem erstellt und erweitert einen Tensorgraph-Compiler, während Schnittstellenverträge und Regressionstests bestimmen, welche Änderungen in die fortgesetzte Implementierung eingehen.

## Klare Zuständigkeiten

EvoX Compiler erzeugt und transformiert EvoXIR und führt anschließend Lowering, Kompilierung, Laden und Ausführung durch. Externe Compiler optimieren und erzeugen Code. NumPy dient als Referenz; IREE, XLA und TVM sind optionale Pfade.

Transformationen müssen Bedeutung erhalten, Backends akzeptierte Operationen unterstützen und die Laufzeit Gerätegrenzen beachten. Das sind konkretere Abnahmekriterien als wachsende Codezahlen.

## Organisation der Arbeit

Der [Evidence-Stand vom 28. Oktober 2026](https://genesis.evox.group/evidence/evoxc/) beschreibt Paketkontexte, einseitige Abhängigkeiten und Tests vor dem Aufbau weiterer Schichten. Laut Repository wurden Code, Tests und Dokumentation mit Genesis erstellt.

Die Arbeit setzte sich bei Adaptern, Graphen und Benchmarks fort. Der Eintrag rekonstruiert Struktur aus der Historie; er prüft nicht jede Agentenaktion. Zwei Kalendermonate sind keine zwei Monate ununterbrochener autonomer Laufzeit.

## Mehrstufige Validierung

Mit IREE wurden **6.789 bestandene, 46 übersprungene und 3 erwartete Fehlschläge**, ohne Fehler, berichtet. Ohne Compiler bestanden **6.367 Tests**. Diese historischen Zahlen dürfen nicht durch spätere Release-Summen ersetzt werden.

Die separate Integration `evoxc_hf` vergleicht Ausgaben und Latenz mit torch/transformers. Checkpoint, Präzision, Backend und Hardware gehören zum Vergleich: numerische Übereinstimmung und Laufzeit sind verschiedene Eigenschaften.

## Grenzen der Ergebnisse

Die **285.659 versionierten Textzeilen** enthalten Tests, Dokumentation und Benchmarkdaten. Rund **50 US-Dollar** decken nur Modell-Tokens ab, keine Hardware. Modell, Episodenzahl und tatsächliche Laufzeit wurden nicht genannt.

Vulkan nutzte das Softwaregerät Mesa lavapipe; TVM ROCm war nur kompiliert. Ein Backendname beweist keine vollständige Gerätevalidierung. Ergebnisse sind projektseitig berichtet, ohne unabhängige Reproduktion.

## Softwareevolution und Recheninfrastruktur verbinden

Beginnen Sie mit der Pipeline in der [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) und verfolgen Sie Aussagen zu Tests und [gespeicherten Modellbenchmarks](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md). Prüfen Sie verfügbare Pfade und offene Leistungsdefizite.

Das [EvoX-Compiler-Repository](https://github.com/EMI-Group/evoxc) zeigt die Verbindung zwischen KI-gestützter Entwicklung und Recheninfrastruktur. Genesis trägt zu einem System bei, dessen explizite Repräsentationen und Ausführungspfade weitere evolutionäre Experimente unterstützen können. Erhaltene Schnittstellen, Tests und Messungen machen die laufende Entwicklung überprüfbar.
