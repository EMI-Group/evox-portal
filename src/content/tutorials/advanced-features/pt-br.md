---
title: "4. Recursos Avançados"
order: 4
---

# 4. Recursos Avançados

O EvoX oferece muitos **recursos avançados** para atender a necessidades mais complexas. Após se familiarizar com o básico, este capítulo apresenta como personalizar a configuração do framework, gerenciar módulos de plugins opcionais e otimizar o desempenho — permitindo que você estenda e ajuste o EvoX quando necessário.

## Configuração Personalizada

As configurações padrão do EvoX atendem à maioria das situações, mas às vezes você pode querer personalizar o comportamento ou os parâmetros do framework. Por exemplo:

- **Ajuste de Parâmetros de Algoritmo**: Além do tamanho básico da população e do número de iterações, muitos algoritmos expõem parâmetros avançados. Por exemplo, o CMA-ES permite a configuração da matriz de covariância inicial, e o NSGA-II expõe parâmetros de distância de aglomeração (`crowding distance`). Você pode passar parâmetros para o construtor do algoritmo, por exemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza as probabilidades de cruzamento e mutação no Algoritmo Genético. Ajustar esses parâmetros pode refinar o desempenho. Consulte a documentação do EvoX para a API de cada algoritmo, onde os parâmetros disponíveis e os padrões estão listados.

- **Substituição de Componentes de Operadores**: Você pode substituir operadores evolutivos internos (por exemplo, estratégias de seleção ou mutação). Algumas classes de algoritmos suportam a passagem de objetos de operadores personalizados. Por exemplo, a Evolução Diferencial (DE) pode suportar operadores de mutação personalizados, permitindo que você forneça uma função personalizada ou uma classe `Operator`. O design modular do EvoX suporta essa substituição no estilo "plugin". Isso normalmente requer a compreensão das partes internas do algoritmo e geralmente não é necessário para casos de uso padrão.

- **Configurações Multiobjetivo**: Para otimização multiobjetivo, você pode precisar configurar preferências ou pesos — por exemplo, definindo vetores de peso para métodos de soma ponderada ou ajustando pontos de referência durante a evolução. Essas configurações são normalmente expostas via parâmetros na classe do problema ou do algoritmo. Por exemplo, `problem = DTLZ2(d=12, m=3)` define um problema de 12 dimensões e 3 objetivos. Alguns algoritmos permitem a passagem de vetores de referência personalizados. Ler a documentação do algoritmo ajuda você a aproveitar totalmente essas configurações.

- **Logging e Saída**: O `EvalMonitor` padrão já registra as principais métricas de otimização. Se precisar de informações extras (por exemplo, diversidade da população ou fitness médio por geração), você pode personalizar o monitor ou registrar manualmente dentro do seu loop. Para tarefas de longa duração, você pode querer registrar em um arquivo. Isso pode ser feito usando a biblioteca `logging` do Python ou E/S de arquivo simples para anexar resultados para análise posterior.

Em resumo, a configuração personalizada significa modificar o comportamento padrão do EvoX para uma tarefa específica. Isso geralmente envolve um uso mais profundo da API do EvoX. Abordaremos mais na seção de **desenvolvimento e extensão**. Para iniciantes, lembre-se apenas: o EvoX oferece interfaces flexíveis que permitem aos usuários experientes ajustar quase todos os detalhes — mas você também pode manter os padrões e obter resultados rapidamente.

## Gerenciamento de Plugins

"Plugins" aqui referem-se a componentes opcionais ou módulos de extensão no EvoX — como ferramentas de visualização, wrappers de ambiente de aprendizado por reforço e projetos irmãos no ecossistema EvoX. O gerenciamento de plugins no EvoX envolve principalmente a **instalação e o uso de módulos opcionais**. Aqui estão algumas extensões principais e como gerenciá-las:

- **Plugin de Visualização**: O EvoX inclui o módulo `evox.vis_tools`, que contém um submódulo `plot` para gráficos e suporta o formato de log `.exv` para fluxos de dados em tempo real. Para usar a visualização, instale o EvoX com o extra `vis`: `pip install evox[vis]`. (Se não for instalado inicialmente, você pode instalar depois ou apenas executar `pip install plotly` para satisfazer as dependências.) Ao usar ferramentas visuais, você normalmente chama funções de plotagem após o monitor registrar os dados — por exemplo, `EvalMonitor.plot()` usa `vis_tools.plot`. Garantir que este plugin esteja instalado evita erros de bibliotecas ausentes como `matplotlib`.

- **Plugin de Neuroevolução**: O EvoX suporta ambientes de aprendizado por reforço (como o motor de física Brax) e otimização de indivíduos neurais (neuroevolução). Esses recursos estão incluídos na extensão `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Isso inclui a biblioteca Google Brax, Gym e muito mais. Após a instalação, você pode usar wrappers como `BraxProblem` em `evox.problems.neuroevolution` para transformar ambientes de RL em problemas de otimização. Ferramentas como `ParamsAndVector` são também incluídas para achatar parâmetros de modelos PyTorch em vetores para evolução. Observe que o Brax só funciona no Linux ou Windows via WSL — o Python nativo do Windows pode rodar apenas na CPU. Em resumo, ativar ou desativar plugins do EvoX é controlado via instalação de extras específicos.

- **Projetos Irmãos**: O EvoX possui projetos relacionados, como o EvoRL (focado em aprendizado por reforço evolutivo) e o EvoGP (programação genética acelerada por GPU). Eles compartilham a filosofia de design e a interface do EvoX. Se sua tarefa for pesada em RL, você pode preferir esses frameworks dedicados. Gerenciar esses plugins significa garantir a compatibilidade de versões e satisfazer as dependências. Por exemplo, o EvoRL usa JAX e Brax, enquanto o EvoGP pode exigir bibliotecas de árvores simbólicas. Essas bibliotecas geralmente podem coexistir sem conflitos. Pense nelas como ferramentas complementares que podem ser chamadas a partir do projeto principal do EvoX — ou deixadas de fora inteiramente para uma configuração enxuta.

- **Plugins Personalizados**: Graças à modularidade do EvoX, você pode construir seus próprios “plugins”. Por exemplo, crie uma classe `Monitor` personalizada para rastrear métricas exclusivas, ou uma subclasse `Problem` personalizada que envolva um simulador de terceiros. Isso estende efetivamente as capacidades do EvoX. A melhor prática é seguir os contratos de interface do EvoX — por exemplo, garantir que seu `Problem` personalizado tenha um método `evaluate()`, ou que seu `Monitor` personalizado herde de uma classe base. Uma vez testado, você poderia até mesmo contribuir com ele para versões futuras do EvoX.

No geral, o gerenciamento de plugins no EvoX trata de **extensão flexível e controle de dependências**. Como iniciante, durante a instalação, você pode decidir se deseja incluir as extensões `vis` e `neuroevolution`. Se não forem instaladas inicialmente, elas podem ser adicionadas posteriormente. Com plugins, você pode monitorar o progresso da otimização mais facilmente e integrar o EvoX com ferramentas externas para maior poder.

## Otimização de Desempenho

O desempenho é um dos principais pontos fortes do EvoX. Mesmo usando o mesmo algoritmo, o suporte a GPU do EvoX pode aumentar a velocidade em várias ordens de magnitude. No entanto, para aproveitar isso totalmente, você deve seguir algumas dicas:

- **Use Paralelismo de GPU**: Primeiro, certifique-se de que seu código está realmente rodando na GPU. Como observado anteriormente, instale o PyTorch habilitado para CUDA e mova os dados para dispositivos GPU. Se as coisas parecerem lentas, verifique com `torch.cuda.is_available()` — deve retornar `True`. Se a GPU existir mas não estiver sendo usada, é provável que os tensores tenham sido criados na CPU por padrão. Corrija isso definindo explicitamente o `device`, ou garantindo que os tensores de entrada (como `lb`/`ub`) estejam no CUDA. O EvoX seguirá o dispositivo dessas entradas. Em sistemas multi-GPU, o EvoX geralmente usa **uma GPU por processo**. Para aproveitar várias GPUs, você pode executar vários processos com GPUs diferentes ou aguardar o suporte futuro para execução coordenada multi-GPU.

- **Avaliação Paralela**: Um gargalo fundamental nos algoritmos evolutivos é a **avaliação de fitness**. Como as avaliações são frequentemente independentes, elas podem ser paralelizadas. O EvoX processa avaliações em lote quando possível — por exemplo, avaliações de redes neurais ou funções polinomiais podem ser computadas em paralelo usando a GPU. Para problemas personalizados, evite loops Python — vetorize seu código de avaliação para processar um lote inteiro de candidatos de uma só vez. Isso aproveita ao máximo as capacidades paralelas do PyTorch. Simplificando: faça a função `evaluate()` do seu problema operar em lotes — não em soluções individuais — para um aumento massivo de velocidade.

- **Compilar para Otimização**: O PyTorch 2.0 introduziu o `torch.compile`, que compila modelos/funções JIT para ganhos de desempenho. Se a sua lógica de avaliação for complexa, considere compilar antes de executar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Isso pode melhorar significativamente o desempenho.
  > **Nota:**
> A compilação adiciona overhead e nem sempre é suportada por todas as funções ou problemas. Mais adequada para tarefas de larga escala e longa duração. No Windows, certifique-se de que o Triton esteja instalado para que o `torch.compile` funcione.

- **Ajustar o Tamanho da População**: Uma população maior aumenta a diversidade e a capacidade de busca global — mas também aumenta a computação por geração. Equilibre qualidade e velocidade ajustando o `pop_size`. Na GPU, muitas vezes você pode aumentá-lo sem um custo de tempo linear (graças ao paralelismo). Mas um tamanho muito grande pode causar problemas de memória. Se você estiver ficando sem memória de GPU, reduza o tamanho da população ou a dimensão do problema, ou use FP16 para economizar espaço (definido via `torch.set_float32_matmul_precision('medium')`).

- **Reduzir o Overhead do Python**: O EvoX move a maior parte da computação principal para `torch.Tensor`, mas loops escritos pelo usuário ou operadores personalizados devem evitar operações excessivas em nível de Python. Evite prints frequentes (alto custo de E/S), listas ou conversões de tipos de dados. Mantenha seu código vetorizado/tensorizado para aproveitar kernels rápidos de C++/CUDA por baixo do capô e reduzir o overhead do interpretador Python.

- **Implantação Distribuída**: Para problemas ultra-grandes, considere a execução em várias máquinas. O EvoX suporta configurações multi-nó (via comunicação de backend e sharding). Embora não seja amigável para iniciantes, é bom saber que isso existe. Com um cluster de GPU, consulte a documentação do EvoX para implantação distribuída. Normalmente, você precisará definir variáveis de ambiente ou iniciar com scripts especiais. A arquitetura permite que o mesmo código seja executado em configurações de nó único ou multi-nó. Para sua primeira tentativa, simule com vários processos em uma máquina.

- **Profiling de Desempenho**: Para ir mais fundo, use ferramentas como o profiler do PyTorch ou o `cProfile` do Python para analisar gargalos. Isso ajuda você a identificar se o tempo é gasto na avaliação, seleção ou em outra coisa — para que você possa otimizar adequadamente (por exemplo, fazendo cache de computações repetidas). O EvoX é construído para desempenho, mas tarefas do mundo real ainda podem atingir gargalos exclusivos que precisam de análise.

Em resumo, embora o EvoX já esteja otimizado no nível da arquitetura, os usuários podem aumentar ainda mais o desempenho **usando GPUs corretamente**, **computação em lote** e **ajuste de parâmetros**. Ao buscar velocidade, lembre-se também de manter a qualidade dos resultados — o equilíbrio é fundamental. À medida que você se familiarizar mais com o EvoX, o ajuste de desempenho se tornará algo natural.