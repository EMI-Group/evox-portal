---
title: "4. Erweiterte Funktionen"
order: 4
---

# 4. Erweiterte Funktionen

EvoX bietet viele **erweiterte Funktionen**, um komplexere Anforderungen zu erfüllen. Nachdem Sie sich mit den Grundlagen vertraut gemacht haben, stellt dieses Kapitel vor, wie Sie die Framework-Konfiguration anpassen, optionale Plugin-Module verwalten und die Leistung optimieren können – damit Sie EvoX bei Bedarf erweitern und abstimmen können.

## Benutzerdefinierte Konfiguration

Die Standardeinstellungen von EvoX sind für die meisten Situationen geeignet, aber manchmal möchten Sie vielleicht das Verhalten oder die Parameter des Frameworks anpassen. Zum Beispiel:

- **Abstimmung von Algorithmusparametern**: Über die grundlegende Populationsgröße und Iterationsanzahl hinaus bieten viele Algorithmen erweiterte Parameter. Zum Beispiel ermöglicht CMA-ES die Konfiguration der initialen Kovarianzmatrix, und NSGA-II stellt Crowding-Distance-Parameter bereit. Sie können Parameter an den Konstruktor des Algorithmus übergeben, z.B. `GA(crossover_prob=0.9, mutation_prob=0.1)` passt die Crossover- und Mutationswahrscheinlichkeiten im Genetischen Algorithmus an. Die Abstimmung dieser Parameter kann die Leistung feintunen. Beziehen Sie sich auf die EvoX-Dokumentation für die API jedes Algorithmus, wo verfügbare Parameter und Standardwerte aufgelistet sind.

- **Austausch von Operatorkomponenten**: Sie können interne evolutionäre Operatoren (z.B. Selektions- oder Mutationsstrategien) ersetzen. Einige Algorithmusklassen unterstützen die Übergabe benutzerdefinierter Operatorobjekte. Zum Beispiel kann Differentielle Evolution (DE) benutzerdefinierte Mutationsoperatoren unterstützen, sodass Sie eine benutzerdefinierte Funktion oder `Operator`-Klasse bereitstellen können. EvoX' modulares Design unterstützt diesen "Plugin-artigen" Austausch. Dies erfordert typischerweise ein Verständnis der Algorithmus-Interna und ist für Standardanwendungsfälle normalerweise nicht notwendig.

- **Mehrziel-Einstellungen**: Für Mehrzieloptimierung müssen Sie möglicherweise Präferenzen oder Gewichte konfigurieren – zum Beispiel Gewichtsvektoren für gewichtete Summenmethoden setzen oder Referenzpunkte während der Evolution anpassen. Diese Konfigurationen werden typischerweise über Parameter in der Problem- oder Algorithmusklasse bereitgestellt. Zum Beispiel definiert `problem = DTLZ2(d=12, m=3)` ein 12-dimensionales, 3-Ziel-Problem. Einige Algorithmen erlauben die Übergabe benutzerdefinierter Referenzvektoren. Das Lesen der Algorithmusdokumentation hilft Ihnen, solche Einstellungen voll auszunutzen.

- **Protokollierung und Ausgabe**: Der Standard-`EvalMonitor` protokolliert bereits wichtige Optimierungsmetriken. Wenn Sie zusätzliche Informationen benötigen (z.B. Populationsdiversität oder durchschnittliche Fitness pro Generation), können Sie den Monitor anpassen oder manuell innerhalb Ihrer Schleife protokollieren. Für lang laufende Aufgaben möchten Sie möglicherweise in eine Datei protokollieren. Dies kann mit Pythons `logging`-Bibliothek oder einfacher Datei-E/A erfolgen, um Ergebnisse für spätere Analyse anzuhängen.

Zusammenfassend bedeutet benutzerdefinierte Konfiguration, das Standardverhalten von EvoX für eine bestimmte Aufgabe zu modifizieren. Dies beinhaltet normalerweise eine tiefere Nutzung der EvoX-API. Wir werden mehr im Abschnitt **Entwicklung und Erweiterung** behandeln. Für Anfänger merken Sie sich einfach: EvoX bietet flexible Schnittstellen, die es erfahrenen Benutzern ermöglichen, nahezu jedes Detail anzupassen – aber Sie können auch bei den Standardeinstellungen bleiben und schnell Ergebnisse erzielen.

## Plugin-Verwaltung

"Plugins" beziehen sich hier auf optionale Komponenten oder Erweiterungsmodule in EvoX – wie Visualisierungstools, Reinforcement-Learning-Umgebungs-Wrapper und Schwesterprojekte im EvoX-Ökosystem. Die Verwaltung von Plugins in EvoX umfasst hauptsächlich die **Installation und Verwendung optionaler Module**. Hier sind einige wichtige Erweiterungen und wie Sie sie verwalten:

- **Visualisierungs-Plugin**: EvoX enthält das Modul `evox.vis_tools`, das ein `plot`-Submodul für Diagramme enthält und das `.exv`-Protokollformat für Echtzeit-Datenströme unterstützt. Um die Visualisierung zu nutzen, installieren Sie EvoX mit dem `vis`-Extra: `pip install evox[vis]`. (Wenn nicht initial installiert, können Sie es später installieren oder einfach `pip install plotly` ausführen, um die Abhängigkeiten zu erfüllen.) Bei der Verwendung visueller Tools rufen Sie typischerweise Plot-Funktionen auf, nachdem der Monitor Daten protokolliert hat – zum Beispiel verwendet `EvalMonitor.plot()` `vis_tools.plot`. Die Sicherstellung, dass dieses Plugin installiert ist, vermeidet Fehler durch fehlende Bibliotheken wie `matplotlib`.

- **Neuroevolution-Plugin**: EvoX unterstützt Reinforcement-Learning-Umgebungen (wie die Brax-Physik-Engine) und neuronale Individuen-Optimierung (Neuroevolution). Diese Funktionen sind in der `neuroevolution`-Erweiterung gebündelt, installiert über `pip install "evox[neuroevolution]"`. Dies umfasst die Google Brax-Bibliothek, Gym und mehr. Nach der Installation können Sie Wrapper wie `BraxProblem` in `evox.problems.neuroevolution` verwenden, um RL-Umgebungen in Optimierungsprobleme umzuwandeln. Tools wie `ParamsAndVector` sind ebenfalls enthalten, um PyTorch-Modellparameter in Vektoren für die Evolution abzuflachen. Beachten Sie, dass Brax nur unter Linux oder Windows über WSL funktioniert – natives Windows-Python kann nur auf der CPU laufen. Kurz gesagt, das Aktivieren oder Deaktivieren von EvoX-Plugins wird über die Installation spezifischer Extras gesteuert.

- **Schwesterprojekte**: EvoX hat verwandte Projekte wie EvoRL (fokussiert auf evolutionäres Reinforcement Learning) und EvoGP (GPU-beschleunigte genetische Programmierung). Diese teilen die Designphilosophie und Schnittstelle von EvoX. Wenn Ihre Aufgabe RL-lastig ist, bevorzugen Sie möglicherweise diese dedizierten Frameworks. Die Verwaltung dieser Plugins bedeutet, Versionskompatibilität sicherzustellen und Abhängigkeiten zu erfüllen. Zum Beispiel verwendet EvoRL JAX und Brax, während EvoGP möglicherweise symbolische Baumbibliotheken erfordert. Diese Bibliotheken können normalerweise ohne Konflikte koexistieren. Betrachten Sie sie als ergänzende Tools, die vom Haupt-EvoX-Projekt aufgerufen werden können – oder für ein schlankes Setup ganz weggelassen werden.

- **Benutzerdefinierte Plugins**: Dank der Modularität von EvoX können Sie Ihre eigenen "Plugins" erstellen. Erstellen Sie beispielsweise eine benutzerdefinierte `Monitor`-Klasse, um einzigartige Metriken zu verfolgen, oder eine benutzerdefinierte `Problem`-Unterklasse, die einen Drittanbieter-Simulator einbettet. Diese erweitern effektiv die Fähigkeiten von EvoX. Best Practice ist es, den Schnittstellenverträgen von EvoX zu folgen – stellen Sie beispielsweise sicher, dass Ihr benutzerdefiniertes `Problem` eine `evaluate()`-Methode hat, oder dass Ihr benutzerdefinierter `Monitor` von einer Basisklasse erbt. Nach dem Testen könnten Sie es sogar zu zukünftigen EvoX-Releases beitragen.

Insgesamt geht es bei der Plugin-Verwaltung in EvoX um **flexible Erweiterung und Abhängigkeitskontrolle**. Als Anfänger können Sie bei der Installation entscheiden, ob Sie die `vis`- und `neuroevolution`-Erweiterungen einschließen möchten. Wenn nicht initial installiert, können sie später hinzugefügt werden. Mit Plugins können Sie den Optimierungsfortschritt einfacher überwachen und EvoX mit externen Tools für mehr Leistung integrieren.

## Leistungsoptimierung

Leistung ist eine große Stärke von EvoX. Selbst bei Verwendung desselben Algorithmus kann die GPU-Unterstützung von EvoX die Geschwindigkeit um mehrere Größenordnungen steigern. Um dies jedoch voll auszuschöpfen, sollten Sie einige Tipps befolgen:

- **GPU-Parallelismus nutzen**: Stellen Sie zunächst sicher, dass Ihr Code tatsächlich auf der GPU läuft. Wie bereits erwähnt, installieren Sie CUDA-fähiges PyTorch und verschieben Sie Daten auf GPU-Geräte. Wenn die Dinge langsam erscheinen, überprüfen Sie mit `torch.cuda.is_available()` – es sollte `True` zurückgeben. Wenn eine GPU existiert, aber nicht verwendet wird, liegt es wahrscheinlich daran, dass Tensoren standardmäßig auf der CPU erstellt wurden. Beheben Sie dies, indem Sie `device` explizit setzen oder sicherstellen, dass Eingabetensoren (wie `lb`/`ub`) auf CUDA sind. EvoX folgt dem Gerät dieser Eingaben. Auf Multi-GPU-Systemen verwendet EvoX im Allgemeinen **eine GPU pro Prozess**. Um mehrere GPUs zu nutzen, können Sie mehrere Prozesse mit verschiedenen GPUs ausführen oder auf zukünftige Unterstützung für koordinierte Multi-GPU-Ausführung warten.

- **Parallele Evaluierung**: Ein wichtiger Engpass bei evolutionären Algorithmen ist die **Fitness-Evaluierung**. Da Evaluierungen oft unabhängig sind, können sie parallelisiert werden. EvoX bündelt Evaluierungen, wenn möglich – zum Beispiel können neuronale Netzwerk-Evaluierungen oder Polynomfunktionen parallel auf der GPU berechnet werden. Für benutzerdefinierte Probleme vermeiden Sie Python-Schleifen – vektorisieren Sie Ihren Evaluierungscode, um einen ganzen Stapel von Kandidaten auf einmal zu verarbeiten. Dies nutzt die parallelen Fähigkeiten von PyTorch optimal. Einfach gesagt: Lassen Sie die `evaluate()`-Funktion Ihres Problems auf Batches operieren – nicht auf einzelnen Lösungen – für eine massive Beschleunigung.

- **Kompilierung zur Optimierung**: PyTorch 2.0 führte `torch.compile` ein, das Modelle/Funktionen JIT-kompiliert für Leistungsgewinne. Wenn Ihre Evaluierungslogik komplex ist, erwägen Sie die Kompilierung vor der Ausführung:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Dies könnte die Leistung erheblich verbessern.
  > **Hinweis:**
> Die Kompilierung fügt Overhead hinzu und wird nicht immer von allen Funktionen oder Problemen unterstützt. Am besten geeignet für großskalige, lang laufende Aufgaben. Unter Windows stellen Sie sicher, dass Triton installiert ist, damit `torch.compile` funktioniert.

- **Populationsgröße abstimmen**: Eine größere Population erhöht die Diversität und die globale Suchfähigkeit – erhöht aber auch die Berechnung pro Generation. Balancieren Sie Qualität und Geschwindigkeit durch Abstimmung von `pop_size`. Auf der GPU können Sie sie oft erhöhen, ohne einen linearen Zeitanstieg (dank Parallelismus). Aber eine zu große Größe kann Speicherprobleme verursachen. Wenn Ihnen der GPU-Speicher ausgeht, reduzieren Sie die Populationsgröße oder Problemdimension, oder verwenden Sie FP16, um Platz zu sparen (einstellbar über `torch.set_float32_matmul_precision('medium')`).

- **Python-Overhead reduzieren**: EvoX verlagert die meisten Kernberechnungen auf `torch.Tensor`, aber benutzerdefinierte Schleifen oder Operatoren sollten übermäßige Python-Level-Operationen vermeiden. Vermeiden Sie häufige Prints (hohe E/A-Kosten), Listen oder Datentypkonvertierungen. Halten Sie Ihren Code vektorisiert/tensorisiert, um schnelle C++/CUDA-Kernel unter der Haube zu nutzen und den Python-Interpreter-Overhead zu reduzieren.

- **Verteilte Bereitstellung**: Für extrem große Probleme erwägen Sie die Ausführung über mehrere Maschinen. EvoX unterstützt Multi-Node-Setups (über Backend-Kommunikation und Sharding). Obwohl nicht anfängerfreundlich, ist es gut zu wissen, dass dies existiert. Mit einem GPU-Cluster beziehen Sie sich auf die EvoX-Dokumentation für verteilte Bereitstellung. Normalerweise müssen Sie Umgebungsvariablen setzen oder mit speziellen Skripten starten. Die Architektur ermöglicht es, denselben Code auf Einzel- oder Multi-Node-Setups auszuführen. Für Ihren ersten Versuch simulieren Sie es mit mehreren Prozessen auf einer Maschine.

- **Leistungsprofiling**: Um tiefer einzutauchen, verwenden Sie Tools wie den Profiler von PyTorch oder Pythons `cProfile`, um Engpässe zu analysieren. Dies hilft Ihnen zu identifizieren, ob die Zeit in die Evaluierung, Selektion oder etwas anderes fließt – damit Sie entsprechend optimieren können (z.B. durch Caching wiederholter Berechnungen). EvoX ist auf Leistung ausgelegt, aber reale Aufgaben können dennoch einzigartige Engpässe aufweisen, die eine Analyse erfordern.

Kurz gesagt, obwohl EvoX bereits auf Architekturebene optimiert ist, können Benutzer die Leistung weiter steigern, indem sie **GPUs korrekt verwenden**, **Batch-Computing** einsetzen und **Parameter abstimmen**. Während Sie Geschwindigkeit anstreben, denken Sie auch daran, die Ergebnisqualität beizubehalten – Balance ist der Schlüssel. Wenn Sie sich mit EvoX vertrauter machen, wird die Leistungsoptimierung zur zweiten Natur.
