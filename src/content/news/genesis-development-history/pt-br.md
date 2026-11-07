---
title: "Genesis: preservar as contribuições dos agentes na história do software"
pubDate: 2026-09-26
summary: "Genesis 0.13.2–0.13.4 liga o histórico Git das tarefas às faixas dos agentes, mantendo as contribuições verificáveis após a sua conclusão."
---

A árvore dos agentes mostra quem trabalha agora. A história do projeto deve também explicar o que fica depois. Genesis 0.13.4, publicado em 26 de setembro de 2026, desenvolve a vista de commits de 0.13.2 e as referências persistentes das tarefas de 0.13.3, ligando atividade temporária a versões inspecionáveis.

## De agentes ativos a referências persistentes

A API de histórico por tarefa resolve referências persistentes e o commit de base. A vista temporal mantém assim commits de agentes já reciclados. A API anterior consulta intervalos e referências entre repositórios; a camada da tarefa fornece o contexto para seguir um esforço específico.

Quando um agente delega um módulo e termina, a contribuição pode continuar a precisar de revisão. Git dá à alteração uma identidade duradoura e a vista da tarefa ajuda a localizá-la. O fim de uma execução não precisa de apagar a relação entre tarefa e código produzido.

## Mostrar relações entre contribuições

A versão 0.13.4 organiza commits por faixas de agentes, agrupa subárvores e mostra delegação e fusão de retorno. Commits sem proprietário têm uma faixa neutra. Seleção, sincronização ao passar o cursor e acesso por teclado ajudam a inspeção; falhas parciais de leitura não apagam todo o grafo.

A vista assinala o corte no limite de 100 commits. É uma forma de navegar pelo desenvolvimento, não um arquivo ilimitado ou uma explicação completa de cada decisão.

## A rastreabilidade apoia a seleção

O grafo mostra a origem e integração de uma alteração em uma branch, mas não prova a sua correção. Diferenças, testes e revisão continuam necessários. Para a evolução de software do EvoX, torna mais visível a relação entre contribuições propostas e versões retidas, ajudando a escolher o que desenvolver a seguir.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.2) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.3) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
