---
title: "Genesis: Agentenbeiträge in der Softwarehistorie erhalten"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 verbindet aufgabenbezogene Git-Historie mit Agentenspuren, damit Beiträge auch nach dem Ende einzelner Agenten prüfbar bleiben."
updatedDate: 2026-11-08
---

Ein Agentenbaum zeigt, wer gerade arbeitet. Die Projekthistorie muss auch erklären, was danach bleibt. Genesis 0.13.4 vom 26. September 2026 entwickelt die Commitansicht aus 0.13.2 und die dauerhaften Aufgabenreferenzen aus 0.13.3 weiter. Zeitweilige Aktivität wird mit prüfbaren Softwareversionen verbunden.

![Agentenaktivität bleibt im Projektverlauf erhalten](./durable-agent-history.webp)

## Von aktiven Agenten zu dauerhaften Referenzen

Die aufgabenbezogene Historien-API löst dauerhafte Referenzen und den Basiscommit auf. So bleiben Commits bereits recycelter Agenten in der zeitlichen Ansicht erhalten. Die frühere API fragt Commitbereiche und Referenzen repositoryübergreifend ab; die Aufgabenebene ergänzt den Kontext für einen bestimmten Entwicklungsauftrag. [v0.13.2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [v0.13.3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3)

Wenn ein Agent ein Modul delegiert und anschließend endet, kann sein Beitrag weiter ein Review benötigen. Git gibt der Änderung eine dauerhafte Identität; die Aufgabenansicht ordnet sie ein. Das Ende einer Ausführung muss den Bezug zwischen Aufgabe und Ergebniscode nicht löschen.

## Beziehungen zwischen Beiträgen zeigen

Version 0.13.4 ordnet Commits Agentenspuren zu, hält Teilbäume zusammen und zeigt Delegations- und Rückmerge-Kanten. Nicht zugeordnete Commits erhalten eine neutrale Spur. Auswahl, synchronisiertes Hervorheben und Tastaturzugriff erleichtern die Prüfung; einzelne Abruffehler leeren nicht mehr den ganzen Graphen. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

Die Ansicht kennzeichnet Kürzungen an der Grenze von 100 Commits. Verwenden Sie für ältere Änderungen Basis- und Spitzenreferenzen der Aufgabe, um den passenden Git-Bereich zu untersuchen.

## Einen Beitrag bis zur Integration verfolgen

Beginnen Sie beim Basis-Commit einer Aufgabe und folgen Sie einer Agentenspur durch Delegation und Rückführung. Prüfen Sie zugehörige Diffs und Testergebnisse, bevor Sie Beiträge übernehmen. Für mehrere Codebasen bietet das [Multi-Repository-Review](/de/news/genesis-multi-repository) den nächsten Integrationsschritt.
