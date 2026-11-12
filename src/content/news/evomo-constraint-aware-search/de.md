---
title: "EvoMO: Die Zulässigkeit jedes Kandidaten durchgehend erhalten"
pubDate: 2026-10-30
summary: "Nebenbedingungen, konsistente ungerade Populationen und ein effizienterer OSP-NSDE-Pfad machen Mehrzielexperimente besser kontrollierbar."
---

Ein guter Zielfunktionswert hilft nur, wenn ein Kandidat auch die Nebenbedingungen erfüllt. Am 30. Oktober 2026 integrierte EvoMO [PR #48][s1] in main. Die Änderung erweitert die Behandlung von Nebenbedingungen und korrigiert die Populationsverwaltung. Sie verbindet drei praktische Fragen: Welche Lösungen bleiben erhalten, passen ihre gespeicherten Zustände weiterhin zusammen und wie teuer ist die Auswahl?

![Kandidatenpfade durchqueren eine Nebenbedingungsgrenze durch ein ausgewähltes Tor](./cover.webp)

*Konzeptillustration: Die Zulässigkeitsinformation begleitet den Kandidaten bei der Auswahl.*

## Zulässigkeit im gesamten Ablauf erhalten

Ein beschränktes Problem kann `(fitness, cv)` zurückgeben und damit Zielwerte und Verletzungen verbinden. Die Implementierung führt diese Informationen durch Initialisierung, Probeauswertungen, Paarung, Archive und Überlebendenauswahl. Gemeinsame Hilfsfunktionen behandeln positive Gesamtverletzungen, Gleichstände und unterschiedliche Formen von Nebenbedingungen; Entscheidungen, Fitness und Verletzungszustand bleiben gleich indiziert.

Tauschen zwei Kandidaten ihre Position, muss die Zulässigkeitsinformation mitwandern. Bei einer Entwurfssuche zwischen Leistung und Ressourcen unter einer festen Betriebsgrenze könnte eine reine Zielsortierung attraktive, aber unzulässige Lösungen behalten. Der mitgeführte Zustand erlaubt jedem Verfahren, seine dokumentierte Regel anzuwenden. Diese bleibt algorithmusspezifisch.

## Auch ungerade Populationen müssen stimmen

Die Änderung behebt Formfehler in der ersten Generation bei angeforderten Größen wie 51 in acht Verfahren, darunter SparseEA, SparseEA2, DMMOEA und OSP_NSDE. Elternpaarung und tatsächliche Nachkommenzahl passen zu Masken, Fitness und Nebenbedingungen. Das ist relevant, wenn die Größe aus dem Versuchsbudget statt aus einer bequemen geraden Zahl folgt.

Auch dünn besetzte und dynamische Verfahren werden an Referenzabläufe angepasst. DMMOEA erkennt Umweltänderungen durch erneute Auswertung einer Stichprobe und aktualisiert Fitness- und Verletzungscaches. Die SparseEA-Familie hält Entscheidungen und Sparsitätsmasken bei Variation und Auswahl zusammen. Dies bestimmt die tatsächlich ausgeführte Suche, nicht bloß den erfolgreichen Programmabschluss.

## Schnellere Auswahl mit klaren Grenzen

OSP-NSDE sortiert Nachbarabstände einmal und aktualisiert sie nach Löschungen. Optionale Triton-Kernel verlagern unterstützte Kürzungen der Grenzfront auf CUDA. Der automatische Pfad gilt für unterstützte Geräte, float32/float64 und angeforderte Größen bis 128; sonst wird PyTorch verwendet. Die nichtdominierte Rangbildung bleibt in PyTorch.

Für die Kompilierung zuerst initialisieren, danach `torch.compile(workflow.step, fullgraph=False)` verwenden. Vorhersage, lokale Suche und Mischmodelle enthalten weiterhin Eager-Abschnitte. Die im PR berichteten lokalen RTX-5060-Ti-Messungen nutzen synchronisierte Zeiten und feste Budgets. Gesamtmessungen zeigen auch, dass Kompilierung nicht immer schneller als optimiertes Eager ist. Entscheidend ist die vollständige Arbeitslast.

## Vor dem Skalieren die Suche prüfen

Neu sind MaOEAHAP, NRVMOEA, HEA und GCNMOEA. Die ersten drei lehnen Nebenbedingungstupel ausdrücklich ab. GCNMOEA nutzt Verletzungen beim Nachbarschaftsersatz, andere Komponenten bleiben zielbasiert. Prüfen Sie diese Grenzen, bevor Sie Methoden als austauschbar behandeln.

Fixieren Sie für vorhandene Experimente den [integrierten Quellstand][s2], Seed und Auswertungsbudget. Vergleichen Sie nach einem Schritt gespeicherte Ziele und Verletzungen mit einer erneuten Auswertung. Nehmen Sie ungerade Populationen und beschränkte Fälle auf und erfassen Sie Zulässigkeit, Qualität und Zeit getrennt. Der [EvoMO-Versionsüberblick][related] beschreibt die veröffentlichte Grundlage, dieses main-Update die nachfolgenden Auswahländerungen.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /de/releases/evomo-0-3-1
