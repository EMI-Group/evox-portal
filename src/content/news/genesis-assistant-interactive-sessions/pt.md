---
title: "Genesis Assistant: retomar uma conversa em espera"
pubDate: 2026-11-12
updatedDate: 2026-11-14
summary: "O ramo main do Genesis mantém as conversas do Assistant em sessões interativas e mostra o código exato e o nó de destino na janela de aprovação."
---

Um programador pode pedir ao Genesis Assistant que analise uma tarefa falhada, sair para rever as alterações e voltar com uma pergunta. Para continuar, é necessário recuperar a conversa e o seu contexto. As alterações integradas em Genesis `main` de 10 a 12 de novembro de 2026 mantêm uma sessão interativa enquanto durar a conversa e deslocam a lista de conversas para a barra lateral. [Guia do Assistant][guide]

![Uma pessoa volta a uma conversa assinalada e analisa uma ação proposta](./genesis-assistant-interactive-sessions.webp)

*Ilustração editorial da retoma de uma conversa do Assistant e da análise de uma ação proposta.*

## Voltar a uma conversa que aguarda resposta

Abra **Conversations** abaixo de **Active Tasks**. A lista reúne as sessões ativas do nó selecionado e as conversas guardadas em cache local. Os estados distinguem sessões à espera de entrada, em execução e terminadas. Ao selecionar uma conversa, abre-se `/assistant?session=<agent_id>`. As ligações antigas `/help` redirecionam para `/assistant` com os parâmetros de consulta preservados. [Alteração da rota][route]

Após uma interação, a sessão pode libertar a vaga de execução e manter o contexto e a árvore de trabalho. A pergunta seguinte retoma a mesma sessão do agente com o mesmo identificador de cache do prompt. **New chat** abre outra conversa e mantém a anterior na lista. Uma conversa terminada pode continuar visível no histórico. [Implementação das sessões][session]

## Inspecionar a tarefa antes de decidir

Imagine uma tarefa de testes que falhou. Peça ao Assistant para ler o estado, o erro e o resultado no nó que está a consultar. Abra a página de revisão, compare as alterações com a falha e regresse por **Conversations** com uma pergunta mais concreta. A conversa anterior conserva o contexto. Numa instância local, descarregue o código-fonte do Genesis quando lhe for pedido, para que o Assistant o possa consultar.

Para tentar novamente, peça ao Assistant que proponha iniciar uma nova tarefa usando a anterior como contexto. A inspeção usa o nível de leitura, enquanto o início de trabalho usa uma chamada de escrita. A decisão diz respeito a essa chamada específica no nó selecionado. [Inspeção e níveis de execução][guide]

## Rever a escrita sem perder o ponto de leitura

Uma barra fixa entre a conversa e o campo de escrita indica os pedidos pendentes. **Review** abre uma janela com um pedido de cada vez. Verifique o código exato e o destino de execução e escolha **Allow once** ou **Deny**. Os pedidos de nível `sudo` têm um aviso destacado porque executam Elixir nativo sob a identidade do servidor Genesis.

A janela mostra o nó de destino indicado pelo ambiente de execução e o aviso associado ao pedido. Quando há vários pedidos, pode revê-los um de cada vez. Um pedido recuperado pode aparecer enquanto estiver pendente. A conversa e o campo de escrita mantêm a posição quando a barra muda. [Alterações da aprovação][approval]

## Voltar à tarefa para confirmar o resultado

Depois de aceitar uma escrita, inspecione a tarefa resultante e confirme o seu estado. Se a resposta for interrompida ou a escrita exceder o tempo de espera, verifique o estado atual antes de repetir. Numa compilação com estas alterações, comece por inspecionar uma tarefa em modo de leitura, mude de página e regresse por **Conversations** com uma pergunta. A [apresentação anterior do Assistant][related] descreve as ferramentas em que este percurso se apoia. [Guia atual][guide]

## Preservar a resposta final quando a sessão termina

Atualização de 14 de novembro: mudanças integradas ao `main` em 13 de novembro entregam um snapshot final autoritativo ao Assistant e ao inspetor do agente selecionado. Transcrição e estado terminal são aplicados juntos; notificações tardias não reabrem a conversa encerrada. Se a transferência não estiver disponível, permanece o último texto coerente em cache, sem leitura separada do histórico. O inspetor pode preservar detalhes de agentes encerrados fora da árvore ativa. Numa compilação com esta alteração, mantenha a conversa selecionada até terminar e verifique se texto final e estado concordam antes de repetir o trabalho. [Implementação da transferência final][handoff]

[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/genesis-assistant.md
[session]: https://github.com/EMI-Group/genesis/commit/7bf561a64c5f4f1dcc2193b6788ee248c5326736
[route]: https://github.com/EMI-Group/genesis/commit/124abbf7eaaa21c5ca6fe803128a962e7384d1b5
[approval]: https://github.com/EMI-Group/genesis/commit/946ff9735c7b03aac4abb6a312c3a111a79fa51b
[related]: /pt/news/genesis-development-2026-11-07

[handoff]: https://github.com/EMI-Group/genesis/commit/716c85c93bb171396c30b18b67d6d8a8c554b1ae
