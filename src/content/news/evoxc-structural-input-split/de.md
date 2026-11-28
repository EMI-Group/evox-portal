---
title: "EvoX Compiler trennt wiederverwendbare Vorbereitung von wechselnden Eingaben"
pubDate: 2026-11-28
summary: "Neue strukturelle Graphtransformationen zeigen eine prepare/apply-Grenze und machen sichtbar, was wiederverwendet und was bei jedem Aufruf berechnet werden muss."
---

Wiederholte Berechnungen verbinden häufig feste und wechselnde Eingaben. Den festen Anteil immer neu zu berechnen kann verschwenderisch sein; beliebige Zwischenwerte aufzubewahren kann jedoch unbemerkt das Verhalten ändern. EvoX Compiler main stellt nun split_by_inputs und analyze_inputs bereit. Ein struktureller Pass zerlegt einen getracten Graphen in Vorbereitungs- und Anwendungsgraph mit prüfbarer Tensorgrenze, ohne den Quellgraphen zu verändern. Die Entwicklung vom 27.–28. November macht Wiederverwendung zur expliziten Programmentscheidung statt zu einem verborgenen Runtime-Cache. [Implementierung und Vertrag][contract]

![Eine Druckpresse hält eine vorbereitete Gravurplatte, während unterschiedliche Blätter separat zugeführt werden](./cover.webp)

*Konzeptillustration: Den festen Beitrag einmal vorbereiten und für wechselnde Eingaben nutzen.*

## Feste Eingaben auswählen

Denken Sie an viele Kandidatentensoren für dieselben Referenzdaten. Erzeugt ein geradliniger Graph zuerst ein nur von Referenzen abhängiges Zwischenergebnis, kann dieser Schritt in prepare liegen. Der wechselnde Kandidat geht an apply, gemeinsam mit dem variablen Eingabebaum und vorbereiteten Tensortupel. Das ist ein geeignetes Lastbeispiel, keine gemessene Beschleunigung.

Die fixed-Maske spiegelt den Eingabe-pytree: True markiert feste Tensoren, False oder None variable. Alternativ nennt fixed_leaves flache Tensorindizes. Genau ein Selektor ist nötig. Statische Blätter spezialisieren den Graphen bereits; eine andere Maske als None wird dort abgelehnt. Beide Hälften benötigen Tensorinputs, daher sind ausschließlich feste oder ausschließlich variable Eingaben ungültig. Normale Tupel, Listen und Dictionaries werden blattweise beschnitten; teilweise beschnittene registrierte Knoten fester Stelligkeit, dataclass oder namedtuple werden verweigert. [Eingabeauswahl][split]

## Grenzkosten vorab untersuchen

Der Pass propagiert Abhängigkeitsmasken durch geradliniges SSA, verfolgt Ausgaben rückwärts zum Entfernen toter Operationen und wählt feste Werte, die gemischte Operationen oder Rückgaben brauchen. Operationen werden in neue Module geklont. Konstanten werden in der jeweiligen Hälfte kopiert, nicht als vorbereitete Ausgaben transportiert. Ungenutzte variable Inputs bleiben für stabile Signaturen in apply.

SplitPlan berichtet Grenze, Formen, Datentypen, geschätzte Bytes und Operationszahlen. Unbekannte statische Größen ergeben unbekannte Bytes. Gezählt werden verschiedene Quelloperations-IDs: Eine beidseitig kopierte Konstante zählt in beiden Hälften, aber nur einmal in der Vereinigung für entfernte Operationen. Die Summe muss daher nicht der Quellzahl entsprechen. Der Bericht vergleicht gespeicherten Zustand mit wiederholter Berechnung, ohne Operationszahlen als Laufzeitvorhersage auszugeben. [Analyse-API][analysis]

## Ein Snapshot mit klaren Grenzen

Ändert sich ein fester Input, muss prepare erneut laufen. Keiner der Graphen verwaltet Invalidierung. Effekte außerhalb pure/read werden abgelehnt: Unabhängigkeit von variablen Eingaben bedeutet nicht, dass eine Operation sicher nur einmal laufen darf. Der erste Pass verweigert auch verschachtelte Regionen wie cond, while_loop und scan. Kollektive, Callbacks sowie externe und eigene Aufrufe brauchen bei diesen Sperren einen anderen Ansatz.

analyze_inputs untersucht dieselben Abhängigkeiten, ohne auszuführen, zu tracen oder Backends zu importieren. Es zeigt Teilbarkeit, Sperrgrund, Verbraucher, betroffene Ausgaben und zulässige Grenzkosten einzelner fixierter Inputs. Beginnen Sie dort: Eine große gespeicherte Grenze oder wenig feste Berechnung kann die Teilung unattraktiv machen. Eine Ablehnung beschreibt den Graphen und rechtfertigt nicht das Unterdrücken von Effekten.

## Beide Hälften mit dem Original vergleichen

Nutzen Sie einen Quellstand mit diesen Commits. Erstellen Sie einen SplitPlan und prüfen Sie mit verify Invarianten und Grenzverdrahtung. Jeder normale Graph durchläuft lower, compile und load; build lehnt bereits getracte Graphen bewusst ab. prepare erhält nur feste Argumente, apply den variablen Baum und das vorbereitete Tupel. Vergleichen Sie mehrere variable Eingaben mit dem Original unter den numerischen Backend-Toleranzen; ändern Sie dann feste Eingaben und bereiten Sie erneut vor. Messen Sie Vorbereitung, wiederholte Ausführung und gespeicherten Speicher getrennt. Der [Pipeline-Artikel][related] erklärt die umgebenden Stufen.

[contract]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/CONTEXT.md
[split]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/split.py
[analysis]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/analyze.py
[related]: /de/news/evoxc-custom-compilation-pipeline
