---
title: "EvoX-Schnellstart: Führen Sie GPU-beschleunigte evolutionäre Berechnungen in nur 10 Minuten aus"
pubDate: 2025-04-30
summary: "Ein Einsteiger-Tutorial, um in nur 10 Minuten mit GPU-beschleunigten evolutionären Berechnungen unter Verwendung von EvoX zu beginnen."
---

Einerseits ist Evolutionary Computation extrem leistungsfähig in der realen Forschung und Technik, jedoch schwierig anzuwenden. Andererseits werden die Fähigkeiten von GPUs immer leistungsfähiger, aber es ist schwierig für sie, ihre Leistung in Aufgaben der evolutionären Berechnung voll auszuschöpfen.

Wir brauchen eine wirklich moderne Lösung: native GPU-Unterstützung, modulare Architektur, klare Schnittstellen, sofortige Einsatzbereitschaft (Out-of-the-Box) und anpassbare Skalierbarkeit. Das ist EvoX – eine Engine für evolutionäre Berechnungen für die Zukunft.

Um Benutzern den schnellen Einstieg zu erleichtern, hat das EvoX-Team das „EvoX Beginner's Tutorial“ veröffentlicht. Das Tutorial besteht aus 8 Kapiteln, die alles von den Grundlagen bis zur fortgeschrittenen praktischen Anwendung abdecken und Sie Schritt für Schritt anleiten, wie Sie evolutionäre Algorithmen auf einer GPU ausführen.

**Vollständige Tutorial-Ressourcen**

Chinesisches Online-Tutorial:

[EvoX Einsteiger-Tutorial - EvoX Dokumentation](https://evox.readthedocs.io/zh-cn/latest/tutorial/ "https://evox.readthedocs.io/zh-cn/latest/tutorial/")

Chinesisches PDF-Tutorial:

Bitte treten Sie der QQ-Gruppe bei, um es zu erhalten: 297969717

Als Nächstes führen wir Sie in nur 10 Minuten durch den gesamten Prozess von der Installation bis zum Betrieb.

**Schritt 1: Einrichtung der Umgebung**

Öffnen Sie Ihr Terminal und erstellen Sie eine saubere Python-Umgebung:

![代码片段1.png](./quickstart-1.png)

Sie können auch Ihr bevorzugtes Tool verwenden, um eine saubere Python-Umgebung zu erstellen.

**Schritt 2: Installation von PyTorch und EvoX**

![代码片段2.png](./quickstart-2.png)

Überprüfen Sie, ob die GPU verfügbar ist:

![代码片段3.png](./quickstart-3.png)

**Schritt 3: Führen Sie Ihren ersten evolutionären Algorithmus aus**

**![代码片段4.png](./quickstart-4.png)![图片2.4.png](./quickstart-5.png)**

Was bewirkt das? Es stellt einen Algorithmus (PSO), ein Problem (Ackley) und einen Monitor (EvalMonitor) über eine Standardschnittstelle zusammen. EvoX kümmert sich um die gesamte Parallelisierung, Beschleunigung und Überwachung!

**Schritt 4: Plotten der Konvergenzkurve**

Nur eine Zeile reicht aus:

![代码片段5.png](./quickstart-6.png "代码片段5.png")

![monitor_output.png](./quickstart-7.png)

Sehen Sie diese absteigende Kurve? Das ist die **Trajektorie, auf der sich Ihr evolutionärer Algorithmus dem Ziel nähert**, und **der Pfad, den er nimmt, um die unbekannte Welt zu erkunden.**

**Schritt 5: Versuchen Sie eine Erweiterung**

Wenn „nur einen Ackley auszuführen“ nicht befriedigend ist, können Sie:

· PSO gegen GA, DE, CMA-ES, NSGA-II, RVEA austauschen...
 · Ackley gegen Rastrigin, Griewank, CEC2022 austauschen
 · Zu einem mehrzieligen Problem wechseln, indem Sie n_objs >= 2 setzen
 · Ihre eigene Logik mit MyProblem und MyAlgorithm implementieren
 · Verbindung mit PyTorch-Modellen oder Reinforcement-Learning-Umgebungen herstellen (Gym, Brax, MuJoCo Playground)

Ob Hyperparameter-Tuning, Architektursuche, Neuroevolution oder Optimierung von Steuerungsstrategien – EvoX bewältigt alles mit Leichtigkeit.

**Warum EvoX wählen?**

![表格-英文.png](./quickstart-8.png "表格-英文.png")



**Danksagung**

Dieses Tutorial wurde von **Boqing Xu**, **Xinmeng Yu**, **Bowen Zheng** und **Xinyao Li** verfasst. **Beichen Huang** war für die Zusammenstellung, Bearbeitung und Online-Veröffentlichung des Tutorials verantwortlich.

Wir danken jedem Mitglied der EvoX-Community aufrichtig. Es sind unsere gemeinsamen Anstrengungen, die es EvoX ermöglicht haben, sich weiterzuentwickeln.

**Open Source Code / Community-Ressourcen**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Upstream-Projekt (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ-Gruppe: 297969717

![图片11.png](./evox-1-1-0-1.png)

QQ-Gruppe | Evolving Machine Intelligence

EvoMO baut auf dem EvoX-Framework auf. Wenn Sie daran interessiert sind, mehr über EvoX zu erfahren, schauen Sie sich gerne den offiziellen Artikel zu EvoX 1.0 an, der auf unserem öffentlichen WeChat-Konto veröffentlicht wurde, um weitere Details zu erhalten.

![image.png](./metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))