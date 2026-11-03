---
title: "Notas de lançamento do EvoX v1.0.1"
pubDate: 2025-01-20
summary: "Correções no instalador do Windows, na seleção de vetores de base da família DE e no SHADE com populações maiores."
---

O **EvoX v1.0.1** é uma versão de manutenção com três correções:

- Atualizado o script de instalação do Windows `win-install.bat` ([#204](https://github.com/EMI-Group/evox/pull/204)).
- Corrigida a seleção de vetores de base em DE, ODE e JaDE para utilizar uma seleção verdadeiramente aleatória ([#205](https://github.com/EMI-Group/evox/pull/205)).
- Corrigido um acesso fora dos limites do array no SHADE quando `pop_size > 100` ([#206](https://github.com/EMI-Group/evox/pull/206)).

**Lançamento**: [v1.0.1](https://github.com/EMI-Group/evox/releases/tag/v1.0.1) · **Histórico completo**: [v1.0.0...v1.0.1](https://github.com/EMI-Group/evox/compare/v1.0.0...v1.0.1)
