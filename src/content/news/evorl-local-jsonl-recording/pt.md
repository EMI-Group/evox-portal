---
title: "EvoRL: preservar cada escrita e ler um registo por passo de treino"
pubDate: 2026-11-13
summary: "O registo JSONL local preserva metadados e escritas de métricas e combina passos repetidos na leitura sem um SDK de rastreio."
---

Uma iteração de treino pode produzir várias observações: uma perda, um retorno de avaliação e depois uma métrica corrigida. Tratar cada escrita como nova iteração desalinha a experiência; descartar passos repetidos perde informação. EvoRL, o framework de aprendizagem por reforço e aprendizagem evolutiva, adicionou o [registo JSONL local][change] ao `main` a 12 de novembro de 2026. Um [ajuste dos nomes de ficheiro][fix] chegou a 13 de novembro, horário de Pequim. As mudanças oferecem o histórico original das escritas e uma visão separada, alinhada por passo, para análise.

![Folhas originais da experiência ao lado de um ficheiro agrupado por passos de observação](./jsonl-recording-cover.webp)

*Ilustração conceptual: preservar cada observação e organizar a sua visão combinada por passo de treino.*

## Um ficheiro local com o contexto da experiência

Selecionar `recorders=[log,jsonl]` guarda métricas legíveis por máquina junto aos logs comuns sem adicionar um SDK de rastreio. O [guia inicial versionado][guide] documenta a configuração partilhada pelos scripts de treino. O backend JSONL recebe projeto, nome da execução, configuração resolvida, tags, caminho de saída e grupo opcional.

A inicialização escreve esse contexto no cabeçalho de metadados. Cada escrita seguinte acrescenta um objeto JSON com o inteiro `step` fornecido e os `data` aninhados, e esvazia o buffer do ficheiro. O ficheiro bruto mantém a ordem de chegada, inclusive passos fora de ordem e escritas repetidas. Ao mover o diretório de saída para outra máquina de análise, configuração e observações viajam juntas num artefacto local legível.

## Combinar na leitura, não na gravação

`load_jsonl_records(path)`, exportada de `evorl.recorders`, lê o conjunto de dados completo e devolve uma lista ordenada por passo. Combina recursivamente os dicionários do mesmo passo: escritas posteriores substituem valores em conflito, mantendo métricas não mencionadas. Arrays são substituídos por inteiro, e um `null` posterior também substitui o valor anterior. O cabeçalho opcional da primeira linha é ignorado, não incluído na lista de métricas.

Considere a perda de treino e o retorno de avaliação escritos separadamente no passo 10, seguidos por uma correção da perda. O ficheiro bruto mantém as três escritas. O registo carregado contém a perda mais recente e o retorno de avaliação. Um registo do passo 8 recebido depois aparece antes do 10 na ordenação. Nas curvas de aprendizagem, a identidade da iteração vem de `step`, não da posição da linha nem do número de chamadas de registo.

## O que a serialização preserva

A [implementação e os testes de regressão][change] cobrem valores NumPy, JAX e pandas. Arrays e Series tornam-se listas. DataFrames preservam colunas e dados das linhas, mas omitem o índice. NaN, infinito e valores ausentes do pandas tornam-se JSON `null`. Se o índice identifica amostras, transforme-o em coluna explícita antes de registar; isso decorre diretamente da representação armazenada.

Linhas malformadas ou incompletas geram um erro com ficheiro e número da linha. O carregador não descarta silenciosamente um último registo truncado. Ele carrega todo o conjunto na memória, portanto planeie a memória de análise conforme o tamanho acumulado do ficheiro. Uma métrica da aplicação chamada `step` permanece em `data`, distinta do campo externo de iteração.

## Um destino diferente para cada execução

O ajuste partilha `sanitize_filename` entre JSONL e os logs criados pelos scripts. Substitui `/` por `_`: `MetaWorld/Hammer-v3` passa a `MetaWorld_Hammer-v3`. Outros caracteres permanecem iguais e os metadados mantêm o nome original. Os ficheiros usam extensões separadas `.jsonl` e `.log`. Isso substitui a codificação percentual do primeiro commit; normalizar um nome não garante a sua unicidade.

Reinicializar o mesmo caminho JSONL substitui o conteúdo. Use um diretório ou nome diferente para cada execução, principalmente quando os nomes diferirem apenas em barra e sublinhado. Comece com a configuração acima numa cópia do código que inclua ambos os commits; carregue uma pequena experiência e confira cabeçalho, combinação dos passos repetidos e destino antes de uma execução longa. O [artigo anterior sobre o desenvolvimento do EvoRL][related] explica gradientes, dispositivos e formatos das métricas; esta atualização facilita preservar e reanalisar essas observações localmente.

[change]: https://github.com/EMI-Group/evorl/commit/286abeb55c8f0fb6f70d0f1d9b315564111dfb49
[fix]: https://github.com/EMI-Group/evorl/commit/d47e80db01a7eb14889f5c16c518f303c1745097
[guide]: https://github.com/EMI-Group/evorl/blob/d47e80db01a7eb14889f5c16c518f303c1745097/docs/guide/quickstart.md#local-jsonl-records
[related]: /pt/news/evorl-jax-training-consistency
