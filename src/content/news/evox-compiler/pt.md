---
title: "EvoX Compiler v0.1.0: inspecionar o programa antes de o executar"
pubDate: 2026-10-29
updatedDate: 2026-11-08
summary: "Grafos explícitos, transformações combináveis e etapas separadas permitem inspecionar programas candidatos e avaliá-los em conjunto."
---

Quando os candidatos de uma pesquisa são programas, depurar apenas a saída final deixa grande parte da experiência escondida. O EvoX Compiler torna o próprio programa inspecionável: pode conservar o grafo, transformá-lo e escolher um backend através de etapas distintas e visíveis.

![Camadas de grafos suspensas tornam-se uma estrutura alinhada e um artefacto vermelho compacto](./evoxc-visible-stages.webp)

*Ilustração conceptual: a estrutura do programa torna-se visível entre definição e execução.*

**EvoX Compiler (evoxc) v0.1.0** foi publicado em 29 de outubro de 2026. Este frontend e runtime Python para grafos de tensores requer Python 3.11 ou posterior e utiliza a licença Apache-2.0. [v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0)

## Da definição a um executável inspecionável

O fluxo é `trace → lower → compile → load → run`. O tracing constrói EvoXIR a partir da definição e das especificações de entrada; o lowering prepara a representação do backend; a compilação cria um artefacto, carregado num dispositivo e executado com dados. Cada etapa produz um objeto inspecionável.

Assim se distinguem grafos inválidos, operações não suportadas e incompatibilidades de dispositivo. Grafos e artefactos compatíveis podem ser guardados. Compiladores externos otimizam, escalonam e geram código; o evoxc fornece o frontend e os contratos entre etapas.

## Reunir uma população de programas num grafo

`vmap`, `grad`, `jvp` e `vjp` produzem grafos combináveis antes da execução. [`batch_functions`](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#batch-transformation--one-graph-for-a-whole-population) reúne funções candidatas com especificações de entrada e saída correspondentes num grafo populacional.

Na programação genética, pesquisa de arquiteturas e síntese de algoritmos, os candidatos podem ser programas diferentes. Agrupá-los pode reduzir compilações e chamadas repetidas, mas o benefício depende da estrutura e do backend; não é garantido.

## Escolher o backend pelas operações necessárias

NumPy é a única dependência obrigatória e oferece o interpretador CPU de referência. Adaptadores opcionais ligam IREE, XLA através de um plugin PJRT fornecido pelo utilizador e TVM através de StableHLO. A cobertura de operadores e hardware varia.

O README da versão documenta Vulkan em Mesa lavapipe, um dispositivo de software, e TVM ROCm apenas na compilação. Entradas GPU e colocação são explícitas. Verifique os operadores compatíveis antes de transferir um grafo CPU.

## Começar na CPU e depois transferir o grafo

Instale a versão fixada, execute o exemplo CPU do README, inspecione o grafo e escolha depois um backend compilado:

```bash
pip install evoxc==0.1.0
```

A integração HuggingFace instala-se separadamente como `evoxc-hf`, com distribuição e ciclo de atualização próprios.

## Ler a validação com o respetivo ambiente

Com as dependências opcionais documentadas, o README da versão indica **7 511 testes aprovados, 77 ignorados e 4 falhas esperadas**, sem falhas inesperadas, nas suites principais e de integração. As omissões incluem condições de hardware e dependências. O repositório atribui código, testes e documentação ao Genesis.

Consulte o [README da versão](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md), a [publicação](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) e o [GitHub](https://github.com/EMI-Group/evoxc) para API, artefactos e desenvolvimento posterior.

O desenvolvimento com agentes é apresentado em [Genesis e EvoX Compiler](/pt/news/genesis-evoxc). Na sua experiência, conserve um grafo de referência e inspecione cada transformação antes de comparar os backends.
