---
title: "EvoX: dividir a avaliação, reunir o retorno da busca"
pubDate: 2025-04-23
summary: "O fluxo distribuído experimental do EvoX divide a avaliação dos candidatos e reúne a aptidão, alargando a busca para além de um dispositivo."
updatedDate: 2026-11-08
---

Quando avaliar candidatos domina o custo da busca, dividir esse trabalho pode permitir experimentos maiores. O guia experimental EvoX de 23 de abril de 2025 explica o caminho introduzido em março: dividir a população entre processos e reunir a aptidão antes de atualizar o algoritmo.

![Uma bandeja de população se divide em três recipientes de avaliação e se reúne em uma fila ordenada de resultados](./distributed-evaluation-feedback.webp)

*Avaliações separadas, retorno comum à população.*

## Distribuir a avaliação e reunir o retorno

StdWorkflow recebe opções de execução distribuída. A população é dividida na dimensão dos candidatos segundo o rank dos processos. Cada processo avalia a sua parte; as aptidões são depois reunidas e concatenadas antes de regressarem à atualização do algoritmo. [StdWorkflow](https://github.com/EMI-Group/evox/commit/388f0be9eb0ce01610a7ce60eb8050578a996dfb)

É avaliação distribuída em um fluxo coordenado, diferente de buscas independentes cujas respostas finais se comparam. Simulações ou funções objetivo custosas são aplicações plausíveis, desde que aceitem os lotes atribuídos e o ambiente esteja corretamente configurado.

## A reprodutibilidade faz parte da configuração

O guia destaca a definição de sementes antes de operações Torch ou NumPy e descreve a inicialização com torch.distributed ou torchrun. A implementação isola o estado do gerador aleatório durante a avaliação. A inicialização coerente mantém estados de busca compatíveis ao avaliar candidatos diferentes. [2025-04-23](https://github.com/EMI-Group/evox/commit/510452f70e30adeedebdaa4fc6e348a75d649643)

## Medir a geração completa

Compare a referência de um processo com a execução distribuída usando o mesmo objetivo, semente e orçamento de população. Registre o tempo de uma geração completa, incluindo comunicação, e confira a ordem dos candidatos e da aptidão. O [guia de início](/pt-br/news/evox-quickstart) apresenta o fluxo antes de adicionar dispositivos.
