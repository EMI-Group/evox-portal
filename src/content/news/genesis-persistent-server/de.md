---
title: "Genesis Server: Eine dauerhafte Laufzeit für Softwareentwicklung"
pubDate: 2026-11-02
summary: "Vom Headless-Paket in 0.13.11 bis zum Weiterbetrieb nach Abmeldung in 0.14.0 schafft Genesis eine unabhängig betreibbare Umgebung für Dashboard und Agenten."
updatedDate: 2026-11-08
---

Genesis 0.14.0 vom 2. November 2026 erkennt beim Serverstart den systemd-Lingering-Status und bietet dessen Aktivierung an. Es folgt dem Headless-Paket aus 0.13.11 vom 30. Oktober. Damit lässt sich der Lebenszyklus der Entwicklungsumgebung getrennt von einer Desktopsitzung verwalten.

![Ein Server arbeitet bei geschlossenem Terminal weiter](./persistent-server-session.webp)

## Serverpaket mit Betriebssteuerung

Das Headless-Paket enthält Dashboard und Agentenlaufzeit für Linux x64/arm64 und macOS arm64. Die CLI umfasst Dienstbetrieb, Start, Stopp, Status, Logs, Zustands- und Versionsabfrage. Das Installationsskript prüft Prüfsummen, installiert oder aktualisiert das Paket und verknüpft die ausführbare Datei. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Den Lebenszyklus um die Ausführung verwalten

Auf Linux mit systemd kann Lingering nötig sein, damit Benutzerdienste nach der Abmeldung weiterlaufen. Version 0.14.0 prüft dies und erlaubt die Konfiguration über `GENESIS_LINGER` oder `--no-linger`. [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

Die Vorgängerversion verbessert auch den Remote-Start: POSIX-Shell-Wrapper, korrekte Behandlung von Pfaden mit Leerzeichen und verständliche Fehlergründe. Korrekturen am Servermodus und genaue Laufzeitangaben erleichtern die Diagnose. [v0.13.11](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11)

## Bevor der Server weiterläuft

Prüfen Sie vor dem Umzug einer langen Aufgabe den Status, die Logs und die Antwort von `/health`. Bestätigen Sie auf einem systemd-Host die Lingering-Einstellung und prüfen Sie die Erreichbarkeit nach der Abmeldung erneut. So entsteht eine Ausführungsbasis; die [Entwicklungshistorie](/de/news/genesis-development-history) hilft anschließend, den erzeugten Code zu verfolgen.
