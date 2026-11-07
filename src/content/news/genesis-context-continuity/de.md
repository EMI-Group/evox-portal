---
title: "Genesis: Entwicklung über Kontextfenster hinweg fortsetzen"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 verbindet Kontextkomprimierung, fortlaufende Hintergrundjobs und budgetierte Checkpoints für längere Entwicklungsaufgaben."
---

Ein langer Build, umfangreiche Werkzeugausgaben und eine wachsende Unterhaltung belasten eine KI-Entwicklungsaufgabe auf unterschiedliche Weise. Genesis 0.13.10 vom 29. Oktober 2026 führt die Änderungen aus 0.13.8 fort und trennt laufende Ausführung vom begrenzten Gesprächskontext des Modells. Kontinuität in EvoXs Entwicklungsinfrastruktur erfordert den Umgang mit beidem.

## Komprimierung nach Modellbudget

Version 0.13.8 führt zwei Stufen ein: Werkzeugergebnisse ohne Modellaufruf reduzieren und anschließend eine Checkpoint-Zusammenfassung erstellen. Der Auslöser richtet sich nach dem Kontextfenster, mit Einstellungen je Agent und einer Aktualisierung des Laufzeitzustands. Eine Anzeige macht Belegung und Komprimierungsanzahl sichtbar.

Version 0.13.10 behandelt den Fall, dass übergroße aktuelle Nachrichten die nötige Verkleinerung verhindern. Der jüngste Verlauf erhält ein Tokenbudget; Werkzeugaufruf und Ergebnis bleiben gepaart. Veraltete Laufzeitaktualisierungen werden entfernt, genau eine aktuelle bleibt erhalten. Das sichert einen nutzbaren Arbeitskontext, behauptet aber kein verlustfreies Gedächtnis.

## Ausführung überdauert einen Gesprächsabschnitt

Die mit 0.13.8 eingeführten unabhängigen Shell-Hintergrundjobs überstehen die Kontextkomprimierung und melden ihren Abschluss. Agenten können Ausgaben lesen, Jobs auflisten oder stoppen, statt die gesamte Operation in einem blockierenden Aufruf zu halten. Version 0.13.9 behebt zudem Jobs, die im systemd-Sandbox-Backend dauerhaft als laufend angezeigt wurden.

## Kontinuität braucht beobachtbaren Zustand

Ein langer Testlauf benötigt für Ausführung, Status und Ausgabe einen von der Gesprächszusammenfassung unabhängigen Lebenszyklus. Die Änderungen verdeutlichen diese Trennung. Sie garantieren weder jeden Aufgabenabschluss noch den Erhalt aller Details in Zusammenfassungen. Ihr Wert liegt in einer besser prüfbaren Grundlage für fortlaufende Arbeit bei endlichem Kontext.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)
