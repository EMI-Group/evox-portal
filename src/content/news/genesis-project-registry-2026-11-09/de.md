---
title: "Genesis-Entwicklung: ein dauerhaftes Projektregister"
pubDate: 2026-11-10
summary: "Die main-Änderungen vom 9. November ersetzen zuletzt geöffnete Projekte durch ein Datenbankregister und trennen lokale und entfernte Auswahl."
---

Ein Repository auf einer anderen Maschine braucht eine klare Identität gegenüber lokalen Projekten. Die am 9. November 2026 in Genesis main integrierten Änderungen verbinden Projects und Palette mit einem datenbankgestützten VCT-Register statt der bisherigen Verlaufsliste. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Projektordner in getrennten Host-Schränken mit passenden Registermarken](./project-host-registry.webp)

## Ein registrierter Platz für das Projekt

Öffnen und Erstellen registrieren den Mount über eine knotenspezifische Schnittstelle. Die Palette durchsucht registrierte Pfade; das aktive Projekt kann seinen Mount-Punkt zeigen. Remote-Listen stammen vom gewählten Host, ohne lokale Einträge während des Verbindungsaufbaus. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Vor dem Fortfahren den Host prüfen

Öffnen Sie in Entwicklungsbuilds mit diesen Änderungen ein lokales und entferntes Repository erneut und prüfen Sie Identität und Pfadvorschläge. Das Register dient der Navigation; Codeänderungen durchlaufen die normale Projektvalidierung.

[Genesis mit mehreren Repositories: Ein Ziel, getrennte Historien](/de/news/genesis-multi-repository)
