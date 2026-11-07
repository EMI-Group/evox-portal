---
title: "Genesis-Werkzeuge und Skills: Projektmethoden in die Entwicklung einbinden"
pubDate: 2026-09-26
summary: "Eigene Werkzeuge in Genesis 0.13.1 und Worktree-bezogene Skill-Änderungen in 0.13.4 verbinden projektspezifische Operationen mit wiederverwendbaren Anleitungen."
---

Projekte enthalten nicht nur Quellcode, sondern auch Methoden zum Bauen, Prüfen und Ändern. Genesis 0.13.4 vom 26. September 2026 legt Änderungen durch Skill-Werkzeuge in den Worktree und macht sie in Git prüfbar. Zusammen mit eigenen Werkzeugen aus 0.13.1 vom 21. September entstehen zwei unterschiedliche Erweiterungswege.

## Operationen durch eigene Werkzeuge anbieten

Version 0.13.1 lädt benutzerdefinierte Werkzeuge aus dem tools-Verzeichnis der Konfiguration. Sie erscheinen in den Einstellungen, können in Werkzeug-Erlaubnislisten eigener Agenten aufgenommen werden und laufen durch den zentralen Dispatcher. Projekte erhalten explizite Operationen zusätzlich zur allgemeinen Shell.

Ein Team könnte beispielsweise seinen bestehenden Projektprüfer mit einem definierten Ein-/Ausgabevertrag versehen. Das ist eine mögliche Nutzung, keine mitgelieferte Integration. Implementierung, Berechtigungen und Ergebnisbedeutung muss das Projekt festlegen.

## Skill-Änderungen am Ort des Code-Reviews

Version 0.13.4 liest und schreibt Skills im Worktree des Agenten und unterstützt Commits mit optionalem Commit-Schalter. Agentengeschriebene Anleitungen können damit auf dessen Branch geprüft werden. Auch Erkennung und Entfernung von Skills werden korrigiert.

Werkzeuge bieten aufrufbare Operationen, Skills wiederverwendbare Anleitungen. Ihre Rollen ergänzen sich, sind aber verschieden. Eine Änderung in Git ist sichtbar und versioniert, ohne dadurch automatisch richtig oder nützlich zu sein.

## Erweiterung mit erhaltener Prüfung

Die Erweiterungspunkte halten die Prüfung erzeugter Methoden nahe am Review erzeugten Codes. In EvoXs Entwicklungsökosystem können Implementierung und Entwicklungsanleitung Gegenstand von Verbesserungen sein. Annahme und Validierung machen aus einem Vorschlag weiterhin erst eine verlässliche Grundlage für spätere Arbeit.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
