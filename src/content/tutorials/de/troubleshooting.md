---
title: "6. Fehlerbehebung und Optimierung"
order: 6
---

# 6. Fehlerbehebung und Optimierung

Bei der Verwendung von EvoX können Sie auf Probleme stoßen oder Ihre Algorithmen feinabstimmen wollen. Dieses Kapitel beschreibt häufige Probleme und Lösungen sowie Debugging-Strategien und Tipps zur Leistungsoptimierung, um Ihnen bei der Problemlösung und Optimierung Ihrer Erfahrung zu helfen.

---

## 6.1 Häufige Probleme und Lösungen

Hier sind einige häufig auftretende Probleme und wie Sie diese beheben können:

**(1) Installations- oder Importfehler**:

- **Symptom**: Fehler beim Ausführen von `import evox`.
- **Lösung**:
  - **Installation überprüfen**: Führen Sie `pip show evox` aus, um dies zu verifizieren. Wenn es nicht installiert ist, überprüfen Sie Ihre virtuelle Umgebung und installieren Sie erneut.
  - **Fehlende Abhängigkeiten**: Wenn Sie `ModuleNotFoundError: No module named 'torch'` sehen, installieren Sie PyTorch wie in Kapitel 2 beschrieben.
  - **CUDA-Inkompatibilität**: Stellen Sie sicher, dass Ihre PyTorch-Version mit Ihren installierten CUDA-Treibern übereinstimmt.

**(2) GPU wird nicht verwendet**:

- **Symptom**: EvoX läuft auf der CPU statt auf der GPU.
- **Lösung**:
  - Überprüfen Sie mit `torch.cuda.is_available()`. Wenn `False`, installieren Sie ein GPU-kompatibles PyTorch neu und überprüfen Sie die CUDA-Installation.
  - Wenn `True`, aber EvoX trotzdem die CPU verwendet, stellen Sie sicher, dass Ihre Tensoren auf die GPU verschoben werden (siehe Kapitel 3 für die Konfiguration).

**(3) Speicherüberlauf (RAM/VRAM)**:

- **Symptom**: Sie sehen `OutOfMemoryError`.
- **Lösung**:
  - Reduzieren Sie die Populationsgröße, Problemdimension oder Evaluierungshäufigkeit.
  - Verwenden Sie float16 (halbe Präzision) oder teilen Sie die Batch-Evaluierung auf.
  - Deaktivieren Sie Debug-/deterministische Modi in PyTorch.
  - Speichern Sie nur Statistiken statt vollständiger Pareto-Fronten (für Mehrzieloptimierung).
  - Ein Hardware-Upgrade ist die ultimative Lösung für Speicherengpässe.

**(4) Konvergenzstagnation**:

- **Symptom**: Der Algorithmus bleibt in einem lokalen Optimum stecken.
- **Lösung**:
  - Erhöhen Sie die Populationsdiversität (z.B. höhere Mutationsrate).
  - Probieren Sie verschiedene Algorithmen oder Parameter aus.
  - Stellen Sie sicher, dass die Zielfunktion gut definiert ist (nicht zu verrauscht oder flach).
  - Führen Sie mehrere Versuche durch und wählen Sie den besten – EvoX macht parallele Durchläufe einfach.

**(5) Schlechte Optimierungsergebnisse**:

- **Symptom**: Die Endergebnisse liegen unter den Erwartungen.
- **Lösung**:
  - **Problemdefinition überprüfen**: Stellen Sie sicher, dass die Fitness korrekt berechnet wird (z.B. Vorzeichen, Skalierung).
  - **Algorithmus-Eignung**: Probieren Sie andere aus oder stimmen Sie Hyperparameter ab.
  - **Konvergenzkurven verwenden**:
    - Frühes Abflachen -> vorzeitige Konvergenz.
    - Oszillierend -> zu hohe Zufälligkeit.
  - Passen Sie die Algorithmuseinstellungen an und analysieren Sie das Verhalten über die Zeit.

**(6) Backend-Konflikte (JAX vs PyTorch)**:

- **Symptom**: Versehentlich die JAX-Version von EvoX installiert, während PyTorch-Beispiele verwendet werden.
- **Lösung**: Das Standard-`pip install evox` gibt Ihnen die PyTorch-Version. Wenn Sie eine JAX-Version installiert haben, installieren Sie gemäß den PyTorch-Anweisungen neu (siehe Kapitel 2). JAX-Funktionen sind separat dokumentiert.

**(7) Versionskonflikt**:

- **Symptom**: API-Aufrufe stimmen nicht mit der installierten Version überein.
- **Lösung**:
  - EvoX-Updates können Methodennamen ändern (z.B. `ask/tell` -> `step`).
  - Verwenden Sie die neueste stabile Version und beziehen Sie sich auf deren Dokumentation.
  - Passen Sie den Code an Ihre EvoX-Version an oder erwägen Sie ein Upgrade.

---

## 6.2 Debugging-Tipps

Das Debugging evolutionärer Algorithmen kann aufgrund ihrer stochastischen Natur schwierig sein. Hier sind praktische Tipps:

**(1) Tests im kleinen Maßstab verwenden**:

- Reduzieren Sie die Populationsgröße und Iterationsanzahl, um das Debugging zu vereinfachen.
- Beispiel: `pop_size=5`, `iterations=20`.
- Erleichtert die Verfolgung des Populationsverhaltens und die Isolierung von Problemen.

**(2) Print-Anweisungen einfügen**:

- Geben Sie Populations-Fitness, beste Individuen und Zwischenwerte aus.
- Für große Tensoren geben Sie Formen aus oder verwenden Sie `.tolist()` für kleinere.
- Hilft Ihnen, Konvergenz und Operatoreffekte zu verstehen.

**(3) IDE-Breakpoints verwenden**:

- Verwenden Sie PyCharm oder VS Code, um Breakpoints innerhalb der `step()`-Methode des Algorithmus oder der Evaluierungslogik zu setzen.
- Inspizieren Sie Variablenwerte, Tensor-Inhalte oder Zustandsübergänge.
- Seien Sie vorsichtig mit großen Tensoren – begrenzen Sie, was Sie inspizieren, um Abstürze zu vermeiden.

**(4) Unit-Tests für benutzerdefinierte Komponenten**:

- Testen Sie Crossover-/Mutationsfunktionen separat.
- Verwenden Sie synthetische Eingaben, um Ausgabeformen und Logik vor der vollständigen Integration zu validieren.

**(5) Ausführung profilieren**:

- Verwenden Sie `torch.autograd.profiler.profile` oder `time.time()`, um Schritt-Zeiten zu messen.
- Hilft Ihnen, Engpässe oder Endlosschleifen zu lokalisieren.
- Identifizieren Sie, ob Verlangsamungen in der Evaluierung oder der Algorithmuslogik liegen.

**(6) Ausgabe in Datei protokollieren**:

- Schreiben Sie Protokolle in `.csv`-Dateien für lange Durchläufe.
- Fügen Sie beste Fitness pro Generation, Diversitätsstatistiken usw. hinzu.
- Nützlich, wenn Abstürze verhindern, dass die Konsolenausgabe gesehen wird.

Insgesamt erfordert das Debugging von EvoX-Projekten eine Balance zwischen Korrektheitsprüfungen und Ergebnisanalyse. Konzentrieren Sie sich zunächst darauf, sicherzustellen, dass der Algorithmus ordnungsgemäß läuft, und optimieren Sie dann seine Effektivität.

---

## 6.3 Leitfaden zur Leistungsoptimierung

Diese Tipps helfen Ihnen, mehr Geschwindigkeit und Qualität aus EvoX herauszuholen:

**(1) Progressive Skalierung**:

- **Klein anfangen**: Testen Sie die Logik mit kleinen Eingaben.
- **Schrittweise hochskalieren** und beobachten, wie die Laufzeit zunimmt.
- **Ineffizienzen identifizieren**, wenn die Skalierung nichtlinear ist (z.B. 10x Population -> >10x Zeit).

**(2) Hardware-Nutzung überwachen**:

- Verwenden Sie `nvidia-smi` für GPU, `htop` für CPU.
- Hohe GPU-Auslastung (>50%) ist ideal.
- Niedrige GPU-Nutzung kann bedeuten, dass Daten nicht auf der GPU sind oder häufige CPU-GPU-Transfers die Dinge verlangsamen.

**(3) Parallelität anpassen**:

- CPU-Threads setzen: `torch.set_num_threads(n)`.
- Vermeiden Sie Übersubskription, wenn Sie Multi-Thread-Evaluierungstools verwenden.
- Für GPU optimieren Sie `DataLoader`-Threads, wenn Sie Batch-Umgebungen oder Datensätze verwenden.

**(4) Batch-Evaluierung nutzen**:

- Batch-Evaluierung ist schneller als Einzelindividuen-Evaluierung.
- Vektorisieren Sie immer `Problem.evaluate()`, um ganze Populationen zu verarbeiten.

**(5) Python-Overhead reduzieren**:

- Verlagern Sie schwere Logik in `Algorithm` oder `Problem`, vermeiden Sie komplexen Python-Code in der Hauptschleife.
- Verwenden Sie `workflow.step()` für die meisten Operationen.
- Minimieren Sie Diagnosen pro Generation, wenn sie die Durchläufe verlangsamen.

**(6) Algorithmuswahl abstimmen**:

- Probieren Sie CMA-ES, GA, PSO, RVEA usw. – kein einzelner Algorithmus ist für alle Probleme der beste.
- Ein schneller konvergierender Algorithmus kann mehr Zeit sparen als die Mikro-Optimierung eines langsam konvergierenden.

Leistungsoptimierung ist iterativ. Mit Geduld können Sie von Stunden Laufzeit auf Minuten kommen. EvoX gibt Ihnen viele "Stellschrauben" – nutzen Sie sie weise, um Geschwindigkeit und Lösungsqualität auszubalancieren.
