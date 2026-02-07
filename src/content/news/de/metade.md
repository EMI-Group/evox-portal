---
title: "MetaDE: Differentielle Evolution durch Differentielle Evolution weiterentwickeln"
pubDate: 2025-02-15
summary: "MetaDE ist eine meta-evolutionaere Methode, die Differentielle Evolution nutzt, um ihre eigenen Hyperparameter und Strategien zu optimieren, veroeffentlicht in IEEE TEVC."
---

Differential Evolution (DE), einer der Kernalgorithmen der evolutionaeren Berechnung, wird aufgrund seiner Einfachheit und hohen Effizienz haeufig bei Black-Box-Optimierungsproblemen eingesetzt. Dennoch haengt seine Leistung stark von der Wahl der Hyperparameter und Strategien ab -- ein anhaltendes Problem fuer Forscher. Um diese Herausforderung zu bewaeltigen, hat das EvoX-Team kuerzlich eine Studie in den *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* mit dem Titel "MetaDE: Evolving Differential Evolution by Differential Evolution" veroeffentlicht. Als meta-evolutionaere Methode, die DE nutzt, um ihre eigenen Hyperparameter und Strategien weiterzuentwickeln, ermoeglicht MetaDE die dynamische Anpassung von Parametern und Strategien bei gleichzeitiger Einbindung GPU-beschleunigter paralleler Berechnung. Dieses Design verbessert die Recheneffizienz zusammen mit der Optimierungsleistung erheblich. Experimentelle Ergebnisse zeigen, dass MetaDE herausragende Leistung sowohl auf der CEC2022-Benchmark-Suite als auch bei Robotersteuerungsaufgaben erzielt. Der Quellcode fuer MetaDE ist als Open Source auf GitHub verfuegbar unter [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Hintergrund**

Im Bereich der evolutionaeren Berechnung wird die Leistung von Algorithmen oft erheblich durch die Wahl der Hyperparameter beeinflusst. Die Bestimmung der am besten geeigneten Parametereinstellungen fuer ein bestimmtes Problem ist eine langjaerige Forschungsherausforderung. Differential Evolution (DE) als klassischer evolutionaerer Algorithmus wird wegen seiner Einfachheit und robusten globalen Suchfaehigkeit weithin geschaetzt; dennoch ist seine Leistung hochempfindlich gegenueber der Hyperparameter-Auswahl. Konventionelle Methoden stuetzen sich typischerweise entweder auf erfahrungsbasiertes Tuning oder adaptive Mechanismen zur Leistungsverbesserung. Angesichts vielfaeltiger Problemszenarien haben diese Ansaetze jedoch haeufig Schwierigkeiten, Effizienz und breite Anwendbarkeit in Einklang zu bringen.

Das Konzept der "Meta-Evolution" wurde bereits im letzten Jahrhundert eingefuehrt, mit dem Ziel, evolutionaere Algorithmen selbst zur Optimierung der Hyperparameter-Konfigurationen dieser Algorithmen zu nutzen. Obwohl Meta-Evolution seit vielen Jahren existiert, war ihre praktische Anwendung durch den hohen Rechenaufwand eingeschraenkt. Juengste Fortschritte im GPU-Computing haben diese Einschraenkungen gelockert und bieten starke Hardware-Unterstuetzung fuer evolutionaere Algorithmen. Insbesondere die Einfuehrung des verteilten GPU-beschleunigten EvoX-Frameworks hat die Entwicklung GPU-basierter evolutionaerer Algorithmen erheblich erleichtert. Vor diesem Hintergrund hat unser Forschungsteam einen neuartigen Meta-Evolutionsansatz vorgeschlagen, der DE nutzt, um seine eigenen Hyperparameter und Strategien weiterzuentwickeln, und damit einen neuen Weg zur Loesung des langjaerigen Parameter-Tuning-Problems in evolutionaeren Algorithmen bietet.



**Was ist Meta-Evolution?**

Die Kernidee hinter Meta-Evolution laesst sich zusammenfassen als "**einen evolutionaeren Algorithmus nutzen, um sich selbst weiterzuentwickeln**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Dieses Konzept geht ueber traditionelle Methoden der evolutionaeren Berechnung hinaus, indem es nicht nur evolutionaere Algorithmen zur Suche nach optimalen Loesungen fuer ein Problem einsetzt, sondern auch die Hyperparameter und Strategien der Algorithmen durch ihre eigenen evolutionaeren Prozesse anpasst.

Mit anderen Worten fuehrt Meta-Evolution ein "**Selbstevolutions**"-Paradigma ein, das es Algorithmen ermoeglicht, sich selbst zu optimieren, waehrend sie den Suchraum nach Problemloesungen erkunden. Durch kontinuierliche Verfeinerung waehrend des evolutionaeren Prozesses werden Algorithmen anpassungsfaehiger und koennen in verschiedenen Problemszenarien hohe Effizienz beibehalten.

Am Beispiel von MetaDE basiert dessen Design auf dieser Philosophie. In einer zweischichtigen Struktur loest die untere Schicht (der "**Executor**") das gegebene Optimierungsproblem mit einem parametrisierten DE. Die obere Schicht (der "**Evolver**") setzt gleichzeitig DE ein, um die Hyperparameter-Konfigurationen des Executors zu optimieren. Dieses Framework laesst DE nicht nur als Loeser dienen, sondern auch "erkunden", wie seine eigenen Parameter und Strategien am besten angepasst werden koennen, um verschiedene Probleme effektiver zu loesen. Ein solcher Prozess gleicht einem System, das sich schrittweise selbst versteht und verfeinert -- eine Transformation von **"passivem Problemloesen" zu "aktiver Selbstevolution."** Folglich kann es sich besser an vielfaeltige Aufgaben anpassen. **Wenn wir DE als komplexes System betrachten, ermoeglicht MetaDE effektiv eine "rekursive" Art des Selbstverstaendnisses und der Selbstverbesserung innerhalb dieses Systems.**

Der Begriff "**Rekursion**" beschreibt in der Informatik typischerweise eine Funktion oder Prozedur, die sich selbst aufruft. Innerhalb von MetaDE erhaelt dieses Konzept eine neue Bedeutung: Es ist ein **intern rekursiver** Optimierungsmechanismus, der DE einsetzt, um DEs Hyperparameter weiterzuentwickeln. Dieses selbstreferenzielle Schema verkoerpert nicht nur starke Anpassungsfaehigkeit, sondern bietet auch eine neuartige Perspektive auf das "No Free Lunch"-Theorem. Da es keinen einzelnen, universell optimalen Satz von Parametern fuer alle Probleme gibt, ist es der Schluessel, den Algorithmus sich autonom weiterentwickeln zu lassen, um die besten Parameterkonfigurationen fuer eine gegebene Aufgabe zu finden.

Durch diesen rekursiven meta-evolutionaeren Ansatz erzielt MetaDE mehrere Vorteile:

**1. Automatisiertes Parameter-Tuning**

     Der arbeitsintensive manuelle Tuning-Prozess entfaellt. Der Algorithmus lernt selbst, wie er seine Hyperparameter anpassen kann, wodurch menschliches Eingreifen reduziert und die Effizienz verbessert wird.

**2. Verbesserte Anpassungsfaehigkeit**

     MetaDE reagiert dynamisch auf sich aendernde Problemeigenschaften und -bedingungen und passt Strategien in Echtzeit an, um die Leistung zu verbessern. Dies erhoeht die Flexibilitaet des Algorithmus erheblich.

**3. Effiziente Suche**
      Durch die Nutzung inhaerent paralleler Berechnung beschleunigt MetaDE die Suche bei grossskaligen Optimierungsproblemen erheblich. Es liefert machbare Loesungen fuer hochdimensionale, komplexe Probleme in angemessenen Zeitrahmen.

**Algorithmische Implementierung**

MetaDE setzt tensorbasierte Techniken und GPU-Beschleunigung ein, um effiziente parallele Berechnung zu ermoeglichen. Durch die gleichzeitige Verarbeitung vieler Individuen einer Population wird die Gesamtrecheneffizienz deutlich verbessert, was besonders bei einkriterieller Black-Box-Optimierung und grossskaligen Optimierungsproblemen vorteilhaft ist. Durch Tensorisierung von Schluesselparametern und Datenstrukturen (z.B. Population, Fitness, Strategieparameter) erreicht MetaDE nicht nur hoehere Recheneffizienz, sondern verbessert auch seine Faehigkeit, komplexe Optimierungsherausforderungen zu bewaeltigen. Im Vergleich zu klassischem DE und anderen evolutionaeren Algorithmen (EAs) zeigt MetaDE ueberlegene Leistung bei der Loesung grossskaliger Probleme. Dank des tensorbasierten Ansatzes nutzt MetaDE Rechenressourcen effektiver und liefert schnellere Loesungen und praezisere Optimierungsergebnisse als traditionelle Methoden.

![1.png](/images/articles/metade-4.png "1.png")

PDE-Architektur

Das Forschungsteam schlug zunaechst ein parametrisiertes DE-Algorithmus-Framework (PDE) vor, das Aenderungen von Parametern und Strategien vollstaendig unterstuetzt. In diesem Framework sind F und CR kontinuierliche Parameter, waehrend andere Parameter diskret sind. Die gestrichelten Kaesten zeigen den Bereich zulaessiger Parameterwerte an. Die Mutationsfunktion wird aus den linken und rechten Basisvektoren sowie dem Parameter zur Steuerung der Anzahl der Differenzvektoren abgeleitet.

![2.png](/images/articles/metade-5.png "2.png")

MetaDE-Architektur

MetaDE verwendet eine zweischichtige Struktur, bestehend aus **einem Evolver** (obere Schicht) und **mehreren Executors** (untere Schicht). Der Evolver ist ein DE (oder potenziell ein anderer evolutionaerer Algorithmus), der fuer die Optimierung der PDE-Parameter verantwortlich ist. Jedes Individuum![spacer.gif](/images/articles/metade-6.gif) x_i in der Population des Evolvers entspricht einer einzigartigen Parameterkonfiguration θ_i. Diese Konfigurationen werden an das PDE weitergegeben, um verschiedene DE-Varianten zu instanziieren, die jeweils von einem Executor verwaltet werden, der unabhaengig an der gegebenen Optimierungsaufgabe arbeitet. Jeder Executor gibt seinen besten Fitnesswert y^* an den Evolver zurueck, der diesen Fitnesswert y_i dem entsprechenden Individuum x_i zuweist.



**Experimentelle Leistung**

Um die Wirksamkeit von MetaDE umfassend zu bewerten, fuehrte das Forschungsteam systematische Experimente ueber mehrere Benchmark-Tests und reale Szenarien durch. Jedes Experiment verwendete einen Evolver (DE mit rand/1/bin-Strategie) und Executors (PDE mit einer Populationsgroesse von 100). Wichtige experimentelle Komponenten umfassen:

**CEC2022-Benchmark**
 Vergleich von MetaDE mit verschiedenen DE-Varianten bei einkriteriellen Optimierungsaufgaben.

**Vergleich mit den vier besten CEC2022-Algorithmen**
 Bewertung von MetaDE gegenueber den vier leistungsstaerksten Algorithmen des CEC2022-Wettbewerbs unter identischen Funktionsauswertungs-Budgets (FEs).

**Funktionsauswertungen (FEs) bei fester Rechenzeit**
 Analyse der Recheneffizienz von MetaDE unter GPU-Beschleunigung.

**Robotersteuerungsaufgaben**
 Anwendung von MetaDE auf Robotersteuerungsaufgaben in einer Brax-Plattformumgebung zur Validierung seiner praktischen Nuetzlichkeit.



**CEC2022-Benchmark: Vergleich mit gaengigen DE-Varianten**

Das Team verglich MetaDE mit mehreren repraesentativen DE-Varianten auf der CEC2022-Benchmark-Suite, darunter:

* **Standard DE (rand/1/bin)**
* **SaDE und JaDE (adaptive DE-Algorithmen)**
* **CoDE (DE mit Strategieintegration)**
* **SHADE und LSHADE-RSP (erfolgshistorienbasiertes adaptives DE)**
* **EDEV (integrierte DE-Varianten)**

Alle Algorithmen wurden auf der EvoX-Plattform implementiert und nutzten GPU-Beschleunigung mit einer Populationsgroesse von 100 fuer Fairness. Experimente wurden bei verschiedenen Dimensionalitaeten (10D und 20D) unter **derselben Rechenzeitbeschraenkung (60 Sekunden)** durchgefuehrt.

![3.png](/images/articles/metade-7.png "3.png")

10D CEC2022-Optimierungsergebnisse

![4.png](/images/articles/metade-8.png "4.png")

20D CEC2022-Optimierungsergebnisse

MetaDE erzielt im Allgemeinen eine schnellere und stabilere Konvergenz bei den meisten Testfunktionen. Sein parametrisiertes DE (PDE) in Kombination mit der Optimierung auf oberer Ebene ermoeglicht eine dynamische Anpassung an verschiedene Problemraeume und verbessert die Gesamtrobustheit und Suchleistung.



**Vergleich mit den vier besten CEC2022-Algorithmen (bei identischen FEs)**

Um die Optimierungsfaehigkeit von MetaDE weiter zu bewerten, verglichen wir es mit den vier besten Algorithmen des CEC2022-Wettbewerbs innerhalb **desselben Funktionsauswertungs-Budgets**:

* **EA4eig**: Eine Hybridmethode, die mehrere EAs integriert
* **NL-SHADE-LBC**: Ein verbessertes adaptives DE
* **NL-SHADE-RSP-MID**: Ein erweitertes SHADE mit Mittelpunktschaetzung
* **S-LSHADE-DP**: Eine DE-Variante, die Populationsdiversitaet durch dynamische Stoerung aufrechterhaelt

Jeder dieser Algorithmen wurde mit seinen offiziellen Parametereinstellungen und Quellcode unter **denselben FE-Beschraenkungen** ausgefuehrt. Statistische Vergleiche (Wilcoxon-Rangsummentest, Signifikanzniveau 0,05)

wurden zwischen MetaDE und jeder Baseline auf der CEC2022-Testsuite durchgefuehrt. Die letzte Zeile der Tabelle zeigt die Leistung jedes Algorithmus im Vergleich zu MetaDE bei den verschiedenen Testfunktionen: + (signifikant besser), ≈ (kein signifikanter Unterschied) und − (signifikant schlechter).

![5.png](/images/articles/metade-9.png "5.png")

Vergleich der 10D CEC2022-Wettbewerbsalgorithmen (gleiche FEs)

![6.png](/images/articles/metade-10.png "6.png")

Vergleich der 20D CEC2022-Wettbewerbsalgorithmen (gleiche FEs)

MetaDE zeigt durchgehend starke Leistung, insbesondere bei komplexen Problemen, die robuste Konvergenz erfordern. Dank seines **selbstadaptiven Mechanismus** passt MetaDE seine Strategie effektiv an verschiedene Suchlandschaften an und verbessert dadurch die Sucheffizienz und globale Optimierungsfaehigkeit. Diese Ergebnisse zeigen, dass MetaDE nicht nur gaengige DE-Varianten uebertrifft, sondern auch starke Wettbewerbsfaehigkeit gegenueber Spitzenalgorithmen aus Wettbewerben aufweist.



**Recheneffizienz: FEs innerhalb einer festen Zeit (60 Sekunden)**

Das Forschungsteam zeichnete weiterhin **die Anzahl der Funktionsauswertungen (FEs) auf, die verschiedene Algorithmen innerhalb derselben festen Laufzeit (60 Sekunden) abschlossen**.

![图片2.png](/images/articles/metade-11.png)

           Von jedem Algorithmus in 60 Sekunden erreichte FEs

Unter demselben EvoX-Framework mit GPU-beschleunigter paralleler Berechnung erreichte MetaDE im Durchschnitt FEs auf **10****⁹**-Niveau, waehrend traditionelle DE-Varianten nur etwa ***10^6*** FEs erreichten. Dieser Vorteil ergibt sich aus MetaDEs parametrisiertem Ansatz, der **grossskalige parallele Auswertungen** von Individuen durchfuehrt und so eine **effizientere Nutzung der Hardware-Ressourcen** ermoeglicht. Folglich erkundet der Algorithmus mehr Loesungen im selben Zeitfenster und verbessert sowohl die Loesungsqualitaet als auch die Stabilitaet.



**Evolutionaeres Reinforcement Learning: Robotersteuerungsaufgaben**

Im Reinforcement Learning (RL) sind die Effizienz und Stabilitaet der Policy-Optimierung entscheidend. Gradientenbasierte Methoden wie PPO und SAC koennen in hochdimensionalen Umgebungen unter Gradientenverschwinden oder -explosion leiden. Im Gegensatz dazu umgeht Evolutionary Reinforcement Learning (EvoRL) diese Probleme durch **gradientenfreie Suche** zur direkten Optimierung von Policy-Parametern.

![8.png](/images/articles/metade-12.png "8.png")

Prozess des evolutionaeren Reinforcement Learning

Innerhalb des EvoRL-Frameworks:

* MetaDE **optimiert automatisch neuronale Netzwerkparameter** und erhoeht die Anpassungsfaehigkeit von Policy-Modellen.
* MetaDE **passt Hyperparameter dynamisch an** und verbessert die Trainingsstabilitaet.
* MetaDE **nutzt GPU-Beschleunigung**, um die Policy-Optimierung zu beschleunigen.

Um die Leistung von MetaDE bei komplexen Optimierungsaufgaben zu bewerten, wendeten wir es auf **Robotersteuerungsprobleme** mit GPU-beschleunigter Optimierung in der **Brax-Simulationsplattform** an. Die Studie umfasste drei Aufgaben -- **Swimmer**, **Hopper** und **Reacher** -- die jeweils durch ein dreischichtiges vollstaendig verbundenes neuronales Netzwerk (MLP) modelliert wurden, mit dem Ziel der **Maximierung der Belohnung**. Bemerkenswert ist, dass jedes MLP etwa **1.500 Parameter** enthaelt, was eine **1.500-dimensionale Optimierungsherausforderung** fuer evolutionaere Algorithmen (EAs) darstellt. Dies stellt strenge Anforderungen sowohl an die Suchfaehigkeit als auch an die Recheneffizienz.

![9.png](/images/articles/metade-13.png "9.png")

Konvergenzkurven fuer drei Brax-Umgebungen

Wie in der Abbildung gezeigt, demonstriert MetaDE starke Leistung bei Brax-basierten Robotersteuerungsaufgaben und erzielt die besten Ergebnisse bei der Swimmer-Aufgabe sowie nahezu optimale Ergebnisse bei Hopper und Reacher. Sein Hauptvorteil liegt in der hohen Qualitaet der Anfangspopulation, die eine schnelle fruehe Konvergenz und hochwertige Loesungen ermoeglicht. Diese Ergebnisse deuten darauf hin, dass MetaDE **neuronale Netzwerk-Policies effizient optimieren** kann, was es **gut geeignet fuer Robotersteuerungsaufgaben mit komplexen physikalischen Simulationen** macht und **breites Potenzial fuer praktische Anwendungen bietet**.



**Fazit und zukuenftige Richtungen**

MetaDE ist ein innovativer Meta-Evolutionsansatz, der nicht nur bei der Loesung von Optimierungsaufgaben hervorragend abschneidet, sondern auch seine eigenen Strategien autonom abstimmt und verfeinert. Unter Nutzung der Staerken von Differential Evolution zeigt MetaDE starkes Potenzial bei der adaptiven Parameterkonfiguration und Strategieevolution. Experimentelle Ergebnisse zeigen ueberlegene Robustheit in einer Reihe von Benchmark-Tests, und seine praktische Anwendbarkeit wird durch den Erfolg bei Robotersteuerungsaufgaben mittels evolutionaeren Reinforcement Learnings unterstrichen. Eine zentrale Herausforderung besteht darin, ein optimales Gleichgewicht zwischen Generalisierung und Spezialisierung aufrechtzuerhalten -- sicherzustellen, dass der Algorithmus sich an vielfaeltige Aufgaben anpassen und gleichzeitig fuer spezifische Probleme effektiv optimieren kann. Diese Forschung bietet neue Perspektiven fuer selbstadaptive evolutionaere Algorithmen und koennte weitere Fortschritte in der Meta-Evolution fuer komplexe Systeme anstossen.



**Open-Source-Code und Community**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Upstream-Projekt (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ-Gruppe**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

  QQ-Gruppe | Evolving Machine Intelligence

MetaDE basiert auf dem EvoX-Framework. Wenn Sie an EvoX interessiert sind, lesen Sie bitte den Artikel ueber EvoX 1.0 fuer weitere Details.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")
