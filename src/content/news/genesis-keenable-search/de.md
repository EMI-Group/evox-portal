---
title: "Genesis ergänzt eine optionale Suche ohne API-Schlüssel"
pubDate: 2026-11-22
summary: "Der Keenable-Adapter aktiviert öffentliche Websuche ausdrücklich und bewahrt Schlüsselzugriff sowie bisherigen Standardanbieter."
---

Eine Agent-Recherche kann vor der ersten Anfrage stocken, wenn Websuche zusätzliche Zugangsdaten erfordert. Genesis PR #174, am 19. November 2026 in `main` übernommen, ergänzt **Keenable** als optionalen Anbieter mit einem öffentlichen Endpunkt ohne konfigurierten API-Schlüssel. Bestehende Installationen behalten ihr Standardverhalten. [Übernommener Adapter][pr]

![Ein offener Bibliothekseingang führt zu ausgewählten Quelldokumenten](./cover.webp)

*Konzeptillustration: ein optionaler öffentlicher Zugang zur Webrecherche.*

## Den öffentlichen Zugang ausdrücklich aktivieren

Setzen Sie unter `[tools.search]` die Werte `enabled = true` und `provider = "keenable"`. Ohne Schlüssel sendet der Adapter Suchanfrage und Ergebnislimit an den öffentlichen Endpunkt, setzt `X-Keenable-Title: Genesis` und lässt `X-API-Key` weg. `KEENABLE_API_KEY` im Zugangsdatenbestand wählt stattdessen Schlüsselzugriff. [Anfrageaufbau][adapter]

Die Implementierung ändert beide nötigen Schranken: Ein ausgewählter schlüsselloser Anbieter kann das Suchwerkzeug des Agents aktivieren, und die Ausführung lehnt ihn nicht mehr allein wegen des fehlenden Schlüssels ab. Anbieter mit Schlüsselpflicht behalten ihre Prüfungen.

## Ergebnisse mit ihren Grenzen lesen

Beim Sammeln von Dokumentationsquellen entfällt so ein Einrichtungsschritt. Der Adapter überführt Titel, URLs und `snippet` in das vorhandene Ergebnisformat. Er berücksichtigt `max_results`; für `search_depth` besitzt Keenable keine Entsprechung, daher wird diese Option ignoriert. [Antwortzuordnung][adapter]

Der öffentliche Zugang begrenzt Anfragen pro IP. Die PR dokumentiert Tests für Anfrageaufbau, Parsing und Werkzeugaktivierung samt simulierter Ausführung, aber keinen echten Keenable-API-Aufruf. Probieren Sie nach Aktivierung eine kleine Anfrage vom tatsächlichen Ausführungshost und prüfen Sie Quellenlinks sowie Dienstfehler, bevor Sie größere Recherchen darauf stützen. [Dokumentierte Prüfungen][pr]

[pr]: https://github.com/EMI-Group/genesis/pull/174
[adapter]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/evo_git/agent/tools/web_search_providers.ex
