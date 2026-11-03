---
title: "EvoX v1.0.1 Release Note"
pubDate: 2025-01-20
summary: "Bug fixes for the Windows installer, DE-family base-vector selection, and SHADE with larger populations."
---

**EvoX v1.0.1** is a maintenance release with three fixes:

- Updated the Windows installer script, `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- Corrected base-vector selection in DE, ODE, and JaDE to use true random selection ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Fixed an array-index-out-of-bounds error in SHADE when `pop_size > 100` ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Release**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Full changelog**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
