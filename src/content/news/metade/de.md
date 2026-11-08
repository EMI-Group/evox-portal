---
title: "MetaDE: Suchstrategien mit der Aufgabe weiterentwickeln"
pubDate: 2025-02-15
updatedDate: 2026-11-08
summary: "MetaDE ergänzt Differential Evolution um eine äußere Evolutionsschleife und nutzt EvoXs parallele Berechnung zur Bewertung und Verbesserung von Suchkonfigurationen."
---

Anpassung kann die Suchweise eines Systems ebenso betreffen wie seine Lösungen. MetaDE bringt dies mit zwei verbundenen evolutionären Ebenen in EvoX: Eine löst das Zielproblem, die andere bewertet, welche DE-Konfigurationen die Suche wirksam machen. [MetaDE](https://github.com/EMI-Group/metade)

![Äußere Parametersuche umgibt innere Kandidatenexperimente](./nested-evolution-search.webp)

## Hintergrund

Im Bereich der evolutionären Berechnung wird die Leistung von Algorithmen oft maßgeblich durch die Wahl der Hyperparameter beeinflusst. Die Bestimmung der geeignetsten Parametereinstellungen für ein spezifisches Problem ist seit langem eine Herausforderung in der Forschung. Differential Evolution (DE) ist als klassischer evolutionärer Algorithmus wegen seiner Einfachheit und robusten globalen Suchfähigkeit sehr beliebt; dennoch ist seine Leistung sehr empfindlich gegenüber der Wahl der Hyperparameter. Konventionelle Methoden verlassen sich typischerweise entweder auf erfahrungsbasierte Abstimmung oder adaptive Mechanismen, um die Leistung zu verbessern. Angesichts diverser Problemszenarien haben diese Ansätze jedoch häufig Schwierigkeiten, ein Gleichgewicht zwischen Effizienz und breiter Anwendbarkeit zu finden.

Das Konzept der „Meta-Evolution“ wurde bereits im letzten Jahrhundert eingeführt, mit dem Ziel, evolutionäre Algorithmen selbst zu nutzen, um die Hyperparameter-Konfigurationen dieser Algorithmen zu optimieren. Obwohl Meta-Evolution schon seit vielen Jahren existiert, war ihre praktische Anwendung durch den hohen Rechenaufwand begrenzt. Jüngste Fortschritte im GPU-Computing haben diese Einschränkungen gelockert und bieten starke Hardware-Unterstützung für evolutionäre Algorithmen. Insbesondere die Einführung des verteilten, GPU-beschleunigten EvoX-Frameworks hat die Entwicklung GPU-basierter evolutionärer Algorithmen stark erleichtert. Vor diesem Hintergrund schlug unser Forschungsteam einen neuartigen Meta-Evolutionsansatz vor, der DE nutzt, um seine eigenen Hyperparameter und Strategien zu entwickeln, und damit einen neuen Weg zur Lösung des langjährigen Problems der Parameterabstimmung in evolutionären Algorithmen bietet.

## Was ist Meta-Evolution?

Die Kernidee hinter der Meta-Evolution lässt sich zusammenfassen als „**Verwendung eines evolutionären Algorithmus zur Weiterentwicklung seiner selbst**“ (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Dieses Konzept geht über traditionelle Methoden der evolutionären Berechnung hinaus, indem es nicht nur evolutionäre Algorithmen einsetzt, um optimale Lösungen für ein Problem zu suchen, sondern auch die Hyperparameter und Strategien der Algorithmen durch deren eigene evolutionäre Prozesse anpasst.

Mit anderen Worten führt die Meta-Evolution ein Paradigma der „**Selbst-Evolution**“ ein, das es Algorithmen ermöglicht, sich selbst zu optimieren, während sie den Suchraum nach Problemlösungen erkunden. Durch die kontinuierliche Verfeinerung während des evolutionären Prozesses werden die Algorithmen anpassungsfähiger und können in verschiedenen Problemszenarien eine hohe Effizienz aufrechterhalten.

Am Beispiel von MetaDE zeigt sich, dass dessen Design in dieser Philosophie verwurzelt ist. In einer zweischichtigen Struktur löst die untere Schicht (der „**Executor**“) das gegebene Optimierungsproblem unter Verwendung eines parametrisierten DE. Die obere Schicht (der „**Evolver**“) verwendet gleichzeitig DE, um die Hyperparameter-Konfigurationen des Executors zu optimieren. Dieses Framework lässt DE nicht nur als Löser fungieren, sondern auch „erforschen“, wie die eigenen Parameter und Strategien am besten angepasst werden können, um verschiedene Probleme effektiver zu lösen. Ein solcher Prozess ähnelt einem System, das sich schrittweise selbst versteht und verfeinert – eine Transformation vom **„passiven Lösen eines Problems“ zur „aktiven Selbst-Evolution“.** Folglich kann es sich besser an diverse Aufgaben anpassen. **Wenn wir DE als komplexes System betrachten, ermöglicht MetaDE effektiv eine „rekursive“ Art des Selbstverständnisses und der Selbstverbesserung innerhalb dieses Systems.**

Der Begriff „**Rekursion**“ in der Informatik beschreibt typischerweise eine Funktion oder Prozedur, die sich selbst aufruft. Innerhalb von MetaDE erhält dieses Konzept eine neue Bedeutung: Es ist ein **intern rekursiver** Optimierungsmechanismus, der DE verwendet, um die Hyperparameter von DE zu entwickeln. Dieses selbstreferenzielle Schema verkörpert nicht nur eine starke Anpassungsfähigkeit, sondern bietet auch eine neue Perspektive auf das „No Free Lunch“-Theorem. Da es keinen einzelnen, universell optimalen Parametersatz für alle Probleme gibt, ist die autonome Selbstentwicklung des Algorithmus der Schlüssel zum Finden der besten Parameterkonfigurationen für eine gegebene Aufgabe.

Durch diesen rekursiven meta-evolutionären Ansatz erzielt MetaDE mehrere Vorteile:

**1. Automatisierte Parameterabstimmung**

Der arbeitsintensive manuelle Abstimmungsprozess entfällt. Der Algorithmus lernt selbst, wie er seine Hyperparameter anpasst, was menschliche Eingriffe reduziert und die Effizienz verbessert.

**2. Verbesserte Anpassungsfähigkeit**

MetaDE reagiert dynamisch auf sich ändernde Problemeigenschaften und Bedingungen und modifiziert Strategien in Echtzeit, um die Leistung zu verbessern. Dies erhöht die Flexibilität des Algorithmus erheblich.

**3. Effiziente Suche**
Durch die Nutzung inhärenter Parallelität beschleunigt MetaDE die Suche in groß angelegten Optimierungsproblemen erheblich. Es liefert machbare Lösungen für hochdimensionale, komplexe Probleme innerhalb angemessener Zeitrahmen.

## Algorithmische Implementierung

MetaDE verwendet tensorbasierte Techniken und GPU-Beschleunigung, um effizientes paralleles Rechnen zu ermöglichen. Durch die gleichzeitige Verarbeitung vieler Individuen einer Population wird die gesamte Recheneffizienz deutlich verbessert, was besonders bei der einzieligen Black-Box-Optimierung und groß angelegten Optimierungsproblemen vorteilhaft ist. Durch die Tensorisierung von Schlüsselparametern und Datenstrukturen (z. B. Population, Fitness, Strategieparameter) erreicht MetaDE nicht nur eine höhere Recheneffizienz, sondern verbessert auch seine Fähigkeit, komplexe Optimierungsherausforderungen zu bewältigen. Im Vergleich zu klassischem DE und anderen evolutionären Algorithmen (EAs) zeigt MetaDE eine überlegene Leistung bei der Lösung groß angelegter Probleme. Dank des tensorbasierten Ansatzes nutzt MetaDE Rechenressourcen effektiver und liefert schnellere Lösungen und präzisere Optimierungsergebnisse als traditionelle Methoden.

![1.png](./metade-4.png "1.png")

PDE-Architektur

Das Forschungsteam schlug zunächst ein parametrisiertes DE-Algorithmus-Framework (PDE) vor, das Modifikationen von Parametern und Strategien vollständig unterstützt. In diesem Framework sind F und CR kontinuierliche Parameter, während andere Parameter diskret sind. Die gestrichelten Kästen zeigen den Bereich der zulässigen Parameterwerte an. Die Mutationsfunktion wird aus den linken und rechten Basisvektoren sowie dem Parameter abgeleitet, der die Anzahl der Differenzvektoren steuert.

![2.png](./metade-5.png "2.png")

MetaDE-Architektur

MetaDE verwendet eine zweischichtige Struktur, bestehend aus **einem Evolver** (obere Schicht) und **mehreren Executoren** (untere Schicht). Der Evolver ist ein DE (oder potenziell ein anderer evolutionärer Algorithmus), der für die Optimierung der Parameter von PDE verantwortlich ist. Jedes Individuum  x_i in der Population des Evolvers entspricht einer eindeutigen Parameterkonfiguration θ_i. Diese Konfigurationen werden an das PDE übergeben, um verschiedene DE-Varianten zu instanziieren, die jeweils von einem Executor verwaltet werden, der unabhängig an der gegebenen Optimierungsaufgabe arbeitet. Jeder Executor gibt seinen besten Fitnesswert y^* an den Evolver zurück, der diesen Fitnesswert y_i dem entsprechenden Individuum x_i zuweist.

## Experimentelle Leistung

Um die Wirksamkeit von MetaDE umfassend zu bewerten, führte das Forschungsteam systematische Experimente durch, die mehrere Benchmark-Tests und reale Szenarien umfassten. Jedes Experiment verwendete einen Evolver (DE mit rand/1/bin-Strategie) und Executoren (PDE mit einer Populationsgröße von 100). Zu den wichtigsten experimentellen Komponenten gehören:

### CEC2022 Benchmark
 Vergleich von MetaDE mit verschiedenen DE-Varianten in Aufgaben der einzieligen Optimierung.

### Vergleich mit den Top-Vier CEC2022-Algorithmen
 Bewertung von MetaDE im Vergleich zu den vier leistungsstärksten Algorithmen des CEC2022-Wettbewerbs unter identischen Budgets für Funktionsauswertungen (FEs).

### Funktionsauswertungen (FEs) bei fester Wall-Clock-Zeit
 Analyse der Recheneffizienz von MetaDE unter GPU-Beschleunigung.

### Robotersteuerungsaufgaben
 Anwendung von MetaDE auf Robotersteuerungsaufgaben in einer Brax-Plattformumgebung zur Validierung des praktischen Nutzens.

## CEC2022 Benchmark: Vergleich mit gängigen DE-Varianten

Das Team verglich MetaDE mit mehreren repräsentativen DE-Varianten auf der CEC2022-Benchmark-Suite, darunter:

* **Standard DE (rand/1/bin)**
* **SaDE und JaDE (adaptive DE-Algorithmen)**
* **CoDE (DE mit Strategieintegration)**
* **SHADE und LSHADE-RSP (erfolgsbasierte adaptive DE)**
* **EDEV (integrierte DE-Varianten)**

Alle Algorithmen wurden auf der EvoX-Plattform implementiert, wobei GPU-Beschleunigung mit einer Populationsgröße von 100 aus Fairnessgründen genutzt wurde. Die Experimente wurden bei unterschiedlichen Dimensionalitäten (10D und 20D) unter **der gleichen Rechenzeitbeschränkung (60 Sekunden)** durchgeführt.

![3.png](./metade-7.png "3.png")

10D CEC2022 Optimierungsergebnisse

![4.png](./metade-8.png "4.png")

20D CEC2022 Optimierungsergebnisse

MetaDE erreicht im Allgemeinen eine schnellere und stabilere Konvergenz bei den meisten Testfunktionen. Sein parametrisiertes DE (PDE) in Verbindung mit der Optimierung auf der oberen Ebene ermöglicht eine dynamische Anpassung an verschiedene Problemräume, was die allgemeine Robustheit und Suchleistung verbessert.

## Vergleich mit den Top-Vier CEC2022-Algorithmen (Unter identischen FEs)

Um die Optimierungsfähigkeit von MetaDE weiter zu bewerten, verglichen wir es mit den vier besten Algorithmen des CEC2022-Wettbewerbs innerhalb **des gleichen Budgets für Funktionsauswertungen**:

* **EA4eig**: Eine hybride Methode, die mehrere EAs integriert
* **NL-SHADE-LBC**: Ein verbessertes adaptives DE
* **NL-SHADE-RSP-MID**: Ein erweitertes SHADE mit Mittelpunktschätzung
* **S-LSHADE-DP**: Eine DE-Variante, die die Populationsvielfalt durch dynamische Störung aufrechterhält

Jeder dieser Algorithmen wurde mit seinen offiziellen Parametereinstellungen und Quellcode unter **den gleichen FE-Beschränkungen** ausgeführt. Statistische Vergleiche (Wilcoxon-Rangsummentest, Signifikanzniveau 0,05)

wurden zwischen MetaDE und jeder Baseline auf der CEC2022-Testsuite durchgeführt. Die letzte Zeile der Tabelle zeigt die Leistung jedes Algorithmus im Vergleich zu MetaDE bei den verschiedenen Testfunktionen: + (signifikant besser), ≈ (kein signifikanter Unterschied) und − (signifikant schlechter).

![5.png](./metade-9.png "5.png")

Vergleich der 10D CEC2022 Wettbewerbsalgorithmen (Gleiche FEs)

![6.png](./metade-10.png "6.png")

Vergleich der 20D CEC2022 Wettbewerbsalgorithmen (Gleiche FEs)

MetaDE zeigt durchweg eine starke Leistung, insbesondere bei komplexen Problemen, die eine robuste Konvergenz erfordern. Dank seines **selbstadaptiven Mechanismus** passt MetaDE seine Strategie effektiv an verschiedene Suchlandschaften an und verbessert so die Sucheffizienz und die globale Optimierungsfähigkeit. Diese Ergebnisse zeigen, dass MetaDE nicht nur gängige DE-Varianten übertrifft, sondern auch eine starke Wettbewerbsfähigkeit gegenüber erstklassigen Wettbewerbsalgorithmen aufweist.

## Recheneffizienz: FEs innerhalb einer festen Zeit (60 Sekunden)

Das Forschungsteam erfasste außerdem **die Anzahl der Funktionsauswertungen (FEs), die von verschiedenen Algorithmen innerhalb derselben festen Laufzeit (60 Sekunden) durchgeführt wurden**.

![图片2.png](./metade-11.png)

Erreichte FEs von jedem Algorithmus in 60 Sekunden

Unter demselben EvoX-Framework mit GPU-beschleunigter paralleler Berechnung erreichte MetaDE im Durchschnitt FEs im Bereich von **10⁹**, während traditionelle DE-Varianten nur etwa ***10^6*** FEs erreichten. Dieser Vorteil ergibt sich aus dem parametrisierten Ansatz von MetaDE, der **groß angelegte parallele Auswertungen** von Individuen durchführt und so eine **effizientere Nutzung der Hardware-Ressourcen** ermöglicht. Folglich erkundet der Algorithmus mehr Lösungen innerhalb desselben Zeitfensters, was sowohl die Lösungsqualität als auch die Stabilität verbessert.

## Evolutionäres Reinforcement Learning: Robotersteuerungsaufgaben

MetaDE sucht im Robotersteuerungsexperiment ohne Gradienten nach Parametern neuronaler Strategien; das Strategieziel wird dabei nicht rückwärts differenziert. Evolutionäres Reinforcement Learning umfasst jedoch auch gradientenbasierte und hybride Verfahren und beseitigt nicht grundsätzlich die Schwierigkeiten von PPO oder SAC.

![8.png](./metade-12.png "8.png")

Die Versuche verwenden Brax Swimmer, Hopper und Reacher mit dreischichtigen MLP-Strategien mit ungefähr 1.500 Parametern. Die innere Suche optimiert die Gewichte, die äußere die Parameter und Strategien des DE-Executors. Diese Simulationen belegen weder den Einsatz auf realen Robotern noch eine allgemeine Verbesserung der Trainingsstabilität.

![9.png](./metade-13.png "9.png")

Konvergenzkurven für drei Brax-Umgebungen

Wie in der Abbildung gezeigt, demonstriert MetaDE eine starke Leistung bei Brax-basierten Robotersteuerungsaufgaben und erzielt die besten Ergebnisse bei der Swimmer-Aufgabe sowie nahezu optimale Ergebnisse bei Hopper und Reacher. Sein Hauptvorteil liegt in der hohen Qualität der Anfangspopulation, die eine schnelle Konvergenz in der frühen Phase ermöglicht und qualitativ hochwertige Lösungen produziert. Diese Ergebnisse legen nahe, dass MetaDE **neuronale Netzwerk-Policies effizient optimieren** kann, was es **gut geeignet für Robotersteuerungsaufgaben mit komplexen physikalischen Simulationen** macht und **breites Potenzial für praktische Anwendungen bietet**.

## Fazit und zukünftige Richtungen

Erfassen Sie äußere Konfigurationsversuche und innere Zielfunktionsbewertungen. Vergleichen Sie anhand des Gesamtbudgets und der tatsächlich verstrichenen Zeit. [iStratDE: Populationsvielfalt als Prinzip paralleler Suche](/de/news/istratde)

## Ressourcen

- [Forschungsarbeit](https://arxiv.org/abs/2502.10470)
- [GitHub](https://github.com/EMI-Group/metade)
- [EvoX](https://github.com/EMI-Group/evox)
