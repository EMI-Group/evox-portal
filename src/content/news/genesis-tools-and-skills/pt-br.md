---
title: "Ferramentas e competências Genesis: integrar os métodos do projeto"
pubDate: 2026-09-26
summary: "As ferramentas personalizadas de Genesis 0.13.1 e as competências alteradas nas árvores de trabalho de 0.13.4 ligam operações próprias a orientação reutilizável."
updatedDate: 2026-11-08
---

Os projetos acumulam código e formas de o construir, verificar e alterar. Genesis 0.13.4, publicado em 26 de setembro de 2026, coloca alterações das ferramentas de competências na árvore de trabalho e torna-as passíveis de revisão em Git. Com as ferramentas personalizadas de 0.13.1, de 21 de setembro, oferece duas vias distintas para integrar métodos do projeto.

![Ferramentas do projeto e cartões de instruções reutilizáveis](./project-tools-guidance.webp)

## Expor operações através de ferramentas próprias

A versão 0.13.1 carrega ferramentas definidas pelo usuário do diretório tools da configuração. Surgem nas configurações, podem integrar listas permitidas de agentes personalizados e passam pelo dispatcher central. O projeto pode oferecer operações explícitas além de uma shell geral. [v0.13.1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1)

Por exemplo, uma equipe poderia envolver o seu verificador existente em um contrato definido de entrada e saída.

A versão 0.13.4 também permite combinar texto com imagens ou áudio nos resultados das ferramentas. Uma operação pode devolver um artefato que o agente examine junto com o relatório escrito. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

## Colocar competências onde se revê o código

A versão 0.13.4 lê e escreve competências na árvore de trabalho do agente e permite registrar alterações com uma opção de commit. A orientação criada pelo agente pode ser inspecionada no seu ramo. Também corrige a descoberta e remoção de competências. [v0.13.4](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)

As ferramentas definem operações invocáveis; as skills explicam quando usá-las e como interpretar resultados. Um verificador de projeto e seu guia unem uma operação executável a instruções que podem ser revisadas.

## Começar por uma operação do projeto

Escolha uma verificação repetível. Defina entradas, saídas e permissões da ferramenta personalizada e escreva uma skill com o momento de uso. Antes de reutilizar, revise as diferenças da skill no branch do agente e execute a ferramenta. O [histórico de desenvolvimento](/pt-br/news/genesis-development-history) permite seguir revisões.
