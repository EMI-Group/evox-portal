---
title: "Genesis pausa toda a árvore de tarefas sem concluir os filhos inacabados"
pubDate: 2026-11-26
summary: "Um snapshot coordenado preserva esperas dos pais, identidades dos filhos e checkpoints das árvores de trabalho, retomadando a mesma tarefa com reparação quando necessário."
---

Uma tarefa de desenvolvimento pode estar à espera de vários agentes filhos quando o responsável pressiona Pausa. Concluir os seus lotes apenas para parar alteraria o trabalho a preservar. As alterações do Genesis em main de 25 de novembro de 2026 introduzem um snapshot coordenado da árvore inteira: os pais mantêm a posição de espera, os filhos as identidades e checkpoints, e a retomada reconstrói as relações sob o mesmo ID de tarefa. [Concepção e implementação do snapshot][design]

![Um móbile ramificado mantido na posição por uma estrutura de suporte](./cover.webp)

*Ilustração conceitual: preservar cada ramo inacabado antes de retomar toda a estrutura.*

## Uma fase da tarefa, não um freio global

A pausa global do agendador bloqueia a admissão de novo trabalho; não coloca uma tarefa ativa específica num repouso persistente. O protocolo por tarefa passa por pausing até paused, conserva o contexto do resultado e deixa a data de conclusão por preencher. O cancelamento continua a ser uma ação separada e prevalece se chegar durante a pausa. As sessões interativas estão fora deste protocolo. [Integração no registro][registry]

Por exemplo, um agente que coordena um parser e os seus testes pode esperar por dois filhos. A pausa deve preservar essa espera, sem inventar resultados concluídos. O coordenador marca os membros ativos para pausa, remove pedidos em fila de posições de modelos e ferramentas e estaciona os pais à espera do lote de subagentes. Cada agente para numa fronteira de turno após o lote de ferramentas, ou na posição de espera em que já se encontrava. [Coordenador de congelamento][coordinator]

## Preservar o trabalho antes de recuperar recursos

Antes de parar, um agente recolhe os trabalhos em segundo plano, cria um checkpoint da árvore de trabalho, mantém o marcador persistente de ferramentas pendentes e escreve o estado. Os commits dos checkpoints ficam ancorados para sobreviverem à posterior recuperação das árvores de trabalho. O snapshot registra se o agente estava numa fronteira de turno, à espera de filhos ou dentro de um lote interrompido. A pausa comunica o seu próprio resultado; não declara sucesso de um filho inacabado nem integra o trabalho dele. [Caminho de congelamento do agente][agent]

A espera é limitada. O valor documentado permite 120 segundos para atingir a quiescência, seguidos de 10 segundos de tolerância para congelamento forçado. Uma pausa clean exige que todos os agentes demonstrem uma parada persistente sem interrupção. Se o prazo terminar ou faltar essa prova, a tarefa registra uma pausa dirty. Esta distinção descreve o estado guardado, sem prometer desfazer efeitos externos arbitrários.

## Reconstruir a colaboração existente

A retomada volta a colocar a mesma tarefa na fila com as opções persistidas. É necessária uma linha raiz duradoura; apenas linhas filhas não bastam, e um armazenamento ilegível produz um erro explícito. O plano de restauração reconstrói identidades, topologia e posições. Um filho concluído fornece o resultado guardado, um filho ativo reinicia com a própria identidade e checkpoint, e um filho congelado antes do registro pode iniciar a partir da especificação original da chamada. O pai continua à espera de resultados reais. [Caminho de descongelamento][thaw]

Um lote congelado corretamente é restaurado sem a reparação de ferramentas pendentes usada no trabalho interrompido. Um snapshot dirty aplica reparação e um aviso de retomada, distinguindo trabalho comprovadamente concluído de execução incerta. Se um checkpoint não puder ser comprovado, não deve ser adotado silenciosamente como checkpoint limpo de um filho. Na reinicialização ou na reconciliação de leases, uma tarefa running ou pausing com persistência e linha raiz duradoura passa a paused do tipo dirty; uma tarefa não retomável mantém a falha por expiração do lease.

## Verificar primeiro uma pausa e uma retomada

Use uma compilação a partir do código-fonte com estes commits e persistência dos agentes ativada. Pause uma tarefa com filhos ativos, espere pelo estado paused e retome, confirmando a identidade da tarefa, as relações entre filhos e o trabalho guardado. Antes de continuar operações externas, importa verificar os avisos dirty. Sem persistência, a pausa é rejeitada; a recuperação é limitada pelos checkpoints duradouros. O [fluxo de tarefas anterior][related] explica o contexto de projeto e aprovação; esta alteração define como preservar a execução inacabada.

[design]: https://github.com/EMI-Group/genesis/blob/d0796aeef2372221fa3becb13692f7137ceeaffe/docs/task-pause.md
[registry]: https://github.com/EMI-Group/genesis/commit/4af29fadb58dd0096cff5eb95dfcd1e9b8dbae74
[coordinator]: https://github.com/EMI-Group/genesis/commit/e4b4ef863c5515f61e0ce56a40e3acd8c4970d11
[agent]: https://github.com/EMI-Group/genesis/commit/196261f0157a7139de7e002d20aa7d7c633334ff
[thaw]: https://github.com/EMI-Group/genesis/commit/fbaebed0671282d77fc2972f6818058e115f3616
[related]: /pt-br/news/genesis-assistant-project-workflows
