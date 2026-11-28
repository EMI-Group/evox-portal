---
title: "EvoX Compiler separa preparação reutilizável de entradas variáveis"
pubDate: 2026-11-28
summary: "Novas transformações estruturais expõem uma fronteira prepare/apply para inspecionar o que pode ser reutilizado e o que tem de executar a cada chamada."
---

Um cálculo repetido mistura frequentemente entradas fixas e variáveis. Recalcular a parte fixa pode desperdiçar recursos, mas guardar um intermédio arbitrário pode alterar silenciosamente o comportamento. EvoX Compiler main disponibiliza split_by_inputs e analyze_inputs: uma passagem estrutural divide um grafo traçado em preparação e aplicação, com uma fronteira de tensores inspecionável. O original não muda. As alterações de 27–28 de novembro tornam a reutilização uma decisão explícita, não uma cache escondida. [Implementação e contrato][contract]

![Uma prensa mantém uma chapa gravada preparada enquanto folhas diferentes entram por um alimentador separado](./cover.webp)

*Ilustração conceptual: preparar uma vez a contribuição fixa e reutilizá-la com entradas variáveis.*

## Escolher as entradas fixas

Considere muitos tensores candidatos avaliados contra as mesmas referências. Se um grafo linear deriva primeiro um intermédio apenas das referências e depois o combina com cada candidato, essa derivação pode ir para prepare. O candidato variável vai para apply, com a árvore variável e o tuplo preparado. É um exemplo de estrutura adequada, não uma aceleração medida.

A máscara fixed espelha o pytree de entrada: True fixa um tensor, False ou None torna-o variável. fixed_leaves também permite indicar índices planos de tensores. É obrigatório exatamente um seletor. Folhas estáticas já especializam o grafo e não atravessam a fronteira; uma máscara não-None é aí rejeitada. Ambas as metades precisam de entradas tensor, logo fixar todas ou nenhuma é inválido. Tuplos, listas e dicionários normais são podados por folha; a poda parcial de nós registados de aridade fixa, dataclass ou namedtuple é recusada. [Seleção][split]

## Examinar o custo da fronteira

A passagem propaga máscaras de dependência pelo SSA linear, percorre as saídas para trás para remover operações mortas e seleciona valores fixos necessários às operações mistas ou retornos. Clona operações em módulos novos. Constantes são copiadas para a metade relevante, não enviadas como saídas preparadas. Entradas variáveis não utilizadas permanecem na assinatura apply.

SplitPlan apresenta fronteira, formas, tipos, bytes estimados e contagens de operações. Um tamanho estático desconhecido produz uma estimativa desconhecida. Contam-se IDs distintos de operações de origem: uma constante copiada para ambas as metades conta em cada uma, mas uma só vez na união usada para calcular exclusões. A soma pode não igualar a origem. O relatório compara armazenamento retido e cálculo repetido sem tratar operações como previsão de tempo real. [API de análise][analysis]

## Um snapshot com limites explícitos

Alterar uma entrada fixa exige executar prepare de novo. Nenhum grafo gere invalidação. Efeitos fora de pure/read são recusados: independência de entradas variáveis não torna seguro executar apenas uma vez. A primeira passagem também recusa regiões aninhadas como cond, while_loop e scan. Coletivas, callbacks e chamadas externas ou personalizadas precisam de outra abordagem quando bloqueadas.

analyze_inputs usa as mesmas dependências sem executar, traçar ou importar backends. Mostra se a divisão é possível, motivo do bloqueio, consumidores, saídas afetadas e custo de fixar cada entrada isoladamente quando legal. Comece aqui: uma fronteira grande ou pouco cálculo fixo pode tornar a divisão pouco útil. A recusa descreve o grafo, não justifica suprimir efeitos.

## Comparar ambas as metades com o original

Use fontes com estes commits. Obtenha um SplitPlan e chame verify para verificar invariantes e ligações. Cada Graph passa por lower, compile e load; build recusa deliberadamente grafos já traçados. Execute prepare só com argumentos fixos e apply com a árvore variável e o tuplo preparado. Compare várias entradas variáveis com o original segundo as tolerâncias do backend; altere depois as fixas e repita a preparação. Meça preparação, execução recorrente e memória separadamente. O [artigo sobre a compilação][related] explica as etapas envolventes.

[contract]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/CONTEXT.md
[split]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/split.py
[analysis]: https://github.com/EMI-Group/evoxc/blob/11ed232dc90b138c71787f42335dd8c38caf8fb9/evoxc/transforms/analyze.py
[related]: /pt/news/evoxc-custom-compilation-pipeline
