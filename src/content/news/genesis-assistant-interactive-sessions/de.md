---
title: "Genesis Assistant: Ein pausiertes Gespräch fortsetzen"
pubDate: 2026-11-12
updatedDate: 2026-11-16
summary: "Genesis main hält Assistant-Gespräche in interaktiven Sitzungen und zeigt bei ausstehenden Freigaben den genauen Code und Zielknoten im Prüfdialog an."
---

Wer Genesis Assistant eine fehlgeschlagene Aufgabe untersuchen lässt, wechselt womöglich zur Änderungsansicht und kommt mit einer Rückfrage zurück. Dafür müssen die Unterhaltung und ihr Kontext verfügbar sein. Die vom 10. bis 12. November 2026 in Genesis `main` integrierten Änderungen halten Gespräche während ihrer Laufzeit in interaktiven Sitzungen und verschieben ihre Liste in die Seitenleiste des Dashboards. [Assistant-Anleitung][guide]

![Eine Person kehrt zu einem markierten Gespräch zurück und prüft eine vorgeschlagene Aktion](./genesis-assistant-interactive-sessions.webp)

*Redaktionelle Illustration zur Fortsetzung eines Assistant-Gesprächs und zur Prüfung einer Aktion.*

## Projekttasks und Anhänge: Ergänzung vom 16. November

PR #172, am 15. November in `main` integriert, ändert die unten beschriebene Vorbereitung: Chat und Task-Steuerung benötigen keinen Genesis-Checkout mehr. Quellcodereferenz ist optional und genehmigungspflichtig. Ein Projekt auf dem ausgewählten Host ergänzt fehlende Task-Pfade, liest aber keine Dateien und autorisiert keine Entwicklung. Während einer Antwort ist der Projektwechsel gesperrt; ein ausdrücklich anderer Pfad bleibt das angezeigte Genehmigungsziel. Assistant teilt elf Task-Definitionen mit MCP. Änderungsgenehmigungen binden die exakten strukturierten Parameter und die serverseitige Knoten-/Gesprächsidentität. [Integrierte Änderungen][workflows]

Wählen Sie etwa ein Projekt, fordern Sie einen Hintergrundtask an und prüfen und genehmigen Sie die Parameter. Erfolgreiche Starts werden automatisch verfolgt; die durchsuchbare Tasks-Auswahl verknüpft vorhandene Tasks. Karten zeigen beobachteten Status und Aktualisierungszeit und behalten bei Fehlern den letzten Kenntnisstand. Antwort stoppen lässt die Entwicklung weiterlaufen; Anforderungen senden und Task-Abbruch anfordern sind getrennte genehmigte Aktionen. Abbruch macht Git-Änderungen nicht rückgängig. Browser-Uploads unterstützen Text, PDF, DOCX, Bilder und Audio, vier Dateien pro Nachricht mit je 15 MiB; fertige Anhänge benötigen keinen Begleittext. Die zusätzliche Serverpfadeingabe unterstützt den lokalen Dashboard-Knoten und ersetzt keinen nicht unterstützten entfernten Knoten durch diesen Host. Task-Verknüpfungen bleiben nach Sitzungsende erhalten, Gespräche im Speicher jedoch nicht nach Serverneustart; persistente Tasks lassen sich wiederfinden. Testen Sie mit PR #172 und prüfen Sie vor Wiederholung einer unklaren Übermittlung den Status. [Aktualisierter Leitfaden][workflowguide]

## Zu einem wartenden Gespräch zurückkehren

Öffnen Sie **Conversations** unter **Active Tasks**. Dort stehen die aktiven Sitzungen des ausgewählten Knotens neben lokal zwischengespeicherten Gesprächen. Die Status unterscheiden wartende, laufende und beendete Sitzungen. Ein Klick öffnet `/assistant?session=<agent_id>`. Ältere `/help`-Links leiten mit ihren Abfrageparametern auf `/assistant` um. [Änderung der Route][route]

Nach einem Austausch kann die Sitzung ihren Ausführungsplatz abgeben und Kontext sowie Worktree behalten. Eine Rückfrage setzt dieselbe Agentensitzung mit derselben Prompt-Cache-Kennung fort. **New chat** beginnt ein anderes Gespräch und lässt das bisherige in der Liste. Beendete Gespräche können im Verlauf sichtbar bleiben. [Sitzungsimplementierung][session]

## Die Aufgabe untersuchen und dann entscheiden

Nehmen wir eine fehlgeschlagene Testaufgabe. Bitten Sie Assistant, Status, Fehler und Ergebnis auf dem betrachteten Knoten zu lesen. Öffnen Sie die Prüfseite, vergleichen Sie den Diff mit dem Fehler und kehren Sie über **Conversations** mit einer präziseren Frage zurück. Der Gesprächskontext steht dabei weiter zur Verfügung. Laden Sie auf einer lokalen Instanz nach Aufforderung den Genesis-Quellcode herunter, damit Assistant darauf zugreifen kann.

Für einen erneuten Versuch kann Assistant vorschlagen, mit der vorherigen Aufgabe als Kontext eine neue zu starten. Die Untersuchung nutzt die Lesestufe, der Start einen Schreibaufruf. Die Freigabe gilt dem konkreten Aufruf auf dem ausgewählten Knoten. [Aufgabenprüfung und Ausführungsstufen][guide]

## Den Schreibaufruf prüfen und die Leseposition behalten

Eine feste Leiste zwischen Gespräch und Eingabefeld meldet wartende Anfragen. **Review** öffnet einen Dialog mit jeweils einer Anfrage. Prüfen Sie den genauen Code und das Ausführungsziel. Wählen Sie dann **Allow once** oder **Deny**. Anfragen der Stufe `sudo` zeigen eine deutliche Warnung, weil sie natives Elixir unter der Identität des Genesis-Servers ausführen.

Der Dialog zeigt nun den vom Laufzeitsystem gesetzten Zielknoten und die Warnung der Anfrage. Mehrere Anfragen lassen sich nacheinander prüfen. Eine wiederhergestellte Anfrage kann erscheinen, solange sie aussteht. Gespräch und Eingabefeld behalten bei Änderungen der Leiste ihre Position. [Änderungen an der Freigabe][approval]

## Das Ergebnis bei der Aufgabe prüfen

Prüfen Sie nach einer Freigabe die erzeugte Aufgabe und ihren Status. Bei einer unterbrochenen Antwort oder einer Zeitüberschreitung beim Schreiben sollten Sie vor einer Wiederholung den aktuellen Zustand lesen. Auf einem Build mit den Änderungen können Sie eine Aufgabe zunächst nur lesend untersuchen, die Seite wechseln und über **Conversations** für eine Rückfrage zurückkehren. Die [frühere Assistant-Übersicht][related] stellt die zugrunde liegenden Bedienwerkzeuge vor. [Aktuelle Anleitung][guide]

## Die letzte Antwort beim Sitzungsende behalten

Ergänzung vom 14. November: Am 13. November in `main` integrierte Änderungen übergeben Assistant und dem Inspektor des ausgewählten Agenten einen maßgeblichen abschließenden Snapshot. Gespräch und Endstatus werden gemeinsam angewendet; verspätete Task-Meldungen öffnen das abgeschlossene Gespräch nicht erneut. Ist die Übergabe nicht verfügbar, bleibt der letzte konsistente Cache-Text sichtbar, statt unabhängig Verlauf nachzuladen. Details beendeter Agenten können außerhalb des aktiven Baums erhalten bleiben. Lassen Sie auf einem Build mit dieser Änderung das Gespräch bis zum Abschluss ausgewählt und prüfen Sie, ob letzter Text und Status übereinstimmen, bevor Sie Arbeit erneut starten. [Implementierung der finalen Übergabe][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /de/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae

[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
