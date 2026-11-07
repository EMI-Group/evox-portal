---
title: "EvoX VirtualES: pesquisar sem armazenar todas as redes candidatas"
pubDate: 2026-07-08
summary: "VirtualES e VirtualProblem geram perturbações a partir de sementes quando necessário, reduzindo o armazenamento dos parâmetros da população."
---

As alterações do EvoX de 7–8 de julho de 2026 introduzem um percurso de população virtual para neuroevolução. Uma população convencional pode exigir um vetor de parâmetros por rede candidata. VirtualES mantém um centro compartilhado e uma semente aleatória por indivíduo, reconstruindo perturbações gaussianas quando necessário. Aborda uma questão concreta: quanta diversidade de candidatos pode ser representada com um determinado orçamento de memória?

## Uma população compacta e uma avaliação explícita

Para P candidatos com D parâmetros, armazenar todos os parâmetros exige espaço proporcional a P × D. A representação por centro e sementes necessita de aproximadamente D + P elementos. A comparação diz respeito aos parâmetros: ativações, valores de aptidão, estado do otimizador e buffers de avaliação também ocupam memória.

VirtualES passa `(center, seeds, sigma)` ao fluxo de trabalho. VirtualProblem avalia os candidatos camada a camada. Uma operação Triton fundida combina o cálculo linear de base com perturbações de pesos e bias geradas pelas sementes, evitando o tensor completo das redes perturbadas. A aptidão orienta depois a atualização do centro para a geração seguinte.

## Escopo da implementação

As perturbações gaussianas completas substituem a anterior formulação LoRA de baixo posto. VirtualProblem oferece suporte a redes `nn.Sequential` com camadas lineares e funções de ativação especificadas. Não é um avaliador universal de arquiteturas arbitrárias; a interface documentada não oferece suporte a o wrapper HPO. O percurso virtual também ignora a avaliação distribuída e as transformações das soluções.

## Por que importa a representação

O contributo é uma ligação diferente entre busca por populações e execução. Permite investigar compromissos de memória sem armazenar previamente todos os pesos candidatos. O pico de memória e o taxa de processamento dependem da arquitetura, população, lotes e hardware; estas alterações não demonstram uma aceleração universal. Para o EvoX, representam um passo concreto para uma exploração evolutiva computacionalmente mais flexível.

[1](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6) · [2](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921) · [3](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697) · [4](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef)
