---
title: "TensorNEAT: Parameter unterschiedlicher Netzwerktopologien lernen"
pubDate: 2026-03-03
updatedDate: 2026-11-17
summary: "Populationsparallele Gradienten verbessern kontinuierliche Parameter und erhalten dabei die diskrete Struktur jedes Kandidaten."
---

Eine Netzwerkpopulation kann unterschiedliche Verbindungen enthalten, ohne für jede Struktur eine eigene Trainingsschleife zu benötigen. TensorNEATs [PR #37][s1], am 3. März 2026 in main integriert, ergänzt Gradienten für tensorisierte Genome und einen JAX-vektorisierten Weg zur Verbesserung der Population.

![Unterschiedliche Netzwerke behalten ihre Verbindungen, während Gewichte eingestellt werden](./topology-gradients.webp)

*Konzeptillustration: kontinuierliche Parameter abstimmen und die jeweilige Topologie erhalten.*

## Verschiedene Strukturen, dieselbe Gradientenoperation

TensorNEAT stellt NEAT-Netze als Knoten- und Verbindungstensoren dar. `genome.grad` liefert skalaren Verlust und Gradienten beider Arrays. Strukturfelder wie Indizes und Funktionstypen sowie NaN-Auffüllung erhalten Nullgradienten. Numerische Parameter werden optimiert, die codierte Struktur bleibt bestehen.

JAX-Vektorisierung wendet dies auch auf unterschiedliche Topologien an. Das [XOR-Beispiel][s3] initialisiert eine Population, erzeugt strukturelle Vielfalt durch Mutation und optimiert dann per Gradientenabstieg. Damit können Struktur- und Parametersuche gemeinsam untersucht werden, ohne Gradienten als Änderung diskreter Verbindungen zu behandeln.

## Den Vorwärtspfad differenzierbar machen

Die Implementierung berechnet einen skalaren Verlust über Transformation und Vorwärtsauswertung und verwendet `jax.value_and_grad` für Ableitungen nach Knoten- und Verbindungsarrays. Ein Eingabevektor wird einmal ausgewertet, ein Eingabebatch vektorisiert. Das Ziel bleibt explizit: Seine Änderung entscheidet der Aufrufer, nicht eine implizite Eigenschaft der Netzwerkrepräsentation. [Gradientenimplementierung][implementation]

Dafür sind auch Änderungen unterhalb der API nötig. Das Standardgenom durchläuft eine begrenzte `jax.lax.fori_loop`; Verbindungs- und Aggregationsoperationen übergeben Gültigkeitsmasken, damit ungenutzte NaN-Einträge die Rechnung nicht verunreinigen. Padding bleibt Teil der Repräsentation und ist keine trainierbare Verbindung. Strukturelle Mutation und numerische Verbesserung bleiben somit unterschiedliche Operationen, auch in denselben Arrays.

## Das XOR-Beispiel trennt Vielfalt und Lernen

Das integrierte Beispiel initialisiert 1.000 Netze für XOR mit drei Eingängen und mutiert sie 20 Runden mit unterschiedlichen Zufallsschlüsseln. Erst danach folgen höchstens 500 Gradientenschritte mit Lernrate 0,5. Diese Phase verwendet `jax.jit(jax.vmap(...))` über Individuen und führt keine evolutionäre Selektion aus. Das Projekt demonstriert die Verbesserung verschiedener Strukturen; es belegt damit nicht, dass Gradientenabstieg die Topologiesuche ersetzt. [Vollständiges Beispiel][s3]

Lesen Sie neben bestem und mittlerem Verlust auch die Anzahl gültiger Individuen. Ein unverbundener Kandidat kann nichtendliche Ausgaben liefern; das Beispiel filtert endliche Verluste für den Bericht, und Tests erhalten NaN-Ausgaben unverbundener Netze. Ein sinkender Bestwert sagt nicht, welcher Anteil der Population nutzbar ist. Prüfen Sie nach der Optimierung auch die Vorhersagen des ausgewählten Netzes.

## Ableitungen vor der Erweiterung prüfen

Neue Tests behandeln endliche Gradienten verbundener Standard- und rekurrenter Genome, kompilierte Differentiation, Populationsbatches, Verlustsenkung und finite Differenzen. Beginnen Sie eigene Aufgaben mit dem versionierten XOR-Beispiel und ändern Sie dann den Verlust bei expliziten Eingaben und Topologiegrenzen. Prüfen Sie Gradienten und Strukturfelder, bevor Sie Lernen und Mutation abwechseln. Die spätere [Speicheraktualisierung][memory] verändert den Arbeitsbatch; sie ist eine separate Kontrolle zur Parameterlernmethode.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s3]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/examples/func_fit/xor_grad.py
[implementation]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/src/tensorneat/genome/base.py
[memory]: /de/news/tensorneat-gradient-memory
