---
title: "A EvoX Genesis conclui e submete o desafio WASM Render do Terminal-Bench por 36 dólares"
pubDate: 2026-09-10
summary: "A equipa EvoX utilizou a Genesis para concluir e submeter o desafio WASM Render do Terminal-Bench Challenges, com um custo de modelo registado de 36 dólares para a execução — muito abaixo dos mais de 1.000 dólares por desafio indicados pelo Terminal-Bench. À data de publicação, a Genesis poderá ser o primeiro sistema autónomo a reportar publicamente a conclusão e a submissão de um resultado de uma Terminal-Bench Challenge."
---

![A EvoX Genesis conclui e submete o desafio WASM Render do Terminal-Bench](./evox-genesis-terminal-bench-hero.png)

A equipa EvoX utilizou a Genesis para concluir e submeter o desafio WASM Render do Terminal-Bench Challenges, com um **custo de modelo registado de 36 dólares** para a execução.

À data de publicação, **a Genesis poderá ser o primeiro sistema autónomo a reportar publicamente a conclusão e a submissão de um resultado de uma Terminal-Bench Challenge**.

## WASM Render: construir uma pilha de software WebGL completa do zero

O WASM Render pede a implementação de um renderer de software puro em JavaScript/WASM que forneça as APIs WebGL 1.0 e 2.0 a projetos Node.js. O ambiente alvo não pode depender de um browser, de uma GPU, de bindings nativos de C++ ou de bibliotecas externas.

Nos termos da especificação do desafio, a solução tem de abranger um compilador GLSL, a rasterização de triângulos e toda a superfície da API WebGL. O Terminal-Bench define o âmbito de verificação como 2.071 testes Khronos CTS, juntamente com conjuntos de regressão visual para three.js e Babylon.js. Isto descreve o objetivo de aceitação do desafio; não significa que a submissão da Genesis já tenha passado por uma avaliação oficial do Terminal-Bench.

Muitos benchmarks de agentes de programação avaliam uma única correção de um bug ou uma funcionalidade localizada. O WASM Render é diferente: o trabalho abrange um grande conjunto de módulos interdependentes, e toda a base de código tem de se manter coerente ao longo da implementação, da integração e da validação contínuas.

Tarefas deste tipo expõem os problemas centrais do desenvolvimento de longo prazo: será que as alterações locais se mantêm consistentes com a arquitetura global, será que o trabalho posterior herda corretamente as decisões iniciais e será que as evidências de validação podem orientar de forma fiável a etapa seguinte. O Terminal-Bench Challenges alarga a unidade de avaliação a um projeto de software completo precisamente para observar estas capacidades.

![Terminal-Bench Challenges comparado com tarefas de programação de horizonte mais curto](./evox-genesis-terminal-bench-comparison.jpg)

## Como a Genesis sustenta o desenvolvimento de longo prazo

A Genesis não depende de um único agente persistente nem de um contexto em crescimento contínuo para reter todo o estado de desenvolvimento. O próprio projeto de software constitui o «mundo» persistente: a versão aceite do software regista o estado atual, enquanto os caminhos do repositório definem onde um agente está situado e pelo que é responsável.

Agentes de vida limitada desdobram-se recursivamente em torno da estrutura do repositório. Dentro de âmbitos delimitados, implementam, inspecionam e validam alterações candidatas. Os resultados dos agentes começam por ser propostas; apenas o código aceite e as evidências de validação entram no histórico do projeto e ficam disponíveis para serem herdadas pelos agentes seguintes.

Para um projeto de sistemas como o WASM Render, isto permite que cada agente trate um problema focado e delimitado, enquanto o compilador, o pipeline de rendering, a gestão de estado e o trabalho de compatibilidade continuam a evoluir através de um histórico partilhado de código e validação.

A Genesis concluiu o desafio WASM Render por apenas 36 dólares, muito abaixo dos mais de 1.000 dólares por desafio indicados pelo Terminal-Bench.

Os nossos testes internos não formais também sugerem que a Genesis consegue trabalhar de forma eficaz com bases de código na ordem das 100.000 linhas. Com bases de código de um milhão de linhas ou mais temos comparativamente menos experiência, mas as nossas tentativas até agora decorreram sem problemas.

🌐 Site do projeto:

https://genesis.evox.group/

🔗 **GitHub**:

https://github.com/EMI-Group/genesis

🌐 Grupo de QQ: 297969717

![Código QR do grupo de QQ](./evox-genesis-terminal-bench-qq-qr.png)

<center><strong>Grupo de QQ｜</strong>Evolutionary Machine Intelligence</center>
