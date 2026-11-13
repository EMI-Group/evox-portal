---
title: "EvoRL: Jeden Schreibvorgang bewahren, pro Trainingsschritt einen Datensatz lesen"
pubDate: 2026-11-13
summary: "Lokale JSONL-Aufzeichnung bewahrt Experimentmetadaten und Metrikschreibvorgänge und führt wiederholte Schritte beim Lesen ohne Tracking-SDK zusammen."
---

Eine Trainingsiteration kann mehrere Beobachtungen liefern: einen Verlustwert, einen Evaluierungsreturn und später eine korrigierte Metrik. Jeder Schreibvorgang als neue Iteration verschiebt die Zuordnung; das Verwerfen wiederholter Schritte verliert Informationen. EvoRL, das Framework für Reinforcement Learning und evolutionäres Lernen, ergänzte am 12. November 2026 [lokale JSONL-Aufzeichnung][change] in `main`. Eine [Anpassung der Dateinamen][fix] folgte am 13. November, jeweils nach Pekinger Zeit. Damit stehen das ursprüngliche Schreibprotokoll und eine getrennte, nach Schritten geordnete Analyseansicht bereit.

![Unveränderte Experimentblätter neben einem nach Beobachtungsschritten gruppierten Archiv](./jsonl-recording-cover.webp)

*Konzeptillustration: Einzelbeobachtungen bewahren und ihre zusammengeführte Ansicht nach Trainingsschritt ordnen.*

## Ein lokales Artefakt samt Experimentkontext

Mit `recorders=[log,jsonl]` werden maschinenlesbare Metriken neben gewöhnlichen Logs gespeichert, ohne ein Tracking-SDK hinzuzufügen. Die [versionierte Kurzanleitung][guide] beschreibt die gemeinsame Recorder-Konfiguration der Trainingsskripte. Das JSONL-Backend erhält Projekt, Laufname, aufgelöste Konfiguration, Tags, Ausgabepfad und optionale Gruppe.

Die Initialisierung schreibt diesen Kontext als Metadatenkopf. Jeder folgende Schreibvorgang hängt ein JSON-Objekt mit dem übergebenen ganzzahligen `step` und verschachtelten `data` an und leert den Dateipuffer. Die Rohdatei bewahrt die Eingangsreihenfolge, auch bei ungeordneten Schritten und mehrfachen Schreibvorgängen. Wird das Ausgabeverzeichnis auf einen separaten Analyserechner übertragen, reisen Konfiguration und Beobachtungen gemeinsam als lesbares lokales Artefakt.

## Beim Lesen zusammenführen, nicht beim Aufzeichnen

`load_jsonl_records(path)` wird aus `evorl.recorders` exportiert, liest den vollständigen Datenbestand und liefert eine nach Schritten sortierte Liste. Wörterbücher desselben Schritts werden rekursiv zusammengeführt: Spätere Schreibvorgänge ersetzen kollidierende Werte, nicht erwähnte Metriken bleiben bestehen. Arrays werden vollständig ersetzt; auch ein späteres `null` überschreibt den vorherigen Wert. Der optionale Metadatenkopf der ersten Zeile wird übersprungen und nicht in die Metrikliste aufgenommen.

Angenommen, Trainingsverlust und Evaluierungsreturn werden bei Schritt 10 getrennt geschrieben, anschließend wird der Verlust korrigiert. Die Rohdatei behält alle drei Schreibvorgänge. Der geladene Datensatz enthält den neuesten Verlust und den Evaluierungsreturn. Ein später eingetroffener Schritt 8 wird vor Schritt 10 einsortiert. Für Lernkurven bestimmt somit `step` die Iterationszugehörigkeit, nicht die Zeilenposition oder die Anzahl der Logging-Aufrufe.

## Was die Serialisierung erhält

[Implementierung und Regressionstests][change] behandeln NumPy-, JAX- und pandas-Werte. Arrays und Series werden zu Listen. DataFrames behalten Spalten und Zeilendaten, jedoch nicht ihren Index. NaN, Unendlich und fehlende pandas-Werte werden zu JSON `null`. Identifiziert der DataFrame-Index einzelne Stichproben, wandeln Sie ihn vor dem Aufzeichnen in eine explizite Spalte um; dies ergibt sich aus der gespeicherten Tabellenrepräsentation.

Fehlerhafte oder unvollständige Zeilen lösen einen Fehler mit Dateiname und Zeilennummer aus. Ein abgeschnittener letzter Datensatz wird nicht stillschweigend verworfen. Der Loader lädt den gesamten Datenbestand in den Arbeitsspeicher; berücksichtigen Sie daher die angesammelte Dateigröße bei der Analyseplanung. Eine Anwendungsmetrik namens `step` bleibt innerhalb von `data` und ist vom äußeren Iterationsfeld getrennt.

## Für jeden Lauf ein eigenes Ziel

Die Folgeänderung verwendet `sanitize_filename` gemeinsam für JSONL und skripterzeugte Logdateien. `/` wird durch `_` ersetzt: Aus `MetaWorld/Hammer-v3` wird `MetaWorld_Hammer-v3`. Andere Zeichen bleiben unverändert, und die Metadaten behalten den ursprünglichen Laufnamen. Die Dateien haben getrennte Endungen `.jsonl` und `.log`. Dies ersetzt die Prozentkodierung des ersten Commits; normalisierte Dateinamen sind nicht automatisch eindeutig.

Eine erneute Initialisierung desselben JSONL-Dateipfads überschreibt den Inhalt. Verwenden Sie für jeden Lauf ein eigenes Ausgabeverzeichnis oder einen eigenen Dateinamen, insbesondere wenn Namen sich nur durch Schrägstrich und Unterstrich unterscheiden. Beginnen Sie mit obiger Konfiguration in einem Quellcode-Checkout mit beiden Commits. Prüfen Sie an einem kleinen Experiment Kopf, Zusammenführung wiederholter Schritte und Zielpfad vor einem längeren Lauf. Der [frühere EvoRL-Entwicklungsbericht][related] erläutert Gradienten, Gerätezuordnung und Metrikformen; dieses Update erleichtert das lokale Aufbewahren und erneute Analysieren dieser Beobachtungen.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /de/news/evorl-jax-training-consistency
