---
title: "EvoX v1.2.1 Notas de lançamento"
pubDate: 2025-05-13
summary: "Melhorias de estabilidade, novas funções de benchmark (Ellipsoid, Griewank) e correções de bugs."
---

Esta é uma versão menor focada em melhorar a estabilidade e corrigir bugs, com algumas melhorias de qualidade de vida.

**Novas Funcionalidades**

Novas Funções de Benchmark: Adicionadas funções numéricas de objetivo único: `Ellipsoid` e `Griewank`.

**Correções de Bugs**

* Corrigido um problema onde `StdWorkflow` falhava ao trabalhar com algoritmos que herdam de outros algoritmos.

* Corrigido um bug na função `latin_hypercube_sampling_standard`.

* Resolvido um problema com `non_dominate` falhando sob `torch.compile`.

* Corrigido um problema onde `PSO` não usava o dispositivo padrão corretamente em certos casos.

**Refatoração e Manutenção**

* Re-exportados utilitários comumente usados para o nível superior por conveniência, por exemplo:

* `evox.compile` em vez de `evox.core.compile`

* `evox.vmap` em vez de `evox.core.vmap`.

* Removido código obsoleto ou redundante.

Changelog Completo: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Código Open Source / Recursos da Comunidade**

Artigo:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projeto Upstream (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Grupo QQ | Evolving Machine Intelligence
