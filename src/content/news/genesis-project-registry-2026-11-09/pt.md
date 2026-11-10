---
title: "Genesis em desenvolvimento: um registo persistente de projetos"
pubDate: 2026-11-10
summary: "As alterações de main de 9 de novembro substituem projetos recentes por um registo em base de dados e separam escolhas locais e remotas."
---

Abrir um repositório noutra máquina exige distingui-lo dos projetos locais. As alterações integradas em Genesis main em 9 de novembro de 2026 ligam Projects e a paleta a um registo VCT em base de dados, substituindo a lista recente. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Pastas de projeto em armários por anfitrião com etiquetas correspondentes](./project-host-registry.webp)

## Um lugar registado para cada projeto

Abrir ou criar regista a montagem através da interface que identifica o nó. A paleta pesquisa caminhos registados e o projeto ativo pode mostrar o ponto de montagem. As listas remotas vêm do anfitrião escolhido, sem entradas locais durante a ligação. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Verificar o anfitrião antes de continuar

Nas compilações de desenvolvimento com estas alterações, reabra um repositório local e remoto e verifique identidade e sugestões de caminho. O registo serve à navegação; o código segue a validação habitual do projeto.

[Genesis entre repositórios: um objetivo, históricos independentes](/pt/news/genesis-multi-repository)
