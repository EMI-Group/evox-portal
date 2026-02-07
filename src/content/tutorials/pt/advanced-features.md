---
title: "4. Funcionalidades Avançadas"
order: 4
---

# 4. Funcionalidades Avançadas

O EvoX oferece muitas **funcionalidades avançadas** para satisfazer necessidades mais complexas. Após familiarizar-se com o básico, este capítulo apresenta como personalizar a configuração da framework, gerir módulos de extensão opcionais e otimizar o desempenho — permitindo-lhe estender e ajustar o EvoX quando necessário.

## Configuração Personalizada

As definições padrão do EvoX são adequadas para a maioria das situações, mas por vezes poderá querer personalizar o comportamento ou os parâmetros da framework. Por exemplo:

- **Ajuste de Parâmetros de Algoritmos**: Para além do tamanho da população e do número de iterações básicos, muitos algoritmos expõem parâmetros avançados. Por exemplo, o CMA-ES permite a configuração da matriz de covariância inicial, e o NSGA-II expõe parâmetros de distância de aglomeração. Pode passar parâmetros ao construtor do algoritmo, por exemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza as probabilidades de cruzamento e mutação no Algoritmo Genético. O ajuste destes pode refinar o desempenho. Consulte a documentação do EvoX para a API de cada algoritmo, onde os parâmetros disponíveis e os valores padrão estão listados.

- **Substituição de Componentes de Operadores**: Pode substituir operadores evolutivos internos (por exemplo, estratégias de seleção ou mutação). Algumas classes de algoritmos suportam a passagem de objetos de operadores personalizados. Por exemplo, a Evolução Diferencial (DE) pode suportar operadores de mutação personalizados, permitindo-lhe fornecer uma função personalizada ou uma classe `Operator`. O design modular do EvoX suporta esta substituição ao estilo de "plugin". Isto normalmente requer compreensão dos detalhes internos do algoritmo e não é geralmente necessário para casos de utilização padrão.

- **Definições Multi-Objetivo**: Para otimização multi-objetivo, poderá precisar de configurar preferências ou pesos — por exemplo, definir vetores de peso para métodos de soma ponderada ou ajustar pontos de referência durante a evolução. Estas configurações são tipicamente expostas através de parâmetros na classe do problema ou do algoritmo. Por exemplo, `problem = DTLZ2(d=12, m=3)` define um problema de 12 dimensões e 3 objetivos. Alguns algoritmos permitem a passagem de vetores de referência personalizados. A leitura da documentação dos algoritmos ajuda-o a aproveitar totalmente estas definições.

- **Registo e Saída**: O `EvalMonitor` padrão já regista métricas chave de otimização. Se precisar de informação extra (por exemplo, diversidade da população ou aptidão média por geração), pode personalizar o monitor ou registar manualmente dentro do seu ciclo. Para tarefas de longa duração, poderá querer registar num ficheiro. Isto pode ser feito utilizando a biblioteca `logging` do Python ou simples I/O de ficheiros para anexar resultados para análise posterior.

Em resumo, a configuração personalizada significa modificar o comportamento padrão do EvoX para uma tarefa específica. Isto geralmente envolve uma utilização mais profunda da API do EvoX. Abordaremos mais na secção de **desenvolvimento e extensão**. Para principiantes, basta lembrar: o EvoX oferece interfaces flexíveis que permitem a utilizadores experientes ajustar praticamente todos os detalhes — mas também pode manter os valores padrão e obter resultados rapidamente.

## Gestão de Plugins

"Plugins" aqui referem-se a componentes opcionais ou módulos de extensão no EvoX — como ferramentas de visualização, wrappers de ambientes de aprendizagem por reforço e projetos irmãos no ecossistema EvoX. A gestão de plugins no EvoX envolve principalmente a **instalação e utilização de módulos opcionais**. Aqui estão algumas extensões chave e como geri-las:

- **Plugin de Visualização**: O EvoX inclui o módulo `evox.vis_tools`, que contém um submódulo `plot` para gráficos e suporta o formato de registo `.exv` para fluxos de dados em tempo real. Para utilizar a visualização, instale o EvoX com o extra `vis`: `pip install evox[vis]`. (Se não foi instalado inicialmente, pode instalar depois ou simplesmente executar `pip install plotly` para satisfazer as dependências.) Ao utilizar ferramentas visuais, normalmente chama funções de gráficos após o monitor registar dados — por exemplo, `EvalMonitor.plot()` utiliza `vis_tools.plot`. Garantir que este plugin está instalado evita erros de bibliotecas em falta como `matplotlib`.

- **Plugin de Neuroevolução**: O EvoX suporta ambientes de aprendizagem por reforço (como o motor de física Brax) e otimização de indivíduos neuronais (neuroevolução). Estas funcionalidades estão incluídas na extensão `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Isto inclui a biblioteca Google Brax, Gym e mais. Após a instalação, pode utilizar wrappers como `BraxProblem` em `evox.problems.neuroevolution` para transformar ambientes de RL em problemas de otimização. Ferramentas como `ParamsAndVector` também estão incluídas para aplanar parâmetros de modelos PyTorch em vetores para evolução. Note que o Brax funciona apenas em Linux ou Windows via WSL — o Python nativo do Windows pode funcionar apenas no CPU. Em resumo, ativar ou desativar plugins do EvoX é controlado pela instalação de extras específicos.

- **Projetos Irmãos**: O EvoX tem projetos relacionados como o EvoRL (focado em aprendizagem por reforço evolutiva) e o EvoGP (programação genética acelerada por GPU). Estes partilham a filosofia de design e interface do EvoX. Se a sua tarefa é intensiva em RL, poderá preferir estas frameworks dedicadas. Gerir estes plugins significa garantir compatibilidade de versões e satisfazer dependências. Por exemplo, o EvoRL utiliza JAX e Brax, enquanto o EvoGP pode requerer bibliotecas de árvores simbólicas. Estas bibliotecas podem geralmente coexistir sem conflitos. Pense nelas como ferramentas complementares que podem ser chamadas a partir do projeto principal EvoX — ou deixadas de fora para uma configuração mais leve.

- **Plugins Personalizados**: Graças à modularidade do EvoX, pode construir os seus próprios "plugins". Por exemplo, crie uma classe `Monitor` personalizada para acompanhar métricas únicas, ou uma subclasse `Problem` personalizada que envolve um simulador de terceiros. Estes efetivamente estendem as capacidades do EvoX. A melhor prática é seguir os contratos de interface do EvoX — por exemplo, garantir que o seu `Problem` personalizado tem um método `evaluate()`, ou que o seu `Monitor` personalizado herda de uma classe base. Uma vez testado, poderia até contribuí-lo para futuras versões do EvoX.

No geral, a gestão de plugins no EvoX trata-se de **extensão flexível e controlo de dependências**. Como principiante, durante a instalação, pode decidir se inclui as extensões `vis` e `neuroevolution`. Se não foram instaladas inicialmente, podem ser adicionadas depois. Com plugins, pode monitorizar o progresso da otimização mais facilmente e integrar o EvoX com ferramentas externas para maior poder.

## Otimização de Desempenho

O desempenho é um ponto forte do EvoX. Mesmo utilizando o mesmo algoritmo, o suporte GPU do EvoX pode aumentar a velocidade em várias ordens de magnitude. No entanto, para aproveitar totalmente isto, vai querer seguir algumas dicas:

- **Utilizar Paralelismo GPU**: Primeiro, certifique-se de que o seu código está realmente a executar na GPU. Como mencionado anteriormente, instale o PyTorch com CUDA ativado e mova os dados para dispositivos GPU. Se as coisas parecerem lentas, verifique com `torch.cuda.is_available()` — deve retornar `True`. Se a GPU existe mas não está a ser utilizada, é provável que os tensores tenham sido criados no CPU por defeito. Corrija isto definindo explicitamente o `device`, ou garantindo que os tensores de entrada (como `lb`/`ub`) estão em CUDA. O EvoX seguirá o dispositivo destes inputs. Em sistemas multi-GPU, o EvoX geralmente utiliza **uma GPU por processo**. Para aproveitar múltiplas GPUs, pode executar múltiplos processos com diferentes GPUs ou aguardar suporte futuro para execução multi-GPU coordenada.

- **Avaliação Paralela**: Um gargalo chave nos algoritmos evolutivos é a **avaliação de aptidão**. Como as avaliações são frequentemente independentes, podem ser paralelizadas. O EvoX agrupa avaliações quando possível — por exemplo, avaliações de redes neuronais ou funções polinomiais podem ser computadas em paralelo utilizando a GPU. Para problemas personalizados, evite ciclos Python — vectorize o seu código de avaliação para processar um lote inteiro de candidatos de uma vez. Isto aproveita ao máximo as capacidades paralelas do PyTorch. Simplificando: faça a função `evaluate()` do seu problema operar em lotes — não em soluções individuais — para uma aceleração massiva.

- **Compilar para Otimização**: O PyTorch 2.0 introduziu `torch.compile`, que compila JIT modelos/funções para ganhos de desempenho. Se a sua lógica de avaliação é complexa, considere compilar antes de executar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Isto pode melhorar significativamente o desempenho.
  > **Nota:**
> A compilação adiciona overhead e nem sempre é suportada por todas as funções ou problemas. Mais adequada para tarefas de grande escala e longa duração. No Windows, certifique-se de que o Triton está instalado para que `torch.compile` funcione.

- **Ajustar o Tamanho da População**: Uma população maior aumenta a diversidade e a capacidade de busca global — mas também aumenta a computação por geração. Equilibre qualidade e velocidade ajustando `pop_size`. Na GPU, pode frequentemente aumentá-lo sem um custo de tempo linear (graças ao paralelismo). Mas um tamanho demasiado grande pode causar problemas de memória. Se estiver a ficar sem memória GPU, reduza o tamanho da população ou a dimensão do problema, ou utilize FP16 para poupar espaço (defina via `torch.set_float32_matmul_precision('medium')`).

- **Reduzir Overhead do Python**: O EvoX move a maioria da computação principal para `torch.Tensor`, mas ciclos escritos pelo utilizador ou operadores personalizados devem evitar operações excessivas ao nível do Python. Evite impressões frequentes (alto custo de I/O), listas ou conversões de tipos de dados. Mantenha o seu código vectorizado/tensorizado para aproveitar os kernels rápidos C++/CUDA subjacentes e reduzir o overhead do interpretador Python.

- **Implementação Distribuída**: Para problemas ultra-grandes, considere executar em múltiplas máquinas. O EvoX suporta configurações multi-nó (via comunicação de backend e fragmentação). Embora não seja amigável para principiantes, é bom saber que existe. Com um cluster de GPUs, consulte a documentação do EvoX para implementação distribuída. Normalmente, precisará de definir variáveis de ambiente ou lançar com scripts especiais. A arquitetura permite que o mesmo código execute em configurações de nó único ou multi-nó. Para a sua primeira tentativa, simule com múltiplos processos numa única máquina.

- **Análise de Desempenho**: Para aprofundar, utilize ferramentas como o profiler do PyTorch ou o `cProfile` do Python para analisar gargalos. Isto ajuda-o a identificar se o tempo é gasto na avaliação, seleção ou noutra coisa — para que possa otimizar em conformidade (por exemplo, fazendo cache de computações repetidas). O EvoX é construído para desempenho, mas tarefas do mundo real podem ainda encontrar gargalos únicos que necessitam de análise.

Em resumo, embora o EvoX já esteja otimizado ao nível da arquitetura, os utilizadores podem melhorar ainda mais o desempenho **utilizando GPUs corretamente**, **computação em lote** e **ajuste de parâmetros**. Enquanto persegue velocidade, lembre-se também de manter a qualidade dos resultados — o equilíbrio é fundamental. À medida que se familiariza mais com o EvoX, o ajuste de desempenho tornar-se-á natural.
