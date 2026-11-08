---
title: "Genesis: preservar o progresso do software entre mudanças de modelo"
pubDate: 2026-11-03
summary: "Uma passagem de compilador explora como código aceito, estrutura e registros de verificação sustentam o desenvolvimento quando o modelo muda."
updatedDate: 2026-11-08
---

O [registro Evidence de 7 de setembro de 2026](https://genesis.evox.group/evidence/compiler-continuation/) descreve a passagem de **GLM 5.2 para DeepSeek V4 Flash** na mesma linhagem aceita. O contexto da conversa anterior não foi transferido.

![Uma ponte contínua conecta duas superfícies de desenho diferentes](./compiler-model-handoff.webp)

Continuavam disponíveis código, estrutura e histórico.

## Preservar o sistema herdado

Um compilador liga análise sintática, semântica, representações intermediárias e geração de código. Uma alteração local pode afetar outros módulos: acrescentar código exige integração e testes de regressão.

O repositório jcc mostra implementação Rust, representação intermediária, limites funcionais e ferramentas de teste. O README descreve outro momento do desenvolvimento e não substitui o registro da continuação.

## Resultados reportados

A profundidade recursiva aumenta de **4 para 8**, com **1.820/1.820 casos LLVM SingleSource retidos aprovados** após a passagem. É o conjunto de avaliação definido, não toda a suite LLVM. [GW-000002](https://genesis.evox.group/evidence/evidence.json)

A profundidade descreve a decomposição de tarefas, não diretamente a qualidade. Os testes fornecem evidência comportamental; a confiabilidade geral exigiria outras tarefas e repetições.

## Interpretar a continuidade

A lição prática é preservar o que um sucessor pode verificar: código, interfaces, restrições, alterações aceitas e procedimentos de avaliação. A memória da conversa pode ajudar sem ser o único suporte do progresso.

## Desenvolvimento que acumula resultados

Formação e continuação compartilham [o mesmo repositório](https://github.com/EMI-Group/genesis-demo-jcc). Não são projetos independentes nem devem acumular testes com âmbitos diferentes. Código acrescentado e custo da continuação não foram reportados.

Uma transferência útil reúne a revisão aceita, a lista de testes, os comandos e as exclusões conhecidas. Atribua ao próximo modelo uma pequena alteração verificável e compare-a com essa base. A [visualização do histórico](/pt-br/news/genesis-development-history) explica como acompanhar as contribuições após a conclusão de um agente.
