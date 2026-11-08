---
title: "MetaDE: fazer evoluir as estratégias de pesquisa com a tarefa"
pubDate: 2025-02-15
updatedDate: 2026-11-08
summary: "O MetaDE acrescenta um ciclo evolutivo externo à evolução diferencial, usando o cálculo paralelo do EvoX para avaliar e melhorar configurações de pesquisa."
---

A adaptação pode atuar sobre a forma de pesquisar, além das soluções encontradas. O MetaDE traz esta ideia para o EvoX com dois níveis evolutivos ligados: um resolve o problema-alvo e o outro avalia quais configurações DE tornam a pesquisa eficaz. [MetaDE](https://github.com/EMI-Group/metade)

![Busca externa de parâmetros em torno de experimentos internos](./nested-evolution-search.webp)

## Contexto

No campo da Computação Evolucionária, o desempenho dos algoritmos é frequentemente influenciado de forma significativa pela escolha dos hiperparâmetros. Determinar as configurações de parâmetros mais adequadas para um problema específico tem sido um desafio de pesquisa de longa data. A Evolução Diferencial (DE), como um algoritmo evolucionário clássico, é amplamente favorecida por sua simplicidade e robusta capacidade de busca global; no entanto, seu desempenho é altamente sensível à seleção de hiperparâmetros. Métodos convencionais normalmente dependem de ajuste baseado em experiência ou mecanismos adaptativos para melhorar o desempenho. No entanto, diante de diversos cenários de problemas, essas abordagens frequentemente têm dificuldade em equilibrar eficiência e ampla aplicabilidade.

O conceito de "Meta-Evolução" foi introduzido ainda no século passado, com o objetivo de usar os próprios algoritmos evolucionários para otimizar as configurações de hiperparâmetros desses algoritmos. Embora a meta-evolução exista há muitos anos, sua aplicação prática foi limitada pelas altas demandas computacionais. Avanços recentes na computação em GPU atenuaram essas restrições, fornecendo um forte suporte de hardware para algoritmos evolucionários. Em particular, a introdução do framework EvoX distribuído e acelerado por GPU facilitou muito o desenvolvimento de algoritmos evolucionários baseados em GPU. Nesse contexto, nossa equipe de pesquisa propôs uma nova abordagem de meta-evolução que utiliza a DE para evoluir seus próprios hiperparâmetros e estratégias, oferecendo assim um novo caminho para resolver o antigo problema de ajuste de parâmetros em algoritmos evolucionários.

## O Que É Meta-Evolução?

A ideia central por trás da meta-evolução pode ser resumida como "**usar um algoritmo evolucionário para evoluir a si mesmo**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Este conceito transcende os métodos tradicionais de computação evolucionária ao não apenas empregar algoritmos evolucionários para buscar soluções ótimas para um problema, mas também adaptar os hiperparâmetros e estratégias dos algoritmos por meio de seus próprios processos evolucionários.

Em outras palavras, a meta-evolução introduz um paradigma de "**auto-evolução**", permitindo que os algoritmos se otimizem enquanto exploram o espaço de busca para soluções de problemas. Ao se refinarem continuamente durante o processo evolucionário, os algoritmos tornam-se mais adaptativos e podem manter alta eficiência em vários cenários de problemas.

Tomando o MetaDE como exemplo, seu design está enraizado nesta filosofia. Em uma estrutura de duas camadas, a camada inferior (o "**executor**") resolve o problema de otimização dado usando uma DE parametrizada. A camada superior (o "**evolver**") emprega simultaneamente a DE para otimizar as configurações de hiperparâmetros do executor. Este framework permite que a DE não sirva apenas como um resolvedor, mas também "explore" a melhor forma de ajustar seus próprios parâmetros e estratégias para resolver diferentes problemas de forma mais eficaz. Tal processo é semelhante a um sistema que compreende e refina a si mesmo incrementalmente — uma transformação de **"resolver passivamente um problema" para "auto-evoluir ativamente"**. Consequentemente, ele pode se adaptar melhor a diversas tarefas. **Se considerarmos a DE como um sistema complexo, o MetaDE permite efetivamente uma maneira "recursiva" de autocompreensão e autoaperfeiçoamento dentro deste sistema.**

O termo "**recursão**" na ciência da computação normalmente descreve uma função ou procedimento que chama a si mesmo. No MetaDE, este conceito assume um novo significado: é um mecanismo de otimização **internamente recursivo** que emprega a DE para evoluir os hiperparâmetros da DE. Este esquema autorreferencial não apenas incorpora uma poderosa adaptatividade, mas também fornece uma nova perspectiva sobre o teorema "no free lunch". Como não existe um conjunto único e universalmente ideal de parâmetros para todos os problemas, permitir que o algoritmo evolua de forma autônoma é a chave para encontrar as melhores configurações de parâmetros para uma determinada tarefa.

Através desta abordagem meta-evolucionária recursiva, o MetaDE alcança vários benefícios:

**1. Ajuste Automático de Parâmetros**

O processo de ajuste manual intensivo em mão de obra é eliminado. O próprio algoritmo aprende como ajustar seus hiperparâmetros, reduzindo a intervenção humana e melhorando a eficiência.

**2. Adaptabilidade Aprimorada**

O MetaDE responde dinamicamente às mudanças nas características e condições do problema, modificando estratégias em tempo real para melhorar o desempenho. Isso aumenta significativamente a flexibilidade do algoritmo.

**3. Busca Eficiente**

Ao aproveitar o paralelismo inerente, o MetaDE acelera consideravelmente as buscas em problemas de otimização de larga escala. Ele entrega soluções viáveis para problemas complexos e de alta dimensão dentro de prazos razoáveis.

## Implementação Algorítmica

O MetaDE emprega técnicas baseadas em tensores e aceleração por GPU para permitir uma computação paralela eficiente. Ao processar muitos indivíduos de uma população simultaneamente, a eficiência computacional geral é notavelmente melhorada, tornando-o particularmente vantajoso em otimização de caixa-preta de objetivo único e problemas de otimização de larga escala. Através da tensorização de parâmetros-chave e estruturas de dados (por exemplo, população, fitness, parâmetros de estratégia), o MetaDE não apenas alcança maior eficiência computacional, mas também aumenta sua capacidade de enfrentar desafios complexos de otimização. Comparado com a DE clássica e outros algoritmos evolucionários (EAs), o MetaDE mostra um desempenho superior na resolução de problemas de larga escala. Devido à abordagem baseada em tensores, o MetaDE aproveita os recursos computacionais de forma mais eficaz, gerando soluções mais rápidas e resultados de otimização mais precisos do que os métodos tradicionais.

![1.png](./metade-4.png "1.png")

Arquitetura PDE

A equipe de pesquisa propôs primeiro um framework de algoritmo DE parametrizado (PDE) que suporta totalmente modificações de parâmetros e estratégias. Neste framework, `F` e `CR` são parâmetros contínuos, enquanto outros parâmetros são discretos. As caixas tracejadas indicam a faixa de valores de parâmetros permitidos. A função de mutação é derivada dos vetores de base esquerdo e direito, juntamente com o parâmetro que controla o número de vetores de diferença.

![2.png](./metade-5.png "2.png")

Arquitetura MetaDE

O MetaDE adota uma estrutura de duas camadas, compreendendo **um evolver** (camada superior) e **múltiplos executores** (camada inferior). O evolver é uma DE (ou potencialmente outro algoritmo evolucionário), responsável por otimizar os parâmetros da PDE. Cada indivíduo  `x_i` na população do evolver corresponde a uma configuração de parâmetros única `θ_i`. Essas configurações são passadas para a PDE para instanciar diferentes variantes de DE, cada uma gerenciada por um executor que roda de forma independente na tarefa de otimização dada. Cada executor retorna seu melhor valor de fitness `y^*` para o evolver, que atribui esse valor de fitness `y_i` ao indivíduo correspondente `x_i`.

## Desempenho Experimental

Para avaliar de forma abrangente a eficácia do MetaDE, a equipe de pesquisa realizou experimentos sistemáticos abrangendo múltiplos testes de benchmark e cenários do mundo real. Cada experimento usou um evolver (DE com estratégia rand/1/bin) e executores (PDE com um tamanho de população de 100). Os principais componentes experimentais incluem:

### Benchmark CEC2022
Comparando o MetaDE com várias variantes de DE em tarefas de otimização de objetivo único.

### Comparação com os Quatro Melhores Algoritmos do CEC2022
Avaliando o MetaDE contra os quatro algoritmos de melhor desempenho da competição CEC2022 sob orçamentos idênticos de avaliações de função (FEs).

### Avaliações de Função (FEs) Sob Tempo de Relógio Fixo
Analisando a eficiência computacional do MetaDE sob aceleração por GPU.

### Tarefas de Controle de Robôs
Aplicando o MetaDE a tarefas de controle de robôs em um ambiente de plataforma Brax para validar sua utilidade prática.

## Benchmark CEC2022: Comparação com as Principais Variantes de DE

A equipe comparou o MetaDE com várias variantes representativas de DE na suíte de benchmark CEC2022, incluindo:

*   **DE Padrão (rand/1/bin)**
*   **SaDE e JaDE (algoritmos DE adaptativos)**
*   **CoDE (DE com integração de estratégia)**
*   **SHADE e LSHADE-RSP (DE adaptativa baseada em histórico de sucesso)**
*   **EDEV (variantes de DE integradas)**

Todos os algoritmos foram implementados na plataforma EvoX, utilizando aceleração por GPU com um tamanho de população de 100 para fins de justiça. Os experimentos foram conduzidos em diferentes dimensionalidades (10D e 20D) sob **a mesma restrição de tempo computacional (60 segundos)**.

![3.png](./metade-7.png "3.png")

Resultados de Otimização CEC2022 10D

![4.png](./metade-8.png "4.png")

Resultados de Otimização CEC2022 20D

O MetaDE geralmente alcança uma convergência mais rápida e estável na maioria das funções de teste. Sua DE parametrizada (PDE) acoplada à otimização da camada superior permite a adaptação dinâmica a diferentes espaços de problemas, melhorando a robustez geral e o desempenho da busca.

## Comparação com os Quatro Melhores Algoritmos do CEC2022 (Sob FEs Idênticas)

Para avaliar ainda mais a capacidade de otimização do MetaDE, comparamos ele com os quatro melhores algoritmos da competição CEC2022 dentro do **mesmo orçamento de avaliação de função**:

*   **EA4eig**: Um método híbrido que integra múltiplos EAs.
*   **NL-SHADE-LBC**: Uma DE adaptativa aprimorada.
*   **NL-SHADE-RSP-MID**: Uma SHADE aprimorada com estimativa de ponto médio.
*   **S-LSHADE-DP**: Uma variante de DE que mantém a diversidade da população através de perturbação dinâmica.

Cada um desses algoritmos foi executado com suas configurações de parâmetros oficiais e código-fonte sob **as mesmas restrições de FE**. Comparações estatísticas (teste de soma de postos de Wilcoxon, nível de significância 0,05) foram conduzidas entre o MetaDE e cada linha de base na suíte de testes CEC2022. A última linha da tabela mostra o desempenho de cada algoritmo comparado ao MetaDE nas diferentes funções de teste: + (significativamente melhor), ≈ (sem diferença significativa) e − (significativamente pior).

![5.png](./metade-9.png "5.png")

Comparação de Algoritmos da Competição CEC2022 10D (Mesmas FEs)

![6.png](./metade-10.png "6.png")

Comparação de Algoritmos da Competição CEC2022 20D (Mesmas FEs)

O MetaDE demonstra consistentemente um desempenho forte, especialmente em problemas complexos que exigem convergência robusta. Devido ao seu **mecanismo auto-adaptativo**, o MetaDE ajusta efetivamente sua estratégia para diferentes cenários de busca, melhorando assim a eficiência da busca e a capacidade de otimização global. Esses resultados indicam que o MetaDE não apenas supera as variantes principais de DE, mas também exibe forte competitividade contra algoritmos de competição de alto nível.

## Eficiência Computacional: FEs Dentro de um Tempo Fixo (60 segundos)

A equipe de pesquisa registrou adicionalmente **o número de avaliações de função (FEs) concluídas por diferentes algoritmos dentro do mesmo tempo de execução fixo (60 segundos)**.

![图片2.png](./metade-11.png)

FEs Alcançadas por Cada Algoritmo em 60 Segundos

Sob o mesmo framework EvoX com computação paralela acelerada por GPU, o MetaDE alcançou, em média, FEs de nível **10⁹**, enquanto as variantes tradicionais de DE alcançaram apenas cerca de **10⁶** FEs. Essa vantagem surge da abordagem parametrizada do MetaDE, que realiza **avaliações paralelas em larga escala** de indivíduos, permitindo uma **utilização mais eficiente dos recursos de hardware.** Consequentemente, o algoritmo explora mais soluções dentro da mesma janela de tempo, melhorando tanto a qualidade quanto a estabilidade da solução.

## Aprendizado por Reforço Evolucionário: Tarefas de Controle de Robôs

O experimento de controle robótico do MetaDE procura parâmetros de uma política neural sem gradientes nem retropropagação do objetivo da política. O aprendizado por reforço evolutivo também inclui métodos com gradientes e híbridos; não elimina de forma geral as dificuldades do PPO ou do SAC.

![8.png](./metade-12.png "8.png")

Os experimentos usam Swimmer, Hopper e Reacher no Brax, com políticas MLP de três camadas e cerca de 1.500 parâmetros. A pesquisa interna otimiza os pesos; a externa ajusta parâmetros e estratégias do executor DE. Estas simulações não demonstram utilização em robôs reais nem uma melhoria geral da estabilidade do treinamento.

![9.png](./metade-13.png "9.png")

Curvas de Convergência para Três Ambientes Brax

Como mostrado na figura, o MetaDE demonstra um desempenho forte em tarefas de controle de robôs baseadas em Brax, alcançando os melhores resultados na tarefa Swimmer e resultados quase ideais em Hopper e Reacher. Sua principal vantagem reside na alta qualidade da população inicial, permitindo uma convergência rápida nos estágios iniciais e produzindo soluções de alta qualidade. Essas descobertas sugerem que o MetaDE pode **otimizar eficientemente políticas de redes neurais**, tornando-o **bem adequado para tarefas de controle de robôs com simulações físicas complexas** e **oferecendo amplo potencial para aplicações práticas**.

## Conclusão e Direções Futuras

Conte tentativas externas de configuração e avaliações internas. Compare os métodos pelo orçamento total e tempo decorrido. [iStratDE: diversidade populacional como princípio de pesquisa paralela](/pt-br/news/istratde)

## Recursos

- [Artigo científico](https://arxiv.org/abs/2502.10470)
- [GitHub](https://github.com/EMI-Group/metade)
- [EvoX](https://github.com/EMI-Group/evox)
