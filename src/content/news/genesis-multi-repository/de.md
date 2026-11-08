---
title: "Genesis mit mehreren Repositories: Ein Ziel, getrennte Historien"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 ergänzt persistente Worktrees für beschreibbare Begleit-Repositories und macht Ausführung, Review und Integration explizit."
updatedDate: 2026-11-08
---

Eine Funktion kann API-Dienst, Client-Anwendung und gemeinsame Bibliothek betreffen. Das Ziel ist gemeinsam, die Git-Repositories sind es möglicherweise nicht. Genesis 0.13.4 vom 26. September 2026 ergänzt persistente Worktrees für beschreibbare Begleit-Repositories und schafft klarere Ausführungsgrenzen.

![Getrennte Repository-Verläufe in einem Projekt](./companion-worktrees.webp)

## Vom Zugriff zur isolierten Arbeit

Version 0.11.4 führte Lese- und Schreibzugriff auf zusätzliche Repositories ein, einschließlich getrennter Reviews und Schreibsperren für schreibgeschützte Repositories. Mit 0.13.4 arbeiten Agenten in einem persistenten Worktree je beschreibbarem Begleit-Repository, ohne dessen Haupt-HEAD zu verschieben oder den primären Arbeitsbaum zu stören. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

Pfade werden relativ zu diesem Worktree aufgelöst. Der anfängliche Agentenkontext zeigt seinen Ort; auch repositoryübergreifende Delegation verwendet ihn als Basis. So bleibt der Änderungsort bei unterschiedlichen Verzeichnisstrukturen und paralleler Entwicklung eindeutig. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Integration wird je Repository entschieden

Version 0.13.0 führte Review-Karten mit getrennten Merge- und Ablehnungsaktionen, Merge-Prüfungen und Bearbeitungsständen ein. Ein Sammel-Merge übernimmt offene Repositories, während Einzelergebnisse sichtbar bleiben. Zudem wurden Reviews für Aufgaben korrigiert, die ausschließlich Begleit-Repositories ändern. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

Prüfen Sie bei einer API-Änderung Dienst, Client und gemeinsame Bibliothek in ihren jeweiligen Historien. Vereinbaren Sie Schnittstellenversionen und Integrationsreihenfolge und testen Sie das kombinierte Ergebnis.

## Repositoryübergreifendes Review vorbereiten

Identifizieren Sie vor der Delegation den beschreibbaren Worktree jedes Repositorys. Prüfen Sie danach Änderungen, Merge-Prüfungen und Bearbeitungsstatus auf dessen Review-Karte. So wird repositoryübergreifende Arbeit zu konkreten Abnahmeentscheidungen. Die [Entwicklungshistorie](/de/news/genesis-development-history) zeigt die zugehörigen Commits.
