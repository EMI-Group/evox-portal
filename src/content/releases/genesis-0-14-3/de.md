---
title: "Genesis 0.14.3: Eine Aufgabe pausieren, den ganzen Agentenbaum fortsetzen"
pubDate: 2026-11-19
summary: "Dauerhafte Checkpoints pro Agent verbinden Aufgabenwiederherstellung, sichtbare Ausführungsphasen und begrenzte Werkzeugparallelität."
---

Lange Entwicklungsarbeiten brauchen mehr als einen Neustartknopf: Es muss erhalten bleiben, welche Agenten arbeiten, was sie gelernt haben und welcher Dateistand tatsächlich wiederherstellbar ist. [Genesis 0.14.3][release], veröffentlicht am 19. November 2026, verbindet Aufgabenpause und Fortsetzung mit dauerhaftem Agentenzustand, klarerer Live-Aktivität und Verbesserungen an Konfiguration, Freigaben und Bereitstellung.

![Ein verzweigter mechanischer Baum verbindet sich wieder mit einzeln verankerten Sockeln](./whole-tree-resume.webp)

*Konzeptillustration: Eine Aufgabe wiederherzustellen heißt, ihre Zweige mit ihrem jeweiligen gespeicherten Zustand zu verbinden.*

## Eine Aufgabe pausieren, ohne sie abzubrechen
Eine laufende Aufgabe wechselt über `pausing` zu `paused`. Ihre Agenten beenden laufende Werkzeugstapel, sichern Gespräche und committen Arbeitsbäume, bevor sie stoppen. Pausierte Aufgaben bleiben sichtbar und fortsetzbar; sie gelten weder als abgeschlossen noch als abgebrochen. Beim Fortsetzen bleibt die Aufgaben-ID gleich.

Das hilft, wenn eine Implementierung mit mehreren Agenten zwischen Arbeitssitzungen ruhen muss. Lassen Sie die Zustandspersistenz aktiviert, fordern Sie eine Pause an und warten Sie auf den pausierten Zustand. Die standardmäßig aktive Option lässt sich auch über `persistent_state` bei `genesis_start_task` steuern. Interaktive Sitzungen sind nicht pausierbar; ohne Persistenz ist eine Aufgabe nicht fortsetzbar. Die [versionierte Implementierung][pause] verlangt außerdem einen dauerhaften Datensatz des Wurzelagenten. Datensätze von Kindern allein reichen nicht.
## Den Baum mit klarer Dateigrenze wiederherstellen
Ein separater SQLite-Speicher hält Gespräche, Laufidentitäten und Fortschritt in Werkzeug- und Unteragentenstapeln fest. Beim Fortsetzen des ganzen Baums liefern abgeschlossene Kinder gespeicherte Ergebnisse; noch laufende Kinder setzen mit eigenen Checkpoints und Arbeitsbaum-Basen fort. Stabile Agenten-IDs erhalten diese Zuordnung. Ist eine Identität belegt, erfolgt ein Rückfall mit Warnung.

Git-Referenzen unter `refs/genesis/agent-state` halten Checkpoint-Commits auch nach dem Aufräumen von Arbeitsbranches erreichbar. Eine saubere Pause kann den Arbeitsbaum aus ihrem gespeicherten Pause-Commit neu erstellen. Nach einer Unterbrechung benennt der [Fortsetzungshinweis][notice] den garantierten Checkpoint: Nicht committete Änderungen des beendeten Laufs bleiben nicht garantiert erhalten. Fehlt ein Checkpoint, erklärt der Hinweis den Rückfall auf die Aufgabenbasis.

Hatte die Aufgabe Dateien bearbeitet und Jobs gestartet, prüfen Sie vor einer Wiederholung den genannten Commit, `git status` und `job_list`. Unterbrochene Werkzeugaufrufe erhalten Reparaturinformationen statt erfundener Erfolgsmeldungen. Die Version korrigiert außerdem doppelte Unteragentenstarts, fälschlich als unterbrochen pausiert wiederhergestellte interaktive Sitzungen und die Wiederaufnahme am Rundenlimit.
## Arbeit erkennen, die zuvor untätig wirkte
Inspektor und Assistant nutzen Live-Aktivität und atomare Beobachtungssnapshots. Kontextkomprimierung und Vorbereitung der nächsten Runde besitzen eigene Beschäftigt-Phasen statt einer Leerlaufanzeige. Context Memory zeigt laufende Aufrufe als Schlusszeilen; historische Überlegungen bleiben statisch. So lassen sich stille Intervalle besser einordnen und Komprimierung von einer festhängenden Anfrage unterscheiden.

Werkzeugfreigaben im Besitz des Schedulers begrenzen parallele Aufrufe und behalten ihre Zuständigkeit bei Hintergrundübergaben. Aufgegebene Starts werden abgelehnt; die Eindämmungsbereinigung nach Zeitüberschreitung endet vor dem Stoppen der Werkzeugaufgaben. Abschlussmeldungen und Betriebssystem-Statusabfragen verlassen den blockierenden Registry-Pfad. Auch Sitzungsabschlüsse vermeiden synchrone Persistenzbarrieren. Der Checkpoint-Schreiber bündelt wartende Arbeit und begrenzt Rückstau und Nutzlast, damit Speicherdruck nicht alle Agenten anhält.
## Konfiguration und Freigaben werden eindeutiger
Schemagesteuerte Einstellungs-APIs unterstützen Teiländerungen; Assistant kann Konfiguration entdecken und Projekte schreibgeschützt nachschlagen. Freigabedialoge und Benachrichtigungen zeigen anfragende Identität, Berechtigung und Ausführungsstatus. Geltungsbereich der Meldungen, Fokusführung, Berechtigungsabfrage und bewegungsreduzierte Darstellung werden verbessert.

Projektbezogene Assistant-Sitzungen bringen isolierte Gespräche, Uploads und Aufgabenverfolgung in diese Version. Der [Artikel zum Projektworkflow][workflow] erklärt die Bedienung. Explizite lokale Skill-Inventarbefehle umgehen Werkzeugberechtigungsprüfungen. Ein automatischer Commit-Rückfall übernimmt, wenn der Commit-Schritt des Agenten fehlt oder scheitert.
## Aktualisieren und die Wiederherstellung prüfen
Für bestehende Headless-Server-Installationen beschreibt die [versionierte Anleitung][update]:
```bash
genesis update --check
genesis update
```
Die Prüfung endet mit Code 10, wenn eine Aktualisierung verfügbar ist. Lassen Sie aktive Arbeit vor dem Upgrade abschließen. Der Updater prüft die Serveraktivität, bereitet die Version vor, startet neu und prüft den Zustand. In der neuen Version blockieren pausierende Aufgaben das Upgrade weiterhin; pausierte Aufgaben bleiben fortsetzbar, ohne es zu blockieren. Pakete für Linux x64, Linux ARM64 und macOS ARM64 sind beim Release verlinkt.

Datenbank-Upgrades verwenden nun normale Migrationen statt eines separaten historischen Abgleichs. Konflikte alter Identitäten werden additiv abgeglichen; verbliebene oder unvollständige Migrationszustände werden abgelehnt. Der SQLite-Reparaturpfad ist nur für Entwicklung gedacht. Ungenutzte Fortsetzungshelfer und ein Abschlussalias entfallen aus der öffentlichen API; eigene Integrationen sollten dies prüfen.

Zu den Abhängigkeiten gehören Plug 1.20.4 mit Sicherheitskorrektur der Multipart-Längenbegrenzung und ReqLLM 1.31.0. Nix-Abhängigkeitshashes und Vorprüfungen sind aktualisiert. Prüfen Sie danach gemeldete Version und Serverzustand, dann eine kleine persistente Aufgabe: pausieren, Checkpoint bestätigen, dieselbe Aufgabe fortsetzen und Kindergebnisse sowie Aktivitätsanzeigen prüfen. Nutzen Sie die [vollständigen Versionshinweise][release] zusammen mit den Migrationsdiagnosen Ihrer Bereitstellung.

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.3
[pause]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/task_registry/pause.ex
[notice]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/agent/resume/notice.ex
[update]: https://github.com/EMI-Group/genesis/blob/v0.14.3/docs/server-update.md
[workflow]: /de/news/genesis-assistant-project-workflows

