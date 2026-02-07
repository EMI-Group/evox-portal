---
title: "EvoX v1.2.2 Versionshinweise"
pubDate: 2025-06-03
summary: "Kleinere Version mit Fokus auf DE-Algorithmus-Korrekturen und Dokumentationsverbesserungen."
---

Dies ist eine kleinere Version, die sich ausschliesslich auf Fehlerbehebungen konzentriert:

- Nicht verwendete Importe wurden entfernt, um die Code-Sauberkeit zu verbessern.
- Unbeabsichtigtes Verhalten in bestimmten Differential Evolution (DE) Algorithmen behoben, bei denen `step` innerhalb von `init_step` aufgerufen wurde.
- Verschiedene Korrekturen in der Dokumentation.

**Vollstaendiges Changelog**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
