---
title: "Genesis v0.15.0: continuidade do projeto, da autenticação à recuperação"
pubDate: 2026-11-28
summary: "Workbench unificado, autenticação ChatGPT no navegador e pausa da árvore inteira chegam com revisões mais claras e configuração mais segura."
---

O Genesis v0.15.0 foi publicado em 27 de novembro de 2026. Reúne as alterações recentes do workbench, contas e recuperação de tarefas. O benefício é a continuidade: escolher host e projeto, configurar o modelo, acompanhar o desenvolvimento e regressar ao trabalho inacabado sem confundir uma resposta de chat com uma tarefa concluída. Revisão, trabalhos em segundo plano e contexto também mudam; a atualização ultrapassa o aspecto visual. [Notas completas][release]

![Uma mesa mecânica liga um registro de projeto, uma chave e uma estrutura ramificada suspensa](./cover.webp)

*Ilustração conceitual: identidade, contexto e trabalho recuperável compartilham um ponto de controle.*

## Manter projeto e host explícitos

O workbench reúne visão geral, inspeção de agentes por tarefa, editor compartilhado e opções integradas. Projetos recentes e navegação por pastas simplificam a escolha. Os workspaces VCT agrupam projetos com um seletor de membros. Escolha um membro concreto antes de trabalhar: o grupo não tem diretório de execução. Source Control apresenta histórico e diferenças. Separadores de pré-visualização e fixos, manter aberto pelo botão central, alternar com Alt+Arrow e menu de excesso tornam a barra a única lista de vistas abertas.

Ao passar entre biblioteca e aplicação, rascunho, modelo e repositório devem continuar a identificar a tarefa pretendida. Rascunhos por projeto restauram campos não textuais após carregamento assíncrono. Pesquisa e filtros do histórico conservam o escopo; posições de revisão e filtros de tarefas sobrevivem à mudança de nó. Uma ativação tardia já não fecha a paleta nem desvia a seleção explícita da visão geral. [Contexto do workbench][workbench]

## Configurar a conta e confirmar o modelo

Sign in with ChatGPT no navegador é comum ao dashboard, assistentes de configuração, boas-vindas e CLI. Os hosts remotos permitem colar manualmente o URL de redirecionamento; sair ou fechar cancela o processo. Contas existentes também iniciam sessão por Settings. A autenticação concluída atualiza o snapshot da configuração e o seletor de modelos. Os assistentes oferecem níveis de raciocínio canônicos e horários predefinidos. off_peak_holidays usa um calendário estático de feriados e dias de trabalho compensatórios da China para 2025–2027, não um serviço mundial.

Contas personalizadas usam OpenAI Chat Completions; pedidos de assinatura ChatGPT incluem cabeçalhos de atribuição de uso e identidade da cache de prompts. Keenable é pesquisa opcional sem chave. Reveja encaminhamento e horários. Uma conta parcialmente guardada regressa ao modelo padrão com aviso, em vez de bloquear o agendador. Settings recusa guardar se a identidade local do nó mudou: recarregue o contexto. As chaves são ocultadas nos registros e Git verifica a pertença ao projeto. [Fluxo das contas][accounts]

## Pausar sem concluir os filhos pendentes

A pausa congela toda a árvore de agentes e retomada-a com as mesmas identidades, substituindo o esvaziamento anterior. Com persistência ativa, os checkpoints guardam esperas dos pais e trabalho dos filhos; pausa limpa e recuperação interrompida permanecem distintas. Review mostra falha, cancelamento e ausência de relatório, remove ações inaplicáveis e permite preparar uma tarefa de seguimento. needs-review torna esses resultados localizáveis. [Mecanismo de pausa][pause]

Os trabalhos em segundo plano recebem IDs curtos base36 globalmente únicos, logs por tarefa e nomes de registro sem colisões. A retenção protege proprietários ativos e conserva marcadores de remoção em vez de IDs inexplicavelmente desconhecidos; o crescimento de memória também é corrigido. Os agentes fazem commit automaticamente se o passo principal falhar, e a coautoria ativada chega aos merges. A rastreabilidade melhora, mas a aceitação continua a exigir inspeção do estado e das alterações do repositório.

## Atualizar e verificar os percursos utilizados

CONTEXT.md ganha escopos Shared/Local: antecessores contribuem apenas Shared e o nó atribuído vê o arquivo inteiro. Leitura/edição por escopo e commits consolidados evitam notas locais em prompts alheios. São corrigidos remontagem durante streaming, ferramentas duplicadas, controles de arquivo e histórico recolhido, validação de fusos e carregamentos remotos perdidos. Phoenix, LiveView, Bandit, idna, jsv e dependências relacionadas recebem correções de segurança. Densidade e alvos táteis são uniformizados; desaparecem animações de entrada antigas e a lista lateral redundante. O desktop permite uma barra de título sem moldura opcional com controles por plataforma.

Escolha o pacote desktop v0.15.0 para o seu sistema. O servidor headless suporta Linux x64/ARM64 e macOS ARM64. Instalações existentes podem executar `genesis update --check` e depois `genesis update`, que instala a atualização disponível e reinicia. Preserve o diretório de dados configurado e consulte as instruções versionadas. Confirme depois versão ativa, atualização conta/modelo, um rascunho por projeto e um pequeno ciclo de pausa/retomada; verifique o resultado de revisão e o log. [Instalação versionada][guide]

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.15.0
[guide]: https://github.com/EMI-Group/genesis/blob/v0.15.0/README.md
[workbench]: /pt-br/news/genesis-project-workbench
[accounts]: /pt-br/news/genesis-provider-account-setup
[pause]: /pt-br/news/genesis-whole-tree-pause
