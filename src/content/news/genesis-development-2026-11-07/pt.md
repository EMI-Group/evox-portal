---
title: "Desenvolvimento do Genesis: Assistant e servidor remoto partilhado"
pubDate: 2026-11-07
summary: "O ramo main recebe um chat de operações, um servidor remoto partilhado e uma gestão mais simples de tarefas em segundo plano."
---

As alterações integradas no ramo `main` do Genesis de 4 a 7 de novembro de 2026 melhoram as operações diárias.

O Genesis Assistant torna-se um chat de operações no painel: pode consultar tarefas e capacidade do sistema e solicitar operações ou alterações de configuração. Os níveis read/write/sudo distinguem consultas de operações que exigem a aprovação do código exato; sudo tem um cartão separado. Consulte os limites no [guia do Assistant][assistant].

O desenvolvimento remoto partilha agora uma instância de servidor com o painel HTTP. `genesis remote stop` desativa a distribuição remota, mantendo HTTP em funcionamento. As tarefas em segundo plano recebem identificadores curtos como `bash-1`; `job_output` pode omitir `job_id` quando o agente que o invoca tem apenas uma tarefa.

Nas compilações de desenvolvimento, o caminho personalizado do ficheiro de credenciais OAuth pertence agora a cada perfil de modelo (`[[llm.models]]`), em vez da definição global `[llm] oauth_file`.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

