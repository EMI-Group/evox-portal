---
title: "ICML 2026 | EvoGM: fusão autônoma de modelos de grande escala por meio de evolução populacional sem retreinamento"
pubDate: 2026-05-29
summary: "A equipe EvoX, em colaboração com o Laboratório Peng Cheng, apresenta o EvoGM, um framework de fusão evolutiva generativa de modelos que transforma a busca de coeficientes de fusão em um problema de otimização generativa aprendível, permitindo a fusão autônoma de modelos sem retreinar os modelos de grande escala participantes."
---

# ICML 2026 | EvoGM: fusão autônoma de modelos de grande escala por meio de evolução populacional sem retreinamento

![image1.png](./evogm-1.png)

## Resumo

À medida que as capacidades dos modelos de linguagem de grande escala continuam a melhorar, também aumenta o número de modelos especialistas ajustados para tarefas específicas. Como reutilizar eficientemente as capacidades desses modelos especialistas sem retreinar os modelos de grande escala participantes na fusão nem depender de dados de treinamento adicionais em grande escala tornou-se um problema central na fusão de modelos. Os métodos existentes geralmente dependem de fusão por média, escalonamento manual, recorte de parâmetros ou busca aleatória. Embora consigam combinar as capacidades de vários modelos até certo ponto, têm dificuldade em aprender continuamente a partir de avaliações históricas e melhorar a estratégia de fusão.

Para abordar esse problema, a equipe EvoX, em colaboração com o Laboratório Peng Cheng, apresenta o EvoGM (Evolutionary Generative Merging), um framework de fusão evolutiva generativa de modelos que transforma a busca de coeficientes de fusão em um problema de otimização generativa aprendível. O EvoGM organiza diferentes configurações de fusão em uma população de candidatos e, por meio de pareamento winner-loser, treinamento de duplo gerador, restrições de consistência cíclica e atualização evolutiva da base de especialistas, faz com que a população evolua continuamente em um ciclo fechado de «gerar—avaliar—selecionar—reaprender», aprendendo de forma autônoma a partir de feedback limitado de validação como transformar configurações de baixo desempenho em configurações de alto desempenho. Os resultados experimentais mostram que o EvoGM exibe uma capacidade de fusão de modelos superior tanto em cenários de tarefas vistas quanto não vistas.

## I. Por que precisamos da fusão de modelos?

Nos últimos anos, as capacidades dos modelos de linguagem de grande escala têm aumentado, mas também o custo de treinamento e ajuste fino. Surge uma pergunta natural: se já temos vários modelos especialistas que funcionam bem em tarefas distintas, será possível combinar suas capacidades para obter um novo modelo mais forte e mais generalista, sem retreinar esses modelos de grande escala?

É exatamente isso que a fusão de modelos pretende resolver.

A ideia central da fusão de modelos é direta: múltiplos modelos especialistas geralmente provêm do mesmo modelo base, tendo sido ajustados apenas em dados ou tarefas diferentes. Assim, pode-se considerar a alteração de parâmetros de cada modelo especialista em relação ao modelo base como uma «direção de capacidade», combinando ponderadamente essas direções para construir um novo modelo fundido. Sua vantagem é que não requer retreinar nem ajustar finamente os modelos de grande escala participantes na fusão, nem depender de dados de treinamento adicionais em grande escala; basta buscar os coeficientes de fusão adequados. Vale ressaltar que o EvoGM treina geradores leves para buscar coeficientes, mas não atualiza os parâmetros dos modelos especialistas de grande escala.

## II. Onde está a verdadeira dificuldade da fusão de modelos?

A verdadeira dificuldade está aqui: como esses coeficientes devem ser escolhidos?

A fusão de modelos parece ser apenas uma combinação ponderada de vários modelos especialistas, mas as relações de capacidade entre diferentes modelos especialistas não são simples. Algumas direções de tarefa podem se complementar, enquanto certas atualizações de parâmetros podem entrar em conflito; um conjunto de coeficientes de fusão pode funcionar melhor em um tipo de tarefas e provocar perda de desempenho em outro. Portanto, a relação entre os coeficientes de fusão e o desempenho final do modelo não é uma relação linear de fácil caracterização manual.

Os métodos tradicionais geralmente dependem de regras heurísticas como fusão por média, escalonamento manual, recorte de parâmetros ou esparsificação. Esses métodos são simples e eficazes, mas apresentam limitações evidentes: tendem a ser estáticos e empíricos, e têm dificuldade em se ajustar de forma adaptativa com base no feedback de validação de diferentes tarefas.

Posteriormente, foram introduzidos métodos de busca evolutiva na fusão de modelos, organizando configurações candidatas de fusão em uma população e buscando melhores coeficientes por meio de perturbação aleatória, avaliação de aptidão e seleção. Esses métodos são mais flexíveis do que regras fixas, mas ainda têm um problema chave: os resultados de validação geralmente são utilizados apenas para ordenar e filtrar, sem se converterem em experiência de busca aprendível. Em outras palavras, o algoritmo sabe «qual candidato é melhor», mas não aprende de fato «como um candidato pior deveria melhorar».

Esse é o problema central que o EvoGM pretende resolver: a fusão de modelos não deve se limitar a fazer com que a população candidata teste e filtre continuamente, mas sim aprender a partir de avaliações históricas direções de melhoria e gerar de forma autônoma configurações de fusão mais promissoras.

## III. EvoGM: permitir que a estratégia de fusão aprenda de forma autônoma na evolução populacional

![image2.png](./evogm-2.png)

Para resolver os problemas anteriores, propomos o EvoGM (Evolutionary Generative Merging), cujo código já está disponível como open source: https://github.com/JiangTao97/evogm.

A ideia central do EvoGM é organizar as configurações candidatas de fusão como uma população e transformar o processo de busca de coeficientes de fusão em um problema de aprendizado generativo.

O ponto chave é que o modelo generativo não aprende diretamente «quais são os coeficientes de fusão ótimos», mas sim «como passar de uma configuração pior para uma melhor». Isso se deve ao fato de que, em cenários de fusão de modelos, é difícil estabelecer uma ordenação global confiável entre diferentes configurações; em contrapartida, as comparações par a par oferecem sinais de superioridade e inferioridade mais estáveis.

O EvoGM utiliza resultados históricos de validação para construir dados de pareamento winner-loser, permitindo que o gerador aprenda a direção de melhoria de loser para winner. Para cada par de configurações candidatas de fusão, o algoritmo não registra apenas a diferença de desempenho correspondente, mas também converte essa relação de «de pior para melhor» em amostras de treinamento. Após acumular e aprender continuamente, o gerador consegue captar gradualmente quais ajustes de coeficientes têm maior probabilidade de melhorar o desempenho, formando assim uma compreensão implícita da estrutura do espaço de busca. Em outras palavras, aprende não a solução excelente em si, mas as leis de melhoria de desempenho.

Essa ideia está alinhada com os mecanismos de aprendizado competitivo na otimização evolutiva. Pode remontar-se ao CSO (Competitive Swarm Optimizer), que impulsiona a atualização de indivíduos por meio de competição winner-loser, fazendo com que indivíduos de pior desempenho se aproximem dos de melhor desempenho; o EvoGO (Evolutionary Generative Optimization) vai mais além ao utilizar modelos generativos para aprender direções de melhoria a partir de dados históricos de busca, substituindo de forma orientada por dados parte dos operadores de busca projetados manualmente. O EvoGM introduz essa ideia no cenário de fusão de modelos, treinando geradores com feedback de validação para orientar a busca subsequente. Dessa forma, os resultados de validação deixam de ser utilizados apenas para filtrar e eliminar candidatos, passando a se converter continuamente em experiência de busca reutilizável, permitindo que o processo de busca acumule conhecimento e aumente sua eficiência ao longo das iterações.

## IV. Como funciona o EvoGM?

O fluxo geral do EvoGM pode ser dividido em cinco passos: construir candidatos, formar pares de treinamento winner-loser, treinar geradores, gerar e selecionar novos coeficientes, e atualizar a base de especialistas. Após fornecer modelos especialistas e tarefas de validação, esses passos podem ser executados automaticamente em ciclo, sem necessidade de projetar manualmente regras de fusão ou ajustar coeficientes em cada rodada.

1. Inicialização da população: construir candidatos de fusão

O EvoGM precisa primeiro construir um conjunto inicial de candidatos. Cada candidato corresponde a um conjunto de coeficientes de fusão, ou seja, a uma forma distinta de combinar vários modelos especialistas.

Concretamente, a população inicial geralmente inclui vários tipos de configurações: coeficientes correspondentes à fusão por média, coeficientes one-hot correspondentes a modelos especialistas individuais e coeficientes de fusão obtidos por amostragem aleatória. Isso permite cobrir algumas formas de fusão de referência habituais e proporcionar diversidade para a busca subsequente.

Para cada conjunto de coeficientes candidatos, o EvoGM constrói um modelo fundido e avalia seu desempenho no conjunto de validação. Após esse passo, o algoritmo obtém não apenas vários modelos candidatos, mas um conjunto de registros históricos de «coeficientes de fusão—desempenho de validação». Todo o aprendizado generativo e a seleção evolutiva subsequentes se baseiam nesses registros.

2. Pareamento winner-loser: converter resultados de validação em dados de treinamento

Após obter candidatos e seu desempenho de validação, o EvoGM divide as configurações candidatas históricas em winner e loser conforme o desempenho. winner denota a configuração de fusão relativamente melhor, e loser a relativamente pior.

O ponto chave aqui não é simplesmente conservar configurações de alta pontuação e descartar as de baixa pontuação, mas pareá-las para formar pares de treinamento. Para o gerador, um par winner-loser fornece uma informação útil: a partir dessa configuração pior, para qual configuração melhor deveria se aproximar?

Assim, os candidatos de baixo desempenho não são amostras inúteis. Pelo contrário, fornecem o «ponto de partida» do processo de busca, enquanto os candidatos de alto desempenho fornecem a «direção de melhoria». Por meio desse pareamento, o EvoGM consegue converter resultados limitados de avaliação de validação em mais sinais de supervisão aprendíveis, melhorando a eficiência de aproveitamento de dados com feedback de poucas amostras.

3. Treinamento de duplo gerador: aprender a transformação de configurações ruins para boas

Após construir os pares de treinamento winner-loser, o EvoGM utiliza uma estrutura de duplo gerador para o treinamento.

O gerador direto aprende o mapeamento de loser para winner, ou seja, transforma configurações de fusão de baixo desempenho em configurações de alto desempenho mais promissoras. O gerador inverso aprende o mapeamento inverso de winner para loser, utilizado para restringir a consistência estrutural do processo generativo.

O objetivo desse design não é que o gerador memorize simplesmente configurações de alta pontuação existentes, mas sim que aprenda as leis de melhoria no espaço de coeficientes de fusão. Por meio de restrições de consistência cíclica, o EvoGM pode reduzir o risco de colapso do gerador para poucos pontos de alta pontuação, de modo que as configurações candidatas geradas se orientem para regiões de alto desempenho e, ao mesmo tempo, preservem a informação estrutural do espaço de busca.

4. Evolução generativa e seleção: substituir a perturbação aleatória por operadores aprendidos

Após o treinamento do gerador, o EvoGM utiliza o gerador direto para transformar as configurações candidatas atuais e gerar um novo lote de coeficientes de fusão. Esse passo equivale a «gerar novos indivíduos» em um algoritmo evolutivo tradicional, mas os novos indivíduos já não provêm principalmente de perturbação aleatória, e sim das direções de melhoria aprendidas pelo modelo generativo.

Em seguida, esses novos coeficientes de fusão são utilizados para construir novos modelos fundidos e avaliados novamente no conjunto de validação. Os resultados de avaliação são adicionados ao registro histórico e participam da seleção juntamente com os candidatos existentes.

Por meio desse ciclo, o EvoGM passa por um processo de «gerar—avaliar—selecionar—reaprender» a cada rodada. Esse ciclo fechado constitui a evolução populacional das configurações candidatas de fusão: os resultados históricos de validação se acumulam continuamente, o gerador recebe novos sinais de treinamento de forma contínua e, assim, melhora progressivamente sua capacidade de gerar de forma autônoma configurações de fusão de alta qualidade.

5. Base de especialistas evolutiva: atualizar continuamente o espaço de busca

Além de otimizar os coeficientes de fusão, o EvoGM introduz ainda um mecanismo de base de especialistas evolutiva.

A fusão de modelos tradicional geralmente trata os modelos especialistas como entradas fixas, buscando coeficientes de fusão apenas entre modelos especialistas fixos. O EvoGM é diferente: ao final de cada rodada, os melhores modelos fundidos são selecionados como nova base de especialistas para a busca da rodada seguinte.

O sentido de fazer isso é que os modelos fundidos excelentes já contêm certas combinações de capacidades eficazes. Ao incorporá-los na nova base de especialistas, a busca subsequente deixa de se limitar a combinações lineares entre os modelos especialistas originais, podendo continuar a evoluir sobre modelos intermediários já validados como eficazes.

Assim, o espaço de busca do EvoGM não é fixo, mas se atualiza continuamente com o processo de busca. Ele não busca apenas melhores coeficientes de fusão, mas também constrói gradualmente uma base de representação de especialistas mais adequada à tarefa atual.

## V. Quais são as vantagens-chave do EvoGM?

Em comparação com os métodos tradicionais de fusão de modelos, as vantagens do EvoGM se manifestam principalmente em três aspectos.

Em primeiro lugar, o EvoGM leva a fusão de modelos de regras heurísticas estáticas para uma busca autônoma orientada por feedback. Os métodos tradicionais geralmente dependem de fusão por média, escalonamento manual ou perturbação aleatória, enquanto o EvoGM pode ajustar continuamente a direção de busca com base em resultados históricos de validação, de modo que o processo de fusão deixa de depender do projeto manual de regras e do ajuste de coeficientes em cada rodada.

Em segundo lugar, o EvoGM melhora a eficiência de aproveitamento de dados com um orçamento limitado de avaliações. Na fusão de modelos, cada avaliação de configuração candidata requer construir um modelo fundido e executar tarefas de validação, com um custo não negligenciável. O EvoGM converte ainda esses resultados de avaliação em sinais de treinamento aprendíveis, de modo que cada tentativa fornece informação para a busca subsequente.

Por fim, o EvoGM não busca apenas um conjunto melhor de coeficientes de fusão, mas aprende gradualmente as leis de combinação de capacidades entre modelos especialistas. Por meio da busca generativa da população candidata e da atualização da base de especialistas, consegue recombinar e expandir continuamente o espaço de busca com base em modelos especialistas existentes, descobrindo de forma mais eficaz modelos fundidos de alto desempenho.

## VI. Resultados experimentais: o EvoGM é realmente eficaz?

Na configuração de tarefas vistas, avaliamos primeiro o efeito de fusão de modelos do EvoGM nas tarefas da série GLUE. Esse experimento abrange 8 tarefas de compreensão de linguagem — CoLA, MNLI, MRPC, QNLI, QQP, RTE, SST-2 e STS-B — e compara o EvoGM com métodos representativos de fusão de modelos como Task Arithmetic, TIES, DARE-TIES, DELLA, RankMean, CMA, AdaMerging e PSO-Merging. Os resultados mostram que o EvoGM supera em desempenho médio nas 8 tarefas o anterior melhor método, PSO-Merging.

![image3.png](./evogm-3.png)

Na configuração mais exigente de tarefas não vistas, avaliamos ainda se o EvoGM consegue transferir as capacidades de modelos especialistas existentes para novas tarefas não incluídas no ajuste fino dos especialistas. Concretamente, fundimos 10 modelos especialistas LoRA baseados em Qwen2.5-1.5B e os testamos em 8 tarefas não vistas: MMLU, MMLU-Pro, HellaSwag, Knowledge Crosswords, GSM8K, NLGraph, TruthfulQA e AbstainQA. Essas tarefas abrangem compreensão de conhecimento, raciocínio complexo e confiabilidade em segurança, entre outras dimensões de capacidade, refletindo melhor a capacidade de generalização dos métodos de fusão de modelos do que as tarefas vistas.

Na configuração de fusão não vista de tarefa única, o EvoGM busca um conjunto de coeficientes de fusão para cada tarefa alvo separadamente. Os resultados mostram que o EvoGM obtém o melhor desempenho de teste em 5 das 8 tarefas de teste.

![image4.png](./evogm-4.png)

Além da fusão de tarefa única, examinamos a configuração de fusão não vista multitarefa. Nessa configuração, o objetivo deixa de ser encontrar o modelo ótimo para cada tarefa separadamente, mas sim obter um modelo fundido unificado capaz de cobrir simultaneamente as 8 tarefas não vistas. Os resultados indicam que, na fusão não vista multitarefa, o EvoGM obtém o melhor desempenho médio de teste entre todos os métodos de fusão.

![image5.png](./evogm-5.png)

Os resultados mostram que o EvoGM alcança um desempenho de generalização global mais sólido tanto na fusão de tarefa única quanto na configuração multitarefa, superando os métodos existentes de fusão de modelos em múltiplas tarefas relacionadas a conhecimento, raciocínio e segurança.

![image6.png](./evogm-6.png)

![image7.png](./evogm-7.png)

Para analisar mais a fundo a origem do desempenho do EvoGM e sua capacidade de escalabilidade, realizamos experimentos de ablação e de fusão com diferentes números de modelos. Os resultados indicam que o EvoGM completo obtém sempre o melhor desempenho ou o mais estável; ao remover componentes-chave, o desempenho diminui em diferentes graus, o que demonstra que sua vantagem provém principalmente do mecanismo de evolução generativa, e não de uma simples busca aleatória ou de mais rodadas de busca. Ao mesmo tempo, quando aumenta o número de modelos especialistas participantes na fusão, o EvoGM mantém um bom desempenho e mostra uma tendência de melhoria estável, indicando que consegue enfrentar de forma eficaz espaços de fusão maiores e mais complexos, aproveitar plenamente as capacidades complementares entre diferentes modelos especialistas e apresenta uma boa escalabilidade.

## VII. De EvoGO a EvoGM: extensão do pensamento evolutivo generativo

De uma perspectiva mais ampla, o EvoGM pode ser compreendido como uma extensão da ideia do EvoGO à fusão de modelos de grande escala. O EvoGO concentra-se em como fazer com que a otimização evolutiva passe de depender de operadores de cruzamento, mutação e perturbação projetados manualmente para aprender automaticamente, por meio de modelos generativos a partir de dados históricos de busca, novas formas de gerar soluções. Ou seja, a busca evolutiva deixa de ser apenas «gerar candidatos ao acaso e filtrar», e começa a aprender «como gerar candidatos mais promissores».

O EvoGM leva essa ideia ao cenário de fusão de modelos de grande escala. Aqui, os candidatos já não são variáveis numéricas de um problema de otimização geral, mas conjuntos de coeficientes de fusão; uma avaliação já não é simplesmente calcular uma função objetivo, mas construir um modelo fundido e validar seu desempenho em tarefas downstream. Assim, o EvoGM reformula na prática a fusão de modelos como um problema de otimização generativa: como aprender a partir de resultados históricos de avaliação as leis de combinação de capacidades entre modelos especialistas e gerar configurações de fusão superiores.

Isso distingue claramente o EvoGM dos métodos de fusão de modelos baseados em busca tradicional. Os métodos tradicionais geralmente utilizam os resultados de validação apenas para ordenar e filtrar, enquanto o EvoGM os converte ainda em sinais de treinamento. As configurações de baixo desempenho não são simplesmente descartadas, mas pareadas com configurações de alto desempenho em pares winner-loser para treinar o gerador a aprender a direção evolutiva de configurações ruins para boas.

De EvoGO a EvoGM, em essência passa-se de «aprender a otimizar candidatos» a «permitir que a estratégia de fusão de modelos de grande escala evolua de forma autônoma na população». Isso não liberta apenas a fusão de modelos de regras empíricas e perturbações aleatórias, mas também oferece uma nova perspectiva: as capacidades dos modelos de grande escala podem ser fundidas, e a própria estratégia de fusão também pode aprender continuamente a partir do feedback populacional.

## VIII. Conclusões e perspectivas

À medida que aumentam os modelos especialistas, modelos LoRA e modelos de tarefa no ecossistema open source, a questão-chave do futuro pode não ser apenas «como treinar um novo modelo», mas «como combinar eficientemente as capacidades de modelos existentes». O EvoGM oferece uma nova resposta: sem retreinar os modelos de grande escala participantes na fusão, aprende por meio de evolução generativa a partir de feedback limitado de validação e completa de forma autônoma a construção da população candidata, a geração de esquemas de fusão, a avaliação e seleção, e a atualização da base de especialistas. Em resumo, o EvoGM leva a fusão de modelos de «ajustar coeficientes por experiência» para «deixar que a estratégia de fusão aprenda e evolua por si mesma». Isso também significa que a reutilização de capacidades de modelos de grande escala pode entrar em uma nova fase: não retreinar um modelo sempre que surge uma nova tarefa, mas deixar que os modelos especialistas existentes combinem continuamente, por meio de evolução populacional e fusão autônoma, modelos mais adequados para novas tarefas.

## Código aberto / Comunidade

📄 Paper:
https://arxiv.org/pdf/2605.29295
🔗 GitHub:

https://github.com/JiangTao97/evogm
🔼 Projeto upstream (EvoX):

https://github.com/EMI-Group/evox
🌐 Grupo QQ:

297969717

![image8.png](./evogm-8.png)
