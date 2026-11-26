---
title: "EvoX Compiler v0.2.3: instalar o backend adequado à carga de trabalho"
pubDate: 2026-11-26
summary: "A série 0.2 traz IREE 3.13, descoberta automática de plugins XLA e correções numéricas; a v0.2.3 disponibiliza os artefactos de distribuição verificados."
---

O EvoX Compiler v0.2.3 foi publicado a 25 de novembro de 2026 UTC, com wheels Python e um arquivo de código-fonte. A breve nota do GitHub liga à comparação entre v0.2.2 e v0.2.3; o registo versionado descreve as alterações substanciais da série 0.2 e as correções de empacotamento que conduzem a esta distribuição. Para quem migra da 0.1, importa escolher o par compilador/runtime, selecionar o dispositivo físico e repetir as verificações numéricas relevantes. [Publicação][release] · [Registo de alterações][changes]

![Um adaptador com guia alinhado com o encaixe correspondente junto de uma embalagem verificada](./cover.webp)

*Ilustração conceptual: uma distribuição utilizável tem de corresponder ao ambiente de execução.*

## Manter o compilador e o runtime alinhados

O extra IREE exige agora compilador e runtime desde a versão 3.13.0 até uma versão inferior à 3.14. Os artefactos compilados dependem da versão: um ficheiro produzido com outro par não pode ser considerado carregável sem alterações. O projeto de origem revalidou llvm-cpu e ROCm/HIP num AMD Instinct MI300X com ROCm 7.1, incluindo ciclos e scans que falhavam em versões anteriores do IREE. Estas verificações não abrangem automaticamente CUDA, execução multi-rank ou todos os benchmarks de modelos. [Requisitos versionados][requirements] · [Registo de alterações][changes]

O adaptador também controla a leitura do dispositivo para o host, em vez de depender cegamente do atalho do runtime. Isto é relevante quando o cálculo funciona, mas a obtenção do resultado falha. A memória do host pode manter um caminho mapeado; os buffers do dispositivo exigem transferência explícita. O tempo de transferência integra a carga da aplicação e deve ser separado do tempo do kernel.

## Descobrir o plugin XLA e escolher o dispositivo

O registo XLA já não procura plugins sem opções antes de o chamador fornecer um caminho. A descoberta considera a opção explícita, a variável de ambiente correspondente, localizações conhecidas e pacotes de plugins JAX instalados, sem importar o próprio JAX. A disponibilidade é verificada durante a compilação e o carregamento, quando as opções estão presentes. As funções de construção passam as opções resolvidas ao carregamento, corrigindo o caso em que a compilação encontrava um plugin, mas o carregamento perdia a sua configuração. [Guia dos backends][guide]

Um plugin ROCm tem de servir um dispositivo ROCm, e um plugin CUDA um dispositivo CUDA. Fornecer um plugin GPU mantendo a seleção CPU predefinida é rejeitado. Numa experiência GPU, deve selecionar-se o dispositivo correspondente e mover explicitamente os tensores para ele. Antes de copiar resultados para o host, importa verificar a localização das saídas. Uma execução XLA falhada limpa também os espaços de ponteiros de saída em cache, evitando a reutilização posterior de ponteiros obsoletos.

## Verificar a semântica antes de comparar velocidades

O interpretador de referência NumPy usa planos de despacho em cache, liberta valores intermédios mortos na última utilização e partilha uma instância imutável do dispositivo host. Isto reduz preparação e alocações sem alterar a forma pública das chamadas. As medições TensorNEAT do registo dizem respeito a cargas concretas, não a um fator universal de aceleração.

A operação compilada de resto segue agora NumPy floormod: o resultado tem o sinal do divisor. As entradas negativas são, portanto, um teste útil de atualização. Devem guardar-se entradas fixas e saídas de referência e comparar interpretador e compilador com tolerâncias adequadas ao tipo de dados. As correções de empacotamento aceitam o diretório de bibliotecas partilhadas incluído pelo maturin e organizam os ficheiros de distribuição testados numa estrutura plana, resolvendo falhas que impediam a publicação. [Correções registadas][changes]

## Atualizar num ambiente limpo

É necessário Python 3.11 ou posterior. Instale-se com pip o wheel 0.2.3 escolhido entre os recursos da publicação, que oferece wheels Linux, macOS e Windows e um arquivo de código-fonte. Para o extra IREE, pode usar-se `pip install "evoxc[iree]==0.2.3"`, confirmando as duas dependências IREE. A distribuição separada evoxc-hf mantém a sua própria versão. Antes de migrar uma carga maior, deve executar-se `pip check`, consultar a versão instalada e repetir um grafo representativo, um caso de resto negativo e uma transferência de ida e volta ao dispositivo. [Guia de instalação][guide]

As transformações de grafos, operações personalizadas e etapas explícitas de compilação em torno destes backends são explicadas no artigo sobre [compilação personalizada][related], em conjunto com a documentação desta publicação.

[release]: https://github.com/EMI-Group/evoxc/releases/tag/v0.2.3
[changes]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/CHANGELOG.md
[requirements]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/pyproject.toml
[guide]: https://github.com/EMI-Group/evoxc/blob/v0.2.3/README.md
[related]: /pt/news/evoxc-custom-compilation-pipeline
