---
title: "EvoGP: calcular estatísticas populacionais com tensores"
pubDate: 2026-10-16
updatedDate: 2026-11-17
summary: "Uma correção específica substitui extremos de aptidão calculados em Python por reduções torch no pipeline padrão."
---

O relatório de progresso não deveria ser a parte cara de uma geração. A [mudança de 16 de outubro de 2026][s1] troca máximo e mínimo Python sobre o tensor de aptidão por reduções tensoriais. Ela aborda o custo dos relatórios padrão preservando os extremos pretendidos.

![Uma ponte de medição atravessa árvores de programas para identificar seus extremos em conjunto](./reporting-reduction.webp)

*Ilustração conceitual: calcular os extremos coletivamente em vez de tratar cada candidato isoladamente.*

## Manter estatísticas em operações tensoriais

Máximo e mínimo Python sobre o tensor tornam-se `torch.max` e `torch.min`. Percorrer grandes tensores do dispositivo em Python cria trabalho na fronteira da linguagem que uma redução resolve dentro do framework numérico. Isso importa principalmente quando avaliar aptidão é barato.

Na regressão simbólica, expressões podem ser avaliadas em paralelo enquanto mostrar extremos continua caro. A correção remove esse desequilíbrio sem alterar a estatística. A PR relata grande melhora com um milhão de indivíduos, mas não oferece protocolo completo; a ação útil é medir a geração inteira, incluindo relatórios.

Compare o tempo completo da geração com e sem relatórios mantendo entradas, semente e população. Confira os extremos contra o tensor de aptidão antes de aumentar a carga. A [introdução ao EvoGP][related] explica as árvores tensorizadas; a [atualização AMD ROCm][rocm] independente cobre hardware e compilação. Uma redução mais rápida ou um backend compatível não determinam sozinhos o desempenho da busca completa.

[s1]: https://github.com/EMI-Group/evogp/pull/14
[related]: /pt-br/news/evogp
[rocm]: /pt-br/news/evogp-amd-rocm
