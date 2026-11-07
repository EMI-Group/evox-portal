---
title: "Genesis Server: Eine dauerhafte Laufzeit für Softwareentwicklung"
pubDate: 2026-11-02
summary: "Vom Headless-Paket in 0.13.11 bis zum Weiterbetrieb nach Abmeldung in 0.14.0 schafft Genesis eine unabhängig betreibbare Umgebung für Dashboard und Agenten."
---

Genesis 0.14.0 vom 2. November 2026 erkennt beim Serverstart den systemd-Lingering-Status und bietet dessen Aktivierung an. Es folgt dem Headless-Paket aus 0.13.11 vom 30. Oktober. Damit lässt sich der Lebenszyklus der Entwicklungsumgebung getrennt von einer Desktopsitzung verwalten.

## Serverpaket mit Betriebssteuerung

Das Headless-Paket enthält Dashboard und Agentenlaufzeit für Linux x64/arm64 und macOS arm64. Die CLI umfasst Dienstbetrieb, Start, Stopp, Status, Logs, Zustands- und Versionsabfrage. Das Installationsskript prüft Prüfsummen, installiert oder aktualisiert das Paket und verknüpft die ausführbare Datei.

Diese Schnittstellen dienen dem Betrieb eines dauerhaften Prozesses. Ein Zustandsendpunkt liefert Status, Version und Laufzeit; Logs machen das Verhalten sichtbar. Ein gesunder Prozess beweist jedoch weder korrekte Agentenänderungen noch bestandene Projekttests. Laufzeitzustand und Softwarevalidierung bleiben getrennte Aufgaben.

## Den Lebenszyklus um die Ausführung verwalten

Auf Linux mit systemd kann Lingering nötig sein, damit Benutzerdienste nach der Abmeldung weiterlaufen. Version 0.14.0 prüft dies und erlaubt die Konfiguration über GENESIS_LINGER oder --no-linger. Das ist plattformspezifisch und verspricht kein identisches Verhalten aller Betriebssysteme.

Die Vorgängerversion verbessert auch den Remote-Start: POSIX-Shell-Wrapper, korrekte Behandlung von Pfaden mit Leerzeichen und verständliche Fehlergründe. Korrekturen am Servermodus und genaue Laufzeitangaben erleichtern die Diagnose.

## Bereitstellung gehört zur Entwicklung

Bei langen Aufgaben ist die Wahl einer geeigneten Ausführungsmaschine Teil des Ablaufs. Das Serverpaket stellt eine unabhängig betreibbare Komponente mit klaren Lebenszyklusoperationen bereit. Es erweitert Genesis über den Desktopzugang hinaus und stärkt den Betrieb von EvoXs Entwicklungsinfrastruktur, ohne Review, Validierung oder Annahmeentscheidungen zu ersetzen.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.11) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)
