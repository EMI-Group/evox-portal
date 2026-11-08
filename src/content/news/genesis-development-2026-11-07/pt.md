---
title: "Genesis Assistant: compreender e gerir o trabalho em curso"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Consultar tarefas, compreender a capacidade do sistema e agir numa só conversa. As alterações recentes em main também simplificam serviços remotos, tarefas em segundo plano e credenciais dos modelos."
---

Uma tarefa de desenvolvimento prolongada levanta questões muito depois de arrancar: o que continua ativo, porque falhou uma tarefa e como prosseguir? As alterações integradas em `main` do Genesis entre 4 e 7 de novembro de 2026 levam essas questões à conversa Assistant do painel e melhoram os serviços subjacentes.

![Um programador verifica tarefas em execução e em pausa](./genesis-assistant-task-flows.webp)

*Uma conversa, vários fluxos de trabalho: uma ilustração editorial da ideia central desta atualização.*

## Partir da tarefa para escolher a ação

O Genesis Assistant pode ler o código e a documentação do Genesis, consultar tarefas e verificar a capacidade atual do escalonador. Pode pedir-lhe que examine o estado, o erro e o resultado de uma tarefa falhada e depois solicitar um passo seguinte, como retomar trabalho anterior. A conversa liga explicação e operações no nó que está a ser consultado.

O [guia do Assistant][assistant] apresenta pontos de partida concretos: listar trabalho em curso, verificar os lugares disponíveis dos modelos ou pausar o escalonamento durante uma fusão. O trabalho já iniciado continua durante a pausa. As definições temporárias de execução e a configuração guardada permanecem separadas; uma alteração de sessão não se torna implicitamente um valor permanente.

A consulta usa o nível `read`. As alterações usam `write`, com aprovação do código exato; `sudo` dispõe de um cartão separado. A ação proposta torna-se visível quando uma pergunta se transforma numa operação.

## Um servidor, duas formas de ligação

O desenvolvimento remoto e o painel HTTP partilham agora uma única instância de servidor. Antes, os comandos remotos iniciavam uma instância separada dedicada à distribuição. Com o [servidor partilhado][remote], `genesis remote stop` desativa a distribuição remota e mantém o painel HTTP disponível. Terminar a ligação de desenvolvimento remoto já não exige parar esse serviço HTTP comum.

## Detalhes que facilitam o acompanhamento

As [tarefas em segundo plano][jobs] recebem identificadores curtos como `bash-1`. Se o agente que faz a chamada tiver apenas uma tarefa, `job_output` encontra-a sem `job_id`; se tiver várias, devolve identificadores, estados e etiquetas para escolher a correta.

Os [caminhos personalizados dos ficheiros de credenciais OAuth][oauth] pertencem agora a cada perfil em `[[llm.models]]`, substituindo a definição global `[llm] oauth_file`. Cada caminho pode ser gerido junto do modelo a que se destina.

Estas alterações tornam mais claros os pontos de contacto com o trabalho em curso: uma tarefa a examinar, uma ação a aprovar e um estado de serviço mais fácil de acompanhar. Consulte a [introdução ao Genesis][intro] para conhecer o sistema e o [guia do Assistant][assistant] para operações específicas.

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /pt/news/evox-genesis

