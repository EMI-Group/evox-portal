---
title: "Genesis wandelt openJiuwen Agent Core von Python nach Rust um"
pubDate: 2026-11-20
updatedDate: 2026-11-20
summary: "Genesis hat das Agent-SDK als 30 Rust-Crates mit 26 ausführbaren Beispielen neu entwickelt. Der Fall zeigt die Weiterentwicklung und die Prüfung von Sitzungs-, Werkzeug- und Workflow-Verhalten nach der Migration."
---

openJiuwen Agent Core ist ein Python-SDK für Agent-Anwendungen: Es verbindet Modellaufrufe, Werkzeuge, Workflows und Sitzungszustand. Im [Evidence-Bericht vom 20. November 2026][evidence] dokumentiert EvoX Genesis die Umwandlung nach Rust. **agent-core-rs** entstand mit dem Python SDK v0.1.20 als schreibgeschützter Referenz.

Das Ergebnis ist ein Workspace mit **30 Rust-Crates und 26 ausführbaren Beispielen**, entwickelt durch eine erste Konvertierung und eine spätere Aufgabe auf Basis des erhaltenen Codes. Die technische Frage lautet, welches Verhalten den Sprachwechsel übersteht: Gespeicherte Sitzungen müssen sich korrekt wiederherstellen lassen, Werkzeuge auf Freigaben warten und Workflows den vorgesehenen Zweig nehmen.

![Konzeptillustration der Umwandlung von Python-Code in Rust mit entsprechenden Workflow-Zweigen](./contract-migration-v2.webp)

## Die Implementierung ändern, den Vertrag erhalten

Der Workspace gliedert sich in gemeinsame Typen, Modell- und Werkzeugzugriff, Sitzungszustand, Orchestrierung und Anwendungseinstiegspunkte. Ausführbare Artefakte decken Workflows, DeepAgent, Teamzusammenarbeit und CLI ab. Diese Ebenen machen die Zahl von 30 Crates greifbar: Die Konvertierung umfasst mehrere Teile einer Agent-Anwendung; die [Abdeckungsmatrix][parity] dokumentiert den unterstützten Umfang jeder Integration.

Der [Quellstand 242b5b5][repo] zielt auf Card-JSON-Felder, Modellprotokolle, gespeicherte Sitzungsdaten, Workflow-Referenzen und CLI-Verhalten. Rust-Typen und Traits, asynchrone Ausführung mit Tokio und Serde-Serialisierung ersetzen die Python-Mechanismen. Gemeinsame Typen liegen unterhalb ihrer Nutzer; Sammel-Crates exportieren APIs erneut, ohne Verhalten doppelt zu implementieren.

Die Kompatibilität gilt für den implementierten Teilumfang. Die [Abdeckungsmatrix][parity] unterscheidet unterstützte Schnittstellen, Teilimplementierungen und zurückgestellte Bereiche, darunter verteilte Ausführung, GPU/ML und einige Anbieter- oder externe Dienstintegrationen. Vorhandene typisierte Unsupported-Pfade liefern explizite Fehler; andere Lücken haben keine Implementierung. Diese Unterscheidung ist bei der Auswahl einer Anwendung für die Migration entscheidend.

## Eine wiederhergestellte Sitzung und ein wartendes Werkzeug

Das [Sitzungsbeispiel][session] speichert einen Checkpoint temporär, erzeugt eine neue Sitzung mit gleicher Identität und Speicherwurzel und stellt den Zustand wieder her. Die Prüfung überschreitet eine Speichergrenze. Das erste Sitzungsobjekt nur im Arbeitsspeicher zu behalten, würde diese Eigenschaft nicht belegen.

Im Freigabeszenario liegt eine Schranke vor einem simulierten Werkzeugaufruf. Ein Zähler prüft, dass das Werkzeug während der ausstehenden Freigabe nicht ausgeführt wurde. Ein erneuter Aufruf mit den passenden Freigabedaten erlaubt die Ausführung. Ein geskriptetes Modell und ein instrumentiertes Werkzeug machen die Reihenfolge ohne Anbieterzugangsdaten sichtbar.

Das [Workflow-Beispiel][workflow] prüft ein anderes Integrationsproblem. Zwei Eingaben nehmen den kurzen beziehungsweise langen Zweig derselben kompilierten Topologie; Werte werden über Knotenfeldreferenzen weitergegeben. Würden beide sich ausschließenden Vorgänger einfach an einen Knoten angeschlossen, entstünde eine UND-Bedingung, die auf beide wartet. Weiterleitungskomponenten und explizite Routenaktivierung führen jeden Zweig zum gemeinsamen Ende. Nur Feldnamen zu erhalten, würde dieses Scheduling-Problem übersehen.

## Zwei Aufgaben mit klar abgegrenzten Kosten

Der [Historienanhang][history] dokumentiert die erste Konvertierung vom 11. bis 16. November UTC, die unter Erhalt des Ergebnisses manuell gestoppt wurde. Eine anschließende Evolutionsaufgabe wurde am 19. November UTC abgeschlossen. Die DeepSeek V4 Flash zugerechneten Modellaufrufe kosteten für beide Aufgaben zusammen **150,024283 US-Dollar**. Die zweite Aufgabe setzte bei der Ergebnisrevision der ersten an. Damit zeigt der Ablauf, wie eine bestehende Implementierung über Aufgabengrenzen hinweg erhalten und weiterentwickelt werden kann.

Die Laufzeiten summieren sich einschließlich Wartezeiten auf **113 Stunden und 42 Minuten**; der Kalenderzeitraum beträgt mehr als acht Tage. 3.570 registrierte Agent-Instanzen sind eine kumulierte Zahl, keine maximale Parallelität. Infrastruktur, menschliche Arbeit und spätere Dokumentation sind nicht enthalten. Eine zwischenzeitlich fehlgeschlagene Aufgabe ist wegen unbekannten Verbrauchs ebenfalls ausgenommen.

Der Anhang zählt 1.434.767 physische Rust-Zeilen einschließlich Kommentaren und Leerzeilen in Produktionscode, Tests und Beispielen. Das beschreibt den Umfang des Artefakts; Verhaltenstests bestimmen, was die Neuentwicklung erhält.

## Was die Prüfungen belegen

Das [Prüfprotokoll][parity] meldet erfolgreiche Formatierung, Clippy, Offline-Workspace-Tests, Rustdoc, sieben Feature-Gruppen und Beispiel-Builds. **24.293 ist die Zahl der Testfunktionen im Quelltext**, kein erfasster Gesamtwert bestandener Tests. Fünf ignorierte Einträge sind Hilfsprogramme oder umgebungsabhängige Prüfungen. Die spätere Dokumentationsaufgabe wiederholte nur ausgewählte Kontrollen.

Geskriptete Modelle, lokale Testserver, temporäre Speicher und Loopback-Sockets prüfen Protokolle und Laufzeitverhalten. Das ermöglicht wiederholbare Kontrollen ohne echte Zugangsdaten; der Aufgabenerfolg mit realen Modellen muss separat bewertet werden. Die Ergebnisse stammen vom Projekt. Wir haben die Rust-Tests nicht unabhängig erneut ausgeführt.

## Schnellere lokale Operationen im gemessenen Umfang

Der [Benchmark-Bericht][bench] vergleicht einen Rust-Release-Build mit CPython 3.11.15 auf einem Linux-Rechner mit acht logischen CPUs und warmem Seitencache. Prompt-Rendering benötigt **0,356 µs gegenüber 16,37 µs**, etwa **46×** schneller. Ein Graph mit zwei Knoten ohne I/O benötigt **7,23 µs gegenüber 112,3 µs**, etwa **15×** schneller.

Wiederholte Batches werden auf einzelne Operationen normiert; die Rust-Batches sind zehnmal größer. Die logische Graphform stimmt überein, die Engines unterscheiden sich. Die Faktoren beschreiben lokalen Framework-Overhead, ohne Modell- und Netzwerklatenz, Kaltstart oder Skalierung unter Parallelität. Separate Prozessmessungen für den ersten Python-Graphen und einen geskripteten Rust-Agent-Durchlauf verwenden unterschiedliche Lasten und liefern keinen vergleichbaren Startzeit- oder Speicherfaktor.

## Mit einem zu erhaltenden Verhalten beginnen

Für eine Migrationsbewertung bieten Checkpoints, Freigaben und bedingtes Routing konkrete Abnahmekriterien. Prüfen Sie die geplante Integration anhand der [Matrix][parity], bereiten Sie die Build-Umgebung vor und verwenden Sie `make verify`. `cargo test --workspace --offline --no-fail-fast` berücksichtigt auch Entwicklungs-Crates, die ein einfaches `cargo test` auslässt.

Der Workspace wird als Quellcode verteilt; die Crates tragen `publish = false`. Der [vollständige Evidence-Bericht][evidence] und die [fixierte Implementierung][repo] ermöglichen weitere Prüfung. Zusammen mit der früheren [MESA-Neuentwicklung](/de/news/genesis-mesa) zeigt der Fall, wie sich Genesis anhand erhaltener Verhaltensweisen und neuer Implementierungen bewerten lässt.

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

