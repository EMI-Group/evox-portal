---
title: "EvoX v1.1.1 Notas de lançamento"
pubDate: 2025-03-16
summary: "Correções de bugs para captura de grafo torch.compile, interrupções de grafo use_state e vazamentos de BatchedTensor."
---

**O Que Mudou**

**Esta versão menor inclui principalmente correções de bugs e melhorias:**

- Corrigido um problema onde `torch.compile` não capturava corretamente `workflow.step`.

- Corrigido um problema onde `use_state` causava uma quebra de grafo.

- Corrigido uso incorreto de buffers de modelo.

- Corrigido um problema onde monitor.plot não estava funcionando como esperado.

- Introduzido um novo wrapper, `evox.compile`, para contornar certas limitações com `torch.compile` e `torch.vmap`.

- Resolvidos diversos problemas relacionados a `BatchedTensor`:- Corrigido um bug onde o vmapping de um workflow com EvalMonitor poderia causar vazamentos de BatchedTensor.

- Corrigido um problema que impedia HPOProblem de funcionar com BraxProblem.

- Aprimoradas as implementações de RVEA e CSO para melhor desempenho e confiabilidade.

- Aprimorada a implementação de BraxProblem.

- Diversas pequenas correções e melhorias.

**Código Open Source e Comunidade**

**Artigo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Grupo QQ | Evolving Machine Intelligence
