---
title: "TensorNEAT: Population erhalten, Arbeitsspeicher begrenzen"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Populationsbatches und kleinere Suchzwischenwerte reduzieren den gleichzeitigen Arbeitsbereich von NEAT, ohne die Suchpopulation zu verkleinern."
---

Auch wenn Genome in den GPU-Speicher passen, können Transformations- und Auswertungsarrays ihn erschöpfen. TensorNEATs [Änderung vom 4. April 2026][s2] verschiebt Transformationen in sequenzielle Populationsbatches und verkleinert Suchzwischenwerte. Die Kandidatenzahl bleibt erhalten, während der Arbeitsbereich steuerbar wird.

![Unterschiedliche neuronale Netze passieren gruppenweise eine kleine Öffnung](./cover.webp)

*Konzeptillustration: Die Population bleibt erhalten, der aktive Arbeitsbatch wird begrenzt.*

## Den Arbeitssatz statt des Suchraums aufteilen

Die Apriländerung ergänzt `pop_batch_size` in NEAT und Pipeline. Der Pipeline-Wert überschreibt die Algorithmuseinstellung, und die Population muss durch die Batchgröße teilbar sein. Der bisherige Parameter `eval_batch_size` wird ersetzt; vorhandene Konfigurationen müssen angepasst werden.

Im Einzelgerätepfad liegt die Transformation nun innerhalb von `jax.lax.scan`. Statt zuerst dichte Adjazenzzwischenwerte für die gesamte Population zu erzeugen, transformiert und bewertet die Pipeline batchweise. Auch Mutation nutzt die Einstellung. Die Populationsgröße bleibt gleich, nur der gleichzeitige Arbeitssatz ändert sich. Das erhält Vielfalt bei knappen GPU-Speicherressourcen.

Entscheidend ist, wo der Batch beginnt. Wird erst nach der Transformation der gesamten Population die Auswertung aufgeteilt, ist das große Adjazenzarray bereits angelegt. Beide Operationen in den scan-Körper zu verschieben verändert seine Lebensdauer. Der Commit beschreibt den Wechsel von Population × Knoten × Knoten zu Batch × Knoten × Knoten. Das vergleicht Implementierungen, nicht den gesamten Gerätespeicher: Genome, persistenter Zustand und andere Puffer bleiben. [Transformationsänderung][s2]

Batching ist eine Ausführungsentscheidung. Es wählt nicht weniger Überlebende und verändert die angeforderte Population nicht. Eine kleinere Population verändert dagegen die teilnehmenden Kandidaten und möglicherweise die Suche. Halten Sie diese Einstellungen bei Speicherfehlern auseinander. Ein sinnvoller erster Vergleich hält die Population fest und variiert nur einen gültigen Teiler für den Arbeitsbatch.

## Nachschlagen ohne große Vergleichszwischenwerte

Verschachtelte Vergleiche im Crossover werden durch Hash-Abgleich und sortierte Suche ersetzt. Verbindungsschlüssel werden ebenfalls mittels Sortieren und Suchen auf Knotenindizes abgebildet. Damit werden temporäre Arrays adressiert, die mit Population und Netzkapazität stark wachsen.

Der Commit berichtet identische Verläufe über 15 Generationen mit festen Seeds für DefaultGene und OriginGene. Das ist ein bestimmtes Regressionsergebnis, keine Garantie über alle Abhängigkeiten und Geräte. Korrektheits- und Speicherprofilierskripte ermöglichen die Prüfung von Implementierung und Aussagen.

## Batchgröße reproduzierbar wählen

Beginnen Sie mit einer kleinen Funktionsanpassung und festen Knoten- und Verbindungsgrenzen. Speichern Sie Verlust- oder Fitnessfolge ohne Batching, wählen Sie dann einen Teiler der Population. Erst Korrektheit vergleichen, danach Spitzenbedarf, Kompilierung und Schrittzeit getrennt messen. Kleinere Batches senken Speicherlast und verändern gleichzeitig den verfügbaren Parallelismus.

Fixieren Sie die Konfigurationssemantik mit dem [April-Quellstand][s4], einschließlich des umbenannten Batch-Arguments. TensorNEAT basiert auf JAX; die dokumentierte EvoX-Integration zielt auf den damaligen JAX-Zweig. Halten Sie Abhängigkeitsversionen fest. Der separate [Artikel zu Populationsgradienten][gradient] erläutert Parameterlernen. Prüfen Sie zunächst, ob die Batch-Änderung das Ergebnis Ihres Laufs erhält, und danach den Speicher-Zeit-Kompromiss.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /de/news/tensorneat-population-gradients
