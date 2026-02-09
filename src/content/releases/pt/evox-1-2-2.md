---
title: "Notas de Lançamento do EvoX v1.2.2"
pubDate: 2025-06-03
summary: "Uma versão menor focada na correção de erros, incluindo correções nos algoritmos DE e melhorias na documentação."
---

Esta é uma versão menor focada exclusivamente na correção de erros:

- Remoção de importações não utilizadas para melhorar a limpeza do código.
- Correção de comportamento indesejado em certos algoritmos de Differential Evolution (DE) onde o `step` estava a ser chamado dentro do `init_step`.
- Várias correções na documentação.

**Changelog Completo**: [v1.2.1...v1.2.2](https://github.com/EMI-Group/evox/compare/v1.2.1...v1.2.2)