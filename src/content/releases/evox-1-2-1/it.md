---
title: "EvoX v1.2.1 Note di rilascio"
pubDate: 2025-05-13
summary: "Miglioramenti di stabilità, nuove funzioni benchmark (Ellipsoid, Griewank) e correzioni di bug."
---

Questo è un rilascio minore focalizzato sul miglioramento della stabilità e sulla correzione di bug, con alcuni miglioramenti alla qualità d'uso.

**Nuove funzionalità**

Nuove funzioni benchmark: aggiunte funzioni numeriche mono-obiettivo: `Ellipsoid` e `Griewank`.

**Correzioni di bug**

* Corretto un problema in cui `StdWorkflow` non funzionava con algoritmi che ereditano da altri algoritmi.

* Corretto un bug nella funzione `latin_hypercube_sampling_standard`.

* Risolto un problema con `non_dominate` che falliva sotto `torch.compile`.

* Corretto un problema in cui `PSO` non utilizzava correttamente il dispositivo predefinito in alcuni casi.

**Refactoring e manutenzione**

* Riesportate le utility di uso comune al livello superiore per comodità, ad esempio:

* `evox.compile` al posto di `evox.core.compile`

* `evox.vmap` al posto di `evox.core.vmap`.

* Rimosso codice deprecato o ridondante.

Changelog completo: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Codice open source / Risorse della comunità**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Progetto upstream (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Gruppo QQ: 297969717

![图片11.png](./evox-1-2-1-1.png)

Gruppo QQ | Evolving Machine Intelligence
