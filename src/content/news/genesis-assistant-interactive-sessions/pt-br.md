---
title: "Genesis Assistant: retomar uma conversa em espera"
pubDate: 2026-11-12
updatedDate: 2026-11-16
summary: "O ramo main do Genesis mantém as conversas do Assistant em sessões interativas e mostra o código exato e o nó de destino na janela de aprovação."
---

Um desenvolvedor pode pedir ao Genesis Assistant que analise uma tarefa que falhou, sair para revisar as alterações e voltar com uma pergunta. Para continuar, é necessário recuperar a conversa e o seu contexto. As alterações integradas em Genesis `main` de 10 a 12 de novembro de 2026 mantêm uma sessão interativa enquanto durar a conversa e deslocam a lista de conversas para a barra lateral. [Guia do Assistant][guide]

![Uma pessoa volta a uma conversa assinalada e analisa uma ação proposta](./genesis-assistant-interactive-sessions.webp)

*Ilustração editorial da retomada de uma conversa do Assistant e da análise de uma ação proposta.*

## Projetos e anexos: atualização de 16 de novembro

A PR #172, integrada ao `main` em 15 de novembro, muda a preparação abaixo: conversar e controlar tarefas não exige mais uma cópia de Genesis. Consultar o código é opcional e sujeito a aprovação. Selecionar um projeto no host escolhido preenche caminhos omitidos sem ler arquivos ou autorizar desenvolvimento. A troca fica bloqueada durante uma resposta; outro caminho explícito continua sendo o alvo mostrado. Assistant compartilha onze definições de controle com MCP. As aprovações vinculam parâmetros estruturados exatos e identidades de nó e conversa controladas pelo servidor. [Mudanças integradas][workflows]

Por exemplo, escolha um projeto, solicite uma tarefa em segundo plano e confira e aprove os parâmetros. Inícios bem-sucedidos são acompanhados automaticamente; o seletor Tasks pesquisa tarefas existentes. Os cartões mostram estado observado e horário de atualização, preservando os últimos dados se a atualização falhar. Parar a resposta não para o desenvolvimento; enviar requisitos e solicitar cancelamento são ações aprovadas separadas. Cancelar não desfaz alterações Git. O navegador envia texto, PDF, DOCX, imagens e áudio, quatro arquivos por mensagem e 15 MiB por arquivo; anexos concluídos podem ser enviados sem texto. A entrada secundária de caminho do servidor aceita o nó local do painel e não o substitui por um nó remoto incompatível. Referências a tarefas sobrevivem ao fim da sessão, mas conversas em memória não ao reinício do servidor; tarefas persistentes podem ser encontradas novamente. Experimente uma compilação com a PR #172 e confira o estado antes de repetir um envio incerto. [Guia atualizado][workflowguide]

## Voltar a uma conversa que aguarda resposta

Abra **Conversations** abaixo de **Active Tasks**. A lista reúne as sessões ativas do nó selecionado e as conversas salvas em cache local. Os estados distinguem sessões à espera de entrada, em execução e terminadas. Ao selecionar uma conversa, abre-se `/assistant?session=<agent_id>`. Os links antigos `/help` redirecionam para `/assistant` com os parâmetros de consulta preservados. [Alteração da rota][route]

Após uma interação, a sessão pode liberar a vaga de execução e manter o contexto e a árvore de trabalho. A pergunta seguinte retoma a mesma sessão do agente com o mesmo identificador de cache do prompt. **New chat** abre outra conversa e mantém a anterior na lista. Uma conversa terminada pode continuar visível no histórico. [Implementação das sessões][session]

## Inspecionar a tarefa antes de decidir

Imagine uma tarefa de testes que falhou. Peça ao Assistant para ler o estado, o erro e o resultado no nó que está consultando. Abra a página de revisão, compare as alterações com a falha e volte por **Conversations** com uma pergunta mais concreta. A conversa anterior conserva o contexto. Em uma instância local, baixe o código-fonte do Genesis quando solicitado, para que o Assistant o possa consultar.

Para tentar novamente, peça ao Assistant que proponha iniciar uma nova tarefa usando a anterior como contexto. A inspeção usa o nível de leitura, enquanto o início de trabalho usa uma chamada de escrita. A decisão diz respeito a essa chamada específica no nó selecionado. [Inspeção e níveis de execução][guide]

## Revisar a escrita sem perder o ponto de leitura

Uma barra fixa entre a conversa e o campo de escrita indica as solicitações pendentes. **Review** abre uma janela com uma solicitação por vez. Verifique o código exato e o destino de execução e escolha **Allow once** ou **Deny**. As solicitações de nível `sudo` têm um aviso destacado porque executam Elixir nativo sob a identidade do servidor Genesis.

A janela mostra o nó de destino indicado pelo ambiente de execução e o aviso associado à solicitação. Quando há várias solicitações, pode revisá-las uma por vez. Uma solicitação recuperada pode aparecer enquanto estiver pendente. A conversa e o campo de escrita mantêm a posição quando a barra muda. [Alterações da aprovação][approval]

## Voltar à tarefa para confirmar o resultado

Depois de aceitar uma escrita, inspecione a tarefa resultante e confirme o seu estado. Se a resposta for interrompida ou a escrita exceder o tempo de espera, verifique o estado atual antes de repetir. Em uma compilação com essas alterações, comece por inspecionar uma tarefa em modo de leitura, mude de página e volte por **Conversations** com uma pergunta. A [apresentação anterior do Assistant][related] descreve as ferramentas usadas nesse fluxo. [Guia atual][guide]

## Preservar a resposta final quando a sessão termina

Atualização de 14 de novembro: mudanças integradas ao `main` em 13 de novembro entregam um snapshot final autoritativo ao Assistant e ao inspetor do agente selecionado. Transcrição e estado terminal são aplicados juntos; notificações tardias não reabrem a conversa encerrada. Se a transferência não estiver disponível, permanece o último texto coerente em cache, sem leitura separada do histórico. O inspetor pode preservar detalhes de agentes encerrados fora da árvore ativa. Em uma compilação com essa mudança, mantenha a conversa selecionada até terminar e confira se texto final e estado concordam antes de repetir o trabalho. [Implementação da transferência final][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /pt-br/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae

[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
