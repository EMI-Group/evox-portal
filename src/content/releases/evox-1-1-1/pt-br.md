---
title: "Notas de Lançamento do EvoX v1.1.1"
pubDate: 2025-03-16
summary: "Correções de bugs para captura de grafo do torch.compile, quebras de grafo no use_state e vazamentos de BatchedTensor."
---

![Estrutura do programa exposta para inspeção](./graph-break-repair.webp)

## O que mudou

Esta versão secundária inclui principalmente correções de bugs e melhorias.
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

## Recursos

- [GitHub](https://github.com/EMI-Group/evox)
- [Documentação](https://evox.readthedocs.io/en/latest/)
