---
title: "Примечания к выпуску EvoX v1.2.1"
pubDate: 2025-05-13
summary: "Улучшения стабильности, новые функции бенчмарков (Ellipsoid, Griewank) и исправления ошибок."
---

Это минорный релиз, сосредоточенный на повышении стабильности и исправлении ошибок, а также включающий несколько улучшений для удобства использования.

**Новые возможности**

Новые функции бенчмарков: добавлены одноцелевые численные функции `Ellipsoid` и `Griewank`.

**Исправления ошибок**

* Исправлена проблема, из-за которой `StdWorkflow` не работал с алгоритмами, наследуемыми от других алгоритмов.

* Исправлена ошибка в функции `latin_hypercube_sampling_standard`.

* Решена проблема со сбоем `non_dominate` при использовании `torch.compile`.

* Исправлена проблема, при которой `PSO` в некоторых случаях некорректно использовал устройство по умолчанию (`default device`).

**Рефакторинг и обслуживание**

* Для удобства часто используемые утилиты были реэкспортированы на верхний уровень, например:

* `evox.compile` вместо `evox.core.compile`

* `evox.vmap` вместо `evox.core.vmap`.

* Удален устаревший или избыточный код.

Полный список изменений: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Открытый исходный код / Ресурсы сообщества**

Статья:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Основной проект (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Группа QQ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Группа QQ | Evolving Machine Intelligence