---
title: "Примечания к выпуску EvoX v1.0.1"
pubDate: 2025-01-20
summary: "Исправления установщика Windows, выбора базовых векторов в алгоритмах семейства DE и работы SHADE с большими популяциями."
---

![Проверка и исправление поведения алгоритмов](./bounded-random-selection.webp)

**EvoX v1.0.1** — выпуск сопровождения с тремя исправлениями:

- Обновлён скрипт установки Windows `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- В DE, ODE и JaDE исправлен выбор базовых векторов: теперь он действительно случайный ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Исправлен выход индекса за границы массива в SHADE при `pop_size > 100` ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Релиз**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Полный список изменений**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
