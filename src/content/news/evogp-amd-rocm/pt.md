---
title: "EvoGP: buscar programas em árvore em GPUs AMD"
pubDate: 2026-06-18
updatedDate: 2026-11-17
summary: "ROCm conecta a extensão PyTorch do EvoGP ao hardware AMD com compilação por backend e correção das pilhas privadas dos interpretadores."
---

Quem usa uma GPU AMD pode explorar a programação genética em árvore do EvoGP sem manter outro mecanismo de busca. A [PR #12][s2], integrada em 17 de junho de 2026 UTC (18 de junho em Pequim), abre esse caminho por ROCm/HIP. A mudança envolve compilar a extensão e preservar o significado dos programas durante a execução.

![As mesmas árvores de programas acima de aceleradores diferentes](./rocm-backend.webp)

*Ilustração conceptual: a mesma representação atravessa fronteiras de backends GPU.*

## Uma base de código para CUDA e ROCm

A integração de junho usa a conversão HIP do PyTorch durante a construção para compilar extensões CUDA em AMD. As opções são escolhidas por backend e um cabeçalho exclusivo de CUDA é protegido. Com PyTorch ROCm, não é necessário manter outros algoritmos.

A alocação dinâmica das pilhas dos interpretadores é substituída por arrays locais fixos. O contribuidor associou erros AMD ao aliasing de alocações entre wavefronts residentes. Pilhas separadas são importantes: usar o estado temporário de outra thread pode produzir aptidão errada e comprometer a seleção.

## Traduzir os kernels é apenas parte do trabalho

A conversão HIP do PyTorch traduz fontes CUDA, mas os argumentos ainda chegam ao compilador do dispositivo. Opções NVIDIA não podem ser simplesmente passadas ao `hipcc`. A configuração mantém a lista CUDA e usa `-O3` no ramo ROCm; um cabeçalho exclusivo de CUDA também é protegido. ROCm PyTorch oferece a conversão, enquanto o EvoGP precisa adaptar sua configuração de compilação. [Mudanças de compilação][s2]

## Preparar o ambiente correto de construção

As [instruções de código][s3] exigem ferramentas GPU, compilador C++ e PyTorch compatíveis. Para AMD, use ROCm com `hipcc` e PyTorch ROCm. A opção `--no-build-isolation` constrói a extensão usando esse ambiente instalado.

Os exemplos mantêm as strings de dispositivo `cuda` no ROCm porque essa é a interface PyTorch. `PYTORCH_ROCM_ARCH` seleciona uma arquitetura AMD específica. Trata-se de uma escolha de construção, não de reescrever árvores ou operadores evolutivos.

## Executar a mesma busca num backend verificado

O contribuidor relata testes em MI250X, W7800, RX 9070 XT e PRO V710, com sistemas e versões ROCm listados na PR. Foram usados 1 000 indivíduos, 100 gerações e semente fixa. São verificações reportadas para essas configurações, não garantias independentes do hardware.

```bash
python -m evogp.sr_test
```

Para regressão simbólica, confirme primeiro a compilação e a conclusão do pequeno teste com aptidão finita. As verificações do contribuidor incluem dispositivos wave32 e wave64 e relatam trajetórias iguais com semente fixa, não uma nova promessa geral de aceleração. Mantenha dados, população e semente ao comparar o seu hardware. A [introdução ao EvoGP][related] explica a representação; a posterior [correção dos relatórios][logging] trata de outro custo por geração.

[s2]: https://github.com/EMI-Group/evogp/pull/12
[s3]: https://github.com/EMI-Group/evogp/blob/5538d75470ee0fa444ee6bbe5ea98b2eed6e99f8/README.md
[related]: /pt/news/evogp
[logging]: /pt/news/evogp-rocm-population-execution
