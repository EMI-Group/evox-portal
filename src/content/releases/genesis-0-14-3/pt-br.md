---
title: "Genesis 0.14.3: pausar uma tarefa e retomar toda a árvore de agentes"
pubDate: 2026-11-19
summary: "Pontos de controle persistentes por agente ligam recuperação de tarefas, fases visíveis e concorrência limitada das ferramentas."
---

Um trabalho de desenvolvimento prolongado precisa de mais do que um botão de reinício: é necessário preservar quais os agentes em execução, o que aprenderam e que estado dos arquivos pode realmente ser recuperado. O [Genesis 0.14.3][release], publicado a 19 de novembro de 2026, reúne pausa e retomada por tarefa, estado persistente dos agentes, atividade em tempo real mais clara e melhorias na configuração, aprovações e implementação.

![Uma árvore mecânica ramificada volta a ligar-se às suas bases ancoradas](./whole-tree-resume.webp)

*Ilustração conceitual: recuperar uma tarefa significa voltar a ligar os ramos ao respectivo estado salvo.*

## Pausar uma tarefa sem a cancelar
Uma tarefa em execução passa por `pausing` até `paused`. Os agentes terminam os lotes de ferramentas em curso, salvam as conversas e fazem commit das árvores de trabalho antes de parar. As tarefas pausadas continuam visíveis e podem ser retomadas; não passam a concluídas nem canceladas. A retomada usa o mesmo ID de tarefa.

Isto ajuda quando uma implementação com vários agentes precisa de parar entre sessões. Mantenha a persistência ativa, solicite a pausa e aguarde o estado pausado antes de considerar o trabalho consolidado. A opção está ativada por padrão e também é controlada por `persistent_state` em `genesis_start_task`. As sessões interativas não podem ser pausadas e uma tarefa sem persistência não pode ser retomada. A [implementação desta versão][pause] exige ainda um registro duradouro do agente raiz; só os registros dos filhos não chegam.
## Recuperar a árvore com um limite explícito dos arquivos
Um armazenamento SQLite separado conserva conversas, identidades de execução e progresso dos lotes de ferramentas e subagentes. Ao retomar a árvore completa, os filhos concluídos fornecem resultados salvos; os que ainda estavam em execução retomam os seus próprios pontos de controle e bases de trabalho. Os ID estáveis mantêm estas associações, com aviso e alternativa se uma identidade estiver ocupada.

Referências Git em `refs/genesis/agent-state` mantêm os commits acessíveis após a remoção dos ramos de trabalho. Uma pausa limpa pode reconstruir a árvore a partir do commit de pausa registrado. Após interrupção, o [aviso de retomada][notice] identifica o ponto garantido: alterações sem commit da execução terminada não têm preservação garantida. Se não houver ponto de controle, o aviso explica o regresso à base da tarefa.

Se a tarefa editava arquivos e iniciava trabalhos, inspecione o commit indicado, `git status` e `job_list` antes de repetir operações. As chamadas interrompidas recebem informação de reparação, não resultados de sucesso inventados. A versão também corrige criação duplicada de subagentes, sessões interativas restauradas erradamente como tarefas pausadas após falha e recuperação no limite de turnos.
## Ver trabalho que antes parecia inativo
O inspetor e o Assistant utilizam atividade em tempo real e instantâneos atômicos de observação. A compressão do contexto e a preparação do turno seguinte têm fases ocupadas próprias. O Context Memory apresenta chamadas ativas nas linhas finais, mantendo estático o raciocínio histórico. Os intervalos silenciosos tornam-se mais fáceis de interpretar, distinguindo compressão de pedidos bloqueados.

As autorizações de ferramentas pertencentes ao agendador limitam chamadas concorrentes e conservam a titularidade durante transferências para segundo plano. Inícios abandonados são rejeitados e a limpeza de contenção após timeout termina antes de parar as tarefas de ferramentas. Notificações de conclusão e consultas ao estado do sistema operacional saem do caminho bloqueante do registro; o fecho de sessões também evita barreiras síncronas de persistência. A escrita dos pontos de controle agrupa trabalho em fila e limita acumulação e payload, contendo a pressão do armazenamento.
## Configuração e aprovações mais explícitas
As API de definições orientadas por esquema permitem atualizações parciais; o Assistant pode descobrir configuração e consultar projetos apenas para leitura. Diálogos e notificações de aprovação mostram identidade do requerente, autoridade e estado de execução. Melhoram o âmbito das notificações, o foco, os pedidos de permissão e o comportamento com movimento reduzido.

As sessões Assistant associadas ao projeto incluem conversas isoladas, uploads e acompanhamento de tarefas; o [artigo sobre o fluxo de projeto][workflow] explica a interação. Comandos explícitos de inventário local de skills dispensam verificações de permissões das ferramentas. Um commit automático de recurso cobre um passo de commit ausente ou falhado.
## Atualizar e verificar o trabalho recuperado
Para uma instalação existente do servidor headless, o [guia desta versão][update] documenta:
```bash
genesis update --check
genesis update
```
A verificação devolve o código 10 quando existe uma atualização. Deixe terminar o trabalho ativo antes de atualizar: o atualizador verifica atividade, prepara a versão, reinicia e valida o estado do servidor. Na nova versão, tarefas em processo de pausa continuam a bloquear a atualização; as pausadas mantêm-se retomáveis sem a bloquear. A publicação disponibiliza pacotes Linux x64, Linux ARM64 e macOS ARM64.

A atualização da base de dados usa migrações normais em vez de reconciliação histórica separada. Conflitos de identidades antigas são reconciliados de forma aditiva; estados residuais ou incompletos de migração são rejeitados. A reparação SQLite destina-se apenas ao desenvolvimento. Auxiliares de retomada não usados e um alias de conclusão saem da API pública, pelo que as integrações próprias devem verificar estas remoções.

As dependências incluem Plug 1.20.4, com a correção de segurança do limite de comprimento multipart, e ReqLLM 1.31.0; hashes de dependências Nix e verificações prévias são renovados. Após atualizar, confirme versão e saúde do servidor e experimente uma pequena tarefa persistente: pause, confirme o ponto de controle, retome a mesma tarefa e verifique resultados filhos e rótulos de atividade. Consulte as [notas completas][release] juntamente com os diagnósticos de migração da sua instalação.

[release]: https://github.com/EMI-Group/genesis/releases/tag/v0.14.3
[pause]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/task_registry/pause.ex
[notice]: https://github.com/EMI-Group/genesis/blob/v0.14.3/apps/evo_git/lib/evo_git/agent/resume/notice.ex
[update]: https://github.com/EMI-Group/genesis/blob/v0.14.3/docs/server-update.md
[workflow]: /pt-br/news/genesis-assistant-project-workflows

