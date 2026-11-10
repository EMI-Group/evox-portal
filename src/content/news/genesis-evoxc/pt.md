---
title: "Genesis Builds EvoX Compiler: Contracts, Graph Tests and Device Synchronization"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Como a Genesis desenvolveu um compilador de grafos de tensores baseado em etapas explícitas, verificações de transformação e contratos de backend, com exemplos concretos dos seus testes públicos."
---

Construir um compilador de grafos de tensores significa manter várias implementações do mesmo cálculo em conformidade. Uma transformação de grafo pode alterar o layout do tensor; um adaptador pode rejeitar uma operação; uma chamada de dispositivo pode retornar antes de a computação terminar. O caso do EvoX Compiler da Genesis torna-se útil quando essas fronteiras são examinadas individualmente.

![Compiler graphs checked against regression tests](./compiler-contract-layers.webp)

O [snapshot Evidence de 28 de outubro](https://genesis.evox.group/evidence/evoxc/) regista 6.789 testes com sucesso e aproximadamente US$50 em custos de tokens de modelo. Para examinar a engenharia por trás desses números, este artigo utiliza também o código-fonte v0.1.0 acessível publicamente. O snapshot e o lançamento têm totais de testes diferentes; os exemplos de implementação abaixo são identificados pela sua versão.

## Transformar o objetivo em interfaces que podem ser testadas

O EvoX Compiler detém a linguagem de tensores, o grafo EvoXIR e as interfaces de staging. Compiladores externos recebem a sua representação exportada e tratam da otimização, agendamento e geração de código. Os seus [contratos de pacotes](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) documentam a direção das dependências: os tipos de valor e o IR sustentam o tracing e as operações, enquanto as transformações e os adaptadores são construídos sobre essas camadas. O pacote separado `evoxc_hf` consome a API pública do compilador; o compilador não importa a integração do modelo.

Essa divisão confere ao trabalho de desenvolvimento local uma fronteira concreta. Por exemplo, uma transformação produz outro grafo comum em vez de exigir que cada backend compreenda o `vmap` do Python. Uma lacuna no backend deve tornar-se um erro explícito em vez de alterar silenciosamente o caminho de execução. Os documentos de contexto ao nível do pacote registam as APIs e restrições que outra tarefa de desenvolvimento deve preservar.

O pipeline público é `trace → lower → compile → load → run`. Cada etapa retorna um objeto distinto. Os [testes de especificação](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verificam entradas em etapas erradas, rejeitam chamadas eager diretas a definições de grafos e verificam se as funções de conveniência se expandem para o pipeline documentado. Também rejeitam a captura de um tensor concreto a partir de uma closure, a menos que o autor o incorpore explicitamente. O benefício prático é que um atalho aparentemente conveniente não pode introduzir silenciosamente um segundo conjunto de semânticas.

De acordo com o registo Evidence, o desenvolvimento procedeu camada por camada, com verificações pytest obrigatórias antes de continuar para a camada seguinte. O repositório fornece contratos e testes inspecionáveis para esse método; não fornece uma sequência arquivada completa de decisões do agente.

## Uma transformação de população verificada contra duas referências

Uma funcionalidade exigente é `batch_functions`: combinar múltiplos programas com assinaturas de entrada/saída correspondentes num único grafo. O seu contrato é mais forte do que "o grafo combinado executa": a linha de saída i deve continuar a ser igual ao resultado do programa i.

Os [testes de integração v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) exercitam um exemplo pequeno e legível. Na mesma posição do grafo, três programas executam `x + 1`, `x * 2` e `x - 3`. Com `switch_ops=True`, o grafo fundido representa as diferentes operações através de seleção por linha. Os testes compilam esse grafo através do caminho de CPU do IREE e comparam a sua saída tanto com a execução NumPy do grafo fundido como com os resultados NumPy empilhados das funções originais, com `rtol=atol=1e-5`.

Verificações sem compilador inspecionam a saída StableHLO para a operação de seleção esperada. Outra verificação funde programas idênticos e compara o resultado com `vmap`, onde nenhuma seleção deve ser necessária. Juntos, estes testes sondam a preservação do programa, a exportação e a integração com o backend, em vez de utilizarem a compilação bem-sucedida como a única condição de aceitação.

## O posicionamento no dispositivo faz parte da correção

Um executável a correr num GPU não deve aceitar dados do host fingindo que estes já residem no dispositivo. Os [testes de especificação de tensores e posicionamento](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verificam se os dados têm um dispositivo físico, se as transferências são explícitas através de `Tensor.to(device)` e se um posicionamento inválido levanta um `DeviceError`.

Isto também é importante para a medição de desempenho. Se cada chamada transferir novamente os pesos do modelo, um valor de latência mede uma carga de trabalho diferente de uma que os mantém residentes. A [documentação de integração de modelos v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) separa o carregamento de checkpoints, a computação forward e o staging do executável. Os parâmetros permanecem como entradas explícitas do grafo, tornando o seu posicionamento visível.

## Uma chamada retornada não é necessariamente trabalho concluído

O caminho residente no dispositivo XLA pode enfileirar trabalho e retornar antes da conclusão. Cronometrar apenas o `run` iria, portanto, subestimar a execução. Os [testes de sincronização](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) verificam o ciclo de vida do evento: as execuções acumulam handles de conclusão; `synchronize()` aguarda por eles e destrói-os; uma segunda sincronização não realiza trabalho adicional de plugin.

Os casos de erro são igualmente específicos. Se a espera falhar, os handles restantes devem ainda assim ser processados e o primeiro erro levantado. Um plugin que não forneça um evento de conclusão deve desencadear um erro explícito em vez de uma falsa alegação de conclusão.

Estes testes utilizam um pequeno plugin PJRT fictício que não realiza computação numérica. Verificam as semânticas de sincronização e limpeza, não o throughput do GPU ou a precisão numérica. Essa distinção mantém a evidência do teste ajustada à alegação.

## Manter o resultado histórico e o resultado do lançamento separados

| Registo | Configuração | Resultado reportado |
| --- | --- | --- |
| Snapshot Evidence de 28 de outubro | IREE instalado | 6.789 passaram; 46 ignorados; 3 falhas esperadas; 0 falharam |
| Snapshot Evidence de 28 de outubro | Sem compilador | 6.367 passaram; 95 ignorados; 3 falhas esperadas |
| README do lançamento v0.1.0 | Suites core e de integração de modelos, todos os extras listados instalados | 7.511 passaram; 77 ignorados; 4 falhas esperadas; 0 falharam |

Fontes: [Verificação Evidence](https://genesis.evox.group/evidence/evoxc/#verification) e [estado do lançamento versionado](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Estas são execuções reportadas pelo projeto. Guardas de dependência e de hardware explicam caminhos não exercitados; um teste de CPU com sucesso não é uma validação de todos os aceleradores.

As 285.659 linhas de texto monitorizadas no snapshot Evidence incluem testes, documentação e material de benchmark. Os seus aproximadamente US$50 cobrem tokens de modelo, excluindo hardware; o modelo, a contagem de episódios e o tempo de execução ativa não foram reportados. O intervalo de calendário do repositório não é um tempo de execução autónomo contínuo.

O repositório credita a Genesis pela produção do seu código, testes e documentação. O resultado concreto é um compilador com contratos de etapa separadamente inspecionáveis, testes de preservação de grafo e semânticas de conclusão de dispositivo. Comece pelo [teste de integração de população](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) para seguir uma funcionalidade através dessas fronteiras; a [visão geral do EvoX Compiler](/news/evox-compiler) explica o pipeline voltado para o utilizador.
