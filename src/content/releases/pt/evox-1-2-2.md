---
title: "EvoX v1.2.2 Notas de lançamento"
pubDate: 2025-06-03
summary: "Versão menor focada em correções do algoritmo DE e melhorias na documentação."
---

Esta é uma versão menor focada exclusivamente em correções de bugs:

- Remoção de importações não utilizadas para melhorar a limpeza do código.
- Correção de comportamento não intencional em certos algoritmos de Differential Evolution (DE) onde `step` estava a ser chamado dentro de `init_step`.
- Várias correções na documentação.

**Full Changelog**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)
