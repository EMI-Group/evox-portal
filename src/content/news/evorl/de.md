---
title: "EvoRL: Evolutionäre Suche und Reinforcement Learning gemeinsam auf GPUs"
pubDate: 2025-01-14
updatedDate: 2026-11-08
summary: "EvoRL verbindet Populationssuche, Reinforcement Learning und parallele Simulation als experimentelle Grundlage evolutionärer Ansätze für Physical AI."
---

Physical AI muss unterschiedliche Verhaltensweisen erkunden, durch Interaktion prüfen und nützliche Erfahrungen weiterverwenden. EvoRL bringt diesen Zyklus in parallele Simulationen: Einzelne Strategien lernen aus Erfahrung, während die Populationssuche Alternativen und Lernkonfigurationen untersucht. So wird das Verhältnis zwischen Lernen und Evolution experimentell zugänglich.

![Mechanische Beinmodelle erkunden unterschiedliche Wege in einer Simulationsschleife](./population-learning-loop.webp)

EvoRL ist ein Open-Source-Forschungsframework für diese Fragen. Auf Basis von JAX verbindet es Reinforcement Learning, evolutionäre Berechnung und Simulation in einem gemeinsamen Trainingsworkflow zur Entwicklung und Bewertung klassischer und hybrider Methoden. Als Schwesterprojekt von EvoX konzentriert sich EvoRL auf ihre Kombination, damit populationsbasierte Suche die Rechenleistung moderner GPUs nutzen kann. [Projektvorstellung](https://github.com/EMI-Group/evorl)

## Warum Evolution und Reinforcement Learning verbinden?

Denken Sie an einen Roboter, der laufen lernt. Mehrere Policies können dieselbe Aufgabe lösen, jedoch mit unterschiedlichen Gangarten, Kompromissen zwischen Geschwindigkeit und Stabilität sowie Energieanforderungen. Wird nur entlang eines Lernpfads optimiert, können viele Möglichkeiten unerforscht bleiben.

Reinforcement Learning nutzt Interaktionsdaten zur Verbesserung von Policies. Evolutionäre Berechnung verwaltet mehrere Kandidaten, bewertet, selektiert und variiert sie, um verschiedene Suchrichtungen zu erhalten. Die Kombination ermöglicht einen umfassenderen Lernprozess: Individuen lernen aus Erfahrung, während die Population nützliche Ergebnisse zwischen ihnen weitergibt.

Evolutionäre Suche kann direkt auf Policy-Parameter wirken oder Hyperparameter des Lernens anpassen. Das beantwortet zwei verschiedene Fragen: Welche Policies sollten wir suchen, und wie können sie besser lernen?

Diese Ergänzung bedeutet nicht, dass hybride Methoden bei jeder Aufgabe besser als Reinforcement Learning allein sind. Sie schafft zusätzliche überprüfbare Entwurfsoptionen. EvoRL soll deren Entwicklungs- und Rechenaufwand senken.

## Kerndesign: eine Trainingspipeline für GPUs

Die Stärke populationsbasierter Methoden liegt in ihrer Vielfalt, doch diese kostet Rechenleistung. Jede weitere Policy kann zusätzliche Interaktionen, Bewertungen und Parameterupdates erfordern. Werden diese Schritte zwischen CPU und GPU aufgeteilt, können wiederholte Datentransfers und die Ablaufplanung zu Engpässen werden.

Mit kompatiblen GPU-Simulationsumgebungen organisiert EvoRL Interaktionen, Policy-Berechnung, evolutionäre Operationen und Lernupdates in einer durchgängigen GPU-Pipeline. JAX-Vektorisierung und Just-in-Time-Kompilierung bündeln wiederholte Berechnungen und optimieren den Berechnungsgraphen des Trainingsschritts. [Technischer Überblick](https://evorl.readthedocs.io/latest/)

Die Parallelisierung erfolgt auf drei Ebenen:

- **Parallele Umgebungen**: Eine Policy interagiert mit mehreren Umgebungsinstanzen und sammelt Erfahrungen stapelweise.
- **Parallele Individuen**: Mehrere Kandidaten einer Population werden gleichzeitig bewertet.
- **Paralleles Training**: Mehrere Agenten lernen gleichzeitig und ermöglichen hybride Verfahren sowie Populationstraining.

So lassen sich Experimente mit mehr gleichzeitig untersuchten Policies leichter umsetzen. Die Populationsgröße muss weiterhin zu GPU-Speicher, Umgebungskosten und Netzwerkgröße passen. [Architekturbeitrag](https://arxiv.org/abs/2501.15129)

## Vier Methodenfamilien in einem Framework vergleichen

EvoRL bietet eine gemeinsame experimentelle Grundlage, auf der Forschende zunächst Baselines erstellen und anschließend Such- oder Lernmechanismen ergänzen können.

| Methodenfamilie | Repräsentative Algorithmen | Zentrale Forschungsfrage |
| --- | --- | --- |
| Reinforcement Learning | PPO, TD3, SAC und weitere | Wie verbessern Interaktionsdaten eine Policy? |
| Evolutionäre Algorithmen | OpenES, ARS, CMA-ES und weitere | Wie lenken Kandidatenbewertungen die Populationssuche? |
| Evolutionär angeleitetes Reinforcement Learning | ERL, CEM-RL und Varianten | Wie arbeiten evolutionäre Suche und gradientenbasiertes Lernen zusammen? |
| Populationsbasiertes AutoRL | PBT-PPO, PBT-SAC und weitere | Wie lassen sich Lernkonfigurationen während des Trainings anpassen? |

Zwei hybride Richtungen sind besonders interessant.

**Evolutionär angeleitetes Reinforcement Learning** verbindet Populationssuche mit individuellem Lernen. Eine Population kann verschiedene Bereiche des Policy-Parameterraums erkunden, während Reinforcement-Learning-Updates die Kandidaten verbessern. Algorithmen unterscheiden sich beim Erfahrungsaustausch, bei individuellen Updates und bei der Selektion. EvoRL liefert Implementierungen zur Untersuchung dieser Optionen.

**Populationsbasiertes AutoRL** durchsucht Trainingskonfigurationen. Bei PBT trainieren beispielsweise mehrere Individuen getrennt. Auf Grundlage regelmäßiger Bewertungen übernehmen sie Trainingszustände leistungsfähigerer Individuen und verändern Hyperparameter, um weiterzusuchen. Diese können sich somit im Trainingsverlauf anpassen.

Verfügbare Algorithmen und Varianten richten sich nach der aktuellen Repository-Implementierung. [Algorithmenliste](https://github.com/EMI-Group/evorl#algorithms)

## Modularität: Forschungsideen in Experimente überführen

Die Entwicklung hybrider Algorithmen erfordert häufig viel Arbeit an Umgebungsanpassung, Datenorganisation, Bewertung und Schnittstellen. EvoRL strukturiert diese Aufgaben mit wenigen Kernabstraktionen:

- **Env** bietet eine gemeinsame Schnittstelle zur Umgebung.
- **Agent** definiert Agentenverhalten und zugehörige Lernlogik.
- **SampleBatch** organisiert Trajektorien und Stichprobendaten.
- **Workflow** definiert die Trainingsschritte eines Algorithmus.
- **EC** stellt evolutionäre Algorithmen und zugehörige Operatoren bereit.

Damit können Sie einzelne Teile ändern: etwa das Suchverfahren austauschen und Umgebung sowie Policy-Netzwerk beibehalten oder das Lernen vor und nach dem Hinzufügen evolutionärer Operationen vergleichen. [Framework- und API-Dokumentation](https://evorl.readthedocs.io/latest/)

Eine gemeinsame Implementierung erleichtert auch die Kontrolle von Variablen. Gleiche Aufgaben, Bewertungsverfahren und Rechenbudgets helfen, algorithmische Verbesserungen von Implementierungsunterschieden zu trennen. Das Framework erleichtert solche Vergleiche; ein sorgfältiger Versuchsaufbau bleibt Aufgabe der Forschenden.

## Was bedeuten die Leistungsgewinne?

Die EvoRL-Veröffentlichung vergleicht die Recheneffizienz in Brax Swimmer auf einem Rechner mit zwei Intel Xeon Gold 6132 CPUs, 128 GiB RAM und einer RTX 3090 GPU. In den getesteten Konfigurationen erreicht OpenES gegenüber der verteilten CPU-Implementierung von RLlib eine maximale Beschleunigung von über 60×; CEM-RL erreicht gegenüber seiner offiziellen Implementierung etwa 5–9×.

Diese Zahlen gelten für bestimmte Aufgaben, Populationsgrößen und Vergleichsbaselines. Sie bedeuten weder gleiche Gewinne bei jeder Aufgabe noch eine entsprechende Verringerung der Stichprobenzahl bis zu einem Zielreward. [Versuchsaufbau und Ergebnisse](https://arxiv.org/html/2501.15129v1#S5)

Bei der Versuchsplanung kann höherer Durchsatz mehr Zufallsseeds, umfangreichere Ablationsstudien oder größere Populationen ermöglichen. Der praktische Nutzen besteht darin, innerhalb des verfügbaren Budgets mehr Ideen zu prüfen.

## Von Robotersteuerung zu neuen Entscheidungsaufgaben

EvoRL unterstützt Brax und MuJoCo Playground für kontinuierliche Steuerung, Policy-Suche und Populationstraining. Experimentelle Integrationen mit gymnax, Jumanji und JaxMARL erschließen klassische Regelungsaufgaben, Spiele, kombinatorische Optimierung und Multi-Agenten-Szenarien. Die Algorithmuskompatibilität muss für jede Konfiguration geprüft werden. Auch einige CPU-Umgebungen werden unterstützt; eine vollständig auf GPUs laufende Pipeline hängt daher von der gewählten Kombination ab. [Unterstützte Umgebungen](https://github.com/EMI-Group/evorl#rl-environments)

Für evolutionäres Reinforcement Learning können Sie vorhandene Algorithmen als Baseline nutzen und anschließend die Zusammenarbeit zwischen Populationssuche und Policy-Lernen verändern. Bei AutoRL bietet PBT einen Einstieg, um den Einfluss von Trainingskonfigurationen zu untersuchen. Neue Optimierungsmethoden lassen sich über die gemeinsamen Schnittstellen schrittweise einbinden.

## Ihr erstes Experiment starten

Die aktuelle Installation erfordert Python 3.12 oder neuer und JAX/jaxlib 0.10.0 oder neuer. [EvoRL](https://github.com/EMI-Group/evorl#installation)

Richten Sie zunächst JAX gemäß der [Installationsanleitung](https://evorl.readthedocs.io/latest/guide/installation.html) für Ihre Hardware ein. Installieren Sie EvoRL anschließend aus dem Quellcode, um die Trainingsskripte und Konfigurationen des Beispiels zu erhalten:

```bash
git clone https://github.com/EMI-Group/evorl.git
cd evorl
pip install -e .
```

Beginnen Sie mit einer PPO-Baseline in der Brax-Umgebung Ant:

```bash
python scripts/train.py agent=ppo env=brax/ant
```

EvoRL verwaltet Experimentkonfigurationen mit Hydra. Sobald die Baseline läuft, können Sie Zufallsseeds, Algorithmuskonfigurationen und Umgebungseinstellungen variieren und anschließend hybride Verfahren oder Populationstraining untersuchen. Details finden Sie im [Schnellstart](https://evorl.readthedocs.io/latest/guide/quickstart.html).

Bewahren Sie den ersten PPO-Lauf als Basis auf: Speichern Sie Umgebung, Seed, Konfiguration und Lernkurve vor jeder Komponentenänderung. Einen einfacheren Einstieg in die Populationssuche bietet das [EvoX-Tutorial](/de/news/evox-quickstart).
