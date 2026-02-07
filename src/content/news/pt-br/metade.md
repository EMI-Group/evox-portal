---
title: "MetaDE: evoluindo a evolução diferencial pela evolução diferencial"
pubDate: 2025-02-15
summary: "MetaDE é um método meta-evolutivo que utiliza a evolução diferencial para evoluir seus próprios hiperparâmetros e estratégias, publicado no IEEE TEVC."
---

A Evolução Diferencial (DE), um dos algoritmos centrais da computação evolutiva, tem sido amplamente empregada em problemas de otimização caixa-preta devido à sua simplicidade e alta eficiência. No entanto, seu desempenho depende fortemente da seleção de hiperparâmetros e estratégias, uma questão persistente para pesquisadores. Para enfrentar esse desafio, a equipe EvoX publicou recentemente um estudo no *IEEE Transactions on Evolutionary Computation (IEEE TEVC)* intitulado "MetaDE: Evolving Differential Evolution by Differential Evolution." Como um método meta-evolutivo que utiliza DE para evoluir seus próprios hiperparâmetros e estratégias, o MetaDE permite o ajuste dinâmico de parâmetros e estratégias enquanto incorpora computação paralela acelerada por GPU. Esse design melhora substancialmente a eficiência computacional junto com o desempenho de otimização. Os resultados experimentais demonstram que o MetaDE entrega desempenho excepcional tanto no conjunto de benchmarks CEC2022 quanto em tarefas de controle robótico. O código-fonte do MetaDE está disponível como open source no GitHub em [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade").

**Contexto**

No campo da Computação Evolutiva, o desempenho dos algoritmos é frequentemente influenciado de forma significativa pela escolha dos hiperparâmetros. Determinar as configurações de parâmetros mais adequadas para um problema específico tem sido um desafio de pesquisa de longa data. A Evolução Diferencial (DE), como um algoritmo evolutivo clássico, é amplamente apreciada por sua simplicidade e robusta capacidade de busca global; no entanto, seu desempenho é altamente sensível à seleção de hiperparâmetros. Métodos convencionais geralmente dependem de ajuste baseado em experiência ou mecanismos adaptativos para melhorar o desempenho. Porém, diante de cenários de problemas diversos, essas abordagens frequentemente têm dificuldade em equilibrar eficiência e ampla aplicabilidade.

O conceito de "Meta-Evolução" foi introduzido já no século passado, com o objetivo de usar os próprios algoritmos evolutivos para otimizar as configurações de hiperparâmetros desses algoritmos. Embora a meta-evolução exista há muitos anos, sua aplicação prática foi limitada pelas altas demandas computacionais. Avanços recentes na computação GPU aliviaram essas restrições, fornecendo forte suporte de hardware para algoritmos evolutivos. Em particular, a introdução do framework EvoX com aceleração GPU distribuída facilitou enormemente o desenvolvimento de algoritmos evolutivos baseados em GPU. Nesse contexto, nossa equipe de pesquisa propôs uma nova abordagem de meta-evolução que utiliza DE para evoluir seus próprios hiperparâmetros e estratégias, oferecendo assim um novo caminho para resolver o problema de longa data do ajuste de parâmetros em algoritmos evolutivos.



**O Que É Meta-Evolução?**

A ideia central por trás da meta-evolução pode ser resumida como "**usar um algoritmo evolutivo para evoluir a si mesmo**" (Evolving an Evolutionary Algorithm by an Evolutionary Algorithm). Esse conceito transcende os métodos tradicionais de computação evolutiva ao não apenas empregar algoritmos evolutivos para buscar soluções ótimas para um problema, mas também adaptar os hiperparâmetros e estratégias dos algoritmos através de seus próprios processos evolutivos.

Em outras palavras, a meta-evolução introduz um paradigma de "**autoevolução**", permitindo que os algoritmos se otimizem enquanto exploram o espaço de busca por soluções de problemas. Ao se refinarem continuamente durante o processo evolutivo, os algoritmos se tornam mais adaptativos e podem manter alta eficiência em diversos cenários de problemas.

Tomando o MetaDE como exemplo, seu design está enraizado nessa filosofia. Em uma estrutura de duas camadas, a camada inferior (o "**executor**") resolve o problema de otimização dado usando uma DE parametrizada. A camada superior (o "**evoluidor**") simultaneamente emprega DE para otimizar as configurações de hiperparâmetros do executor. Esse framework permite que a DE não apenas sirva como um solucionador, mas também "explore" como melhor ajustar seus próprios parâmetros e estratégias para resolver diferentes problemas de forma mais eficaz. Tal processo é semelhante a um sistema que incrementalmente se compreende e se refina -- uma transformação de **"resolver passivamente um problema" para "autoevoluir ativamente."** Consequentemente, pode se adaptar melhor a tarefas diversas. **Se considerarmos a DE como um sistema complexo, o MetaDE efetivamente permite uma maneira "recursiva" de autocompreensão e autoaperfeiçoamento dentro desse sistema.**

O termo "**recursão**" em ciência da computação tipicamente descreve uma função ou procedimento que chama a si mesmo. Dentro do MetaDE, esse conceito assume um novo significado: é um mecanismo de otimização **internamente recursivo** que emprega DE para evoluir os hiperparâmetros da DE. Esse esquema autorreferencial não apenas incorpora uma poderosa adaptabilidade, mas também fornece uma nova perspectiva sobre o teorema "no free lunch". Como não existe um conjunto único e universalmente ótimo de parâmetros para todos os problemas, permitir que o algoritmo evolua a si mesmo autonomamente é a chave para encontrar as melhores configurações de parâmetros para uma tarefa específica.

Através dessa abordagem meta-evolutiva recursiva, o MetaDE alcança vários benefícios:

**1. Ajuste Automatizado de Parâmetros**

     O trabalhoso processo de ajuste manual é eliminado. O próprio algoritmo aprende como ajustar seus hiperparâmetros, reduzindo a intervenção humana e melhorando a eficiência.

**2. Adaptabilidade Aprimorada**

     O MetaDE responde dinamicamente a mudanças nas características e condições dos problemas, modificando estratégias em tempo real para melhorar o desempenho. Isso aumenta significativamente a flexibilidade do algoritmo.

**3. Busca Eficiente**
      Ao aproveitar o paralelismo inerente, o MetaDE acelera enormemente as buscas em problemas de otimização de larga escala. Ele entrega soluções viáveis para problemas complexos e de alta dimensionalidade dentro de prazos razoáveis.

**Implementação Algorítmica**

O MetaDE emprega técnicas baseadas em tensores e aceleração GPU para permitir computação paralela eficiente. Ao processar muitos indivíduos de uma população simultaneamente, a eficiência computacional geral é notavelmente melhorada, tornando-o particularmente vantajoso em otimização caixa-preta de objetivo único e problemas de otimização de larga escala. Através da tensorização de parâmetros-chave e estruturas de dados (por exemplo, população, fitness, parâmetros de estratégia), o MetaDE não apenas alcança maior eficiência computacional, mas também aprimora sua capacidade de enfrentar desafios complexos de otimização. Comparado com a DE clássica e outros algoritmos evolutivos (EAs), o MetaDE mostra desempenho superior na resolução de problemas de larga escala. Graças à abordagem baseada em tensores, o MetaDE utiliza recursos computacionais de forma mais eficaz, produzindo soluções mais rápidas e resultados de otimização mais precisos do que os métodos tradicionais.

![1.png](/images/articles/metade-4.png "1.png")

Arquitetura PDE

A equipe de pesquisa primeiro propôs um framework de algoritmo DE parametrizado (PDE) que suporta totalmente modificações de parâmetros e estratégias. Nesse framework, F e CR são parâmetros contínuos, enquanto outros parâmetros são discretos. As caixas tracejadas indicam o intervalo de valores de parâmetros permitidos. A função de mutação é derivada dos vetores base esquerdo e direito, junto com o parâmetro que controla o número de vetores de diferença.

![2.png](/images/articles/metade-5.png "2.png")

Arquitetura MetaDE

O MetaDE adota uma estrutura de duas camadas, composta por **um evoluidor** (camada superior) e **múltiplos executores** (camada inferior). O evoluidor é uma DE (ou potencialmente outro algoritmo evolutivo), responsável por otimizar os parâmetros do PDE. Cada indivíduo![spacer.gif](/images/articles/metade-6.gif) x_i na população do evoluidor corresponde a uma configuração de parâmetros única θ_i. Essas configurações são passadas ao PDE para instanciar diferentes variantes de DE, cada uma gerenciada por um executor que roda independentemente na tarefa de otimização dada. Cada executor retorna seu melhor valor de fitness y^* ao evoluidor, que atribui esse valor de fitness y_i ao indivíduo correspondente x_i.



**Desempenho Experimental**

Para avaliar de forma abrangente a eficácia do MetaDE, a equipe de pesquisa realizou experimentos sistemáticos abrangendo múltiplos testes de benchmark e cenários do mundo real. Cada experimento usou um evoluidor (DE com estratégia rand/1/bin) e executores (PDE com tamanho de população de 100). Os principais componentes experimentais incluem:

**Benchmark CEC2022**
 Comparando o MetaDE com diversas variantes de DE em tarefas de otimização de objetivo único.

**Comparação com os Quatro Melhores Algoritmos do CEC2022**
 Avaliando o MetaDE contra os quatro algoritmos de melhor desempenho da competição CEC2022 sob orçamentos idênticos de avaliações de função (FEs).

**Avaliações de Função (FEs) Sob Tempo Fixo de Execução**
 Analisando a eficiência computacional do MetaDE sob aceleração GPU.

**Tarefas de Controle Robótico**
 Aplicando o MetaDE a tarefas de controle robótico em um ambiente da plataforma Brax para validar sua utilidade prática.



**Benchmark CEC2022: Comparação com Variantes Mainstream de DE**

A equipe comparou o MetaDE com diversas variantes representativas de DE no conjunto de benchmarks CEC2022, incluindo:

* **DE Padrão (rand/1/bin)**
* **SaDE e JaDE (algoritmos DE adaptativos)**
* **CoDE (DE com integração de estratégias)**
* **SHADE e LSHADE-RSP (DE adaptativa baseada em histórico de sucesso)**
* **EDEV (variantes DE integradas)**

Todos os algoritmos foram implementados na plataforma EvoX, utilizando aceleração GPU com tamanho de população de 100 para garantir equidade. Os experimentos foram conduzidos em diferentes dimensionalidades (10D e 20D) sob **a mesma restrição de tempo computacional (60 segundos)**.

![3.png](/images/articles/metade-7.png "3.png")

Resultados de Otimização CEC2022 10D

![4.png](/images/articles/metade-8.png "4.png")

Resultados de Otimização CEC2022 20D

O MetaDE geralmente alcança convergência mais rápida e estável na maioria das funções de teste. Sua DE parametrizada (PDE) combinada com a otimização da camada superior permite adaptação dinâmica a diferentes espaços de problemas, melhorando a robustez geral e o desempenho de busca.



**Comparação com os Quatro Melhores Algoritmos do CEC2022 (Sob FEs Idênticas)**

Para avaliar ainda mais a capacidade de otimização do MetaDE, o comparamos com os quatro melhores algoritmos da competição CEC2022 dentro do **mesmo orçamento de avaliações de função**:

* **EA4eig**: Um método híbrido integrando múltiplos EAs
* **NL-SHADE-LBC**: Uma DE adaptativa aprimorada
* **NL-SHADE-RSP-MID**: Um SHADE aprimorado com estimativa de ponto médio
* **S-LSHADE-DP**: Uma variante de DE que mantém diversidade populacional através de perturbação dinâmica

Cada um desses algoritmos foi executado com suas configurações oficiais de parâmetros e código-fonte sob **as mesmas restrições de FE**. Comparações estatísticas (teste de soma de postos de Wilcoxon, nível de significância 0,05)

foram conduzidas entre o MetaDE e cada baseline no conjunto de testes CEC2022. A última linha da tabela mostra o desempenho de cada algoritmo comparado ao MetaDE nas diferentes funções de teste: + (significativamente melhor), ≈ (sem diferença significativa) e − (significativamente pior).

![5.png](/images/articles/metade-9.png "5.png")

Comparação de Algoritmos da Competição CEC2022 10D (Mesmas FEs)

![6.png](/images/articles/metade-10.png "6.png")

Comparação de Algoritmos da Competição CEC2022 20D (Mesmas FEs)

O MetaDE demonstra consistentemente forte desempenho, especialmente em problemas complexos que requerem convergência robusta. Graças ao seu **mecanismo autoadaptativo**, o MetaDE ajusta efetivamente sua estratégia para diferentes paisagens de busca, melhorando assim a eficiência de busca e a capacidade de otimização global. Esses resultados indicam que o MetaDE não apenas supera as variantes mainstream de DE, mas também exibe forte competitividade contra algoritmos de competição de primeira linha.



**Eficiência Computacional: FEs Dentro de um Tempo Fixo (60 segundos)**

A equipe de pesquisa registrou ainda **o número de avaliações de função (FEs) completadas por diferentes algoritmos dentro do mesmo tempo fixo de execução (60 segundos)**.

![图片2.png](/images/articles/metade-11.png)

           FEs Alcançadas por Cada Algoritmo em 60 Segundos

Sob o mesmo framework EvoX com computação paralela acelerada por GPU, o MetaDE alcançou em média FEs de nível **10****⁹**, enquanto variantes tradicionais de DE alcançaram apenas cerca de ***10^6*** FEs. Essa vantagem surge da abordagem parametrizada do MetaDE, que conduz **avaliações paralelas em larga escala** de indivíduos, permitindo **utilização mais eficiente dos recursos de hardware.** Consequentemente, o algoritmo explora mais soluções dentro da mesma janela de tempo, melhorando tanto a qualidade quanto a estabilidade das soluções.



**Aprendizado por Reforço Evolutivo: Tarefas de Controle Robótico**

No Aprendizado por Reforço (RL), a eficiência e estabilidade da otimização de políticas são cruciais. Métodos baseados em gradiente como PPO e SAC podem sofrer com desvanecimento ou explosão de gradientes em ambientes de alta dimensionalidade. Em contraste, o Aprendizado por Reforço Evolutivo (EvoRL) contorna esses problemas usando **buscas livres de gradiente** para otimizar diretamente os parâmetros de política.

![8.png](/images/articles/metade-12.png "8.png")

Processo de Aprendizado por Reforço Evolutivo

Dentro do framework EvoRL, o MetaDE:

* **Otimiza automaticamente parâmetros de redes neurais**, aumentando a adaptabilidade dos modelos de política.
* **Ajusta dinamicamente hiperparâmetros**, melhorando a estabilidade do treinamento.
* **Aproveita a aceleração GPU** para acelerar a otimização de políticas.

Para avaliar o desempenho do MetaDE em tarefas complexas de otimização, o aplicamos a **problemas de controle robótico** usando otimização acelerada por GPU na **plataforma de simulação Brax**. O estudo incluiu três tarefas -- **Swimmer**, **Hopper** e **Reacher** -- cada uma modelada por uma rede neural totalmente conectada de três camadas (MLP) com o objetivo de **maximizar a recompensa**. Notavelmente, cada MLP contém cerca de **1.500 parâmetros**, criando um **desafio de otimização de 1.500 dimensões** para algoritmos evolutivos (EAs). Isso impõe requisitos rigorosos tanto para a capacidade de busca quanto para a eficiência computacional.

![9.png](/images/articles/metade-13.png "9.png")

Curvas de Convergência para Três Ambientes Brax

Como mostrado na figura, o MetaDE demonstra forte desempenho em tarefas de controle robótico baseadas em Brax, alcançando os melhores resultados na tarefa Swimmer e resultados quase ótimos em Hopper e Reacher. Sua principal vantagem reside na alta qualidade da população inicial, permitindo convergência rápida nos estágios iniciais e produzindo soluções de alta qualidade. Esses resultados sugerem que o MetaDE pode **otimizar eficientemente políticas de redes neurais**, tornando-o **adequado para tarefas de controle robótico com simulações físicas complexas** e **oferecendo amplo potencial para aplicações práticas**.



**Conclusão e Direções Futuras**

O MetaDE é uma abordagem inovadora de meta-evolução que não apenas se destaca na resolução de tarefas de otimização, mas também ajusta e refina autonomamente suas próprias estratégias. Capitalizando os pontos fortes da Evolução Diferencial, o MetaDE exibe forte potencial em configuração adaptativa de parâmetros e evolução de estratégias. Os resultados experimentais mostram robustez superior em uma variedade de testes de benchmark, e sua aplicabilidade no mundo real é evidenciada pelo sucesso em tarefas de controle robótico via aprendizado por reforço evolutivo. Um desafio central envolve manter um equilíbrio ótimo entre generalização e especialização -- garantindo que o algoritmo possa se adaptar a tarefas diversas enquanto também otimiza efetivamente para problemas específicos. Esta pesquisa oferece novas perspectivas para algoritmos evolutivos autoadaptativos e pode impulsionar avanços adicionais em meta-evolução para sistemas complexos.



**Código Open Source e Comunidade**

**Artigo**: [https://arxiv.org/abs/2502.10470](https://arxiv.org/abs/2502.10470 "https://arxiv.org/abs/2502.10470")

**GitHub**: [https://github.com/EMI-Group/metade](https://github.com/EMI-Group/metade "https://github.com/EMI-Group/metade")

**Projeto Upstream (EvoX)**: [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox "https://github.com/EMI-Group/evox")

**Grupo QQ**: 297969717

![image.png](/images/articles/metade-3.png "image.png")

  Grupo QQ | Evolving Machine Intelligence

O MetaDE é construído sobre o framework EvoX. Se você tem interesse no EvoX, confira o artigo sobre o EvoX 1.0 para mais detalhes.

![image.png](/images/articles/metade-1.png)

 ([https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ](https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ "https://mp.weixin.qq.com/s/uT6qSqiWiqevPRRTAVIusQ"))

![image.png](/images/articles/metade-14.png "image.png")
