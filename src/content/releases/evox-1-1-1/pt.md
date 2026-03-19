---
title: "Notas de Lançamento do EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Correções de erros para a captura de grafos do torch.compile, quebras de grafos no use_state e fugas no BatchedTensor."
---

**O que mudou**

**Esta versão secundária inclui principalmente correções de erros e melhorias:**

- Corrigido um problema em que o `torch.compile` não capturava corretamente o `workflow.step`.

- Corrigido um problema em que o `use_state` causava uma quebra de grafo.

- Corrigida a utilização incorreta de alguns buffers de modelo.

- Corrigido um problema em que o `monitor.plot` não funcionava como pretendido.

- Introduzido um novo wrapper, `evox.compile`, para contornar certas limitações do `torch.compile` e `torch.vmap`.

- Resolvidos vários problemas relacionados com o `BatchedTensor`:- Corrigido um erro em que o vmapping de um workflow com `EvalMonitor` podia causar fugas de `BatchedTensor`.

- Corrigido um problema que impedia o `HPOProblem` de funcionar com o `BraxProblem`.

- Melhoradas as implementações de `RVEA` e `CSO` para melhor desempenho e fiabilidade.

- Melhorada a implementação do `BraxProblem`.

- Várias pequenas correções e melhorias.

**Código Open-Source e Comunidade**

**Artigo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](./evox-1-1-1-1.png)

  Grupo QQ | Evolving Machine Intelligence