---
title: "Genesis reúne projetos, conversas e Git no mesmo ambiente de trabalho"
pubDate: 2026-11-22
updatedDate: 2026-11-27
summary: "Rascunhos por projeto e espaços VCT mantêm o contexto no repositório e nó corretos durante a mudança de tarefa."
---

Alternar entre uma conversa, uma tarefa de desenvolvimento e as alterações Git não deveria obrigar a reconstruir o contexto. A PR #175 do Genesis, integrada em `main` a 20 de novembro de 2026, introduz um ambiente LiveView com navegação por projetos, abas, históricos de tarefas e conversas, painel Git e definições integradas. As alterações aos espaços VCT e ao âmbito dos rascunhos transportam a identidade do projeto entre estas vistas. [Integração][pr]

![Gavetas de projetos separadas guardam as respectivas notas e ferramentas numa bancada comum](./cover.webp)

*Ilustração conceitual: cada projeto mantém o seu contexto de trabalho.*

## Consultar o projeto no mesmo lugar

O ambiente reúne navegação e vistas de trabalho. Pode regressar a um projeto, consultar tarefas ou conversas e examinar alterações Git sem recomeçar em cada vista. A integração conserva o seletor de espaços, a configuração de contas e a pausa/retomada de tarefas. Também recupera o contexto de aprovação após a reconexão. Estas melhorias prolongam o [fluxo anterior de tarefas do Assistant][previous], cujas aprovações estruturadas continuam a determinar a ação autorizada. [Integração do ambiente][pr]

Considere alguém que alterna entre uma biblioteca e a aplicação que a utiliza. O rascunho de requisitos da biblioteca deve continuar associado a esta quando abre o aba da aplicação. Uma operação Git deve apontar para o servidor e repositório selecionados. As alterações verificam a pertença do projeto antes das operações Git e mantêm o nó escolhido quando a conexão não está disponível, sem redirecionar para o computador do painel.

## A identidade do rascunho vai além do caminho

O módulo compartilhado `DraftScope` identifica um rascunho do navegador através de `{node, token}`. Um projeto montado no Virtual Context Tree usa o ponto `vct:///projects/<name>`; caso contrário, usa o caminho absoluto do sistema operacional. O ponto tem prioridade quando ambos existem. Assim, diferentes formas de escrever o caminho do mesmo projeto montado acedem a um rascunho, enquanto pontos VCT distintos sobre o mesmo caminho permanecem separados. [Implementação][scope]

A chave de armazenamento do navegador combina nó e token. Uma correção posterior adota o rascunho associado ao caminho quando o ponto VCT fica disponível, cobrindo a passagem da escolha de uma pasta ao registro do projeto. É continuidade do rascunho no navegador, distinta da persistência das tarefas ou de uma garantia de recuperação duradoura das conversas após reiniciar o servidor. [Adoção do rascunho][adopt]

Num projeto remoto também importa manter o caminho literalmente: o painel não deve normalizá-lo segundo o sistema de arquivos do computador do navegador. Antes de enviar um rascunho recuperado, confirme nó, repositório e modelo, sobretudo depois de alternar entre projetos locais e remotos.

## Os espaços agrupam projetos; as tarefas precisam de uma pasta

O VCT passa a ter uma camada de agrupamento em `vct:///workspaces/<name>`. Um espaço contém uma lista ordenada de membros e uma descrição opcional. Os membros referem pontos de montagem de projetos ou caminhos do sistema; os espaços não se aninham. A paleta Projects e o seletor do Assistant apresentam estes grupos, cujos membros podem ser consultados através de APIs só de leitura. [Interface de operação][workspace]

Um grupo não possui uma pasta de execução própria. Por isso, `DraftScope.path/1` não devolve caminho para uma seleção apenas de espaço, e a admissão de tarefas rejeita pontos VCT como caminhos de tarefa. No exemplo, agrupe biblioteca e aplicação para as explorar em conjunto e selecione depois o membro concreto que receberá a tarefa. Um espaço não torna todos os membros destinos implícitos de escrita.

A partir do código-fonte, `mix vct.workspace list` e `mix vct.workspace show <name>` inspecionam grupos. O comando documentado `create` aceita argumentos `--member` repetidos e um `--data-dir` opcional; use a pasta de dados da instância Genesis pretendida. A inspeção assinala membros em falta em vez de os omitir. Consulte o contrato do comando antes de alterar um grupo.

## Verificar a passagem entre vistas

A PR registra verificações no navegador de criação e conclusão de tarefas, envio pelo teclado e transmissão do Assistant, e tela de configuração de contas. Regista também um tempo de espera excedido numa consulta de tarefas do Assistant limitada a um projeto. Num fluxo longo, aceitar um pedido e observar o resultado são acontecimentos diferentes. [Verificações][pr]

Numa compilação com estas alterações, experimente dois projetos com rascunhos diferentes, volte a ligar o nó e abra o painel Git do projeto pretendido. Confirme que o rascunho regressa ao projeto correto e que a aprovação mostra o destino real. Depois acompanhe o estado registrado da tarefa, sem tomar um aba recuperado como prova de conclusão do trabalho em segundo plano.

[pr]: https://github.com/EMI-Group/genesis/pull/175
[previous]: /pt-br/news/genesis-assistant-project-workflows
[scope]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_dash/lib/evo_dash_web/live/draft_scope.ex
[adopt]: https://github.com/EMI-Group/genesis/commit/a0f7b141ed448590030f6d36de951bbb1ca3673e
[workspace]: https://github.com/EMI-Group/genesis/blob/975b9ba32be5f6772b456ea3c92bfa3b4ae22cb9/apps/evo_git/lib/mix/tasks/vct.workspace.ex

Os ajustes de 25 de novembro de 2026 mantêm opções no formulário, abrem projetos escolhidos explicitamente na visão geral e encaminham tarefas ativas para um inspetor de agentes filtrado por tarefa. O rascunho Assistant do projeto só aparece após confirmar a identidade, preservando projeto e nó durante a navegação. [GitHub](https://github.com/EMI-Group/genesis/commit/c40b76d207345ed6b9dc1435887b3482ff3ad9a4) · [GitHub](https://github.com/EMI-Group/genesis/commit/732f127e1712424fc4501bfe59200fa4661514f4) · [GitHub](https://github.com/EMI-Group/genesis/commit/e3bba720387f921bd72dda49016cdfb4ef0fa46b) · [GitHub](https://github.com/EMI-Group/genesis/commit/4f8a233f89a1dcecb63ce3d342b437b4d4fbf8af).

A PR #178, integrada em main em 27 de novembro de 2026, melhora o seletor existente: projetos recentes primeiro, navegação por pastas e entrada manual do caminho disponível mas recolhida. A seleção conserva o rascunho e pertence à conversa que abriu o diálogo; um diálogo desatualizado não altera outra conversa. No Windows, o botão de computador explora as raízes das unidades do nó selecionado. Os avisos internos deixam de aparecer na transcrição visível, mas o modelo mantém o contexto; o primeiro envio já não duplica entradas do histórico. Ao mudar de projeto, aguarde a resolução do novo escopo de History antes de consultar os resultados. [PR #178](https://github.com/EMI-Group/genesis/pull/178) · [History](https://github.com/EMI-Group/genesis/commit/0fc1182ea3e53baa50613f3504ff0a52798984dd).
