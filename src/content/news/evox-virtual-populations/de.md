---
title: "EvoX VirtualES: Neuronale Parameter ohne vollständige Population durchsuchen"
pubDate: 2026-07-08
summary: "VirtualES und VirtualProblem erzeugen Störungen bei Bedarf aus Zufallsseeds und senken so den Speicherbedarf der Populationsparameter."
---

Die EvoX-Änderungen vom 7. und 8. Juli 2026 führen einen Verarbeitungspfad für virtuelle Populationen in der Neuroevolution ein. Herkömmlich kann für jedes Kandidatennetz ein eigener Parametervektor nötig sein. VirtualES speichert stattdessen ein gemeinsames Zentrum und einen Zufallsseed je Individuum. Gaußsche Störungen werden bei Bedarf rekonstruiert. Damit wird eine konkrete Infrastrukturfrage adressiert: Wie viel Kandidatenvielfalt lässt sich mit einem gegebenen Speicherbudget darstellen?

## Kompakte Population, explizite Auswertung

Bei P Kandidaten mit D Parametern wächst der Speicher für vollständig abgelegte Kandidatenparameter proportional zu P × D. Zentrum und Seeds benötigen ungefähr D + P Elemente. Das betrifft nur die Parameterdarstellung: Aktivierungen, Fitnesswerte, Optimiererzustand und Auswertungspuffer belegen weiterhin Speicher.

VirtualES übergibt `(center, seeds, sigma)` an den Workflow. VirtualProblem wertet die Kandidaten schichtweise aus. Eine fusionierte Triton-Operation verbindet die lineare Basisberechnung mit seedbasierten Gewichts- und Bias-Störungen, ohne einen vollständigen Tensor aller gestörten Netze anzulegen. Die Fitnesswerte steuern anschließend die Aktualisierung des Zentrums für die nächste Generation.

## Grenzen der Implementierung

Vollständige gaußsche Störungen ersetzen die frühere LoRA-Formulierung mit niedrigem Rang. VirtualProblem unterstützt `nn.Sequential` mit linearen Schichten und festgelegten Aktivierungsfunktionen. Es ist kein universeller Auswerter für beliebige Netzarchitekturen; die dokumentierte Schnittstelle unterstützt den HPO-Wrapper nicht. Der virtuelle Pfad überspringt außerdem verteilte Auswertung und Lösungstransformationen.

## Warum die Darstellung zählt

Die Änderung verbindet Populationssuche und Ausführung auf andere Weise. Speicherkompromisse lassen sich untersuchen, ohne zunächst sämtliche Kandidatengewichte vorzuhalten. Spitzenverbrauch und Durchsatz hängen jedoch von Netzform, Population, Batches und Hardware ab; die Änderungen belegen keine allgemeine Beschleunigung. Für EvoX ist dies ein konkreter Schritt zu einer flexibleren rechnerischen Umsetzung evolutionärer Exploration.

[1](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6) · [2](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921) · [3](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697) · [4](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)
