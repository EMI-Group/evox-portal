---
title: "EvoX Genesis bewältigt WASM Render in etwa zwei Tagen für 36 US-Dollar"
pubDate: 2026-10-14
summary: "Mit DeepSeek V4 Flash bewältigte EvoX Genesis WASM Render in etwa zwei Tagen für nur 36 US-Dollar an Modellkosten und reichte als weltweit erstes KI-System ein Ergebnis für diese Challenge ein. Die Testaufzeichnungen des Teams weisen 2,017/2,019 bestandene Khronos-CTS-Tests (99.90 %) aus, darunter sämtliche 1,184/1,184 ausgeführten WebGL2.0-Konformitätstests."
---

Die Fähigkeit, Aufgaben über lange Zeiträume hinweg voranzutreiben und schließlich ein vollständiges Entwicklungsprojekt abzuliefern, wird zu einem wichtigen Maßstab für die Leistungsfähigkeit von KI. Terminal-Bench ist einer der repräsentativen Benchmarks für KI-Agenten und konzentriert sich auf Programmier- und Kommandozeilenaufgaben in Terminalumgebungen. Terminal-Bench Challenges geht bei der Bewertung einen Schritt weiter: Hier werden vollständige Softwareprojekte von Grund auf entwickelt, wobei die offizielle Kostenschätzung bei mehr als 1,000 US-Dollar pro Challenge liegt.

EvoX Genesis, das vom EvoX-Team entwickelte rekursive KI-System für Softwareevolution, bewältigte die WASM-Render-Challenge mit DeepSeek V4 Flash in etwa **zwei Tagen** für nur **36 US-Dollar** an Modellkosten und wurde damit **zum weltweit ersten KI-System, das ein Ergebnis für diese Challenge einreichte.** Die Testaufzeichnungen des Teams zeigen, dass es 2,017/2,019 Tests der Khronos-CTS-Suite (99.90 %) bestand, darunter sämtliche 1,184/1,184 WebGL2.0-Konformitätstests.

## Von lokalem Code zu einem vollständigen System: Wo liegen die Schwierigkeiten?

WASM Render ist eine Challenge für Grafiksysteme innerhalb von Terminal-Bench Challenges: WebGL-Programme sollen ohne Browser, GPU oder externe Laufzeitbibliotheken ausgeführt werden.

Das entspricht der Implementierung einer Grafikpipeline in Software: Shaderprogramme interpretieren, Grafiken berechnen und dabei zahlreiche Schnittstellen und Zustandsänderungen konsistent halten. Eine funktionierende Einzelfunktion ist noch weit davon entfernt, dass ein gesamtes System im Zusammenspiel funktioniert. Die Aufgabe verlangt von der KI, über mehrere Entwicklungsrunden hinweg am Ziel ausgerichtet zu bleiben, Modulabhängigkeiten zu bearbeiten, Fehler anhand von Testergebnissen zu korrigieren und schließlich die Systemintegration sowie die Regressionsprüfung abzuschließen.

Nach den vom Terminal-Bench-Team veröffentlichten Ergebnissen eines frühen 12-stündigen Probelaufs erreichte Cognitions KI-Produkt zur Softwareentwicklung Devin in Kombination mit Fable 5 bei den anspruchsvolleren WebGL2.0-Konformitätstests eine Erfolgsquote von 20.5 %. Nach etwa zwei Tagen Entwicklung steigerte Genesis die Erfolgsquote der von ihm ausgeführten WebGL2.0-Konformitätstests auf 100 %.

![Ergebnisse der WebGL2.0-Konformitätstests und Khronos-CTS-Testaufzeichnungen von Genesis](./wasm-render-results-en.png)

*Ergebnisse der WebGL2.0-Konformitätstests und Khronos-CTS-Testaufzeichnungen von Genesis.*

Das öffentliche Ergebnis-Repository von Genesis enthält ungefähr **130,000 Codezeilen**. Es umfasst einen Compiler für die Shadersprache GLSL, WebGL-Schnittstellen und Zustandsverwaltung, Softwarerasterisierung sowie Bilddarstellung. Diese TypeScript-Implementierungen werden zu einem JavaScript-Renderer gebaut, der Sprachverarbeitung, Grafikberechnung und Schnittstellenverhalten miteinander verbindet.

Der Entwicklungslauf bestand schließlich 2,017 Khronos-CTS-Tests, bei ungefähr 36 US-Dollar an Kosten für Modell-Tokens und einer Cache-Trefferquote von etwa 98 %. Ein derart umfangreiches Softwareentwicklungsprojekt bei geringen Modellkosten kontinuierlich voranzutreiben und zu integrieren, zeigt auch die Fähigkeit von Genesis, mit kostengünstigen Open-Source-Modellen über lange Zeiträume zu entwickeln.

## Das Projekt entwickelt sich weiter, Agenten kommen nach Bedarf hinzu

Genesis ist ein rekursives KI-System für Softwareevolution. Nutzer beschreiben ein Ziel für die Softwareentwicklung. Das System entfaltet darauf aufbauend Aufgaben, setzt lokale Agenten dort ein, wo Arbeit anfällt, und bewahrt akzeptierten Code sowie Validierungsergebnisse im Softwareprojekt auf.

Bei großen Projekten liegt es nahe, Agenten mehr Ressourcen zu geben: längere Kontexte, länger fortbestehende Sitzungen und aufwendigere vorab festgelegte Zusammenarbeit. Genesis verankert die Kontinuität der Entwicklung im Softwareprojekt selbst. Übergeordnete Ziele und Randbedingungen leiten die gesamte Entwicklung, während sich die Aufgaben entlang der Repository-Struktur rekursiv entfalten. Agenten bearbeiten lokale Aufgaben und beenden ihre Arbeit danach; nachfolgende Agenten setzen auf dem bereits entstandenen Projekt auf.

Zuvor hatte Genesis mit einem leeren Repository begonnen, einen C-Compiler mit ungefähr 250,000 Codezeilen erstellt und die Entwicklung über Modellwechsel hinweg fortgesetzt. Die WASM-Render-Testergebnisse bestätigen zusätzlich die Fähigkeiten von Genesis zur autonomen Erstellung und Integration bei der Entwicklung komplexer Grafiksysteme.

## Open Source und Community

Das EvoX-Team wird rekursive KI-Systeme für Softwareevolution weiterentwickeln und dazu beitragen, dass Code, Validierungsergebnisse und Entwicklungserfahrung in der Open-Source-Community gesammelt werden. Wir laden weitere Entwickler ein, an nachhaltiger Softwareevolution mitzuwirken und gemeinsam ein offenes Ökosystem für Softwareentwicklung aufzubauen.

🔗 Genesis-Repository: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Genesis-Publikation: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repository mit den Ergebnissen der Challenge: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Upstream-Projekt (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 QQ-Gruppe: 297969717
