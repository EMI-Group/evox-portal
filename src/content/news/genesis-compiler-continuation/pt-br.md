---
title: "Genesis continua o desenvolvimento de um compilador após trocar de modelo"
pubDate: 2026-11-03
summary: "O caso de continuação do Genesis relata 1,820/1,820 testes LLVM SingleSource selecionados aprovados após a troca de GLM 5.2 por DeepSeek V4 Flash."
---

Um projeto pode continuar avançando quando muda o modelo de base? O registro Compiler Continuation, de 7 de setembro de 2026, descreve a retomada a partir do repositório aceito do compilador, sem transferir o contexto da conversa do Agent anterior.

O registro relata a troca de **GLM 5.2 por DeepSeek V4 Flash**, com a profundidade de recursão aumentando de **4 para 8**. A continuação passou em **1,820/1,820 casos LLVM SingleSource mantidos para avaliação**. Trata-se de um conjunto definido, não de toda a suíte LLVM.

O código aceito e o histórico do projeto sustentam o trabalho seguinte: assim se manifesta a continuidade no Genesis. A criação do compilador e sua continuação compartilham um repositório e não devem ser contadas como projetos independentes.

Esta retrospectiva segue o registro Evidence. Os resultados são relatados pelo projeto, sem reprodução independente; o custo e o código adicionado na continuação não foram divulgados. O README da branch padrão descreve outra avaliação, cujos números não devem ser combinados com este resultado.

[Genesis Evidence](https://genesis.evox.group/evidence/compiler-continuation/) · [GitHub](https://github.com/EMI-Group/genesis-demo-jcc)
