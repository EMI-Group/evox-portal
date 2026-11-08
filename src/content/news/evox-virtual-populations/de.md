---
title: "EvoX VirtualES: Mehr Kandidaten, weniger gespeicherte Gewichte"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "Ein gemeinsames Parameterzentrum und individuelle Zufallsseeds lassen VirtualES Störungen bei Bedarf rekonstruieren und verändern das Speicherbudget der Populationssuche."
---

Eine größere Population neuronaler Netze bedeutet üblicherweise mehr gespeicherte Gewichtskopien. Die EvoX-Änderungen vom 7.–8. Juli 2026 gehen einen anderen Weg: VirtualES speichert ein gemeinsames Parameterzentrum und einen Zufallsseed je Kandidat. Unterschiede werden während der Bewertung rekonstruiert. Damit stellt sich neu die Frage, wie viel Suchvielfalt ins Speicherbudget passt.

![Geteilte Parameter und Seeds erzeugen virtuelle Kandidaten](./virtuales-shared-center.webp)

*Konzeptillustration: ein gemeinsames Zentrum, viele rekonstruierbare Kandidaten.*

## Die Bauanleitung eines Kandidaten speichern

Bei P Kandidaten mit jeweils D Parametern wächst der explizite Speicherbedarf proportional zu P × D. Zentrum und Seeds benötigen ungefähr D + P Einträge. Verglichen wird die Parameterdarstellung der Population; Aktivierungen, Optimiererzustand und Bewertungspuffer gehören weiterhin zum Gesamtbedarf. [VirtualES-Implementierung](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

VirtualES übergibt `(center, seeds, sigma)` an den Workflow. VirtualProblem bewertet die Schichten mit einer fusionierten Triton-Operation, die die lineare Grundberechnung mit seedbasierten Gewichts- und Bias-Störungen verbindet. Die Fitness steuert anschließend die Aktualisierung des Zentrums. Vollständige gaußsche Störungen ersetzen die frühere LoRA-Formulierung mit niedrigem Rang. [Bewertungsimplementierung](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## Individuelles Feedback erhalten

Als Ausgangspunkt eignet sich ein `nn.Sequential`-Netz mit linearen Schichten und dokumentierten Aktivierungsfunktionen. Stellen Sie die Verlustfunktion auf `reduction='none'`, damit VirtualProblem die Verluste jedes Kandidaten getrennt aggregiert. Ein skalarer Verlust würde auf die gesamte Population verteilt und die Unterschiede verdecken. Diese kleine Schnittstellenentscheidung beeinflusst die Suche.

Der virtuelle Pfad überspringt verteilte Bewertung und Lösungstransformationen; VirtualProblem unterstützt auch den HPO-Wrapper nicht. Prüfen Sie diese Grenzen vor der Anpassung vorhandener Experimente. [Workflow-Integration](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## Den neuen Spielraum messen

Variieren Sie bei einem unterstützten Netz die Populationsgröße und erfassen Sie Spitzenspeicherbedarf, Bewertungszeit und Fitness bei konstantem Bewertungsbudget. So trennen Sie die Speicherersparnis von den Kosten für Rauschrekonstruktion und Aktivierungen. Die Juli-Änderungen enthalten außerdem eine [Triton-Kompilierungskorrektur](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef) für die Rauschhilfsfunktion.

Der [Schnelleinstieg](/de/news/evox-quickstart) erklärt den Aufbau eines EvoX-Experiments. VirtualES eröffnet danach eine konkrete Frage: Wie verändert eine größere Population Ihr Experiment, wenn das Speichern aller Kandidatengewichte keine Voraussetzung mehr ist?
