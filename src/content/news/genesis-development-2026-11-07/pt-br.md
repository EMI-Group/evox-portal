---
title: "Desenvolvimento do Genesis: Assistant e servidor remoto compartilhado"
pubDate: 2026-11-07
summary: "A branch main recebe um chat de operações, um servidor remoto compartilhado e uma gestão mais simples de tarefas em segundo plano."
---

As alterações integradas à branch `main` do Genesis de 4 a 7 de novembro de 2026 melhoram as operações diárias. **São novidades de desenvolvimento, não o anúncio de uma nova versão.** Na verificação de 7 de novembro, a versão publicada mais recente continua sendo a v0.14.0.

O Genesis Assistant se torna um chat de operações no painel: pode consultar tarefas e capacidade do sistema e solicitar operações ou mudanças de configuração. Os níveis read/write/sudo distinguem consultas de operações que exigem a aprovação do código exato; sudo tem um cartão separado. Consulte os limites no [guia do Assistant][assistant].

O desenvolvimento remoto agora compartilha uma instância de servidor com o painel HTTP. `genesis remote stop` desativa a distribuição remota, mantendo HTTP em funcionamento. As tarefas em segundo plano recebem identificadores curtos como `bash-1`; `job_output` pode omitir `job_id` quando o agente que o invoca possui apenas uma tarefa.

Nas builds de desenvolvimento, o caminho personalizado do arquivo de credenciais OAuth agora pertence a cada perfil de modelo (`[[llm.models]]`), em vez da configuração global `[llm] oauth_file`. Confira as alterações vinculadas antes de atualizar a configuração; não presuma que estejam disponíveis na v0.14.0.

[GitHub: Assistant](https://github.com/EMI-Group/genesis/commit/0e200579c36c7e37d186392f9594be46470b40fa) · [GitHub: remote](https://github.com/EMI-Group/genesis/commit/be19052d11b1263ecb7050b7d185295dc70aed82) · [GitHub: jobs](https://github.com/EMI-Group/genesis/commit/0db07327a593b99b9a0e7bb7445c6a04c2a853e9) · [GitHub: OAuth](https://github.com/EMI-Group/genesis/commit/b00f32f15e5daceb5883c169e2af45d6720416d0) · [v0.14.0](https://github.com/EMI-Group/genesis/releases/tag/v0.14.0)

[assistant]: https://github.com/EMI-Group/genesis/blob/e43ca5e1716fea8d6bb681c3309f74f451b58346/docs/genesis-assistant.md

