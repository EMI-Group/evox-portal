---
title: "Genesis WASM Render: Corrigindo a Ordem de Validação e a Precisão de Pixeis num Renderizador WebGL"
pubDate: 2026-10-15
updatedDate: 2026-11-10
summary: "Duas correções documentadas de WebGL2 ligam causas raiz a resultados de regressão, enquanto o registo de verificação final distingue a conformidade da API do emparelhamento visual."
---

Um renderizador WebGL por software deve fazer mais do que desenhar uma imagem reconhecível. Deve compilar shaders, manter o estado da API, validar entradas na ordem correta e preservar a precisão da imagem entre as fronteiras dos módulos. O caso do Genesis WASM Render contém dois exemplos concretos desses requisitos a serem depurados e verificados novamente.

![A geometria wireframe torna-se uma imagem de pixeis sombreada](./software-graphics-pipeline.webp)

O [registo Evidence](https://genesis.evox.group/evidence/tbench-wasm/) descreve uma implementação em TypeScript desenvolvida com o DeepSeek V4 Flash: 2.017/2.019 casos do Khronos CTS aprovados, aproximadamente US$36 em custos de tokens do modelo, e 65,9 horas entre os primeiros e últimos commits do agente. Esse intervalo corresponde à duração do histórico do repositório, não ao tempo de execução medido do agente ativo.

## Dividir o pipeline ao longo de interfaces utilizáveis

A [arquitetura de origem](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/CONTEXT.md) separa a compilação e ligação de shaders, a rasterização, o estado e objetos WebGL, e a apresentação/descodificação de imagem. O resultado de um shader ainda tem de passar pela interpolação, execução de fragmentos, manipulação de texturas e pelo buffer de desenho antes de se tornar uma imagem visível.

O renderizador com zero dependências em tempo de execução visa a execução sem renderização nativa por GPU. Estruturas de conformidade baseadas no navegador ainda são utilizadas para o testar; esse ambiente de verificação é distinto da reivindicação de dependência em tempo de execução do renderizador.

## Um erro de segurança tinha de ocorrer antes de um erro de vinculação de textura

Uma página de WebGL2 que falhava dizia respeito a uma origem de imagem contaminada (origin-tainted). O [registo de verificação final](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md#vs-previous-record-bundle-e3565d4-2015p4f) rastreia o problema até à ordem de validação, em vez de uma capacidade de worker em falta.

A implementação verificava a vinculação da textura antes de verificar se a origem era segura (origin-clean). A correção `7d8718a` moveu a verificação de segurança para antes da validação de vinculação em todos os seis pontos de entrada de origem de imagem relevantes, cobrindo carregamentos de imagem e de sub-imagem. A página afetada passou de **9 subtestes aprovados / 4 falhados para 13 / 0**.

Este é um problema de integração: ambas as verificações existiam, mas a sua ordenação alterava o comportamento observável da API. O resultado pretendido foi então incluído numa execução de toda a suite, em vez de ser tratado como prova de que o comportamento não relacionado permaneceu inalterado.

## Uma textura de elevada profundidade de bits falhava antes de chegar ao renderizador

Uma segunda página testava a entrada de texturas de maior precisão. O mesmo registo identifica um caminho de descodificação de imagem que reduzia a origem para oito bits por canal antes do carregamento. As correções `89e4559` e `9bd7811` adicionaram um caminho PNG de 16 bits em JavaScript e corrigiram a manipulação de canais, incluindo a entrada RGBA.

A página `tex-image-10bpc` passou de **2 subtestes aprovados / 1 falhado para 3 / 0**. A implementação relevante é o [descodificador PNG da camada de apresentação](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/src/present/png.ts). Este exemplo mostra por que razão alterar apenas a aritmética do shader não teria resolvido todas as falhas de precisão: os dados já tinham perdido precisão a montante.

## Verificar o bundle submetido, incluindo qual o renderizador executado

O [registo final de 29 de agosto](https://github.com/BillHuang2001/tbench-wasm/blob/67f620392b667714ba028f320d0e24f8ed32a16a/tests/conformance/FINAL.md) identifica o commit do bundle `c4ffbff`. Refere que o `renderer.js` integrado foi testado tal como extraído, sem ser reconstruído para verificação.

| Suite avaliada | Aprovados | Falhados | Timeouts / erros |
| --- | --- | --- | --- |
| WebGL1 | 833/835 | 2 | 0 / 0 |
| WebGL2 | 1.184/1.184 | 0 | 0 / 0 |
| Combinado | 2.017/2.019 | 2 | 0 / 0 |

O denominador segue os manifestos nessa árvore de testes. O registo também afirma que todas as 2.019 páginas classificadas reportaram o renderizador de software como ativo, pelo que o fallback nativo não forneceu os resultados positivos. Para aquelas duas páginas WebGL2 corrigidas, a execução completa recuperou ambas as falhas preservando as páginas que anteriormente já passavam.

![Resultados de conformidade WebGL para a execução documentada do Genesis](./wasm-render-results-en.png)

*Figura de resultados históricos; o registo final com versão define os manifestos e contagens avaliados.*

## Investigar falhas residuais com um controlo

Duas páginas de WebGL1 continuaram a falhar. O registo final atribui o caso de cor com alpha baixo ao comportamento de apresentação/leitura do canvas 2D do Chromium e reporta a mesma falha com WebGL nativo. Para identificadores de shader com duplo sublinhado, reporta que o Chrome nativo também falhou na página de teste.

Estes são os resultados de controlo documentados do projeto, não uma reprodução independente. Eles explicam a classificação dos resíduos pelos autores sem transformar 2.017/2.019 numa reivindicação de compatibilidade incondicional.

A comparação visual é uma verificação separada. O registo Evidence reporta **16/38 páginas three.js num limiar rigoroso de 0,1% de pixeis** e **13/16 cenas Babylon.js**, ambos subconjuntos selecionados. A conformidade da API e a concordância de pixeis medem propriedades diferentes; a contagem elevada no CTS não apaga as falhas visuais.

## Acompanhar uma falha desde a página de teste até ao artefacto final

Com as árvores de teste e dependências de suporte preparadas, o registo final documenta este ponto de entrada WebGL2:

```bash
npx tsx tests/conformance/run.ts --renderer ./renderer.js --suite webgl2 --report tests/reports/webgl2-FINAL2.json
```

O registo observa que as saídas JSON detalhadas estão no gitignore. O seu relatório integrado e os identificadores de correção são o rasto público; este artigo não executou novamente a suite.

As 135.165 linhas de texto monitorizadas do arquivo incluem o bundle gerado, material de terceiros, ficheiros lock e documentação. Os US$36 cobrem os tokens do modelo, excluindo hardware. Comece pela correção da ordem de validação e pela sua página de teste ao inspecionar este caso: ela liga uma falha específica, uma alteração no código-fonte e o resultado integrado sem depender apenas do volume de código.
