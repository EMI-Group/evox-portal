---
title: "EvoNAS: antes de procurar uma rede melhor, tornar a comparação útil"
pubDate: 2026-11-14
summary: "Compartilhar pesos reduz o custo da pesquisa, mas pode alterar a classificação. EvoNAS liga treinamento e avaliação para orientar a próxima escolha."
---

Uma rede pode vencer durante a pesquisa e decepcionar após um treinamento independente. Na pesquisa evolutiva, cada geração usa avaliações anteriores para decidir o que conservar. Uma classificação distorcida pode levar uma pesquisa mais longa na direção errada. EvoNAS liga a aprendizagem da super-rede, a avaliação dos candidatos e o compromisso entre precisão e custo de cálculo.

![Ilustração conceitual: molduras em forma de rede observam a mesma rua e um contorno geométrico fino.](./evonas-editorial.webp)

## A pesquisa depende de avaliações confiáveis

Treinar cada candidato separadamente seria dispendioso. Compartilhar pesos evita começar do zero, mas também liga as aprendizagens. A estrutura mais favorecida pelos parâmetros compartilhados pode não ser a melhor após treinamento independente. Como a seleção define a geração seguinte, uma comparação distorcida pode desviar toda a pesquisa.

Uma super-rede compartilha parâmetros entre arquiteturas. Contudo, o desempenho com pesos herdados pode não refletir o potencial de cada candidato. O trabalho submetido em 20 de março de 2026 propõe uma super-rede híbrida VSS–ViT e CA-DDKD, que alinha representações nos domínios espacial e de frequência. PST alarga progressivamente o treinamento de configurações maiores a variantes compactas.

Reconhecer um edifício é diferente de localizar os seus contornos com precisão. Na profundidade e na segmentação, um corrimão fino, uma esquina ou o limite com o fundo podem ser importantes. CA-DDKD usa restrições da transformada discreta do cosseno para ajudar a preservar esses detalhes geométricos. A posição espacial e as variações que definem contornos e texturas complementam-se.

A estratégia de treinamento torna-se parte do método de pesquisa. Melhores representações compartilhadas dão uma base mais útil à comparação; aumentar apenas o número de candidatos não corrige uma classificação pouco confiável.

## Comparar opções segundo as restrições

Na estimativa de profundidade, pode aceitar-se um compromisso de precisão para cumprir um limite de latência. A pesquisa multiobjetivo oferece várias alternativas. DMMPE avalia vários modelos com um conjunto de recursos GPU e escalonamento assíncrono. A escolha depende do hardware, dos dados e do protocolo de medição.

Os candidatos devem ser medidos em condições de hardware e execução comparáveis. A configuração de pesquisa define o que parece promissor; o novo treinamento revela o que a estrutura escolhida pode aprender. Ligar estas etapas permite regressar ao problema de classificação que motiva EvoNAS.

## Antes de iniciar uma experimento

O percurso inclui pré-treinamento em ImageNet-1k, ajuste PST nos dados de destino, pesquisa evolutiva e novo treinamento da sub-rede escolhida. O guia abrange KITTI e NYU Depth v2 para profundidade, COCO para detecção e ADE20K para segmentação. Acompanhar um conjunto de dados através dos caminhos, configurações e objetivos ajuda a relacionar a pontuação de pesquisa com o modelo final.

O README continua a indicar que a download da super-rede pré-treinada necessária está por disponibilizar. Antes de começar, confirme a disponibilidade dos pesos e faça corresponder o wheel Mamba SSM ao ambiente Python, CUDA e PyTorch documentado.

[Código e instalação](https://github.com/EMI-Group/evonas/blob/e4f6866e8092545b2b9b28f3fe0162e038e34f3c/README.md) · [Artigo científico](https://arxiv.org/abs/2603.19563v1)

[EvoX](/pt-br/libs)
