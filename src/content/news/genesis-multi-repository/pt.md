---
title: "Genesis entre repositórios: um objetivo, históricos independentes"
pubDate: 2026-09-26
summary: "Genesis 0.13.4 acrescenta árvores de trabalho persistentes para repositórios associados modificáveis, explicitando execução, revisão e integração."
updatedDate: 2026-11-08
---

Uma funcionalidade pode abranger um serviço API, uma aplicação cliente e uma biblioteca partilhada. O objetivo é comum, mas os repositórios Git podem ser distintos. Genesis 0.13.4, publicado a 26 de setembro de 2026, acrescenta árvores de trabalho persistentes para repositórios associados modificáveis, clarificando o local de execução.

![Históricos de repositórios separados ligados a um projeto](./companion-worktrees.webp)

## Do acesso ao trabalho isolado

A versão 0.11.4 introduz leitura e escrita em repositórios adicionais, revisão individual e restrições para os de leitura apenas. Com 0.13.4, os agentes trabalham numa árvore persistente por repositório associado modificável, sem deslocar o seu HEAD principal ou perturbar a árvore de trabalho primária. [v0.11.4](https://github.com/EMI-Group/genesis/blob/v0.11.4/CHANGELOG.md)

Os caminhos são resolvidos em relação a essa árvore. O contexto inicial indica a localização e a delegação entre repositórios usa-a como base. O local das alterações fica explícito mesmo com estruturas de pastas diferentes ou outras atividades de desenvolvimento. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## A integração é decidida por repositório

A versão 0.13.0 introduz cartões de revisão com fusão, rejeição, verificações e estados separados. Um atalho de fusão conjunta aceita os repositórios pendentes mantendo os resultados individuais visíveis. Corrige também revisões de tarefas que alteram apenas repositórios associados. [v0.13.0](https://github.com/EMI-Group/genesis/releases/tag/v0.13.0)

Numa alteração de API, reveja serviço, cliente e biblioteca partilhada nas respetivas histórias. Acorde versões de interface e ordem de integração, depois teste o resultado conjunto.

## Preparar a revisão entre repositórios

Antes de delegar, identifique o worktree gravável de cada repositório. Depois use o cartão de revisão para inspecionar alterações, verificações de integração e estado de resolução. O trabalho transversal torna-se um conjunto de decisões concretas. O [histórico de desenvolvimento](/pt/news/genesis-development-history) permite seguir os commits.
