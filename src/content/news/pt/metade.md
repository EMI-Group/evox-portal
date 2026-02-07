---
title: "MetaDE: evoluindo a evolução diferencial pela evolução diferencial"
pubDate: 2025-02-15
summary: "MetaDE é um método meta-evolutivo que utiliza a evolução diferencial para evoluir os seus próprios hiperparâmetros e estratégias, publicado no IEEE TEVC."
---

A Differential Evolution (DE), um dos algoritmos centrais da computação evolutiva, tem sido amplamente utilizada em problemas de otimização de caixa-preta devido à sua simplicidade e alta eficiência. No entanto, o seu desempenho depende fortemente da seleção de hiperparâmetros e estratégias, um problema persistente para os investigadores. Para resolver este desafio, a equipa EvoX publicou recentemente um estudo no *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* intitulado "MetaDE: Evolving Differential Evolution by Differential Evolution." Como método meta-evolutivo que utiliza DE para evoluir os seus próprios hiperparâmetros e estratégias, o MetaDE permite o ajuste dinâmico de parâmetros e estratégias enquanto incorpora computação paralela acelerada por GPU. Este design melhora substancialmente a eficiência computacional juntamente com o desempenho de otimização. Os resultados experimentais demonstram que o MetaDE apresenta um desempenho excecional tanto no conjunto de benchmarks CEC2022 como em tarefas de controlo robótico. O código fonte do MetaDE é open source no GitHub em [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Contexto**

No campo da Computação Evolutiva, o desempenho dos algoritmos é frequentemente significativamente influenciado pela escolha de hiperparâmetros. Determinar as configurações de parâmetros mais adequadas para um problema específico tem sido um desafio de investigação de longa data. A Differential Evolution (DE), como algoritmo evolutivo clássico, é amplamente apreciada pela sua simplicidade e capacidade robusta de pesquisa global; no entanto, o seu desempenho é altamente sensível à seleção de hiperparâmetros. Os métodos convencionais dependem tipicamente de ajuste baseado em experiência ou mecanismos adaptativos para melhorar o desempenho. Contudo, face a cenários de problemas diversos, estas abordagens frequentemente têm dificuldade em equilibrar eficiência e ampla aplicabilidade.

O conceito de "Meta-Evolução" foi introduzido já no século passado, com o objetivo de usar os próprios algoritmos evolutivos para otimizar as configurações de hiperparâmetros desses algoritmos. Embora a meta-evolução exista há muitos anos, a sua aplicação prática tem sido limitada pelas elevadas exigências computacionais. Os avanços recentes na computação GPU aliviaram estas restrições, fornecendo forte suporte de hardware para algoritmos evolutivos. Em particular, a introdução do framework EvoX com aceleração GPU distribuída facilitou grandemente o desenvolvimento de algoritmos evolutivos baseados em GPU. Neste contexto, a nossa equipa de investigação propôs uma nova abordagem de meta-evolução que utiliza DE para evoluir os seus próprios hiperparâmetros e estratégias, oferecendo assim uma nova via para resolver o problema de longa data do ajuste de parâmetros em algoritmos evolutivos.



**O Que É a Meta-Evolução?**

A ideia central por trás da meta-evolução pode ser resumida como "**usar um algoritmo evolutivo para evoluir a si próprio**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Este conceito transcende os métodos tradicionais de computação evolutiva ao não apenas empregar algoritmos evolutivos para procurar soluções ótimas para um problema, mas também adaptar os hiperparâmetros e estratégias dos algoritmos através dos seus próprios processos evolutivos.

Por outras palavras, a meta-evolução introduz um paradigma de "**auto-evolução**", permitindo que os algoritmos se otimizem a si próprios enquanto exploram o espaço de busca para soluções de problemas. Ao refinarem-se continuamente durante o processo evolutivo, os algoritmos tornam-se mais adaptativos e podem manter alta eficiência em vários cenários de problemas.

Tomando o MetaDE como exemplo, o seu design está enraizado nesta filosofia. Numa estrutura de duas camadas, a camada inferior (o "**executor**") resolve o problema de otimização dado usando uma DE parametrizada. A camada superior (o "**evoluidor**") emprega simultaneamente DE para otimizar as configurações de hiperparâmetros do executor. Este framework permite que a DE não apenas sirva como solucionador, mas também "explore" como melhor ajustar os seus próprios parâmetros e estratégias para resolver mais eficazmente diferentes problemas. Tal processo é semelhante a um sistema que incrementalmente se compreende e refina a si próprio -- uma transformação de **"resolver passivamente um problema" para "auto-evoluir ativamente."** Consequentemente, pode adaptar-se melhor a tarefas diversas. **Se considerarmos a DE como um sistema complexo, o MetaDE efetivamente permite uma forma "recursiva" de autocompreensão e automelhoria dentro deste sistema.**

O termo "**recursão**" em ciência da computação descreve tipicamente uma função ou procedimento que se chama a si próprio. Dentro do MetaDE, este conceito assume um novo significado: é um mecanismo de otimização **internamente recursivo** que emprega DE para evoluir os hiperparâmetros da DE. Este esquema autorreferencial não só incorpora uma poderosa adaptabilidade, como também fornece uma perspetiva nova sobre o teorema "no free lunch". Porque não existe um conjunto único e universalmente ótimo de parâmetros para todos os problemas, permitir que o algoritmo evolua autonomamente é a chave para encontrar as melhores configurações de parâmetros para uma dada tarefa.

Através desta abordagem meta-evolutiva recursiva, o MetaDE alcança vários benefícios:

**1. Ajuste Automatizado de Parâmetros**

     O processo laborioso de ajuste manual é eliminado. O próprio algoritmo aprende como ajustar os seus hiperparâmetros, reduzindo a intervenção humana e melhorando a eficiência.

**2. Adaptabilidade Melhorada**

     O MetaDE responde dinamicamente a características e condições de problemas em mudança, modificando estratégias em tempo real para melhorar o desempenho. Isto aumenta significativamente a flexibilidade do algoritmo.

**3. Pesquisa Eficiente**
      Ao tirar partido do paralelismo inerente, o MetaDE acelera grandemente as pesquisas em problemas de otimização de grande escala. Fornece soluções viáveis para problemas complexos de alta dimensionalidade dentro de prazos razoáveis.

**Implementação Algorítmica**

O MetaDE emprega técnicas baseadas em tensores e aceleração GPU para permitir computação paralela eficiente. Ao processar muitos indivíduos de uma população simultaneamente, a eficiência computacional global é marcadamente melhorada, tornando-o particularmente vantajoso em otimização mono-objetivo de caixa-preta e problemas de otimização de grande escala. Através da tensorização de parâmetros-chave e estruturas de dados (por exemplo, população, aptidão, parâmetros de estratégia), o MetaDE não só alcança maior eficiência computacional como também melhora a sua capacidade de enfrentar desafios complexos de otimização. Comparado com a DE clássica e outros algoritmos evolutivos (EAs), o MetaDE mostra desempenho superior na resolução de problemas de grande escala. Graças à abordagem baseada em tensores, o MetaDE utiliza os recursos computacionais de forma mais eficaz, produzindo soluções mais rápidas e resultados de otimização mais precisos do que os métodos tradicionais.

![1.png](/images/articles/metade-4.png "1.png")

Arquitetura PDE

A equipa de investigação propôs primeiro um framework de algoritmo DE parametrizado (PDE) que suporta totalmente modificações de parâmetros e estratégias. Neste framework, F e CR são parâmetros contínuos, enquanto os outros parâmetros são discretos. As caixas tracejadas indicam o intervalo de valores de parâmetros permitidos. A função de mutação é derivada dos vetores base esquerdo e direito, juntamente com o parâmetro que controla o número de vetores de diferença.

![2.png](/images/articles/metade-5.png "2.png")

Arquitetura MetaDE

O MetaDE adota uma estrutura de duas camadas, compreendendo **um evoluidor** (camada superior) e **múltiplos executores** (camada inferior). O evoluidor é uma DE (ou potencialmente outro algoritmo evolutivo), responsável por otimizar os parâmetros do PDE. Cada indivíduo![spacer.gif](/images/articles/metade-6.gif) x_i na população do evoluidor corresponde a uma configuração de parâmetros única θ_i. Estas configurações são passadas ao PDE para instanciar diferentes variantes de DE, cada uma gerida por um executor que funciona independentemente na tarefa de otimização dada. Cada executor retorna o seu melhor valor de aptidão y^* ao evoluidor, que atribui esse valor de aptidão y_i ao indivíduo correspondente x_i.



**Desempenho Experimental**

Para avaliar de forma abrangente a eficácia do MetaDE, a equipa de investigação realizou experiências sistemáticas abrangendo múltiplos testes de benchmark e cenários do mundo real. Cada experiência utilizou um evoluidor (DE com estratégia rand/1/bin) e executores (PDE com tamanho de população de 100). Os componentes experimentais principais incluem:

**Benchmark CEC2022**
 Comparação do MetaDE com várias variantes de DE em tarefas de otimização mono-objetivo.

**Comparação com os Quatro Melhores Algoritmos do CEC2022**
 Avaliação do MetaDE contra os quatro algoritmos com melhor desempenho da competição CEC2022 sob orçamentos idênticos de avaliações de funções (FEs).

**Avaliações de Funções (FEs) Sob Tempo de Relógio Fixo**
 Análise da eficiência computacional do MetaDE sob aceleração GPU.

**Tarefas de Controlo Robótico**
 Aplicação do MetaDE a tarefas de controlo robótico num ambiente da plataforma Brax para validar a sua utilidade prática.



**Benchmark CEC2022: Comparação com Variantes Mainstream de DE**

A equipa comparou o MetaDE com várias variantes representativas de DE no conjunto de benchmarks CEC2022, incluindo:

* **DE Padrão (rand/1/bin)**
* **SaDE e JaDE (algoritmos DE adaptativos)**
* **CoDE (DE com integração de estratégias)**
* **SHADE e LSHADE-RSP (DE adaptativa baseada em histórico de sucesso)**
* **EDEV (variantes DE integradas)**

Todos os algoritmos foram implementados na plataforma EvoX, utilizando aceleração GPU com tamanho de população de 100 para equidade. As experiências foram conduzidas em diferentes dimensionalidades (10D e 20D) sob **a mesma restrição de tempo computacional (60 segundos)**.

![3.png](/images/articles/metade-7.png "3.png")

Resultados de Otimização CEC2022 10D

![4.png](/images/articles/metade-8.png "4.png")

Resultados de Otimização CEC2022 20D

O MetaDE geralmente alcança convergência mais rápida e estável na maioria das funções de teste. A sua DE parametrizada (PDE) combinada com otimização da camada superior permite adaptação dinâmica a diferentes espaços de problemas, melhorando a robustez geral e o desempenho de pesquisa.



**Comparação com os Quatro Melhores Algoritmos do CEC2022 (Sob FEs Idênticas)**

Para avaliar ainda mais a capacidade de otimização do MetaDE, comparámo-lo com os quatro melhores algoritmos da competição CEC2022 dentro do **mesmo orçamento de avaliações de funções**:

* **EA4eig**: Um método híbrido que integra múltiplos EAs
* **NL-SHADE-LBC**: Uma DE adaptativa melhorada
* **NL-SHADE-RSP-MID**: Um SHADE melhorado com estimativa de ponto médio
* **S-LSHADE-DP**: Uma variante de DE que mantém a diversidade da população através de perturbação dinâmica

Cada um destes algoritmos foi executado com as suas configurações oficiais de parâmetros e código fonte sob **as mesmas restrições de FE**. Comparações estatísticas (teste de soma de postos de Wilcoxon, nível de significância 0,05)

foram conduzidas entre o MetaDE e cada baseline no conjunto de testes CEC2022. A última linha da tabela mostra o desempenho de cada algoritmo comparado com o MetaDE nas diferentes funções de teste: + (significativamente melhor), ≈ (sem diferença significativa) e − (significativamente pior).

![5.png](/images/articles/metade-9.png "5.png")

Comparação de Algoritmos da Competição CEC2022 10D (Mesmas FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparação de Algoritmos da Competição CEC2022 20D (Mesmas FEs)

O MetaDE demonstra consistentemente um desempenho forte, especialmente em problemas complexos que requerem convergência robusta. Graças ao seu **mecanismo auto-adaptativo**, o MetaDE ajusta eficazmente a sua estratégia para diferentes paisagens de pesquisa, melhorando assim a eficiência de pesquisa e a capacidade de otimização global. Estes resultados indicam que o MetaDE não só supera as variantes mainstream de DE como também exibe forte competitividade contra algoritmos de competição de topo.



**Eficiência Computacional: FEs Dentro de um Tempo Fixo (60 segundos)**

A equipa de investigação registou ainda **o número de avaliações de funções (FEs) completadas por diferentes algoritmos dentro do mesmo tempo de execução fixo (60 segundos)**.

![图片2.png](/images/articles/metade-11.png)

           FEs Alcançadas por Cada Algoritmo em 60 Segundos

Sob o mesmo framework EvoX com computação paralela acelerada por GPU, o MetaDE alcançou em média FEs ao nível de **10****⁹**, enquanto as variantes tradicionais de DE apenas atingiram cerca de ***10^6*** FEs. Esta vantagem resulta da abordagem parametrizada do MetaDE, que conduz **avaliações paralelas de grande escala** de indivíduos, permitindo **uma utilização mais eficiente dos recursos de hardware.** Consequentemente, o algoritmo explora mais soluções dentro da mesma janela temporal, melhorando tanto a qualidade das soluções como a estabilidade.



**Aprendizagem por Reforço Evolutiva: Tarefas de Controlo Robótico**

Na Aprendizagem por Reforço (RL), a eficiência e estabilidade da otimização de políticas são cruciais. Métodos baseados em gradientes como PPO e SAC podem sofrer de desvanecimento ou explosão de gradientes em ambientes de alta dimensionalidade. Em contraste, a Aprendizagem por Reforço Evolutiva (EvoRL) contorna estes problemas usando **pesquisas sem gradientes** para otimizar diretamente os parâmetros de política.

![8.png](/images/articles/metade-12.png "8.png")

Processo de Aprendizagem por Reforço Evolutiva

Dentro do framework EvoRL, o MetaDE:

* **Otimiza automaticamente parâmetros de redes neuronais**, aumentando a adaptabilidade dos modelos de política.
* **Ajusta dinamicamente hiperparâmetros**, melhorando a estabilidade do treino.
* **Tira partido da aceleração GPU** para acelerar a otimização de políticas.

Para avaliar o desempenho do MetaDE em tarefas de otimização complexas, aplicámo-lo a **problemas de controlo robótico** usando otimização acelerada por GPU na **plataforma de simulação Brax**. O estudo incluiu três tarefas -- **Swimmer**, **Hopper** e **Reacher** -- cada uma modelada por uma rede neuronal totalmente conectada de três camadas (MLP) com o objetivo de **maximizar a recompensa**. Notavelmente, cada MLP contém cerca de **1.500 parâmetros**, criando um **desafio de otimização de 1.500 dimensões** para algoritmos evolutivos (EAs). Isto impõe requisitos rigorosos tanto na capacidade de pesquisa como na eficiência computacional.

![9.png](/images/articles/metade-13.png "9.png")

Curvas de Convergência para Três Ambientes Brax

Conforme mostrado na figura, o MetaDE demonstra forte desempenho em tarefas de controlo robótico baseadas em Brax, alcançando os melhores resultados na tarefa Swimmer e resultados quase ótimos em Hopper e Reacher. A sua principal vantagem reside na alta qualidade da população inicial, permitindo convergência rápida na fase inicial e produzindo soluções de alta qualidade. Estes resultados sugerem que o MetaDE pode **otimizar eficientemente políticas de redes neuronais**, tornando-o **adequado para tarefas de controlo robótico com simulações físicas complexas** e **oferecendo amplo potencial para aplicações práticas**.



**Conclusão e Direções Futuras**

O MetaDE é uma abordagem inovadora de meta-evolução que não só se destaca na resolução de tarefas de otimização como também ajusta e refina autonomamente as suas próprias estratégias. Capitalizando os pontos fortes da Differential Evolution, o MetaDE exibe forte potencial na configuração adaptativa de parâmetros e evolução de estratégias. Os resultados experimentais mostram robustez superior numa gama de testes de benchmark, e a sua aplicabilidade no mundo real é sublinhada pelo sucesso em tarefas de controlo robótico via aprendizagem por reforço evolutiva. Um desafio central envolve manter um equilíbrio ótimo entre generalização e especialização -- garantindo que o algoritmo se possa adaptar a tarefas diversas enquanto também otimiza eficazmente para problemas específicos. Esta investigação oferece novas perspetivas para algoritmos evolutivos auto-adaptativos e pode estimular mais avanços na meta-evolução para sistemas complexos.



**Código Open Source e Comunidade**

**Paper**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Principal (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

  Grupo QQ | Evolving Machine Intelligence

O MetaDE é construído sobre o framework EvoX. Se estiver interessado no EvoX, consulte o artigo sobre o EvoX 1.0 para mais detalhes.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")
