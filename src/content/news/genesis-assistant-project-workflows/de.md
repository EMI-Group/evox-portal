---
title: "Genesis Assistant: Vom Gespräch zur Projektaufgabe"
pubDate: 2026-11-16
updatedDate: 2026-11-22
summary: "Ein Projekt auswählen, eine konkrete Aktion freigeben und Hintergrundarbeit verfolgen, ohne ihre Laufzeit an den Chat zu binden."
---

Eine Bitte, ein Projekt zu reparieren, braucht ein Ziel, eine freigegebene Aktion und einen Weg, das Ergebnis zu verfolgen. Genesis Assistant verbindet diese Schritte mit PR #172, die am 15. November 2026 in `main` zusammengeführt wurde. Der Ablauf erweitert die [Fortführung von Gesprächen][previous] um projektbezogene Arbeit.

![Ein Projektordner durchläuft eine Freigabestation, die mit einer unabhängigen Werkstatt verbunden ist](./genesis-assistant-project-workflows.webp)

*Konzeptillustration: Das Projekt festlegen und die Arbeit freigeben, bevor ihre unabhängige Ausführung verfolgt wird.*

## Vor dem Start das Ziel festlegen

Chat und Task-Steuerung benötigen keinen Genesis-Checkout mehr. Quellcodereferenz ist optional und genehmigungspflichtig. Ein Projekt auf dem ausgewählten Host ergänzt fehlende Task-Pfade, liest aber keine Dateien und autorisiert keine Entwicklung. Während einer Antwort ist der Projektwechsel gesperrt; ein ausdrücklich anderer Pfad bleibt das angezeigte Genehmigungsziel. [Integrierte Änderungen][workflows]

Die Auswahl gilt für Knoten und Gespräch; ein neues Gespräch auf demselben Knoten kann sie übernehmen. Der Server stellt den Werkzeugen die Knoten- und Gesprächsidentität bereit, statt diese dem Modell zu überlassen. Nennt eine Anfrage ausdrücklich einen anderen Pfad, muss die Freigabe dieses tatsächliche Ziel zeigen. Das ist etwa bei zwei ähnlich benannten Repositories wichtig: Vor dem Start den Pfad zu prüfen verhindert, dass die falsche Arbeit freigegeben wird.

## Von der Freigabe zur verfolgten Aufgabe

Die elf mit MCP geteilten Definitionen unterscheiden Abfragen von Änderungen. Das Lesen eines Aufgabenstatus erfolgt direkt; Starten, Abbrechen und Übermitteln von Anforderungen benötigen eine Freigabe für unveränderliche strukturierte Parameter. Ablehnung oder Zeitüberschreitung führen die Aktion nicht aus. Für eine Testkorrektur geben Sie den Fehlerkontext an, prüfen Ziel und vorgeschlagene Parameter und genehmigen genau diese Anfrage. Öffnen Sie anschließend Aufgabenverfolgung und Ergebnisprüfung, statt aus der Annahme der Anfrage bereits auf Erfolg zu schließen. [Werkzeugvertrag][workflowguide]

Erfolgreiche Starts werden automatisch verfolgt; die durchsuchbare Tasks-Auswahl verknüpft vorhandene Tasks.

## Arbeit und Antwort getrennt steuern

Eine zusätzliche Anforderung wird zunächst eingereiht; das bedeutet noch nicht, dass der aktive Entwickler sie übernommen hat. **Stop reply** beendet entsprechend die Antwort nach dem laufenden Werkzeugstapel und behält die Sitzung bei, während die Entwicklungsaufgabe weiterläuft. Karten zeigen beobachtete Zustände, Zähler und Aktualisierungszeiten, keinen erfundenen Fortschrittsprozentsatz. Scheitert eine Aktualisierung, bleibt die letzte Beobachtung sichtbar. So lässt sich entscheiden, ob man wartet, das Ergebnis prüft, Anforderungen ergänzt oder einen Abbruch anfordert. Abbruch macht Git-Änderungen nicht rückgängig.

Task-Verknüpfungen bleiben nach Sitzungsende erhalten, Gespräche im Speicher jedoch nicht nach Serverneustart; persistente Tasks lassen sich wiederfinden. Testen Sie mit PR #172 und prüfen Sie vor Wiederholung einer unklaren Übermittlung den Status. [Aktualisierter Leitfaden][workflowguide]

## Dateien vom richtigen Gerät einbringen

Browser-Uploads unterstützen Text, PDF, DOCX, Bilder und Audio, vier Dateien pro Nachricht mit je 15 MiB; fertige Anhänge benötigen keinen Begleittext. Die zusätzliche Serverpfadeingabe unterstützt den lokalen Dashboard-Knoten und ersetzt keinen nicht unterstützten entfernten Knoten durch diesen Host.

Der Browser-Upload liest Dateien vom gerade verwendeten Gerät. Ein Serverpfad bezeichnet einen anderen Ort und kann nur auf dem lokalen Dashboard-Knoten gelesen werden. Warten Sie vor einem Kontextwechsel auf abgeschlossene Uploads: Ein Wechsel von Gespräch oder Knoten bricht ausstehende Übertragungen ab. Für das Nachschlagen im Genesis-Code bleibt die optionale Vorbereitung der Quellreferenz genehmigungspflichtig; vergleichen Sie deren Version mit der laufenden Runtime. Projektkontext und Genesis-Quellreferenz erfüllen damit unterschiedliche Aufgaben. [Dateien und Quellreferenz][workflowguide]

Die [Workbench-Änderungen vom 20. November](/de/news/genesis-project-workbench) vereinen Projektnavigation, Git-Ansichten und VCT-gebundene Entwürfe in einer gemeinsamen Arbeitsumgebung.

[previous]: /de/news/genesis-assistant-interactive-sessions
[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
