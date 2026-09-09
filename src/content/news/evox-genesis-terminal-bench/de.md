---
title: "EvoX Genesis schließt die Terminal-Bench-Herausforderung WASM Render für 36 US-Dollar ab und reicht sie ein"
pubDate: 2026-09-10
summary: "Das EvoX-Team hat mit Genesis die WASM-Render-Herausforderung der Terminal-Bench Challenges abgeschlossen und eingereicht; die dokumentierten Modellkosten dieses Durchlaufs betragen 36 US-Dollar — weit unter der von Terminal-Bench genannten Erwartung von mehr als 1.000 US-Dollar pro Herausforderung. Zum Zeitpunkt der Veröffentlichung ist Genesis möglicherweise das erste autonome System, das öffentlich über den Abschluss und die Einreichung eines Terminal-Bench-Challenge-Ergebnisses berichtet."
---

![EvoX Genesis schließt die Terminal-Bench-Herausforderung WASM Render ab und reicht sie ein](./evox-genesis-terminal-bench-hero.png)

Das EvoX-Team hat Genesis genutzt, um die WASM-Render-Herausforderung der Terminal-Bench Challenges abzuschließen und einzureichen, mit **dokumentierten Modellkosten von 36 US-Dollar** für diesen Durchlauf.

Zum Zeitpunkt der Veröffentlichung ist **Genesis möglicherweise das erste autonome System, das öffentlich über den Abschluss und die Einreichung eines Terminal-Bench-Challenge-Ergebnisses berichtet**.

## WASM Render: Einen vollständigen WebGL-Software-Stack von Grund auf erstellen

WASM Render verlangt die Implementierung eines reinen JavaScript/WASM-Software-Renderers, der Node.js-Projekten die WebGL-1.0- und 2.0-APIs bereitstellt. Die Zielumgebung darf nicht auf einen Browser, eine GPU, native C++-Bindings oder externe Bibliotheken angewiesen sein.

Laut Herausforderungsspezifikation muss die Lösung einen GLSL-Compiler, Dreiecks-Rasterisierung und die gesamte WebGL-API-Oberfläche abdecken. Terminal-Bench definiert den Verifikationsumfang als 2.071 Khronos-CTS-Tests zusammen mit visuellen Regressionssuiten für three.js und Babylon.js. Dies beschreibt das Abnahmeziel der Herausforderung; es bedeutet nicht, dass die Einreichung von Genesis bereits eine offizielle Terminal-Bench-Evaluierung bestanden hat.

Viele Benchmarks für Coding-Agenten bewerten einen einzelnen Bugfix oder eine lokalisierte Funktion. WASM Render ist anders: Die Arbeit erstreckt sich über eine große Anzahl voneinander abhängiger Module, und die gesamte Codebasis muss über fortlaufende Implementierung, Integration und Validierung hinweg kohärent bleiben.

Aufgaben dieser Art legen zentrale Probleme der Langzeit-Entwicklung offen: Bleiben lokale Änderungen mit der Gesamtarchitektur konsistent? Werden frühe Entscheidungen von der späteren Arbeit korrekt geerbt? Können Validierungsnachweise die nächste Phase zuverlässig leiten? Terminal-Bench Challenges erweitert die Bewertungseinheit auf ein vollständiges Softwareprojekt, um genau diese Fähigkeiten zu untersuchen.

![Terminal-Bench Challenges im Vergleich zu kürzeren Coding-Aufgaben](./evox-genesis-terminal-bench-comparison.jpg)

## Wie Genesis Langzeit-Entwicklung aufrechterhält

Genesis verlässt sich nicht auf einen dauerhaft existierenden Agenten oder einen ständig wachsenden Kontext, um den gesamten Entwicklungszustand zu bewahren. Das Softwareprojekt selbst bildet die beständige „Welt“: Die akzeptierte Softwareversion dokumentiert den aktuellen Zustand, während Repository-Pfade festlegen, wo ein Agent sich befindet und wofür er verantwortlich ist.

Agenten mit begrenzter Lebensdauer entfalten sich rekursiv um die Repository-Struktur. Innerhalb begrenzter Bereiche implementieren, prüfen und validieren sie Kandidatenänderungen. Die Ergebnisse der Agenten sind zunächst Vorschläge; nur akzeptierter Code und Validierungsnachweise gehen in die Projektgeschichte ein und stehen späteren Agenten zur Verfügung.

Bei einem Systemprojekt wie WASM Render kann sich so jeder Agent einem klar umrissenen, begrenzten Problem widmen, während Compiler, Rendering-Pipeline, Zustandsverwaltung und Kompatibilitätsarbeit auf Basis einer gemeinsamen Code- und Validierungsgeschichte weiterentwickelt werden.

Genesis hat die WASM-Render-Herausforderung für nur 36 US-Dollar abgeschlossen – weit unter der von Terminal-Bench genannten Erwartung von mehr als 1.000 US-Dollar pro Herausforderung.

Unsere internen, nicht-formellen Tests deuten zudem darauf hin, dass Genesis mit Codebasen im Umfang von rund 100.000 Zeilen effektiv arbeiten kann. Mit Codebasen von einer Million Zeilen und mehr haben wir vergleichsweise wenig Erfahrung, unsere Versuche verliefen bisher jedoch reibungslos.

🌐 Projekt-Website:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 QQ-Gruppe: 297969717

![QR-Code der QQ-Gruppe](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>QQ-Gruppe｜</strong>Evolutionary Machine Intelligence</center>
