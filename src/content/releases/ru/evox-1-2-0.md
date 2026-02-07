---
title: "EvoX v1.2.0 — примечания к релизу"
pubDate: 2025-04-23
summary: "Новые функции: final_step(), среда Mujoco Playground, пользовательские руководства и интеграция EvoMO."
---

**Мы рады объявить о выпуске «EvoX v1.2.0» с множеством новых функций, улучшений и важных исправлений ошибок!**

**Это обновление повышает гибкость и производительность фреймворка в ключевых модулях**.

**Основные изменения:**

-  Добавлен `final_step()` и обновлены `hpo_wrapper` и `std_workflow` для более плавного выполнения рабочих процессов.

-  Представлен «Mujoco Playground» — новая среда для экспериментов с обучением с подкреплением.

-  Выпущено совершенно новое [руководство](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/"), помогающее пользователям быстро освоиться.

-  Добавлены новые функции расширения EvoX, обеспечивающие лучшую интеграцию с дочерними проектами, такими как [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/").

-  Различные исправления ошибок и обновления документации для повышения стабильности и ясности.

**Связанные Pull Requests:**

- Обновления docstring для MOEA — [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- Исправление `vmap` в `hpo_wrapper.py` — [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

-  Добавлены RVEAa и улучшена поддержка DTLZ, IGD, RVEA — [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- Обновления `final_step()` в модулях рабочих процессов — [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

-  Среда Mujoco Playground — [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

-  Доработка документации — [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

-  Исправления ошибок для Mujoco Playground — [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

-  Новое руководство для пользователей — [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**Полный список изменений**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**Открытый исходный код / Ресурсы сообщества**

Статья:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Вышестоящий проект (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

QQ-группа: 297969717

![图片11.png](/images/articles/evox-1-2-0-1.png)

QQ-группа | Evolving Machine Intelligence
