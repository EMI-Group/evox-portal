---
title: "EvoRL: preservar cada escrita e ler um registro por passo de treinamento"
pubDate: 2026-11-13
summary: "O registro JSONL local preserva metadados e escritas de métricas e combina passos repetidos na leitura sem um SDK de rastreamento."
---

Uma iteração de treinamento pode produzir várias observações: uma perda, um retorno de avaliação e depois uma métrica corrigida. Tratar cada escrita como nova iteração desalinha o experimento; descartar passos repetidos perde informação. EvoRL, o framework de aprendizado por reforço e aprendizado evolutivo, adicionou o [registro JSONL local][change] ao `main` em 12 de novembro de 2026. Um [ajuste dos nomes de arquivo][fix] chegou em 13 de novembro, horário de Pequim. As mudanças oferecem o histórico original das escritas e uma visão separada, alinhada por passo, para análise.

![Folhas originais do experimento ao lado de um arquivo agrupado por passos de observação](./jsonl-recording-cover.webp)

*Ilustração conceitual: preservar cada observação e organizar sua visão combinada por passo de treinamento.*

## Um arquivo local com o contexto do experimento

Selecionar `recorders=[log,jsonl]` salva métricas legíveis por máquina junto aos logs comuns sem adicionar um SDK de rastreamento. O [guia inicial versionado][guide] documenta a configuração compartilhada pelos scripts de treinamento. O backend JSONL recebe projeto, nome da execução, configuração resolvida, tags, caminho de saída e grupo opcional.

A inicialização escreve esse contexto no cabeçalho de metadados. Cada escrita seguinte acrescenta um objeto JSON com o inteiro `step` fornecido e os `data` aninhados, e esvazia o buffer do arquivo. O arquivo bruto mantém a ordem de chegada, inclusive passos fora de ordem e escritas repetidas. Ao mover o diretório de saída para outra máquina de análise, configuração e observações viajam juntas em um artefato local legível.

## Combinar na leitura, não na gravação

`load_jsonl_records(path)`, exportada de `evorl.recorders`, lê o conjunto de dados completo e retorna uma lista ordenada por passo. Combina recursivamente os dicionários do mesmo passo: escritas posteriores substituem valores em conflito, mantendo métricas não mencionadas. Arrays são substituídos por inteiro, e um `null` posterior também substitui o valor anterior. O cabeçalho opcional da primeira linha é ignorado, não incluído na lista de métricas.

Considere a perda de treinamento e o retorno de avaliação escritos separadamente no passo 10, seguidos por uma correção da perda. O arquivo bruto mantém as três escritas. O registro carregado contém a perda mais recente e o retorno de avaliação. Um registro do passo 8 recebido depois aparece antes do 10 na ordenação. Nas curvas de aprendizado, a identidade da iteração vem de `step`, não da posição da linha nem do número de chamadas de registro.

## O que a serialização preserva

A [implementação e os testes de regressão][change] cobrem valores NumPy, JAX e pandas. Arrays e Series tornam-se listas. DataFrames preservam colunas e dados das linhas, mas omitem o índice. NaN, infinito e valores ausentes do pandas tornam-se JSON `null`. Se o índice identifica amostras, transforme-o em coluna explícita antes de registrar; isso decorre diretamente da representação armazenada.

Linhas malformadas ou incompletas geram um erro com arquivo e número da linha. O carregador não descarta silenciosamente um último registro truncado. Ele carrega todo o conjunto na memória, portanto planeje a memória de análise conforme o tamanho acumulado do arquivo. Uma métrica da aplicação chamada `step` permanece em `data`, distinta do campo externo de iteração.

## Um destino diferente para cada execução

O ajuste compartilha `sanitize_filename` entre JSONL e os logs criados pelos scripts. Substitui `/` por `_`: `MetaWorld/Hammer-v3` vira `MetaWorld_Hammer-v3`. Outros caracteres permanecem iguais e os metadados mantêm o nome original. Os arquivos usam extensões separadas `.jsonl` e `.log`. Isso substitui a codificação percentual do primeiro commit; normalizar um nome não garante sua unicidade.

Reinicializar o mesmo caminho JSONL sobrescreve seu conteúdo. Use um diretório ou nome diferente para cada execução, principalmente quando os nomes diferirem apenas em barra e sublinhado. Comece com a configuração acima em uma cópia do código que inclua ambos os commits; carregue um pequeno experimento e confira cabeçalho, combinação dos passos repetidos e destino antes de uma execução longa. O [artigo anterior sobre o desenvolvimento do EvoRL][related] explica gradientes, dispositivos e formatos das métricas; esta atualização facilita preservar e reanalisar essas observações localmente.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /pt-br/news/evorl-jax-training-consistency
