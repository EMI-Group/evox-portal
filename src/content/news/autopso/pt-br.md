---
title: "AutoPSO: Poder de processamento GPU × Metaevolução → Otimização por enxame de partículas totalmente automática"
pubDate: 2026-08-25
summary: "A AutoPSO, proposta pela equipe EvoX e publicada na IEEE TEVC, codifica de forma uniforme a configuração de parâmetros, os mecanismos de aprendizado e a estrutura do enxame do PSO em um espaço evolutivo pesquisável, e por meio de metaevolução busca automaticamente a variante de PSO ótima para um determinado problema-alvo."
---

![](./autopso-hero.png)

O desenvolvimento da otimização por enxame de partículas (PSO) tem sido, em essência, uma história de contínuo "projeto manual". Ao longo das últimas décadas, os pesquisadores propuseram uma vasta gama de melhorias relativas a pesos de inércia, estratégias de aprendizado, topologias de enxame, estruturas de subpopulações e outros componentes, formando gradualmente um amplo espaço de projeto algorítmico em torno do PSO. Porém, quanto maior o espaço, mais difícil a escolha. Diante de uma tarefa de otimização específica — quais parâmetros selecionar, quais mecanismos de aprendizado adotar, como organizar o enxame de partículas — essas decisões de projeto fortemente acopladas continuam, até hoje, fortemente dependentes da experiência dos pesquisadores e de tentativa e erro. O PSO tornou-se cada vez mais rico, mas também cada vez mais difícil de "escolher corretamente". E se o próprio ato de "escolher um PSO" também fosse delegado à evolução algorítmica?

O framework **AutoPSO**, proposto pela equipe EvoX, codifica de forma uniforme a configuração de parâmetros, os mecanismos de aprendizado e a estrutura do enxame do PSO em um espaço evolutivo pesquisável, e busca automaticamente, por meio de **metaevolução**, a variante de PSO ótima adaptada a um determinado problema-alvo. Esse framework não apenas otimiza a solução do problema, mas também, em um nível superior, otimiza automaticamente "qual PSO usar para resolvê-lo".

A busca em larga escala da metaevolução depende de avaliações massivamente paralelas, e a computação tensorizada, o processamento em lote e o paralelismo de GPU do EvoX resolvem justamente esse gargalo — milhares de variantes candidatas podem evoluir simultaneamente, tornando viável na prática a busca em nível meta que antes era inviável em CPU.

**Poder de processamento GPU × metaevolução impulsiona o PSO do "projeto manual" para a "geração automática".**

## Ao PSO não faltam métodos; falta a capacidade de combiná-los automaticamente

Ao longo das últimas décadas, a pesquisa em PSO acumulou um rico conjunto de opções mecânicas: como os parâmetros mudam ao longo das iterações, de quais indivíduos as partículas aprendem, se o enxame é dividido em subgrupos e quais estratégias de atualização os diferentes subgrupos adotam.

O problema não é a escassez de mecanismos, mas o fato de a maioria deles existir como algoritmos autônomos específicos de um problema. Diante de uma nova tarefa, os pesquisadores ainda precisam selecionar, combinar e verificar manualmente em um grande conjunto de mecanismos, para depois reajustá-los.

A filosofia da AutoPSO não é descartar esse conhecimento acumulado, mas reorganizá-lo em um espaço de componentes reutilizáveis. Ela decompõe os aspectos-chave do projeto do PSO em vários módulos:

- como os parâmetros evoluem;

- de quais exemplos as partículas aprendem;

- como o enxame é particionado em subgrupos;

- quais estratégias de atualização são empregadas pelos diferentes subgrupos.

Nas abordagens tradicionais, essas escolhas são feitas principalmente por humanos; na AutoPSO, elas se tornam objetos pesquisáveis pelo algoritmo. Em outras palavras, a AutoPSO não consiste em "reinventar manualmente um PSO", mas em construir um meta-framework que, antes de resolver o problema atual, possa configurar automaticamente uma variante de PSO adequada a ele.

![](./autopso-1.gif)

*Figura 1: A AutoPSO organiza os elementos-chave do projeto do PSO em módulos combináveis e pesquisáveis.*

## Delegar ao próprio algoritmo a otimização de nível externo, tradicionalmente realizada pelos pesquisadores

A pesquisa convencional em otimização sempre teve uma estrutura de dois níveis. No nível interno, o PSO é usado para resolver o problema-alvo — seja otimização de funções, projeto de engenharia ou políticas de controle. No nível externo existe uma otimização menos explícita: os pesquisadores estão otimizando o próprio algoritmo.

Quais regras de atualização escolher, como definir os parâmetros, quais exemplos de aprendizado adotar, se introduzir mecanismos de subgrupos, quais mecanismos podem ser combinados e quais combinações são instáveis — essas decisões normalmente eram tomadas pelos pesquisadores com base na experiência e depois refinadas por tentativa e erro.

A mudança-chave trazida pela AutoPSO é delegar ao algoritmo esse processo de nível externo, antes realizado manualmente pelos pesquisadores. Uma partícula de nível externo não representa mais uma solução candidata ao problema-alvo, e sim um projeto candidato de PSO, codificando parâmetros, exemplos de aprendizado, partição em subgrupos e estratégias de atualização. O PSO de nível interno, equipado com essas configurações, resolve o problema-alvo e devolve seu desempenho como feedback ao nível externo, que segue buscando melhores configurações de algoritmo.

**A AutoPSO não apenas otimiza a solução do problema, mas também otimiza "qual PSO usar para resolvê-lo".**

Ela transforma o processo de projeto de algoritmos, que antes dependia da experiência dos pesquisadores, em um processo evolutivo interno ao sistema, que pode ser automaticamente buscado, avaliado e iterado.

![](./autopso-2.png)

*Figura 2: O nível externo busca configurações do algoritmo, enquanto o nível interno emprega a configuração escolhida para resolver o problema-alvo.*

## EvoX e GPU: tornando o projeto automático de algoritmos realmente viável

Propor um framework de busca automática de estruturas algorítmicas não é particularmente difícil; o verdadeiro desafio está no custo computacional. Avaliar um projeto candidato de PSO exige executá-lo em um processo completo de resolução do problema-alvo. Quanto mais projetos candidatos, maior a carga computacional do nível interno.

Em ambientes seriais tradicionais baseados em CPU, esses custos são proibitivos. Porém, esse tipo de computação é intrinsecamente paralelizável: os algoritmos candidatos podem ser avaliados simultaneamente e, dentro de cada algoritmo candidato, as atualizações das partículas também podem ser processadas em lote. A AutoPSO aproveita o EvoX para mapear a estrutura populacional da computação evolutiva na capacidade de processamento em lote das GPUs, permitindo que a busca de configurações do nível externo e a resolução do problema do nível interno avancem simultaneamente.

Aqui, a aceleração por GPU não significa apenas encurtar o tempo de uma única execução; o mais importante é que ela aumenta substancialmente o número de projetos candidatos que podem ser comparados em um dado período. A metaevolução é essencialmente uma busca no espaço dos algoritmos, e a qualidade dessa busca depende diretamente de **quantos projetos candidatos de PSO foram avaliados**. Quanto mais completa a avaliação, maior a chance de encontrar uma configuração bem adequada ao problema atual.

O valor do EvoX está justamente em fornecer essa capacidade: ele organiza as atualizações das partículas e as avaliações de aptidão do nível interno, bem como a comparação de algoritmos candidatos do nível externo, em operações tensoriais na GPU, permitindo que milhares de projetos candidatos avancem de forma síncrona a cada iteração. Em outras palavras, o EvoX transforma a metaevolução de um processo de "tentativa e erro lenta" em uma "experimentação paralela em larga escala" — e é precisamente nessa base computacional que a AutoPSO se sustenta.

## Não apenas mais rápido, mas também melhor em "usar a busca"

O que a AutoPSO busca demonstrar não é apenas que roda rápido em GPUs, mas sim que, uma vez automatizado o processo de projeto do PSO, o algoritmo consegue de fato descobrir uma estratégia de busca mais adequada ao problema em questão.

No benchmark de otimização numérica CEC2022, a equipe EvoX comparou a AutoPSO com o PSO original, CSO, CLPSO, FIPS e várias variantes de PSO de aprendizado social. Com o mesmo orçamento de tempo de execução, muitas variantes de PSO de estrutura fixa apresentaram queda inicial rápida dos valores objetivo, mas tenderam a estagnar precocemente. Em contraste, a AutoPSO conseguiu ajustar continuamente a configuração do seu PSO de nível interno durante a execução, mantendo uma tendência de melhoria mais estável em múltiplas funções.

A equipe também realizou comparações com o mesmo número de avaliações de função, e a AutoPSO ainda alcançou desempenho superior. Isso indica que sua vantagem decorre de organizar o processo de busca de forma mais eficaz, e não de simplesmente consumir mais recursos computacionais.

![](./autopso-3.png)

*Figura 3: Resultados experimentais no benchmark de otimização numérica CEC2022.*

A equipe de pesquisa aplicou ainda a AutoPSO a tarefas de controle robótico baseadas em neuroevolução. Comparadas à otimização de funções numéricas, essas tarefas estão muito mais próximas de aplicações reais: envolvem parâmetros de política de alta dimensionalidade, ruído significativo no feedback, paisagens objetivo irregulares e informação de gradiente nem sempre disponível.

Em múltiplos ambientes de controle robótico do Brax, a AutoPSO obteve melhoria mais rápida da recompensa e melhor desempenho final. Isso sugere que a AutoPSO não é apenas um conjunto de heurísticas ajustadas a uma classe específica de funções, mas uma abordagem prática e transferível para a construção automática de algoritmos.

![](./autopso-4.png)

*Figura 4: Resultados experimentais nos problemas de controle robótico do Brax.*

O valor do EvoX fica mais evidente nos experimentos de escalabilidade. A estrutura de dois níveis da AutoPSO acarreta naturalmente um tamanho populacional maior: o nível externo abriga muitos algoritmos candidatos e cada algoritmo candidato do nível interno tem seu próprio enxame de partículas. Na execução serial tradicional, o tempo de computação necessário rapidamente se tornaria proibitivo.

Nas GPUs, porém, quando o tamanho total da população é aumentado em 100 vezes, o tempo de execução aumenta apenas cerca de 3 vezes. Em testes com 8192 dimensões, a AutoPSO mantém uma sobrecarga de tempo aceitável e alcança uma aceleração de uma ordem de grandeza em relação à execução em CPU.

![](./autopso-5.png)

*Figura 5: Impacto do escalonamento do tamanho da população no tempo de execução.*

## A AutoPSO não desperdiça poder de processamento nem conhecimento histórico

Em vez de substituir a pesquisa algorítmica por poder de processamento bruto, a AutoPSO transforma os resultados de pesquisa acumulados ao longo do tempo em ativos de projeto operacionais. Os mecanismos eficazes antes espalhados por diferentes variantes de PSO são abstraídos em componentes reutilizáveis, enquanto as decisões combinatórias que antes dependiam de experiência humana são delegadas à metaevolução para validação em tarefas específicas.

Três elementos são indispensáveis: o conhecimento histórico fornece o espaço de busca; a otimização automática cuida da busca combinatória; e o EvoX, junto com o paralelismo de GPU, fornece a capacidade de avaliação em larga escala. Sem conhecimento histórico, falta à busca candidatos promissores; sem otimização automática, o conhecimento dificilmente pode ser reorganizado para a tarefa em questão; sem computação paralela, a escala da busca não pode ser sustentada.

A AutoPSO liberta os pesquisadores do ajuste repetitivo de parâmetros e da tentativa e erro, direcionando seus esforços para um trabalho mais valioso: definir componentes, projetar espaços de busca e estabelecer pipelines de avaliação mais confiáveis.

## De modificar algoritmos a construir sistemas que geram algoritmos

O significado da AutoPSO vai além da obtenção de uma variante de PSO mais poderosa. Ela demonstra um novo paradigma para os algoritmos evolutivos na era da computação paralela:

- **No passado, estudávamos "como projetar um algoritmo melhor";**

- **agora, estudamos "como construir um sistema capaz de gerar, selecionar e melhorar algoritmos automaticamente".**

À medida que a avaliação massiva de candidatos em GPU se torna gradualmente a norma na pesquisa, as fronteiras da computação evolutiva certamente mudarão de acordo: o hardware de computação paralela não é mais apenas uma plataforma que hospeda a execução de algoritmos, mas começa a participar da reformulação da forma como os algoritmos são projetados.

AutoPSO × EvoX: capacitar a computação evolutiva na transição da era manual para a era automática.

## Código open source / Recursos da comunidade

**Paper:**

https://arxiv.org/abs/2608.07539

**GitHub:**

https://github.com/EMI-Group/autopso

**Projeto upstream (EvoX):**

https://github.com/EMI-Group/evox

**Grupo do QQ:**

297969717

![](./autopso-6.png)

*QR code do grupo da comunidade QQ do EvoX.*
