---
title: "Genesis 0.14.1: manter a escolha do modelo ao longo do trabalho"
pubDate: 2026-11-10
updatedDate: 2026-11-10
summary: "Perfis de modelos por conta, autenticação por subscrição e um servidor remoto comum: os mecanismos do Genesis 0.14.1 e o que verificar ao atualizar."
---

Escolher um modelo também é escolher a conta que paga, as credenciais e as definições de raciocínio transmitidas à tarefa. O **Genesis 0.14.1 foi lançado oficialmente a 8 de novembro de 2026** e mantém essa identidade entre Settings, Projects, Assistant, o escalonador e a execução. A versão unifica ainda o funcionamento remoto no servidor sem interface e amplia o controlo da inspeção durante a execução. [Notas de lançamento completas][release]

![O separador da conta selecionada mantém a ligação às respetivas escolhas de modelo](./provider-account-continuity.webp)

## Configurar a conta, escolher a tarefa com precisão

Um provider profile contém autenticação, endpoint, concorrência e horários. O inventário de modelos aninhado enumera os modelos disponíveis nessa conta e as substituições específicas de geração e raciocínio. A seleção da tarefa transporta uma identidade sem credenciais: ID do perfil, ID do modelo e esforço de raciocínio opcional. Uma escolha concreta fixa essa identidade na execução seguinte; **Auto** deixa a seleção às regras configuradas.

Por exemplo, dois modelos de uma conta de trabalho partilham os seus lugares de concorrência e a espera após limites de frequência. Adicionar um modelo não cria outra quota independente. Uma conta pessoal pode ter credenciais e horários diferentes. Para API keys distintas, utilize também nomes de credenciais distintos, além de IDs de perfil diferentes. [Configuração e regras de seleção][profiles]

Cada modelo selecionável precisa de uma entrada em `[[llm.providers.models]]`; apenas `default_model` não chega. O esforço predefinido é separado do inventário de níveis suportados. No painel, uma lista não vazia sem predefinição resolvida seleciona o primeiro nível; uma chamada à API interna sem esforço pode omitir o parâmetro. Reveja modelo e esforço depois de mudar de perfil.

A versão corrige a perda de seleções explícitas entre tarefa, agente e sistema, os grupos alternativos do escalonador e os instantâneos incompletos que podiam causar `:model_spec_schema_unavailable`. As definições arquivadas são agora seguras para JSON e ocultam credenciais. As correções interessam tanto a novas tarefas como à reutilização de configurações guardadas.

## A subscrição segue a configuração da conta

Os perfis suportados recebem autenticação OAuth/por subscrição e estado de início de sessão individual. O Genesis importa os ficheiros de sessão das CLI dos fornecedores para um ficheiro gerido lido pelo ReqLLM. `openai_codex` é exclusivo de OAuth; os perfis de subscrição Anthropic usam `auth_mode = "oauth"`. O guia desta versão começa com `codex login` ou uma sessão Claude CLI no nó que utilizará a conta. [Configurar a subscrição][oauth]

O ficheiro gerido predefinido é `auth.json`, junto de `config.toml`. Um `oauth_file` personalizado pertence ao provider profile; a chave global `[llm] oauth_file` foi removida. Os novos ficheiros têm permissões `0600` e a importação é atómica. O ficheiro contém uma entrada por provider: IDs de perfil diferentes não isolam, por si só, várias sessões de subscrição.

Para trabalho remoto, verifique a sessão no nó remoto. Se a sessão do fornecedor existe mas o destino gerido é só de leitura, indique no perfil um caminho privado com escrita; iniciar sessão novamente não resolve o destino. Os OAuth tokens fornecidos apenas pelo ambiente não se renovam automaticamente. As mensagens revistas distinguem estes casos.

## Um servidor para execução remota e painel

A distribuição separada `genesis_remote` foi retirada. Os comandos remotos e o arranque inicial usam `genesis_server`, com HTTP sempre disponível e Erlang distribution comutável em execução por um protocolo de ficheiros acionado por SIGHUP. A CLI disponibiliza `genesis remote start`, `stop`, `status` e `logs`. [Servidor e instalação][readme]

Para quem mantém o painel no portátil e executa num anfitrião SSH, a gestão do serviço muda: reveja os scripts que referem a distribuição antiga e passe a gerir o servidor comum. A versão permite também testes de projetos remotos e retoma de testes no momento da chamada. O servidor HTTP sem interface escuta localhost por predefinição e não tem autenticação integrada; o acesso remoto documentado usa um túnel SSH.

## Recuperar interações durante execuções longas

O avaliador Elixir por níveis e com mediação acrescenta aprovação do código exato e aprovação recuperável na conversa. A saída é truncada ao orçamento restante em vez de falhar por o exceder. Outras mudanças incluem uma curta janela de recuperação após o limite de turnos, respostas finais sem ferramentas, IDs de trabalhos sequenciais mais curtos e identidades de cache de prompt estáveis por execução de agente para chamadas GPT OpenAI/Codex. O painel recebe ainda um bloco de cápsulas fundido e controlos comuns de tarefa/modelo. [Alterações e correções][release]

## Atualizar com a configuração à vista

1. Obtenha os instaladores ou ficheiros de servidor de [v0.14.1][release] para a plataforma pretendida. Guarde uma cópia da configuração antes de alterar as contas. O antigo `[[llm.models]]` continua compatível; os provider profiles canónicos têm prioridade e guardar explicitamente em Settings/config executa a migração.
2. Em **Settings → LLM → Provider profiles**, reveja autenticação, inventário aninhado, esforço predefinido e `oauth_file` personalizado. As credenciais devem estar acessíveis ao processo que executa a tarefa, incluindo no servidor remoto.
3. Depois de reiniciar o servidor sem interface, use `genesis status`; verifique uma seleção explícita de perfil/modelo/esforço, Auto e a ligação remota efetiva. Reveja os scripts antigos do daemon antes de os reutilizar. Estes controlos decorrem das mudanças documentadas.

Para o fluxo de operação das tarefas em curso, continue com [Genesis Assistant: uma visão mais clara do trabalho em execução](/pt/news/genesis-development-2026-11-07).

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.1
[profiles]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-profiles.md
[oauth]: https://github.com/EMI-Group/genesis/blob/v0.14.1/docs/llm-oauth.md
[readme]: https://github.com/EMI-Group/genesis/blob/v0.14.1/README.md
