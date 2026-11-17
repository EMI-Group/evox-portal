---
title: "TensorNEAT: manter a população, limitar a memória de trabalho"
pubDate: 2026-04-04
updatedDate: 2026-11-17
summary: "Lotes populacionais e intermediários de busca menores reduzem o conjunto de trabalho simultâneo do NEAT sem diminuir a população."
---

Mesmo que os genomas caibam na GPU, arrays de transformação e avaliação podem esgotar a memória. A [atualização de 4 de abril de 2026][s2] do TensorNEAT move a transformação para lotes sequenciais e reduz intermediários de busca. Mantém os candidatos enquanto permite controlar o conjunto de trabalho.

![Redes neurais diferentes atravessam uma pequena abertura em grupos](./cover.webp)

*Ilustração conceptual: preservar a população limitando o lote ativo de trabalho.*

## Dividir o trabalho, não o espaço de busca

Abril adiciona `pop_batch_size` a NEAT e Pipeline. O valor no Pipeline substitui o do algoritmo e deve dividir a população. O antigo argumento `eval_batch_size` é substituído, exigindo migração das configurações que o utilizam.

Num único dispositivo, a transformação passa para o loop `jax.lax.scan`. Em vez de materializar primeiro a adjacência densa da população toda, o pipeline transforma e avalia um lote por vez. A mutação também usa esse controlo. A população não muda; muda o conjunto de trabalho simultâneo. É útil quando a diversidade precisa ser mantida no limite da memória GPU.

O ponto decisivo é onde o lote começa. Dividir a avaliação após transformar toda a população deixa o grande array de adjacência já alocado. Mover as duas operações para o corpo de scan altera sua duração. O commit descreve a passagem de população × nós × nós para lote × nós × nós. É uma comparação de implementação, não uma fórmula de memória total: genomas, estado persistente e outros buffers continuam ocupando espaço. [Mudança na transformação][s2]

Usar lotes é uma escolha de execução. Não seleciona menos sobreviventes nem muda a população solicitada. Reduzir a população muda os candidatos participantes e pode alterar a própria busca. Separe essas opções ao diagnosticar falta de memória. Uma primeira comparação útil mantém a população e varia somente um divisor válido para o lote.

## Consultar sem grandes comparações intermediárias

O cruzamento troca comparações aninhadas por correspondência hash e busca ordenada. Chaves de conexão são mapeadas para índices dos nós por ordenação e busca. As mudanças atacam arrays temporários que crescem com população e capacidade da rede.

O commit relata trajetórias idênticas em 15 gerações com semente fixa para DefaultGene e OriginGene. É um resultado específico de regressão, não uma promessa para todas as dependências e dispositivos. Scripts de correção e memória permitem examinar implementação e afirmações conjuntamente.

## Escolher o lote com um experimento reproduzível

Comece com ajuste de função pequeno e limites fixos de nós e ligações. Registe a sequência sem lotes e escolha um divisor da população. Compare primeiro a correção; depois meça pico de memória, compilação e tempo por passo separadamente. Lotes menores reduzem memória, mas alteram o paralelismo disponível.

Use o [snapshot de abril][s4] para fixar a semântica da configuração, inclusive o argumento de lote renomeado. TensorNEAT é baseado em JAX; a integração documentada com EvoX aponta para o ramo da época JAX. Registre versões das dependências nas medições. O artigo separado sobre [gradientes populacionais][gradient] explica o aprendizagem. Primeiro confira se mudar o lote preserva os resultados da execução escolhida; depois avalie a relação entre memória e tempo.

[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
[gradient]: /pt/news/tensorneat-population-gradients
