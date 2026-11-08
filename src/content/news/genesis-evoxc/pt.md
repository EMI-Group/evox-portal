---
title: "Genesis constrói EvoX Compiler: a IA desenvolve infraestrutura evolutiva"
pubDate: 2026-11-03
summary: "O caso EvoX Compiler liga duas capacidades do ecossistema: o Genesis desenvolve software e o compilador resultante apoia transformação e execução de programas."
updatedDate: 2026-11-08
---

A infraestrutura de IA evolutiva é, por si só, um projeto de software considerável. O caso Genesis–EvoX Compiler liga os dois níveis: um sistema de desenvolvimento agêntico constrói e amplia um compilador de grafos tensoriais, enquanto contratos de interface e testes de regressão definem as alterações integradas no desenvolvimento contínuo.

![Grafos do compilador verificados com testes de regressão](./compiler-contract-layers.webp)

## Responsabilidades explícitas

EvoX Compiler constrói e transforma EvoXIR, seguindo para lowering, compilação, carregamento e execução. Compiladores externos otimizam e geram código. NumPy é a referência; IREE, XLA e TVM são percursos opcionais. [EvoX Compiler](https://genesis.evox.group/evidence/evoxc/)

As transformações devem preservar significado, os backends suportar operadores aceites e o runtime respeitar os dispositivos. Estes critérios são mais concretos do que aumentar linhas de código.

## Organização do trabalho

O [registo de 28 de outubro de 2026](https://genesis.evox.group/evidence/evoxc/) descreve contexto por pacote, dependências unidirecionais e testes antes de avançar de camada. O repositório atribui código, testes e documentação ao Genesis.

O trabalho prosseguiu em adaptadores, grafos e benchmarks. O registo reconstrói a estrutura a partir do histórico, sem auditar cada ação dos agentes. Dois meses de calendário não equivalem a execução autónoma contínua.

## Vários níveis de validação

Com IREE foram reportados **6.789 testes aprovados, 46 omitidos e 3 falhas esperadas**, sem falhas. Sem compiladores, **6.367 aprovados**. Estes números históricos não devem ser substituídos por totais posteriores. [GW-000005](https://genesis.evox.group/evidence/evoxc/)

A integração separada `evoxc_hf` compara saídas e latências com torch/transformers. Checkpoint, precisão, backend e hardware fazem parte da comparação: concordância numérica e velocidade são propriedades distintas.

## Resultados e limites

As **285.659 linhas de texto acompanhadas** incluem testes, documentação e dados de benchmark. Cerca de **50 dólares americanos** cobrem tokens, não hardware. Modelo, episódios e tempo efetivo não foram reportados.

Vulkan utilizou Mesa lavapipe, dispositivo de software; TVM ROCm apenas compilação. Um nome de backend não prova validação completa em todos os dispositivos. Os resultados não têm reprodução independente.

## Ligar evolução do software e infraestrutura computacional

Comece pelo [README](https://github.com/EMI-Group/evoxc/blob/main/README.md) e relacione as afirmações com testes e [benchmarks de modelos arquivados](https://github.com/EMI-Group/evoxc/blob/main/bench_logs/hf_bench_results.md). Verifique percursos suportados e diferenças de desempenho ainda abertas.

Para aplicar este método, escolha uma transformação do grafo ou um percurso de backend, identifique o contrato a preservar e os testes correspondentes. Registe separadamente verificações numéricas e medições de latência. A [visão geral do EvoX Compiler](/pt/news/evox-compiler) explica a execução; este caso mostra como limites explícitos permitem rever o desenvolvimento.
