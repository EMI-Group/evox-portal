---
title: "AutoPSO: Poder de computação GPU × Metaevolução → Otimização por enxame de partículas totalmente automática"
pubDate: 2026-08-25
summary: "A AutoPSO, proposta pela equipa EvoX e publicada na IEEE TEVC, codifica de forma uniforme a configuração de parâmetros, os mecanismos de aprendizagem e a estrutura do enxame do PSO num espaço evolutivo pesquisável, e através de metaevolução procura automaticamente a variante de PSO ótima para um determinado problema-alvo."
---

![](./autopso-hero.png)

O desenvolvimento da otimização por enxame de partículas (PSO) tem sido, em essência, uma história de contínuo "desenho manual". Ao longo das últimas décadas, os investigadores propuseram uma vasto conjunto de melhorias relativas a pesos de inércia, estratégias de aprendizagem, topologias de enxame, estruturas de subpopulações e outros componentes, formando gradualmente um amplo espaço de desenho algorítmico em torno do PSO. Contudo, quanto maior o espaço, mais difícil é a escolha. Perante uma tarefa de otimização concreta — quais parâmetros selecionar, quais mecanismos de aprendizagem adotar, como organizar o enxame de partículas — estas decisões de projeto fortemente acopladas continuam, até hoje, fortemente dependentes da perícia dos investigadores e de tentativa e erro. O PSO tornou-se cada vez mais rico, mas também cada vez mais difícil de "escolher corretamente". E se o próprio ato de "escolher um PSO" também fosse delegado à evolução algorítmica?

**A framework AutoPSO, proposta pela equipa EvoX, codifica de forma uniforme a configuração de parâmetros, os mecanismos de aprendizagem e a estrutura do enxame do PSO num espaço evolutivo pesquisável, e procura automaticamente, através de metaevolução, a variante de PSO ótima adaptada a um determinado problema-alvo. Esta framework não só otimiza a solução do problema, como também, num nível superior, otimiza automaticamente "qual o PSO a utilizar para o resolver".**

**A pesquisa de larga escala em metaevolução depende de avaliações massivamente paralelas, e o cálculo tensorizado, o processamento em lote e o paralelismo GPU da EvoX resolvem precisamente este gargalo — milhares de variantes candidatas podem evoluir em simultâneo, tornando exequível na prática a pesquisa ao nível meta que antes era inexequível em CPU.**

**Poder de computação GPU × metaevolução impulsiona o PSO do "desenho manual" para a "geração automática".**

## Ao PSO não faltam métodos; falta-lhe a capacidade de os combinar automaticamente

Ao longo das últimas décadas, a investigação em PSO acumulou um rico conjunto de opções mecanicistas: como os parâmetros mudam ao longo das iterações, de que indivíduos as partículas aprendem, se o enxame é dividido em subgrupos e que estratégias de atualização os diferentes subgrupos adotam.

O problema não é a escassez de mecanismos, mas o facto de a maioria deles existir como algoritmos autónomos específicos de um problema. Perante uma nova tarefa, os investigadores ainda têm de selecionar, combinar e verificar manualmente num vasto conjunto de mecanismos, e depois reajustá-los.

A filosofia da AutoPSO não é descartar este conhecimento acumulado, mas reorganizá-lo num espaço de componentes reutilizáveis. Decompõe os aspetos-chave do desenho do PSO em vários módulos:

- como os parâmetros evoluem;

- de que exemplos as partículas aprendem;

- como o enxame é particionado em subgrupos;

- que estratégias de atualização são empregues pelos diferentes subgrupos.

Nas abordagens tradicionais, estas escolhas são feitas sobretudo por humanos; na AutoPSO, tornam-se objetos pesquisáveis pelo algoritmo. Por outras palavras, a AutoPSO não consiste em "reinventar manualmente um PSO", mas em construir uma meta-framework que, antes de resolver o problema atual, lhe possa configurar automaticamente uma variante de PSO adequada.

![](./autopso-1.gif)

*Figura 1: A AutoPSO organiza os elementos-chave do desenho do PSO em módulos combináveis e pesquisáveis.*

## Delegar no próprio algoritmo a otimização de nível externo, tradicionalmente realizada pelos investigadores

A investigação convencional em otimização sempre possuiu uma estrutura de dois níveis. No nível interno, o PSO é utilizado para resolver o problema-alvo — seja otimização de funções, desenho de engenharia ou políticas de controlo. No nível externo existe uma otimização menos explícita: os investigadores estão a otimizar o próprio algoritmo.

Que regras de atualização escolher, como definir os parâmetros, que exemplos de aprendizagem adotar, se introduzir mecanismos de subgrupos, que mecanismos podem ser combinados e que combinações são instáveis — estas decisões foram tipicamente tomadas pelos investigadores com base na experiência e depois refinadas por tentativa e erro.

A mudança-chave trazida pela AutoPSO é delegar no algoritmo este processo de nível externo, antes realizado manualmente pelos investigadores. Uma partícula de nível externo já não representa uma solução candidata ao problema-alvo, mas sim um desenho candidato de PSO, codificando parâmetros, exemplos de aprendizagem, partição em subgrupos e estratégias de atualização. O PSO de nível interno, equipado com estas configurações, resolve o problema-alvo e devolve o seu desempenho como retroalimentação ao nível externo, que continua assim a procurar melhores configurações algorítmicas.

**A AutoPSO não só otimiza a solução do problema, como também otimiza "qual o PSO a utilizar para o resolver".**

Transforma o processo de desenho de algoritmos, que antes dependia da perícia dos investigadores, num processo evolutivo interno ao sistema que pode ser automaticamente pesquisado, avaliado e iterado.

![](./autopso-2.png)

*Figura 2: O nível externo procura configurações do algoritmo, enquanto o nível interno emprega a configuração escolhida para resolver o problema-alvo.*

## EvoX e GPU: tornar o desenho automático de algoritmos verdadeiramente exequível

Propor uma framework de pesquisa automática de estruturas algorítmicas não é particularmente difícil; o verdadeiro desafio está no custo computacional. Avaliar um desenho candidato de PSO exige executá-lo num processo completo de resolução do problema-alvo. Quantos mais desenhos candidatos houver, maior a carga computacional do nível interno.

Em ambientes seriais tradicionais baseados em CPU, tais custos são proibitivos. Contudo, este tipo de computação é intrinsecamente paralelizável: os algoritmos candidatos podem ser avaliados em simultâneo e, dentro de cada algoritmo candidato, as atualizações das partículas também podem ser processadas em lote. A AutoPSO tira partido da EvoX para mapear a estrutura populacional da computação evolutiva na capacidade de processamento em lote das GPUs, permitindo que a pesquisa de configurações do nível externo e a resolução do problema do nível interno avancem em simultâneo.

Aqui, a aceleração por GPU não se limita a encurtar o tempo de uma única execução; mais importante, aumenta substancialmente o número de desenhos candidatos que podem ser comparados num dado período. A metaevolução é essencialmente uma pesquisa no espaço dos algoritmos, e a qualidade dessa pesquisa depende diretamente de **quantos desenhos candidatos de PSO foram avaliados**. Quanto mais exaustiva a avaliação, maior a probabilidade de encontrar uma configuração bem adaptada ao problema atual.

O valor da EvoX reside precisamente em fornecer esta capacidade: organiza as atualizações das partículas e as avaliações de aptidão do nível interno, bem como a comparação de algoritmos candidatos do nível externo, em operações tensoriais em GPU, permitindo que milhares de desenhos candidatos avancem em sincronia a cada iteração. Por outras palavras, a EvoX transforma a metaevolução de um processo de "tentativa e erro lenta" numa "experimentação paralela de larga escala" — e é precisamente neste fundamento computacional que a AutoPSO se apoia.

## Não só mais rápida, mas também mais capaz de "usar a pesquisa"

O que a AutoPSO pretende demonstrar não é meramente que corre depressa em GPUs, mas antes que, uma vez automatizado o processo de desenho do PSO, o algoritmo consegue efetivamente descobrir uma estratégia de pesquisa mais adequada ao problema em causa.

No referencial de otimização numérica CEC2022, a equipa EvoX comparou a AutoPSO com o PSO original, CSO, CLPSO, FIPS e várias variantes de PSO de aprendizagem social. Com o mesmo orçamento de tempo de execução, muitas variantes de PSO de estrutura fixa exibiram um declínio inicial rápido dos valores objetivo, mas tenderam a estagnar precocemente. Em contraste, a AutoPSO conseguiu ajustar continuamente a configuração do seu PSO de nível interno durante a execução, mantendo uma tendência de melhoria mais estável em múltiplas funções.

A equipa também realizou comparações com o mesmo número de avaliações de função, e a AutoPSO continuou a alcançar um desempenho superior. Isto indica que a sua vantagem decorre de organizar o processo de pesquisa de forma mais eficaz, e não de consumir meramente mais recursos computacionais.

![](./autopso-3.png)

*Figura 3: Resultados experimentais no referencial de otimização numérica CEC2022.*

A equipa de investigação aplicou ainda a AutoPSO a tarefas de controlo robótico baseadas em neuroevolução. Comparadas com a otimização de funções numéricas, estas tarefas estão muito mais próximas das aplicações reais: envolvem parâmetros de política de elevada dimensão, ruído de retroalimentação significativo, paisagens objetivo irregulares e informação de gradiente nem sempre disponível.

Em múltiplos ambientes de controlo robótico Brax, a AutoPSO alcançou uma melhoria mais rápida da recompensa e um melhor desempenho final. Isto sugere que a AutoPSO não é meramente um conjunto de heurísticas ajustadas a uma classe específica de funções, mas uma abordagem prática e transferível para a construção automática de algoritmos.

![](./autopso-4.png)

*Figura 4: Resultados experimentais nos problemas de controlo robótico Brax.*

O valor da EvoX demonstra-se de forma mais direta nas experiências de escalabilidade. A estrutura de dois níveis da AutoPSO acarreta naturalmente uma dimensão populacional maior: o nível externo aloja muitos algoritmos candidatos e cada algoritmo candidato do nível interno tem o seu próprio enxame de partículas. Com a execução serial tradicional, o tempo de computação necessário tornar-se-ia rapidamente proibitivo.

Nas GPUs, contudo, quando a dimensão total da população é aumentada 100 vezes, o tempo de execução aumenta apenas cerca de 3 vezes. Em testes com 8192 dimensões, a AutoPSO mantém uma sobrecarga temporal aceitável e alcança uma aceleração de uma ordem de grandeza face à execução em CPU.

![](./autopso-5.png)

*Figura 5: Impacto do escalonamento da dimensão da população no tempo de execução.*

## A AutoPSO não desperdiça poder de computação nem conhecimento histórico

Em vez de substituir a investigação algorítmica por poder de computação bruto, a AutoPSO transforma os resultados de investigação longamente acumulados em ativos de desenho operacionais. Os mecanismos eficazes antes dispersos por diferentes variantes de PSO são abstraídos em componentes reutilizáveis, enquanto as decisões combinatórias que antes dependiam da perícia humana são delegadas na metaevolução para validação em tarefas específicas.

Três elementos são indispensáveis: o conhecimento histórico fornece o espaço de pesquisa; a otimização automática trata da pesquisa combinatória; e a EvoX, juntamente com o paralelismo GPU, fornece a capacidade de avaliação à escala. Sem conhecimento histórico, falta à pesquisa candidatos promissores; sem otimização automática, o conhecimento dificilmente pode ser reorganizado para a tarefa em causa; sem computação paralela, a escala da pesquisa não pode ser sustentada.

A AutoPSO liberta os investigadores da afinação repetitiva de parâmetros e da tentativa e erro, encaminhando os seus esforços para um trabalho mais valioso: definir componentes, desenhar espaços de pesquisa e estabelecer pipelines de avaliação mais fiáveis.

## De modificar algoritmos a construir sistemas que geram algoritmos

O significado da AutoPSO vai além da obtenção de uma variante de PSO mais poderosa. Demonstra um novo paradigma para os algoritmos evolutivos na era da computação paralela:

- **No passado, estudámos "como desenhar um algoritmo melhor";**

- **hoje, estudamos "como construir um sistema capaz de gerar, selecionar e melhorar algoritmos automaticamente".**

À medida que a avaliação massiva de candidatos em GPU se torna gradualmente a norma na investigação, as fronteiras da computação evolutiva estão destinadas a mudar em conformidade: o hardware de computação paralela já não é meramente uma plataforma que aloja a execução de algoritmos, começando também a participar na reformulação da forma como os algoritmos são desenhados.

AutoPSO × EvoX: capacitar a computação evolutiva na transição da era manual para a era automática.

## Código open source / Recursos da comunidade

**Artigo:**

https://arxiv.org/abs/2608.07539

**GitHub:**

https://github.com/EMI-Group/autopso

**Projeto upstream (EvoX):**

https://github.com/EMI-Group/evox

**Grupo QQ:**

297969717

![](./autopso-6.png)

*Código QR do grupo da comunidade QQ da EvoX.*
