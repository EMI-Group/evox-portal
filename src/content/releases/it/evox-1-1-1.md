---
title: "EvoX v1.1.1 Note di rilascio"
pubDate: 2025-03-16
summary: "Correzioni di bug per la cattura del grafo torch.compile, interruzioni del grafo use_state e perdite di BatchedTensor."
---

**Cosa è cambiato**

**Questo rilascio minore include principalmente correzioni di bug e miglioramenti:**

- Corretto un problema in cui `torch.compile` non catturava correttamente `workflow.step`.

- Corretto un problema in cui `use_state` causava un'interruzione del grafo.

- Corretti alcuni utilizzi errati dei buffer del modello.

- Corretto un problema in cui monitor.plot non funzionava come previsto.

- Introdotto un nuovo wrapper, `evox.compile`, per aggirare alcune limitazioni di `torch.compile` e `torch.vmap`.

- Risolti vari problemi relativi a `BatchedTensor`:- Corretto un bug in cui il vmapping di un workflow con EvalMonitor poteva causare perdite di BatchedTensor.

- Corretto un problema che impediva a HPOProblem di funzionare con BraxProblem.

- Migliorate le implementazioni di RVEA e CSO per prestazioni e affidabilità superiori.

- Migliorata l'implementazione di BraxProblem.

- Varie piccole correzioni e miglioramenti.

**Codice open source e comunità**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Progetto upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Gruppo QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Gruppo QQ | Evolving Machine Intelligence
