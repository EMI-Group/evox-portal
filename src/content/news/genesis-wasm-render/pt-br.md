---
title: "EvoX Genesis conclui WASM Render em cerca de dois dias por 36 dólares"
pubDate: 2026-10-14
summary: "Com o DeepSeek V4 Flash, o EvoX Genesis concluiu WASM Render em cerca de dois dias, com um custo de uso do modelo de apenas 36 dólares, tornando-se o primeiro sistema de IA do mundo a enviar um resultado para este desafio. Os registros de testes da equipe mostram que passou em 2,017/2,019 testes do Khronos CTS (99.90%), incluindo todos os testes de conformidade WebGL2.0 executados: 1,184/1,184."
---

A capacidade de sustentar o trabalho em tarefas de longa duração e, ao final, entregar um projeto de engenharia completo está se tornando uma medida importante das capacidades da IA. O Terminal-Bench é uma referência na avaliação de agentes de IA, com foco em tarefas de programação e de linha de comando em ambientes de terminal. O Terminal-Bench Challenges leva a avaliação adiante: construir projetos de software completos do zero, com um custo oficial estimado superior a 1,000 dólares americanos por desafio.

O EvoX Genesis, o sistema de IA recursivo para a evolução de software desenvolvido pela equipe EvoX, utilizou o DeepSeek V4 Flash para concluir o desafio WASM Render em cerca de **dois dias**, gastando apenas **36 dólares americanos** no uso do modelo, tornando-se **o primeiro sistema de IA do mundo a enviar um resultado para este desafio.** Os registros de testes da equipe mostram que passou em 2,017/2,019 testes da suíte Khronos CTS (99.90%), incluindo todos os testes de conformidade WebGL2.0: 1,184/1,184.

## Do código local a um sistema completo: onde está a dificuldade?

WASM Render é um desafio de sistemas gráficos do Terminal-Bench Challenges: executar programas WebGL sem navegador, GPU ou bibliotecas externas de execução.

Isso equivale a implementar uma cadeia de processamento gráfico em software: interpretar programas de sombreamento, calcular os gráficos e manter a coerência de um grande conjunto de interfaces e mudanças de estado. Uma funcionalidade individual que funciona ainda está longe de um sistema inteiro trabalhando em conjunto. A tarefa exige que a IA se mantenha alinhada ao objetivo ao longo de várias rodadas de desenvolvimento, lide com as dependências entre módulos, corrija erros com base nos resultados dos testes e, ao final, conclua a integração do sistema e a validação de regressões.

Segundo os resultados publicados pela equipe do Terminal-Bench de um teste inicial de 12 horas, o Devin, produto de desenvolvimento de software com IA da Cognition, em conjunto com o Fable 5, atingiu uma taxa de aprovação de 20.5% nos testes de conformidade WebGL2.0, mais exigentes. Após cerca de dois dias de desenvolvimento, o Genesis elevou para 100% a taxa de aprovação dos testes de conformidade WebGL2.0 que executou.

![Resultados dos testes de conformidade WebGL2.0 e registros de testes do Khronos CTS do Genesis](./wasm-render-results-en.png)

*Resultados dos testes de conformidade WebGL2.0 e registros de testes do Khronos CTS do Genesis.*

O repositório público de resultados do Genesis contém aproximadamente **130,000 linhas de código**, abrangendo um compilador da linguagem de sombreamento GLSL, interfaces WebGL e gerenciamento de estados, rasterização por software e apresentação de imagens. Essas implementações em TypeScript são transformadas durante a compilação em um renderizador JavaScript que conecta o processamento da linguagem, o cálculo gráfico e o comportamento das interfaces.

O processo de desenvolvimento terminou com a aprovação em 2,017 testes do Khronos CTS, com um custo de tokens do modelo de cerca de 36 dólares americanos e uma taxa de acertos do cache de aproximadamente 98%. Sustentar e integrar um projeto de engenharia de software de tão grande dimensão com um custo reduzido de uso do modelo também demonstra a capacidade do Genesis de realizar desenvolvimento de longa duração com modelos de código aberto econômicos.

## Deixar o projeto continuar evoluindo e os agentes participar conforme necessário

O Genesis é um sistema de IA recursivo para a evolução de software. Os usuários descrevem um objetivo de desenvolvimento de software e o sistema desdobra as tarefas em torno desse objetivo, atribui agentes locais aos pontos onde há trabalho a realizar e conserva o código aceito e os resultados de validação no projeto de software.

Para grandes projetos, uma abordagem intuitiva é dar mais recursos aos agentes: contextos mais longos, sessões mais persistentes e uma colaboração predefinida mais elaborada. O Genesis coloca a continuidade do desenvolvimento no próprio projeto de software. Os objetivos e as restrições de nível superior orientam todo o desenvolvimento, enquanto as tarefas se desdobram recursivamente ao longo da estrutura do repositório. Os agentes cuidam do trabalho local e saem quando terminam; os agentes seguintes continuam a partir do projeto que já tomou forma.

Anteriormente, o Genesis partiu de um repositório vazio, construiu um compilador de C com aproximadamente 250,000 linhas de código e deu continuidade ao desenvolvimento entre diferentes modelos. Os resultados dos testes WASM Render validam ainda mais as capacidades de construção e integração autônomas do Genesis no desenvolvimento de sistemas gráficos complexos.

## Código aberto e comunidade

A equipe EvoX continuará desenvolvendo sistemas de IA recursivos para a evolução de software, promovendo o acúmulo de código, resultados de validação e experiência de desenvolvimento na comunidade de código aberto. Convidamos mais desenvolvedores a participar de uma evolução sustentável do software e a construir juntos um ecossistema aberto de desenvolvimento de software.

🔗 Repositório do Genesis: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Artigo do Genesis: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repositório de resultados do desafio: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Projeto de origem (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Grupo QQ: 297969717
