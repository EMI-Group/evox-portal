---
title: "Genesis WASM Render: Von lokaler Codegenerierung zum Systemaufbau"
pubDate: 2026-10-15
updatedDate: 2026-11-08
summary: "Genesis untersucht mit einem Software-Renderer, wie Schnittstellen, Tests und akzeptierte Änderungen den Aufbau einer vollständigen Grafikpipeline koordinieren."
---

Beim Aufbau eines Softwaresystems müssen nützliche lokale Änderungen mit dem wachsenden Projekt vereinbar bleiben. Genesis untersucht diese Herausforderung anhand der WASM-Render-Grafikpipeline. Damit verbindet EvoXs Agentic-AI-Richtung lokale Entwicklung mit Systemaufbau: Shader-Verarbeitung, Rendering und API-Verhalten müssen ein zusammenhängendes Ganzes bilden.

![Drahtgittergeometrie wird zu einem schattierten Pixelbild](./software-graphics-pipeline.webp)

Der öffentliche Genesis-Bericht beschreibt einen mit DeepSeek V4 Flash entwickelten TypeScript-Software-Renderer. Er meldet 2.017/2.019 bestandene Khronos-CTS-Fälle, darunter 1.184/1.184 WebGL2-Fälle im geprüften Satz. Etwa 36 USD betreffen nur Modell-Tokens, ohne Hardware. Die 65,9 Stunden zwischen erstem und letztem Agenten-Commit sind eine Zeitspanne im Repository, keine gemessene aktive Agentenlaufzeit.

[Genesis Evidence](https://genesis.evox.group/evidence/tbench-wasm/)

## Von lokalem Code zu einem vollständigen System: Wo liegen die Schwierigkeiten?

WASM Render ist eine Challenge für Grafiksysteme innerhalb von Terminal-Bench Challenges: WebGL-Programme sollen ohne Browser, GPU oder externe Laufzeitbibliotheken ausgeführt werden.

Das entspricht der Implementierung einer Grafikpipeline in Software: Shaderprogramme interpretieren, Grafiken berechnen und dabei zahlreiche Schnittstellen und Zustandsänderungen konsistent halten. Eine funktionierende Einzelfunktion ist noch weit davon entfernt, dass ein gesamtes System im Zusammenspiel funktioniert. Die Aufgabe verlangt von der KI, über mehrere Entwicklungsrunden hinweg am Ziel ausgerichtet zu bleiben, Modulabhängigkeiten zu bearbeiten, Fehler anhand von Testergebnissen zu korrigieren und schließlich die Systemintegration sowie die Regressionsprüfung abzuschließen.

Der frühere 12-Stunden-Versuch und dieser Lauf haben unterschiedliche Entwicklungsbudgets; ihre Erfolgsquoten bilden daher keinen kontrollierten Vergleich. Das Evidence-Archiv nennt zudem 16/38 visuelle three.js-Fälle bei der strengen Schwelle von 0,1 % sowie 13/16 Babylon.js-Fälle, jeweils ausgewählte Teilmengen. Hohe API-Konformität bedeutet damit keine vollständige Grafikkompatibilität.

![Ergebnisse der WebGL2.0-Konformitätstests und Khronos-CTS-Testaufzeichnungen von Genesis](./wasm-render-results-en.png)

*Ergebnisse der WebGL2.0-Konformitätstests und Khronos-CTS-Testaufzeichnungen von Genesis.*

Das Archiv zählt 135.165 versionierte Textzeilen einschließlich generierter renderer.js, Fremdcode, Lockdatei und Dokumentation; dies ist nicht allein Renderer-Quellcode. Das Projekt beschreibt eine frühe autonome Einreichung, jedoch keine von den Veranstaltern veröffentlichte Rangfolge. Die Ergebnisse stammen vom Projekt und wurden nicht unabhängig reproduziert.

Der Entwicklungslauf bestand schließlich 2,017 Khronos-CTS-Tests, bei ungefähr 36 US-Dollar an Kosten für Modell-Tokens und einer Cache-Trefferquote von etwa 98 %. Ein derart umfangreiches Softwareentwicklungsprojekt bei geringen Modellkosten kontinuierlich voranzutreiben und zu integrieren, zeigt auch die Fähigkeit von Genesis, mit kostengünstigen Open-Source-Modellen über lange Zeiträume zu entwickeln.

## Das Projekt entwickelt sich weiter, Agenten kommen nach Bedarf hinzu

Genesis ist ein rekursives KI-System für Softwareevolution. Nutzer beschreiben ein Ziel für die Softwareentwicklung. Das System entfaltet darauf aufbauend Aufgaben, setzt lokale Agenten dort ein, wo Arbeit anfällt, und bewahrt akzeptierten Code sowie Validierungsergebnisse im Softwareprojekt auf.

Bei großen Projekten liegt es nahe, Agenten mehr Ressourcen zu geben: längere Kontexte, länger fortbestehende Sitzungen und aufwendigere vorab festgelegte Zusammenarbeit. Genesis verankert die Kontinuität der Entwicklung im Softwareprojekt selbst. Übergeordnete Ziele und Randbedingungen leiten die gesamte Entwicklung, während sich die Aufgaben entlang der Repository-Struktur rekursiv entfalten. Agenten bearbeiten lokale Aufgaben und beenden ihre Arbeit danach; nachfolgende Agenten setzen auf dem bereits entstandenen Projekt auf.

Zuvor hatte Genesis mit einem leeren Repository begonnen, einen C-Compiler mit ungefähr 250,000 Codezeilen erstellt und die Entwicklung über Modellwechsel hinweg fortgesetzt. Die WASM-Render-Testergebnisse bestätigen zusätzlich die Fähigkeiten von Genesis zur autonomen Erstellung und Integration bei der Entwicklung komplexer Grafiksysteme.

## Offene Systeme, die sich weiterentwickeln

Der Open-Source-Wert dieses Falls liegt im überprüfbaren Systemaufbau: Schnittstellen, Implementierungen und Prüfergebnisse bleiben für spätere Arbeit verfügbar. Er entwickelt EvoXs Ansatz einer Software weiter, die nützliche Änderungen über Agentenaufgaben hinweg sammelt und Fortschritt am Verhalten des integrierten Systems misst.

🔗 Genesis-Repository: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Genesis-Publikation: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repository mit den Ergebnissen der Challenge: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Upstream-Projekt (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 QQ-Gruppe: 297969717
