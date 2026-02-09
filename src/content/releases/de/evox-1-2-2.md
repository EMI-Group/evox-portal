---
title: "EvoX v1.2.2 Versionshinweise"
pubDate: 2025-06-03
summary: "Ein kleineres Release, das sich auf Fehlerbehebungen konzentriert, einschließlich Korrekturen an DE-Algorithmen und Verbesserungen der Dokumentation."
---

Dies ist ein kleineres Release, das sich ausschließlich auf Fehlerbehebungen konzentriert:

- Nicht verwendete Importe wurden entfernt, um die Sauberkeit des Codes zu verbessern.
- Unbeabsichtigtes Verhalten in bestimmten Differential Evolution (DE) Algorithmen behoben, bei denen `step` innerhalb von `init_step` aufgerufen wurde.
- Verschiedene Korrekturen in der Dokumentation.

**Vollständiges Änderungsprotokoll**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)