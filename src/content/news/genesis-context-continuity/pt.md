---
title: "Genesis: continuar o desenvolvimento além da janela de contexto"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 liga compressão, tarefas persistentes em segundo plano e pontos de controlo com orçamento para trabalhos prolongados."
---

Uma compilação longa, uma resposta extensa de uma ferramenta e uma conversa crescente impõem pressões diferentes ao desenvolvimento com IA. Genesis 0.13.10, publicado a 29 de outubro de 2026, prossegue as melhorias de 0.13.8, separando a execução em curso da conversa limitada disponível ao modelo. A continuidade da infraestrutura EvoX exige gerir ambas.

## Compressão segundo o orçamento do modelo

A versão 0.13.8 introduz duas etapas: reduzir resultados de ferramentas sem chamar o modelo e depois produzir um resumo de controlo. O limiar depende da janela de contexto, configurável por agente, e inclui uma atualização do estado de execução. Um indicador mostra utilização e número de compressões.

A versão 0.13.10 resolve o caso em que mensagens recentes demasiado grandes impediam uma redução suficiente. O histórico recente recebe um orçamento de tokens, os pares chamada/resultado permanecem intactos e as atualizações obsoletas são eliminadas, mantendo apenas uma atual. Pretende-se preservar um contexto utilizável, sem afirmar que a memória não tem perdas.

## A execução ultrapassa um segmento de conversa

As tarefas shell independentes de 0.13.8 sobrevivem à compressão e notificam a conclusão. O agente pode consultar a saída, listar tarefas ou pará-las sem manter toda a operação numa chamada bloqueante. A versão 0.13.9 corrige também tarefas que permaneciam no estado de execução no backend de sandbox systemd.

## Continuidade exige estado observável

Um teste demorado precisa de um ciclo de vida de execução, estado e saída independente do resumo da conversa. Estas alterações tornam essa separação explícita. Não garantem a conclusão de todas as tarefas nem a preservação de cada detalhe nos resumos. Oferecem uma base mais fácil de inspecionar para continuar com um contexto finito.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)
