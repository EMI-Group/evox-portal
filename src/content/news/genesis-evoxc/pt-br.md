---
title: "Genesis Builds EvoX Compiler: Contratos, Testes de Grafo e Sincronização de Dispositivos"
pubDate: 2026-11-03
updatedDate: 2026-11-10
summary: "Como a Genesis desenvolveu um compilador de grafos de tensores baseado em estágios explícitos, verificações de transformação e contratos de backend, com exemplos concretos de seus testes públicos."
---

Construir um compilador de grafos de tensores significa manter várias implementações do mesmo cálculo em conformidade. Uma transformação de grafo pode alterar o layout do tensor; um adaptador pode rejeitar uma operação; uma chamada de dispositivo pode retornar antes que a computação termine. O caso do EvoX Compiler da Genesis torna-se útil quando esses limites são examinados individualmente.

![Grafos do compilador verificados contra testes de regressão](./compiler-contract-layers.webp)

O [snapshot do Evidence de 28 de outubro](https://genesis.evox.group/evidence/evoxc/) registra 6.789 testes aprovados e aproximadamente US$ 50 em cobranças de tokens de modelo. Para examinar a engenharia por trás desses números, este artigo também utiliza o código-fonte v0.1.0 acessível publicamente. O snapshot e o lançamento possuem totais de testes diferentes; os exemplos de implementação abaixo são identificados por sua versão.

## Transforme o objetivo em interfaces que possam ser testadas

O EvoX Compiler detém a linguagem de tensores, o grafo EvoXIR e as interfaces de staging. Compiladores externos recebem sua representação exportada e lidam com otimização, agendamento e geração de código. Seus [contratos de pacote](https://github.com/EMI-Group/evoxc/blob/v0.1.0/CONTEXT.md) documentam a direção das dependências: tipos de valor e IR sustentam o rastreamento e as operações, enquanto transformações e adaptadores são construídos sobre essas camadas. O pacote separado `evoxc_hf` consome a API pública do compilador; o compilador não importa a integração do modelo.

Essa divisão dá ao trabalho de desenvolvimento local um limite concreto. Por exemplo, uma transformação produz outro grafo comum em vez de exigir que cada backend entenda o `vmap` do Python. Uma lacuna no backend deve se tornar um erro explícito em vez de alterar silenciosamente o caminho de execução. Documentos de contexto no nível do pacote registram as APIs e restrições que outra tarefa de desenvolvimento deve preservar.

O pipeline público é `trace → lower → compile → load → run`. Cada estágio retorna um objeto distinto. Os [testes de especificação](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verificam entradas de estágios incorretos, rejeitam chamadas eager diretas para definições de grafo e verificam se as funções de conveniência se expandem para o pipeline documentado. Eles também rejeitam a captura de um tensor concreto de um closure, a menos que o autor o incorpore explicitamente. O benefício prático é que um atalho aparentemente conveniente não pode introduzir silenciosamente um segundo conjunto de semânticas.

De acordo com o registro do Evidence, o desenvolvimento procedeu camada por camada, com verificações de pytest exigidas antes de continuar para a próxima camada. O repositório fornece contratos e testes inspecionáveis para esse método; ele não fornece uma sequência arquivada completa de decisões de agentes.

## Uma transformação de população verificada contra duas referências

Um recurso exigente é o `batch_functions`: combinar múltiplos programas com assinaturas de entrada/saída correspondentes em um único grafo. Seu contrato é mais forte do que "o grafo combinado funciona": a linha de saída i ainda deve ser igual ao resultado do programa i.

Os [testes de integração v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) exercitam um exemplo pequeno e legível. Na mesma posição do grafo, três programas executam `x + 1`, `x * 2` e `x - 3`. Com `switch_ops=True`, o grafo mesclado representa as diferentes operações através de seleção por linha. Os testes compilam esse grafo através do caminho de CPU do IREE e comparam sua saída tanto com a execução NumPy do grafo mesclado quanto com os resultados NumPy empilhados das funções originais, com `rtol=atol=1e-5`.

Verificações sem compilador inspecionam a saída StableHLO para a operação de seleção esperada. Outra verificação mescla programas idênticos e compara o resultado com `vmap`, onde nenhuma seleção deve ser necessária. Juntos, esses testes sondam a preservação do programa, exportação e integração de backend, em vez de usar a compilação bem-sucedida como a única condição de aceitação.

## O posicionamento no dispositivo faz parte da correção

Um executável rodando em uma GPU não deve aceitar dados do host fingindo que eles já são residentes no dispositivo. Os [testes de especificação de tensor e posicionamento](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/test_spec_compliance.py) verificam se os dados possuem um dispositivo físico, se as transferências são explícitas via `Tensor.to(device)` e se o posicionamento inválido gera um `DeviceError`.

Isso também é importante para a medição de desempenho. Se cada chamada transferir os pesos do modelo novamente, um número de latência medirá uma carga de trabalho diferente de uma que os mantém residentes. A [documentação de integração de modelo v0.1.0](https://github.com/EMI-Group/evoxc/blob/v0.1.0/evoxc_hf/CONTEXT.md) separa o carregamento de checkpoints, a computação forward e o staging do executável. Os parâmetros permanecem como entradas explícitas do grafo, tornando seu posicionamento visível.

## Uma chamada retornada não é necessariamente um trabalho concluído

O caminho residente no dispositivo XLA pode enfileirar trabalho e retornar antes da conclusão. Cronometrar apenas o `run`, portanto, subestimaria a execução. Os [testes de sincronização](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/backends/test_xla_synchronize.py) verificam o ciclo de vida do evento: as execuções acumulam handles de conclusão; `synchronize()` espera por eles e os destrói; uma segunda sincronização não realiza trabalho adicional de plugin.

Os casos de erro são igualmente específicos. Se a espera falhar, os handles restantes ainda devem ser processados e o primeiro erro gerado. Um plugin que não fornece nenhum evento de conclusão deve disparar um erro explícito em vez de uma falsa alegação de conclusão.

Esses testes usam um pequeno plugin PJRT falso que não realiza computação numérica. Eles verificam a semântica de sincronização e a limpeza, não o throughput da GPU ou a precisão numérica. Essa distinção mantém a evidência do teste alinhada à alegação.

## Mantenha o resultado histórico e o resultado do lançamento separados

| Registro | Configuração | Resultado relatado |
| --- | --- | --- |
| Snapshot Evidence de 28 de outubro | IREE instalado | 6.789 aprovados; 46 ignorados; 3 falhas esperadas; 0 falhas |
| Snapshot Evidence de 28 de outubro | Sem compilador | 6.367 aprovados; 95 ignorados; 3 falhas esperadas |
| README do lançamento v0.1.0 | Suítes core e de integração de modelo, todos os extras listados instalados | 7.511 aprovados; 77 ignorados; 4 falhas esperadas; 0 falhas |

Fontes: [Verificação Evidence](https://genesis.evox.group/evidence/evoxc/#verification) e [status de lançamento versionado](https://github.com/EMI-Group/evoxc/blob/v0.1.0/README.md#status--deferrals). Estes são execuções relatadas pelo projeto. Proteções de dependência e hardware explicam caminhos não exercitados; um teste de CPU aprovado não é a validação de cada acelerador.

As 285.659 linhas de texto rastreadas do snapshot do Evidence incluem testes, documentação e material de benchmark. Seus aproximadamente US$ 50 cobrem tokens de modelo, excluindo hardware; o modelo, a contagem de episódios e o tempo de execução ativa não foram relatados. O intervalo de calendário do repositório não é um tempo de execução autônomo contínuo.

O repositório credita à Genesis a produção de seu código, testes e documentação. O resultado concreto é um compilador com contratos de estágio inspecionáveis separadamente, testes de preservação de grafo e semântica de conclusão de dispositivo. Comece com o [teste de integração de população](https://github.com/EMI-Group/evoxc/blob/v0.1.0/tests/transforms/test_batch_functions_integration.py) para acompanhar um recurso através desses limites; a [visão geral do EvoX Compiler](/pt-br/releases/evoxc-0-1-0) explica o pipeline voltado para o usuário.
