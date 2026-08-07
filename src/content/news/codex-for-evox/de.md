---
title: "Codex für EvoX: Algorithmen entwerfen, Code migrieren und reproduzierbare Experimente durch Konversation durchführen"
pubDate: 2026-08-08
summary: "Evolutionäre Berechnung tritt in die KI-native Ära ein. Mit Codex als repräsentativem KI-Coding-Agenten wandelt EvoX Absichten in natürlicher Sprache in ausführbare Workflows der evolutionären Berechnung um — einschließlich Problemmodellierung, Algorithmusmigration, neuroevolution ohne Backpropagation und GPU-Tensorisierung."
---

# Codex für EvoX: Algorithmen entwerfen, Code migrieren und reproduzierbare Experimente durch Konversation durchführen

Evolutionäre Berechnung tritt in die KI-native Ära ein.

[EvoX](https://github.com/EMI-Group/evox) ist ein verteiltes, GPU-beschleunigtes Framework für skalierbare evolutionäre Berechnung. Über seine einheitlichen `Algorithm`-, `Problem`- und `Workflow`-Schnittstellen bringt EvoX Populationsuche, Batch-Auswertung, Experimentausführung und Hardwarebeschleunigung in eine kohärente Rechenarchitektur zusammen. Es unterstützt Anwendungen von Ein- und Mehrziel-Optimierung über Neuroevolution und Reinforcement-Learning-Umgebungen bis hin zum Entwurf komplexer Systeme.

Seit seiner Open-Source-Veröffentlichung hat sich EvoX um eine klare Mission weiterentwickelt:

> **Infrastruktur der nächsten Generation für evolutionäre Berechnung aufzubauen, speziell entwickelt für moderne Hardware und groß angelegte Berechnung.**

## Prolog: Natürliche Sprache wird zu einem neuen Einstiegspunkt für EvoX

Jahre Open-Source-Entwicklung haben die Schnittstellen, Dokumentation, Beispiele und das Programmiermodell von EvoX öffentlich, strukturiert und ausführbar gemacht. Allzweck-KI-Coding-Agenten mit Zugang zu diesen Ressourcen und einer ausführbaren Entwicklungsumgebung können das Framework verstehen und bei der Umgebungseinrichtung, Problemmodellierung, Algorithmusentwicklung, Codemigration, Batch-Experimentierung und Leistungsoptimierung unterstützen.

Das ist in diesem Artikel mit **nativer Unterstützung** gemeint: Codex benötigt kein dediziertes EvoX-Plugin, um mit dem Framework zu arbeiten. Es kann die öffentliche Dokumentation, den Quellcode und den Projektkontext von EvoX direkt nutzen.

Früher mussten Forscher meist zuerst ein Framework erlernen und dann ihre Probleme in Code übersetzen, den das Framework verstehen konnte. Dieser Prozess kann nun in umgekehrter Richtung beginnen. In den folgenden Beispielen — von natürlichsprachiger Modellierung und Algorithmusmigration über steuerungsfreie Regelung bis hin zur GPU-Tensorisierung — übersetzt Codex menschliche Absichten in Implementierungen, während EvoX eine einheitliche Grundlage für Algorithmen, Experimente und parallele Berechnung bietet.

**Menschen definieren das Problem, Codex organisiert die Implementierung und EvoX führt den evolutionären Prozess aus.**

## Ausgangspunkt: Von der Framework-Installation bis zur direkten Problembeschreibung

### 1. Mit einem Satz in EvoX einsteigen

Beginnen Sie mit der einfachsten Anweisung:

> **Richten Sie EvoX für mich ein.**

![Codex installiert und verifiziert EvoX](./codex-for-evox-1.png)

Codex kann die bestehende Python-, PyTorch- und GPU-Umgebung prüfen, eine geeignete Installationsmethode auswählen und eine grundlegende Verifizierung durchführen. Dies reduziert erheblich das frameworkspezifische Wissen und die manuelle Umgebungskonfiguration, die erforderlich sind, bevor sich Nutzer auf das Problem konzentrieren können, das sie tatsächlich lösen möchten.

### 2. Von vagen Anforderungen zu einer vollständigen Aufgabe der evolutionären Berechnung

Echte Probleme kommen selten mit vordefinierten Entscheidungsvariablen, Zielfunktionen und Nebenbedingungen. Meistens wissen wir nur, was wir haben und welches Ergebnis wir uns wünschen:

> **Verwenden Sie EvoX, um einen Algorithmus zu schreiben, der das folgende Problem löst: Ein Lagerhaus-Roboter bewegt sich vom Eingang zum Ausgang und muss Regale auf dem Weg vermeiden. Erstellen Sie ein festes, reproduzierbares Lagerhaus-Layout; finden Sie eine möglichst kurze, kollisionsfreie und glatte Route; führen Sie das Experiment aus; und visualisieren Sie den Optimierungsprozess.**

![Natürlichsprachige Anfrage zur Routenplanung für Lagerhaus-Roboter](./codex-for-evox-2.png)

Es wird kein mathematisches Modell oder ein bestimmter Algorithmus geliefert. Codex erstellt das Lagerhaus-Layout, übersetzt „kurz, kollisionsfrei und glatt" in Ziele und Nebenbedingungen und implementiert die Routenkodierung und das Experiment.

![Lagerhaus-Layout, optimierte Route und evolutionärer Fortschritt](./codex-for-evox-3.png)

EvoX stellt während des gesamten Prozesses das Ausführungsgerüst bereit:

- Kandidatenrouten werden als Population dargestellt.
- Zielfunktionen werden über die `Problem`-Schnittstelle in Batches ausgewertet.
- NSGA-II führt die iterative Suche durch.
- `Workflow` verbindet den Algorithmus, das Problem und den Überwachungsprozess.

Das Ergebnis ist eine reproduzierbare, messbare und visualisierte kollisionsfreie Route. Doch die Übersetzung einer Absicht in ein ausführbares EvoX-Experiment ist nur der Anfang; Forschungsszenarien erfordern strukturiertere Experimente.

## Tiefergehend: Von der Codegenerierung zur reproduzierbaren experimentellen Forschung

### 3. Von einem einzelnen Durchlauf zu einem reproduzierbaren Algorithmusvergleich

Ein einzelner erfolgreicher Durchlauf zeigt nur, dass eine Implementierung nicht sofort gescheitert ist. Ein glaubwürdiger Vergleich erfordert ein gemeinsames Auswertungsbudget, unabhängige Durchläufe, Konvergenzaufzeichnungen, Standardmetriken, statistische Tests und explizite Grenzen für die Schlussfolgerungen:

> **Verwenden Sie EvoX, um ein Mehrziel-Algorithmusvergleichsexperiment mit einem einheitlichen Budget und 30 unabhängigen Durchläufen durchzuführen, das NSGA-II, MOEA/D, HypE, AGE-MOEA und Zufallssuche vergleicht. Befolgen Sie gängige IEEE TEVC-Experimentpraktiken für HV/IGD+, Effektgrößen und nichtparametrische statistische Analysen, und erstellen Sie einen Visualisierungsbericht mit Konvergenzkurven, Pareto-Fronten und klar formulierten Einschränkungen.**

![Natürlichsprachige Anfrage und Codex-Zusammenfassung für den Mehrziel-Vergleich](./codex-for-evox-4.png)

Codex organisiert das Protokoll, während vier EvoX-basierte evolutionäre Algorithmen — NSGA-II, MOEA/D, HypE und der lokale AGE-MOEA-Port — unter derselben Problemschnittstelle, Populationsgröße, Auswertungsbudget und Überwachungsprotokoll ausgewertet werden. Eine unabhängige Zufallssuche-Baseline wird für den Kontext einbezogen. Metriken, Konvergenzverläufe, endgültige Lösungsmengen und statistische Analysen werden innerhalb derselben Experimentstruktur aufgezeichnet.

![EvoX-Mehrziel-Benchmark über 30 unabhängige Durchläufe](./codex-for-evox-5.png)

Die oberen Panel zeigen die Hypervolumenkonvergenz. Unter dem festen 3,000-evaluation-Budget erzielen alle Algorithmen beim schwierigeren ZDT4-Problem immer noch ein HV von null. Die unteren Panel bieten daher eine zusätzliche Sicht darauf, wie die zusammengefassten endgültigen nichtdominierten Lösungen zur Referenz-Pareto-Front in Beziehung stehen.

KI-generierte Experimente erfordern weiterhin menschliche Überprüfung und Verifizierung. Dennoch zeigt dieses Beispiel, wie eine kontinuierliche Konversation EvoX nutzen kann, um einen einzelnen Durchlauf in eine vergleichbare und reproduzierbare algorithmische Studie zu verwandeln.

### 4. Vom Verstehen bestehenden Code zur Wiederverwendung von Forschungsressourcen

Forschung beginnt nicht immer von Grund auf neu. Viele wertvolle Algorithmen existieren weiterhin in MATLAB, NumPy und älteren Repositories. Ihre Überführung in EvoX erfordert das Verständnis, wie die ursprüngliche Implementierung Zustand, Populationsaktualisierungen, Operatoren, Auswertungen und die Experimentschleife organisiert. Codex kann helfen, wenn die relevanten Quelldateien bereitgestellt werden:

> **Lesen Sie die Einstiegsdatei und die zugehörigen Hilfsfunktionen in diesem Verzeichnis, erklären Sie den algorithmischen Ablauf, migrieren Sie ihn in eine EvoX-Implementierung und validieren Sie ihn experimentell an standardmäßigen Mehrziel-Benchmark-Problemen.**

![Codex-Erklärung und Migration von PlatEMO AGE-MOEA](./codex-for-evox-6.png)

Codex reimplementiert Extrempunkterkennung, Zielnormierung, Pareto-Front-Geometrieschätzung und Survival-Scoring und organisiert dann Populationszustand, Fitness-Auswertung, Paarung und Umweltauswahl gemäß den EvoX-Schnittstellen. Der migrierte AGE-MOEA verwendet EvoX-Crossover-, Mutations- und Selektionsoperatoren, verbindet sich mit den Standard-`Problem`- und `Workflow`-Schnittstellen und teilt die Ausführungs- und Überwachungsstruktur der Plattform.

![AGE-MOEA-Validierung auf ZDT1 und ZDT4](./codex-for-evox-7.png)

Die Standard-Benchmark-Validierung zeigt, dass die migrierte Implementierung in EvoX korrekt läuft und sich den Referenz-Pareto-Fronten nähert. Ein Algorithmus, der zuvor von MATLAB abhing, ist somit zu einer EvoX-Implementierung geworden, die innerhalb des PyTorch-Ökosystems reproduziert, verglichen und erweitert werden kann — mit einem klaren Weg zu weiterer Tensorisierung und Hardwarebeschleunigung.

Diese Beispiele zeigen, dass Codex Nutzern helfen kann, EvoX zu bedienen, standardisierte Experimente zu organisieren und bestehende Forschungsressourcen in das Framework zu überführen. Die möglichen Objekte der Evolution gehen jedoch weit über herkömmliche Optimierungsvektoren hinaus.

## Darüber hinaus: Erweiterung evolvierbarer Objekte und Rechnergrenzen

### 5. Was Sie entwickeln, ist Ihnen überlassen

Das hierarchische, modulare Design von EvoX ermöglicht es, Aufgaben, die dem Muster „Kandidatenlösungen → Batch-Auswertung → iterative Aktualisierung" folgen, in einen evolutionären Workflow zu integrieren. Das evolvierte Objekt kann ein numerischer Vektor, eine Route, ein neuronales Netz, eine Steuerungsrichtlinie oder ein durch vielfältige Verhaltensweisen gekennzeichneter Entwurfsraum sein.

Betrachten Sie eine klassische Steuerungsaufgabe, die durch Neuroevolution gelöst wird:

> **Verwenden Sie EvoX, um einen kleinen neuronalen Netz-Controller ohne Backpropagation zu entwickeln, der ein invertiertes Pendel ausbalancieren kann. Vervollständigen Sie eine minimale ausführbare Implementierung und geben Sie die Trainingskurve und die finale Steuerungsanimation aus.**

![Codex-Zusammenfassung des EvoX-CartPole-Experiments](./codex-for-evox-8.png)

Codex erstellt die CartPole-Umgebung und ein kleines Netz mit nur 49 Parametern. EvoX verwendet OpenES, um die Population von Kandidatennetzwerken zu generieren und zu aktualisieren, lässt jeden Controller in der Umgebung agieren und wertet ihn danach aus, wie lange das Pendel balanciert bleibt. Der Trainingsprozess berechnet keine Gradienten und ruft keine Backpropagation auf.

![CartPole-Trainingskurve](./codex-for-evox-9.svg)

![Finaler evolutionierter CartPole-Controller](./codex-for-evox-10.gif)

In diesem Experiment steigt das durchschnittliche Überleben von etwa 12.5 steps auf das konfigurierte Limit von 400 steps. Dies zeigt, dass EvoX Modellparameter, Steuerungsrichtlinien und externe Umgebungen in einen evolutionären Workflow integrieren kann, anstatt auf herkömmliche numerische Testfunktionen beschränkt zu sein.

Dieselbe Schnittstelle kann auch Qualitäts-Diversitäts-Aufgaben wie prozedurale Labyrinthgenerierung unterstützen:

> **Verwenden Sie EvoX und MAP-Elites, um automatisch eine vielfältige Menge lösbarer Labyrinthe zu generieren, kartieren Sie die Diversitätslandschaft nach Routenwindung und Verzweigungsreichtum, und vergleichen Sie die Ergebnisse mit zufälliger Generierung unter demselben Budget.**

![Natürlichsprachige Anfrage und Codex-Zusammenfassung für MAP-Elites-Labyrinthgenerierung](./codex-for-evox-11.png)

Codex entwirft die Aufgabe, während EvoX die wiederholte Generierung, Auswertung und Selektion von Kandidatenebenen übernimmt. MAP-Elites behält Repräsentanten unterschiedlicher Stile gemäß Routenwindung und Verzweigungsreichtum bei.

![MAP-Elites-Galerie vielfältiger lösbarer Labyrinthe](./codex-for-evox-12.png)

Bei einem festen Budget von 5,000 Kandidatenlabyrinthen besetzte MAP-Elites 22 von 36 vordefinierten Nischen, gegenüber 24 bei zufälliger Generierung; beide Methoden erreichten 100% Lösbarkeit, da der Decoder lösbare Labyrinthe garantiert. Dieses kleine Experiment begründet keinen universellen Abdeckungsvorteil. Es zeigt stattdessen, wie EvoX ein strukturiertes Archiv hochwertiger Repräsentanten über explizit definierte Verhaltensnischen hinweg aufrechterhalten kann.

### 6. Rechenbeschleunigung: Arbeit um die GPU herum neu organisieren

Die vorherigen Fälle konzentrieren sich auf das Verstehen von Problemen, das Generieren von Code und das Organisieren von Experimenten. Dieser letzte Fall dringt in die Berechnung selbst ein. Als der Auswerter für das invertierte Pendel erstmals auf die GPU verschoben wurde, lief er langsamer als die CPU-Version. Das Netz war winzig und jeder Simulationsschritt startete viele kleine Operationen, sodass Kernel-Start- und Python-Planungs-Overhead die Arithmetik überwogen.

Die Folgeanfrage war direkt:

> **Das aktuelle invertierte Pendel-Experiment läuft auf der GPU langsamer als auf der CPU. Analysieren Sie den Leistungsengpass; tensorisieren Sie Populationsauswertung, Controller-Inferenz und Umgebungssimulation auf der GPU; vergleichen Sie die CPU- und GPU-Leistung vor und nach der Optimierung; und visualisieren Sie die Ergebnisse.**

![Natürlichsprachige Anfrage und Codex-Leistungsanalyse](./codex-for-evox-13.png)

Codex verwendet EvoX und PyTorch, um den Auswerter neu zu organisieren. Controller, Episoden und Umgebungszustände bleiben in Batch-Tensoren, während Batch-Matrixoperationen und CUDA Graph-Replay fragmentierte GPU-Starts reduzieren. Die Zeit für eine Populationsauswertung sinkt von **427.47 ms** mit der ursprünglichen GPU-Implementierung auf **22.10 ms** mit CUDA Graph-Replay: eine Beschleunigung von etwa **19.34×** gegenüber der ursprünglichen GPU-Implementierung, bei identischen Auswertungsergebnissen.

![CPU-, eifrig-GPU-, tensorisierte-GPU- und CUDA-Graph-Leistung](./codex-for-evox-14.png)

Diese Arbeitslast enthält nur 32 Controller und ein 49-Parameter-Netz, sodass sich die gemessenen Verhältnisse nicht auf jede Aufgabe verallgemeinern lassen. Dennoch validiert sie eine wichtige Fähigkeit von EvoX: Kandidaten in Populationen zu organisieren, sie in Batches auszuwerten und den Workflow auf GPUs und größere Arbeitslasten auszuweiten. **Zusammen können KI-gestützte Implementierung und EvoX die evolutionäre Berechnung um moderne Hardware herum neu organisieren.**

## Von einem Satz zu einem skalierbaren Workflow der evolutionären Berechnung

EvoX bietet mehr als eine isolierte Liste von Algorithmen. Es bietet ein erweiterbares Ökosystem der evolutionären Berechnung:

- `Problem` bringt Aufgaben aus der realen Welt, Simulatoren und Modellauswertungen in die evolutionäre Berechnung.
- Die `Algorithm`- und Operator-Schnittstellen unterstützen sowohl bestehende Algorithmen als auch benutzerdefinierte Entwicklung.
- `Workflow` verbindet Populationen, Probleme, Monitore und Experimente.
- PyTorch ermöglicht es, Populationsberechnung zu tensorisieren und auf moderne Hardware zu verschieben.
- Einheitliche Schnittstellen erlauben es, dass ein einzelner Optimierungslauf zu Batch-Experimenten, Algorithmusvergleichen und Neuroevolution-Workflows heranwächst.

Früher mussten Forscher ständig zwischen Problembeschreibungen, mathematischen Modellen, Framework-APIs, Algorithmuscode, Experimentskripten, statistischen Werkzeugen und GPU-Optimierung wechseln. Nun kann der Prozess mit natürlicher Sprache beginnen und schrittweise innerhalb derselben Konversation zu einem vollständigen, ausführbaren und reproduzierbaren Berechnungsworkflow werden.

**Menschen definieren die Ziele, KI organisiert die Implementierung und EvoX führt die Evolution aus.**

Beginnen Sie mit einem Satz und erkunden Sie Ihren eigenen evolutionären Raum.

---

**Hinweis 1:** Dieser Artikel verwendet Codex als repräsentativen KI-Coding-Agenten. Andere Agenten, die Code lesen, generieren, ausführen und debuggen können, können EvoX auf ähnliche Weise nutzen. Die Ergebnisse hängen vom Modell, Kontext, der Laufzeitumgebung und den Werkzeugberechtigungen ab.

**Hinweis 2:** Die Demonstrationen wurden mit dem GPT-5.5 Terra-Modell unter Verwendung von medium intelligence, medium reasoning effort und standard speed ausgeführt.

**Hinweis 3:** Die experimentellen Ergebnisse gelten nur für die hier beschriebenen Aufgaben, Umgebungen, Implementierungen, Budgets und Hardware. Sie stellen keine allgemeinen Leistungs- oder Beschleunigungsgarantien dar.
