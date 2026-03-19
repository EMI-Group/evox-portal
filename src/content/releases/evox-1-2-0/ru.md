---
title: "Примечания к релизу EvoX v1.2.0"
pubDate: 2025-04-23
summary: "Новые функции, включая final_step(), среду Mujoco Playground, руководства для пользователей и интеграцию с EvoMO."
---

**Мы рады объявить о выходе «EvoX v1.2.0», наполненного новыми функциями, улучшениями и важными исправлениями ошибок!**

**Это обновление повышает гибкость и производительность фреймворка в ключевых модулях.**

**Основные изменения:**

-  Добавлен `final_step()` и обновлены `hpo_wrapper` и `std_workflow` для более плавного выполнения рабочих процессов.

-  Представлена «Mujoco Playground» — новая среда для экспериментов по обучению с подкреплением.

-  Выпущено совершенно новое [руководство](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/"), которое поможет пользователям быстро освоиться.

-  Добавлены новые функции расширения EvoX, обеспечивающие лучшую интеграцию с дочерними проектами, такими как [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/").

-  Различные исправления ошибок и обновления документации для большей стабильности и ясности.

**Связанные Pull Requests:**

- Обновления docstring для MOEA — [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- Исправление `vmap` в `hpo_wrapper.py` — [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

- Добавлен RVEAa и улучшена поддержка DTLZ, IGD, RVEA — [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- Обновления `final_step()` в модулях workflow — [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

- Среда Mujoco Playground — [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

- Улучшения документации — [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

- Исправления ошибок для Mujoco Playground — [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

- Новое руководство для пользователей — [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**Полный список изменений**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

**Исходный код / Ресурсы сообщества**

Статья:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Основной проект (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Группа QQ: 297969717

![图片11.png](./evox-1-2-0-1.png)

Группа QQ | Evolving Machine Intelligence