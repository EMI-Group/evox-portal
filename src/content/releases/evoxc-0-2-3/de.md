---
title: "EvoX Compiler v0.2.3: das passende Backend für Ihre Arbeitslast installieren"
pubDate: 2026-11-26
summary: "Die Reihe 0.2 bringt IREE 3.13, automatische XLA-Plugin-Erkennung und korrigierte numerische Semantik; v0.2.3 liefert die geprüften Distributionsartefakte."
---

EvoX Compiler v0.2.3 wurde am 25. November 2026 UTC mit Python-Wheels und einem Quellarchiv veröffentlicht. Die kurze GitHub-Notiz verlinkt den Vergleich von v0.2.2 zu v0.2.3; das versionierte Änderungsprotokoll beschreibt die wesentlichen Änderungen der Reihe 0.2 und die Paketkorrekturen bis zu dieser Distribution. Beim Umstieg von 0.1 geht es vor allem um das passende Compiler-/Runtime-Paar, die Auswahl des physischen Geräts und die erneut zu prüfende numerische Semantik. [Veröffentlichung][release] · [Änderungsprotokoll][changes]

![Ein passgenauer Adapter vor der passenden Buchse neben einem geprüften Paket](./cover.webp)

*Konzeptillustration: Eine nutzbare Veröffentlichung muss zu ihrer Ausführungsumgebung passen.*

## Compiler und Runtime aufeinander abstimmen

Das IREE-Extra verlangt nun Compiler und Runtime ab 3.13.0 und unter 3.14. Kompilierte Artefakte sind versionsabhängig; eine mit einem anderen Paar erzeugte Datei lässt sich nicht zwingend unverändert laden. Im Upstream wurden llvm-cpu und ROCm/HIP auf einer AMD Instinct MI300X mit ROCm 7.1 erneut validiert, einschließlich Schleifen und Scans, die mit älteren IREE-Versionen scheiterten. Diese Prüfungen gelten nicht automatisch für CUDA, Multi-Rank-Ausführung oder sämtliche Modellbenchmarks. [Versionierte Anforderungen][requirements] · [Änderungsprotokoll][changes]

Der Adapter steuert auch das Zurücklesen vom Gerät zum Host, statt sich blind auf den verkürzten Runtime-Pfad zu verlassen. Das ist relevant, wenn die Berechnung gelingt, aber die Ergebnisabfrage scheitert. Hostspeicher kann einen gemappten Pfad behalten; Gerätepuffer benötigen einen expliziten Transfer. Berücksichtigen Sie die Übertragungszeit in der Anwendungsarbeitslast getrennt von der Kernel-Laufzeit.

## XLA-Plugin finden und das richtige Gerät wählen

Die XLA-Registrierung prüft Plugins nicht mehr ohne Optionen, bevor der Aufrufer einen Pfad angeben kann. Die Erkennung berücksichtigt die explizite Plugin-Option, deren Umgebungsvariable, bekannte Speicherorte und installierte JAX-Plugin-Pakete, ohne JAX selbst zu importieren. Die Verfügbarkeit wird beim Kompilieren und Laden geprüft, wenn Optionen vorliegen. Build-Hilfsfunktionen reichen aufgelöste Optionen nun an den Ladevorgang weiter. Damit geht eine beim Kompilieren gefundene Plugin-Konfiguration beim Laden nicht mehr verloren. [Backend-Anleitung][guide]

Ein ROCm-Plugin muss ein ROCm-Gerät bedienen, ein CUDA-Plugin ein CUDA-Gerät. Ein GPU-Plugin bei unveränderter CPU-Standardauswahl wird abgelehnt. Wählen Sie für GPU-Experimente das entsprechende Gerät und verschieben Sie Tensoren ausdrücklich dorthin. Prüfen Sie vor dem Kopieren zum Host den Ausgabeort. Ein fehlgeschlagener XLA-Aufruf leert außerdem zwischengespeicherte Ausgabezeigerplätze, sodass spätere Aufrufe keine veralteten Pufferzeiger wiederverwenden.

## Vor dem Geschwindigkeitsvergleich die Semantik prüfen

Der NumPy-Referenzinterpreter verwendet zwischengespeicherte Dispatch-Pläne, gibt tote Zwischenwerte nach der letzten Verwendung frei und teilt eine unveränderliche Hostgeräteinstanz. Das senkt Vorbereitungs- und Allokationsaufwand ohne neue öffentliche Aufrufweise. Die TensorNEAT-Messungen im Änderungsprotokoll betreffen konkrete Arbeitslasten und sind kein allgemeiner Beschleunigungsfaktor.

Die kompilierte Restwertoperation folgt jetzt NumPy floormod: Das Ergebnis trägt das Vorzeichen des Divisors. Negative Eingaben eignen sich deshalb als Upgrade-Test. Bewahren Sie feste Eingaben und Referenzausgaben auf und vergleichen Sie Interpreter und Compiler mit zum Datentyp passenden Toleranzen. Die Paketkorrekturen akzeptieren das von maturin mitgelieferte Verzeichnis gemeinsamer Bibliotheken und legen geprüfte Distributionsdateien flach ab. Dadurch werden Fehler behoben, die ihre Veröffentlichung verhinderten. [Dokumentierte Korrekturen][changes]

## In einer sauberen Umgebung aktualisieren

Python 3.11 oder neuer ist erforderlich. Installieren Sie das ausgewählte 0.2.3-Wheel aus den Release-Assets mit pip; verfügbar sind Linux-, macOS- und Windows-Wheels sowie ein Quellarchiv. Für das IREE-Extra verwenden Sie `pip install "evoxc[iree]==0.2.3"`, und prüfen Sie beide IREE-Abhängigkeiten. Die separate Distribution evoxc-hf behält ihre eigene Version. Führen Sie `pip check` aus, kontrollieren Sie die installierte Version und wiederholen Sie einen repräsentativen Graphen, einen negativen Restwertfall und einen Gerätetransfer hin und zurück, bevor Sie größere Arbeitslasten umstellen. [Installationsanleitung][guide]

Graphtransformationen, eigene Operationen und explizite Kompilierungsstufen rund um diese Backends erläutert der Artikel zur [angepassten Kompilierung][related] ergänzend zur Dokumentation dieses Releases.

[release]: https://github.com/EMI-Group/evoxc/releases/tag/v0.2.3
[changes]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/CHANGELOG.md
[requirements]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/pyproject.toml
[guide]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/README.md
[related]: /de/news/evoxc-custom-compilation-pipeline
