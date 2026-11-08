---
title: "Genesis: preservar o progresso do software entre mudanças de modelo"
pubDate: 2026-11-03
summary: "Uma passagem de compilador explora como código aceite, estrutura e registos de verificação sustentam o desenvolvimento quando o modelo muda."
updatedDate: 2026-11-08
---

O [registo Evidence de 7 de setembro de 2026](https://genesis.evox.group/evidence/compiler-continuation/) descreve a passagem de **GLM 5.2 para DeepSeek V4 Flash** na mesma linhagem aceite. O contexto da conversa anterior não foi transferido.

![Um projeto de compilador preservado entre ferramentas](./compiler-model-handoff.webp)

Continuavam disponíveis código, estrutura e histórico.

## Preservar o sistema herdado

Um compilador liga análise sintática, semântica, representações intermédias e geração de código. Uma alteração local pode afetar outros módulos: acrescentar código exige integração e testes de regressão.

O repositório jcc mostra implementação Rust, representação intermédia, limites funcionais e ferramentas de teste. O README descreve outro momento do desenvolvimento e não substitui o registo da continuação.

## Resultados reportados

A profundidade recursiva aumenta de **4 para 8**, com **1.820/1.820 casos LLVM SingleSource retidos aprovados** após a passagem. É o conjunto de avaliação definido, não toda a suite LLVM. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

A profundidade descreve a decomposição de tarefas, não diretamente a qualidade. Os testes fornecem evidência comportamental; a fiabilidade geral exigiria outras tarefas e repetições.

## Interpretar a continuidade

A lição prática é preservar o que um sucessor pode verificar: código, interfaces, restrições, alterações aceites e procedimentos de avaliação. A memória da conversa pode ajudar sem ser o único suporte do progresso.

## Desenvolvimento que acumula resultados

Formação e continuação partilham [o mesmo repositório](https://github.com/EMI-Group/genesis-demo-jcc). Não são projetos independentes nem devem acumular testes com âmbitos diferentes. Código acrescentado e custo da continuação não foram reportados.

Uma passagem de trabalho útil reúne a revisão aceite, a lista de testes, os comandos e as exclusões conhecidas. Atribua ao modelo seguinte uma pequena alteração verificável e compare-a com essa base. A [vista do histórico](/pt/news/genesis-development-history) explica como acompanhar os contributos após a conclusão de um agente.
