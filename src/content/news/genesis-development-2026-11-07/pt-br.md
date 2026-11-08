---
title: "Genesis Assistant: compreender e gerenciar o trabalho em andamento"
pubDate: 2026-11-07
updatedDate: 2026-11-08
summary: "Consultar tarefas, entender a capacidade do sistema e agir em uma só conversa. As mudanças recentes em main também simplificam serviços remotos, tarefas em segundo plano e credenciais dos modelos."
---

Uma tarefa de desenvolvimento prolongada gera perguntas mesmo depois de começar: o que continua ativo, por que uma tarefa falhou e como prosseguir? As mudanças integradas à `main` do Genesis entre 4 e 7 de novembro de 2026 levam essas questões à conversa Assistant do painel e melhoram os serviços que a sustentam.

![Um desenvolvedor verifica tarefas em execução e em pausa](./genesis-assistant-task-flows.webp)

*Uma conversa, vários fluxos de trabalho: uma ilustração editorial da ideia central desta atualização.*

## Partir da tarefa para escolher a ação

O Genesis Assistant pode ler o código e a documentação do Genesis, consultar tarefas e verificar a capacidade atual do agendador. Você pode pedir que examine o status, o erro e o resultado de uma tarefa que falhou e depois solicitar um próximo passo, como retomar trabalho anterior. A conversa conecta explicações e operações no nó que está sendo consultado.

O [guia do Assistant][assistant] apresenta pontos de partida concretos: listar trabalho em andamento, verificar os slots disponíveis dos modelos ou pausar o agendamento durante uma mesclagem. O trabalho já iniciado continua durante a pausa. Os ajustes temporários de execução e a configuração salva permanecem separados; uma mudança da sessão não se torna implicitamente um padrão permanente.

A consulta usa o nível `read`. As mudanças usam `write`, com aprovação do código exato; `sudo` possui um cartão separado. A ação proposta fica visível quando uma pergunta se transforma em uma operação.

## Um servidor, duas formas de conexão

O desenvolvimento remoto e o painel HTTP agora compartilham uma única instância de servidor. Antes, os comandos remotos iniciavam uma instância separada dedicada à distribuição. Com o [servidor compartilhado][remote], `genesis remote stop` desativa a distribuição remota e mantém o painel HTTP disponível. Encerrar a conexão de desenvolvimento remoto não exige mais parar esse serviço HTTP comum.

## Detalhes que facilitam o acompanhamento

As [tarefas em segundo plano][jobs] recebem identificadores curtos como `bash-1`. Se o agente que faz a chamada possui apenas uma tarefa, `job_output` a encontra sem `job_id`; se possui várias, retorna identificadores, status e rótulos para escolher a correta.

Os [caminhos personalizados dos arquivos de credenciais OAuth][oauth] agora pertencem a cada perfil em `[[llm.models]]`, substituindo a configuração global `[llm] oauth_file`. Cada caminho pode ser gerenciado junto do modelo ao qual serve.

Essas mudanças tornam mais claros os pontos de contato com o trabalho em andamento: uma tarefa a examinar, uma ação a aprovar e um estado de serviço mais fácil de acompanhar. Consulte a [introdução ao Genesis][intro] para conhecer o sistema e o [guia do Assistant][assistant] para operações específicas.

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md
[remote]: https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82
[jobs]: https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9
[oauth]: https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0
[intro]: /pt-br/news/evox-genesis

