---
title: "TensorNEAT: refinar redes diferentes sem guardar todos os intermediários"
pubDate: 2026-04-04
summary: "Gradientes paralelos e execução com memória controlada conectam busca de topologias e ajuste de parâmetros no JAX."
---

Buscar estruturas neurais produz indivíduos diferentes. A [integração de gradientes de 3 de março de 2026][s1] no TensorNEAT permite refinar parâmetros em topologias distintas. A [atualização de memória de 4 de abril][s2] reduz intermediários e adiciona lotes populacionais, oferecendo uma opção além de reduzir a busca.

![Redes neurais diferentes atravessam uma pequena abertura em grupos](./cover.webp)

*Ilustração conceptual: preservar a população limitando o lote ativo de trabalho.*

## Estruturas diferentes, uma operação de gradiente

TensorNEAT representa redes NEAT em tensores de nós e ligações. `genome.grad` devolve perda escalar e gradientes dos dois arrays. Campos estruturais, como índices e tipos de função, e preenchimento NaN recebem gradientes zero. Os parâmetros numéricos mudam, preservando a estrutura codificada.

A vetorização JAX aplica esse cálculo mesmo a topologias diferentes. O [exemplo XOR][s3] inicializa uma população, diversifica estruturas por mutação e otimiza por descida do gradiente. É uma base concreta para estudar estrutura e parâmetros juntos sem supor que gradientes alteram ligações discretas.

## Dividir o trabalho, não o espaço de busca

Abril adiciona `pop_batch_size` a NEAT e Pipeline. O valor no Pipeline substitui o do algoritmo e deve dividir a população. O antigo argumento `eval_batch_size` é substituído, exigindo migração das configurações que o utilizam.

Num único dispositivo, a transformação passa para o loop `jax.lax.scan`. Em vez de materializar primeiro a adjacência densa da população toda, o pipeline transforma e avalia um lote por vez. A mutação também usa esse controlo. A população não muda; muda o conjunto de trabalho simultâneo. É útil quando a diversidade precisa ser mantida no limite da memória GPU.

## Consultar sem grandes comparações intermediárias

O cruzamento troca comparações aninhadas por correspondência hash e busca ordenada. Chaves de conexão são mapeadas para índices dos nós por ordenação e busca. As mudanças atacam arrays temporários que crescem com população e capacidade da rede.

O commit relata trajetórias idênticas em 15 gerações com semente fixa para DefaultGene e OriginGene. É um resultado específico de regressão, não uma promessa para todas as dependências e dispositivos. Scripts de correção e memória permitem examinar implementação e afirmações conjuntamente.

## Escolher o lote com um experimento reproduzível

Comece com ajuste de função pequeno e limites fixos de nós e ligações. Registe a sequência sem lotes e escolha um divisor da população. Compare primeiro a correção; depois meça pico de memória, compilação e tempo por passo separadamente. Lotes menores reduzem memória, mas alteram o paralelismo disponível.

Para gradientes, consulte XOR com perda e taxa de aprendizagem explícitas. Para memória, fixe o [código de abril][s4]. TensorNEAT usa JAX; a integração EvoX do README aponta para o ramo da época JAX, importante ao combinar ambientes. Assim fica mais claro quanta busca estrutural e paramétrica cabe no orçamento de memória.

[s1]: https://github.com/EMI-Group/tensorneat/pull/37
[s2]: https://github.com/EMI-Group/tensorneat/commit/ce27fa9f794928c9416d9f12c398f58481c821ce
[s3]: https://github.com/EMI-Group/tensorneat/blob/ce27fa9f794928c9416d9f12c398f58481c821ce/examples/func_fit/xor_grad.py
[s4]: https://github.com/EMI-Group/tensorneat/tree/ce27fa9f794928c9416d9f12c398f58481c821ce
