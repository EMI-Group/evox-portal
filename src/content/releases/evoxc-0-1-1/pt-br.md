---
title: "EvoX Compiler v0.1.1: menos preparação antes de executar uma população"
pubDate: 2026-10-30
summary: "A versão de 30 de outubro melhora agrupamento de programas, preparação de grafos e falhas dos backends, incluindo um bloqueio XLA."
---

Buscar programas torna a compilação parte do orçamento experimental. Se cada geração demora preparando grafos, acelerar somente o dispositivo resolve parte do problema. O [EvoX Compiler v0.1.1][s1], lançado em 30 de outubro de 2026, melhora essa preparação e corrige falhas dos backends. Seus [45 commits][s2] ampliam o pipeline explícito de v0.1.0.

![Estruturas diferentes de programas reunidas em grupos paralelos compactos](./cover.webp)

*Ilustração conceitual: organizar uma população de programas antes da compilação.*

## Agrupar programas exige um modelo de custo

`batch_functions` combina candidatos compatíveis em um grafo. A versão propaga dependências por linha no grafo interno de classes e amplia a busca geométrica de grupos usada por `bands="auto"`. Isso ajuda a identificar o trabalho dependente de cada indivíduo e as formas de agrupar candidatos.

Na programação genética, programas podem ter a mesma assinatura de entrada e operações diferentes. Um único agrupamento plano não é necessariamente o mais econômico. As bandas oferecem outra organização e a política automática compara opções pelo modelo de custo. A verificação essencial é semântica: a linha i do resultado combinado deve coincidir com a execução individual do candidato i. Os testes de regressão também são atualizados.

## Eliminar trabalho repetido na preparação

Várias mudanças atuam na CPU antes da execução: captura de posições por percurso direto de frames, remoção de verificações redundantes no lowering e rastreamento linear de usos com inferência de tipos memorizada no IR. A exportação StableHLO ganha emissão em lote de constantes, cache de textos de tipos e despacho de operações por tabela.

São melhorias em estágios diferentes. Exportar mais rápido não significa acelerar o kernel GPU. Meça tracing, transformação, lowering, compilação e execução estável separadamente. Uma população grande com muitas constantes pode ter custos diferentes de um grafo pequeno com cálculo numérico caro.

## Diagnosticar melhor falhas do backend

IREE passa a apresentar o limite HAL de bindings por despacho como um `BackendError` que permite agir. Isso distingue limites de recursos de problemas no programa numérico. XLA deixa de manter o bloqueio de clientes compartilhados durante `PJRT_Client_Create`, corrigindo um deadlock com um finalizador da mesma thread. Há um teste de regressão correspondente.

O suporte segue a matriz da versão. NumPy fornece o interpretador CPU; IREE, XLA e TVM têm dependências e dispositivos diferentes. O interpretador é uma referência útil antes do caminho compilado. O [README versionado][s3] explica essas condições e a transferência explícita.

## Atualizar com uma população representativa

Instale a base com `pip install evoxc==0.1.1`; para IREE, use `pip install "evoxc[iree]==0.1.1"`. É necessário Python 3.11 ou posterior. A distribuição separada `evoxc-hf` tem seu próprio ciclo de versões. Preserve a configuração dos plugins usados no experimento.

Parta de uma população salva e entradas fixas. Compare saídas combinadas com execuções individuais e meça preparação e execução separadamente. Se houver erro de binding, guarde grafo e detalhes do backend para diagnóstico, sem mudar silenciosamente o experimento. A [visão de v0.1.0][related] explica o pipeline; v0.1.1 torna seus estágios preparatórios e limites mais práticos.

[s1]: https://github.com/EMI-Group/evoxc/releases/tag/v0.1.1
[s2]: https://github.com/EMI-Group/evoxc/compare/v0.1.0...v0.1.1
[s3]: https://github.com/EMI-Group/evoxc/blob/v0.1.1/README.md
[related]: /pt-br/releases/evoxc-0-1-0
