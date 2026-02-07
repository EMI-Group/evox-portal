---
title: "3. Grundlegende Operationen"
order: 3
---

# 3. Grundlegende Operationen

In diesem Kapitel führen wir Sie durch die Ausführung Ihrer ersten EvoX-Optimierungsaufgabe, einschließlich wie Sie **EvoX starten** und **den Optimierungsprozess initialisieren**, wie Sie **ein EvoX-Projekt konfigurieren** (Algorithmen und Probleme auswählen und zusammenstellen) und die häufig verwendeten **grundlegenden Befehle** (oder Methoden) zur Steuerung des Optimierungsprozesses. Anhand eines einfachen Beispiels lernen Sie die grundlegende Verwendung von EvoX.

## Starten und Initialisieren

Nach der Überprüfung der Installation können Sie mit dem Schreiben von Optimierungsskripten mit EvoX beginnen. Sie können EvoX in jeder Python-Umgebung importieren (wie Terminal, Jupyter Notebook, IDE usw.).

Zunächst importieren wir EvoX und seine zugehörigen Module und initialisieren eine einfache Optimierungsaufgabe. Zum Beispiel verwenden wir den Partikelschwarmoptimierungs-Algorithmus (PSO), um die klassische Ackley-Funktion zu optimieren. Die Ackley-Funktion ist eine gängige Benchmark-Funktion mit einem bekannten globalen Optimum bei \((0,0,\dots,0)\), was sie für Demonstrationszwecke geeignet macht.
Hier ist ein minimales EvoX-Beispielcode, das zeigt, wie die Optimierung gestartet und ausgeführt wird:

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

Der obige Code umfasst die folgenden Schritte:
- Zunächst setzen wir die Parameter für den PSO-Algorithmus: Populationsgröße von 50 und einen Suchraum in 2D im Bereich von [-32, 32].
- Dann definieren wir das Ackley-Problem (die Ackley-Funktion ist standardmäßig als 2D definiert).
- Wir erstellen einen Standard-Workflow `StdWorkflow`, der den Algorithmus und das Problem **zusammenstellt**, und übergeben einen Monitor `EvalMonitor`, um die Optimierungsprozessdaten aufzuzeichnen.
- Als Nächstes schließen wir den Initialisierungsprozess mit `workflow.init_step()` ab, der automatisch die Population, den Zufallsseed und andere interne Zustände initialisiert.
- Dann führen wir eine Schleife aus, um kontinuierlich 100 Iterationen mit `workflow.step()` auszuführen. Jedes Mal, wenn `step()` aufgerufen wird, generiert der Algorithmus neue Lösungen und bewertet deren Fitness, wobei er sich kontinuierlich der optimalen Lösung nähert.
- Schließlich verwenden wir die vom Monitor bereitgestellte Methode `get_min_fitness()`, um den besten Fitnesswert während des Iterationsprozesses zu erhalten und auszugeben.

Wenn Sie dieses Skript ausführen, sehen Sie die Ausgabe der Optimierungsiterationen, zum Beispiel:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Da wir die Zwischenergebnisse nicht explizit in der Schleife ausgegeben haben, werden die Zwischenergebnisse nicht angezeigt. Sie können jedoch anhand des endgültigen Fitnesswerts beurteilen, ob der Algorithmus konvergiert ist. Zum Beispiel ist der optimale Wert der Ackley-Funktion 0, und wenn die Ausgabe nahe 0 liegt, zeigt dies an, dass PSO eine Lösung nahe dem globalen Optimum gefunden hat. Sie können auch `print(monitor.history)` aufrufen, um die vom Monitor aufgezeichneten historischen Daten anzuzeigen, oder `monitor.plot()` verwenden, um Konvergenzkurven zu plotten (erfordert Visualisierungsunterstützung wie Plotly).

> **Hinweis:**
> `StdWorkflow` ist eine von EvoX bereitgestellte **Standard-Optimierungsprozess**-Kapselung. Es implementiert intern die "Initialisierung-Iterationsupdate"-Logik, die in traditionellen evolutionären Algorithmen zu finden ist, und kapselt die Interaktion zwischen Algorithmus und Problem. Für die meisten einfachen Anwendungen reicht die direkte Verwendung von `StdWorkflow` aus. Der `EvalMonitor` ist ein Monitor, der Methoden wie `get_best_fitness()` und `plot()` implementiert, um Leistungsmetriken während des Optimierungsprozesses zu sammeln und anzuzeigen. Anfänger können ihn vorübergehend als ein Notizbuch verstehen, das die besten Ergebnisse jeder Iteration für spätere Analyse aufzeichnet.

Im obigen Beispiel haben wir eine grundlegende Konfiguration für ein EvoX-Projekt erstellt, einschließlich der Auswahl eines Algorithmus, der Definition des Problems und der Zusammenstellung des Workflows. Im Allgemeinen umfasst die Konfiguration eines EvoX-Projekts die folgenden Schritte:

1. **Optimierungsproblem auswählen/definieren**: Klären Sie, welches Optimierungsproblem Sie lösen möchten. Wenn Sie beispielsweise eine mathematische Funktion optimieren, bietet EvoX viele **eingebaute Probleme** im Modul `evox.problems` (z.B. klassische Funktionen wie Sphere, Rastrigin, Ackley), die Sie direkt verwenden können. Wenn Ihr Problem nicht von den eingebauten abgedeckt wird, können Sie Ihr eigenes definieren (wird in einem späteren Kapitel behandelt). Bei der Konfiguration eines Problems müssen Sie normalerweise die **Dimension der Entscheidungsvariablen** und deren **Wertebereich** kennen.

2. **Optimierungsalgorithmus auswählen/konfigurieren**: Wählen Sie einen geeigneten evolutionären Algorithmus basierend auf dem Problemtyp. EvoX bietet eine umfangreiche Sammlung von Algorithmen unter `evox.algorithms`, einschließlich Einziel-Algorithmen (wie PSO, GA, CMA-ES) und Mehrziel-Algorithmen (wie NSGA-II, RVEA). Nach der Auswahl des Algorithmus müssen Sie im Allgemeinen Algorithmusparameter setzen, wie Populationsgröße (`pop_size`) und algorithmusspezifische Parameter (wie Crossover-Wahrscheinlichkeit und Mutationswahrscheinlichkeit bei GA). Die meisten Algorithmen erfordern den **Variablenbereich** (untere Grenze `lb` und obere Grenze `ub`) und die Problemdimension zur Initialisierung der Population. Wenn Sie einen Mehrziel-Algorithmus verwenden, müssen Sie auch die Anzahl der Ziele (`n_objs`) angeben. Die Algorithmen von EvoX bieten oft Standardwerte für gängige Hyperparameter, aber Anfänger sollten erwägen, diese Parameter basierend auf der Aufgabe für bessere Leistung abzustimmen.

3. **Workflow zusammenstellen**: Mit der fertigen Algorithmus- und Probleminstanz müssen Sie diese in einen Workflow "zusammenstellen", der die vollständige Optimierungsprozesssteuerung darstellt. In EvoX wird typischerweise `StdWorkflow` verwendet, um den Algorithmus und das Problem zu kombinieren. Wenn Sie den Optimierungsfortschritt überwachen möchten, können Sie dem Workflow einen Monitor (wie `EvalMonitor`) hinzufügen. Ein Monitor ist nicht erforderlich, kann aber beim Debugging und bei der Analyse sehr hilfreich sein. Die Zusammenstellung des Workflows erfordert normalerweise eine Zeile Code, wie: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Initialisieren**: Rufen Sie die Initialisierungsmethode des Workflows auf, um die Optimierung zu starten. Die neueste Version von EvoX bietet eine praktische `StdWorkflow.init_step()`-Methode, die den Initialisierungsprozess in einem Aufruf abschließt.

5. **Iterationen ausführen**: Verwenden Sie eine Schleife, um wiederholt `workflow.step()` aufzurufen, um den evolutionären Prozess voranzutreiben. Jeder Aufruf führt eine Iteration durch, einschließlich Schritte wie "neue Lösungen generieren -> evaluieren -> selektieren" innerhalb des Algorithmus. Während der Iterationen können Sie einen Monitor verwenden, um Echtzeitergebnisse zu beobachten, wie das Ausgeben der aktuellen besten Fitness alle paar Generationen. Abbruchkriterien können nach Ihren Bedürfnissen festgelegt werden – gängige sind eine feste Anzahl von Generationen (z.B. 100 Generationen ausführen) oder das Stoppen, wenn überwachte Metriken konvergieren (z.B. keine signifikante Verbesserung über mehrere Generationen).

6. **Ergebnisse erhalten**: Nach Ende der Iterationen müssen Sie die endgültigen Ergebnisse aus dem Algorithmus extrahieren – wie die beste Lösung und ihren Zielwert. In EvoX werden diese typischerweise über den Monitor erhalten. Zum Beispiel gibt `EvalMonitor.get_best_fitness()` den besten Fitnesswert zurück. Um den besten Lösungsvektor zu erhalten, besteht eine Möglichkeit darin, dass das Problemobjekt den besten Kandidaten während der Evaluierung speichert, oder die Schnittstelle des Monitors zu verwenden. In der Standardimplementierung von EvoX zeichnet `EvalMonitor` das beste Individuum und die Fitness jeder Generation auf, zugänglich über seine Eigenschaften. Angenommen, `monitor.history` speichert den Verlauf, können Sie das beste Individuum der letzten Generation abrufen. Natürlich können Sie auch `EvalMonitor` überspringen und das Algorithmusobjekt direkt nach der Schleife abfragen – dies hängt von der Algorithmusimplementierung ab. Wenn Ihr benutzerdefinierter Algorithmus `get_best()` implementiert oder das beste Individuum in seinem Zustand speichert, können Sie es direkt extrahieren. Da EvoX jedoch reine Funktionen und Modularität betont, werden Ergebnisse normalerweise über Überwachungsmodule abgerufen.

Indem Sie diese Schritte befolgen, können Sie Ihren Optimierungsaufgabencode klar strukturieren. Für Anfänger ist es wichtig zu verstehen, wie das **Algorithmus-Problem-Workflow**-Trio zusammenarbeitet: Der Algorithmus kümmert sich um die Generierung und Verbesserung von Lösungen, das Problem bewertet deren Qualität, und der Workflow verbindet sie zu einer iterativen Schleife.

Als Nächstes stellen wir einige grundlegende Befehle und Funktionsaufrufe vor, die in EvoX verfügbar sind, um Ihr Verständnis des Optimierungsprozesses zu vertiefen.

## Übersicht der grundlegenden Befehle

Bei der Verwendung von EvoX gibt es einige **häufig verwendete Methoden und Funktionen**, die als "Befehle" fungieren, mit denen Sie vertraut sein sollten:

### Workflow-bezogene Methoden

- **`StdWorkflow.init_step()`**: Initialisierung. Dies ist ein Schnellstart-Befehl zum Starten des Optimierungsprozesses, der oft am Anfang eines Skripts verwendet wird. Er ruft die Initialisierungslogik für sowohl den Algorithmus als auch das Problem auf, generiert die Anfangspopulation und bewertet die Fitness. Danach enthält der Workflow den Anfangszustand und ist bereit für die Iteration.

- **`StdWorkflow.step()`**: Einen Schritt in der Optimierung voranschreiten. Jeder Aufruf lässt den Algorithmus neue Kandidatenlösungen basierend auf dem aktuellen Populationszustand generieren, diese evaluieren und die nächste Generation auswählen. Benutzer rufen dies typischerweise mehrmals innerhalb einer Schleife auf. Die `step()`-Funktion gibt normalerweise nichts zurück (der interne Zustand wird innerhalb des Workflows aktualisiert), obwohl ältere Versionen möglicherweise einen neuen Zustand zurückgeben. Für Anfänger können Sie es einfach aufrufen, ohne sich um den Rückgabewert zu kümmern.

### Monitor-bezogene Methoden

Am Beispiel von `EvalMonitor` umfassen die gängigen Methoden:

- `EvalMonitor.get_best_fitness()`: Gibt die niedrigste aufgezeichnete Fitness zurück (für Minimierungsprobleme) oder die höchste Fitness (für Maximierungsprobleme; der Monitor unterscheidet dies normalerweise). Nützlich, um das aktuelle beste Ergebnis zu kennen.
- `EvalMonitor.get_history()` oder `monitor.history`: Ruft den vollständigen Verlauf ab, wie den besten Wert jeder Generation. Nützlich für die Analyse von Konvergenztrends.
- `EvalMonitor.plot()`: Plottet Konvergenz- oder Leistungskurven; erfordert eine grafische Umgebung oder Notebook. Der Monitor verwendet normalerweise Plotly zum Rendern von Grafiken, was Ihnen hilft, die Algorithmusleistung visuell zu bewerten.
  Intern zeichnet der Monitor die Anzahl der Evaluierungen und deren Ergebnisse jeder Generation auf – Sie müssen normalerweise nicht eingreifen, sondern nur die Daten bei Bedarf extrahieren.

### Algorithmus-bezogene Methoden

- `Algorithm.__init__()`-Methode: Initialisierungsmethode eines Algorithmus. Variablen werden normalerweise mit `evox.core.Mutable()` und Hyperparameter mit `evox.core.Parameter()` umschlossen.

- `Algorithm.step()`-Methode: In bestimmten Szenarien oder bei Verwendung benutzerdefinierter Algorithmen/Probleme können Sie die `step()`-Methode des Algorithmus direkt aufrufen, die typischerweise die gesamte Iterationslogik des Algorithmus kapselt.

- `Algorithm.init_step()`-Methode: Die `init_step()`-Methode umfasst die erste Iteration des Algorithmus. Wenn nicht überschrieben, ruft sie einfach die `step()`-Methode auf. Für typische Fälle unterscheidet sich die erste Iteration nicht von anderen, sodass viele Algorithmen möglicherweise kein benutzerdefiniertes `init_step()` benötigen. Aber für Algorithmen, die Hyperparameter-Abstimmung beinhalten, müssen Sie möglicherweise Hyperparameter oder verwandte Variablen hier aktualisieren.

### Geräte- und Parallelsteuerung

- `.to(device)`-Methode: Wenn Sie in Ihrem Programm Rechengeräte wechseln müssen, verwenden Sie PyTorchs `.to(device)`-Methode, um Tensoren (`torch.Tensor`) auf GPU/CPU zu verschieben (einige PyTorch-Methoden wie `torch.randn` benötigen ebenfalls die Angabe des Geräts). Im Allgemeinen, wenn Sie das Gerät mit `torch.set_default_device()` auf `cuda:0` setzen (vorausgesetzt, Ihr System unterstützt es und EvoX und Abhängigkeiten sind korrekt installiert – überprüfen Sie mit `torch.cuda.is_available()`), werden die meisten Hochleistungs-Parallelberechnungen von EvoX automatisch auf der GPU ausgeführt. Beim Schreiben benutzerdefinierter Algorithmen, Probleme oder Monitore, wenn Sie neue Tensoren erstellen oder gerätesensitive PyTorch-Methoden verwenden, wird empfohlen, das `device` explizit als `cuda:0` anzugeben oder `torch.get_default_device()` zu verwenden, um Leistungseinbußen durch Berechnungen auf verschiedenen Geräten zu vermeiden.

Für Anfänger reichen die oben genannten Methoden aus, um typische Optimierungsaufgaben zu bewältigen. Kurz gesagt: **Problem/Algorithmus initialisieren – Monitor einrichten – Workflow zusammenstellen – ausführen und Ergebnisse abrufen** ist der häufigste EvoX-Workflow. Die Beherrschung dieser ermöglicht es Ihnen, grundlegende Optimierungsaufgaben mit EvoX zu bewältigen.

Bevor Sie zum nächsten Kapitel übergehen, versuchen Sie, das Beispiel zu modifizieren: Wechseln Sie von PSO zu einem anderen Algorithmus, ersetzen Sie die Ackley-Funktion durch eine andere Testfunktion oder verwenden Sie den Monitor, um mehr Informationen zu extrahieren – dies wird Ihnen helfen, die Flexibilität der Konfiguration von EvoX-Projekten zu schätzen.
