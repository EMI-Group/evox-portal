---
title: "EvoMO: manter a viabilidade junto de cada candidato"
pubDate: 2026-10-30
summary: "Seleção com restrições, populações ímpares consistentes e um caminho OSP-NSDE mais eficiente tornam os experimentos multiobjetivo mais controláveis."
---

Um bom valor objetivo só é útil quando o candidato também respeita as restrições. Em 30 de outubro de 2026, o EvoMO integrou a [PR #48][s1] em main, ampliando o tratamento de restrições e corrigindo o gestão das populações. A atualização conecta três questões: quais soluções preservar, como manter seus estados alinhados e quanto custa selecioná-las.

![Caminhos candidatos atravessam uma barreira por uma passagem selecionada](./cover.webp)

*Ilustração conceptual: a viabilidade acompanha o candidato durante a seleção.*

## Preservar a viabilidade em todo o processo

Um problema restrito pode devolver `(fitness, cv)`, associando objetivos e violações. A implementação transporta essas informações por inicialização, avaliações exploratórias, cruzamento, arquivos e atualização dos sobreviventes. Utilitários comuns tratam violação total positiva, empates e diferentes formatos de restrição, mantendo os índices de decisões, aptidão e estado de restrições alinhados.

Quando dois candidatos trocam de posição, a viabilidade precisa acompanhá-los. Num projeto que equilibra desempenho e recursos sob um limite rígido, ordenar apenas os objetivos pode preservar uma solução atraente, mas inviável. O estado das restrições permite que cada algoritmo aplique sua regra documentada, que continua específica do método.

## Uma população ímpar também deve ser válida

A mudança corrige incompatibilidades de formato na primeira geração para tamanhos solicitados como 51 em oito algoritmos, incluindo SparseEA, SparseEA2, DMMOEA e OSP_NSDE. Pareamento e quantidade real de descendentes ficam alinhados com máscaras, aptidão e restrições. Isso importa quando o tamanho vem do orçamento experimental, e não de um número par conveniente.

Métodos esparsos e dinâmicos também recebem correções de seus fluxos de referência. DMMOEA detecta mudanças ambientais reavaliando uma amostra e atualiza os caches de aptidão e restrições. A família SparseEA mantém decisões e máscaras de esparsidade juntas durante variação e seleção. Isso determina a busca realmente executada, além de simplesmente concluir o programa.

## Seleção mais rápida com limites explícitos

OSP-NSDE ordena as distâncias dos vizinhos uma vez e as atualiza após exclusões. Kernels Triton opcionais transferem o truncamento compatível da frente limite para CUDA. O caminho automático cobre dispositivos suportados, float32/float64 e populações solicitadas de até 128; os demais casos usam PyTorch. A ordenação não dominada permanece em PyTorch.

Para compilar, inicialize primeiro e use `torch.compile(workflow.step, fullgraph=False)`. Previsão, busca local e modelos de mistura ainda incluem partes eager. As medições locais em RTX 5060 Ti da PR usam sincronização e orçamentos fixos; os resultados completos mostram que compilar nem sempre supera o eager otimizado. Meça a carga completa para escolher.

## Verificar a busca antes de ampliar

São adicionados MaOEAHAP, NRVMOEA, HEA e GCNMOEA. Os três primeiros rejeitam explicitamente tuplas de restrições. GCNMOEA usa violações na substituição da vizinhança, mas outros componentes permanecem baseados em objetivos. Leia esses limites antes de tratar os métodos como intercambiáveis.

Num experimento existente, fixe o [código integrado][s2], a semente e o orçamento. Após um passo, compare objetivos e restrições armazenados com uma nova avaliação. Inclua população ímpar e caso restrito, registando viabilidade, qualidade e tempo separadamente. A [visão da versão EvoMO][related] oferece a base publicada; esta atualização de main acrescenta o trabalho posterior de seleção e restrições.

[s1]: https://github.com/EMI-Group/evomo/pull/48
[s2]: https://github.com/EMI-Group/evomo/tree/2aa4b3d059090ac9561b18b439002265e4015ca4
[related]: /pt/releases/evomo-0-3-1
