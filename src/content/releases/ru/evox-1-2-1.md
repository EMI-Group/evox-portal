---
title: "EvoX v1.2.1 — примечания к релизу"
pubDate: 2025-05-13
summary: "Улучшения стабильности, новые бенчмарк-функции (Ellipsoid, Griewank) и исправления ошибок."
---

Это минорный релиз, направленный на повышение стабильности и устранение ошибок, с несколькими улучшениями для удобства использования.

**Новые функции**

Новые бенчмарк-функции: добавлены однокритериальные численные функции: `Ellipsoid` и `Griewank`.

**Исправления ошибок**

* Исправлена проблема, при которой `StdWorkflow` не работал с алгоритмами, наследующими от других алгоритмов.

* Исправлена ошибка в функции `latin_hypercube_sampling_standard`.

* Устранена проблема с `non_dominate`, не работавшей под `torch.compile`.

* Исправлена проблема, при которой `PSO` в некоторых случаях некорректно использовал устройство по умолчанию.

**Рефакторинг и сопровождение**

* Часто используемые утилиты реэкспортированы на верхний уровень для удобства, например:

* `evox.compile` вместо `evox.core.compile`

* `evox.vmap` вместо `evox.core.vmap`.

* Удалён устаревший или избыточный код.

Полный список изменений: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Открытый исходный код / Ресурсы сообщества**

Статья:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Вышестоящий проект (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ-группа: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

QQ-группа | Evolving Machine Intelligence
