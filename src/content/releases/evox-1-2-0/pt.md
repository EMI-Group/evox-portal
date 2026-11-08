---
title: "Notas de Lançamento do EvoX v1.2.0"
pubDate: 2025-04-23
summary: "Novas funcionalidades, incluindo final_step(), o ambiente Mujoco Playground, tutoriais para utilizadores e integração com o EvoMO."
---

![Modelo de simulação física num ambiente de teste](./mujoco-playground.webp)

**Temos o prazer de anunciar o lançamento do "EvoX v1.2.0", repleto de novas funcionalidades, melhorias e correções de erros importantes!**

**Esta atualização melhora a flexibilidade e o desempenho da framework em módulos fundamentais.**

## Destaques
-  Adicionado o `final_step()` e atualizados o `hpo_wrapper` e o `std_workflow` para fluxos de execução mais fluidos.

-  Introduzido o "Mujoco Playground" — um novo ambiente para experiências de reinforcement learning.

-  Lançado um novo [tutorial](https://evox.readthedocs.io/en/latest/tutorial/ "https://evox.readthedocs.io/en/latest/tutorial/") para ajudar os utilizadores a familiarizarem-se rapidamente.

-  Adicionadas novas funções de extensão do EvoX, permitindo uma melhor integração com projetos irmãos como o [EvoMO](https://github.com/EMI-Group/evomo/ "https://github.com/EMI-Group/evomo/").

-  Várias correções de erros e atualizações na documentação para maior estabilidade e clareza.

## Pull Requests Relacionados
- Atualizações de docstrings para MOEAs -- [#230](https://github.com/EMI-Group/evox/pull/230) (@Zhenyu2Liang)

- Correção de `vmap` em `hpo_wrapper.py` -- [#232](https://github.com/EMI-Group/evox/pull/232) (@starquakee)

- Adicionado RVEAa e suporte melhorado para DTLZ, IGD, RVEA -- [#231](https://github.com/EMI-Group/evox/pull/231) (@XU-Boqing)

- Atualizações de `final_step()` em módulos de workflow -- [#233](https://github.com/EMI-Group/evox/pull/233) (@XU-Boqing)

- Ambiente Mujoco Playground -- [#234](https://github.com/EMI-Group/evox/pull/234) (@Nam-dada)

- Refinamentos na documentação -- [#235](https://github.com/EMI-Group/evox/pull/235) (@Zhenyu2Liang)

- Correções de erros para o Mujoco Playground -- [#236](https://github.com/EMI-Group/evox/pull/236) (@Nam-dada)

- Novo tutorial para utilizadores -- [#237](https://github.com/EMI-Group/evox/pull/237) (@BillHuang2001)

**Changelog Completo**: [v1.1.2...v1.2.0](https://github.com/EMI-Group/evox/compare/v1.1.2...v1.2.0)

## Recursos

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentação](https://evox.readthedocs.io/en/latest/)
