---
title: "EvoMO v0.3.1: mais ferramentas para experimentos multiobjetivo"
pubDate: 2026-10-08
summary: "A série v0.3 amplia algoritmos tensorizados, corrige seleção e benchmarks e documenta comparações reproduzíveis."
---

A otimização multiobjetivo precisa de mais que avaliação rápida: seleção que preserve compromissos, fórmulas corretas e estado recuperável. O [EvoMO v0.3.1][s1], publicado em 8 de outubro de 2026 no horário de Pequim, acrescenta documentação. As principais ampliações e correções chegaram com [v0.3.0 em 24 de setembro][s2].

![Uma coleção de instrumentos de busca sobre objetivos concorrentes](./cover.webp)

*Ilustração conceptual: algoritmos diferentes exploram compromissos úteis diferentes.*

## Mais algoritmos numa base tensorial comum

v0.3.0 adiciona 48 algoritmos multiobjetivo tensorizados. A base partilhada facilita comparar no mesmo fluxo de avaliação, preservando regras diferentes de seleção, variação e atualização de estado.

Para objetivos concorrentes, é possível fixar problema, limites, população e orçamento mudando apenas o algoritmo. O valor está em acessar outros comportamentos de busca. A quantidade de métodos não demonstra melhores compromissos para uma tarefa específica.

## Correções afetam a própria comparação

A versão corrige atualização e seleção em vários métodos. A ordenação não dominada termina depois da frente limite completa necessária; a distância de crowding trata objetivos constantes, populações pequenas, máscaras e dispositivos. PyTorch continua predefinido; Triton é experimental e selecionado explicitamente. [Mudanças de seleção][s3]

ZDT1–4 e ZDT6 recebem correções por linha, incluindo o cálculo dependente de dimensão de ZDT6. O hipervolume Monte Carlo é corrigido para minimização, referências, entradas vazias e dispositivos de amostragem. Se um estudo utilizava essas rotas, preserve os resultados antigos e repita comparações controladas sem misturar definições.

## Conferir restrições e simulação separadamente

A série parte dos 86 benchmarks restritos, NSGA-II com restrições e `UnifiedWorkflow` de v0.2.2. Acrescenta registo tardio de buffers, restauração de checkpoints e recursos de frentes Pareto nas distribuições. [Base restrita][s4]

MoRobtrol adiciona Playground/MJX, objetivos específicos e visualização, melhorando normalização e checkpoints. Em robótica, registe simulador e objetivos tão cuidadosamente quanto o otimizador: uma frente melhor pode refletir uma tarefa ou métrica diferente. [Simulação e integração][s5]

## Atualizar com um pequeno experimento de referência

O [guia versionado][s6] instala EvoX primeiro. Use `pip install evox` e depois `pip install evomo==0.3.1`, registando dependências resolvidas. A instalação por código pode fixar v0.3.1. Esse patch acrescenta documentação; v0.3.0 descreve as funções.

Antes de benchmarks grandes, verifique um objetivo conhecido, uma seleção pequena e a restauração do estado. Em problemas restritos, verifique viabilidade e qualidade; para hipervolume, preserve referência e amostragem. A [visão multiobjetivo GPU][related] explica a tensorização; v0.3 oferece uma base experimental mais ampla e definida.

[s1]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.1
[s2]: https://github.com/EMI-Group/evomo/releases/tag/v0.3.0
[s3]: https://github.com/EMI-Group/evomo/pull/38
[s4]: https://github.com/EMI-Group/evomo/pull/34
[s5]: https://github.com/EMI-Group/evomo/pull/39
[s6]: https://github.com/EMI-Group/evomo/blob/v0.3.1/README.md
[related]: /pt/news/gpu-accelerated-emo
