---
title: "Genesis: continuar tarefas longas enquanto o contexto encolhe"
pubDate: 2026-10-29
summary: "Genesis 0.13.8–0.13.10 liga compressão, tarefas persistentes em segundo plano e pontos de controle com orçamento para trabalhos prolongados."
updatedDate: 2026-11-08
---

Um teste pode continuar em execução quando a conversa do agente já está cheia. O Genesis 0.13.8–0.13.10, publicado de 26 a 29 de outubro de 2026, separa esses ciclos: comprime o contexto de trabalho do modelo e mantém disponíveis a saída e o estado final dos trabalhos shell desacoplados.

![Uma prensa vermelha compacta uma fita fragmentada enquanto um fio separado permanece contínuo](./context-compression-continuity.webp)

*Comprimir o contexto de trabalho, continuar a execução.*

## Compressão segundo o orçamento do modelo

A versão 0.13.8 introduz duas etapas: reduzir resultados de ferramentas sem chamar o modelo e depois produzir um resumo de controle. O limiar depende da janela de contexto, configurável por agente, e inclui uma atualização do estado de execução. Um indicador mostra uso e número de compressões. [v0.13.8](https://github.com/EMI-Group/genesis/releases/tag/v0.13.8)

A versão 0.13.10 resolve o caso em que mensagens recentes grandes demais impediam uma redução suficiente. O histórico recente recebe um orçamento de tokens, os pares chamada/resultado permanecem intactos e as atualizações obsoletas são eliminadas, mantendo apenas uma atual. [v0.13.10](https://github.com/EMI-Group/genesis/releases/tag/v0.13.10)

## A execução ultrapassa um segmento de conversa

As tarefas shell independentes de 0.13.8 sobrevivem à compressão e notificam a conclusão. O agente pode consultar a saída, listar tarefas ou pará-las sem manter toda a operação em uma chamada bloqueante. A versão 0.13.9 corrige também tarefas que permaneciam no estado de execução no backend de sandbox systemd. [v0.13.9](https://github.com/EMI-Group/genesis/releases/tag/v0.13.9)

## Continuidade exige estado observável

Para compilações ou testes longos, use um trabalho desacoplado e acompanhe estado e saída após a compressão. O medidor de contexto mostra uso e número de compressões; o estado terminal indica conclusão ou falha. Os dois sinais ajudam a decidir o próximo passo. A [introdução ao Genesis](/pt-br/news/evox-genesis) descreve o fluxo geral.
