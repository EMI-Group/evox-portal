---
title: "Genesis Assistant: da conversa à tarefa de projeto"
pubDate: 2026-11-16
updatedDate: 2026-11-22
summary: "Selecione um projeto, aprove uma ação concreta e acompanhe o desenvolvimento em segundo plano sem vincular sua duração ao chat."
---

Pedir uma correção num projeto exige um destino, uma ação aprovada e uma forma de acompanhar o resultado. O Genesis Assistant conecta essas etapas na PR #172, integrada na `main` em 15 de novembro de 2026. O fluxo amplia a [continuidade das conversas][previous] com trabalho em projetos.

![Uma pasta de projeto passa por uma estação de aprovação conectada a uma oficina independente](./genesis-assistant-project-workflows.webp)

*Ilustração conceitual: definir o projeto e aprovar o trabalho antes de acompanhar sua execução independente.*

## Escolher o destino antes de começar

Conversar e controlar tarefas não exige mais uma cópia de Genesis. Consultar o código é opcional e sujeito a aprovação. Selecionar um projeto no host escolhido preenche caminhos omitidos sem ler ficheiros ou autorizar desenvolvimento. A troca fica bloqueada durante uma resposta; outro caminho explícito continua sendo o alvo mostrado. [Mudanças integradas][workflows]

A escolha pertence ao nó e à conversa; uma nova conversa no mesmo nó pode herdá-la. O servidor fornece às ferramentas a identidade do nó e da conversa, em vez de permitir que o modelo a invente. Se um pedido especificar outro caminho, a aprovação deve mostrar esse destino real. Isso importa, por exemplo, com dois repositórios de nomes semelhantes: conferir o caminho antes de iniciar evita aprovar o trabalho errado.

## Da aprovação ao acompanhamento da tarefa

As onze definições partilhadas com MCP distinguem consulta de alteração. A leitura do estado de uma tarefa ocorre diretamente; iniciar, cancelar ou enviar requisitos exige aprovação vinculada a parâmetros estruturados imutáveis. Uma recusa ou expiração não executa a ação. Para corrigir um teste, forneça o contexto da falha, confira o destino e os parâmetros propostos e aprove aquele pedido específico. Depois do início, abra o acompanhamento e a revisão do resultado, em vez de deduzir o sucesso apenas pela mensagem de aceitação. [Contrato das ferramentas][workflowguide]

Inícios bem-sucedidos são acompanhados automaticamente; o seletor Tasks pesquisa tarefas existentes.

## Separar o trabalho da resposta

Enviar um requisito adicional o coloca na fila; isso não comprova que o desenvolvedor ativo já o adotou. Da mesma forma, **Stop reply** interrompe a resposta após o lote de ferramentas em execução e preserva a sessão, enquanto a tarefa de desenvolvimento continua. Os cartões mostram estados observados, contadores e horários de atualização, sem inventar percentuais de progresso. Se uma atualização falhar, a última observação permanece disponível. Essas distinções ajudam a decidir entre esperar, verificar o resultado, detalhar o pedido ou solicitar cancelamento. Cancelar não desfaz alterações Git.

Referências a tarefas sobrevivem ao fim da sessão, mas conversas em memória não ao reinício do servidor; tarefas persistentes podem ser encontradas novamente. Experimente uma compilação com a PR #172 e verifique o estado antes de repetir um envio incerto. [Guia atualizado][workflowguide]

## Trazer ficheiros do dispositivo correto

O navegador envia texto, PDF, DOCX, imagens e áudio, quatro ficheiros por mensagem e 15 MiB por ficheiro; anexos concluídos podem ser enviados sem texto. A entrada secundária de caminho do servidor aceita o nó local do painel e não o substitui por um nó remoto incompatível.

O carregamento pelo navegador busca ficheiros no dispositivo em utilização. Ler um caminho do servidor aponta para outro local e fica limitado ao nó local do painel. Aguarde o carregamento terminar antes de mudar de contexto: trocar de conversa ou nó cancela transferências pendentes. Para consultar o código do Genesis, a preparação opcional da referência de código-fonte continua sujeita à aprovação; compare sua versão com a do runtime ativo. O contexto do projeto e a referência do código do Genesis têm, assim, funções distintas. [Ficheiros e referência de código-fonte][workflowguide]

As [alterações de 20 de novembro](/pt/news/genesis-project-workbench) reúnem navegação por projetos, vistas Git e rascunhos com âmbito VCT num ambiente comum.

[previous]: /pt/news/genesis-assistant-interactive-sessions
[workflows]: https://github.com/EMI-Group/genesis/pull/172
[workflowguide]: https://github.com/EMI-Group/genesis/blob/6e10e18dd56ca3c84e2215dac647473c30563fee/docs/genesis-assistant.md
