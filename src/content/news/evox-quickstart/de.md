---
title: "Einstieg in EvoX: Ihr erster evolutionärer Workflow"
pubDate: 2025-04-30
updatedDate: 2026-11-08
summary: "Erstellen Sie ein vollständiges EvoX-1.4.1-Experiment und verstehen Sie, wie Probleme, Populationen, Bewertung und Ausführung einen wiederverwendbaren Workflow bilden."
---

Dieses Beispiel minimiert die zweidimensionale Ackley-Funktion mit PSO, prüft das Ausführungsgerät und zeichnet den Verlauf. Es verwendet **EvoX 1.4.1 mit PyTorch**, nicht die experimentelle 2.x-API. Die kleine Aufgabe erklärt den Workflow und ist kein GPU-Benchmark.

![Kandidatenpartikel erkunden eine Suchlandschaft](./first-search-workflow.webp)

## Eine isolierte Umgebung vorbereiten

Verwenden Sie Python ab Version 3.10. Erstellen Sie eine virtuelle Umgebung und aktivieren Sie diese passend zur Shell.

```bash
python -m venv .venv
```

Unter macOS/Linux:

```bash
source .venv/bin/activate
```

Unter Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

## Passende Pakete installieren

Wählen Sie im [offiziellen PyTorch-Installer](https://pytorch.org/get-started/locally/) den Befehl für Ihr System und Ihre Hardware. CUDA benötigt einen unterstützten Treiber; EvoX allein garantiert keine GPU-Verfügbarkeit. Installieren Sie danach die festgelegte Version:

```bash
python -m pip install "evox[vis]==1.4.1"
```

## Ein vollständiges Experiment ausführen

Speichern Sie den Code als Python-Skript. Er wählt CUDA, sofern verfügbar, sonst CPU, zeigt die Wahl an und hält Zustand und Überwachung auf diesem Gerät. Ein fester Seed erleichtert Wiederholungen; Geräte- und Versionswechsel können Ergebnisse verändern.

```python
import torch
from evox.algorithms import PSO
from evox.problems.numerical import Ackley
from evox.workflows import StdWorkflow, EvalMonitor

torch.manual_seed(42)
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
torch.set_default_device(device)

algorithm = PSO(
    pop_size=50,
    lb=-32 * torch.ones(2, device=device),
    ub=32 * torch.ones(2, device=device),
    device=device,
)
problem = Ackley()
monitor = EvalMonitor(device=device, history_device=device)
workflow = StdWorkflow(algorithm, problem, monitor)

workflow.init_step()
for _ in range(100):
    workflow.step()

print("Device:", device)
print("Best fitness:", monitor.get_best_fitness().item())
```

## Ergebnisse verstehen und darstellen

PSO verwaltet Kandidaten, Ackley bewertet sie, StdWorkflow verbindet die Komponenten und EvalMonitor protokolliert den Verlauf. Kleinere Werte sind besser; das theoretische Optimum liegt bei null am Ursprung. Ein fester Endwert wird nicht garantiert.

Führen Sie den folgenden Befehl nach der Suche im selben Prozess aus. Visualisierungsabhängigkeiten sind enthalten. Die Abbildung stammt aus dem ursprünglichen Tutorial und ist keine garantierte Ausgabe dieses Seeds.

```python
monitor.plot()
```

![PSO convergence](./quickstart-7.png)

## Das Experiment gezielt erweitern

Ändern Sie Dimension, Populationsgröße oder Seed einzeln. Eigene Probleme liefern einen Zielfunktionswert pro Kandidat. Mehrzieloptimierung benötigt zusätzlich einen passenden Algorithmus, die richtige Ausgabeform und einen geeigneten Monitor.

Trennen Sie beim Messen Kompilierung und Aufwärmen vom regulären Lauf, synchronisieren Sie CUDA und vergleichen Sie gleiche Auswertungsbudgets. Kleine Aufgaben können auf CPU schneller sein. Untersuchen Sie Kompilierung erst nach einer funktionierenden Baseline.

## Ressourcen und Danksagung

Das ursprüngliche Tutorial stammt von Boqing Xu, Xinmeng Yu, Bowen Zheng und Xinyao Li; Beichen Huang übernahm Redaktion und Veröffentlichung. Die Übersichtsgrafik bleibt unten erhalten.

![EvoX overview](./quickstart-8.png)

Nutzen Sie den [versionierten Quellcode](https://github.com/EMI-Group/evox/tree/v1.4.1) und die [Dokumentation](https://evox.readthedocs.io/en/latest/). Prüfen Sie die Zielversion, bevor Sie neuere APIs übernehmen.

Speichern Sie vor einer Erweiterung Paketversionen, Gerät, Seed und beste Fitness gemeinsam. Ändern Sie eine Einstellung und wiederholen Sie das gleiche Budget. Die [EvoMO-Erklärung](/de/news/gpu-accelerated-emo) behandelt die zusätzlichen Auswahl- und Bewertungsfragen bei konkurrierenden Zielen.
