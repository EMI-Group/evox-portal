---
title: "EvoX v1.2.2 Release Note"
pubDate: 2025-06-03
summary: "A minor release focused on bug fixes including DE algorithm fixes and documentation improvements."
---

This is a minor release focused solely on bug fixes:

- Removed unused imports to improve code cleanliness.
- Fixed unintended behavior in certain Differential Evolution (DE) algorithms where `step` was being called within `init_step`.
- Various fixes in the documentation.

**Full Changelog**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
