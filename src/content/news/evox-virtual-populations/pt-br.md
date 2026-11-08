---
title: "EvoX VirtualES: mais candidatos, menos pesos armazenados"
pubDate: 2026-07-08
updatedDate: 2026-11-08
summary: "Um centro compartilhado e sementes por candidato permitem ao VirtualES reconstruir perturbações sob demanda e repensar o orçamento de memória da busca."
---

Uma população maior de redes neurais normalmente exige mais cópias dos pesos. As mudanças do EvoX de 7–8 de julho de 2026 seguem outro caminho: o VirtualES guarda um centro de parâmetros compartilhado e uma semente aleatória por candidato, reconstruindo as diferenças durante a avaliação. Quanta diversidade de busca cabe antes de os parâmetros esgotarem a memória?

![Parâmetros compartilhados e sementes formam candidatos virtuais](./virtuales-shared-center.webp)

*Ilustração conceitual: um centro compartilhado, vários candidatos reconstruíveis.*

## Guardar a receita de um candidato

Com P candidatos de D parâmetros, o armazenamento explícito cresce como P × D. A representação com centro e sementes utiliza aproximadamente D + P elementos. A comparação diz respeito aos parâmetros da população; ativações, estado do otimizador e buffers de avaliação também consomem memória. [Implementação do VirtualES](https://github.com/EMI-Group/evox/commit/d8c0964fd71c3d6171ae83bd0c1483f742b310a6)

O VirtualES envia `(center, seeds, sigma)` ao fluxo de trabalho. O VirtualProblem avalia as camadas com uma operação Triton fundida que combina o cálculo linear de base e as perturbações dos pesos e vieses geradas pelas sementes. A aptidão orienta a atualização do centro. As perturbações gaussianas completas substituem a formulação LoRA anterior de baixo posto. [Implementação da avaliação](https://github.com/EMI-Group/evox/commit/c6bde1e47df9617cd934053c7f6c69e40068e921)

## Manter o retorno de cada candidato distinto

O ponto de partida compatível é uma rede `nn.Sequential` com camadas lineares e ativações documentadas. Defina a função de perda como `reduction='none'` para o VirtualProblem agregar as perdas de cada candidato separadamente. Uma perda escalar seria estendida a toda a população, eliminando essa distinção. Essa pequena escolha de interface afeta a busca.

O caminho virtual omite a avaliação distribuída e as transformações de soluções; o VirtualProblem também exclui o wrapper HPO. Confira esses limites antes de adaptar um experimento. [Integração no fluxo](https://github.com/EMI-Group/evox/commit/f4f2fd1067f184c000b7f1a94ff0ee6395c6e697)

## Medir as possibilidades da representação

Comece com uma rede compatível e varie a população, registrando pico de memória, tempo de avaliação e aptidão com um orçamento de avaliação fixo. Assim é possível distinguir a economia de armazenamento do custo de regenerar ruído e processar ativações. As mudanças de julho incluem uma [correção de compilação Triton](https://github.com/EMI-Group/evox/commit/97971618740d35845740320e7db973d3a3f671ef) para a função auxiliar de ruído.

O [guia de início](/pt-br/news/evox-quickstart) apresenta a estrutura dos experimentos EvoX. O VirtualES permite testar uma questão concreta: como seu experimento muda com uma população maior quando guardar todos os pesos deixa de ser um requisito?
