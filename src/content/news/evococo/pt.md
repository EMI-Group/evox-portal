---
title: "EvoCoCo: conversão automática de código de MATLAB para EvoX para otimização multiobjetivo acelerada por GPU"
pubDate: 2026-10-09
summary: "A EvoCoCo converte algoritmos evolutivos multiobjetivo implementados em MATLAB em implementações EvoX aceleradas por GPU, através de tensorização guiada pela semântica, retroalimentação de execução e validação multiagente. Avaliada em 48 algoritmos, alcança uma cobertura global de fidelidade de otimização de 88.2%."
---

![Título e autores do artigo EvoCoCo](./title_banner.png)

Poderá um algoritmo evolutivo multiobjetivo (MOEA) implementado em MATLAB ser entregue diretamente a um grande modelo de linguagem e reescrito automaticamente como um programa acelerado por GPU? À primeira vista, isso parece significar substituir MATLAB por PyTorch, arrays por tensores e ciclos por operações em lote. A verdadeira dificuldade, porém, está na semântica do algoritmo: que cálculos podem correr em paralelo, quais dependem de uma ordem que deve ser preservada, que variáveis são temporárias e quais transportam estado entre gerações. Se estas distinções estiverem erradas, o código convertido pode executar-se e, ainda assim, implementar um algoritmo diferente.

A equipa EvoX propõe a EvoCoCo (Evolutionary Code Conversion), uma arquitetura multiagente para tensorização automática guiada pela semântica. Primeiro compreende o algoritmo de origem, depois explora diferentes implementações tensorizadas e, por fim, usa a retroalimentação de execução para validar, reparar e selecionar candidatos. A EvoCoCo foi avaliada em 48 MOEA segundo três dimensões: fiabilidade da migração, fidelidade de otimização e escalabilidade computacional. A cobertura global de fidelidade de otimização atingiu 88.2%. As acelerações medianas foram de 22.6× ao escalonar o tamanho da população e de 80.2× ao escalonar a dimensionalidade das variáveis de decisão. Em maior escala, o algoritmo representativo MOEA/D-DE alcançou uma aceleração de 37,339×.

## O que é verdadeiramente difícil de transportar para GPU não é a sintaxe

Os MOEA oferecem um paralelismo substancial ao nível da população. A avaliação dos objetivos, a mutação, a ordenação, a seleção ambiental e as operações de arquivo processam frequentemente lotes de soluções candidatas ou relações dentro de uma população, o que os torna bem adequados a uma execução paralela através de computação tensorial em GPU.

O paralelismo de um algoritmo não significa que a sua implementação existente esteja pronta para execução em GPU. No PlatEMO, por exemplo, o código MATLAB combina operações vetorizadas com ciclos ao nível do indivíduo, contentores dinâmicos, ramos condicionais, extração iterativa de frentes não dominadas, fatiamento de objetos e várias funções auxiliares. Transportar este código para uma GPU exige reorganizar as representações de dados, o fluxo de controlo e as atualizações de estado. Isto vai muito além da simples substituição de sintaxe.

O desafio é identificar que estruturas definem o algoritmo original:

- Que variáveis representam estado do algoritmo que persiste entre gerações?
- Que cálculos podem ser reescritos usando difusão (broadcasting), máscaras ou indexação em lote?
- Que ciclos contêm verdadeiras dependências sequenciais e devem ser preservados?
- Que alterações de estado e de relações de atualização modificariam o mecanismo de otimização?

É precisamente a estas questões que a EvoCoCo responde. A conversão pode alterar as disposições de dados, o fluxo de controlo e as estratégias de execução, preservando os operadores nucleares, o estado persistente, as dependências e a lógica de atualização do algoritmo. Isto estabelece a fronteira entre o que a tensorização automática pode reestruturar e o que deve preservar.

## A tensorização automática exige mais do que uma única geração de código

A EvoCoCo divide a conversão de código em três fases: compreensão, tensorização e validação com seleção. Nenhum agente único trata da conversão do início ao fim. O algoritmo de origem é analisado uma única vez para produzir uma representação semântica partilhada. Os candidatos tensorizados posteriores são gerados a partir dessa mesma representação e do mesmo plano. Assim, a compreensão do algoritmo é separada da geração de implementações.

![Arquitetura multiagente da EvoCoCo](./fig2_architecture.png)

*Figura 1. Arquitetura multiagente da EvoCoCo. O Source Analysis Agent reconstrói a semântica do algoritmo, o Rule Retriever obtém as regras de migração e o Blueprint Agent cria um plano de tensorização. Vários Tensorization Agents geram candidatos em paralelo sob restrições partilhadas. A retroalimentação de execução orienta a reparação, e o Selection Agent efetua a seleção final.*

Fase 1: compreensão. O Source Analysis Agent reconstrói a semântica do algoritmo de origem, identificando os seus operadores nucleares, o estado persistente, as dependências e a lógica de atualização. O Rule Retriever obtém as regras de migração relevantes com base na estrutura do algoritmo. O Blueprint Agent cria então um plano de tensorização partilhado que especifica como o estado é mapeado, como o cálculo é reestruturado e que restrições a plataforma-alvo deve satisfazer.

Fase 2: tensorização. Sob o mesmo plano, k Tensorization Agents geram candidatos em paralelo, com ênfases diferentes na difusão, na otimização com einsum, nas operações mascaradas, nas atualizações no local, em operadores tensoriais avançados e na tensorização da seleção iterativa. Exploram diferentes implementações computacionais do mesmo algoritmo, usando a compreensão partilhada do código-fonte, em vez de reinterpretarem cada um o código-fonte de forma independente.

Fase 3: validação e seleção. Os programas candidatos são sujeitos a verificações estáticas e a validação em execução. Problemas de interface, forma de tensores, dispositivo, numéricos ou de fluxo de controlo expostos durante a execução são enviados para o Repair Agent para reparação adicional. Entre os candidatos que passam a validação, o Selection Agent escolhe a implementação final considerando os resultados de otimização, o tempo de execução e o grau de tensorização.

A ideia-chave é partilhar a compreensão do algoritmo de origem, permitindo ao mesmo tempo implementações GPU diversificadas.

## A retroalimentação de execução faz convergir o processo de conversão

A tradução numa única passagem comprime a compreensão semântica, a adaptação à plataforma e o desenho da tensorização num único passo de geração. Um erro em qualquer uma destas áreas pode só revelar-se quando o programa corre efetivamente, sem mecanismo para diagnóstico e reparação posteriores.

A EvoCoCo inclui a execução no processo de conversão. Os programas candidatos correm no ambiente-alvo; os problemas de interfaces, formas de tensores, comportamento numérico e atualizações de estado tornam-se retroalimentação concreta para reparar os candidatos. Os múltiplos ramos de tensorização oferecem também caminhos de implementação alternativos. A geração de código torna-se um ciclo fechado de geração, execução, reparação e seleção.

![Resultados por fase de conversão](./figS1_stage_wise.png)

*Figura 2. Resultados por fase ao longo de 240 tentativas de conversão independentes por condição. Nas três comparações com o mesmo modelo, as falhas de execução representaram 62.9%–73.8% das tentativas de tradução numa única passagem, contra 6.7%–17.5% para a EvoCoCo. Mais candidatos puderam avançar para a avaliação de otimização.*

Esta alteração no local onde ocorrem as falhas mostra que o ciclo de retroalimentação faz mais do que corrigir erros: deixa o ambiente-alvo ajudar a determinar que implementações tensorizadas são realmente utilizáveis. Muitas traduções numa única passagem ficam pelo estágio de execução. A EvoCoCo obtém informação de diagnóstico através da execução real e, depois, repara e filtra candidatos para que mais implementações possam avançar para a avaliação do seu comportamento de otimização.

## A execução bem-sucedida é apenas o primeiro passo da migração

As experiências da EvoCoCo respondem a três perguntas: se a conversão automática pode ser concluída de forma fiável, se os algoritmos convertidos mantêm um desempenho de otimização aceitável e se a tensorização consegue libertar o paralelismo das GPUs. A avaliação abrange a fiabilidade da migração, a fidelidade de otimização e a escalabilidade computacional.

### 1. Fiabilidade da migração

Nas comparações com o mesmo modelo, cada condição incluiu 240 tentativas de conversão independentes. A EvoCoCo com Gemini 3 Flash alcançou uma taxa de aprovação de execução de 93.33% e uma taxa de aprovação de convergência de 78.75%. Para cada um dos 48 algoritmos de referência, a EvoCoCo produziu pelo menos uma implementação que passou a validação de convergência. A taxa de aprovação de convergência foi 52.08 pontos percentuais superior à da tradução numa única passagem com o mesmo modelo, e 17.08 pontos percentuais superior à do GLM-5.1, a melhor condição entre todas as traduções numa única passagem.

![Taxas de aprovação de convergência](./fig3_reliability.png)

*Figura 3. A EvoCoCo melhorou a taxa de aprovação de convergência face à tradução numa única passagem nas três comparações com o mesmo modelo. A linha tracejada representa o GLM-5.1, a referência mais forte de tradução numa única passagem.*

### 2. Fidelidade de otimização

Os algoritmos evolutivos são estocásticos, pelo que a comparação elemento a elemento do resultado de uma única execução não pode estabelecer se a conversão preserva o comportamento de otimização. A avaliação usou execuções repetidas e independentes para comparar os valores finais de distância geracional invertida (IGD) das implementações PlatEMO e EvoX em configurações idênticas do problema. As suites DTLZ, WFG, LSMOP e MaF forneceram 1,904 comparações válidas, das quais 1,680 cumpriram o critério de fidelidade predefinido, dando uma cobertura global de 88.2%. A cobertura ultrapassou 80% nas quatro suites, atingindo 96.5% na WFG. Dos 48 algoritmos, 41 alcançaram uma cobertura ao nível do algoritmo de pelo menos 80%.

![Cobertura de fidelidade de otimização](./fig4_fidelity_coverage.png)

*Figura 4. Cobertura de fidelidade de otimização para 48 algoritmos tensorizados. No total, 41 algoritmos atingiram o limiar de 80%.*

### 3. Escalabilidade computacional

Em todas as comparações CPU–GPU válidas, a aceleração mediana foi de 22.6× ao escalonar o tamanho da população e de 80.2× ao escalonar a dimensionalidade das variáveis de decisão. À medida que o tamanho dos problemas aumentava, as implementações em GPU ganharam em geral uma vantagem de execução ainda maior.

| Eixo de escalonamento | Comparações válidas | Aceleração mediana | Média geométrica | Amplitude interquartil |
| --- | --- | --- | --- | --- |
| Tamanho da população | 289 | 22.6× | 29.9× | 4.5–163.5× |
| Dimensionalidade das variáveis de decisão | 276 | 80.2× | 71.5× | 8.4–404.9× |

As acelerações variam bastante entre algoritmos, mas a tendência global é clara: à medida que o tamanho da população ou a dimensionalidade das variáveis de decisão aumentam, a tensorização guiada pela semântica liberta progressivamente o paralelismo ao nível da população que permanecia oculto nas estruturas de programas para CPU. As curvas de tempo de execução de algoritmos representativos ilustram ainda mais esta vantagem de escalabilidade.

![Curvas de escalabilidade do tempo de execução](./fig6_runtime_scaling.png)

*Figura 5. Os painéis (a) e (b) mostram o escalonamento do tamanho da população; os painéis (c) e (d), o da dimensionalidade das variáveis de decisão. As anotações indicam as acelerações nas maiores escalas testadas. O MOEA/D-DE atingiu 37,339× com N = 16,384.*

Para além das três avaliações centrais, ablações de componentes e a conversão a partir de fontes externas testaram ainda mais os mecanismos-chave da EvoCoCo. Num subconjunto de diagnóstico de 12 algoritmos, a arquitetura EvoCoCo completa alcançou taxas de aprovação de execução e de convergência de 98.3% e 83.3%, respetivamente. Remover o Repair Agent reduziu estas taxas para 60.0% e 41.7%; usar um único ramo de geração baixou-as para 68.3% e 40.0%. Estes resultados mostram que a retroalimentação de execução e a geração multiramo são especialmente importantes para a fiabilidade da migração. Em 10 implementações externas e legadas de MATLAB/Octave fora do PlatEMO, a EvoCoCo alcançou uma taxa de aprovação de execução de 96% e de convergência de 62%. Nove algoritmos obtiveram pelo menos uma implementação que passou a validação de convergência. Os resultados correspondentes da tradução numa única passagem foram 34%, 18% e 2 algoritmos. Isto indica que o processo faseado de tensorização automática consegue acomodar diferentes fontes e estilos de código, ao passo que a eficácia de otimização continua a ser a prova mais difícil.

## O código pode mudar; o algoritmo não

Passar de MATLAB para PyTorch e de CPU para GPU muda a linguagem, as estruturas de dados e a estratégia de execução. Os mecanismos nucleares do algoritmo devem permanecer intactos.

A EvoCoCo é também significativa pela forma como reformula a conversão de código. Desloca o foco de reproduzir instruções para identificar o que deve ser preservado. Quando a plataforma de computação muda, uma conversão bem-sucedida não precisa de reproduzir a estrutura do programa original. Deve permitir que o cálculo seja reorganizado, desde que as relações que definem o algoritmo continuem a verificar-se.

Uma linguagem de programação é uma maneira de expressar um algoritmo, e o hardware é uma maneira de executar um cálculo. O que deve sobreviver à migração entre linguagens e hardware é a estrutura subjacente a esse cálculo.

## Código aberto e recursos da comunidade

Artigo: [https://arxiv.org/abs/2609.02387](https://arxiv.org/abs/2609.02387)

GitHub: [https://github.com/EMI-Group/evococo](https://github.com/EMI-Group/evococo)

Projeto upstream (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

Grupo QQ: 297969717

![Código QR da comunidade QQ](./qq_group_qr.png)

Grupo QQ | Evolutionary Machine Intelligence

[![EvoX: computação evolutiva acelerada por GPU, PyTorch/JAX](./promo_upstream.png)](https://github.com/EMI-Group/evox)
