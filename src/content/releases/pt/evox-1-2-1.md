---
title: "EvoX v1.2.1 Notas de lançamento"
pubDate: 2025-05-13
summary: "Melhorias de estabilidade, novas funções de benchmark (Ellipsoid, Griewank) e correções de bugs."
---

Esta é uma versão menor focada em melhorar a estabilidade e corrigir bugs, com algumas melhorias de qualidade de vida.

**Novas Funcionalidades**

Novas Funções de Benchmark: Adicionadas funções numéricas mono-objetivo: `Ellipsoid` e `Griewank`.

**Correções de Bugs**

* Corrigido um problema em que `StdWorkflow` não funcionava com algoritmos que herdam de outros algoritmos.

* Corrigido um bug na função `latin_hypercube_sampling_standard`.

* Resolvido um problema com `non_dominate` a falhar sob `torch.compile`.

* Corrigido um problema em que `PSO` não utilizava o dispositivo predefinido corretamente em certos casos.

**Refatoração e Manutenção**

* Re-exportados utilitários de uso comum para o nível superior por conveniência, por exemplo:

* `evox.compile` em vez de `evox.core.compile`

* `evox.vmap` em vez de `evox.core.vmap`.

* Removido código obsoleto ou redundante.

Full Changelog: [https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1](https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1 "https://github.com/EMI-Group/evox/compare/v1.2.0...v1.2.1")

**Código Open Source / Recursos da Comunidade**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projeto Principal (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![图片11.png](/images/articles/evox-1-2-1-1.png)

Grupo QQ | Evolving Machine Intelligence
