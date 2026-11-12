---
title: "Genesis: Lokale Entwicklungsaufgaben über MCP delegieren"
pubDate: 2026-11-12
summary: "Genesis main ergänzt einen lokalen MCP-Endpunkt, über den Coding-Agenten Aufgaben starten, per ID verfolgen und Ergebnisse abrufen können."
---

Ein Coding-Agent kennt möglicherweise bereits das Ziel und den Projektpfad. Übernimmt eine andere Engine die Arbeit, muss der Aufrufer sie aus derselben Unterhaltung starten, verfolgen und das Ergebnis abholen können. Am 11. November 2026 wurde in Genesis `main` ein lokaler Endpunkt für das Model Context Protocol (MCP) integriert. Kompatible Coding-Agenten erhalten damit über eine Verbindung Zugriff auf die bestehenden Aufgaben-APIs. [Integrierte Änderung][pr]

![Zwei Terminals auf derselben Werkbank tauschen einen Arbeitszettel und das zugehörige Ergebnis aus](./genesis-local-mcp.webp)

*Redaktionelle Illustration einer lokalen Aufgabenübergabe zwischen einem Coding-Agenten und Genesis.*

## Mit dem zuständigen Genesis-Prozess verbinden

Der Streamable-HTTP-Endpunkt `/mcp` ist in den laufenden Genesis-Server eingebunden. Dieser authentifiziert die Anfrage, prüft ihre Argumente und ruft die bestehende Aufgaben- oder Scheduler-API auf. Die Arbeit läuft nach dem Ende der HTTP-Anfrage auf dem Server weiter. Die Verbindung ist zustandslos, für spätere Abfragen dient die Aufgaben-ID.

Genesis akzeptiert Loopback-Verbindungen und prüft Host und Origin. Anfragen nutzen ein Bearer-Token aus der Datei `mcp-token` der laufenden Instanz. Der Host des Coding-Agenten muss Streamable HTTP unterstützen und den Autorisierungsheader dauerhaft speichern können. Genesis und das beschreibbare Projektverzeichnis müssen auf demselben Rechner liegen. Die [Verbindungsanleitung][guide] beschreibt die Einrichtung eines Builds mit dieser Änderung. Die Serverkonfiguration der veröffentlichten Version steht unter [Genesis 0.14.1][related].

## Den nötigen Kontext im Auftrag mitgeben

Angenommen, ein Coding-Agent hat einen Parserfehler gefunden und soll einen Regressionstest delegieren. Mit `genesis_check` prüft er zunächst die lokale Einrichtung. Über `genesis_start_task` übergibt er dann den absoluten Pfad zum primären Checkout und ein Ziel mit fehlerhafter Eingabe, erwartetem Verhalten und auszuführendem Test. Genesis verwendet sein eigenes konfiguriertes Modell. Der Auftrag muss die relevanten Informationen aus der Unterhaltung des Aufrufers enthalten.

Die neun Werkzeuge decken Bereitschaft, Neuladen der Konfiguration, Modellsuche, Einreichen und Auflisten von Aufgaben, Status, Ergebnisse, Nachrichten und Abbruch ab. Ein bestehendes Git-Repository braucht einen ersten Commit. Der Einstieg erwartet einen primären Checkout mit einem Verzeichnis `.git` und lehnt verknüpfte Worktrees sowie Submodul-Wurzeln ab. [Anforderungen an Aufgaben und Repositories][guide]

## Nach einer erneuten Verbindung die Aufgaben-ID verwenden

Speichern Sie die bei der Einreichung zurückgegebene ID. Nach einer erneuten Verbindung rufen Sie damit `genesis_get_task` auf oder listen zunächst die jüngsten Aufgaben des Projekts auf. Der Status liefert begrenzte Fortschrittsdaten aus Scheduler und gespeichertem Zustand. Bei wiederholten Abfragen können Sie das vollständige Ergebnis weglassen und mit dem Änderungstoken für begrenzte Zeit warten.

Die Antwort auf eine Nachricht bestätigt die Aufnahme in die Warteschlange. Die Antwort auf einen Abbruch zeigt die angenommene Anfrage und den gespeicherten Status. Prüfen Sie für das Resultat den Endstatus, rufen Sie das gespeicherte Ergebnis mit `genesis_get_result` ab und sehen Sie die gemeldeten Commits und Testnachweise durch. [Aufgaben beobachten und steuern][guide]

## Die Verbindung vor dem Delegieren prüfen

Bauen Sie die betreffende Revision aus dem Quellcode und konfigurieren Sie den Provider auf der ausführenden Genesis-Instanz. Erzeugen Sie nach Anleitung ein privates Token und registrieren Sie die tatsächliche Loopback-Adresse im Client. Öffnen Sie eine neue Client-Sitzung und rufen Sie `genesis_check` auf. So prüfen Sie die MCP-Verbindung und die Modellbereitschaft getrennt, bevor Sie eine Aufgabe einreichen. [Einrichtung und Verbindungsprüfung][guide]

[pr]: https://github.com/EMI-Group/genesis/pull/171
[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/agent-mcp.md
[related]: /de/releases/genesis-0-14-1
