---
title: "Genesis continua o desenvolvimento de um compilador após mudar de modelo"
pubDate: 2026-11-03
summary: "O caso de continuação do Genesis reporta 1,820/1,820 testes LLVM SingleSource selecionados aprovados após a passagem de GLM 5.2 para DeepSeek V4 Flash."
---

Pode um projeto continuar a avançar quando muda o modelo de base? O registo Compiler Continuation, de 7 de setembro de 2026, descreve a retoma a partir do repositório aceite do compilador, sem transferir o contexto da conversa do Agent anterior.

O registo relata a passagem de **GLM 5.2 para DeepSeek V4 Flash**, com a profundidade de recursão a aumentar de **4 para 8**. A continuação passou **1,820/1,820 casos LLVM SingleSource mantidos para avaliação**. Trata-se de um conjunto definido, não de toda a bateria LLVM.

O código aceite e o histórico do projeto sustentam o trabalho seguinte: assim se manifesta a continuidade no Genesis. A criação do compilador e a sua continuação partilham um repositório e não devem ser contadas como projetos independentes.

Esta retrospetiva segue o registo Evidence. Os resultados são reportados pelo projeto, sem reprodução independente; o custo e o código acrescentado na continuação não foram divulgados. O README do ramo predefinido descreve outra avaliação, cujos valores não devem ser combinados com este resultado.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
