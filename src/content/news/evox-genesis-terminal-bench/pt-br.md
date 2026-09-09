---
title: "A EvoX Genesis conclui e envia o desafio WASM Render do Terminal-Bench por 36 dólares"
pubDate: 2026-09-10
summary: "A equipe EvoX utilizou a Genesis para concluir e enviar o desafio WASM Render do Terminal-Bench Challenges, com um custo de modelo registrado de 36 dólares para a execução — bem abaixo dos mais de 1.000 dólares por desafio declarados pelo Terminal-Bench. Até a data de publicação, a Genesis pode ser o primeiro sistema autônomo a relatar publicamente a conclusão e o envio de um resultado de uma Terminal-Bench Challenge."
---

![A EvoX Genesis conclui e envia o desafio WASM Render do Terminal-Bench](./evox-genesis-terminal-bench-hero.png)

A equipe EvoX utilizou a Genesis para concluir e enviar o desafio WASM Render do Terminal-Bench Challenges, com um **custo de modelo registrado de 36 dólares** para a execução.

Até a data de publicação, **a Genesis pode ser o primeiro sistema autônomo a relatar publicamente a conclusão e o envio de um resultado de uma Terminal-Bench Challenge**.

## WASM Render: construir uma pilha de software WebGL completa do zero

O WASM Render pede a implementação de um renderizador de software puro em JavaScript/WASM que forneça as APIs WebGL 1.0 e 2.0 a projetos Node.js. O ambiente-alvo não pode depender de navegador, GPU, bindings nativos de C++ ou bibliotecas externas.

Conforme a especificação do desafio, a solução deve abranger um compilador GLSL, a rasterização de triângulos e toda a superfície da API WebGL. O Terminal-Bench define o escopo de verificação como 2.071 testes Khronos CTS, junto com conjuntos de regressão visual para three.js e Babylon.js. Isso descreve o objetivo de aceitação do desafio; não significa que a submissão da Genesis já tenha passado por uma avaliação oficial do Terminal-Bench.

Muitos benchmarks de agentes de programação avaliam uma única correção de bug ou uma funcionalidade localizada. O WASM Render é diferente: o trabalho abrange um grande conjunto de módulos interdependentes, e toda a base de código precisa permanecer coerente ao longo da implementação, da integração e da validação contínuas.

Tarefas desse tipo expõem os problemas centrais do desenvolvimento de longo prazo: as mudanças locais permanecem consistentes com a arquitetura geral, o trabalho posterior herda corretamente as decisões iniciais e as evidências de validação podem orientar de forma confiável a próxima etapa. O Terminal-Bench Challenges amplia a unidade de avaliação para um projeto de software completo justamente para observar essas capacidades.

![Terminal-Bench Challenges comparado com tarefas de programação de prazo mais curto](./evox-genesis-terminal-bench-comparison.jpg)

## Como a Genesis sustenta o desenvolvimento de longo prazo

A Genesis não depende de um único agente persistente nem de um contexto em crescimento contínuo para reter todo o estado de desenvolvimento. O próprio projeto de software constitui o «mundo» persistente: a versão aceita do software registra o estado atual, enquanto os caminhos do repositório definem onde um agente está situado e pelo que é responsável.

Agentes de vida limitada se desdobram recursivamente em torno da estrutura do repositório. Dentro de escopos delimitados, implementam, inspecionam e validam mudanças candidatas. Os resultados dos agentes começam como propostas; apenas o código aceito e as evidências de validação entram no histórico do projeto e ficam disponíveis para serem herdadas pelos agentes seguintes.

Para um projeto de sistemas como o WASM Render, isso permite que cada agente trate de um problema focado e delimitado, enquanto o compilador, o pipeline de renderização, o gerenciamento de estado e o trabalho de compatibilidade continuam a evoluir por meio de um histórico compartilhado de código e validação.

A Genesis concluiu o desafio WASM Render por apenas 36 dólares, bem abaixo dos mais de 1.000 dólares por desafio declarados pelo Terminal-Bench.

Nossos testes internos não formais também sugerem que a Genesis consegue trabalhar de forma eficaz com bases de código na casa das 100.000 linhas. Com bases de código de um milhão de linhas ou mais temos comparativamente menos experiência, mas nossas tentativas até agora correram sem problemas.

🌐 Site do projeto:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 Grupo de QQ: 297969717

![Código QR do grupo de QQ](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>Grupo de QQ｜</strong>Evolutionary Machine Intelligence</center>
