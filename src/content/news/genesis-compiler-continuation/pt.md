---
title: "Genesis: preservar o progresso do software entre mudanças de modelo"
pubDate: 2026-11-03
updatedDate: 2026-11-07
summary: "Uma passagem de compilador explora como código aceite, estrutura e registos de verificação sustentam o desenvolvimento quando o modelo muda."
---

*Atualizado a 7 de novembro de 2026. Os resultados históricos mantêm a data de referência.*

Os sistemas de IA evolutiva precisam de preservar progressos úteis quando mudam os participantes. A passagem de compilador do Genesis examina esta necessidade: pode um novo modelo continuar a partir do projeto aceite, usando o código, as restrições e os testes como base para trabalho adicional?

## Partir de um compilador existente

O [registo Evidence de 7 de setembro de 2026](https://genesis.evox.group/evidence/compiler-continuation/) descreve a passagem de **GLM 5.2 para DeepSeek V4 Flash** na mesma linhagem aceite. O contexto da conversa anterior não foi transferido.

Continuavam disponíveis código, estrutura e histórico. Trata-se da continuação de um projeto, não da construção de um segundo compilador independente.

## Preservar o sistema herdado

Um compilador liga análise sintática, semântica, representações intermédias e geração de código. Uma alteração local pode afetar outros módulos: acrescentar código exige integração e testes de regressão.

O repositório jcc mostra implementação Rust, representação intermédia, limites funcionais e ferramentas de teste. O README descreve outro momento do desenvolvimento e não substitui o registo da continuação.

## Resultados reportados

A profundidade recursiva aumenta de **4 para 8**, com **1.820/1.820 casos LLVM SingleSource retidos aprovados** após a passagem. É o conjunto de avaliação definido, não toda a suite LLVM.

A profundidade descreve a decomposição de tarefas, não diretamente a qualidade. Os testes fornecem evidência comportamental; a fiabilidade geral exigiria outras tarefas e repetições.

## Interpretar a continuidade

A lição prática é preservar o que um sucessor pode verificar: código, interfaces, restrições, alterações aceites e procedimentos de avaliação. A memória da conversa pode ajudar sem ser o único suporte do progresso.

Comece pela referência herdada e pela lista exata de testes. Registe revisão aprovada, exclusões e comandos antes de comparar melhorias posteriores.

## Desenvolvimento que acumula resultados

Formação e continuação partilham [o mesmo repositório](https://github.com/EMI-Group/genesis-demo-jcc). Não são projetos independentes nem devem acumular testes com âmbitos diferentes. Código acrescentado e custo da continuação não foram reportados.

Este caso relatado pelo projeto transforma a continuidade numa questão arquitetural: o que deve preservar um projeto para que outros agentes o ampliem? No EvoX, isto liga capacidades dos modelos ao desenvolvimento cumulativo de sistemas. O conjunto de testes mantido sustenta esta passagem; uma fiabilidade mais ampla exige avaliação adicional.
