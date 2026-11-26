---
title: "EvoX Compiler abre o fluxo à compilação personalizada"
pubDate: 2026-11-25
updatedDate: 2026-11-26
summary: "As novas interfaces de main aceitam chamadas personalizadas, StableHLO inline e módulos editados, com capacidades explícitas por backend."
---

Uma operação experimental pode ultrapassar uma biblioteca de tensores sem exigir alterações ao resto do programa. As atualizações do ramo predefinido do EvoX Compiler de 23–24 de novembro de 2026 permitem operações específicas do compilador, compilação de código intermédio editado e backends personalizados. Primeiro é preciso escolher onde executar a extensão: no compilador, como kernel em execução ou como backend completo. [Implementação e guia][guide]

![Um cartucho ótico amovível encaixa numa calha modular atravessada por um feixe vermelho contínuo](./cover.webp)

*Ilustração conceptual: substituir uma etapa mantendo explícito o fluxo envolvente.*

## Escolher a fronteira do trabalho personalizado

`custom_call` emite uma chamada StableHLO com nome, resultados declarados e configuração opcional do backend. O compilador externo decide se o destino existe e pode ser traduzido. `inline_stablehlo` insere um fragmento bruto: os operandos usam `%in0` e índices seguintes, enquanto os resultados devem ser atribuídos a `%out0` e índices seguintes. As especificações dos resultados continuam explícitas. Nomes, configuração e fragmentos são valores estáticos que especializam o grafo. [Contrato das operações][ops]

Estas interfaces não registam um kernel arbitrário no IREE ou PJRT. Para um kernel Python ou Triton executado em tempo de execução, mantém-se a via de registo `external_call`. Uma operação portável expressa em operações normais do EvoX Compiler pode usar um bloco com decomposição própria. A distinção evita confundir uma declaração ao compilador com uma implementação em execução.

## Editar o programa intermédio e compilar

Por exemplo, um programador pode inspecionar um executável com `source_text()`, editar o seu StableHLO e entregar o texto a `compile_text` com especificações de entrada e saída. O rastreio e a construção do grafo são omitidos, seguindo-se compilação e carregamento normais. As especificações descrevem tuplos exteriores; a execução tem de preservar esse contrato de entrada e saída. O compilador externo valida o módulo, mas aceitar o texto não comprova a correção numérica. [Implementação do fluxo][pipeline]

Conserve um pequeno conjunto de entradas e compare resultados com o programa original após cada edição. Um destino em falta deve ser diagnosticado na legalização do compilador, sem mudar silenciosamente de backend. O interpretador NumPy e o motor CPU nativo rejeitam estas extensões explicitamente. As novas operações no grafo também não têm regras automáticas de processamento por lotes ou diferenciação; essas transformações exigem uma alternativa suportada. [Capacidades e limites][guide]

## Ligar um backend deliberadamente

As instâncias de backend mantêm-se agora coerentes entre etapas. O registo permite substituição e remoção explícitas; os pontos de entrada permitem backends de pacotes externos. Um backend compilador declara capacidades e dtypes e implementa compilação e carregamento; um conjunto de dtypes vazio rejeita todos os grafos. Módulos personalizados de compilador e runtime IREE podem ser escolhidos por opções ou variáveis de ambiente, sem confundir o runtime de uma compilação personalizada com o módulo predefinido. [Guia de extensão][guide]

## Verificar separadamente transferências e comparações numéricas

No mesmo período alteram-se as transferências Vulkan: envios até 16 MiB usam buffers coerentes mapeados e os maiores usam uma via de cópia. A leitura de retorno distingue memória do host de memória GPU apenas visível ao host. As medições registadas referem-se a uma configuração Intel integrada/Mesa/IREE; meça transferência e execução separadamente no seu equipamento. [Implementação das transferências][transfer]

A CPU nativa também reutiliza armazenamento de buffers grandes e arrays de entrada para reduzir alocações repetidas. As reduções repartem saídas independentes preservando a ordem de acumulação de cada uma. Os adaptadores expõem `split_reduction_threshold` e `split_reduction_non_exact`; ao mudar a política, verifique resultados numéricos e tempos. [GitHub](https://github.com/EMI-Group/evoxc/commit/beb6c45e21099cf9d3d0f6e2a0e0d00475189ac7) · [GitHub](https://github.com/EMI-Group/evoxc/commit/83a6254ae0bfdef4f9df37cdcaaead6e8ca98048) · [GitHub](https://github.com/EMI-Group/evoxc/commit/df40224b8adc988d2d2a72cd35bd0aceef5bb660) · [GitHub](https://github.com/EMI-Group/evoxc/commit/501759257b739912d8b5179ae314e05e1e2dc9ba)

Uma correção de `power` na CPU nativa também alinha os expoentes com a via de potência em vírgula flutuante do NumPy. A ferramenta de paridade distingue verificações exatas de inteiros/booleanos de comparações flutuantes com tolerância. Antes de adotar esta revisão do código, conserve resultados de referência, teste o compilador e dispositivo escolhidos e confirme a tolerância. A [versão v0.1.1][release] explica o fluxo original; estas alterações ampliam a sua personalização. [Correção numérica][power]

Atualização relacionada · 2026-11-26: [EvoX Compiler v0.2.3: instalar o backend adequado à carga de trabalho](/pt/releases/evoxc-0-2-3).


[guide]: https://github.com/EMI-Group/evoxc/blob/f11167521bd913babf86e295436ea4c902cf3e11/README.md
[ops]: https://github.com/EMI-Group/evoxc/commit/879ca9a70cd390aae1a7757698d10b6e43b64908
[pipeline]: https://github.com/EMI-Group/evoxc/commit/1762ecec7d6ff56e7656ca7e2ae8d5a24149e1ef
[transfer]: https://github.com/EMI-Group/evoxc/commit/0177af388a73d1c1dcbb05b8cc3b40f7d184bdc1
[power]: https://github.com/EMI-Group/evoxc/commit/7fe54d07cc7e071ea80438eca74ad35de0bfa7d6
[release]: /pt/releases/evoxc-0-1-1
