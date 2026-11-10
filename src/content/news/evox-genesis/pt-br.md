---
title: "EvoX Genesis: Construindo um Compilador C Através de Estágios Inspecionáveis e Gates de Regressão"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "O caso do compilador C acompanha uma implementação do zero através de estágios de compilação, diagnósticos e harnesses de teste externos, com resultados mantidos dentro de seu escopo documentado."
---

Partir de uma implementação vazia é um objetivo claro; produzir um executável que se comporte corretamente é uma condição de aceitação muito mais exigente. O caso do compilador C do Genesis pode ser examinado através das interfaces que ele construiu e das camadas de verificação ao seu redor.

![Módulos de código-fonte montados em um projeto de software em crescimento](./software-world-continuity.webp)

O [registro de Evidence do Compilador C](https://genesis.evox.group/evidence/c-compiler/) relata **248.989 linhas de Rust**, **1.019 episódios de agente arquivados**, **123,4 horas** e **US$ 44,38 em custos de tokens de modelo**, utilizando DeepSeek V4 Flash. Ele lista 220/220 casos do c-testsuite, 32/36 casos de LLVM avaliados e 2.904/2.904 testes de Rust. Estes são resultados relatados pelo projeto, não uma reprodução recente para este artigo.

## Primeiro, faça um programa percorrer todos os estágios

O compilador público, jcc, documenta uma sequência de marcos de engenharia: estabelecer o workspace, construir um esqueleto de compilação de ponta a ponta, estender a cobertura da linguagem, adicionar otimização e, então, exercitar suítes externas e builds de aplicações. O [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) define esses gates; ele deve ser lido como o registro de desenvolvimento do repositório, em vez de uma transcrição com data e hora de cada episódio do Genesis.

A [arquitetura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) conecta pré-processamento, análise léxica e sintática, verificações semânticas, lowering para CIR, otimização, geração de código de máquina, montagem de objetos e linkagem. Crates separadas são proprietárias desses estágios.

Essa estrutura cria artefatos intermediários úteis. `-E` interrompe após o pré-processamento; `-emit-jcc-ir` expõe a CIR; `-S` emite assembly; `-c` produz um objeto. Quando um programa compilado falha, esses limites estreitam a investigação antes de alterar todo o pipeline.

## Preserve a semântica de C através da representação intermediária

A CIR é a representação SSA tipada do compilador, separada da LLVM IR. A otimização transforma CIR em CIR; o fluxo de trabalho de build de depuração documentado executa o verificador após as passagens. O [guia de testes](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descreve verificações para lowering, representações inválidas, reescritas, codificação de instruções e comportamento de linha de comando.

A verificação da representação é uma camada, não uma prova de compilação correta. Uma transformação estruturalmente válida ainda pode alterar o resultado de um programa. É por isso que a estratégia de teste também compila e executa programas C e compara sua saída.

O corpus inclui falhas de compilação deliberadas: os testes verificam a severidade do diagnóstico, a mensagem e o span do código-fonte. Isso preserva o comportamento de rejeição para entradas inválidas juntamente com o comportamento de execução bem-sucedida. O [documento de conformidade C11](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) do compilador registra as construções suportadas e a política de extensões.

## Suítes externas testam o caminho completo

O [harness do c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) fornece um gate externo de teste de linguagem. O [executor de LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) aciona o CMake com o compilador sob teste, constrói programas e compara a execução com a saída de referência. Sua comparação numérica padrão usa uma tolerância de 1e-4, enquanto tokens não numéricos e o status de saída devem corresponder exatamente.

O [harness do Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) adiciona testes diferenciais de programas gerados contra um compilador de referência. No snapshot do README inspecionado, sua execução de 100 seeds relata **93 sucessos, 0 falhas e 7 pulos**, com os pulos atribuídos ao timeout de ambos os compiladores. Chamar isso de “93/93” sem as seeds puladas ocultaria parte da carga de trabalho.

Essas verificações detectam diferentes classes de erro: uma suíte de linguagem sonda construções especificadas, programas aleatórios exploram combinações e builds de aplicações linkadas exercitam o driver, arquivos de objeto e interfaces de runtime em conjunto.

## Mantenha o sucesso vinculado à operação testada

O [README versionado](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) relata o lz4 sendo construído e passando em seus oito testes essenciais. Ele descreve o SQLite como sendo analisado e convertido (lowering) de forma limpa, com trabalhos adicionais de verificação de arquivo completo registrados. Analisar o SQLite é um marco de integração útil; não é o mesmo que passar na suíte completa de testes de runtime do SQLite.

A mesma fonte lista aritmética de `long double` parcial, plataformas adiadas e gates de política de extensão documentados. O resultado de 32/36 da LLVM deve, portanto, manter seu subconjunto avaliado e exclusões. O README e a página de Evidence também possuem contagens de testes de workspace diferentes; este artigo mantém o total de Evidence anexado ao seu registro em vez de combinar snapshots.

## O que persiste entre as tarefas de desenvolvimento

O [modelo de desenvolvimento documentado](https://genesis.evox.group/getting-started/) do Genesis utiliza decomposição recursiva de tarefas em torno de um projeto de software. Neste caso, os artefatos de engenharia duráveis são concretos: módulos de origem, contratos de representação, saídas intermediárias, diagnósticos e harnesses de regressão. Uma tarefa posterior pode trabalhar sobre esses artefatos em vez de depender apenas da conversa de um predecessor.

O [caso de continuação de modelo](/news/genesis-compiler-continuation) examina uma transferência posterior e seu resultado de 1.820 casos com escopo separado. A [reescrita do MESA](/news/genesis-mesa) usa o comportamento numérico original como referência, enquanto o [EvoX Compiler](/news/genesis-evoxc) verifica grafos de tensores e contratos de dispositivos. Esses são problemas de verificação distintos, em vez de execuções adicionais do mesmo experimento de compilador.

US$ 44,38 cobrem tokens de modelo e excluem hardware. Os registros públicos sustentam um caso substancial de construção de compilador dentro de seu escopo relatado; eles não estabelecem compatibilidade irrestrita com C. Para inspecionar o resultado, siga a [arquitetura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) até um harness externo e, em seguida, examine os programas e saídas exatos que definem seu gate.
