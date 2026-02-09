---
title: "Notas de Lançamento do EvoX v1.2.2"
pubDate: 2025-06-03
summary: "Uma versão menor focada em correções de bugs, incluindo ajustes no algoritmo DE e melhorias na documentação."
---

Esta é uma versão menor focada exclusivamente em correções de bugs:

- Removidos imports não utilizados para melhorar a limpeza do código.
- Corrigido comportamento não pretendido em certos algoritmos de Evolução Diferencial (DE) onde o `step` estava sendo chamado dentro do `init_step`.
- Diversas correções na documentação.

**Changelog Completo**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)