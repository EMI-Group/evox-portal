---
title: "EvoRL: pesquisa evolutiva e aprendizagem por reforço em conjunto nas GPU"
pubDate: 2025-01-14
updatedDate: 2026-11-08
summary: "O EvoRL liga pesquisa por populações, aprendizagem por reforço e simulação paralela, oferecendo uma base experimental para abordagens evolutivas a Physical AI."
---

Physical AI precisa de explorar comportamentos diferentes, testá-los por interação e reutilizar a experiência útil. O EvoRL coloca esse ciclo na simulação paralela: as políticas individuais aprendem, enquanto a pesquisa por populações explora alternativas e configurações de aprendizagem. A relação entre aprendizagem e evolução torna-se assim acessível à experimentação.

![Modelos de pernas mecânicas exploram percursos num ciclo de simulação partilhado](./population-learning-loop.webp)

O EvoRL é um framework de investigação de código aberto construído em torno destas questões. Baseado em JAX, reúne aprendizagem por reforço, computação evolutiva e simulação num fluxo de treino comum para desenvolver e avaliar métodos clássicos e híbridos. Como projeto irmão do EvoX, concentra-se na sua combinação para que a pesquisa ao nível da população aproveite as GPU modernas. [Apresentação do projeto](https://github.com/EMI-Group/evorl)

## Porquê combinar evolução e aprendizagem por reforço?

Considere um robô que aprende a andar. Várias políticas podem resolver a mesma tarefa, com diferentes formas de locomoção, compromissos entre velocidade e estabilidade e necessidades energéticas. Melhorar uma política segundo uma única trajetória de aprendizagem pode deixar muitas possibilidades por explorar.

A aprendizagem por reforço utiliza dados de interação para aperfeiçoar as políticas. A computação evolutiva mantém um conjunto de candidatos, avalia-os, seleciona-os e introduz variação para preservar várias direções de pesquisa. A combinação permite estudar um processo mais rico: os indivíduos melhoram com a experiência e a população transmite resultados úteis entre eles.

A pesquisa evolutiva pode atuar diretamente nos parâmetros das políticas ou ajustar os hiperparâmetros da aprendizagem. São questões diferentes: que políticas procurar e como ajudá-las a aprender melhor?

Esta complementaridade não significa que os métodos híbridos superem a aprendizagem por reforço isolada em todas as tarefas. Oferece mais opções de conceção para testar; o EvoRL procura reduzir o esforço de desenvolvimento e de computação necessário para as explorar.

## Conceção central: um fluxo de treino preparado para GPU

A diversidade torna os métodos populacionais atrativos, mas também exige computação. Cada política adicional pode implicar mais interações, avaliações e atualizações. Se estas etapas forem repartidas entre CPU e GPU, as transferências repetidas e o escalonamento podem tornar-se pontos de estrangulamento.

Com ambientes de simulação GPU compatíveis, o EvoRL organiza interações, cálculo das políticas, operações evolutivas e atualizações num fluxo GPU de ponta a ponta. A vetorização e a compilação just-in-time do JAX agrupam cálculos repetidos e otimizam o grafo computacional do passo de treino. [Visão técnica](https://evorl.readthedocs.io/latest/)

O paralelismo funciona em três níveis:

- **Ambientes paralelos**: uma política interage com várias instâncias para recolher experiência em lotes.
- **Indivíduos paralelos**: várias políticas candidatas da população são avaliadas simultaneamente.
- **Treino paralelo**: vários agentes aprendem em simultâneo, apoiando métodos híbridos e treino de populações.

Torna-se assim mais simples experimentar com mais políticas ao mesmo tempo. A dimensão da população deve continuar a respeitar a memória GPU, o custo do ambiente e a dimensão da rede. [Artigo sobre a arquitetura](https://arxiv.org/abs/2501.15129)

## Comparar quatro famílias de métodos no mesmo framework

O EvoRL oferece uma base experimental comum para estabelecer referências e acrescentar depois mecanismos de pesquisa ou aprendizagem.

| Família de métodos | Algoritmos representativos | Questão principal |
| --- | --- | --- |
| Aprendizagem por reforço | PPO, TD3, SAC e outros | Como melhorar uma política com dados de interação? |
| Algoritmos evolutivos | OpenES, ARS, CMA-ES e outros | Como orientar a pesquisa através da avaliação dos candidatos? |
| Aprendizagem por reforço guiada pela evolução | ERL, CEM-RL e variantes | Como fazer cooperar pesquisa evolutiva e aprendizagem por gradiente? |
| AutoRL baseado em populações | PBT-PPO, PBT-SAC e outros | Como adaptar as configurações durante o treino? |

Duas orientações híbridas merecem especial atenção.

**A aprendizagem por reforço guiada pela evolução** liga a pesquisa populacional à aprendizagem individual. Uma população pode explorar diferentes regiões do espaço de parâmetros, enquanto as atualizações por reforço melhoram os candidatos. Os algoritmos diferem na partilha de experiência, nas atualizações individuais e na seleção. O EvoRL fornece implementações para estudar estas escolhas.

**O AutoRL baseado em populações** explora as configurações de treino. No PBT, por exemplo, vários indivíduos treinam separadamente. Com base em avaliações periódicas, herdam estados de treino de indivíduos com melhores resultados e perturbam os hiperparâmetros para continuar a explorar. Os hiperparâmetros podem, assim, mudar ao longo do processo.

Os algoritmos e variantes disponíveis dependem da implementação atual do repositório. [Lista de algoritmos](https://github.com/EMI-Group/evorl#algorithms)

## Modularidade: transformar ideias de investigação em experiências

Desenvolver algoritmos híbridos exige frequentemente trabalho de adaptação de ambientes, organização de dados, avaliação e articulação de interfaces. O EvoRL estrutura estas responsabilidades com algumas abstrações centrais:

- **Env** fornece uma interface comum de interação com os ambientes.
- **Agent** define o comportamento do agente e a respetiva lógica de aprendizagem.
- **SampleBatch** organiza trajetórias e amostras.
- **Workflow** define os passos de treino do algoritmo.
- **EC** fornece algoritmos evolutivos e operadores associados.

Estes módulos permitem alterar partes específicas da experiência: substituir a pesquisa mantendo o ambiente e a rede da política, ou comparar a aprendizagem antes e depois de acrescentar operações evolutivas. [Documentação do framework e da API](https://evorl.readthedocs.io/latest/)

Uma implementação comum também facilita o controlo de variáveis. Alinhar tarefas, procedimentos de avaliação e orçamentos ajuda a distinguir melhorias algorítmicas de diferenças de implementação. O framework facilita estas comparações, mas o rigor do desenho experimental continua a ser responsabilidade dos investigadores.

## O que significam os ganhos de desempenho?

O artigo do EvoRL compara a eficiência computacional no ambiente Swimmer do Brax, num computador com dois CPU Intel Xeon Gold 6132, 128 GiB de RAM e uma GPU RTX 3090. Nas configurações testadas, o OpenES atinge uma aceleração máxima superior a 60× face à implementação distribuída em CPU do RLlib; o CEM-RL obtém aproximadamente 5–9× face à sua implementação oficial.

Estes números referem-se a tarefas, dimensões de população e referências específicas. Não implicam os mesmos ganhos em todas as tarefas nem uma redução equivalente das amostras necessárias para atingir uma recompensa-alvo. [Configuração experimental e resultados](https://arxiv.org/html/2501.15129v1#S5)

Ao planear experiências, uma maior capacidade de processamento permite considerar mais sementes aleatórias, estudos de ablação mais completos ou populações maiores. O benefício prático é testar mais ideias com o orçamento disponível.

## Do controlo robótico a novas tarefas de decisão

O EvoRL suporta Brax e MuJoCo Playground para controlo contínuo, pesquisa de políticas e treino de populações. As integrações experimentais com gymnax, Jumanji e JaxMARL abrangem controlo clássico, jogos, otimização combinatória e cenários multiagente; a compatibilidade dos algoritmos deve ser verificada em cada configuração. Alguns ambientes CPU também são suportados, pelo que um fluxo inteiramente em GPU depende da combinação escolhida. [Ambientes suportados](https://github.com/EMI-Group/evorl#rl-environments)

Na investigação em aprendizagem por reforço evolutiva, é possível estabelecer uma referência com algoritmos existentes e alterar depois a cooperação entre pesquisa populacional e aprendizagem das políticas. Para AutoRL, o PBT permite começar a estudar o efeito das configurações. Quem desenvolve novos métodos de otimização pode integrar gradualmente os seus componentes através das interfaces comuns.

## Executar a primeira experiência

A instalação atual requer Python 3.12 ou posterior e JAX/jaxlib 0.10.0 ou posterior. [EvoRL](https://github.com/EMI-Group/evorl#installation)

Siga primeiro o [guia de instalação](https://evorl.readthedocs.io/latest/guide/installation.html) para configurar o JAX de acordo com o hardware. Instale depois o EvoRL a partir do código-fonte para obter os scripts e as configurações do exemplo:

```bash
git clone https://github.com/EMI-Group/evorl.git
cd evorl
pip install -e .
```

Comece com uma referência PPO no ambiente Ant do Brax:

```bash
python scripts/train.py agent=ppo env=brax/ant
```

O EvoRL utiliza o Hydra para gerir configurações. Depois de a referência funcionar, pode variar sementes aleatórias, configurações dos algoritmos e definições do ambiente antes de passar aos métodos híbridos ou às populações. Consulte o [guia de início rápido](https://evorl.readthedocs.io/latest/guide/quickstart.html).

Guarde a primeira execução PPO como referência: registe ambiente, semente, configuração e curva antes de alterar um componente. Para começar por uma pesquisa populacional mais simples, consulte o [tutorial EvoX](/pt/news/evox-quickstart).
