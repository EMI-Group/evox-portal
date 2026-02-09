---
title: "3. Operações Básicas"
order: 3
---

# 3. Operações Básicas

Neste capítulo, iremos guiá-lo na execução da sua primeira tarefa de otimização com o EvoX, incluindo como **iniciar o EvoX** e **inicializar o processo de otimização**, como **configurar um projeto EvoX** (selecionando algoritmos e problemas e montando-os) e os **comandos básicos** (ou métodos) comummente utilizados para controlar o processo de otimização. Através de um exemplo simples, aprenderá a utilização básica do EvoX.

## Iniciar e Inicializar

Após verificar a instalação, pode começar a escrever scripts de otimização utilizando o EvoX. Pode importar o EvoX em qualquer ambiente Python (como o terminal, Jupyter Notebook, IDE, etc.).

Primeiro, vamos importar o EvoX e os seus módulos relacionados, e inicializar uma tarefa de otimização simples. Por exemplo, utilizaremos o algoritmo Particle Swarm Optimization (PSO) para otimizar a clássica função Ackley. A função Ackley é uma função de benchmark comum com um ótimo global conhecido em \((0,0,\dots,0)\), o que a torna adequada para demonstração.
Aqui está um código de exemplo minimalista do EvoX que demonstra como iniciar e executar a otimização:

```python
import torch
from evox.algorithms import PSO                      # Import PSO algorithm
from evox.problems.numerical import Ackley           # Import Ackley optimization problem
from evox.workflows import StdWorkflow, EvalMonitor  # Import standard workflow and monitor

# 1. Define the optimization algorithm and problem
algorithm = PSO(
    pop_size=50,                    # Population size of 50
    lb=-32 * torch.ones(2),         # Decision variable lower bound: 2D vector, each -32
    ub= 32 * torch.ones(2)          # Decision variable upper bound: 2D vector, each 32
)
problem = Ackley()                  # Optimization problem: Ackley function (default dimension matches the algorithm)

# 2. Assemble the workflow and add a monitor to track results
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Initialize the workflow
workflow.init_step()  # Initialize the internal state of the algorithm and problem

# 4. Execute optimization iterations
for i in range(100):
    workflow.step()   # Advance the optimization by one step

# 5. Obtain results (e.g., print the optimal value)
best_fitness = monitor.get_best_fitness() # Get the best fitness value from the monitor
print("Iteration completed, current best fitness value found:", float(best_fitness))
```

O código acima inclui os seguintes passos:
- Primeiro, definimos os parâmetros para o algoritmo PSO: tamanho da população de 50 e um espaço de procura em 2D variando entre [-32, 32].
- Depois, definimos o problema Ackley (a função Ackley é definida como 2D por defeito).
- Criamos um workflow padrão `StdWorkflow` que **monta** o algoritmo e o problema, e passamos um monitor `EvalMonitor` para registar os dados do processo de otimização.
- Em seguida, completamos o processo de inicialização utilizando `workflow.init_step()`, que inicializa automaticamente a população, a semente aleatória e outros estados internos.
- Depois, executamos um loop para realizar continuamente 100 iterações utilizando `workflow.step()`. Cada vez que `step()` é chamado, o algoritmo gera novas soluções e avalia a sua fitness, aproximando-se continuamente da solução ótima.
- Finalmente, utilizamos o método `get_min_fitness()` fornecido pelo monitor para obter o melhor valor de fitness durante o processo de iteração e imprimi-lo.

Ao executar este script, verá o resultado das iterações de otimização, por exemplo:

```text
Iteration completed, current best fitness value found: 9.5367431640625e-07
```

Como não imprimimos explicitamente os resultados intermédios no loop, estes não serão exibidos. No entanto, pode julgar se o algoritmo convergiu com base no valor final de fitness. Por exemplo, o valor ótimo da função Ackley é 0, e se o resultado for próximo de 0, isso indica que o PSO encontrou uma solução próxima do ótimo global. Também pode chamar `print(monitor.history)` para visualizar os dados históricos registados pelo monitor ou utilizar `monitor.plot()` para desenhar curvas de convergência (requer suporte de visualização como o Plotly).

> **Nota:**
> `StdWorkflow` é um encapsulamento do **processo de otimização padrão** fornecido pelo EvoX. Implementa internamente a lógica de "inicialização-iteração de atualização" encontrada em algoritmos evolutivos tradicionais e encapsula a interação entre o algoritmo e o problema. Para a maioria das aplicações simples, utilizar o `StdWorkflow` diretamente será suficiente. O `EvalMonitor` é um monitor que implementa métodos como `get_best_fitness()` e `plot()` para recolher e exibir métricas de desempenho durante o processo de otimização. Os principiantes podem entendê-lo temporariamente como um livro de registos que anota os melhores resultados de cada iteração para análise posterior.

No exemplo acima, criámos uma configuração básica para um projeto EvoX, incluindo a seleção de um algoritmo, a definição do problema e a montagem do workflow. Geralmente, a configuração de um projeto EvoX envolve os seguintes passos:

1. **Selecionar/Definir um Problema de Otimização**: Clarifique que problema de otimização está a tentar resolver. Por exemplo, se estiver a otimizar uma função matemática, o EvoX fornece muitos **problemas integrados** sob o módulo `evox.problems` (por exemplo, funções clássicas como Sphere, Rastrigin, Ackley) que pode utilizar diretamente. Se o seu problema não estiver coberto pelos integrados, pode definir o seu próprio (abordado num capítulo posterior). Ao configurar um problema, geralmente precisa de saber a **dimensão das variáveis de decisão** e o seu **intervalo de valores**.

2. **Selecionar/Configurar um Algoritmo de Otimização**: Escolha um algoritmo evolutivo apropriado com base no tipo de problema. O EvoX fornece um conjunto rico de algoritmos sob `evox.algorithms`, incluindo algoritmos de objetivo único (como PSO, GA, CMA-ES) e algoritmos multi-objetivo (como NSGA-II, RVEA). Após escolher o algoritmo, geralmente precisará de definir os parâmetros do algoritmo, como o tamanho da população (`pop_size`) e parâmetros específicos do algoritmo (como a probabilidade de cruzamento e a probabilidade de mutação no GA). A maioria dos algoritmos requer o **intervalo de variáveis** (limite inferior `lb` e limite superior `ub`) e a dimensão do problema para inicializar a população. Se estiver a utilizar um algoritmo multi-objetivo, também precisará de especificar o número de objetivos (`n_objs`). Os algoritmos do EvoX fornecem frequentemente valores por defeito para hiperparâmetros comuns, mas os principiantes devem considerar o ajuste destes parâmetros com base na tarefa para um melhor desempenho.

3. **Montar o Workflow**: Com a instância do algoritmo e do problema prontas, precisa de as "montar" num workflow, que representa o controlo total do processo de otimização. No EvoX, o `StdWorkflow` é tipicamente utilizado para combinar o algoritmo e o problema. Se quiser monitorizar o progresso da otimização, pode adicionar um monitor (como o `EvalMonitor`) ao workflow. Um monitor não é obrigatório, mas pode ser muito útil durante a depuração e análise. Montar o workflow geralmente leva uma linha de código, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Chame o método de inicialização do workflow para começar a otimização. A versão mais recente do EvoX fornece um método conveniente `StdWorkflow.init_step()` que completa o processo de inicialização numa única chamada.

5. **Executar Iterações**: Utilize um loop para chamar repetidamente `workflow.step()` para impulsionar o processo evolutivo. Cada chamada realiza uma iteração, incluindo passos como "gerar novas soluções -> avaliar -> selecionar" dentro do algoritmo. Durante as iterações, pode utilizar um monitor para observar os resultados em tempo real, como imprimir o melhor fitness atual a cada poucas gerações. Os critérios de terminação podem ser definidos com base nas suas necessidades — os comuns incluem um número fixo de gerações (por exemplo, executar por 100 gerações) ou parar quando as métricas monitorizadas convergem (por exemplo, sem melhoria significativa ao longo de várias gerações).

6. **Obter Resultados**: Após o fim das iterações, precisa de extrair os resultados finais do algoritmo — como a melhor solução e o seu valor de objetivo. No EvoX, estes são tipicamente obtidos através do monitor. Por exemplo, `EvalMonitor.get_best_fitness()` devolve o melhor valor de fitness. Para obter o vetor da melhor solução, uma forma é fazer com que o objeto do problema armazene o melhor candidato durante a avaliação, ou utilizar a interface do monitor. Na implementação padrão do EvoX, o `EvalMonitor` regista o melhor indivíduo e fitness em cada geração, acessíveis através das suas propriedades. Assumindo que `monitor.history` armazena o histórico, pode recuperar o melhor indivíduo da última geração. Claro que também pode saltar o `EvalMonitor` e consultar diretamente o objeto do algoritmo após o loop — isto depende da implementação do algoritmo. Se o seu algoritmo personalizado implementar `get_best()` ou armazenar o melhor indivíduo no seu estado, pode extraí-lo diretamente. No entanto, como o EvoX enfatiza funções puras e modularidade, os resultados são geralmente acedidos através de módulos de monitorização.

Ao seguir estes passos, pode estruturar claramente o código da sua tarefa de otimização. Para principiantes, é importante compreender como o trio **algoritmo-problema-workflow** funciona em conjunto: o algoritmo trata de gerar e melhorar as soluções, o problema avalia a sua qualidade e o workflow liga-os num loop iterativo.

Em seguida, apresentaremos alguns comandos básicos e chamadas de função disponíveis no EvoX para ajudar a aprofundar a sua compreensão do processo de otimização.

## Visão Geral dos Comandos Básicos

Ao utilizar o EvoX, existem alguns **métodos e funções comummente utilizados** que funcionam como "comandos" com os quais se deve familiarizar:

### Métodos Relacionados com o Workflow

- **`StdWorkflow.init_step()`**: Inicialização. Este é um comando de início rápido para lançar o processo de otimização, frequentemente utilizado no início de um script. Chama a lógica de inicialização tanto para o algoritmo como para o problema, gera a população inicial e avalia o fitness. Após isto, o workflow contém o estado inicial e está pronto para a iteração.

- **`StdWorkflow.step()`**: Avançar um passo na otimização. Cada chamada faz com que o algoritmo gere novas soluções candidatas com base no estado atual da população, as avalie e selecione a próxima geração. Os utilizadores chamam tipicamente isto várias vezes dentro de um loop. A função `step()` geralmente não devolve nada (o estado interno é atualizado dentro do workflow), embora versões mais antigas possam devolver um novo estado. Para principiantes, pode simplesmente chamá-la sem se preocupar com o valor de retorno.

### Métodos Relacionados com o Monitor

Utilizando o `EvalMonitor` como exemplo, os métodos comuns incluem:

- `EvalMonitor.get_best_fitness()`: Devolve o fitness mais baixo registado (para problemas de minimização) ou o fitness mais alto (para problemas de maximização; o monitor geralmente distingue isto). Útil para conhecer o melhor resultado atual.
- `EvalMonitor.get_history()` ou `monitor.history`: Recupera o histórico completo, como o melhor valor de cada geração. Útil para analisar tendências de convergência.
- `EvalMonitor.plot()`: Desenha curvas de convergência ou desempenho; requer um ambiente gráfico ou Notebook. O monitor utiliza geralmente o Plotly para renderizar gráficos, ajudando-o a avaliar visualmente o desempenho do algoritmo.
  Internamente, o monitor regista o número de avaliações e os seus resultados em cada geração — normalmente não precisa de intervir, apenas extrair os dados quando necessário.

### Métodos Relacionados com o Algoritmo

- Método `Algorithm.__init__()`: Método de inicialização de um algoritmo. As variáveis são geralmente envolvidas utilizando `evox.core.Mutable()` e os hiperparâmetros com `evox.core.Parameter()`.

- Método `Algorithm.step()`: Em cenários específicos ou ao utilizar algoritmos/problemas personalizados, pode chamar diretamente o método `step()` do algoritmo, que tipicamente encapsula toda a lógica de iteração do algoritmo.

- Método `Algorithm.init_step()`: O método `init_step()` inclui a primeira iteração do algoritmo. Se não for substituído, chama simplesmente o método `step()`. Para casos típicos, a primeira iteração não é diferente das outras, pelo que muitos algoritmos podem não precisar de um `init_step()` personalizado. Mas para algoritmos que envolvem ajuste de hiperparâmetros, pode precisar de atualizar hiperparâmetros ou variáveis relacionadas aqui.

### Controlo de Dispositivo e Paralelismo

- Método `.to(device)`: Se precisar de alternar dispositivos de computação no seu programa, utilize o método `.to(device)` do PyTorch para mover tensores (`torch.Tensor`) para GPU/CPU (alguns métodos do PyTorch como `torch.randn` também precisam que o dispositivo seja especificado). Geralmente, se definir o dispositivo utilizando `torch.set_default_device()` para `cuda:0` (assumindo que o seu sistema o suporta e que o EvoX e as dependências estão instalados corretamente — verifique com `torch.cuda.is_available()`), a maioria das computações paralelas de alto desempenho do EvoX será executada automaticamente no GPU. Ao escrever algoritmos, problemas ou monitores personalizados, se criar novos tensores ou utilizar métodos do PyTorch sensíveis ao dispositivo, recomenda-se especificar explicitamente o `device` como `cuda:0` ou utilizar `torch.get_default_device()` para evitar quedas de desempenho devido a computações espalhadas por diferentes dispositivos.

Para principiantes, os métodos acima são suficientes para lidar com tarefas de otimização típicas. Em resumo: **Inicializar problema/algoritmo – configurar monitor – montar workflow – executar e recuperar resultados** é o workflow mais comum do EvoX. Dominar estes passos permite-lhe enfrentar tarefas básicas de otimização utilizando o EvoX.

Antes de passar para o próximo capítulo, tente modificar o exemplo: mude do PSO para outro algoritmo, substitua a função Ackley por outra função de teste ou utilize o monitor para extrair mais informações — isto ajudará a apreciar a flexibilidade de configurar projetos EvoX.