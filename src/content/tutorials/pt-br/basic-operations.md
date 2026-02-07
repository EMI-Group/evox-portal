---
title: "3. Operações Básicas"
order: 3
---

# 3. Operações Básicas

Neste capítulo, vamos guiá-lo na execução da sua primeira tarefa de otimização com o EvoX, incluindo como **iniciar o EvoX** e **inicializar o processo de otimização**, como **configurar um projeto EvoX** (selecionando algoritmos e problemas e montando-os), e os **comandos básicos** (ou métodos) comumente usados para controlar o processo de otimização. Através de um exemplo simples, você aprenderá o uso básico do EvoX.

## Iniciando e Inicializando

Após verificar a instalação, você pode começar a escrever scripts de otimização usando o EvoX. Você pode importar o EvoX em qualquer ambiente Python (como terminal, Jupyter Notebook, IDE, etc.).

Primeiro, vamos importar o EvoX e seus módulos relacionados, e inicializar uma tarefa de otimização simples. Por exemplo, usaremos o algoritmo de Otimização por Enxame de Partículas (PSO) para otimizar a clássica função Ackley. A função Ackley é uma função de referência comum com um ótimo global conhecido em \((0,0,\dots,0)\), tornando-a adequada para demonstração.
Aqui está um código de exemplo mínimo do EvoX que demonstra como iniciar e executar a otimização:

```python
import torch
from evox.algorithms import PSO                      # Importar algoritmo PSO
from evox.problems.numerical import Ackley           # Importar problema de otimização Ackley
from evox.workflows import StdWorkflow, EvalMonitor  # Importar workflow padrão e monitor

# 1. Definir o algoritmo de otimização e o problema
algorithm = PSO(
    pop_size=50,                    # Tamanho da população de 50
    lb=-32 * torch.ones(2),         # Limite inferior da variável de decisão: vetor 2D, cada um -32
    ub= 32 * torch.ones(2)          # Limite superior da variável de decisão: vetor 2D, cada um 32
)
problem = Ackley()                  # Problema de otimização: função Ackley (dimensão padrão corresponde ao algoritmo)

# 2. Montar o workflow e adicionar um monitor para rastrear resultados
monitor = EvalMonitor()
workflow = StdWorkflow(algorithm, problem, monitor)

# 3. Inicializar o workflow
workflow.init_step()  # Inicializar o estado interno do algoritmo e do problema

# 4. Executar iterações de otimização
for i in range(100):
    workflow.step()   # Avançar a otimização em um passo

# 5. Obter resultados (ex: imprimir o valor ótimo)
best_fitness = monitor.get_best_fitness() # Obter o melhor valor de fitness do monitor
print("Iteração concluída, melhor valor de fitness encontrado:", float(best_fitness))
```

O código acima inclui os seguintes passos:
- Primeiro, definimos os parâmetros para o algoritmo PSO: tamanho da população de 50 e um espaço de busca em 2D variando de [-32, 32].
- Em seguida, definimos o problema Ackley (a função Ackley é definida como 2D por padrão).
- Criamos um workflow padrão `StdWorkflow` que **monta** o algoritmo e o problema, e passamos um monitor `EvalMonitor` para registrar os dados do processo de otimização.
- A seguir, completamos o processo de inicialização usando `workflow.init_step()`, que inicializa automaticamente a população, a semente aleatória e outros estados internos.
- Então, executamos um loop para realizar continuamente 100 iterações usando `workflow.step()`. Cada vez que `step()` é chamado, o algoritmo gera novas soluções e avalia seu fitness, aproximando-se continuamente da solução ótima.
- Finalmente, usamos o método `get_min_fitness()` fornecido pelo monitor para obter o melhor valor de fitness durante o processo de iteração e imprimimos.

Quando você executar este script, verá a saída das iterações de otimização, por exemplo:

```text
Iteração concluída, melhor valor de fitness encontrado: 9.5367431640625e-07
```

Como não imprimimos explicitamente os resultados intermediários no loop, os resultados intermediários não serão exibidos. No entanto, você pode julgar se o algoritmo convergiu com base no valor final de fitness. Por exemplo, o valor ótimo da função Ackley é 0, e se a saída estiver próxima de 0, indica que o PSO encontrou uma solução próxima ao ótimo global. Você também pode chamar `print(monitor.history)` para ver os dados históricos registrados pelo monitor ou usar `monitor.plot()` para plotar curvas de convergência (requer suporte de visualização como Plotly).

> **Nota:**
> `StdWorkflow` é um encapsulamento de **processo de otimização padrão** fornecido pelo EvoX. Ele implementa internamente a lógica de "inicialização-atualização iterativa" encontrada em algoritmos evolutivos tradicionais e encapsula a interação entre o algoritmo e o problema. Para a maioria das aplicações simples, usar `StdWorkflow` diretamente será suficiente. O `EvalMonitor` é um monitor que implementa métodos como `get_best_fitness()` e `plot()` para coletar e exibir métricas de desempenho durante o processo de otimização. Iniciantes podem temporariamente entendê-lo como um caderno de registros que registra os melhores resultados de cada iteração para análise posterior.

No exemplo acima, criamos uma configuração básica para um projeto EvoX, incluindo a seleção de um algoritmo, a definição do problema e a montagem do workflow. Geralmente, configurar um projeto EvoX envolve os seguintes passos:

1. **Selecionar/Definir um Problema de Otimização**: Esclareça qual problema de otimização você está tentando resolver. Por exemplo, se você está otimizando uma função matemática, o EvoX fornece muitos **problemas integrados** no módulo `evox.problems` (por exemplo, funções clássicas como Sphere, Rastrigin, Ackley) que você pode usar diretamente. Se seu problema não estiver coberto pelos integrados, você pode definir o seu próprio (abordado em um capítulo posterior). Ao configurar um problema, você geralmente precisa saber a **dimensão das variáveis de decisão** e seu **intervalo de valores**.

2. **Selecionar/Configurar um Algoritmo de Otimização**: Escolha um algoritmo evolutivo apropriado com base no tipo de problema. O EvoX fornece um rico conjunto de algoritmos em `evox.algorithms`, incluindo algoritmos de objetivo único (como PSO, GA, CMA-ES) e algoritmos multiobjetivo (como NSGA-II, RVEA). Após escolher o algoritmo, você geralmente precisará definir parâmetros do algoritmo, como tamanho da população (`pop_size`) e parâmetros específicos do algoritmo (como probabilidade de cruzamento e probabilidade de mutação no GA). A maioria dos algoritmos requer o **intervalo de variáveis** (limite inferior `lb` e limite superior `ub`) e a dimensão do problema para inicializar a população. Se você estiver usando um algoritmo multiobjetivo, também precisará especificar o número de objetivos (`n_objs`). Os algoritmos do EvoX frequentemente fornecem valores padrão para hiperparâmetros comuns, mas iniciantes devem considerar ajustar esses parâmetros com base na tarefa para melhor desempenho.

3. **Montar o Workflow**: Com as instâncias do algoritmo e do problema prontas, você precisa "montá-los" em um workflow, que representa o controle completo do processo de otimização. No EvoX, `StdWorkflow` é tipicamente usado para combinar o algoritmo e o problema. Se você quiser monitorar o progresso da otimização, pode adicionar um monitor (como `EvalMonitor`) ao workflow. Um monitor não é obrigatório, mas pode ser muito útil durante a depuração e análise. Montar o workflow geralmente leva uma linha de código, como: `workflow = StdWorkflow(algo, prob, monitor)`.

4. **Inicializar**: Chame o método de inicialização do workflow para começar a otimização. A versão mais recente do EvoX fornece um método conveniente `StdWorkflow.init_step()` que completa o processo de inicialização em uma única chamada.

5. **Executar Iterações**: Use um loop para chamar repetidamente `workflow.step()` para impulsionar o processo evolutivo. Cada chamada realiza uma iteração, incluindo passos como "gerar novas soluções -> avaliar -> selecionar" dentro do algoritmo. Durante as iterações, você pode usar um monitor para observar resultados em tempo real, como imprimir o melhor fitness atual a cada poucas gerações. Critérios de parada podem ser definidos com base nas suas necessidades — os comuns incluem um número fixo de gerações (por exemplo, executar por 100 gerações), ou parar quando as métricas monitoradas convergirem (por exemplo, sem melhoria significativa ao longo de várias gerações).

6. **Obter Resultados**: Após o término das iterações, você precisa extrair os resultados finais do algoritmo — como a melhor solução e seu valor objetivo. No EvoX, estes são tipicamente obtidos via o monitor. Por exemplo, `EvalMonitor.get_best_fitness()` retorna o melhor valor de fitness. Para obter o melhor vetor de solução, uma forma é fazer o objeto do problema armazenar o melhor candidato durante a avaliação, ou usar a interface do monitor. Na implementação padrão do EvoX, `EvalMonitor` registra o melhor indivíduo e fitness de cada geração, acessíveis através de suas propriedades. Assumindo que `monitor.history` armazena o histórico, você pode recuperar o melhor indivíduo da última geração. Claro, você também pode pular o `EvalMonitor` e consultar diretamente o objeto do algoritmo após o loop — isso depende da implementação do algoritmo. Se seu algoritmo personalizado implementa `get_best()` ou armazena o melhor indivíduo em seu estado, você pode extraí-lo diretamente. No entanto, como o EvoX enfatiza funções puras e modularidade, os resultados são geralmente acessados via módulos de monitoramento.

Seguindo esses passos, você pode estruturar claramente o código da sua tarefa de otimização. Para iniciantes, é importante entender como o trio **algoritmo-problema-workflow** funciona junto: o algoritmo lida com a geração e melhoria de soluções, o problema avalia sua qualidade, e o workflow os conecta em um loop iterativo.

A seguir, apresentaremos alguns comandos básicos e chamadas de função disponíveis no EvoX para ajudar a aprofundar sua compreensão do processo de otimização.

## Visão Geral dos Comandos Básicos

Ao usar o EvoX, existem alguns **métodos e funções comumente usados** que funcionam como "comandos" com os quais você vai querer se familiarizar:

### Métodos Relacionados ao Workflow

- **`StdWorkflow.init_step()`**: Inicialização. Este é um comando de início rápido para lançar o processo de otimização, frequentemente usado no início de um script. Ele chama a lógica de inicialização tanto para o algoritmo quanto para o problema, gera a população inicial e avalia o fitness. Após isso, o workflow contém o estado inicial e está pronto para iteração.

- **`StdWorkflow.step()`**: Avançar um passo na otimização. Cada chamada faz o algoritmo gerar novas soluções candidatas com base no estado atual da população, avaliá-las e selecionar a próxima geração. Os usuários tipicamente chamam isso múltiplas vezes dentro de um loop. A função `step()` geralmente não retorna nada (o estado interno é atualizado dentro do workflow), embora versões mais antigas possam retornar um novo estado. Para iniciantes, você pode simplesmente chamá-la sem se preocupar com o valor de retorno.

### Métodos Relacionados ao Monitor

Usando `EvalMonitor` como exemplo, os métodos comuns incluem:

- `EvalMonitor.get_best_fitness()`: Retorna o menor fitness registrado (para problemas de minimização) ou o maior fitness (para problemas de maximização; o monitor geralmente distingue isso). Útil para saber o melhor resultado atual.
- `EvalMonitor.get_history()` ou `monitor.history`: Recupera o histórico completo, como o melhor valor de cada geração. Útil para analisar tendências de convergência.
- `EvalMonitor.plot()`: Plota curvas de convergência ou desempenho; requer um ambiente gráfico ou Notebook. O monitor geralmente usa Plotly para renderizar gráficos, ajudando você a avaliar visualmente o desempenho do algoritmo.
  Internamente, o monitor registra o número de avaliações e seus resultados a cada geração — você tipicamente não precisa intervir, apenas extrair os dados quando necessário.

### Métodos Relacionados ao Algoritmo

- Método `Algorithm.__init__()`: Método de inicialização de um algoritmo. Variáveis são geralmente encapsuladas usando `evox.core.Mutable()` e hiperparâmetros com `evox.core.Parameter()`.

- Método `Algorithm.step()`: Em cenários específicos ou ao usar algoritmos/problemas personalizados, você pode chamar diretamente o método `step()` do algoritmo, que tipicamente encapsula toda a lógica de iteração do algoritmo.

- Método `Algorithm.init_step()`: O método `init_step()` inclui a primeira iteração do algoritmo. Se não for sobrescrito, ele simplesmente chama o método `step()`. Para casos típicos, a primeira iteração não é diferente das outras, então muitos algoritmos podem não precisar de um `init_step()` personalizado. Mas para algoritmos envolvendo ajuste de hiperparâmetros, você pode precisar atualizar hiperparâmetros ou variáveis relacionadas aqui.

### Controle de Dispositivo e Paralelismo

- Método `.to(device)`: Se você precisar trocar dispositivos de computação no seu programa, use o método `.to(device)` do PyTorch para mover tensores (`torch.Tensor`) para GPU/CPU (alguns métodos do PyTorch como `torch.randn` também precisam do dispositivo especificado). Geralmente, se você definir o dispositivo usando `torch.set_default_device()` para `cuda:0` (assumindo que seu sistema suporta e o EvoX e dependências estão instalados corretamente — verifique com `torch.cuda.is_available()`), a maioria das computações paralelas de alto desempenho do EvoX será executada na GPU automaticamente. Ao escrever algoritmos, problemas ou monitores personalizados, se você criar novos tensores ou usar métodos do PyTorch sensíveis ao dispositivo, é recomendado especificar explicitamente o `device` como `cuda:0` ou usar `torch.get_default_device()` para evitar quedas de desempenho de computações espalhadas por diferentes dispositivos.

Para iniciantes, os métodos acima são suficientes para lidar com tarefas típicas de otimização. Em resumo: **Inicializar problema/algoritmo – configurar monitor – montar workflow – executar e recuperar resultados** é o fluxo de trabalho mais comum do EvoX. Dominar isso permite que você enfrente tarefas básicas de otimização usando o EvoX.

Antes de passar para o próximo capítulo, tente modificar o exemplo: troque o PSO por outro algoritmo, substitua a função Ackley por outra função de teste, ou use o monitor para extrair mais informações — isso ajudará você a apreciar a flexibilidade de configurar projetos EvoX.
