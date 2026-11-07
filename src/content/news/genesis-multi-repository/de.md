---
title: "Genesis mit mehreren Repositories: Ein Ziel, getrennte Historien"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 ergänzt persistente Worktrees für beschreibbare Begleit-Repositories und macht Ausführung, Review und Integration explizit."
---

Eine Funktion kann API-Dienst, Client-Anwendung und gemeinsame Bibliothek betreffen. Das Ziel ist gemeinsam, die Git-Repositories sind es möglicherweise nicht. Genesis 0.13.4 vom 26. September 2026 ergänzt persistente Worktrees für beschreibbare Begleit-Repositories und schafft klarere Ausführungsgrenzen.

## Vom Zugriff zur isolierten Arbeit

Version 0.11.4 führte Lese- und Schreibzugriff auf zusätzliche Repositories ein, einschließlich getrennter Reviews und Schreibsperren für schreibgeschützte Repositories. Mit 0.13.4 arbeiten Agenten in einem persistenten Worktree je beschreibbarem Begleit-Repository, ohne dessen Haupt-HEAD zu verschieben oder den primären Arbeitsbaum zu stören.

Pfade werden relativ zu diesem Worktree aufgelöst. Der anfängliche Agentenkontext zeigt seinen Ort; auch repositoryübergreifende Delegation verwendet ihn als Basis. So bleibt der Änderungsort bei unterschiedlichen Verzeichnisstrukturen und paralleler Entwicklung eindeutig.

## Integration wird je Repository entschieden

Version 0.13.0 führte Review-Karten mit getrennten Merge- und Ablehnungsaktionen, Merge-Prüfungen und Bearbeitungsständen ein. Ein Sammel-Merge übernimmt offene Repositories, während Einzelergebnisse sichtbar bleiben. Zudem wurden Reviews für Aufgaben korrigiert, die ausschließlich Begleit-Repositories ändern.

Bei einer API-Änderung lassen sich Dienst, Client und Bibliothek in ihren eigenen Historien prüfen. Kompatible Schnittstellen und geeignete Tests bleiben erforderlich: Ein Sammel-Merge belegt weder eine atomare Transaktion noch automatische Projektkompatibilität.

## Grundlage für größere Softwaresysteme

Der Meilenstein betrifft die Organisation ebenso wie die Erzeugung von Arbeit. Genesis koordiniert Beiträge über Repositorygrenzen, ohne die Orte für Prüfung und Annahme zu verlieren. EvoXs Ansatz zur Softwareevolution erweitert sich damit auf Systeme aus unabhängig gepflegten Teilen; angenommene Versionen bilden den Ausgangspunkt weiterer Entwicklung.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.11.4) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
