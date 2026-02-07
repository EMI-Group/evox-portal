---
title: "Otimização multi-objetivo evolutiva acelerada por GPU"
pubDate: 2025-04-16
summary: "Ligando a otimização multi-objetivo evolutiva e a aceleração GPU via tensorização, com a biblioteca EvoMO."
---

**Unir a Otimização Multi-objetivo Evolutiva**

**e a Aceleração GPU via Tensorização**

Zhenyu Liang,Hao Li,Naiwei Yu, Kebin Sun, and Ran Cheng, Senior Member, IEEE

Com o aumento contínuo da procura por soluções de otimização complexas em domínios como o design de engenharia e a gestão de energia, os algoritmos de otimização multi-objetivo evolutiva (EMO) têm atraído ampla atenção devido às suas capacidades robustas na resolução de problemas multi-objetivo. No entanto, à medida que as tarefas de otimização crescem em escala e complexidade, os algoritmos EMO tradicionais baseados em CPU encontram estrangulamentos significativos de desempenho.

Para resolver esta limitação, a equipa EvoX propôs paralelizar algoritmos EMO em GPUs através da metodologia de tensorização. Tirando partido deste método, conseguiram conceber e implementar com sucesso vários algoritmos EMO acelerados por GPU. Além disso, a equipa desenvolveu o **"MoRobtrol"**, um **conjunto de benchmarks para controlo robótico multi-objetivo** construído sobre o motor de física Brax, com o objetivo de avaliar sistematicamente o desempenho dos algoritmos EMO acelerados por GPU.

Com base nestes avanços de investigação, a equipa EvoX lançou o **EvoMO**, uma biblioteca de algoritmos EMO de alto desempenho acelerada por GPU. O código fonte correspondente está disponível publicamente no GitHub: [https://github.com/EMl-Group/evomo](https://github.com/EMl-Group/evomo "https://github.com/EMl-Group/evomo")

**Metodologia de Tensorização**

No campo da otimização computacional, um **tensor** refere-se a uma estrutura de dados de array multidimensional capaz de representar escalares, vetores, matrizes e dados de ordem superior. A **tensorização** é o processo de converter estruturas de dados e operações dentro de um algoritmo para a forma tensorial, permitindo ao algoritmo tirar pleno partido das capacidades de computação paralela das GPUs.

Nos algoritmos EMO, todas as estruturas de dados principais podem ser expressas num formato tensorizado. Os indivíduos numa população podem ser representados por um tensor de soluções ***X***, onde cada vetor linha corresponde a um indivíduo. Os valores da função objetivo formam um tensor de objetivos ***F***. Adicionalmente, estruturas de dados auxiliares como vetores de referência e vetores de pesos podem ser expressas como tensores R e W, respetivamente. Esta representação tensorial unificada permite operações ao nível da população no nível de representação, estabelecendo uma base sólida para computação paralela de grande escala.

A tensorização das operações dos algoritmos EMO é crucial para melhorar a eficiência computacional e pode ser dividida em duas camadas: operações tensoriais básicas e tensorização do fluxo de controlo. As operações tensoriais básicas constituem o núcleo da implementação tensorizada dos algoritmos EMO, conforme detalhado na Tabela I.

Tabela I: Operações Tensoriais Básicas

![](/images/articles/emo-1.png)

A tensorização do fluxo de controlo substitui a lógica tradicional de ciclos e condicionais por operações tensoriais paralelizáveis. Por exemplo, ciclos for/while podem ser transformados em operações em lote usando mecanismos de broadcasting ou funções de ordem superior como vmap. Da mesma forma, condicionais if-else podem ser substituídos por técnicas de mascaramento, onde condições lógicas são codificadas como tensores booleanos, permitindo a alternância flexível entre diferentes caminhos de computação.

Comparada com as implementações tradicionais de algoritmos EMO, a abordagem de tensorização oferece vantagens significativas. Primeiro, proporciona maior flexibilidade, lidando naturalmente com dados multidimensionais, enquanto os métodos convencionais estão frequentemente restritos a operações matriciais bidimensionais. Segundo, a tensorização melhora significativamente a eficiência computacional através da execução paralela, evitando a sobrecarga associada a ciclos explícitos e ramificações condicionais. Por último, simplifica a estrutura do código, resultando em programas mais concisos e fáceis de manter.

Conforme ilustrado na Fig. 1, por exemplo, a implementação tradicional da verificação de dominância de Pareto depende de ciclos aninhados para realizar comparações elemento a elemento. Em contraste, a versão tensorizada alcança a mesma funcionalidade através de operações de broadcasting e mascaramento, permitindo avaliação paralela. Isto não só reduz a complexidade do código como também melhora dramaticamente o desempenho em tempo de execução.

![1744808523688.png](/images/articles/emo-2.png "1744808523688.png")

Fig.1: Comparação entre implementações convencional e baseada em tensores da deteção de dominância de Pareto.

De uma perspetiva mais profunda, a tensorização é adequada para aceleração GPU porque as GPUs possuem um grande número de núcleos paralelos, e a sua arquitetura de instrução única múltiplas threads (SIMT) alinha-se naturalmente com computações tensoriais, destacando-se particularmente em operações matriciais. Hardware dedicado como os Tensor Cores da NVIDIA melhora ainda mais o throughput das operações tensoriais. Em geral, algoritmos que exibem alto paralelismo, contêm tarefas computacionais independentes e têm ramificação condicional mínima são mais adequados para tensorização. Para algoritmos como MOEA/D, que envolvem dependências sequenciais, a estrutura inerente coloca desafios à tensorização direta. No entanto, através de refatoração estrutural e desacoplamento de computações críticas, ainda é possível alcançar aceleração paralela eficaz.

**Exemplo de Aplicação da Tensorização de Algoritmos**

Com base na metodologia de representação tensorizada, a equipa EvoX concebeu e implementou versões tensorizadas de três algoritmos EMO clássicos: o NSGA-III baseado em dominância, o MOEA/D baseado em decomposição e o HypE baseado em indicadores. A secção seguinte fornece uma explicação detalhada usando o MOEA/D como exemplo. As implementações tensorizadas do NSGA-III e HypE podem ser encontradas no artigo referenciado.

Conforme ilustrado na Fig. 2, o MOEA/D tradicional decompõe um problema multi-objetivo em múltiplos subproblemas, cada um dos quais é otimizado independentemente. O algoritmo compreende quatro passos principais: cruzamento e mutação, avaliação de aptidão, atualização do ponto ideal e atualização de vizinhança. Estes passos são executados sequencialmente para cada indivíduo dentro de um único ciclo. Este processamento sequencial leva a uma sobrecarga computacional substancial ao lidar com grandes populações, uma vez que cada indivíduo deve completar todos os passos por ordem, limitando os potenciais benefícios da aceleração GPU. Em particular, a atualização de vizinhança depende de interações entre indivíduos, o que complica ainda mais a paralelização.

![c49f81629ea49fd3e8fe2f9427ce1891.png](/images/articles/emo-3.png "c49f81629ea49fd3e8fe2f9427ce1891.png")

Fig.2: Pseudocódigo do MOEA/D

Para resolver o problema das dependências sequenciais no MOEA/D tradicional, a equipa introduziu um método de representação tensorizada dentro do ciclo interno da seleção ambiental. Ao desacoplar cruzamento e mutação, avaliação de aptidão, atualização do ponto ideal e atualização de vizinhança, estes componentes são tratados como operações independentes. Isto permite o processamento paralelo de todos os indivíduos, levando à construção de um algoritmo MOEA/D tensorizado, designado TensorMOEA/D. Neste algoritmo, a seleção ambiental é dividida em duas fases principais: comparação e atualização da população, e seleção de soluções de elite. Estas duas fases são principalmente tensorizadas através de duas aplicações da operação vmap. O processo detalhado é ilustrado na Fig. 3.

![24f60f0c0a55d4815b28e85bf10bc355.png](/images/articles/emo-4.png)![4.PNG](/images/articles/evox-1-1-2-1.png "4.PNG")

Fig.3: Visão geral da seleção ambiental no algoritmo TensorMOEA/D. **Esquerda**: Pseudocódigo do algoritmo. **Direita**: Fluxo de dados tensorial do módulo (1) e módulo (2). A parte superior da Fig. direita mostra o fluxo de dados tensorial geral para os módulos (1) e (2), enquanto a parte inferior apresenta o fluxo de dados tensorial de cálculo em lote, com o módulo (1) à esquerda e o módulo (2) à direita.

Para obter uma compreensão mais abrangente do valor da tensorização nos algoritmos EMO, pode ser resumido em três perspetivas. Primeiro, a tensorização permite uma transformação direta de formulações matemáticas para código eficiente, reduzindo a distância entre o design do algoritmo e a implementação. Por exemplo, a Fig. 4 ilustra como o procedimento de ordenação não-dominada tensorizado pode ser traduzido diretamente de pseudocódigo para código Python. Segundo, a tensorização simplifica significativamente a estrutura do código ao unificar operações ao nível da população numa única representação tensorial. Isto reduz a dependência de ciclos e instruções condicionais, melhorando assim a legibilidade e manutenibilidade do código. Terceiro, a tensorização melhora a reprodutibilidade dos algoritmos. A sua representação estruturada facilita testes comparativos e reprodução consistente de resultados.

![1744807171462.png](/images/articles/emo-5.png "1744807171462.png")

Fig.4: A transformação perfeita da ordenação não-dominada tensorizada de pseudocódigo (Esquerda) para código Python (Direita).

**Demonstração de Desempenho**

Para avaliar o desempenho dos algoritmos de otimização multi-objetivo acelerados por GPU, a equipa EvoX conduziu sistematicamente três categorias de experiências, focando na aceleração computacional, desempenho de otimização numérica e eficácia em tarefas de controlo robótico multi-objetivo.

**Desempenho de Aceleração Computacional:**

**![36383417f51840724b46fc3a25d15253.png](/images/articles/emo-6.png)**

Fig.5: Desempenho comparativo de aceleração de NSGA-III, MOEA/D e HypE com as suas contrapartes tensorizadas em plataformas CPU e GPU com diferentes tamanhos de população e dimensão do problema.

Os resultados experimentais mostram que TensorNSGA-III, TensorMOEA/D e TensorHypE alcançam velocidades de execução significativamente superiores em GPUs comparadas com as suas contrapartes não-tensorizadas baseadas em CPU. À medida que o tamanho da população e a dimensionalidade do problema aumentam, a aceleração máxima observada atinge até **1113x**. Os algoritmos tensorizados demonstram excelente escalabilidade e estabilidade ao lidar com tarefas computacionais de grande escala -- o seu tempo de execução aumenta apenas marginalmente, mantendo um desempenho consistentemente elevado. Estes resultados destacam as vantagens substanciais da tensorização para aceleração GPU na otimização multi-objetivo.

**Desempenho no Conjunto de Testes LSMOP:**

Tabela II: Resultados Estatísticos (Média e Desvio Padrão) do IGD e Tempo de Execução (s) para Algoritmos EMO Não-Tensorizados e Tensorizados em LSMOP1--LSMOP9. Todas as Experiências São numa GPU RTX 4090 e os Melhores Resultados Estão Destacados.

![4223b2824e5f7cc010f61062ba5d65b4.png](/images/articles/emo-7.png)

Os resultados experimentais indicam que os algoritmos EMO acelerados por GPU baseados em representações tensorizadas melhoram significativamente a eficiência computacional, mantendo, e em alguns casos até superando, a precisão de otimização das suas contrapartes originais.

**Tarefas de Controlo Robótico Multi-objetivo:**

Para avaliar de forma abrangente o desempenho prático dos algoritmos EMO acelerados por GPU, a equipa desenvolveu um conjunto de benchmarks denominado MoRobtrol para controlo robótico multi-objetivo. As tarefas incluídas neste conjunto estão listadas na Tabela III.

Tabela III: Visão Geral dos Problemas de Controlo Robótico Multi-objetivo no Conjunto de Benchmarks MoRobtrol Proposto

![42849ebe60c23ec9431934f8c19bced1.png](/images/articles/emo-8.png)

![3da7407b1ee4385f9d28267cf384d971.png](/images/articles/emo-9.png)

Fig.6: Desempenho comparativo (HV, EU e visualização dos resultados finais) de TensorNSGA-III, TensorMOEA/D, TensorHypE, TensorRVEA e pesquisa aleatória (RS) em diferentes problemas: MoHalfcheetah (390D), MoHopper (243D) e MoWalker2d (390D). *Nota*: Valores mais elevados para todas as métricas indicam melhor desempenho.

![7ddbafa50c86ebe34795ab541836b20f.png](/images/articles/emo-10.png)

Fig.7: Desempenho comparativo (HV, EU e visualização dos resultados finais) de TensorNSGA-III, TensorMOEA/D, TensorHypE, TensorRVEA e pesquisa aleatória (RS) em diferentes problemas: MoPusher (503D), MoHumanoid (4209D) e MoHumanoid-s (4209D). *Nota*: Valores mais elevados para todas as métricas indicam melhor desempenho.

![7931f527c89a8c0a748209ad96fb9af8.png](/images/articles/emo-11.png)

Fig.8: Desempenho comparativo (HV, EU e visualização dos resultados finais) de TensorNSGA-III, TensorMOEA/D, TensorHypE, TensorRVEA e pesquisa aleatória (RS) em diferentes problemas: MoSwimmer (178D), MoIDP (161D) e MoReacher (226D). *Nota*: Valores mais elevados para todas as métricas indicam melhor desempenho.

As experiências compararam o desempenho de TensorNSGA-III, TensorMOEA/D, TensorHypE, TensorRVEA e Pesquisa Aleatória (RS) dentro do benchmark MoRobtrol. Os resultados mostram que o TensorRVEA alcançou o melhor desempenho global, obtendo os valores de HV mais elevados e demonstrando boa diversidade de soluções em múltiplos ambientes. O TensorMOEA/D exibiu forte adaptabilidade em tarefas de grande escala, destacando-se particularmente na consistência de preferência das soluções. O TensorNSGA-III e o TensorHypE mostraram desempenho semelhante e foram competitivos em várias tarefas. No geral, os algoritmos tensorizados baseados em decomposição demonstraram vantagens superiores na resolução de problemas de grande escala e complexos.



**Conclusão e Trabalho Futuro**
 Este estudo propõe uma metodologia de representação tensorizada para resolver as limitações dos algoritmos EMO tradicionais baseados em CPU em termos de eficiência computacional e escalabilidade. A abordagem foi aplicada a vários algoritmos representativos, incluindo NSGA-III, MOEA/D e HypE, alcançando melhorias significativas de desempenho em GPUs mantendo a qualidade das soluções. Para validar a sua aplicabilidade prática, a equipa também desenvolveu o MoRobtrol, um conjunto de benchmarks de controlo robótico multi-objetivo que reformula tarefas de controlo robótico em ambientes de simulação física como problemas de otimização multi-objetivo. Os resultados demonstram o potencial dos algoritmos tensorizados em cenários computacionalmente intensivos como a inteligência incorporada. Embora o método de tensorização tenha melhorado substancialmente a eficiência algorítmica, ainda há espaço para melhorias adicionais. Direções futuras incluem melhorar operadores centrais como a ordenação não-dominada, conceber novas operações tensorizadas para sistemas multi-GPU e integrar dados de grande escala e técnicas de aprendizagem profunda para melhorar ainda mais o desempenho em problemas de otimização de grande escala.


**Código Open Source / Recursos da Comunidade**

Paper:

[https://arxiv.org/abs/2503.20286](https://arxiv.org/abs/2503.20286 "https://arxiv.org/abs/2503.20286")

GitHub:

[https://github.com/EMI-Group/evomo](https://github.com/EMI-Group/evomo "https://github.com/EMI-Group/evomo")

Projeto Principal (EvoX):

[https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

Grupo QQ: 297969717

![](/images/articles/emo-12.png)

O EvoMO é construído sobre o framework EvoX. Se estiver interessado em saber mais sobre o EvoX, consulte o artigo oficial sobre o EvoX 1.0 publicado na nossa conta pública do WeChat para mais detalhes.

![1744939468669.png](/images/articles/evox-1-1-1-1.png)
