---
title: "3. Grundlegende Operationen"
order: 3
---

# 3. Grundlegende Operationen

In diesem Kapitel führen wir Sie durch die Ausführung Ihrer ersten EvoX-Optimierungsaufgabe, einschließlich des **Startens von EvoX** und der **Initialisierung des Optimierungsprozesses**, wie man ein **EvoX-Projekt konfiguriert** (Auswahl von Algorithmen und Problemen und deren Zusammenstellung) und die häufig verwendeten **grundlegenden Befehle** (oder Methoden) zur Steuerung des Optimierungsprozesses. Anhand eines einfachen Beispiels lernen Sie die grundlegende Verwendung von EvoX kennen.

## Starten und Initialisieren

Nach der Überprüfung der Installation können Sie mit dem Schreiben von Optimierungsskripten unter Verwendung von EvoX beginnen. Sie können EvoX in jeder Python-Umgebung importieren (wie Terminal, Jupyter Notebook, IDE usw.).

Lassen Sie uns zunächst EvoX und die zugehörigen Module importieren und eine einfache Optimierungsaufgabe initialisieren. Wir werden beispielsweise den Particle Swarm Optimization (PSO) Algorithmus verwenden, um die klassische Ackley-Funktion zu optimieren. Die Ackley-Funktion ist eine gängige Benchmark-Funktion mit einem bekannten globalen Optimum bei \((0,0,\dots,0)\), was sie für Demonstrationszwecke geeignet macht.
Hier ist ein minimaler EvoX-Beispielcode, der zeigt, wie man die Optimierung startet und ausführt:

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
- Zuerst legen wir die Parameter für den PSO-Algorithmus fest: Populationsgröße von 50 und ein Suchraum in 2D im Bereich von [-32, 32].
- Dann definieren wir das Ackley-Problem (die Ackley-Funktion ist standardmäßig als 2D definiert).
- Wir erstellen einen Standard-Workflow `StdWorkflow`, der den Algorithmus und das Problem **zusammenstellt**, und übergeben einen Monitor `EvalMonitor`, um die Daten des Optimierungsprozesses aufzuzeichnen.
- Als Nächstes schließen wir den Initialisierungsprozess mit `workflow.init_step()` ab, wodurch automatisch die Population, der Random Seed und andere interne Zustände initialisiert werden.
- Dann führen wir eine Schleife aus, um kontinuierlich 100 Iterationen mit `workflow.step()` durchzuführen. Jedes Mal, wenn `step()` aufgerufen wird, generiert der Algorithmus neue Lösungen und bewertet deren Fitness, wobei er sich kontinuierlich der optimalen Lösung nähert.
- Schließlich verwenden wir die vom Monitor bereitgestellte Methode `get_min_fitness()`, um den besten Fitnesswert während des Iterationsprozesses zu erhalten und ihn auszudrucken.

Wenn Sie dieses Skript ausführen, sehen Sie die Ausgabe der Optimierungsiterationen, zum Beispiel:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Da wir die Zwischenergebnisse in der Schleife nicht explizit ausgegeben haben, werden diese nicht angezeigt. Sie können jedoch anhand des finalen Fitnesswerts beurteilen, ob der Algorithmus konvergiert ist. Zum Beispiel ist der optimale Wert der Ackley-Funktion 0, und wenn die Ausgabe nahe bei 0 liegt, deutet dies darauf hin, dass PSO eine Lösung nahe dem globalen Optimum gefunden hat. Sie können auch `print(monitor.history)` aufrufen, um die vom Monitor aufgezeichneten historischen Daten anzuzeigen, oder `monitor.plot()` verwenden, um Konvergenzkurven zu zeichnen (erfordert Visualisierungsunterstützung wie Plotly).

> **Hinweis:**
> `StdWorkflow` ist eine von EvoX bereitgestellte Kapselung eines **Standard-Optimierungsprozesses**. Er implementiert intern die Logik "Initialisierung-Iteration-Update", die in traditionellen evolutionären Algorithmen zu finden ist, und kapselt die Interaktion zwischen dem Algorithmus und dem Problem. Für die meisten einfachen Anwendungen reicht die direkte Verwendung von `StdWorkflow` aus. Der `EvalMonitor` ist ein Monitor, der Methoden wie `get_best_fitness()` und `plot()` implementiert, um Leistungskennzahlen während des Optimierungsprozesses zu sammeln und anzuzeigen. Anfänger können ihn vorläufig als ein Protokollbuch verstehen, das die besten Ergebnisse jeder Iteration für spätere Analysen aufzeichnet.

Im obigen Beispiel haben wir eine grundlegende Konfiguration für ein EvoX-Projekt erstellt, einschließlich der Auswahl eines Algorithmus, der Definition des Problems und der Zusammenstellung des Workflows. Im Allgemeinen umfasst die Konfiguration eines EvoX-Projekts die folgenden Schritte:

1. **Auswahl/Definition eines Optimierungsproblems**: Klären Sie, welches Optimierungsproblem Sie lösen möchten. Wenn Sie beispielsweise eine mathematische Funktion optimieren, bietet EvoX viele **eingebaute Probleme** unter dem Modul `evox.problems` (z. B. klassische Funktionen wie Sphere, Rastrigin, Ackley), die Sie direkt verwenden können. Wenn Ihr Problem nicht durch die eingebauten Funktionen abgedeckt ist, können Sie Ihr eigenes definieren (wird in einem späteren Kapitel behandelt). Bei der Konfiguration eines Problems müssen Sie normalerweise die **Dimension der Entscheidungsvariablen** und deren **Wertebereich** kennen.

2. **Auswahl/Konfiguration eines Optimierungsalgorithmus**: Wählen Sie basierend auf dem Problemtyp einen geeigneten evolutionären Algorithmus. EvoX bietet eine umfangreiche Sammlung von Algorithmen unter `evox.algorithms`, einschließlich Einzelziel-Algorithmen (wie PSO, GA, CMA-ES) und Mehrziel-Algorithmen (wie NSGA-II, RVEA). Nach der Auswahl des Algorithmus müssen Sie im Allgemeinen Algorithmusparameter festlegen, wie z. B. die Populationsgröße (`pop_size`) und algorithmusspezifische Parameter (wie Crossover-Wahrscheinlichkeit und Mutationswahrscheinlichkeit bei GA). Die meisten Algorithmen benötigen den **Variablenbereich** (untere Grenze `lb` und obere Grenze `ub`) und die Problemdimension, um die Population zu initialisieren. Wenn Sie einen Mehrziel-Algorithmus verwenden, müssen Sie auch die Anzahl der Ziele (`n_objs`) angeben. Die Algorithmen von EvoX bieten oft Standardwerte für gängige Hyperparameter, aber Anfänger sollten in Betracht ziehen, diese Parameter basierend auf der Aufgabe anzupassen, um eine bessere Leistung zu erzielen.

3. **Zusammenstellen des Workflows**: Wenn die Instanzen von Algorithmus und Problem bereit sind, müssen Sie diese zu einem Workflow "zusammenbauen", der die gesamte Steuerung des Optimierungsprozesses darstellt. In EvoX wird typischerweise `StdWorkflow` verwendet, um den Algorithmus und das Problem zu kombinieren. Wenn Sie den Optimierungsfortschritt überwachen möchten, können Sie dem Workflow einen Monitor (wie `EvalMonitor`) hinzufügen. Ein Monitor ist nicht erforderlich, kann aber beim Debuggen und bei der Analyse sehr hilfreich sein. Das Zusammenstellen des Workflows erfordert normalerweise eine Codezeile, wie: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Initialisieren**: Rufen Sie die Initialisierungsmethode des Workflows auf, um die Optimierung zu beginnen. Die neueste Version von EvoX bietet eine praktische Methode `StdWorkflow.init_step()`, die den Initialisierungsprozess in einem Aufruf abschließt.

5. **Iterationen ausführen**: Verwenden Sie eine Schleife, um wiederholt `workflow.step()` aufzurufen und den evolutionären Prozess voranzutreiben. Jeder Aufruf führt eine Iteration durch, einschließlich Schritten wie "neue Lösungen generieren -> bewerten -> auswählen" innerhalb des Algorithmus. Während der Iterationen können Sie einen Monitor verwenden, um Echtzeitergebnisse zu beobachten, z. B. das Drucken der aktuell besten Fitness alle paar Generationen. Abbruchkriterien können je nach Bedarf festgelegt werden – üblich sind eine feste Anzahl von Generationen (z. B. Lauf über 100 Generationen) oder das Stoppen, wenn überwachte Metriken konvergieren (z. B. keine signifikante Verbesserung über mehrere Generationen).

6. **Ergebnisse erhalten**: Nach Ende der Iterationen müssen Sie die Endergebnisse aus dem Algorithmus extrahieren – wie die beste Lösung und ihren Zielwert. In EvoX werden diese typischerweise über den Monitor abgerufen. Zum Beispiel gibt `EvalMonitor.get_best_fitness()` den besten Fitnesswert zurück. Um den besten Lösungsvektor zu erhalten, besteht eine Möglichkeit darin, dass das Problemobjekt den besten Kandidaten während der Bewertung speichert, oder die Schnittstelle des Monitors zu nutzen. In der Standardimplementierung von EvoX zeichnet `EvalMonitor` das beste Individuum und die beste Fitness jeder Generation auf, die über seine Eigenschaften zugänglich sind. Angenommen, `monitor.history` speichert den Verlauf, können Sie das beste Individuum der letzten Generation abrufen. Natürlich können Sie `EvalMonitor` auch überspringen und das Algorithmusobjekt nach der Schleife direkt abfragen – dies hängt von der Implementierung des Algorithmus ab. Wenn Ihr benutzerdefinierter Algorithmus `get_best()` implementiert oder das beste Individuum in seinem Zustand speichert, können Sie es direkt extrahieren. Da EvoX jedoch reine Funktionen und Modularität betont, erfolgt der Zugriff auf Ergebnisse normalerweise über Überwachungsmodule.

Indem Sie diese Schritte befolgen, können Sie Ihren Optimierungsaufgabencode klar strukturieren. Für Anfänger ist es wichtig zu verstehen, wie das Trio **Algorithmus-Problem-Workflow** zusammenarbeitet: Der Algorithmus kümmert sich um das Generieren und Verbessern von Lösungen, das Problem bewertet deren Qualität und der Workflow verbindet sie zu einer iterativen Schleife.

Als Nächstes stellen wir einige grundlegende Befehle und Funktionsaufrufe vor, die in EvoX verfügbar sind, um Ihr Verständnis des Optimierungsprozesses zu vertiefen.

## Übersicht der grundlegenden Befehle

Bei der Verwendung von EvoX gibt es einige **häufig verwendete Methoden und Funktionen**, die als "Befehle" fungieren und mit denen Sie vertraut sein sollten:

### Workflow-bezogene Methoden

- **`StdWorkflow.init_step()`**: Initialisierung. Dies ist ein Schnellstartbefehl zum Starten des Optimierungsprozesses, der oft am Anfang eines Skripts verwendet wird. Er ruft die Initialisierungslogik sowohl für den Algorithmus als auch für das Problem auf, generiert die anfängliche Population und bewertet die Fitness. Danach enthält der Workflow den Anfangszustand und ist bereit für die Iteration.

- **`StdWorkflow.step()`**: Einen Schritt in der Optimierung voranschreiten. Jeder Aufruf veranlasst den Algorithmus, basierend auf dem aktuellen Populationszustand neue Kandidatenlösungen zu generieren, diese zu bewerten und die nächste Generation auszuwählen. Benutzer rufen dies typischerweise mehrmals innerhalb einer Schleife auf. Die Funktion `step()` gibt normalerweise nichts zurück (der interne Zustand wird innerhalb des Workflows aktualisiert), obwohl ältere Versionen möglicherweise einen neuen Zustand zurückgegeben haben. Anfänger können sie einfach aufrufen, ohne sich um den Rückgabewert zu kümmern.

### Monitor-bezogene Methoden

Am Beispiel von `EvalMonitor` umfassen die gängigen Methoden:

- `EvalMonitor.get_best_fitness()`: Gibt die niedrigste aufgezeichnete Fitness (für Minimierungsprobleme) oder die höchste Fitness (für Maximierungsprobleme; der Monitor unterscheidet dies normalerweise) zurück. Nützlich, um das aktuell beste Ergebnis zu kennen.
- `EvalMonitor.get_history()` oder `monitor.history`: Ruft den gesamten Verlauf ab, z. B. den besten Wert jeder Generation. Nützlich für die Analyse von Konvergenztrends.
- `EvalMonitor.plot()`: Zeichnet Konvergenz- oder Leistungskurven; erfordert eine grafische Umgebung oder ein Notebook. Der Monitor verwendet normalerweise Plotly zum Rendern von Grafiken, was Ihnen hilft, die Leistung des Algorithmus visuell zu beurteilen.
  Intern zeichnet der Monitor die Anzahl der Bewertungen und deren Ergebnisse in jeder Generation auf – Sie müssen normalerweise nicht eingreifen, sondern nur die Daten bei Bedarf extrahieren.

### Algorithmus-bezogene Methoden

- `Algorithm.__init__()` Methode: Initialisierungsmethode eines Algorithmus. Variablen werden normalerweise mit `evox.core.Mutable()` und Hyperparameter mit `evox.core.Parameter()` verpackt.

- `Algorithm.step()` Methode: In spezifischen Szenarien oder bei der Verwendung von benutzerdefinierten Algorithmen/Problemen rufen Sie möglicherweise direkt die `step()`-Methode des Algorithmus auf, die typischerweise die gesamte Iterationslogik des Algorithmus kapselt.

- `Algorithm.init_step()` Methode: Die `init_step()`-Methode beinhaltet die erste Iteration des Algorithmus. Wenn sie nicht überschrieben wird, ruft sie einfach die `step()`-Methode auf. Für typische Fälle unterscheidet sich die erste Iteration nicht von anderen, sodass viele Algorithmen möglicherweise keine benutzerdefinierte `init_step()` benötigen. Aber für Algorithmen, die Hyperparameter-Tuning beinhalten, müssen Sie hier möglicherweise Hyperparameter oder verwandte Variablen aktualisieren.

### Geräte- und Parallelsteuerung

- `.to(device)` Methode: Wenn Sie in Ihrem Programm die Rechengeräte wechseln müssen, verwenden Sie die `.to(device)`-Methode von PyTorch, um Tensoren (`torch.Tensor`) auf GPU/CPU zu verschieben (einige PyTorch-Methoden wie `torch.randn` benötigen ebenfalls die Angabe des Geräts). Im Allgemeinen, wenn Sie das Gerät mit `torch.set_default_device()` auf `cuda:0` setzen (vorausgesetzt, Ihr System unterstützt dies und EvoX sowie Abhängigkeiten sind korrekt installiert – überprüfen Sie dies mit `torch.cuda.is_available()`), laufen die meisten EvoX-Hochleistungs-Parallelberechnungen automatisch auf der GPU. Beim Schreiben eigener Algorithmen, Probleme oder Monitore, wenn Sie neue Tensoren erstellen oder geräteabhängige PyTorch-Methoden verwenden, wird empfohlen, das `device` explizit als `cuda:0` anzugeben oder `torch.get_default_device()` zu verwenden, um Leistungseinbußen durch Berechnungen auf verschiedenen Geräten zu vermeiden.

Für Anfänger reichen die oben genannten Methoden aus, um typische Optimierungsaufgaben zu bewältigen. Kurz gesagt: **Problem/Algorithmus initialisieren – Monitor einrichten – Workflow zusammenstellen – ausführen und Ergebnisse abrufen** ist der häufigste EvoX-Workflow. Die Beherrschung dieser Schritte ermöglicht es Ihnen, grundlegende Optimierungsaufgaben mit EvoX zu lösen.

Bevor Sie zum nächsten Kapitel übergehen, versuchen Sie, das Beispiel zu ändern: Wechseln Sie von PSO zu einem anderen Algorithmus, ersetzen Sie die Ackley-Funktion durch eine andere Testfunktion oder verwenden Sie den Monitor, um mehr Informationen zu extrahieren – dies wird Ihnen helfen, die Flexibilität der Konfiguration von EvoX-Projekten zu schätzen.