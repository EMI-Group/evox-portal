---
title: "AutoPSO: GPU-Rechenleistung × Meta-Evolution → Vollautomatische Partikelschwarmoptimierung"
pubDate: 2026-08-25
summary: "Das vom EvoX-Team vorgeschlagene AutoPSO, veröffentlicht in IEEE TEVC, kodiert die Parameterkonfiguration, die Lernmechanismen und die Schwarmstruktur von PSO einheitlich in einen durchsuchbaren evolutionären Raum und sucht per Meta-Evolution automatisch die optimale PSO-Variante für ein bestimmtes Zielproblem."
---

![](./autopso-hero.png)

Die Entwicklung der Partikelschwarmoptimierung (PSO) war im Kern eine Geschichte kontinuierlichen „manuellen Designs“. In den vergangenen Jahrzehnten haben Forschende eine Vielzahl von Verbesserungen zu Trägheitsgewichten, Lernstrategien, Schwarmtopologien, Subpopulationsstrukturen und weiteren Komponenten vorgeschlagen und so einen umfangreichen Designraum um PSO herum geschaffen. Doch je größer der Raum, desto schwieriger die Wahl. Bei einer konkreten Optimierungsaufgabe — welche Parameter gewählt, welche Lernmechanismen verwendet und wie der Partikelschwarm organisiert werden soll — bleiben diese stark gekoppelten Designentscheidungen bis heute in hohem Maße von der Expertise der Forschenden und Trial-and-Error-Experimenten abhängig. PSO ist immer reicher geworden, aber es wurde auch zunehmend schwieriger, „richtig zu wählen“. Was wäre, wenn auch der Akt der „PSO-Wahl“ selbst der algorithmischen Evolution übertragen würde?

Das vom EvoX-Team vorgeschlagene **AutoPSO**-Framework kodiert die Parameterkonfiguration, die Lernmechanismen und die Schwarmstruktur von PSO einheitlich in einen durchsuchbaren evolutionären Raum und sucht durch **Meta-Evolution** automatisch die optimale PSO-Variante für ein bestimmtes Zielproblem. Dieses Framework optimiert nicht nur die Lösung des Problems, sondern auf einer höheren Ebene auch automatisch, „mit welchem PSO gelöst werden soll“.

Die groß angelegte Suche der Meta-Evolution beruht auf massiv parallelen Auswertungen, und EvoX' tensorisierte Berechnung, Stapelverarbeitung und GPU-Parallelität lösen genau diesen Engpass — Tausende von Kandidatenvarianten können gleichzeitig evolvieren, wodurch Meta-Level-Suchen, die auf CPUs zuvor undurchführbar waren, praktisch machbar werden.

**GPU-Rechenleistung × Meta-Evolution bringt PSO vom „manuellen Design“ zur „automatischen Erzeugung“.**

## PSO mangelt es nicht an Methoden; ihm fehlt die Fähigkeit, sie automatisch zu kombinieren

In den vergangenen Jahrzehnten hat die PSO-Forschung einen reichen Fundus an Mechanismusoptionen angehäuft: wie sich Parameter über die Iterationen ändern, von welchen Individuen die Partikel lernen, ob der Schwarm in Untergruppen aufgeteilt wird und welche Aktualisierungsstrategien die verschiedenen Untergruppen einsetzen.

Das Problem ist kein Mangel an Mechanismen, sondern dass die meisten davon als problemspezifische, eigenständige Algorithmen existieren. Bei einer neuen Aufgabe müssen Forschende weiterhin manuell aus einem großen Pool von Mechanismen auswählen, kombinieren und verifizieren — und anschließend neu justieren.

Die Philosophie von AutoPSO ist es nicht, dieses angehäufte Wissen wegzuwerfen, sondern es zu einem wiederverwendbaren Komponentenraum umzuorganisieren. AutoPSO zerlegt die wichtigsten Designaspekte von PSO in mehrere Module:

- wie Parameter evolvieren;

- von welchen Vorbildern die Partikel lernen;

- wie der Schwarm in Untergruppen partitioniert wird;

- welche Aktualisierungsstrategien die verschiedenen Untergruppen einsetzen.

In traditionellen Ansätzen werden diese Entscheidungen hauptsächlich von Menschen getroffen; in AutoPSO werden sie zu durchsuchbaren Objekten für den Algorithmus. Mit anderen Worten: Bei AutoPSO geht es nicht darum, „ein PSO manuell neu zu erfinden“, sondern darum, ein Meta-Framework zu konstruieren, das vor der Lösung des aktuellen Problems automatisch eine geeignete PSO-Variante dafür konfigurieren kann.

![](./autopso-1.gif)

*Abbildung 1: AutoPSO organisiert die zentralen Designelemente von PSO in komponierbare und durchsuchbare Module.*

## Die Optimierung der äußeren Ebene, traditionell von Forschenden durchgeführt, dem Algorithmus selbst übertragen

Konventionelle Optimierungsforschung besaß stets eine Zwei-Ebenen-Struktur. Auf der inneren Ebene wird PSO zur Lösung des Zielproblems eingesetzt — seien es Funktionsoptimierung, Ingenieursdesign oder Steuerungspolitiken. Auf der äußeren Ebene existiert eine weniger explizite Optimierung: Die Forschenden optimieren den Algorithmus selbst.

Welche Aktualisierungsregeln gewählt, wie Parameter eingestellt, welche Lernvorbilder übernommen werden, ob Subgruppenmechanismen eingeführt werden, welche Mechanismen kombinierbar sind und welche Kombinationen instabil sind — diese Entscheidungen wurden typischerweise von Forschenden auf Basis von Erfahrung getroffen und durch Trial-and-Error-Experimente verfeinert.

Der entscheidende Wandel, den AutoPSO bringt, besteht darin, diesen zuvor manuell von Forschenden durchgeführten Prozess der äußeren Ebene an den Algorithmus zu übertragen. Ein Partikel der äußeren Ebene repräsentiert nicht mehr eine Kandidatenlösung des Zielproblems, sondern ein PSO-Kandidatendesign, das Parameter, Lernvorbilder, Subgruppenaufteilung und Aktualisierungsstrategien kodiert. Das PSO der inneren Ebene löst mit diesen Konfigurationen das Zielproblem und gibt seine Leistung als Rückmeldung an die äußere Ebene, die daraufhin weiter nach besseren Algorithmuskonfigurationen sucht.

**AutoPSO optimiert nicht nur die Lösung des Problems, sondern auch, „mit welchem PSO es gelöst werden soll“.**

Es verwandelt den Algorithmus-Designprozess, der früher von der Expertise der Forschenden abhing, in einen internen evolutionären Prozess innerhalb des Systems, der automatisch durchsucht, bewertet und iteriert werden kann.

![](./autopso-2.png)

*Abbildung 2: Die äußere Ebene sucht nach Algorithmuskonfigurationen, während die innere Ebene die gewählte Konfiguration zur Lösung des Zielproblems einsetzt.*

## EvoX und GPU: Automatisches Algorithmusdesign wirklich machbar machen

Ein automatisches Suchframework für Algorithmusstrukturen vorzuschlagen ist nicht besonders schwer — die eigentliche Herausforderung liegt in den Rechenkosten. Die Bewertung eines PSO-Kandidatendesigns erfordert, es über einen vollständigen Lösungsprozess des Zielproblems laufen zu lassen. Je mehr Kandidatendesigns, desto größer die Rechenlast der inneren Ebene.

In traditionellen CPU-basierten seriellen Umgebungen sind solche Kosten unerschwinglich. Diese Art von Berechnung ist jedoch von Natur aus parallelisierbar: Kandidatenalgorithmen können gleichzeitig ausgewertet werden, und innerhalb jedes Kandidatenalgorithmus können auch die Partikelaktualisierungen im Stapel verarbeitet werden. AutoPSO nutzt EvoX, um die Populationsstruktur der evolutionären Berechnung auf die Stapelverarbeitungsfähigkeit von GPUs abzubilden, sodass die Konfigurationssuche der äußeren Ebene und die Problemlösung der inneren Ebene gleichzeitig ablaufen können.

Die GPU-Beschleunigung verkürzt hier nicht nur die Laufzeit einer einzelnen Ausführung; wichtiger noch erhöht sie erheblich die Anzahl der Kandidatendesigns, die innerhalb eines gegebenen Zeitraums verglichen werden können. Meta-Evolution ist im Wesentlichen eine Suche über den Algorithmenraum, und die Qualität dieser Suche hängt direkt davon ab, **wie viele PSO-Kandidatendesigns ausgewertet wurden**. Je gründlicher sie ausgewertet werden, desto höher die Chance, eine Konfiguration zu finden, die gut zum aktuellen Problem passt.

Der Wert von EvoX liegt genau in dieser Fähigkeit: Es organisiert die Partikelaktualisierungen und Fitness-Auswertungen der inneren Ebene sowie den Vergleich der Kandidatenalgorithmen der äußeren Ebene zu Tensoroperationen auf GPUs, sodass Tausende von Kandidatendesigns in jeder Iteration synchron voranschreiten können. Mit anderen Worten: EvoX verwandelt die Meta-Evolution von einem „langwierigen Trial-and-Error“-Prozess in eine „groß angelegte parallele Experimentiermaschine“ — und genau auf dieser Rechengrundlage ruht AutoPSO.

## Nicht nur schneller, sondern auch besser im „Einsatz der Suche“

Was AutoPSO zeigen möchte, ist nicht bloß, dass es auf GPUs schnell läuft, sondern dass der Algorithmus, sobald der Designprozess von PSO automatisiert ist, tatsächlich eine Suchstrategie finden kann, die besser zum jeweiligen Problem passt.

Auf dem numerischen Optimierungs-Benchmark CEC2022 verglich das EvoX-Team AutoPSO mit dem ursprünglichen PSO, CSO, CLPSO, FIPS und mehreren Varianten sozial lernender PSO. Bei gleichem Laufzeitbudget zeigten viele PSO-Varianten mit fester Struktur einen anfänglich raschen Abfall der Zielfunktionswerte, neigten jedoch zu vorzeitigem Stagnieren. AutoPSO hingegen konnte die Konfiguration des inneren PSO während des Laufes kontinuierlich anpassen und über mehrere Funktionen hinweg einen stabileren Verbesserungstrend aufrechterhalten.

Das Team führte zudem Vergleiche bei gleicher Anzahl von Funktionsauswertungen durch, wobei AutoPSO weiterhin überlegene Leistungen erzielte. Dies zeigt, dass sein Vorteil aus einer effektiveren Organisation des Suchprozesses stammt und nicht bloß aus dem Verbrauch zusätzlicher Rechenressourcen.

![](./autopso-3.png)

*Abbildung 3: Experimentelle Ergebnisse auf dem numerischen CEC2022-Optimierungs-Benchmark.*

Das Forschungsteam wandte AutoPSO anschließend auf neuroevolutionsbasierte Robotersteuerungsaufgaben an. Verglichen mit numerischer Funktionsoptimierung stehen solche Aufgaben realen Anwendungen deutlich näher: Sie umfassen hochdimensionale Policy-Parameter, erhebliches Feedbackrauschen, unregelmäßige Ziellandschaften und Gradienteninformationen, die nicht immer verfügbar sind.

In mehreren Brax-Robotersteuerungsumgebungen erreichte AutoPSO schnellere Reward-Verbesserungen und bessere Endleistungen. Dies legt nahe, dass AutoPSO nicht bloß ein Satz von Heuristiken für eine bestimmte Funktionsklasse ist, sondern ein praktischer und übertragbarer Ansatz zur automatischen Algorithmenkonstruktion.

![](./autopso-4.png)

*Abbildung 4: Experimentelle Ergebnisse auf den Brax-Robotersteuerungsaufgaben.*

Der Wert von EvoX zeigt sich am unmittelbarsten in den Skalierungsexperimenten. Die Zwei-Ebenen-Struktur von AutoPSO bringt naturgemäß eine größere Populationsgröße mit sich: Auf der äußeren Ebene existieren viele Kandidatenalgorithmen, und jeder Kandidatenalgorithmus auf der inneren Ebene hat seinen eigenen Partikelschwarm. Bei traditioneller serieller Ausführung würde der benötigte Rechenaufwand schnell unerträglich ansteigen.

Auf GPUs hingegen steigt die Laufzeit nur um etwa das Dreifache, wenn die Gesamtgröße der Population um das Hundertfache erhöht wird. In Tests mit 8192 Dimensionen hält AutoPSO weiterhin einen akzeptablen Zeitoverhead und erzielt gegenüber der CPU-Ausführung eine Beschleunigung um eine Größenordnung.

![](./autopso-5.png)

*Abbildung 5: Auswirkung der Skalierung der Populationsgröße auf die Laufzeit.*

## AutoPSO verschwendet weder Rechenleistung noch historisches Wissen

Anstatt algorithmische Forschung durch rohe Rechenleistung zu ersetzen, verwandelt AutoPSO die lange angehäuften Forschungsergebnisse in handhabbare Design-Assets. Die wirksamen Mechanismen, die früher über verschiedene PSO-Varianten verstreut waren, werden zu wiederverwendbaren Komponenten abstrahiert, während die Kombinationsentscheidungen, die einst menschlicher Expertise bedurften, der Meta-Evolution zur Validierung an konkreten Aufgaben übertragen werden.

Drei Elemente sind unverzichtbar: Das historische Wissen liefert den Suchraum; die automatische Optimierung übernimmt die kombinatorische Suche; und EvoX liefert zusammen mit GPU-Parallelität die Evaluierungsfähigkeit im großen Maßstab. Ohne historisches Wissen mangelt es der Suche an vielversprechenden Kandidaten; ohne automatische Optimierung lässt sich das Wissen kaum für die jeweilige Aufgabe reorganisieren; ohne paralleles Rechnen kann das Suchausmaß nicht aufrechterhalten werden.

AutoPSO befreit Forschende von repetitivem Parameter-Tuning und Trial-and-Error und lenkt ihre Energie auf wertvollere Arbeit: das Definieren von Komponenten, das Entwerfen von Suchräumen und den Aufbau zuverlässigerer Evaluierungs-Pipelines.

## Vom Abändern von Algorithmen zum Konstruieren von Systemen, die Algorithmen erzeugen

Die Bedeutung von AutoPSO geht über das Erlangen einer stärkeren PSO-Variante hinaus. Es demonstriert ein neues Paradigma für Evolutionsalgorithmen im Zeitalter des parallelen Rechnens:

- **Früher studierten wir, „wie man einen besseren Algorithmus entwirft“;**

- **heute studieren wir, „wie man ein System baut, das Algorithmen automatisch erzeugen, auswählen und verbessern kann“.**

Da die GPU-gestützte Massenevaluierung von Kandidaten allmählich zur Norm in der Forschung wird, werden sich die Grenzen der evolutionären Berechnung zwangsläufig entsprechend verschieben: Parallele Rechenhardware ist nicht mehr nur eine Plattform, die die Ausführung von Algorithmen beherbergt — sie beginnt auch, die Art und Weise, wie Algorithmen entworfen werden, mitzugestalten.

AutoPSO × EvoX: Die evolutionäre Berechnung vom manuellen Zeitalter ins automatische Zeitalter führen.

## Open-Source-Code / Community-Ressourcen

**Paper:**

https://arxiv.org/abs/2608.07539

**GitHub:**

https://github.com/EMI-Group/autopso

**Upstream-Projekt (EvoX):**

https://github.com/EMI-Group/evox

**QQ-Gruppe:**

297969717

![](./autopso-6.png)

*QR-Code der EvoX-QQ-Community-Gruppe.*
