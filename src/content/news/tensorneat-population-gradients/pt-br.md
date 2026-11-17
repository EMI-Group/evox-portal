---
title: "TensorNEAT: aprender parâmetros com topologias diferentes"
pubDate: 2026-03-03
updatedDate: 2026-11-17
summary: "Gradientes paralelos da população ajustam parâmetros contínuos mantendo a estrutura discreta de cada candidato."
---

Uma população de redes pode ter conexões variadas sem exigir um laço de treinamento por estrutura. O [PR #37][s1] do TensorNEAT, integrado à main em 3 de março de 2026, adiciona gradientes aos genomas tensorizados e um caminho vetorizado com JAX para ajustar a população.

![Redes diferentes mantêm suas conexões enquanto pesos ajustáveis são regulados](./topology-gradients.webp)

*Ilustração conceitual: ajustar parâmetros contínuos preservando a topologia de cada rede.*

## Estruturas diferentes, uma operação de gradiente

TensorNEAT representa redes NEAT em tensores de nós e conexões. `genome.grad` retorna perda escalar e gradientes dos dois arrays. Campos estruturais, como índices e tipos de função, e preenchimento NaN recebem gradientes zero. Os parâmetros numéricos mudam, preservando a estrutura codificada.

A vetorização JAX aplica esse cálculo mesmo a topologias diferentes. O [exemplo XOR][s3] inicializa uma população, diversifica estruturas por mutação e otimiza por descida do gradiente. É uma base concreta para estudar estrutura e parâmetros juntos sem supor que gradientes alteram conexões discretas.

## Tornar o caminho direto diferenciável

A implementação calcula uma perda escalar pela transformação e avaliação direta do genoma e usa `jax.value_and_grad` para derivar os arrays de nós e conexões. Um vetor de entrada segue uma avaliação única; um lote usa avaliação vetorizada. Mudar o objetivo é decisão explícita de quem chama, não uma propriedade implícita da representação. [Implementação do gradiente][implementation]

Também são necessárias mudanças abaixo da API. O genoma padrão percorre um `jax.lax.fori_loop` limitado; conexões e agregações passam máscaras de validade para evitar que NaN não utilizados contaminem os cálculos. O preenchimento pertence à representação, não a conexões treináveis. Mutação estrutural e ajuste numérico continuam distintos, mesmo compartilhando arrays.

## O exemplo XOR separa diversidade e aprendizado

O exemplo integrado inicializa 1.000 redes para XOR de três entradas e aplica 20 rodadas de mutação com chaves aleatórias diferentes. Só então executa descida de gradiente, com taxa 0,5 e no máximo 500 passos. Essa fase usa `jax.jit(jax.vmap(...))` sobre indivíduos sem seleção evolutiva. É uma demonstração do projeto sobre estruturas diferentes, não evidência de que o gradiente substitua a busca topológica. [Exemplo completo][s3]

Leia a contagem de indivíduos válidos junto com as perdas mínima e média. Um candidato desconectado pode produzir saídas não finitas; o exemplo filtra perdas finitas nos relatórios, e os testes mantêm a saída NaN de redes desconectadas. A queda da menor perda não revela quanto da população é utilizável. Após otimizar, examine também as previsões da rede selecionada.

## Conferir derivadas antes de ampliar o experimento

Os testes adicionados cobrem gradientes finitos de genomas conectados padrão e recorrentes, diferenciação compilada, lotes populacionais, redução da perda e diferenças finitas. Para uma tarefa própria, comece pelo exemplo XOR versionado e altere a perda mantendo entradas e limites topológicos explícitos. Confira gradientes e campos estruturais antes de alternar aprendizado e mutação. A posterior [atualização de memória][memory] muda o lote de trabalho, um controle distinto do aprendizado de parâmetros.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s3]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/examples/func_fit/xor_grad.py
[implementation]: https://github.com/EMI-Group/tensorneat/blob/bec15bb5bd497dfd1b7ea765fa0b9f9a095a4709/src/tensorneat/genome/base.py
[memory]: /pt-br/news/tensorneat-gradient-memory
