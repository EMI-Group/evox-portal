---
title: "Genesis WASM Render: Corrigindo a Ordem de Validação e a Precisão de Pixels em um Renderizador WebGL"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Duas correções documentadas de WebGL2 conectam causas raiz a resultados de regressão, enquanto o registro de verificação final distingue a conformidade da API do ajuste visual."
---

Um renderizador WebGL via software deve fazer mais do que desenhar uma imagem reconhecível. Ele deve compilar shaders, manter o estado da API, validar entradas na ordem correta e preservar a precisão da imagem entre as fronteiras dos módulos. O caso do Genesis WASM Render contém dois exemplos concretos desses requisitos sendo depurados e verificados novamente.

![A geometria wireframe torna-se uma imagem de pixels sombreados](./software-graphics-pipeline.webp)

O [relatório Evidence](https://genesis.evox.group/evidence/tbench-wasm/) descreve uma implementação em TypeScript desenvolvida com DeepSeek V4 Flash: 2.017/2.019 casos do Khronos CTS aprovados, aproximadamente US$ 36 em custos de tokens do modelo e 65,9 horas entre o primeiro e o último commit do agente. Esse intervalo é a duração do histórico do repositório, não o tempo de execução medido do agente ativo.

## Divida o pipeline ao longo de interfaces utilizáveis

A [arquitetura de origem](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) separa a compilação e vinculação de shaders, a rasterização, o estado e objetos WebGL, e a apresentação/decodificação de imagem. O resultado de um shader ainda precisa passar por interpolação, execução de fragmentos, manipulação de textura e pelo buffer de desenho antes de se tornar uma imagem visível.

O renderizador com zero dependências em tempo de execução visa a execução sem renderização nativa por GPU. Ambientes de conformidade baseados em navegador ainda são usados para testá-lo; esse ambiente de verificação é distinto da reivindicação de dependência de tempo de execução do renderizador.

## Um erro de segurança precisava ocorrer antes de um erro de vinculação de textura

Uma página do WebGL2 que apresentava falha referia-se a uma origem de imagem contaminada (origin-tainted). O [registro de verificação final](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) rastreia o problema até a ordem de validação, em vez de uma capacidade ausente do worker.

A implementação verificava a vinculação da textura antes de verificar se a origem era segura (origin-clean). A correção `7d8718a` moveu a verificação de segurança para antes da validação de vinculação em todos os seis pontos de entrada de origem de imagem relevantes, cobrindo uploads de imagem e de sub-imagem. A página afetada mudou de **9 subtestes aprovados / 4 falhas para 13 / 0**.

Este é um problema de integração: ambas as verificações existiam, mas sua ordenação alterava o comportamento observável da API. O resultado pretendido foi então incluído em uma execução de toda a suíte, em vez de ser tratado como prova de que comportamentos não relacionados permaneceram inalterados.

## Uma textura de alta profundidade de bits falhou antes de chegar ao renderizador

Uma segunda página testou a entrada de textura de maior precisão. O mesmo registro identifica um caminho de decodificação de imagem que reduzia a origem para oito bits por canal antes do upload. As correções `89e4559` e `9bd7811` adicionaram um caminho para PNG de 16 bits em JavaScript e corrigiram a manipulação de canais, incluindo entrada RGBA.

A página `tex-image-10bpc` passou de **2 subtestes aprovados / 1 falha para 3 / 0**. A implementação relevante é o [decodificador PNG da camada de apresentação](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Este exemplo mostra por que alterar apenas a aritmética do shader não teria resolvido todas as falhas de precisão: os dados já haviam perdido precisão anteriormente no fluxo.

## Verifique o pacote enviado, incluindo qual renderizador foi executado

O [registro final de 29 de agosto](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifica o commit do pacote `c4ffbff`. Ele afirma que o `renderer.js` incluído foi testado conforme extraído do repositório, sem reconstruí-lo para a verificação.

| Suíte avaliada | Aprovados | Falhas | Timeouts / erros |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1.184/1.184 | 0 | 0 / 0 |
| Combinado | 2.017/2.019 | 2 | 0 / 0 |

O denominador segue os manifestos naquela árvore de testes. O registro também afirma que todas as 2.019 páginas avaliadas relataram o renderizador de software ativo, portanto, o fallback nativo não forneceu os resultados positivos. Para aquelas duas páginas WebGL2 corrigidas, a execução completa recuperou ambas as falhas, preservando as páginas que já haviam sido aprovadas anteriormente.

![Resultados de conformidade WebGL para a execução documentada do Genesis](./wasm-render-results-en.png)

*Figura de resultados históricos; o registro final versionado define os manifestos e contagens avaliados.*

## Investigue falhas residuais com um controle

Duas páginas WebGL1 permaneceram com falhas. O registro final atribui o caso de cor com alpha baixo ao comportamento de apresentação/leitura do canvas 2D do Chromium e relata a mesma falha com WebGL nativo. Para identificadores de shader com sublinhado duplo, ele relata que o Chrome nativo também falhou na página de teste.

Estes são os resultados de controle documentados do projeto, não uma reprodução independente. Eles explicam a classificação dos resíduos pelos autores sem transformar 2.017/2.019 em uma reivindicação de compatibilidade incondicional.

A comparação visual é uma verificação separada. O relatório Evidence registra **16/38 páginas do three.js em um limite estrito de pixel de 0,1%** e **13/16 cenas do Babylon.js**, ambos subconjuntos selecionados. A conformidade da API e a concordância de pixels medem propriedades diferentes; a alta contagem no CTS não apaga as falhas visuais.

## Acompanhe uma falha da página de teste até o artefato final

Com as árvores de teste e dependências de ambiente preparadas, o registro final documenta este ponto de entrada WebGL2:

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

O registro observa que as saídas JSON detalhadas estão no gitignore. Seu relatório e identificadores de correção registrados são a trilha pública; este artigo não executou a suíte novamente.

As 135.165 linhas de texto rastreadas do arquivo incluem o pacote gerado, material de terceiros, arquivos de bloqueio e documentação. Os US$ 36 cobrem os tokens do modelo, excluindo hardware. Comece pela correção da ordem de validação e sua página de teste ao inspecionar este caso: ela conecta uma falha específica, uma alteração no código-fonte e o resultado integrado sem depender apenas do volume de código.
