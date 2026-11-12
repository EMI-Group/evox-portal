---
title: "EvoRL: manter gradientes, dispositivos e métricas em acordo"
pubDate: 2026-11-08
summary: "As mudanças de 8 de novembro tratam diferenciação JAX e Playground, após correções de posicionamento e métricas populacionais."
---

Um treino pode falhar antes de aprender ou terminar com registos que ocultam o que foi medido. As mudanças de main do EvoRL em 8 de novembro de 2026 tratam JAX e compatibilidade dos ambientes, após correções de outubro em dispositivos e métricas. A [tag de código v0.2.0][s1] conserva esse estado de desenvolvimento para inspeção reproduzível.

![Um robô simulado alinhado com estruturas de calibração e uma grelha](./cover.webp)

*Ilustração conceptual: treino consistente depende de vários contratos de execução alinhados.*

## Um caminho de gradiente sensível à versão

A [mudança de compatibilidade][s2] estende a solução local a JAX 0.12.0.1. Em JAX 0.12.0 e 0.12.0.1, derivadas de `erf` e `erfc` dentro de `shard_map` podem falhar nas verificações VMA. O caminho Tanh Normal afetado usa outro cálculo da log CDF normal, incluindo expansão das caudas.

No controlo contínuo, a distribuição da política precisa oferecer probabilidades diferenciáveis para atualizar parâmetros. A inicialização pode funcionar e o gradiente posterior falhar. A correção é limitada a essas versões; outras mantêm o caminho original. O README da tag recomenda JAX 0.11.0 com CUDA 13 como combinação testada nesse estado.

## Explicitar hipóteses sobre ambiente e dispositivo

O mesmo commit limita a dependência a `playground>=0.2.0,<1`, preservando a interface JAX/MJX do adaptador. Uma atualização que mude essa interface altera a base mesmo com configuração de treino idêntica.

O trabalho de outubro também reconstrói valores predefinidos de arrays capturados com cópia explícita, para que JAX eager respeite a malha ativa. ARS usa o avaliador comum quando a normalização das observações está desativada, evitando estatísticas ausentes nesse modo. Posicionamento e normalização tornam-se contratos verificáveis. [Correção de dispositivos e ARS][s3]

## Uma população não é uma política

A [correção de 28 de outubro][s4] distingue coleções de resultados individuais. `pop_episode_returns` e `pop_episode_lengths` preservam o eixo populacional; resultados de política individual ou central usam nomes singulares quando apropriado. O aprendiz único do ERL-EDA recebe métricas escalares; coleções mantêm arrays.

Fazer outra média de um valor já agregado ou tratar um vetor populacional como escalar pode criar gráficos convincentes, mas enganosos. Antes de reutilizar análises, verifique nomes e formatos na fronteira dos logs. A migração precisa preservar as reduções pretendidas sobre população, episódios e aprendizes.

## Reproduzir um caso pequeno antes de continuar

O código exige Python 3.12 ou posterior e JAX/jaxlib 0.10.0 ou posterior. A distribuição é `evorl-jax`, mas o import continua `evorl`. Para scripts e configurações, use a tag e suas instruções. O exemplo básico é `python scripts/train.py agent=ppo env=brax/ant`.

Verifique gradientes, posicionamento e formatos numa execução pequena antes de comparar curvas. Aim vem no registo predefinido; os recorders opcionais precisam dos próprios SDKs. Guarde ambiente, semente e orçamento. A [introdução ao EvoRL][related] explica aprendizagem e evolução; essas mudanças tornam as hipóteses de cada experimento mais verificáveis.

[s1]: https://github.com/EMI-Group/evorl/blob/v0.2.0/README.md
[s2]: https://github.com/EMI-Group/evorl/commit/5c889cad465ca88e3ec0d9112b0ec55835eb68fc
[s3]: https://github.com/EMI-Group/evorl/commit/a1ca25e9b232fdb6a6160c12cfc8bd702477096b
[s4]: https://github.com/EMI-Group/evorl/commit/992a554eb164a87ef9249592711cebd319ad9ebc
[related]: /pt/news/evorl
