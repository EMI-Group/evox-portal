---
title: "EvoX v1.1.1 Notas de lançamento"
pubDate: 2025-03-16
summary: "Correções de bugs para captura de grafo torch.compile, interrupções de grafo use_state e vazamentos de BatchedTensor."
---

**O Que Mudou**

**Esta versão menor inclui principalmente correções de bugs e melhorias:**

- Corrigido um problema em que `torch.compile` não capturava corretamente `workflow.step`.

- Corrigido um problema em que `use_state` provocava uma interrupção de grafo.

- Corrigida alguma utilização incorreta de buffers de modelo.

- Corrigido um problema em que monitor.plot não funcionava como pretendido.

- Introduzido um novo wrapper, `evox.compile`, para contornar certas limitações com `torch.compile` e `torch.vmap`.

- Resolvidos vários problemas relacionados com `BatchedTensor`:- Corrigido um bug em que o vmapping de um workflow com EvalMonitor podia causar fugas de BatchedTensor.

- Corrigido um problema que impedia o HPOProblem de funcionar com BraxProblem.

- Melhoradas as implementações de RVEA e CSO para melhor desempenho e fiabilidade.

- Melhorada a implementação de BraxProblem.

- Várias pequenas correções e melhorias.

**Código Open Source e Comunidade**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Principal (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/evox-1-1-1-1.png)

  Grupo QQ | Evolving Machine Intelligence
