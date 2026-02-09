---
title: "Notas de Lançamento do EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Correções de bugs para captura de grafo do torch.compile, quebras de grafo no use_state e vazamentos de BatchedTensor."
---

**O que mudou**

**Esta versão secundária inclui principalmente correções de bugs e melhorias:**

- Corrigido um problema onde o `torch.compile` não capturava corretamente o `workflow.step`.

- Corrigido um problema onde o `use_state` causava uma quebra de grafo.

- Corrigidos alguns usos incorretos de buffer de modelo.

- Corrigido um problema onde o monitor.plot não estava funcionando como pretendido.

- Introduzido um novo wrapper, `evox.compile`, para contornar certas limitações com o `torch.compile` e o `torch.vmap`.

- Resolvidos vários problemas relacionados ao `BatchedTensor`:- Corrigido um bug onde o vmapping de um workflow com EvalMonitor poderia causar vazamentos de BatchedTensor.

- Corrigido um problema que impedia o HPOProblem de funcionar com o BraxProblem.

- Aprimoradas as implementações de RVEA e CSO para melhor desempenho e confiabilidade.

- Aprimorada a implementação do BraxProblem.

- Várias pequenas correções e melhorias.

**Código Aberto e Comunidade**

**Artigo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Grupo QQ | Evolving Machine Intelligence