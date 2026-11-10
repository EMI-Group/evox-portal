---
title: "EvoX Genesis: Construir um Compilador C Através de Etapas Inspecionáveis e Portões de Regressão"
pubDate: 2026-08-17
updatedDate: 2026-11-10
summary: "O caso do compilador C acompanha uma implementação vazia através de etapas do compilador, diagnósticos e harnesses de teste externos, com resultados mantidos dentro do seu âmbito documentado."
---

Começar a partir de uma implementação vazia é um objetivo claro; produzir um executável que se comporte corretamente é uma condição de aceitação muito mais exigente. O caso do compilador C do Genesis pode ser examinado através das interfaces que construiu e das camadas de verificação em seu redor.

![Módulos de código-fonte montados num projeto de software em crescimento](./software-world-continuity.webp)

O [registo Evidence do compilador C](https://genesis.evox.group/evidence/c-compiler/) reporta **248.989 linhas de Rust**, **1.019 episódios de agentes arquivados**, **123,4 horas** e **44,38 US$ em custos de tokens de modelo**, utilizando DeepSeek V4 Flash. Lista 220/220 casos da c-testsuite, 32/36 casos LLVM avaliados e 2.904/2.904 testes Rust. Estes são resultados reportados pelo projeto, não uma reprodução recente para este artigo.

## Primeiro, fazer um programa percorrer todas as etapas

O compilador público, jcc, documenta uma sequência de marcos de engenharia: estabelecer o workspace, construir um esqueleto de compilação de ponta a ponta, estender a cobertura da linguagem, adicionar otimização e, em seguida, exercitar suites externas e builds de aplicações. O [roadmap](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/roadmap.md) define esses portões; deve ser lido como o registo de desenvolvimento do repositório e não como uma transcrição datada de cada episódio do Genesis.

A [arquitetura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) liga o pré-processamento, análise lexical e sintática, verificações semânticas, lowering para CIR, otimização, geração de código-máquina, montagem de objetos e linkagem. Crates separadas detêm essas etapas.

Essa estrutura cria artefactos intermédios úteis. `-E` para após o pré-processamento; `-emit-jcc-ir` expõe a CIR; `-S` emite assembly; `-c` produz um objeto. Quando um programa compilado falha, estas fronteiras estreitam a investigação antes de se alterar todo o pipeline.

## Preservar a semântica de C através da representação intermédia

A CIR é a representação SSA tipada do compilador, independente da LLVM IR. A otimização transforma CIR em CIR; o fluxo de trabalho de build de depuração documentado executa o verificador após as passagens. O [guia de testes](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/testing.md) descreve verificações para lowering, representações inválidas, reescritas, codificação de instruções e comportamento da linha de comandos.

A verificação da representação é uma camada, não uma prova de compilação correta. Uma transformação estruturalmente válida pode ainda alterar o resultado de um programa. É por isso que a estratégia de teste também compila e executa programas C e compara o seu output.

O corpus inclui falhas de compilação deliberadas: os testes verificam a severidade do diagnóstico, a mensagem e o span da origem. Isto preserva o comportamento de rejeição para inputs inválidos a par do comportamento de execução bem-sucedida. O [documento de conformidade C11](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/c11-compliance.md) do compilador regista os construtos suportados e a política de extensões.

## Suites externas testam o caminho completo

O [harness da c-testsuite](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/c-testsuite/run.py) fornece um portão externo de testes de linguagem. O [executor LLVM](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/llvm-suite/run.py) gere o CMake com o compilador em teste, constrói programas e compara a execução com o output de referência. A sua comparação numérica predefinida utiliza uma tolerância de 1e-4, enquanto os tokens não numéricos e o estado de saída devem coincidir exatamente.

O [harness Csmith](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/tools/csmith/run.py) adiciona testes diferenciais de programas gerados contra um compilador de referência. No snapshot do README inspecionado, a sua execução de 100 seeds reporta **93 sucessos, 0 falhas e 7 saltos**, sendo os saltos atribuídos a timeouts em ambos os compiladores. Chamar a isto "93/93" sem as seeds saltadas ocultaria parte da carga de trabalho.

Estas verificações detetam diferentes classes de erro: uma suite de linguagem sonda construtos especificados, programas aleatórios exploram combinações e builds de aplicações linkadas exercitam o driver, ficheiros de objetos e interfaces de runtime em conjunto.

## Manter o sucesso vinculado à operação testada

O [README versionado](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/README.md#validation) reporta o lz4 a ser construído e a passar nos seus oito testes essenciais. Descreve o SQLite como sendo analisado e convertido (lowering) de forma limpa, com trabalho adicional de verificação de ficheiros completos registado. Analisar o SQLite é um marco de integração útil; não é o mesmo que passar na suite completa de testes de runtime do SQLite.

A mesma fonte lista aritmética de `long double` parcial, plataformas adiadas e portões documentados de política de extensões. O resultado de 32/36 da LLVM deve, portanto, reter o seu subconjunto avaliado e exclusões. O README e a página Evidence também têm contagens de testes de workspace diferentes; este artigo mantém o total de Evidence associado ao seu registo em vez de combinar snapshots.

## O que persiste entre tarefas de desenvolvimento

O [modelo de desenvolvimento documentado](https://genesis.evox.group/getting-started/) do Genesis utiliza a decomposição recursiva de tarefas em torno de um projeto de software. Neste caso, os artefactos de engenharia duradouros são concretos: módulos de origem, contratos de representação, outputs intermédios, diagnósticos e harnesses de regressão. Uma tarefa posterior pode trabalhar com base nesses artefactos em vez de depender apenas da conversação de um antecessor.

O [caso de continuação de modelo](/news/genesis-compiler-continuation) examina uma entrega posterior e o seu resultado de 1.820 casos com âmbito separado. A [reescrita MESA](/news/genesis-mesa) utiliza o comportamento numérico original como referência, enquanto o [EvoX Compiler](/news/genesis-evoxc) verifica grafos de tensores e contratos de dispositivos. Esses são problemas de verificação distintos e não execuções adicionais da mesma experiência de compilador.

44,38 US$ cobrem tokens de modelo e excluem hardware. Os registos públicos sustentam um caso substancial de construção de compilador dentro do seu âmbito reportado; não estabelecem uma compatibilidade C irrestrita. Para inspecionar o resultado, siga a [arquitetura](https://github.com/EMI-Group/genesis-demo-jcc/blob/a8c116ec7ed3d59479ad3be8fed3e63384f50a87/docs/architecture.md) até um harness externo e, em seguida, examine os programas e outputs exatos que definem o seu portão.
