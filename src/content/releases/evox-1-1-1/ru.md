---
title: "Примечания к выпуску EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Исправления ошибок захвата графа torch.compile, разрывов графа use_state и утечек BatchedTensor."
---

**Что изменилось**

**Этот минорный релиз в основном включает исправления ошибок и улучшения:**

- Исправлена проблема, из-за которой `torch.compile` некорректно захватывал `workflow.step`.

- Исправлена проблема, при которой `use_state` приводил к разрыву графа.

- Исправлено некорректное использование буферов модели.

- Исправлена проблема, из-за которой monitor.plot работал некорректно.

- Представлена новая обертка `evox.compile` для обхода определенных ограничений `torch.compile` и `torch.vmap`.

- Решены различные проблемы, связанные с `BatchedTensor`:- Исправлена ошибка, при которой vmap воркфлоу с EvalMonitor мог вызывать утечки BatchedTensor.

- Исправлена проблема, препятствовавшая совместной работе HPOProblem и BraxProblem.

- Улучшены реализации RVEA и CSO для повышения производительности и надежности.

- Улучшена реализация BraxProblem.

- Различные мелкие исправления и улучшения.

**Исходный код и сообщество**

**Статья**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Основной проект (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Группа QQ**: 297969717

![image.png](./evox-1-1-1-1.png)

  Группа QQ | Evolving Machine Intelligence