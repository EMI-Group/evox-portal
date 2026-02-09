---
title: "MetaDE: Evoluindo a Evolução Diferencial através da Evolução Diferencial"
pubDate: 2025-02-15
summary: "O MetaDE é um método meta-evolutivo que utiliza a Evolução Diferencial para evoluir os seus próprios hiperparâmetros e estratégias, publicado na IEEE TEVC."
---

A Evolução Diferencial (DE), um dos algoritmos fundamentais na computação evolucionária, tem sido amplamente utilizada em problemas de otimização de caixa-preta devido à sua simplicidade e elevada eficiência. No entanto, o seu desempenho depende fortemente da seleção de hiperparâmetros e estratégias, um problema persistente para os investigadores. Para enfrentar este desafio, a equipa EvoX publicou recentemente um estudo na *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* intitulado "MetaDE: Evolving Differential Evolution by Differential Evolution". Como um método meta-evolutivo que tira partido da DE para evoluir os seus próprios hiperparâmetros e estratégias, o MetaDE permite o ajuste dinâmico de parâmetros e estratégias, incorporando simultaneamente computação paralela acelerada por GPU. Este design melhora substancialmente a eficiência computacional a par do desempenho da otimização. Os resultados experimentais demonstram que o MetaDE oferece um desempenho excecional tanto no conjunto de testes de referência CEC2022 como em tarefas de controlo de robôs. O código-fonte do MetaDE está disponível em código aberto no GitHub em [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Contexto**

No campo da Computação Evolucionária, o desempenho dos algoritmos é frequentemente influenciado de forma significativa pela escolha dos hiperparâmetros. Determinar as configurações de parâmetros mais adequadas para um problema específico tem sido um desafio de investigação de longa data. A Evolução Diferencial (DE), como um algoritmo evolucionário clássico, é amplamente favorecida pela sua simplicidade e robusta capacidade de pesquisa global; no entanto, o seu desempenho é altamente sensível à seleção de hiperparâmetros. Os métodos convencionais baseiam-se tipicamente em ajustes baseados na experiência ou em mecanismos adaptativos para melhorar o desempenho. Contudo, perante diversos cenários de problemas, estas abordagens têm frequentemente dificuldade em equilibrar a eficiência e a aplicabilidade alargada.

O conceito de "Meta-Evolução" foi introduzido logo no século passado, com o objetivo de utilizar os próprios algoritmos evolucionários para otimizar as configurações de hiperparâmetros desses algoritmos. Embora a meta-evolução exista há muitos anos, a sua aplicação prática tem sido limitada pelas elevadas exigências computacionais. Avanços recentes na computação em GPU atenuaram estas limitações, fornecendo um forte suporte de hardware para algoritmos evolucionários. Em particular, a introdução da framework EvoX distribuída e acelerada por GPU facilitou grandemente o desenvolvimento de algoritmos evolucionários baseados em GPU. Neste contexto, a nossa equipa de investigação propôs uma nova abordagem de meta-evolução que utiliza a DE para evoluir os seus próprios hiperparâmetros e estratégias, oferecendo assim uma nova via para resolver o problema de longa data do ajuste de parâmetros em algoritmos evolucionários.

**O Que É a Meta-Evolução?**

A ideia central por trás da meta-evolução pode ser resumida como "**usar um algoritmo evolucionário para se evoluir a si próprio**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Este conceito transcende os métodos tradicionais de computação evolucionária ao não só empregar algoritmos evolucionários para procurar soluções ótimas para um problema, mas também ao adaptar os hiperparâmetros e estratégias dos algoritmos através dos seus próprios processos evolucionários.

Por outras palavras, a meta-evolução introduz um paradigma de "**auto-evolução**", permitindo que os algoritmos se otimizem à medida que exploram o espaço de pesquisa para soluções de problemas. Ao aperfeiçoarem-se continuamente durante o processo evolucionário, os algoritmos tornam-se mais adaptativos e conseguem manter uma elevada eficiência em vários cenários de problemas.

Tomando o MetaDE como exemplo, o seu design está enraizado nesta filosofia. Numa estrutura de duas camadas, a camada inferior (o "**executor**") resolve o problema de otimização dado utilizando uma DE parametrizada. A camada superior (o "**evolver**") utiliza simultaneamente a DE para otimizar as configurações de hiperparâmetros do executor. Esta framework permite que a DE não sirva apenas como um resolvedor, mas também "explore" a melhor forma de ajustar os seus próprios parâmetros e estratégias para resolver diferentes problemas de forma mais eficaz. Tal processo assemelha-se a um sistema que compreende e se aperfeiçoa incrementalmente — uma transformação de **"resolver passivamente um problema" para "auto-evoluir ativamente".** Consequentemente, pode adaptar-se melhor a diversas tarefas. **Se considerarmos a DE como um sistema complexo, o MetaDE permite efetivamente uma forma "recursiva" de autocompreensão e autoaperfeiçoamento dentro deste sistema.**

O termo "**recursividade**" em ciência da computação descreve tipicamente uma função ou procedimento que se chama a si próprio. No MetaDE, este conceito assume um novo significado: é um mecanismo de otimização **internamente recursivo** que utiliza a DE para evoluir os hiperparâmetros da DE. Este esquema autorreferencial não só incorpora uma poderosa adaptatividade, como também fornece uma nova perspetiva sobre o teorema "no free lunch". Uma vez que não existe um conjunto único e universalmente ótimo de parâmetros para todos os problemas, permitir que o algoritmo evolua autonomamente é a chave para encontrar as melhores configurações de parâmetros para uma determinada tarefa.

Através desta abordagem meta-evolutiva recursiva, o MetaDE alcança vários benefícios:

**1. Ajuste Automático de Parâmetros**

O processo de ajuste manual, que exige muito trabalho, é eliminado. O próprio algoritmo aprende a ajustar os seus hiperparâmetros, reduzindo a intervenção humana e melhorando a eficiência.

**2. Adaptabilidade Reforçada**

O MetaDE responde dinamicamente às mudanças nas características e condições dos problemas, modificando estratégias em tempo real para melhorar o desempenho. Isto aumenta significativamente a flexibilidade do algoritmo.

**3. Pesquisa Eficiente**

Ao tirar partido do paralelismo inerente, o MetaDE acelera grandemente as pesquisas em problemas de otimização de larga escala. Fornece soluções viáveis para problemas complexos e de alta dimensão dentro de prazos razoáveis.

**Implementação Algorítmica**

O MetaDE utiliza técnicas baseadas em tensores e aceleração por GPU para permitir uma computação paralela eficiente. Ao processar muitos indivíduos de uma população simultaneamente, a eficiência computacional global é marcadamente melhorada, tornando-o particularmente vantajoso em otimização de caixa-preta de objetivo único e problemas de otimização de larga escala. Através da tensorização de parâmetros-chave e estruturas de dados (por exemplo, população, fitness, parâmetros de estratégia), o MetaDE não só alcança uma maior eficiência computacional, como também aumenta a sua capacidade de enfrentar desafios de otimização complexos. Comparado com a DE clássica e outros algoritmos evolucionários (EAs), o MetaDE mostra um desempenho superior na resolução de problemas de larga escala. Devido à abordagem baseada em tensores, o MetaDE utiliza os recursos computacionais de forma mais eficaz, produzindo soluções mais rápidas e resultados de otimização mais precisos do que os métodos tradicionais.

![1.png](/images/articles/metade-4.png "1.png")

Arquitetura PDE

A equipa de investigação propôs primeiro uma framework de algoritmo DE parametrizada (PDE) que suporta totalmente modificações de parâmetros e estratégias. Nesta framework, `F` e `CR` são parâmetros contínuos, enquanto outros parâmetros são discretos. As caixas tracejadas indicam o intervalo de valores de parâmetros permitidos. A função de mutação é derivada dos vetores de base esquerdo e direito, juntamente com o parâmetro que controla o número de vetores de diferença.

![2.png](/images/articles/metade-5.png "2.png")

Arquitetura MetaDE

O MetaDE adota uma estrutura de duas camadas, compreendendo **um evolver** (camada superior) e **múltiplos executores** (camada inferior). O evolver é uma DE (ou potencialmente outro algoritmo evolucionário), responsável por otimizar os parâmetros da PDE. Cada indivíduo ![spacer.gif](/images/articles/metade-6.gif) `x_i` na população do evolver corresponde a uma configuração de parâmetros única `θ_i`. Estas configurações são passadas à PDE para instanciar diferentes variantes de DE, cada uma gerida por um executor que corre independentemente na tarefa de otimização dada. Cada executor devolve o seu melhor valor de fitness `y^*` ao evolver, que atribui esse valor de fitness `y_i` ao indivíduo correspondente `x_i`.

**Desempenho Experimental**

Para avaliar de forma abrangente a eficácia do MetaDE, a equipa de investigação realizou experiências sistemáticas abrangendo múltiplos testes de referência e cenários do mundo real. Cada experiência utilizou um evolver (DE com estratégia rand/1/bin) e executores (PDE com um tamanho de população de 100). Os principais componentes experimentais incluem:

**Referência CEC2022**
Comparação do MetaDE com várias variantes de DE em tarefas de otimização de objetivo único.

**Comparação com os Quatro Melhores Algoritmos do CEC2022**
Avaliação do MetaDE face aos quatro algoritmos com melhor desempenho na competição CEC2022 sob os mesmos orçamentos de avaliações de funções (FEs).

**Avaliações de Funções (FEs) sob Tempo de Execução Fixo**
Análise da eficiência computacional do MetaDE sob aceleração por GPU.

**Tarefas de Controlo de Robôs**
Aplicação do MetaDE a tarefas de controlo de robôs num ambiente da plataforma Brax para validar a sua utilidade prática.

**Referência CEC2022: Comparação com Variantes de DE Convencionais**

A equipa comparou o MetaDE com várias variantes representativas de DE no conjunto de testes CEC2022, incluindo:

* **DE Padrão (rand/1/bin)**
* **SaDE e JaDE (algoritmos de DE adaptativos)**
* **CoDE (DE com integração de estratégias)**
* **SHADE e LSHADE-RSP (DE adaptativa baseada no histórico de sucesso)**
* **EDEV (variantes de DE integradas)**

Todos os algoritmos foram implementados na plataforma EvoX, utilizando aceleração por GPU com um tamanho de população de 100 para garantir a equidade. As experiências foram realizadas em diferentes dimensionalidades (10D e 20D) sob **a mesma restrição de tempo computacional (60 segundos)**.

![3.png](/images/articles/metade-7.png "3.png")

Resultados de Otimização 10D CEC2022

![4.png](/images/articles/metade-8.png "4.png")

Resultados de Otimização 20D CEC2022

O MetaDE alcança geralmente uma convergência mais rápida e estável na maioria das funções de teste. A sua DE parametrizada (PDE) aliada à otimização da camada superior permite a adaptação dinâmica a diferentes espaços de problemas, melhorando a robustez global e o desempenho da pesquisa.

**Comparação com os Quatro Melhores Algoritmos do CEC2022 (Sob as Mesmas FEs)**

Para avaliar melhor a capacidade de otimização do MetaDE, comparámo-lo com os quatro melhores algoritmos da competição CEC2022 dentro do **mesmo orçamento de avaliações de funções**:

* **EA4eig**: Um método híbrido que integra múltiplos EAs.
* **NL-SHADE-LBC**: Uma DE adaptativa melhorada.
* **NL-SHADE-RSP-MID**: Uma SHADE melhorada com estimativa de ponto médio.
* **S-LSHADE-DP**: Uma variante de DE que mantém a diversidade da população através de perturbação dinâmica.

Cada um destes algoritmos foi executado com as suas configurações de parâmetros oficiais e código-fonte sob **as mesmas restrições de FE**. Comparações estatísticas (teste de soma de postos de Wilcoxon, nível de significância 0,05) foram realizadas entre o MetaDE e cada linha de base no conjunto de testes CEC2022. A última linha da tabela mostra o desempenho de cada algoritmo comparado com o MetaDE nas diferentes funções de teste: + (significativamente melhor), ≈ (sem diferença significativa) e − (significativamente pior).

![5.png](/images/articles/metade-9.png "5.png")

Comparação de Algoritmos da Competição 10D CEC2022 (Mesmas FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparação de Algoritmos da Competição 20D CEC2022 (Mesmas FEs)

O MetaDE demonstra consistentemente um desempenho forte, especialmente em problemas complexos que exigem uma convergência robusta. Devido ao seu **mecanismo auto-adaptativo**, o MetaDE ajusta eficazmente a sua estratégia para diferentes paisagens de pesquisa, melhorando assim a eficiência da pesquisa e a capacidade de otimização global. Estes resultados indicam que o MetaDE não só supera as variantes convencionais de DE, como também exibe uma forte competitividade contra algoritmos de competição de topo.

**Eficiência Computacional: FEs Dentro de um Tempo Fixo (60 segundos)**

A equipa de investigação registou ainda **o número de avaliações de funções (FEs) concluídas por diferentes algoritmos dentro do mesmo tempo de execução fixo (60 segundos)**.

![图片2.png](/images/articles/metade-11.png)

FEs Alcançadas por Cada Algoritmo em 60 Segundos

Sob a mesma framework EvoX com computação paralela acelerada por GPU, o MetaDE alcançou, em média, FEs de nível **10⁹**, enquanto as variantes tradicionais de DE apenas atingiram cerca de **10⁶** FEs. Esta vantagem advém da abordagem parametrizada do MetaDE, que realiza **avaliações paralelas em larga escala** de indivíduos, permitindo uma **utilização mais eficiente dos recursos de hardware.** Consequentemente, o algoritmo explora mais soluções dentro da mesma janela de tempo, melhorando tanto a qualidade da solução como a estabilidade.

**Aprendizagem por Reforço Evolucionária: Tarefas de Controlo de Robôs**

Na Aprendizagem por Reforço (RL), a eficiência e a estabilidade da otimização de políticas são cruciais. Métodos baseados em gradiente, como PPO e SAC, podem sofrer de desvanecimento ou explosão de gradiente em ambientes de alta dimensão. Em contraste, a Aprendizagem por Reforço Evolucionária (EvoRL) contorna estes problemas utilizando **pesquisas sem gradiente** para otimizar diretamente os parâmetros da política.

![8.png](/images/articles/metade-12.png "8.png")

Processo de Aprendizagem por Reforço Evolucionária

Dentro da framework EvoRL, o MetaDE:

* **Otimiza automaticamente os parâmetros da rede neuronal**, aumentando a adaptabilidade dos modelos de política.
* **Ajusta dinamicamente os hiperparâmetros**, melhorando a estabilidade do treino.
* **Tira partido da aceleração por GPU** para acelerar a otimização da política.

Para avaliar o desempenho do MetaDE em tarefas de otimização complexas, aplicámo-lo a **problemas de controlo de robôs** utilizando otimização acelerada por GPU na **plataforma de simulação Brax**. O estudo incluiu três tarefas — **Swimmer**, **Hopper** e **Reacher** — cada uma modelada por uma rede neuronal totalmente ligada (MLP) de três camadas com o objetivo de **maximizar a recompensa**. Notavelmente, cada MLP contém cerca de **1.500 parâmetros**, criando um **desafio de otimização de 1.500 dimensões** para algoritmos evolucionários (EAs). Isto impõe requisitos rigorosos tanto na capacidade de pesquisa como na eficiência computacional.

![9.png](/images/articles/metade-13.png "9.png")

Curvas de Convergência para Três Ambientes Brax

Como mostrado na figura, o MetaDE demonstra um desempenho forte em tarefas de controlo de robôs baseadas em Brax, alcançando os melhores resultados na tarefa Swimmer e resultados quase ótimos em Hopper e Reacher. A sua principal vantagem reside na elevada qualidade da população inicial, permitindo uma convergência rápida nas fases iniciais e produzindo soluções de alta qualidade. Estas descobertas sugerem que o MetaDE pode **otimizar eficientemente políticas de redes neuronais**, tornando-o **bem adequado para tarefas de controlo de robôs com simulações físicas complexas** e **oferecendo um amplo potencial para aplicações práticas**.

**Conclusão e Direções Futuras**

O MetaDE é uma abordagem meta-evolutiva inovadora que não só se destaca na resolução de tarefas de otimização, mas também ajusta e aperfeiçoa autonomamente as suas próprias estratégias. Capitalizando os pontos fortes da Evolução Diferencial, o MetaDE exibe um forte potencial na configuração adaptativa de parâmetros e na evolução de estratégias. Os resultados experimentais mostram uma robustez superior numa gama de testes de referência, e a sua aplicabilidade no mundo real é sublinhada pelo sucesso em tarefas de controlo de robôs via aprendizagem por reforço evolucionária. Um desafio central envolve manter um equilíbrio ideal entre generalização e especialização — garantindo que o algoritmo se possa adaptar a diversas tarefas enquanto otimiza eficazmente para problemas específicos. Esta investigação oferece novas perspetivas para algoritmos evolucionários auto-adaptativos e pode impulsionar novos avanços na meta-evolução para sistemas complexos.

**Código Aberto e Comunidade**

**Artigo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

Grupo QQ | Evolving Machine Intelligence

O MetaDE é construído sobre a framework EvoX. Se estiver interessado na EvoX, consulte o artigo sobre a EvoX 1.0 para mais detalhes.

![image.png](/images/articles/metade-1.png)

([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")