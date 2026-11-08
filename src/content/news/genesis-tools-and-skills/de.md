---
title: "Genesis-Werkzeuge und Skills: Projektmethoden in die Entwicklung einbinden"
pubDate: 2026-09-26
summary: "Eigene Werkzeuge in Genesis 0.13.1 und Worktree-bezogene Skill-Änderungen in 0.13.4 verbinden projektspezifische Operationen mit wiederverwendbaren Anleitungen."
updatedDate: 2026-11-08
---

Projekte enthalten nicht nur Quellcode, sondern auch Methoden zum Bauen, Prüfen und Ändern. Genesis 0.13.4 vom 26. September 2026 legt Änderungen durch Skill-Werkzeuge in den Worktree und macht sie in Git prüfbar. Zusammen mit eigenen Werkzeugen aus 0.13.1 vom 21. September entstehen zwei unterschiedliche Erweiterungswege.

![Projektwerkzeuge und wiederverwendbare Anweisungskarten](./project-tools-guidance.webp)

## Operationen durch eigene Werkzeuge anbieten

Version 0.13.1 lädt benutzerdefinierte Werkzeuge aus dem tools-Verzeichnis der Konfiguration. Sie erscheinen in den Einstellungen, können in Werkzeug-Erlaubnislisten eigener Agenten aufgenommen werden und laufen durch den zentralen Dispatcher. Projekte erhalten explizite Operationen zusätzlich zur allgemeinen Shell. [v0.13.1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1)

Ein Team könnte beispielsweise seinen bestehenden Projektprüfer mit einem definierten Ein-/Ausgabevertrag versehen.

Version 0.13.4 erlaubt außerdem Text zusammen mit Bildern oder Audio in Tool-Ergebnissen. Eine Projektoperation kann so neben dem Textbericht ein vom Agenten prüfbares Artefakt zurückgeben. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Skill-Änderungen am Ort des Code-Reviews

Version 0.13.4 liest und schreibt Skills im Worktree des Agenten und unterstützt Commits mit optionalem Commit-Schalter. Agentengeschriebene Anleitungen können damit auf dessen Branch geprüft werden. Auch Erkennung und Entfernung von Skills werden korrigiert. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

Tools definieren aufrufbare Operationen; Skills erklären Einsatzzeitpunkt und Ergebnisnutzung. Ein Projektprüfer und seine Interpretationsanleitung verbinden ausführbare Operationen mit prüfbaren Anweisungen.

## Mit einer Projektoperation beginnen

Wählen Sie eine wiederholbare Projektprüfung. Definieren Sie Eingaben, Ausgaben und Berechtigungen als Custom Tool und beschreiben Sie den Einsatz im Skill. Prüfen Sie vor Wiederverwendung dessen Diff auf dem Agentenbranch und führen Sie das Tool aus. Die [Entwicklungshistorie](/de/news/genesis-development-history) hilft bei späteren Revisionen.
