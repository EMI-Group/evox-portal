---
title: "EvoX 1.1 Release: Jetzt mit torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 führt die vollständige Integration von torch.compile (TorchDynamo) ein und ersetzt TorchScript für bessere Kompatibilität und Leistung."
---

Wir freuen uns, die Veröffentlichung von **EvoX 1.1** bekannt zu geben, mit der **vollständigen Integration von torch.compile (TorchDynamo)** als Backend-Compiler! Dieses Update ersetzt den bisherigen TorchScript-Ansatz und macht EvoX **benutzerfreundlicher und hochkompatibel mit dem breiteren Python-Ökosystem**.

Durch die Nutzung von **torch.compile** erfasst EvoX nun Berechnungsgraphen dynamisch zur Laufzeit, wodurch manuelles Tracing überflüssig wird, während die Leistung automatisch optimiert wird.

**Was ist neu?**

**torch.compile: Intelligentere, flexiblere Kompilierung**

In EvoX 1.1 übernehmen wir vollständig **torch.compile** als neues Kompilierungs-Backend. Im Gegensatz zum vorherigen Tracing-basierten Ansatz fängt torch.compile – das **intern TorchDynamo verwendet** – die Python-Ausführung ab, extrahiert dynamisch Berechnungsgraphen und optimiert diese in Echtzeit.

Das bedeutet:

- **Kein manuelles Tracing mehr** – Rufen Sie einfach **torch.compile(workflow.step)** auf, und EvoX kümmert sich um den Rest.

- **Nahtlose Python-Kompatibilität** – Funktioniert mit nativen Python-Funktionen und externen Bibliotheken wie NumPy und SciPy.

- **Bessere Leistung** – Optimierte Berechnungsgraphen führen zu **schnellerer Ausführung und besserer Hardware-Auslastung**.

- **Zukunftssicheres Design** – Richtet sich nach der Roadmap von PyTorch und gewährleistet langfristige Kompatibilität und Leistungsverbesserungen.

**Warum der Wechsel von TorchScript zu torch.compile?**

In früheren Versionen verließ sich EvoX auf **Tracing-basierte Methoden**:

- **Vor 1.0.0** wurde **JAX-Tracing** für die Extraktion von Berechnungsgraphen verwendet.

- **v1.0.0** wechselte zu **TorchScript**, um die PyTorch-Integration zu verbessern.

Diese Methoden hatten jedoch mehrere Nachteile:

- **Kompliziert in der Anwendung** – Benutzer mussten Graphen manuell tracen und komplexes Debugging durchführen.

- **Eingeschränkte Kompatibilität** – Probleme mit dynamischen Workflows und Nicht-PyTorch-Funktionen.

- **Eingeschränkte Flexibilität** – Schleifen, Bedingungen und andere Python-Konstrukte wurden nicht immer korrekt erfasst.

Mit torch.compile und **TorchDynamo** **gehören diese Probleme der Vergangenheit an**. EvoX optimiert jetzt dynamisch und unterstützt eine breitere Palette von Workflows mit **null Mehraufwand für die Benutzer**.

**Wie EvoX 1.1 Ihr Leben einfacher macht**

- **Kein Ärger mehr mit Tracing** – Alles geschieht im Hintergrund, was Ihren Code sauberer und einfacher wartbar macht.

- **Funktioniert mit Ihrem bestehenden Python-Code** – Keine Notwendigkeit, Ihren Workflow für Kompatibilität zu ändern.

- **Schnellere Ausführung, bessere Skalierung** – Profitieren Sie von den neuesten PyTorch-Optimierungen für GPUs und TPUs.

- **Zukunftssicher** – Bleiben Sie im Einklang mit der langfristigen Entwicklung von PyTorch und sichern Sie sich kontinuierliche Leistungssteigerungen.

**Jetzt auf EvoX 1.1 upgraden!**

EvoX 1.1 ist jetzt offiziell verfügbar! Führen Sie noch heute ein Upgrade durch, um einen **intelligenteren, schnelleren und intuitiveren** Rechen-Workflow zu erleben.

**Holen Sie sich EvoX 1.1**: [GitHub](https://github.com/EMI-Group/EvoX)

Haben Sie Fragen oder Feedback? Eröffnen Sie ein Issue auf GitHub oder treten Sie unserer Community-Diskussion bei. Lassen Sie uns gemeinsam die Grenzen der **Computational Intelligence erweitern!**

**Quellcode / Community / Dokumentation**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Dokumentation: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ-Gruppe: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)