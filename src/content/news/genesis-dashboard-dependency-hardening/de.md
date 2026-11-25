---
title: "Genesis härtet die Abhängigkeiten seines Dashboards"
pubDate: 2026-11-25
summary: "main aktualisiert Phoenix, LiveView, Bandit und jsv; Installationen aus dem Quellcode benötigen einen neuen Build."
---

Am 23. November 2026 aktualisierte Genesis vier Abhängigkeiten auf `main`. Die Wartung betrifft die gemeinsame Webinfrastruktur für den Zugang zur Arbeitsoberfläche. Für Teams, die Genesis aus dem Quellcode bauen, zählt der Abhängigkeitssatz, mit dem der laufende Dienst erstellt wurde. [Abhängigkeitsänderung][lock]

![Ein Ersatzteil verstärkt einen gemeinsam genutzten Türverschluss](./cover.webp)

*Konzeptillustration: Wartung der Komponenten eines gemeinsamen Eingangs.*

## Änderungen unter der Oberfläche

Die Genesis-Deklaration verknüpft das Phoenix-Update mit Absturzkorrekturen im Presence-Tracker und der Broadcast-Verteilung. Das LiveView-Minimum verweist auf eine Korrektur für übersprungene Sitzungsinitialisierung bei Verbindungsanfragen ohne URL. Hinzu kommen HTTP/2-Prüfungen und Härtungen in Bandit. Dies sind die von Genesis dokumentierten Gründe; der Commit belegt nicht die Betroffenheit einer bestimmten Installation. [Anforderungen][pins]

Die Lockdatei hebt Phoenix von 1.8.16 auf 1.8.17, LiveView von 1.2.13 auf 1.2.15, Bandit von 1.14.1 auf 1.15.0 und jsv von 0.28.0 auf 0.28.1 an. Das deklarierte LiveView-Minimum ist 1.2.14, der festgeschriebene Build nutzt 1.2.15. Eine begleitende Nix-Änderung berechnet den Abhängigkeitshash neu. [Versionen][lock] · [Nix-Änderung][nix]

## Den tatsächlich bereitgestellten Build prüfen

Ein selbst hostendes Team kann beispielsweise den Quellcode aktualisieren, während noch ein altes Dashboard-Binary läuft. Verwenden Sie eine Revision mit diesen Commits und bauen und verteilen Sie die Anwendung gemäß der üblichen Installationsanleitung neu. Prüfen Sie die verwendete `mix.lock`, behalten Sie gegebenenfalls den passenden Nix-Hash bei und kontrollieren Sie danach Dashboard-Zugriff und Live-Wiederverbindung. Ein aktualisiertes Quellverzeichnis ersetzt den laufenden Dienst nicht. [Installationsanleitung][install]

[lock]: https://github.com/EMI-Group/genesis/commit/99f450252b8c0f8a07ad64bb3f7491b35f9b23d0
[pins]: https://github.com/EMI-Group/genesis/commit/bfcc0115ad1cb714ec54d60265816550c1619bd3
[nix]: https://github.com/EMI-Group/genesis/commit/6a80bba389dec5d120c64a435cab88be4de275bc
[install]: https://github.com/EMI-Group/genesis/blob/43705acdfc9a4ebc885e0d457d75242286924637/README.md
