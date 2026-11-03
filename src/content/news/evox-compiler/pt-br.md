---
title: "EvoX Compiler v0.1.0: grafos tensoriais explícitos e vários backends"
pubDate: 2026-10-29
summary: "A primeira versão do EvoX Compiler traz ao Python grafos inspecionáveis, transformações combináveis e caminhos NumPy, IREE, XLA e TVM."
---

**O EvoX Compiler (evoxc) v0.1.0 foi lançado em 29 de outubro de 2026.** É um compilador e runtime Python para grafos tensoriais, destinado a desenvolvedores que desejam inspecionar, transformar, salvar e executar o próprio programa. Tem licença Apache-2.0 e requer Python 3.11 ou posterior.

## Um programa que pode inspecionar

O evoxc expõe cada etapa por meio de `trace → lower → compile → load → run`. O frontend representa os cálculos em EvoXIR e exporta StableHLO para compiladores externos, que otimizam e geram código. Os grafos e artefatos intermediários ficam disponíveis para inspeção e persistência.

As transformações incluem `vmap`, `grad`, `jvp` e `vjp`. Na busca de arquiteturas neurais, programação genética e síntese de algoritmos, `batch_functions` combina candidatos com especificações de entrada/saída correspondentes em um grafo. O cache explícito de compilação ajuda tarefas que geram programas estáticos repetidamente.

## Quatro caminhos de execução

NumPy é a única dependência obrigatória e fornece o interpretador CPU padrão. Adaptadores opcionais conectam o grafo a IREE, XLA por um plugin PJRT fornecido pelo usuário e TVM. Backend e dispositivo são escolhas explícitas; a cobertura depende do adaptador. A versão documenta Vulkan em Mesa lavapipe e ROCm no TVM apenas na compilação.

O README relata **7,511 testes aprovados, 77 ignorados, 4 falhas esperadas e 0 falhas** nas suítes do núcleo e de `evoxc_hf`, com IREE, TVM e torch instalados. São resultados do projeto para essa configuração. O repositório atribui ao EvoX Genesis a produção do código, testes e documentação.

## Começar

Instale esta versão com o comando abaixo. Os adaptadores opcionais estão documentados no README da versão; a integração HuggingFace é distribuída separadamente como `evoxc-hf`.

```bash
pip install evoxc==0.1.0
```

[GitHub Release v0.1.0](https://github.com/EMI-Group/evoxc/releases/tag/v0.1.0) · [README v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md) · [GitHub](https://github.com/EMI-Group/evoxc)
