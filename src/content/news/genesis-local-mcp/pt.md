---
title: "Genesis: delegar trabalho local de desenvolvimento com MCP"
pubDate: 2026-11-12
summary: "O ramo main do Genesis acrescenta um ponto de acesso MCP local para iniciar tarefas, acompanhá-las por ID e obter os resultados a partir de um agente de programação."
---

Um agente de programação pode já ter o objetivo e o caminho do projeto. Ao entregar o trabalho a outro motor, precisa de o iniciar, acompanhar e obter o resultado a partir da mesma conversa. A 11 de novembro de 2026, o Genesis integrou em `main` um ponto de acesso local do Model Context Protocol (MCP). Os agentes compatíveis acedem às APIs de tarefas existentes através de uma única ligação. [Alteração integrada][pr]

![Dois terminais na mesma bancada trocam uma ficha de tarefa e o respetivo resultado](./genesis-local-mcp.webp)

*Ilustração editorial da passagem local de trabalho entre um agente de programação e o Genesis.*

## Ligar ao processo Genesis que executa o trabalho

O ponto de acesso Streamable HTTP `/mcp` está montado no servidor Genesis em execução. O servidor autentica o pedido, valida os argumentos e chama a API de tarefas ou do escalonador. O trabalho continua no servidor depois de terminar o pedido HTTP. A ligação não guarda estado, por isso o ID da tarefa é a referência para a consultar mais tarde.

O Genesis aceita ligações de loopback e valida Host e Origin. Os pedidos usam um token bearer do ficheiro `mcp-token` da instância em execução. O anfitrião do agente tem de suportar Streamable HTTP e conservar o cabeçalho de autorização. O Genesis e o diretório gravável do projeto têm de estar na mesma máquina. O [guia de ligação][guide] explica a configuração de uma compilação a partir do código-fonte com esta alteração. Para o servidor da versão publicada, consulte [Genesis 0.14.1][related].

## Dar ao objetivo o contexto necessário

Imagine que um agente encontrou um defeito num analisador e lhe pedem que delegue um teste de regressão. Pode verificar a configuração local com `genesis_check` e chamar `genesis_start_task` com o caminho absoluto da cópia de trabalho principal e um objetivo que descreva a entrada problemática, o comportamento esperado e o teste. O Genesis usa o seu próprio modelo configurado. O objetivo precisa do contexto relevante da conversa de origem.

As nove ferramentas abrangem verificação da prontidão, recarregamento da configuração, descoberta de modelos, envio, listagem, estado e resultados de tarefas, mensagens e cancelamento. Um repositório Git existente precisa de um primeiro commit. Este ponto de acesso requer uma cópia principal com diretório `.git` e rejeita worktrees associados e raízes de submódulos. [Requisitos de tarefas e repositórios][guide]

## Retomar a consulta pelo ID da tarefa

Guarde o ID devolvido no envio. Depois de voltar a ligar, consulte `genesis_get_task` com esse ID ou liste as tarefas recentes do projeto antes de repetir o pedido. O estado mostra dados limitados do escalonador e do estado guardado. Nas consultas periódicas pode omitir o resultado completo e usar o token de alteração para esperar durante um período limitado.

A resposta a uma mensagem confirma a entrada na fila. A resposta a um cancelamento descreve o pedido aceite e o estado guardado. Para confirmar o desfecho, consulte o estado final, obtenha o resultado com `genesis_get_result` e verifique os commits e os comprovativos de teste indicados. [Observação e controlo de tarefas][guide]

## Verificar a ligação antes de delegar

Compile a revisão em causa e configure o fornecedor na instância Genesis que executará o trabalho. Siga o guia para criar um token privado e registar no cliente o endereço de loopback real da instância. Abra uma nova sessão do cliente e chame `genesis_check`. Pode assim verificar em separado a ligação MCP e a prontidão do modelo antes de enviar uma tarefa. [Configuração e verificação da ligação][guide]

[pr]: https://github.com/EMI-Group/genesis/pull/171
[guide]: https://github.com/EMI-Group/genesis/blob/ee8f4ed570c86516f1a76639bd71ea7477688439/docs/agent-mcp.md
[related]: /pt/releases/genesis-0-14-1
