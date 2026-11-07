---
title: "EvoX Compiler v0.1.0: uma base computacional para programas em evolução"
pubDate: 2026-10-29
updatedDate: 2026-11-07
summary: "O EvoX Compiler separa representação, transformação e execução dos programas, fornecendo uma base para experimentos com populações e diferentes backends."
---

*Atualizado em 7 de novembro de 2026. Os resultados históricos mantêm a data de referência.*

A visão de IA evolutiva do EvoX exige sistemas de cálculo que aceitem candidatos em mudança, incluindo programas com estruturas diferentes. O EvoX Compiler desenvolve essa base: grafos explícitos permitem inspecionar e transformar programas antes da execução, e as interfaces de backend ligam cálculos suportados a diferentes sistemas de execução.

Um programa numérico não se resume à saída: pode ser necessário inspecionar o grafo, transformá-lo, comparar backends ou guardar um artefato compilado. O **EvoX Compiler (evoxc) v0.1.0**, publicado em 29 de outubro de 2026, torna estas etapas explícitas. É um frontend e runtime Python para grafos tensoriais, com licença Apache-2.0 e requisito Python 3.11 ou posterior.

## Da definição ao executável

O fluxo é `trace → lower → compile → load → run`. O tracing constrói EvoXIR a partir da definição e das especificações de entrada; o lowering prepara a representação do backend; a compilação cria um artefato, carregado em um dispositivo e executado com dados. Cada etapa produz um objeto inspecionável.

Assim se distinguem grafos inválidos, operações não suportadas e incompatibilidades de dispositivo. Grafos e artefatos compatíveis podem ser guardados. Compiladores externos otimizam, escalonam e geram código; o evoxc fornece o frontend e os contratos entre etapas.

## Transformações para pesquisa evolutiva

`vmap`, `grad`, `jvp` e `vjp` produzem grafos combináveis antes da execução. `batch_functions` reúne funções candidatas com especificações de entrada e saída correspondentes em um grafo populacional.

Na programação genética, pesquisa de arquiteturas e síntese de algoritmos, os candidatos podem ser programas diferentes. Agrupá-los pode reduzir compilações e chamadas repetidas, mas o benefício depende da estrutura e do backend; não é garantido.

## Escolher o percurso de execução

NumPy é a única dependência obrigatória e oferece o interpretador CPU de referência. Adaptadores opcionais ligam IREE, XLA através de um plugin PJRT fornecido pelo usuário e TVM através de StableHLO. A cobertura de operadores e hardware varia.

O README da versão documenta Vulkan em Mesa lavapipe, um dispositivo de software, e TVM ROCm apenas na compilação. Entradas GPU e colocação são explícitas. Verifique os operadores compatíveis antes de transferir um grafo CPU.

## Começar pela referência

Instale a versão fixada, execute o exemplo CPU do README, inspecione o grafo e escolha depois um backend compilado:

```bash
pip install evoxc==0.1.0
```

A integração HuggingFace é o pacote separado `evoxc-hf`. Não confunda este compilador e as suas versões com o pacote de otimização EvoX.

## Validação na base computacional

O README reporta **7.511 testes aprovados, 77 omitidos e 4 falhas esperadas**, sem falhas, no ambiente documentado das suites principais e de integração. Isto não valida todo o hardware. O repositório atribui ao Genesis código, testes e documentação.

Consulte o [README da versão](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), a [publicação](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) e o [GitHub](https://github.com/EMI-Group/evoxc) para API, artefatos e desenvolvimento posterior.
