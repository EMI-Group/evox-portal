---
title: "Genesis: Lange Aufgaben fortsetzen, während der Kontext schrumpft"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 verbindet Kontextkomprimierung, fortlaufende Hintergrundjobs und budgetierte Checkpoints für längere Entwicklungsaufgaben."
updatedDate: 2026-11-08
---

Ein Test kann noch laufen, wenn der Gesprächskontext eines Agenten voll ist. Genesis 0.13.8–0.13.10, veröffentlicht vom 26. bis 29. Oktober 2026, trennt beide Lebenszyklen: den Arbeitskontext des Modells komprimieren und zugleich Ausgabe und Abschlussstatus abgekoppelter Shell-Jobs verfügbar halten.

![Eine rote Presse verdichtet ein fragmentiertes Band, während ein separater Faden durchgehend bleibt](./context-compression-continuity.webp)

*Arbeitskontext verdichten, Ausführung fortsetzen.*

## Komprimierung nach Modellbudget

Version 0.13.8 führt zwei Stufen ein: Werkzeugergebnisse ohne Modellaufruf reduzieren und anschließend eine Checkpoint-Zusammenfassung erstellen. Der Auslöser richtet sich nach dem Kontextfenster, mit Einstellungen je Agent und einer Aktualisierung des Laufzeitzustands. Eine Anzeige macht Belegung und Komprimierungsanzahl sichtbar. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

Version 0.13.10 behandelt den Fall, dass übergroße aktuelle Nachrichten die nötige Verkleinerung verhindern. Der jüngste Verlauf erhält ein Tokenbudget; Werkzeugaufruf und Ergebnis bleiben gepaart. Veraltete Laufzeitaktualisierungen werden entfernt, genau eine aktuelle bleibt erhalten. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## Ausführung überdauert einen Gesprächsabschnitt

Die mit 0.13.8 eingeführten unabhängigen Shell-Hintergrundjobs überstehen die Kontextkomprimierung und melden ihren Abschluss. Agenten können Ausgaben lesen, Jobs auflisten oder stoppen, statt die gesamte Operation in einem blockierenden Aufruf zu halten. Version 0.13.9 behebt zudem Jobs, die im systemd-Sandbox-Backend dauerhaft als laufend angezeigt wurden. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## Kontinuität braucht beobachtbaren Zustand

Nutzen Sie für lange Builds oder Tests einen abgekoppelten Job und verfolgen Sie Zustand und Ausgabe nach der Komprimierung. Die Kontextanzeige zeigt Nutzung und Kompressionszahl; der Endstatus meldet Abschluss oder Fehler. Beide Signale helfen bei der nächsten Entscheidung. Die [Genesis-Einführung](/de/news/evox-genesis) beschreibt den gesamten Entwicklungsablauf.
