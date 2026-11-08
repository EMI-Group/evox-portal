---
title: "EvoX: Bewertung verteilen, Suchfeedback zusammenführen"
pubDate: 2025-04-23
summary: "EvoXs experimenteller verteilter Workflow teilt Kandidatenbewertungen auf und sammelt Fitnesswerte, um Populationssuche über ein Gerät hinaus zu erweitern."
updatedDate: 2026-11-08
---

Wenn die Kandidatenbewertung den Großteil einer Suche kostet, kann ihre Verteilung größere Experimente ermöglichen. Der experimentelle EvoX-Leitfaden vom 23. April 2025 beschreibt den im März eingeführten Weg: die Population auf Prozesse aufteilen und Fitnesswerte vor dem Algorithmusupdate zusammenführen.

![Eine Populationsschale verzweigt zu drei Bewertungsschalen und einer geordneten Feedbackreihe](./distributed-evaluation-feedback.webp)

*Getrennte Bewertungen, gemeinsames Populationsfeedback.*

## Auswertung verteilen, Rückmeldung zusammenführen

StdWorkflow erhält Optionen für verteilte Ausführung. Die Population wird entlang der Kandidatendimension nach Prozessrang geteilt. Jeder Prozess bewertet seinen Anteil; Fitnesswerte werden anschließend gesammelt und verkettet, bevor sie zur Aktualisierung des Algorithmus zurückkehren. [StdWorkflow](https://github.com/EMI-Group/evox/commit/388f0be9eb0ce01610a7ce60eb8050578a996dfb)

Das ist verteilte Auswertung in einem koordinierten Workflow, nicht das Starten unabhängiger Suchen mit anschließendem Ergebnisvergleich. Teure Simulationen oder Zielfunktionen sind plausible Anwendungen, sofern sie zugeteilte Kandidatenbatches verarbeiten und die Umgebung korrekt eingerichtet ist.

## Reproduzierbarkeit gehört zur Einrichtung

Der Leitfaden betont Zufallsseeds vor Torch- oder NumPy-Operationen und beschreibt Prozessstarts mit torch.distributed oder torchrun. Die Implementierung isoliert den Zufallsgeneratorzustand während der Problemauswertung. Konsistente Initialisierung hilft, kompatible Suchzustände trotz unterschiedlicher bewerteter Kandidaten zu erhalten. [2025-04-23](https://github.com/EMI-Group/evox/commit/510452f70e30adeedebdaa4fc6e348a75d649643)

## Die ganze Generation messen

Vergleichen Sie Einzelprozess-Basis und verteilten Lauf mit gleicher Zielfunktion, gleichem Seed und Populationsbudget. Erfassen Sie die vollständige Generationszeit einschließlich Kommunikation und prüfen Sie die Zuordnung von Kandidaten und Fitnesswerten. Der [Schnelleinstieg](/de/news/evox-quickstart) erklärt den Workflow vor dem Hinzufügen weiterer Geräte.
