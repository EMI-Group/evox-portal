---
title: "Genesis WASM Render: da geração local de código à construção de sistemas"
pubDate: 2026-10-15
updatedDate: 2026-11-08
summary: "O renderizador do Genesis estuda como interfaces, testes e alterações aceites coordenam a construção de uma cadeia gráfica completa."
---

Construir um sistema de software exige que alterações locais úteis permaneçam compatíveis à medida que o projeto cresce. O Genesis estuda este desafio com WASM Render, ligando Agentic AI no EvoX à construção de sistemas: processamento de shaders, renderização e comportamento das API devem formar um conjunto coerente.

![Placas de vidro alinham as etapas de uma cena geométrica](./software-graphics-pipeline.webp)

O registo público do Genesis descreve um renderizador TypeScript desenvolvido com DeepSeek V4 Flash. Relata 2.017/2.019 casos Khronos CTS aprovados, incluindo 1.184/1.184 casos WebGL2 no conjunto avaliado. Os cerca de 36 USD cobrem tokens do modelo, sem hardware. As 65,9 horas entre o primeiro e o último commit dos agentes são um intervalo do repositório, não uma medição do tempo ativo dos agentes.

[Genesis Evidence](https://genesis.evox.group/evidence/tbench-wasm/)

## Do código local a um sistema completo: onde está a dificuldade?

WASM Render é um desafio de sistemas gráficos do Terminal-Bench Challenges: executar programas WebGL sem navegador, GPU ou bibliotecas externas de execução.

Isto equivale a implementar uma cadeia de processamento gráfico em software: interpretar programas de sombreamento, calcular os gráficos e manter a coerência de um grande conjunto de interfaces e alterações de estado. Uma funcionalidade individual que funciona está ainda longe de um sistema inteiro a trabalhar em conjunto. A tarefa exige que a IA se mantenha alinhada com o objetivo ao longo de várias rondas de desenvolvimento, trate das dependências entre módulos, corrija erros com base nos resultados dos testes e, por fim, conclua a integração do sistema e a validação de regressões.

O ensaio anterior de 12 horas e esta execução têm orçamentos de desenvolvimento diferentes: as taxas de aprovação não formam uma classificação controlada. O arquivo Evidence também relata 16/38 casos visuais three.js no limiar rigoroso de 0,1% e 13/16 casos Babylon.js, ambos subconjuntos selecionados. A conformidade das API não demonstra compatibilidade gráfica completa.

![Resultados dos testes de conformidade WebGL2.0 e registos de testes do Khronos CTS do Genesis](./wasm-render-results-en.png)

*Resultados dos testes de conformidade WebGL2.0 e registos de testes do Khronos CTS do Genesis.*

O arquivo conta 135.165 linhas de texto versionadas, incluindo renderer.js gerado, código de terceiros, um ficheiro de bloqueio e documentação; não são apenas código-fonte do renderizador. O projeto descreve uma submissão autónoma inicial, sem uma classificação publicada pelos organizadores. Os resultados são relatados pelo projeto e não foram reproduzidos de forma independente.

O processo de desenvolvimento terminou com a aprovação em 2,017 testes do Khronos CTS, com um custo de tokens do modelo de cerca de 36 dólares americanos e uma taxa de acertos da cache de aproximadamente 98%. Manter e integrar um projeto de engenharia de software de tão grande dimensão com um custo reduzido de utilização do modelo também demonstra a capacidade do Genesis para realizar desenvolvimento de longa duração com modelos de código aberto económicos.

## Deixar o projeto continuar a evoluir e os agentes intervir conforme necessário

O Genesis é um sistema de IA recursivo para a evolução de software. Os utilizadores descrevem um objetivo de desenvolvimento de software e o sistema desdobra as tarefas em torno desse objetivo, atribui agentes locais aos pontos onde há trabalho a realizar e conserva o código aceite e os resultados de validação no projeto de software.

Perante grandes projetos, uma abordagem intuitiva é dar mais recursos aos agentes: contextos mais longos, sessões mais persistentes e uma colaboração predefinida mais elaborada. O Genesis coloca a continuidade do desenvolvimento no próprio projeto de software. Os objetivos e as restrições de nível superior orientam todo o desenvolvimento, enquanto as tarefas se desdobram recursivamente ao longo da estrutura do repositório. Os agentes tratam do trabalho local e saem quando terminam; os agentes seguintes continuam a partir do projeto que já tomou forma.

Anteriormente, o Genesis partiu de um repositório vazio, construiu um compilador de C com aproximadamente 250,000 linhas de código e deu continuidade ao desenvolvimento entre diferentes modelos. Os resultados dos testes WASM Render validam ainda mais as capacidades de construção e integração autónomas do Genesis no desenvolvimento de sistemas gráficos complexos.

## Sistemas abertos que continuam a evoluir

O valor aberto deste caso está numa construção verificável: interfaces, implementações e resultados de validação permanecem disponíveis para trabalho posterior. Avança assim a direção do EvoX para software que acumula alterações úteis entre tarefas de agentes, avaliando o progresso pelo comportamento do sistema integrado.

🔗 Repositório do Genesis: [https://github.com/EMI-Group/genesis](https://github.com/EMI-Group/genesis)

📄 Artigo do Genesis: [https://arxiv.org/abs/2608.10450](https://arxiv.org/abs/2608.10450)

✅ Repositório de resultados do desafio: [https://github.com/BillHuang2001/tbench-wasm](https://github.com/BillHuang2001/tbench-wasm)

🔼 Projeto de origem (EvoX): [https://github.com/EMI-Group/evox](https://github.com/EMI-Group/evox)

🌐 Grupo QQ: 297969717
