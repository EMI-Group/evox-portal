---
title: "EvoX 1.4.1: preservar a semântica na pesquisa paralela"
pubDate: 2026-10-30
summary: "As correções de SHADE, evolução diferencial e CMA-ES mostram que uma infraestrutura evolutiva fiável exige eficiência e fidelidade aos algoritmos."
---

EvoX 1.4.1, publicado a 30 de outubro de 2026, corrige comportamentos algorítmicos e de execução. Quando milhares de candidatos são avaliados em conjunto, um pequeno erro pode alterar sistematicamente a pesquisa. A infraestrutura deve preservar o algoritmo pretendido e executá-lo com eficiência.

## O programa pode funcionar e pesquisar de outra forma

Em SHADE, a memória de sucessos de F e CR não se adaptava. As melhorias eram calculadas após substituir a aptidão, e a aritmética com arrays preenchidos com NaN contaminava os valores escolhidos. A correção calcula as melhorias antes da atualização e seleciona os sucessos com `torch.where`.

O operador partilhado de cruzamento binomial comparava amostras normais com uma probabilidade de cruzamento. Agora utiliza amostragem uniforme, coerente com essa probabilidade. Outras correções inicializam CoDE, SaDE e SHADE uniformemente dentro dos limites. Muda o que é gerado, não apenas a ausência de falhas.

## Definições matemáticas e restrições de execução

As correções CMA-ES abrangem a atualização de covariância de posto um, a constante de acumulação e restrições de aliasing em `torch.cond`. Esta última reativa também um teste CMA-ES desativado. Fórmulas e condições do framework exigem verificações distintas.

A versão trata ainda da inicialização e subespaços de estratégias evolutivas, seleção por torneio, transferências de dispositivo PSO e hipervolume. Estas correções documentadas não demonstram superioridade universal em todos os benchmarks.

## A fiabilidade faz parte da infraestrutura

Ao comparar experiências, versão e semente devem acompanhar objetivo, população e orçamento de avaliação. Resultados afetados podem exigir nova avaliação. Para o EvoX, testar a semântica deve acompanhar tensorização e aceleração, para que o retorno experimental corresponda à pesquisa que se pretendia executar.

[1](https://github.com/EMI-Group/evox/releases/tag/v1.4.1) · [2](https://github.com/EMI-Group/evox/commit/c92918a906eaf075cf885461acc031ee0eb223b3) · [3](https://github.com/EMI-Group/evox/commit/5e68f81f8b6d6ea0638a44a337efe2183ba47716) · [4](https://github.com/EMI-Group/evox/commit/bcde7d2a171c34722c37a3559813136f702640cb)
