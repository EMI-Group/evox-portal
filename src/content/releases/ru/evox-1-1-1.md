---
title: "EvoX v1.1.1 — примечания к релизу"
pubDate: 2025-03-16
summary: "Исправления ошибок захвата графа torch.compile, разрывов графа use_state и утечек BatchedTensor."
---

**Что изменилось**

**Этот минорный релиз в основном включает исправления ошибок и улучшения:**

- Исправлена проблема, при которой `torch.compile` некорректно захватывал `workflow.step`.

- Исправлена проблема, при которой `use_state` приводил к разрыву графа.

- Исправлено некорректное использование буферов модели.

- Исправлена проблема, при которой monitor.plot работал не так, как предполагалось.

- Представлена новая обёртка `evox.compile` для обхода определённых ограничений `torch.compile` и `torch.vmap`.

- Решены различные проблемы, связанные с `BatchedTensor`:- Исправлена ошибка, при которой применение vmap к рабочему процессу с EvalMonitor могло вызывать утечки BatchedTensor.

- Исправлена проблема, препятствовавшая работе HPOProblem с BraxProblem.

- Улучшены реализации RVEA и CSO для повышения производительности и надёжности.

- Улучшена реализация BraxProblem.

- Различные мелкие исправления и улучшения.

**Открытый исходный код и сообщество**

**Статья**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Вышестоящий проект (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**QQ-группа**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  QQ-группа | Evolving Machine Intelligence
