---
title: "Genesis entre repositórios: um objetivo, históricos independentes"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 acrescenta árvores de trabalho persistentes para repositórios associados modificáveis, explicitando execução, revisão e integração."
---

Uma funcionalidade pode abranger um serviço API, uma aplicação cliente e uma biblioteca compartilhada. O objetivo é comum, mas os repositórios Git podem ser distintos. Genesis 0.13.4, publicado em 26 de setembro de 2026, acrescenta árvores de trabalho persistentes para repositórios associados modificáveis, clarificando o local de execução.

## Do acesso ao trabalho isolado

A versão 0.11.4 introduz leitura e escrita em repositórios adicionais, revisão individual e restrições para os de leitura apenas. Com 0.13.4, os agentes trabalham em uma árvore persistente por repositório associado modificável, sem deslocar o seu HEAD principal ou perturbar a árvore de trabalho primária.

Os caminhos são resolvidos em relação a essa árvore. O contexto inicial indica a localização e a delegação entre repositórios usa-a como base. O local das alterações fica explícito mesmo com estruturas de pastas diferentes ou outras atividades de desenvolvimento.

## A integração é decidida por repositório

A versão 0.13.0 introduz cartões de revisão com fusão, rejeição, verificações e estados separados. Um atalho de fusão conjunta aceita os repositórios pendentes mantendo os resultados individuais visíveis. Corrige também revisões de tarefas que alteram apenas repositórios associados.

Em uma alteração de API, serviço, cliente e biblioteca podem ser revistos nos seus próprios históricos. Interfaces compatíveis e testes adequados continuam necessários: uma fusão entre repositórios não demonstra uma transação atômica nem compatibilidade automática.

## Uma base para sistemas maiores

O marco diz respeito à organização do trabalho tanto quanto à sua geração. Genesis coordena contribuições entre repositórios, preservando os pontos onde o usuário os inspeciona e aceita. Estende a evolução de software do EvoX a sistemas com partes mantidas independentemente, cujas versões aceitas são a base do desenvolvimento seguinte.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.11.4) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0) · [3](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
