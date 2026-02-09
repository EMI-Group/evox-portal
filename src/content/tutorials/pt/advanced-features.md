---
title: "4. Funcionalidades Avançadas"
order: 4
---

# 4. Funcionalidades Avançadas

O EvoX oferece muitas **funcionalidades avançadas** para satisfazer necessidades mais complexas. Após se familiarizar com o básico, este capítulo apresenta como personalizar a configuração da framework, gerir módulos de plugins opcionais e otimizar o desempenho — permitindo-lhe estender e ajustar o EvoX quando necessário.

## Configuração Personalizada

As definições predefinidas do EvoX adequam-se à maioria das situações, mas por vezes poderá querer personalizar o comportamento ou os parâmetros da framework. Por exemplo:

- **Ajuste de Parâmetros do Algoritmo**: Para além do tamanho básico da população e do número de iterações, muitos algoritmos expõem parâmetros avançados. Por exemplo, o CMA-ES permite a configuração da matriz de covariância inicial, e o NSGA-II expõe parâmetros de distância de aglomeração (`crowding distance`). Pode passar parâmetros para o construtor do algoritmo, por exemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza as probabilidades de cruzamento e mutação no Genetic Algorithm. Ajustar estes parâmetros pode refinar o desempenho. Consulte a documentação do EvoX para a API de cada algoritmo, onde os parâmetros disponíveis e os valores predefinidos estão listados.

- **Substituição de Componentes de Operadores**: Pode substituir operadores evolutivos internos (por exemplo, estratégias de seleção ou mutação). Algumas classes de algoritmos suportam a passagem de objetos de operadores personalizados. Por exemplo, a Differential Evolution (DE) pode suportar operadores de mutação personalizados, permitindo-lhe fornecer uma função personalizada ou uma classe `Operator`. O design modular do EvoX suporta esta substituição estilo "plugin". Isto requer tipicamente a compreensão do funcionamento interno do algoritmo e não é habitualmente necessário para casos de utilização padrão.

- **Definições Multi-Objetivo**: Para otimização multi-objetivo, poderá necessitar de configurar preferências ou pesos — por exemplo, definir vetores de peso para métodos de soma ponderada ou ajustar pontos de referência durante a evolução. Estas configurações são tipicamente expostas através de parâmetros na classe do problema ou do algoritmo. Por exemplo, `problem = DTLZ2(d=12, m=3)` define um problema de 12 dimensões e 3 objetivos. Alguns algoritmos permitem a passagem de vetores de referência personalizados. Ler a documentação do algoritmo ajuda a tirar o máximo partido destas definições.

- **Registo (Logging) e Saída**: O `EvalMonitor` predefinido já regista métricas de otimização fundamentais. Se precisar de informações extra (por exemplo, diversidade da população ou fitness médio por geração), pode personalizar o monitor ou registar manualmente dentro do seu loop. Para tarefas de longa duração, poderá querer registar num ficheiro. Isto pode ser feito utilizando a biblioteca `logging` do Python ou I/O de ficheiros simples para anexar resultados para análise posterior.

Em resumo, a configuração personalizada significa modificar o comportamento predefinido do EvoX para uma tarefa específica. Isto envolve geralmente uma utilização mais profunda da API do EvoX. Abordaremos mais detalhes na secção de **desenvolvimento e extensão**. Para principiantes, lembre-se apenas: o EvoX oferece interfaces flexíveis que permitem aos utilizadores experientes ajustar quase todos os detalhes — mas também pode manter as predefinições e obter resultados rapidamente.

## Gestão de Plugins

"Plugins" aqui refere-se a componentes opcionais ou módulos de extensão no EvoX — tais como ferramentas de visualização, wrappers de ambientes de reinforcement learning e projetos irmãos no ecossistema EvoX. Gerir plugins no EvoX envolve principalmente **instalar e utilizar módulos opcionais**. Aqui estão algumas extensões principais e como geri-las:

- **Plugin de Visualização**: O EvoX inclui o módulo `evox.vis_tools`, que contém um submódulo `plot` para gráficos e suporta o formato de registo `.exv` para fluxos de dados em tempo real. Para utilizar a visualização, instale o EvoX com o extra `vis`: `pip install evox[vis]`. (Se não foi instalado inicialmente, pode instalar mais tarde ou simplesmente executar `pip install plotly` para satisfazer as dependências.) Ao utilizar ferramentas visuais, normalmente chama as funções de plotagem após o monitor registar os dados — por exemplo, `EvalMonitor.plot()` utiliza `vis_tools.plot`. Garantir que este plugin está instalado evita erros de bibliotecas em falta como a `matplotlib`.

- **Plugin de Neuroevolution**: O EvoX suporta ambientes de reinforcement learning (como o motor de física Brax) e otimização de indivíduos neuronais (neuroevolution). Estas funcionalidades estão agrupadas na extensão `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Isto inclui a biblioteca Google Brax, Gym e mais. Após a instalação, pode utilizar wrappers como `BraxProblem` em `evox.problems.neuroevolution` para transformar ambientes de RL em problemas de otimização. Ferramentas como `ParamsAndVector` também estão incluídas para achatar parâmetros de modelos PyTorch em vetores para a evolução. Note que o Brax apenas funciona em Linux ou Windows via WSL — o Python nativo de Windows poderá apenas correr em CPU. Em suma, ativar ou desativar plugins do EvoX é controlado através da instalação de extras específicos.

- **Projetos Irmãos**: O EvoX tem projetos relacionados, como o EvoRL (focado em evolutionary reinforcement learning) e o EvoGP (GPU-accelerated genetic programming). Estes partilham a filosofia de design e a interface do EvoX. Se a sua tarefa for focada em RL, poderá preferir estas frameworks dedicadas. Gerir estes plugins significa garantir a compatibilidade de versões e satisfazer as dependências. Por exemplo, o EvoRL utiliza JAX e Brax, enquanto o EvoGP pode exigir bibliotecas de árvores simbólicas. Estas bibliotecas podem geralmente coexistir sem conflitos. Pense nelas como ferramentas complementares que podem ser chamadas a partir do projeto principal EvoX — ou deixadas de fora para uma configuração mais leve.

- **Plugins Personalizados**: Graças à modularidade do EvoX, pode construir os seus próprios “plugins”. Por exemplo, crie uma classe `Monitor` personalizada para acompanhar métricas únicas, ou uma subclasse `Problem` personalizada que envolva um simulador de terceiros. Estas estendem eficazmente as capacidades do EvoX. A melhor prática é seguir os contratos de interface do EvoX — por exemplo, garantir que o seu `Problem` personalizado tem um método `evaluate()`, ou que o seu `Monitor` personalizado herda de uma classe base. Uma vez testado, poderá até contribuir com ele para futuras versões do EvoX.

No geral, a gestão de plugins no EvoX trata-se de **extensão flexível e controlo de dependências**. Como principiante, durante a instalação, pode decidir se deseja incluir as extensões `vis` e `neuroevolution`. Se não forem instaladas inicialmente, podem ser adicionadas mais tarde. Com os plugins, pode monitorizar o progresso da otimização mais facilmente e integrar o EvoX com ferramentas externas para maior poder.

## Otimização de Desempenho

O desempenho é um dos pontos fortes do EvoX. Mesmo utilizando o mesmo algoritmo, o suporte para GPU do EvoX pode aumentar a velocidade em várias ordens de magnitude. No entanto, para tirar o máximo partido disto, deve seguir algumas dicas:

- **Utilizar Paralelismo de GPU**: Primeiro, certifique-se de que o seu código está realmente a correr na GPU. Como mencionado anteriormente, instale o PyTorch com suporte para CUDA e mova os dados para dispositivos GPU. Se as coisas parecerem lentas, verifique com `torch.cuda.is_available()` — deve retornar `True`. Se a GPU existir mas não estiver a ser utilizada, é provável que os tensores tenham sido criados no CPU por predefinição. Corrija isto definindo explicitamente o `device`, ou garantindo que os tensores de entrada (como `lb`/`ub`) estão em CUDA. O EvoX seguirá o dispositivo destas entradas. Em sistemas multi-GPU, o EvoX utiliza geralmente **uma GPU por processo**. Para tirar partido de múltiplas GPUs, pode correr múltiplos processos com diferentes GPUs ou aguardar por suporte futuro para execução multi-GPU coordenada.

- **Avaliação Paralela**: Um estrangulamento (bottleneck) fundamental nos algoritmos evolutivos é a **avaliação de fitness**. Uma vez que as avaliações são frequentemente independentes, podem ser paralelizadas. O EvoX processa avaliações em lote (batch) quando possível — por exemplo, avaliações de redes neuronais ou funções polinomiais podem ser computadas em paralelo utilizando a GPU. Para problemas personalizados, evite loops Python — vetorize o seu código de avaliação para processar um lote inteiro de candidatos de uma só vez. Isto tira o máximo partido das capacidades paralelas do PyTorch. Simplificando: faça com que a função `evaluate()` do seu problema opere em lotes — e não em soluções individuais — para um aumento massivo de velocidade.

- **Compilar para Otimização**: O PyTorch 2.0 introduziu o `torch.compile`, que compila JIT modelos/funções para ganhos de desempenho. Se a sua lógica de avaliação for complexa, considere compilar antes de executar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Isto poderá melhorar significativamente o desempenho.
  > **Nota:**
> A compilação adiciona sobrecarga (overhead) e nem sempre é suportada por todas as funções ou problemas. É mais adequada para tarefas de grande escala e longa duração. No Windows, certifique-se de que o Triton está instalado para que o `torch.compile` funcione.

- **Ajustar o Tamanho da População**: Uma população maior aumenta a diversidade e a capacidade de pesquisa global — mas também aumenta a computação por geração. Equilibre a qualidade e a velocidade ajustando o `pop_size`. Na GPU, pode frequentemente aumentá-lo sem um custo de tempo linear (graças ao paralelismo). Mas um tamanho demasiado grande pode causar problemas de memória. Se ficar sem memória na GPU, reduza o tamanho da população ou a dimensão do problema, ou utilize FP16 para poupar espaço (definido via `torch.set_float32_matmul_precision('medium')`).

- **Reduzir a Sobrecarga de Python**: O EvoX move a maior parte da computação principal para `torch.Tensor`, mas os loops escritos pelo utilizador ou operadores personalizados devem evitar operações excessivas ao nível do Python. Evite prints frequentes (alto custo de I/O), listas ou conversões de tipos de dados. Mantenha o seu código vetorizado/tensorizado para tirar partido dos kernels rápidos de C++/CUDA e reduzir a sobrecarga do interpretador Python.

- **Implementação Distribuída**: Para problemas ultra-grandes, considere a execução em múltiplas máquinas. O EvoX suporta configurações multi-nó (através de comunicação de backend e sharding). Embora não seja amigável para principiantes, é bom saber que isto existe. Com um cluster de GPUs, consulte a documentação do EvoX para implementação distribuída. Normalmente, precisará de definir variáveis de ambiente ou lançar com scripts especiais. A arquitetura permite que o mesmo código corra em configurações de nó único ou multi-nó. Para a sua primeira tentativa, simule-o com múltiplos processos numa única máquina.

- **Análise de Desempenho (Profiling)**: Para aprofundar, utilize ferramentas como o profiler do PyTorch ou o `cProfile` do Python para analisar estrangulamentos. Isto ajuda-o a identificar se o tempo é gasto na avaliação, seleção ou noutra coisa — para que possa otimizar em conformidade (por exemplo, através da colocação em cache de computações repetidas). O EvoX foi construído para o desempenho, mas as tarefas do mundo real podem ainda encontrar estrangulamentos únicos que necessitam de análise.

Em suma, embora o EvoX já esteja otimizado ao nível da arquitetura, os utilizadores podem aumentar ainda mais o desempenho ao **utilizar GPUs corretamente**, **computar em lote** e **ajustar parâmetros**. Enquanto procura velocidade, lembre-se também de manter a qualidade dos resultados — o equilíbrio é a chave. À medida que se familiariza com o EvoX, a otimização do desempenho tornar-se-á algo natural.