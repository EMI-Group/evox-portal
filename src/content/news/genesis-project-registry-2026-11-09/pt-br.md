---
title: "Genesis em desenvolvimento: um registro persistente de projetos"
pubDate: 2026-11-10
summary: "As mudanças de main de 9 de novembro substituem projetos recentes por um registro em banco de dados e separam escolhas locais e remotas."
---

Abrir um repositório em outra máquina exige distingui-lo dos projetos locais. As mudanças integradas em Genesis main em 9 de novembro de 2026 conectam Projects e a paleta a um registro VCT em banco de dados, substituindo a lista recente. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

![Pastas de projeto em armários por host com etiquetas correspondentes](./project-host-registry.webp)

## Um lugar registrado para cada projeto

Abrir ou criar registra a montagem pela interface que identifica o nó. A paleta pesquisa caminhos registrados e o projeto ativo pode mostrar o ponto de montagem. As listas remotas vêm do host escolhido, sem entradas locais durante a conexão. [main](https://github.com/EMI-Group/genesis/commit/9d5df6d4be631f591d5949f744fa7011218eb64d)

## Verificar o host antes de continuar

Nas compilações de desenvolvimento com essas mudanças, reabra um repositório local e remoto e verifique identidade e sugestões de caminho. O registro serve à navegação; o código segue a validação habitual do projeto.

[Genesis entre repositórios: um objetivo, históricos independentes](/pt-br/news/genesis-multi-repository)
