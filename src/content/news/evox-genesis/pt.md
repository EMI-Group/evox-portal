---
title: "EvoX Genesis: Um Sistema de IA Evolutivo Recursivo Que Construiu do Zero um Compilador de C com 250 Mil Linhas"
pubDate: 2026-08-17
summary: "A equipa EvoX do Departamento de Ciência de Dados e Inteligência Artificial da Universidade Politécnica de Hong Kong lançou o EvoX Genesis, um sistema de IA evolutivo recursivo. Em vez de depender de um agente persistente para sustentar o desenvolvimento de longo prazo, deixa o próprio mundo do software continuar a evoluir: partindo de um repositório vazio, o sistema construiu um compilador de C com 248 989 linhas em 123,4 horas, com um custo total em tokens do modelo de apenas 44,38 dólares."
---

# EvoX Genesis: Um Sistema de IA Evolutivo Recursivo Que Construiu do Zero um Compilador de C com 250 Mil Linhas

![image1.png](./evox-genesis-1.png)

A equipa EvoX do Departamento de Ciência de Dados e Inteligência Artificial da Universidade Politécnica de Hong Kong lançou o **EvoX Genesis**, um sistema de IA evolutivo recursivo.

O EvoX Genesis já não depende de um agente persistente para sustentar o desenvolvimento de longo prazo. Em vez disso, deixa o próprio mundo do software continuar a evoluir.

Partindo de um repositório vazio, o sistema construiu um **compilador de C com 248 989 linhas** em 123,4 horas, ao longo de 1 019 episódios de agente, com um custo em tokens do modelo de apenas **44,38 dólares**.

## Programação de Longo Prazo: A Fronteira Continua a Deslocar-se

O tempo de trabalho dos agentes de programação cresceu de tarefas curtas e pontuais para dezenas de horas.

A OpenAI executou o Codex a partir de um repositório vazio durante cerca de 25 horas seguidas, produzindo aproximadamente 30 mil linhas de código.

A Anthropic usou 16 agentes Claude, ao longo de quase 2 000 sessões, cerca de duas semanas e quase 20 000 dólares em custos de API, para construir do zero um compilador de C com cerca de 100 mil linhas.

O tempo continua a aumentar, os agentes continuam a multiplicar-se e o software continua a tornar-se mais complexo.

Mas o centro da investigação continua a ser o agente:

modelos mais fortes, contextos mais longos, memória mais persistente, mais agentes.

**A equipa EvoX virou a questão para outra direção:**

**Porque é que o agente tem de persistir?**

E se o que verdadeiramente precisa de persistir for o mundo do software em que ele vive?

## 123,4 Horas, 250 Mil Linhas

Deixámos o EvoX Genesis começar a partir de um repositório com uma implementação vazia.

Havia apenas um objetivo: construir um compilador de C.

123,4 horas, 1 019 episódios de agente, **248 989 linhas de código** e um custo em tokens do modelo de apenas **44,38 dólares**.

O compilador final passou 220/220 testes do c-testsuite, 32/36 casos de teste do LLVM e 93/93 testes de programas aleatórios do Csmith.

Não havia ali nenhum compilador existente à espera de ser completado — **começou do zero.**

![image2.png](./evox-genesis-2.png)

_Figura 1: Resultados da experiência com o compilador de C / dimensão do código, tempo de execução, episódios de agente, custo e resultados dos testes_

_(a utilizar o modelo DeepSeek V4 Flash)_

## Não Mantenha o Agente Vivo — Mantenha Vivo o Mundo do Software

A vida do software complexo é naturalmente mais longa do que uma única sessão de agente.

O EvoX Genesis organiza o software num mundo de software que se desdobra recursivamente:

os agentes de nível superior decompõem os objetivos, e novos agentes completam o trabalho em posições locais;

assim que os resultados são verificados, entram no histórico de versões do software e tornam-se a realidade para a próxima ronda de desenvolvimento.

Depois, os agentes podem desaparecer,

e novos agentes continuam a partir do mundo do software que já tomou forma.

O que persiste não é uma conversa, não é um rascunho em crescimento contínuo, nem um "agente mestre" sempre ligado.

O que persiste é o código, a estrutura, as restrições, os resultados da verificação e o histórico que já aconteceu.

**O que persiste não é o agente, é o mundo do software.**

**O agente não persiste. As suas consequências validadas persistem.**

Esta é a evolução autónoma recursiva do EvoX Genesis. Para os utilizadores, isto significa também algo muito simples:

**Não constrói agentes — apenas descreve aquilo que quer que o software venha a ser.**

Não é necessário pré-desenhar agentes, papéis ou fluxos de trabalho, nem decompor manualmente uma árvore completa de tarefas.

O utilizador apenas tem de descrever o objetivo de desenvolvimento do software num breve texto;

a forma como as tarefas são decompostas, como os agentes são gerados, como a recursão se desdobra e como os resultados são verificados — tudo isto é feito pelo próprio EvoX Genesis.

![image3.png](./evox-genesis-3.png)

_Figura 2: O conceito de Persistent Recursive World / os agentes nascem, atuam e desaparecem; o mundo do software continua a desdobrar-se_

## Os Modelos Podem Ser Substituídos; o Mundo do Software Continua

Esta continuidade nem sequer exige a utilização do mesmo modelo do início ao fim.

Noutra série de experiências, um mundo de software inicialmente construído pelo GLM 5.2 foi entregue ao DeepSeek V4 Flash para continuar o desenvolvimento.

No final, passou 1 820/1 820 dos testes LLVM SingleSource mantidos.

Os modelos podem ser substituídos, os agentes podem ser substituídos — o mundo do software continua.

![image4.png](./evox-genesis-4.png)

_Figura 3: A experiência de continuação entre modelos, GLM 5.2 → DeepSeek V4 Flash_

## Do Zero, ou Herdando o Histórico

Construir do zero é apenas uma das pontas do ciclo de vida do software;

a outra ponta é um mundo de software que existe há anos, rico em estrutura e histórico.

Aplicámos o EvoX Genesis ao MESA — um sistema de computação científica de longa data para a evolução estelar.

A experiência envolveu 13 módulos em Fortran, num total de **139 414 linhas**;

o EvoX Genesis refactorizou-os nos crates em Rust correspondentes, com um custo em tokens do modelo de cerca de **10,6 dólares**.

Um mundo de software pode ser criado do nada, ou pode herdar o histórico e continuar a mudar.

![image5.png](./evox-genesis-5.png)

_Figura 4: MESA Fortran → Rust, 13 módulos, 139 414 linhas de código, 10,6 dólares_

## As Vantagens de Custo Composto-se ao Longo do Tempo

O desenvolvimento de software de longo prazo não significa que os custos cresçam linearmente.

No EvoX Genesis, o código verificado, a estrutura e o histórico de desenvolvimento acumulam-se continuamente e tornam-se o alicerce para a próxima ronda de trabalho. Os agentes subsequentes não precisam de voltar a compreender todo o projeto do zero; grande parte da informação já existente pode ser diretamente colocada em cache e reutilizada, com uma taxa de acertos de cache de até 97,4%.

À medida que o sistema continua a funcionar, o estado de desenvolvimento reutilizável torna-se mais rico, a computação redundante diminui e o custo unitário do desenvolvimento efetivamente desce ao longo do tempo.

Isto é juro composto de engenharia que se acumula ao longo do tempo.

## O EvoX Genesis É Agora de Código Aberto

O projeto é de código aberto, com pacotes de instalação disponíveis para Windows, macOS e Linux.

🌐 Website:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

↓ **Transferências**:

**https://github.com/EMI-Group/genesis/releases**

**▤ Artigo:**

**https://arxiv.org/abs/2608.10450**

🌐 Grupo de QQ: 297969717

![image6.png](./evox-genesis-6.png)

**Os agentes partem; o mundo do software continua a evoluir**

**EvoX Genesis**

Referências:

OpenAI, *Run long horizon tasks with Codex* (2026).

Anthropic, *Building a C compiler with a team of parallel Claudes* (2026).
