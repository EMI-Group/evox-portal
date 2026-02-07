---
title: "EvoX 1.1: Jetzt mit torch.compile (TorchDynamo)"
pubDate: 2025-03-01
summary: "EvoX 1.1 fuehrt die vollstaendige torch.compile (TorchDynamo) Integration ein und ersetzt TorchScript fuer bessere Kompatibilitaet und Leistung."
---

Wir freuen uns, die Veroeffentlichung von **EvoX 1.1** bekannt zu geben, mit **vollstaendiger Integration von torch.compile (TorchDynamo)** als Backend-Compiler! Dieses Update ersetzt den bisherigen TorchScript-Ansatz und macht EvoX **benutzerfreundlicher und hochkompatibel mit dem breiteren Python-Oekosystem**.

Durch die Nutzung von **torch.compile** erfasst EvoX nun Berechnungsgraphen dynamisch zur Laufzeit, wodurch manuelles Tracing entfaellt und die Leistung automatisch optimiert wird.

**Was ist neu?**

**torch.compile: Intelligentere, flexiblere Kompilierung**

In EvoX 1.1 setzen wir vollstaendig auf **torch.compile** als neues Kompilierungs-Backend. Im Gegensatz zum bisherigen Tracing-basierten Ansatz faengt torch.compile -- das **intern TorchDynamo verwendet** -- die Python-Ausfuehrung ab, extrahiert dynamisch Berechnungsgraphen und optimiert sie in Echtzeit.

Das bedeutet:

l  **Kein manuelles Tracing mehr** -- Rufen Sie einfach **torch.compile(workflow.step)** auf, und EvoX erledigt den Rest.

l  **Nahtlose Python-Kompatibilitaet** -- Funktioniert mit nativen Python-Funktionen und externen Bibliotheken wie NumPy und SciPy.

l  **Bessere Leistung** -- Optimierte Berechnungsgraphen fuehren zu **schnellerer Ausfuehrung und besserer Hardware-Auslastung**.

l  **Zukunftssicheres Design** -- Ausgerichtet an PyTorchs Roadmap, was langfristige Kompatibilitaet und Leistungsverbesserungen sicherstellt.

**Warum der Wechsel von TorchScript zu torch.compile?**

In frueheren Versionen stuetzte sich EvoX auf **Tracing-basierte Methoden**:

l  **Vor 1.0.0** wurde **JAX Tracing** zur Extraktion von Berechnungsgraphen verwendet.

l  **v1.0.0** wechselte zu **TorchScript** und verbesserte die PyTorch-Integration.

Diese Methoden hatten jedoch mehrere Nachteile:

l  **Komplex in der Anwendung** -- Benutzer mussten Graphen manuell tracen und kompliziertes Debugging handhaben.

l  **Eingeschraenkte Kompatibilitaet** -- Schwierigkeiten mit dynamischen Workflows und Nicht-PyTorch-Funktionen.

l  **Begrenzte Flexibilitaet** -- Schleifen, Bedingungen und andere Python-Konstrukte wurden nicht immer korrekt erfasst.

Mit torch.compile und **TorchDynamo** **gehoeren diese Probleme der Vergangenheit an**. EvoX optimiert jetzt dynamisch und unterstuetzt ein breiteres Spektrum an Workflows **ohne zusaetzlichen Aufwand fuer die Benutzer**.

**Wie EvoX 1.1 Ihnen das Leben erleichtert**

l  **Kein Aufwand mehr mit Tracing** -- Alles geschieht im Hintergrund, wodurch Ihr Code sauberer und einfacher zu warten ist.

l  **Funktioniert mit Ihrem bestehenden Python-Code** -- Keine Aenderungen an Ihrem Workflow fuer Kompatibilitaet noetig.

l  **Schnellere Ausfuehrung, bessere Skalierung** -- Profitieren Sie von PyTorchs neuesten Optimierungen fuer GPUs und TPUs.

l  **Zukunftsbereit** -- Bleiben Sie mit PyTorchs langfristiger Entwicklung synchron und sichern Sie sich kontinuierliche Leistungssteigerungen.

**Jetzt auf EvoX 1.1 upgraden!**

EvoX 1.1 ist jetzt offiziell verfuegbar! Upgraden Sie noch heute und erleben Sie einen **intelligenteren, schnelleren und intuitiveren** Berechnungs-Workflow.

**EvoX 1.1 herunterladen**: [GitHub](https://github.com/EMI-Group/EvoX)

Haben Sie Fragen oder Feedback? Eroeffnen Sie ein Issue auf GitHub oder nehmen Sie an unserer Community-Diskussion teil. Lassen Sie uns gemeinsam die Grenzen der **Computational Intelligence erweitern!**

**Quellcode / Community / Dokumentation**

Paper: [https://arxiv.org/abs/2301.12457](https://arxiv.org/abs/2301.12457 "https://arxiv.org/abs/2301.12457")

GitHub: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Dokumentation: [https://evox.readthedocs.io/en/latest/](https://evox.readthedocs.io/en/latest/ "https://evox.readthedocs.io/en/latest/")

QQ-Gruppe: 297969717

![4.png](/images/articles/evox-1-1-0-1.png)
