---
title: "TensorNEAT: Unterschiedliche Netze verfeinern, ohne alle Zwischenwerte zu halten"
pubDate: 2026-04-04
summary: "Populationsparallele Gradienten und kontrollierter Speicherbedarf verbinden Topologiesuche mit Parameteroptimierung in JAX."
---

Bei der Suche nach Netzstrukturen sehen die Individuen nicht alle gleich aus. TensorNEATs [Gradientenintegration vom 3. März 2026][s1] ermöglicht Parameterverfeinerung über unterschiedliche Topologien hinweg. Die [Speicheränderung vom 4. April][s2] reduziert Zwischenarbeit und führt Populationsbatches ein: eine zusätzliche Stellgröße neben dem Verkleinern der Suche.

![Unterschiedliche neuronale Netze passieren gruppenweise eine kleine Öffnung](./cover.webp)

*Konzeptillustration: Die Population bleibt erhalten, der aktive Arbeitsbatch wird begrenzt.*

## Verschiedene Strukturen, dieselbe Gradientenoperation

TensorNEAT stellt NEAT-Netze als Knoten- und Verbindungstensoren dar. `genome.grad` liefert skalaren Verlust und Gradienten beider Arrays. Strukturfelder wie Indizes und Funktionstypen sowie NaN-Auffüllung erhalten Nullgradienten. Numerische Parameter werden optimiert, die codierte Struktur bleibt bestehen.

JAX-Vektorisierung wendet dies auch auf unterschiedliche Topologien an. Das [XOR-Beispiel][s3] initialisiert eine Population, erzeugt strukturelle Vielfalt durch Mutation und optimiert dann per Gradientenabstieg. Damit können Struktur- und Parametersuche gemeinsam untersucht werden, ohne Gradienten als Änderung diskreter Verbindungen zu behandeln.

## Den Arbeitssatz statt des Suchraums aufteilen

Die Apriländerung ergänzt `pop_batch_size` in NEAT und Pipeline. Der Pipeline-Wert überschreibt die Algorithmuseinstellung, und die Population muss durch die Batchgröße teilbar sein. Der bisherige Parameter `eval_batch_size` wird ersetzt; vorhandene Konfigurationen müssen angepasst werden.

Im Einzelgerätepfad liegt die Transformation nun innerhalb von `jax.lax.scan`. Statt zuerst dichte Adjazenzzwischenwerte für die gesamte Population zu erzeugen, transformiert und bewertet die Pipeline batchweise. Auch Mutation nutzt die Einstellung. Die Populationsgröße bleibt gleich, nur der gleichzeitige Arbeitssatz ändert sich. Das erhält Vielfalt bei knappen GPU-Speicherressourcen.

## Nachschlagen ohne große Vergleichszwischenwerte

Verschachtelte Vergleiche im Crossover werden durch Hash-Abgleich und sortierte Suche ersetzt. Verbindungsschlüssel werden ebenfalls mittels Sortieren und Suchen auf Knotenindizes abgebildet. Damit werden temporäre Arrays adressiert, die mit Population und Netzkapazität stark wachsen.

Der Commit berichtet identische Verläufe über 15 Generationen mit festen Seeds für DefaultGene und OriginGene. Das ist ein bestimmtes Regressionsergebnis, keine Garantie über alle Abhängigkeiten und Geräte. Korrektheits- und Speicherprofilierskripte ermöglichen die Prüfung von Implementierung und Aussagen.

## Batchgröße reproduzierbar wählen

Beginnen Sie mit einer kleinen Funktionsanpassung und festen Knoten- und Verbindungsgrenzen. Speichern Sie Verlust- oder Fitnessfolge ohne Batching, wählen Sie dann einen Teiler der Population. Erst Korrektheit vergleichen, danach Spitzenbedarf, Kompilierung und Schrittzeit getrennt messen. Kleinere Batches senken Speicherlast und verändern gleichzeitig den verfügbaren Parallelismus.

Für Gradienten das XOR-Beispiel mit explizitem Verlust und Lernrate verwenden. Für Speicherexperimente den [Aprilstand][s4] fixieren. TensorNEAT basiert auf JAX; die EvoX-Integration im README meint den JAX-Zweig und ist beim Zusammenstellen der Umgebung zu beachten. So lässt sich genauer untersuchen, wie viel Struktur- und Parametersuche in ein Speicherbudget passt.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s3]: https://github.com/EMI-Group/tensorneat/blob/ce27fa9f794928c9416d9f12c398f58481c821ce/examples/func_fit/xor_grad.py
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
