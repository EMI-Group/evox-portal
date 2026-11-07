---
title: "Genesis: Agentenbeiträge in der Softwarehistorie erhalten"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 verbindet aufgabenbezogene Git-Historie mit Agentenspuren, damit Beiträge auch nach dem Ende einzelner Agenten prüfbar bleiben."
---

Ein Agentenbaum zeigt, wer gerade arbeitet. Die Projekthistorie muss auch erklären, was danach bleibt. Genesis 0.13.4 vom 26. September 2026 entwickelt die Commitansicht aus 0.13.2 und die dauerhaften Aufgabenreferenzen aus 0.13.3 weiter. Zeitweilige Aktivität wird mit prüfbaren Softwareversionen verbunden.

## Von aktiven Agenten zu dauerhaften Referenzen

Die aufgabenbezogene Historien-API löst dauerhafte Referenzen und den Basiscommit auf. So bleiben Commits bereits recycelter Agenten in der zeitlichen Ansicht erhalten. Die frühere API fragt Commitbereiche und Referenzen repositoryübergreifend ab; die Aufgabenebene ergänzt den Kontext für einen bestimmten Entwicklungsauftrag.

Wenn ein Agent ein Modul delegiert und anschließend endet, kann sein Beitrag weiter ein Review benötigen. Git gibt der Änderung eine dauerhafte Identität; die Aufgabenansicht ordnet sie ein. Das Ende einer Ausführung muss den Bezug zwischen Aufgabe und Ergebniscode nicht löschen.

## Beziehungen zwischen Beiträgen zeigen

Version 0.13.4 ordnet Commits Agentenspuren zu, hält Teilbäume zusammen und zeigt Delegations- und Rückmerge-Kanten. Nicht zugeordnete Commits erhalten eine neutrale Spur. Auswahl, synchronisiertes Hervorheben und Tastaturzugriff erleichtern die Prüfung; einzelne Abruffehler leeren nicht mehr den ganzen Graphen.

Bei der Grenze von 100 Commits zeigt die Ansicht eine Kürzung an. Sie ist eine navigierbare Entwicklungsansicht, kein unbegrenztes Archiv und keine vollständige Erklärung jeder Entscheidung.

## Nachvollziehbarkeit unterstützt Auswahl

Ein Graph zeigt Herkunft und Branchintegration einer Änderung, beweist aber keine Korrektheit. Diffs, Tests und Reviews bleiben nötig. Für EvoXs Softwareevolution wird die Beziehung zwischen vorgeschlagenen Beiträgen und beibehaltenen Versionen sichtbarer und damit die Entscheidung, was weitergeführt wird, besser unterstützt.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
