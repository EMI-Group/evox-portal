---
title: "Genesis converte openJiuwen para Rust e testa os contratos dos Agents"
pubDate: 2026-11-20
summary: "O novo Evidence agent-core-rs documenta 30 crates Rust, exemplos de recuperação e aprovação e 150,02 dólares de custos de modelo em duas tarefas."
---

Mudar a linguagem de implementação de um SDK de Agents vai além de traduzir funções. As sessões guardadas têm de ser restauradas, as ferramentas devem aguardar aprovação e os workflows seguir o ramo previsto. O [novo Evidence publicado pelo Genesis em 20 de novembro de 2026][evidence] concretiza estes comportamentos através de **agent-core-rs**, uma reimplementação em Rust de openJiuwen agent-core.

Usando o SDK Python v0.1.20 como referência apenas de leitura, o EvoX Genesis produziu **30 crates Rust e 26 exemplos executáveis**. O registo abrange a conversão inicial e o desenvolvimento posterior do código preservado. O contributo central é a ligação verificável entre objetivos de compatibilidade, exemplos executáveis e registos de verificação.

![Ilustração conceptual de código Python convertido em Rust com ramos de workflow correspondentes](./contract-migration-v2.webp)

## Mudar a implementação preservando o contrato

O [snapshot 242b5b5][repo] tem como alvos os campos Card JSON, formatos de comunicação dos modelos, dados de sessão persistentes, referências dos workflows e comportamento da CLI. Tipos e traits Rust, execução assíncrona com Tokio e serialização Serde substituem os mecanismos Python. Os tipos partilhados ficam abaixo dos seus consumidores; os crates agregadores reexportam as API sem duplicar comportamento.

A compatibilidade abrange o subconjunto implementado. A [matriz de cobertura][parity] distingue interfaces suportadas, implementações parciais e áreas adiadas: execução distribuída, GPU/ML e algumas integrações com fornecedores ou serviços externos. Onde existe um caminho Unsupported tipado, é devolvido um erro explícito; outras lacunas não têm implementação. A distinção importa na escolha da aplicação a migrar.

## Uma sessão restaurada e uma ferramenta à espera

O [exemplo de sessão][session] guarda um checkpoint em armazenamento temporário, cria uma nova sessão com a mesma identidade e raiz de armazenamento e restaura o estado. O teste atravessa uma fronteira de persistência: manter o primeiro objeto em memória não demonstraria a mesma propriedade.

O cenário de aprovação coloca uma barreira antes de uma chamada simulada a uma ferramenta. Um contador confirma que a ferramenta não foi executada enquanto aguardava aprovação. Uma nova invocação com os dados de aprovação correspondentes permite continuar. Um modelo com respostas programadas e uma ferramenta instrumentada tornam a ordem observável sem credenciais do fornecedor.

O [exemplo de workflow][workflow] verifica outro problema de integração. Duas entradas percorrem os ramos curto e longo da mesma topologia compilada, passando valores por referências aos campos dos nós. Ligar diretamente dois predecessores mutuamente exclusivos criaria uma conjunção que esperaria por ambos. Componentes de encaminhamento e ativação explícita das rotas permitem a qualquer ramo atingir o final comum. Preservar nomes de campos não basta para detetar este problema de escalonamento.

## Duas tarefas com custos delimitados

O [anexo histórico][history] regista uma conversão inicial de 11 a 16 de novembro UTC, interrompida manualmente com preservação do resultado, seguida de uma tarefa de evolução concluída em 19 de novembro UTC. As chamadas atribuídas a DeepSeek V4 Flash totalizam **150,024283 dólares** nas duas tarefas.

Os tempos decorridos somam **113 horas e 42 minutos**, incluindo esperas e filas; o intervalo de calendário ultrapassa oito dias. As 3.570 instâncias Agent registadas são cumulativas, não o pico de concorrência. O custo exclui infraestrutura, trabalho humano e documentação posterior. Uma tarefa intermédia falhada também é excluída, pois o seu consumo é desconhecido.

O anexo conta 1.434.767 linhas físicas Rust, incluindo comentários e linhas vazias, entre código de produção, testes e exemplos. Isso descreve a dimensão do artefacto; as verificações comportamentais determinam o que a reescrita preserva.

## O que a verificação estabelece

O [registo de verificação][parity] declara aprovação de formatação, Clippy, testes offline do workspace, Rustdoc, sete grupos de funcionalidades e compilação dos exemplos. **24.293 é o número de funções de teste no código-fonte**, não um total de aprovações capturado numa execução. Cinco entradas ignoradas são auxiliares ou sondas dependentes do ambiente. A tarefa documental posterior apenas repetiu verificações selecionadas.

Modelos com respostas programadas, servidores locais simulados, armazenamento temporário e sockets de loopback exercitam protocolos e execução. Permitem verificações repetíveis sem credenciais reais; o sucesso de tarefas com modelos reais exige outra avaliação. São resultados comunicados pelo projeto; não voltámos a executar independentemente a suite Rust.

## Operações locais mais rápidas, no âmbito medido

O [relatório de desempenho][bench] compara uma compilação Rust release com CPython 3.11.15 num host Linux com oito CPU lógicos e cache de páginas quente. A renderização de prompts demora **0,356 µs contra 16,37 µs**, cerca de **46×** mais rápida. Um grafo de dois nós sem I/O demora **7,23 µs contra 112,3 µs**, cerca de **15×**.

As medições usam lotes repetidos normalizados por operação; os lotes Rust são dez vezes maiores. A forma lógica do grafo coincide, mas os motores diferem. Os rácios descrevem a sobrecarga local do framework, excluindo latência de modelo/rede, arranque com cache fria e escalabilidade concorrente. As medições separadas do primeiro grafo Python e de um turno Agent programado em Rust executam tarefas diferentes e não estabelecem rácios comparáveis de arranque ou memória.

## Começar por um comportamento a preservar

Para avaliar uma migração, os exemplos de checkpoint, aprovação e encaminhamento condicional oferecem critérios concretos de aceitação. Verifique a integração pretendida na [matriz][parity], prepare o ambiente de compilação e utilize `make verify`. `cargo test --workspace --offline --no-fail-fast` inclui os crates de desenvolvimento omitidos por um simples `cargo test`.

O workspace é distribuído como código-fonte, com `publish = false`. Consulte o [Evidence completo][evidence] e a [implementação fixada][repo]. Em conjunto com a anterior [reimplementação de MESA](/pt/news/genesis-mesa), este caso mostra como avaliar o Genesis pelos comportamentos preservados e pela nova implementação.

[evidence]: https://genesis.evox.group/evidence/agent-core-rs/
[repo]: https://github.com/EMI-Group/agent-core-rs/tree/242b5b5243aa46c6b82edd6d3764d0b70c10d571
[parity]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/PARITY.md
[history]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/REWRITE_APPENDIX.md
[session]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/03_sessions_and_resume.rs
[workflow]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/crates/openjiuwen-examples/examples/04_workflow_pipeline.rs
[bench]: https://github.com/EMI-Group/agent-core-rs/blob/242b5b5243aa46c6b82edd6d3764d0b70c10d571/docs/BENCHMARKS.md

