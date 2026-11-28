---
title: "Genesis v0.15.0: Projektarbeit von der Anmeldung bis zur Wiederaufnahme verbinden"
pubDate: 2026-11-28
summary: "Ein gemeinsamer Projekt-Workbench, ChatGPT-Anmeldung im Browser und das Pausieren ganzer Aufgabenbäume kommen mit klareren Reviews und sicherer Konfiguration zusammen."
---

Genesis v0.15.0 erschien am 27. November 2026 und bündelt die jüngsten Änderungen an Workbench, Kontoeinrichtung und Aufgabenwiederherstellung. Entscheidend ist Kontinuität: Ausführungshost und Projekt wählen, Modellkonto einrichten, Entwicklung verfolgen und unfertige Arbeit wiederaufnehmen, ohne Chatantwort und Aufgabenabschluss zu verwechseln. Auch Reviews, Hintergrundjobs und Kontextverwaltung ändern sich; das Upgrade geht über die Oberfläche hinaus. [Vollständige Release Notes][release]

![Ein mechanisches Steuerpult verbindet Projektbuch, Schlüssel und aufgehängte verzweigte Konstruktion](./cover.webp)

*Konzeptillustration: Identität, Projektkontext und wiederaufnehmbare Arbeit teilen einen Steuerpunkt.*

## Projekt und Ausführungshost im Blick behalten

Die Workbench vereint Projektübersicht, aufgabenbezogene Agenteninspektion, gemeinsamen Editor und integrierte Aufgabenoptionen. Zuletzt verwendete Projekte und Ordnernavigation erleichtern die Auswahl. VCT-Workspaces gruppieren Projekte und bieten eine Mitgliederauswahl. Wählen Sie vor Arbeitsbeginn ein konkretes Mitglied: Die Gruppe besitzt kein Ausführungsverzeichnis. Source Control zeigt Historie und Diffs. Vorschau- und angeheftete Tabs, Offenhalten per Mittelklick, Alt+Arrow-Wechsel und Überlaufmenü machen die Leiste zur einzigen Liste offener Ansichten.

Beim Wechsel zwischen Bibliothek und Anwendung müssen Entwurf, Modell und Repository noch zur beabsichtigten Aufgabe passen. Projektbezogene Entwürfe stellen nichttextuelle Felder nach asynchronem Laden wieder her. Verlaufssuche und Filter behalten ihren Geltungsbereich; Reviewposition und Aufgabenfilter überstehen Knotenwechsel. Verspätete Aktivierung schließt die Palette nicht mehr und lenkt explizite Auswahl nicht von der Übersicht ab. [Workbench-Kontext][workbench]

## Konto einrichten und Modell bestätigen

Sign in with ChatGPT im Browser wird von Dashboard, Einrichtungsassistenten, Startseite und CLI gemeinsam genutzt. Für entfernte Hosts gibt es das manuelle Einfügen der Weiterleitungs-URL; Verlassen oder Schließen bricht ab. Vorhandene Konten starten die Anmeldung auch aus Settings. Nach erfolgreicher Authentifizierung werden Konfigurationssnapshot und Modellauswahl aktualisiert. Assistenten bieten kanonische Reasoning-Stufen und Zeitplanvorlagen. off_peak_holidays nutzt einen statischen Kalender chinesischer Feiertage und Ausgleichsarbeitstage für 2025–2027, keinen weltweiten Feiertagsdienst.

Eigene Modellkonten verwenden OpenAI Chat Completions; ChatGPT-Abonnementanfragen senden Header für Nutzungszuordnung und Prompt-Cache-Identität. Keenable ist ein optionaler Schlüsselloser Suchanbieter. Prüfen Sie Routing und Zeitpläne erneut. Ein unvollständig gespeichertes Konto fällt mit Warnung auf die Standardmodellauswahl zurück, statt den Scheduler abstürzen zu lassen. Settings verweigert Speichern nach Änderung der lokalen Knotenidentität; laden Sie den Knotenkontext neu. API-Schlüssel werden in Ereignislogs verdeckt, Git-Operationen prüfen die Projektzugehörigkeit. [Kontenablauf][accounts]

## Unfertige Arbeit pausieren, ohne Kinder abzuschließen

Pause friert jetzt den gesamten Agentenbaum ein und setzt ihn unter denselben Identitäten fort; das frühere Leerlaufen entfällt. Bei aktivierter dauerhafter Speicherung bewahren Checkpoints Elternwartepositionen und Kinderarbeit. Saubere Pause und Wiederherstellung nach Unterbrechung bleiben unterscheidbar. Review zeigt Fehler, Abbruch und fehlenden Bericht ehrlich an, entfernt unpassende Aktionen und bietet die Vorbereitung einer Folgeaufgabe. needs-review macht solche Ergebnisse auffindbar. [Pausenmechanismus][pause]

Hintergrundjobs erhalten global eindeutige kurze base36-IDs, Logs im Aufgabenverzeichnis und kollisionsfreie Registry-Dateinamen. Aufbewahrung schützt Jobs aktiver Eigentümer und bewahrt Löschmarkierungen statt unerklärlich unbekannter IDs; Speicherwachstum der Registry ist behoben. Agenten committen automatisch, wenn der primäre Schritt scheitert, und aktivierte Co-Autorschaft erreicht Merge-Commits. Prüfen Sie trotz besserer Nachverfolgbarkeit weiterhin Aufgabenstatus und Repositoryänderungen vor der Abnahme.

## Upgrade und Prüfung der eigenen Abläufe

CONTEXT.md erhält Shared/Local-Bereiche: Vorfahren liefern nur Shared, der zugewiesene Knoten sieht die ganze Datei. Bereichsbezogene Lese-/Schreibwerkzeuge und zusammengefasste Kontextcommits halten lokale Notizen aus fremden Prompts heraus. Behoben sind auch Streaming-Remount-Zustand, doppelte Toolanzeige, Archiv- und gefaltete Historiensteuerung, Zeitzonenprüfung und verlorene entfernte Ladevorgänge. Phoenix, LiveView, Bandit, idna, jsv und verwandte Abhängigkeiten enthalten Sicherheitskorrekturen. Dichte und Touchziele werden vereinheitlicht, alte Eintrittseffekte und die doppelte Seitenleistenliste entfernt. Desktop bietet eine optionale rahmenlose Titelleiste mit plattformspezifischen Bedienelementen.

Wählen Sie das v0.15.0-Desktopartefakt für Ihr Betriebssystem. Headless unterstützt Linux x64/ARM64 und macOS ARM64. Bestehende Server nutzen `genesis update --check`, danach `genesis update`; das installiert das verfügbare Update und startet neu. Bewahren Sie das konfigurierte Datenverzeichnis und lesen Sie die versionierte Anleitung. Prüfen Sie anschließend laufende Version, Konto-/Modellaktualisierung, einen Projektentwurf und einen kleinen Pause-/Fortsetzungszyklus samt Review und Joblog. [Versionierte Installation][guide]

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.15.0
[guide]: https://github.com/EMI-Group/genesis/blob/v0.15.0/README.md
[workbench]: /de/news/genesis-project-workbench
[accounts]: /de/news/genesis-provider-account-setup
[pause]: /de/news/genesis-whole-tree-pause
