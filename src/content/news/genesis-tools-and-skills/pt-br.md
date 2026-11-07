---
title: "Ferramentas e competências Genesis: integrar os métodos do projeto"
pubDate: 2026-09-26
summary: "As ferramentas personalizadas de Genesis 0.13.1 e as competências alteradas nas árvores de trabalho de 0.13.4 ligam operações próprias a orientação reutilizável."
---

Os projetos acumulam código e formas de o construir, verificar e alterar. Genesis 0.13.4, publicado em 26 de setembro de 2026, coloca alterações das ferramentas de competências na árvore de trabalho e torna-as passíveis de revisão em Git. Com as ferramentas personalizadas de 0.13.1, de 21 de setembro, oferece duas vias distintas para integrar métodos do projeto.

## Expor operações através de ferramentas próprias

A versão 0.13.1 carrega ferramentas definidas pelo usuário do diretório tools da configuração. Surgem nas configurações, podem integrar listas permitidas de agentes personalizados e passam pelo dispatcher central. O projeto pode oferecer operações explícitas além de uma shell geral.

Por exemplo, uma equipe poderia envolver o seu verificador existente em um contrato definido de entrada e saída. É uma aplicação possível da extensão, não uma integração incluída. Implementação, permissões e significado dos resultados continuam a pertencer ao projeto.

## Colocar competências onde se revê o código

A versão 0.13.4 lê e escreve competências na árvore de trabalho do agente e permite registrar alterações com uma opção de commit. A orientação criada pelo agente pode ser inspecionada no seu ramo. Também corrige a descoberta e remoção de competências.

Ferramentas expõem operações invocáveis; competências contêm orientação reutilizável. São papéis complementares, mas distintos. Git torna a alteração visível e versionada, sem provar automaticamente a sua correção ou utilidade.

## Ampliar capacidades mantendo a revisão

Estas extensões aproximam a revisão dos métodos gerados da revisão do código. No ecossistema EvoX, a melhoria pode abranger a implementação e as instruções para a desenvolver. Aceitação e validação continuam necessárias para transformar propostas em uma base confiável para o trabalho futuro.

[1](https://github.com/EMI-Group/genesis/releases/tag/v0.13.1) · [2](https://github.com/EMI-Group/genesis/releases/tag/v0.13.4)
