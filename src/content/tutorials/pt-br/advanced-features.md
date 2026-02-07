---
title: "4. Recursos Avançados"
order: 4
---

# 4. Recursos Avançados

O EvoX oferece muitos **recursos avançados** para atender necessidades mais complexas. Após se familiarizar com o básico, este capítulo apresenta como personalizar a configuração do framework, gerenciar módulos de plugins opcionais e otimizar o desempenho — permitindo que você estenda e ajuste o EvoX quando necessário.

## Configuração Personalizada

As configurações padrão do EvoX são adequadas para a maioria das situações, mas às vezes você pode querer personalizar o comportamento ou os parâmetros do framework. Por exemplo:

- **Ajuste de Parâmetros do Algoritmo**: Além do tamanho básico da população e do número de iterações, muitos algoritmos expõem parâmetros avançados. Por exemplo, o CMA-ES permite configuração da matriz de covariância inicial, e o NSGA-II expõe parâmetros de distância de aglomeração. Você pode passar parâmetros para o construtor do algoritmo, por exemplo, `GA(crossover_prob=0.9, mutation_prob=0.1)` personaliza as probabilidades de cruzamento e mutação no Algoritmo Genético. Ajustar esses parâmetros pode refinar o desempenho. Consulte a documentação do EvoX para a API de cada algoritmo, onde os parâmetros disponíveis e valores padrão estão listados.

- **Substituição de Componentes de Operadores**: Você pode substituir operadores evolutivos internos (por exemplo, estratégias de seleção ou mutação). Algumas classes de algoritmos suportam a passagem de objetos de operadores personalizados. Por exemplo, a Evolução Diferencial (DE) pode suportar operadores de mutação personalizados, permitindo que você forneça uma função personalizada ou classe `Operator`. O design modular do EvoX suporta essa substituição no estilo "plugin". Isso tipicamente requer entender os detalhes internos do algoritmo e geralmente não é necessário para casos de uso padrão.

- **Configurações Multiobjetivo**: Para otimização multiobjetivo, você pode precisar configurar preferências ou pesos — por exemplo, definir vetores de peso para métodos de soma ponderada ou ajustar pontos de referência durante a evolução. Essas configurações são tipicamente expostas via parâmetros na classe do problema ou do algoritmo. Por exemplo, `problem = DTLZ2(d=12, m=3)` define um problema de 12 dimensões e 3 objetivos. Alguns algoritmos permitem passar vetores de referência personalizados. Ler a documentação do algoritmo ajuda a aproveitar totalmente essas configurações.

- **Registro e Saída**: O `EvalMonitor` padrão já registra métricas-chave de otimização. Se você precisar de informações extras (por exemplo, diversidade da população ou fitness médio por geração), pode personalizar o monitor ou registrar manualmente dentro do seu loop. Para tarefas de longa duração, você pode querer registrar em um arquivo. Isso pode ser feito usando a biblioteca `logging` do Python ou E/S simples de arquivo para anexar resultados para análise posterior.

Em resumo, configuração personalizada significa modificar o comportamento padrão do EvoX para uma tarefa específica. Isso geralmente envolve uso mais profundo da API do EvoX. Abordaremos mais na seção de **desenvolvimento e extensão**. Para iniciantes, apenas lembre-se: o EvoX oferece interfaces flexíveis que permitem a usuários experientes ajustar quase todos os detalhes — mas você também pode ficar com os padrões e obter resultados rapidamente.

## Gerenciamento de Plugins

"Plugins" aqui se referem a componentes opcionais ou módulos de extensão no EvoX — como ferramentas de visualização, wrappers de ambientes de aprendizado por reforço e projetos irmãos no ecossistema EvoX. Gerenciar plugins no EvoX envolve principalmente **instalar e usar módulos opcionais**. Aqui estão algumas extensões-chave e como gerenciá-las:

- **Plugin de Visualização**: O EvoX inclui o módulo `evox.vis_tools`, que contém um submódulo `plot` para gráficos e suporta o formato de log `.exv` para fluxos de dados em tempo real. Para usar a visualização, instale o EvoX com o extra `vis`: `pip install evox[vis]`. (Se não instalado inicialmente, você pode instalar depois ou apenas executar `pip install plotly` para satisfazer as dependências.) Ao usar ferramentas visuais, você tipicamente chama funções de plotagem após o monitor registrar dados — por exemplo, `EvalMonitor.plot()` usa `vis_tools.plot`. Garantir que este plugin esteja instalado evita erros de bibliotecas ausentes como `matplotlib`.

- **Plugin de Neuroevolução**: O EvoX suporta ambientes de aprendizado por reforço (como o motor de física Brax) e otimização de indivíduos neurais (neuroevolução). Esses recursos estão agrupados na extensão `neuroevolution`, instalada via `pip install "evox[neuroevolution]"`. Isso inclui a biblioteca Google Brax, Gym e mais. Após a instalação, você pode usar wrappers como `BraxProblem` em `evox.problems.neuroevolution` para transformar ambientes de RL em problemas de otimização. Ferramentas como `ParamsAndVector` também estão incluídas para achatar parâmetros de modelos PyTorch em vetores para evolução. Note que o Brax funciona apenas no Linux ou Windows via WSL — Python nativo do Windows pode executar apenas na CPU. Em resumo, habilitar ou desabilitar plugins do EvoX é controlado via instalação de extras específicos.

- **Projetos Irmãos**: O EvoX tem projetos relacionados como EvoRL (focado em aprendizado por reforço evolutivo) e EvoGP (programação genética acelerada por GPU). Estes compartilham a filosofia de design e interface do EvoX. Se sua tarefa é fortemente baseada em RL, você pode preferir esses frameworks dedicados. Gerenciar esses plugins significa garantir compatibilidade de versão e satisfazer dependências. Por exemplo, o EvoRL usa JAX e Brax, enquanto o EvoGP pode exigir bibliotecas de árvores simbólicas. Essas bibliotecas geralmente podem coexistir sem conflitos. Pense nelas como ferramentas complementares que podem ser chamadas do projeto principal EvoX — ou deixadas de fora para uma configuração enxuta.

- **Plugins Personalizados**: Graças à modularidade do EvoX, você pode construir seus próprios "plugins". Por exemplo, criar uma classe `Monitor` personalizada para rastrear métricas únicas, ou uma subclasse `Problem` personalizada que encapsula um simulador de terceiros. Estes efetivamente estendem as capacidades do EvoX. A melhor prática é seguir os contratos de interface do EvoX — por exemplo, garantir que seu `Problem` personalizado tenha um método `evaluate()`, ou que seu `Monitor` personalizado herde de uma classe base. Uma vez testado, você poderia até contribuí-lo para futuras versões do EvoX.

No geral, o gerenciamento de plugins no EvoX é sobre **extensão flexível e controle de dependências**. Como iniciante, durante a instalação, você pode decidir se inclui as extensões `vis` e `neuroevolution`. Se não instaladas inicialmente, podem ser adicionadas depois. Com plugins, você pode monitorar o progresso da otimização mais facilmente e integrar o EvoX com ferramentas externas para maior poder.

## Otimização de Desempenho

O desempenho é um grande ponto forte do EvoX. Mesmo usando o mesmo algoritmo, o suporte a GPU do EvoX pode aumentar a velocidade em várias ordens de magnitude. No entanto, para aproveitar totalmente isso, você vai querer seguir algumas dicas:

- **Use Paralelismo de GPU**: Primeiro, certifique-se de que seu código está realmente rodando na GPU. Como mencionado anteriormente, instale o PyTorch habilitado para CUDA e mova os dados para dispositivos GPU. Se as coisas parecerem lentas, verifique com `torch.cuda.is_available()` — deve retornar `True`. Se a GPU existe mas não está sendo usada, provavelmente é porque os tensores foram criados na CPU por padrão. Corrija isso definindo explicitamente o `device`, ou garantindo que os tensores de entrada (como `lb`/`ub`) estejam no CUDA. O EvoX seguirá o dispositivo dessas entradas. Em sistemas multi-GPU, o EvoX geralmente usa **uma GPU por processo**. Para aproveitar múltiplas GPUs, você pode executar múltiplos processos com diferentes GPUs ou aguardar suporte futuro para execução coordenada multi-GPU.

- **Avaliação Paralela**: Um gargalo-chave em algoritmos evolutivos é a **avaliação de fitness**. Como as avaliações são frequentemente independentes, podem ser paralelizadas. O EvoX agrupa avaliações quando possível — por exemplo, avaliações de redes neurais ou funções polinomiais podem ser computadas em paralelo usando a GPU. Para problemas personalizados, evite loops Python — vetorize seu código de avaliação para processar um lote inteiro de candidatos de uma vez. Isso aproveita ao máximo as capacidades paralelas do PyTorch. Simplificando: faça a função `evaluate()` do seu problema operar em lotes — não em soluções individuais — para uma aceleração massiva.

- **Compilar para Otimização**: O PyTorch 2.0 introduziu `torch.compile`, que compila JIT modelos/funções para ganhos de desempenho. Se sua lógica de avaliação é complexa, considere compilar antes de executar:

  ```python
  jit_state_step = torch.compile(workflow.step())
  ```

  Isso pode melhorar significativamente o desempenho.
  > **Nota:**
> A compilação adiciona sobrecarga e nem sempre é suportada por todas as funções ou problemas. Mais adequada para tarefas de grande escala e longa duração. No Windows, certifique-se de que o Triton esteja instalado para que o `torch.compile` funcione.

- **Ajuste o Tamanho da População**: Uma população maior aumenta a diversidade e a capacidade de busca global — mas também aumenta a computação por geração. Equilibre qualidade e velocidade ajustando `pop_size`. Na GPU, você frequentemente pode aumentá-lo sem um custo de tempo linear (graças ao paralelismo). Mas um tamanho muito grande pode causar problemas de memória. Se você está ficando sem memória GPU, reduza o tamanho da população ou a dimensão do problema, ou use FP16 para economizar espaço (defina via `torch.set_float32_matmul_precision('medium')`).

- **Reduza a Sobrecarga do Python**: O EvoX move a maioria da computação central para `torch.Tensor`, mas loops escritos pelo usuário ou operadores personalizados devem evitar operações excessivas em nível Python. Evite impressões frequentes (alto custo de E/S), listas ou conversões de tipos de dados. Mantenha seu código vetorizado/tensorizado para aproveitar kernels rápidos C++/CUDA por baixo e reduzir a sobrecarga do interpretador Python.

- **Implantação Distribuída**: Para problemas ultra-grandes, considere executar em múltiplas máquinas. O EvoX suporta configurações multi-nó (via comunicação de backend e sharding). Embora não seja amigável para iniciantes, é bom saber que isso existe. Com um cluster de GPUs, consulte a documentação do EvoX para implantação distribuída. Geralmente, você precisará definir variáveis de ambiente ou iniciar com scripts especiais. A arquitetura permite que o mesmo código rode em configurações de nó único ou multi-nó. Para sua primeira tentativa, simule com múltiplos processos em uma máquina.

- **Perfil de Desempenho**: Para se aprofundar, use ferramentas como o profiler do PyTorch ou o `cProfile` do Python para analisar gargalos. Isso ajuda a identificar se o tempo vai para avaliação, seleção ou outra coisa — para que você possa otimizar adequadamente (por exemplo, cacheando computações repetidas). O EvoX é construído para desempenho, mas tarefas do mundo real ainda podem encontrar gargalos únicos que precisam de análise.

Em resumo, embora o EvoX já seja otimizado no nível da arquitetura, os usuários podem aumentar ainda mais o desempenho **usando GPUs corretamente**, **computação em lote** e **ajustando parâmetros**. Enquanto busca velocidade, lembre-se também de manter a qualidade dos resultados — o equilíbrio é fundamental. À medida que você se familiariza mais com o EvoX, o ajuste de desempenho se tornará natural.
