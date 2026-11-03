---
title: "Genesis reconstrói 13 módulos do MESA em Rust"
pubDate: 2026-11-03
summary: "O caso MESA do Genesis demonstra a reescrita de software científico, com 1,052 testes aprovados e 10.64 dólares de custos relatados em tokens."
---

A reescrita de software científico exige preservar o comportamento numérico. O registro MESA de 7 de setembro de 2026 descreve a conversão de **13 módulos Fortran em crates Rust**, usando a implementação original como referência.

O registro relata **139,414 linhas Fortran → 89,946 linhas Rust**, **1,052 testes aprovados** e **10.64 dólares** em tokens. O repositório documenta testes de referência contra as saídas Fortran e 18 testes ignorados, além dos aprovados.

As acelerações medianas de **1.55–6.87×** em Evidence são resultados de benchmarks, não uma melhoria uniforme de todo o MESA. Separadamente, a tabela do README de 5 de agosto relata **1.25×** para a combustão em uma zona, usada como carga representativa de ponta a ponta. Cargas e momentos de medição distintos devem permanecer separados.

A migração cobre módulos numéricos e físicos selecionados, não todo o MESA; os motores de evolução estelar e binária ficam excluídos. O caso mostra como verificar o comportamento pode orientar a reescrita de código existente. Os resultados são relatados pelo projeto, sem reprodução independente; os custos dos tokens excluem o hardware.

[Genesis Evidence](https://genesis.evox.group/evidence/mesa/) · [GitHub](https://github.com/EMI-Group/genesis-demo-mesa-rs) · [README](https://github.com/EMI-Group/genesis-demo-mesa-rs/blob/main/README.md)
