---
title: "6. Fehlerbehebung und Optimierung"
order: 6
---

# 6. Fehlerbehebung und Optimierung

Wenn Sie EvoX verwenden, stoßen Sie möglicherweise auf Probleme oder möchten Ihre Algorithmen feinabstimmen. Dieses Kapitel beschreibt häufige Probleme und Lösungen sowie Debugging-Strategien und Tipps zur Leistungsoptimierung, die Ihnen helfen, Probleme zu lösen und Ihre Erfahrung zu optimieren.

---

## 6.1 Häufige Probleme und Lösungen

Hier sind einige häufig auftretende Probleme und wie man sie angeht:

**(1) Installations- oder Importfehler**:

- **Symptom**: Fehler beim Ausführen von `import evox`.
- **Lösung**:
  - **Installation prüfen**: Führen Sie `pip show evox` zur Überprüfung aus. Falls es nicht installiert ist, überprüfen Sie Ihre virtuelle Umgebung und installieren Sie es neu.
  - **Fehlende Abhängigkeiten**: Wenn Sie `ModuleNotFoundError: No module named 'torch'` sehen, installieren Sie PyTorch wie in Kapitel 2 beschrieben.
  - **CUDA-Nichtübereinstimmung**: Stellen Sie sicher, dass Ihre PyTorch-Version mit Ihren installierten CUDA-Treibern übereinstimmt.

**(2) GPU wird nicht verwendet**:

- **Symptom**: EvoX läuft auf der CPU statt auf der GPU.
- **Lösung**:
  - Prüfen Sie mit `torch.cuda.is_available()`. Falls `False`, installieren Sie ein GPU-kompatibles PyTorch neu und überprüfen Sie die CUDA-Installation.
  - Falls `True`, aber EvoX dennoch die CPU nutzt, stellen Sie sicher, dass Ihre Tensoren auf die GPU verschoben werden (siehe Kapitel 3 für die Konfiguration).

**(3) Speicherüberlauf (RAM/VRAM)**:

- **Symptom**: Sie sehen `OutOfMemoryError`.
- **Lösung**:
  - Reduzieren Sie die Populationsgröße, die Problemdimension oder die Evaluationshäufigkeit.
  - Verwenden Sie float16 (halbe Genauigkeit) oder teilen Sie die Evaluation in Batches auf (Batch Evaluation Splitting).
  - Schalten Sie Debug-/deterministische Modi in PyTorch aus.
  - Speichern Sie nur Statistiken statt vollständiger Pareto-Fronten (bei Multi-Objective).
  - Ein Hardware-Upgrade ist die ultimative Lösung für Speicherengpässe.

**(4) Konvergenzstagnation**:

- **Symptom**: Der Algorithmus bleibt in einem lokalen Optimum stecken.
- **Lösung**:
  - Erhöhen Sie die Populationsdiversität (z. B. höhere Mutationsrate).
  - Versuchen Sie andere Algorithmen oder Parameter.
  - Stellen Sie sicher, dass die Zielfunktion wohldefiniert ist (nicht zu verrauscht oder flach).
  - Führen Sie mehrere Versuche durch und wählen Sie den besten aus – EvoX macht parallele Läufe einfach.

**(5) Schlechte Optimierungsergebnisse**:

- **Symptom**: Die Endergebnisse liegen unter den Erwartungen.
- **Lösung**:
  - **Problemdefinition prüfen**: Stellen Sie sicher, dass die Fitness korrekt berechnet wird (z. B. Vorzeichen, Skalierung).
  - **Algorithmus-Passung**: Probieren Sie andere aus oder tunen Sie Hyperparameter.
  - **Konvergenzkurven nutzen**:
    - Frühe flache Linie (Flatline) → vorzeitige Konvergenz.
    - Oszillierend → Zufälligkeit zu hoch.
  - Passen Sie die Algorithmus-Einstellungen an und analysieren Sie das Verhalten über die Zeit.

**(6) Backend-Konflikte (JAX vs PyTorch)**:

- **Symptom**: Versehentlich die JAX-Version von EvoX installiert, während PyTorch-Beispiele verwendet werden.
- **Lösung**: Der Standardbefehl `pip install evox` liefert Ihnen die PyTorch-Version. Wenn Sie eine JAX-Version installiert haben, installieren Sie sie gemäß den PyTorch-Anweisungen neu (siehe Kapitel 2). JAX-Funktionen sind separat dokumentiert.

**(7) Versionskonflikt**:

- **Symptom**: API-Aufrufe stimmen nicht mit der installierten Version überein.
- **Lösung**:
  - EvoX-Updates können Methodennamen ändern (z. B. `ask/tell` → `step`).
  - Verwenden Sie die neueste stabile Version und beziehen Sie sich auf deren Dokumentation.
  - Passen Sie den Code an Ihre EvoX-Version an oder ziehen Sie ein Upgrade in Betracht.

---

## 6.2 Tipps zum Debugging

Das Debuggen evolutionärer Algorithmen kann aufgrund ihrer stochastischen Natur knifflig sein. Hier sind praktische Tipps:

**(1) Tests im kleinen Maßstab nutzen**:

- Reduzieren Sie Populationsgröße und Iterationsanzahl, um das Debugging zu vereinfachen.
- Beispiel: `pop_size=5`, `iterations=20`.
- Macht es einfacher, das Populationsverhalten zu verfolgen und Probleme zu isolieren.

**(2) Print-Anweisungen einfügen**:

- Geben Sie Populationsfitness, beste Individuen und Zwischenwerte aus.
- Drucken Sie bei großen Tensoren die Shapes oder verwenden Sie `.tolist()` für kleinere.
- Hilft Ihnen, Konvergenz und Operatoreffekte zu verstehen.

**(3) IDE-Breakpoints verwenden**:

- Verwenden Sie PyCharm oder VS Code, um Breakpoints innerhalb von Algorithmus-`step()` oder Evaluationslogik zu setzen.
- Inspizieren Sie Variablenwerte, Tensor-Inhalte oder Zustandsübergänge.
- Seien Sie vorsichtig bei großen Tensoren – beschränken Sie, was Sie inspizieren, um Abstürze zu vermeiden.

**(4) Eigene Komponenten per Unit-Test prüfen**:

- Testen Sie Crossover-/Mutationsfunktionen separat.
- Verwenden Sie synthetische Eingaben, um Ausgabe-Shapes und Logik vor der vollständigen Integration zu validieren.

**(5) Ausführung profilieren**:

- Verwenden Sie `torch.autograd.profiler.profile` oder `time.time()`, um Schrittzeiten zu messen.
- Hilft Ihnen, Engpässe oder Endlosschleifen zu lokalisieren.
- Identifizieren Sie, ob Verlangsamungen in der Evaluation oder der Algorithmuslogik liegen.

**(6) Ausgabe in Datei protokollieren**:

- Schreiben Sie Logs in `.csv`-Dateien für lange Läufe.
- Fügen Sie beste Fitness pro Generation, Diversitätsstatistiken usw. hinzu.
- Nützlich, wenn Abstürze verhindern, dass die Konsolenausgabe gesehen wird.

Insgesamt erfordert das Debuggen von EvoX-Projekten ein Gleichgewicht aus Korrektheitsprüfungen und Ergebnisanalyse. Konzentrieren Sie sich zuerst darauf, sicherzustellen, dass der Algorithmus ordnungsgemäß läuft, und optimieren Sie dann seine Effektivität.

---

## 6.3 Leitfaden zur Leistungsoptimierung

Diese Tipps helfen Ihnen, mehr Geschwindigkeit und Qualität aus EvoX herauszuholen:

**(1) Progressives Skalieren**:

- **Klein anfangen**: Testen Sie die Logik mit kleinen Eingaben.
- **Hochskalieren**: Skalieren Sie schrittweise hoch und beobachten Sie, wie die Laufzeit zunimmt.
- **Ineffizienzen identifizieren**, wenn die Skalierung nichtlinear ist (z. B. 10x Population → >10x Zeit).

**(2) Hardware-Auslastung überwachen**:

- Verwenden Sie `nvidia-smi` für GPU, `htop` für CPU.
- Hohe GPU-Auslastung (>50%) ist ideal.
- Niedrige GPU-Nutzung kann bedeuten, dass Daten nicht auf der GPU sind oder häufige CPU-GPU-Transfers die Dinge verlangsamen.

**(3) Parallelität anpassen**:

- Setzen Sie CPU-Threads: `torch.set_num_threads(n)`.
- Vermeiden Sie Überbelegung, wenn Sie Multi-Threaded-Evaluationstools verwenden.
- Optimieren Sie für GPU die `DataLoader`-Threads, wenn Sie Batch-Umgebungen oder Datensätze verwenden.

**(4) Batch-Evaluation nutzen**:

- Batch-Evaluation ist schneller als die Evaluation pro Individuum.
- Vektorisieren Sie immer `Problem.evaluate()`, um ganze Populationen zu verarbeiten.

**(5) Python-Overhead reduzieren**:

- Verschieben Sie rechenintensive Logik in `Algorithm` oder `Problem`, vermeiden Sie komplexen Python-Code in der Hauptschleife.
- Verwenden Sie `workflow.step()` für die meisten Operationen.
- Minimieren Sie Diagnosen pro Generation, wenn sie die Läufe verlangsamen.

**(6) Algorithmus-Wahl abstimmen**:

- Probieren Sie CMA-ES, GA, PSO, RVEA usw. aus – kein einzelner Algorithmus ist für alle Probleme der beste.
- Ein schneller konvergierender Algorithmus kann mehr Zeit sparen als die Mikro-Optimierung eines Algorithmus, der langsam konvergiert.

Leistungsoptimierung ist iterativ. Mit Geduld können Sie von Stunden Laufzeit auf Minuten kommen. EvoX gibt Ihnen viele „Stellschrauben“ – nutzen Sie diese weise, um Geschwindigkeit und Lösungsqualität auszubalancieren.