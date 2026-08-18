---
title: "EvoX Genesis: Um Sistema de IA Recursivo para a Evolução Autônoma de Software a Longo Prazo, que Construiu do Zero um Compilador C de 250 Mil Linhas"
pubDate: 2026-08-17
summary: "A equipe EvoX do Departamento de Ciência de Dados e Inteligência Artificial da Universidade Politécnica de Hong Kong lançou o EvoX Genesis, um sistema de IA recursivo para a evolução autônoma de software a longo prazo. Em vez de depender de um agente persistente para sustentar o desenvolvimento de longo prazo, ele deixa o próprio mundo do software continuar evoluindo: partindo de um repositório vazio, o sistema construiu um compilador C de 248.989 linhas em 123,4 horas, com um custo total de tokens do modelo de apenas US$ 44,38."
---

# EvoX Genesis: Um Sistema de IA Recursivo para a Evolução Autônoma de Software a Longo Prazo, que Construiu do Zero um Compilador C de 250 Mil Linhas

![image1.png](./evox-genesis-1.png)

A equipe EvoX do Departamento de Ciência de Dados e Inteligência Artificial da Universidade Politécnica de Hong Kong lançou o **EvoX Genesis**, um sistema de IA recursivo para a evolução autônoma de software a longo prazo.

O EvoX Genesis não depende mais de um agente persistente para sustentar o desenvolvimento de longo prazo. Em vez disso, ele deixa o próprio mundo do software continuar evoluindo.

Partindo de um repositório vazio, o sistema construiu um **compilador C de 248.989 linhas** em 123,4 horas, ao longo de 1.019 episódios de agente, com um custo de tokens do modelo de apenas **US$ 44,38**.

<center>

## Programação de Longo Prazo: A Fronteira Continua Avançando

</center>

O tempo de trabalho dos agentes de programação cresceu de tarefas curtas e pontuais para dezenas de horas.

A OpenAI rodou o Codex a partir de um repositório vazio por cerca de 25 horas seguidas, produzindo aproximadamente 30 mil linhas de código.

A Anthropic usou 16 agentes Claude, ao longo de quase 2.000 sessões, cerca de duas semanas e quase US$ 20.000 em custos de API, para construir do zero um compilador C de aproximadamente 100 mil linhas.

O tempo continua aumentando, os agentes continuam se multiplicando e o software continua ficando mais complexo.

Mas o centro das pesquisas continua sendo o agente:

modelos mais fortes, contextos mais longos, memória mais persistente, mais agentes.

**A equipe EvoX virou a pergunta para outra direção:**

**Por que o agente precisa persistir?**

E se o que realmente precisa persistir for o mundo do software em que ele vive?

<center>

## 123,4 Horas, 250 Mil Linhas

</center>

Deixamos o EvoX Genesis começar a partir de um repositório com uma implementação vazia.

Havia apenas um objetivo: construir um compilador C.

123,4 horas, 1.019 episódios de agente, **248.989 linhas de código** e um custo de tokens do modelo de apenas **US$ 44,38**.

O compilador final passou em 220/220 testes do c-testsuite, 32/36 casos de teste do LLVM e 93/93 testes de programas aleatórios do Csmith.

Não havia nenhum compilador existente esperando para ser concluído — **ele começou do zero.**

![image2.png](./evox-genesis-2.png)

<center>

_Figura 1: Resultados do experimento com o compilador C / tamanho do código, tempo de execução, episódios de agente, custo e resultados dos testes_

</center>

<center>

_(usando o modelo DeepSeek V4 Flash)_

</center>

<center>

## Não Mantenha o Agente Vivo — Mantenha Vivo o Mundo do Software

</center>

A vida de um software complexo é naturalmente mais longa do que uma única sessão de agente.

O EvoX Genesis organiza o software em um mundo de software que se desdobra recursivamente:

os agentes de nível superior decompõem os objetivos, e novos agentes concluem o trabalho em posições locais;

assim que os resultados são verificados, entram no histórico de versões do software e tornam-se a realidade para a próxima rodada de desenvolvimento.

Depois disso, os agentes podem desaparecer,

e novos agentes continuam a partir do mundo do software que já tomou forma.

O que persiste não é uma conversa, não é um rascunho em crescimento contínuo, nem um "agente mestre" sempre online.

O que persiste é o código, a estrutura, as restrições, os resultados da verificação e o histórico que já aconteceu.

**O que persiste não é o agente, é o mundo do software.**

**O agente não persiste. As suas consequências validadas persistem.**

É assim que o EvoX Genesis sustenta a evolução autônoma de software a longo prazo. Para os usuários, isso também significa algo muito simples:

**Você não constrói agentes — você apenas descreve o que quer que o software se torne.**

Não é preciso pré-projetar agentes, papéis ou fluxos de trabalho, nem decompor manualmente uma árvore completa de tarefas.

O usuário só precisa descrever o objetivo de desenvolvimento do software em um texto curto;

como as tarefas são decompostas, como os agentes são gerados, como a recursão se desdobra e como os resultados são verificados — tudo isso é feito pelo próprio EvoX Genesis.

![image3.png](./evox-genesis-3.png)

<center>

_Figura 2: O conceito de Persistent Recursive World / os agentes nascem, atuam e desaparecem; o mundo do software continua se desdobrando_

</center>

<center>

## Os Modelos Podem Ser Trocados; o Mundo do Software Continua

</center>

Essa continuidade nem sequer exige usar o mesmo modelo do início ao fim.

Em outro conjunto de experimentos, um mundo de software inicialmente construído pelo GLM 5.2 foi passado para o DeepSeek V4 Flash continuar o desenvolvimento.

No final, ele passou em 1.820/1.820 dos testes LLVM SingleSource mantidos.

Os modelos podem ser substituídos, os agentes podem ser substituídos — o mundo do software continua.

![image4.png](./evox-genesis-4.png)

<center>

_Figura 3: O experimento de continuação entre modelos, GLM 5.2 → DeepSeek V4 Flash_

</center>

<center>

## Do Zero, ou Herdando o Histórico

</center>

Construir do zero é apenas uma das pontas do ciclo de vida de um software;

a outra ponta é um mundo de software que existe há anos, rico em estrutura e histórico.

Aplicamos o EvoX Genesis ao MESA — um sistema de computação científica de longa data para evolução estelar.

O experimento envolveu 13 módulos em Fortran, totalizando **139.414 linhas**;

o EvoX Genesis os refatorou nos crates em Rust correspondentes, com um custo de tokens do modelo de cerca de **US$ 10,60**.

Um mundo de software pode ser criado do nada, ou pode herdar o histórico e continuar mudando.

![image5.png](./evox-genesis-5.png)

<center>

_Figura 4: MESA Fortran → Rust, 13 módulos, 139.414 linhas de código, US$ 10,60_

</center>

<center>

## As Vantagens de Custo se Acumulam ao Longo do Tempo

</center>

O desenvolvimento de software de longo prazo não significa que os custos cresçam linearmente.

No EvoX Genesis, o código verificado, a estrutura e o histórico de desenvolvimento ficam acumulando e se tornam a base para a próxima rodada de trabalho. Os agentes subsequentes não precisam entender todo o projeto do zero novamente; boa parte das informações já existentes pode ser colocada diretamente em cache e reaproveitada, com uma taxa de acerto de cache de até 97,4%.

À medida que o sistema continua rodando, o estado de desenvolvimento reutilizável fica mais rico, a computação redundante diminui e o custo unitário do desenvolvimento efetivamente cai ao longo do tempo.

Isso é juro composto de engenharia que se acumula com o tempo.

<center>

## O EvoX Genesis Agora É de Código Aberto

</center>

O projeto é de código aberto, com pacotes de instalação disponíveis para Windows, macOS e Linux.

🌐 Site:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Downloads**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Paper:**

**https://arxiv.org/abs/2608.10450**

🌐 Grupo do QQ: 297969717

![image6.png](./evox-genesis-6.png)

![image7.png](./evox-genesis-7.png)

<center>

**Os agentes vão embora; o mundo do software continua evoluindo**

**EvoX Genesis**

</center>

![image8.png](./evox-genesis-8.png)

<center><strong>Grupo do QQ｜</strong>Evolutionary Machine Intelligence</center>

Referências:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
