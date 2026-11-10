---
title: "Genesis entwickelt EvoX Compiler: Verträge, Graph-Tests und Gerätesynchronisation"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Wie Genesis einen Tensor-Graph-Compiler um explizite Stufen, Transformationsprüfungen und Backend-Verträge herum entwickelt hat, mit konkreten Beispielen aus seinen öffentlichen Tests."
---

Einen Tensor-Graph-Compiler zu bauen bedeutet, mehrere Implementierungen derselben Berechnung in Übereinstimmung zu halten. Eine Graph-Transformation kann das Tensor-Layout ändern; ein Adapter kann eine Operation ablehnen; ein Geräteaufruf kann zurückkehren, bevor die Berechnung abgeschlossen ist. Der Fall des EvoX Compiler von Genesis wird dann nützlich, wenn diese Grenzen einzeln untersucht werden.

![Compiler-Graphen geprüft gegen Regressionstests](./compiler-contract-layers.webp)

Der [Evidence-Snapshot vom 28. Oktober](https://genesis.evox.group/evidence/evoxc/) verzeichnet 6.789 bestandene Tests und etwa 50 US-Dollar an Modell-Token-Kosten. Um das Engineering hinter diesen Zahlen zu untersuchen, nutzt dieser Artikel auch den öffentlich zugänglichen Quellcode von v0.1.0. Der Snapshot und das Release haben unterschiedliche Test-Gesamtzahlen; die unten stehenden Implementierungsbeispiele sind durch ihre Version gekennzeichnet.

## Das Ziel in testbare Schnittstellen überführen

EvoX Compiler besitzt die Tensor-Sprache, den EvoXIR-Graphen und die Staging-Schnittstellen. Externe Compiler empfangen seine exportierte Repräsentation und übernehmen Optimierung, Scheduling und Codegenerierung. Seine [Package-Verträge](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) dokumentieren die Abhängigkeitsrichtung: Werttypen und IR bilden die Grundlage für Tracing und Operationen, während Transformationen und Adapter auf diesen Schichten aufbauen. Das separate Paket `evoxc_hf` nutzt die öffentliche Compiler-API; der Compiler importiert die Modellintegration nicht.

Diese Aufteilung gibt der lokalen Entwicklungsarbeit eine konkrete Grenze. Beispielsweise erzeugt eine Transformation einen weiteren gewöhnlichen Graphen, anstatt von jedem Backend zu verlangen, Pythons `vmap` zu verstehen. Eine Lücke im Backend muss zu einem expliziten Fehler werden, anstatt stillschweigend den Ausführungspfad zu ändern. Kontextdokumente auf Paketebene halten die APIs und Einschränkungen fest, die eine andere Entwicklungsaufgabe bewahren muss.

Die öffentliche Pipeline lautet `trace → lower → compile → load → run`. Jede Stufe gibt ein eigenes Objekt zurück. Die [Spezifikationstests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) prüfen Eingaben der falschen Stufe, lehnen direkte Eager-Execution-Aufrufe von Graphdefinitionen ab und verifizieren, dass Convenience-Funktionen in die dokumentierte Pipeline expandieren. Sie verhindern auch das Erfassen eines konkreten Tensors aus einem Closure, es sei denn, der Autor bettet ihn explizit ein. Der praktische Nutzen besteht darin, dass eine scheinbar bequeme Abkürzung nicht heimlich einen zweiten Satz von Semantiken einführen kann.

Laut dem Evidence-Bericht schritt die Entwicklung Schicht für Schicht voran, wobei pytest-Prüfungen erforderlich waren, bevor mit der nächsten Schicht fortgefahren wurde. Das Repository bietet einsehbare Verträge und Tests für diese Methode; es bietet keine vollständige archivierte Sequenz von Agentenentscheidungen.

## Eine Populations-Transformation geprüft gegen zwei Referenzen

Ein anspruchsvolles Feature ist `batch_functions`: die Kombination mehrerer Programme mit übereinstimmenden Input/Output-Signaturen in einem einzigen Graphen. Sein Vertrag ist stärker als „der kombinierte Graph läuft“: Die Ausgabezeile i muss weiterhin dem Ergebnis von Programm i entsprechen.

Die [Integrationstests von v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) nutzen ein kleines, lesbares Beispiel. An derselben Graphposition führen drei Programme `x + 1`, `x * 2` und `x - 3` aus. Mit `switch_ops=True` repräsentiert der zusammengeführte Graph die verschiedenen Operationen durch eine Auswahl pro Zeile. Die Tests kompilieren diesen Graphen über den CPU-Pfad von IREE und vergleichen seine Ausgabe sowohl mit der NumPy-Ausführung des zusammengeführten Graphen als auch mit den gestapelten NumPy-Ergebnissen der ursprünglichen Funktionen bei `rtol=atol=1e-5`.

Compiler-freie Prüfungen inspizieren die StableHLO-Ausgabe auf die erwartete Auswahl-Operation. Eine weitere Prüfung führt identische Programme zusammen und vergleicht das Ergebnis mit `vmap`, wo keine Auswahl erforderlich sein sollte. Zusammen untersuchen diese Tests die Programmerhaltung, den Export und die Backend-Integration, anstatt eine erfolgreiche Kompilierung als einzige Akzeptanzbedingung zu verwenden.

## Device Placement ist Teil der Korrektheit

Ein Executable, das auf einer GPU läuft, sollte keine Host-Daten akzeptieren, indem es vorgibt, diese befänden sich bereits auf dem Gerät. Die [Spezifikationstests für Tensoren und Placement](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) prüfen, ob Daten ein physisches Gerät zugewiesen haben, ob Transfers explizit über `Tensor.to(device)` erfolgen und ob ein ungültiges Placement einen `DeviceError` auslöst.

Dies ist auch für die Leistungsmessung von Bedeutung. Wenn jeder Aufruf die Modellgewichte erneut überträgt, misst ein Latenzwert eine andere Arbeitslast als eine, die sie resident hält. Die [Dokumentation zur Modellintegration von v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) trennt das Laden von Checkpoints, die Forward-Berechnung und das Staging des Executables. Parameter bleiben explizite Graph-Eingaben, was ihr Placement sichtbar macht.

## Ein zurückgegebener Aufruf ist nicht zwingend abgeschlossene Arbeit

Der geräteresidente Pfad von XLA kann Arbeit in die Warteschlange stellen und zurückkehren, bevor sie abgeschlossen ist. Eine Zeitmessung nur von `run` würde daher die Ausführung unterschätzen. Die [Synchronisationstests](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) prüfen den Ereignis-Lebenszyklus: Durchläufe sammeln Completion-Handles; `synchronize()` wartet auf diese und zerstört sie; eine zweite Synchronisation führt keine zusätzliche Plugin-Arbeit aus.

Die Fehlerfälle sind ebenso spezifisch. Wenn das Warten fehlschlägt, müssen die verbleibenden Handles dennoch verarbeitet und der erste Fehler ausgegeben werden. Ein Plugin, das kein Completion-Event liefert, muss einen expliziten Fehler auslösen, anstatt einen falschen Abschluss zu behaupten.

Diese Tests verwenden ein kleines Fake-PJRT-Plugin, das keine numerischen Berechnungen durchführt. Sie verifizieren die Synchronisationssemantik und das Cleanup, nicht den GPU-Durchsatz oder die numerische Genauigkeit. Diese Unterscheidung sorgt dafür, dass die Evidenz des Tests zum Anspruch passt.

## Historisches Ergebnis und Release-Ergebnis getrennt halten

| Datensatz | Konfiguration | Gemeldetes Ergebnis |
| --- | --- | --- |
| Evidence-Snapshot 28. Okt. | IREE installiert | 6.789 bestanden; 46 übersprungen; 3 erwartete Fehler; 0 fehlgeschlagen |
| Evidence-Snapshot 28. Okt. | Compiler-frei | 6.367 bestanden; 95 übersprungen; 3 erwartete Fehler |
| v0.1.0 Release README | Core- und Modellintegrations-Suites, alle Extras installiert | 7.511 bestanden; 77 übersprungen; 4 erwartete Fehler; 0 fehlgeschlagen |

Quellen: [Evidence-Verifizierung](https://genesis.evox.group/evidence/evoxc/#verification) und [versionierter Release-Status](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Dies sind vom Projekt gemeldete Durchläufe. Abhängigkeits- und Hardware-Guards erklären nicht ausgeführte Pfade; ein bestandener CPU-Test ist keine Validierung für jeden Beschleuniger.

Die 285.659 verfolgten Textzeilen des Evidence-Snapshots umfassen Tests, Dokumentation und Benchmark-Material. Die etwa 50 US-Dollar decken Modell-Token ab, exklusive Hardware; Modell, Anzahl der Episoden und aktive Ausführungszeit wurden nicht gemeldet. Die Kalenderspanne des Repositorys ist keine kontinuierliche autonome Laufzeit.

Das Repository schreibt Genesis die Erstellung seines Codes, seiner Tests und seiner Dokumentation zu. Das konkrete Ergebnis ist ein Compiler mit separat prüfbaren Stufenverträgen, Tests zur Programmerhaltung und Semantiken für den Geräteabschluss. Beginnen Sie mit dem [Populations-Integrationstest](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py), um ein Feature über diese Grenzen hinweg zu verfolgen; die [EvoX Compiler Übersicht](/news/evox-compiler) erklärt die benutzerseitige Pipeline.
